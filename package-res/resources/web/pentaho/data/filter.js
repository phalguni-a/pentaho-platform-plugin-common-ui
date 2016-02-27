/*!
 * Copyright 2010 - 2016 Pentaho Corporation.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
  "./filter/IsEqual",
  "./filter/IsIn",
  "./filter/And",
  "./filter/Or",
  "./filter/Not"
], function(IsEqual, IsIn, AndFilter, OrFilter, NotFilter) {
  "use strict";

  /**
   * @name RootFilter
   * @memberOf pentaho.data.filter
   * @class
   * @ignore
   *
   * @classdesc The `RootFilter` class implements a type of
   * `AbstractTreeFilter` {@link pentaho.data.filter.AbstractTreeFilter}. Specifically
   * the `RootFilter` extends the `RootFilter` {@link pentaho.data.filter.Or} filter.
   *
   * @description Creates a `RootFilter` filter that performs the union of a list of given `AbstractPropertyFilter`'s {@link pentaho.data.filter.AbstractPropertyFilter}.
   *
   * @param {Object} filterSpec The specification of a Filter.
   *
   */
  var RootFilter = OrFilter.extend("pentaho.data.RootFilter", /** @lends pentaho.data.RootFilter# */{
    constructor: function(filterSpec) {
      if(filterSpec)
        this.base(fromSpec(filterSpec));
      else
        this.base();
    }
  });

  /**
   * @name Filter
   * @memberOf pentaho.data
   * @class
   * @amd pentaho/data/Filter
   *
   * @classdesc The `Filter` class provides factory methods for building the following filters:
   *
   * * {@link pentaho.data.filter.IsEqual}
   * * {@link pentaho.data.filter.IsIn}
   * * {@link pentaho.data.filter.Or}
   * * {@link pentaho.data.filter.And}
   * * {@link pentaho.data.filter.Not}
   * * {@link pentaho.data.filter.RootFilter}
   *
   * @example
   * <caption> Use the available `Filter` factories.</caption>
   *
   * require(["pentaho/data/Table", "pentaho/data/Filter"], function(Table, Filter) {
   *   var data = new Table({
   *     model: [
   *       {name: "product", type: "string", label: "Product"},
   *       {name: "sales", type: "number", label: "Sales"},
   *       {name: "inStock", type: "boolean", label: "In Stock"}
   *     ],
   *     rows: [
   *       {c: [{v: "A"}, {v: 12000}, {v: true}]},
   *       {c: [{v: "B"}, {v: 6000}, {v: true}]},
   *       {c: [{v: "C"}, {v: 12000}, {v: false}]},
   *       {c: [{v: "D"}, {v: 1000}, {v: false}]},
   *       {c: [{v: "E"}, {v: 2000}, {v: false}]},
   *       {c: [{v: "F"}, {v: 3000}, {v: false}]},
   *       {c: [{v: "G"}, {v: 4000}, {v: false}]}
   *     ]
   *   });
   *
   *   var sales12k = new Filter.IsEqual("sales", [12000]);
   *   var productAB = new Filter.IsIn("product", ["A", "B"]);
   *   var notInProductABFilter = new Not(productAB);
   *   var andFilter = new Filter.And([sales12k, notInProductABFilter]);
   *   var filter = new Not(andFilter);
   *   var filteredData = filter.apply(data); //filteredData.getValue(0, 0) === "A", filteredData.getValue(1, 0) === "B", filteredData.getValue(2, 0) === "D", filteredData.getValue(3, 0) === "E", filteredData.getValue(4, 0) === "F", filteredData.getValue(5, 0) === "G"
   *
   *   //Or alternatively,
   *   var spec = {
   *      "$not": {
   *        "$and": [
   *          {"sales": 12000},
   *          {"$not": {"product": {"$in": ["A", "B"]}}}
   *        ]
   *      }
   *    };
   *
   *   var filterFromSpec = Filter.create(spec);
   *   var filteredDataFromSpec = filterFromSpec.apply(data); //filteredDataFromSpec.getValue(0, 0) === "A", filteredDataFromSpec.getValue(1, 0) === "B", filteredDataFromSpec.getValue(2, 0) === "D", filteredDataFromSpec.getValue(3, 0) === "E", filteredDataFromSpec.getValue(4, 0) === "F", filteredDataFromSpec.getValue(5, 0) === "G"
   * });
   *
   * @description The `Filter` class is a set of factories for building filters.
   *
   */
  return {
    // Leaf nodes
    IsEqual: IsEqual,
    IsIn: IsIn,
    // Non-leaf nodes
    Or: OrFilter,
    And: AndFilter,
    Not: NotFilter,
    //Root: RootFilter,

    /**
     * Create a filter from a spec
     * @param {Object} spec - Specification of a Filter
     * @returns {*}
     */
    create: function (spec) {
      return new RootFilter(spec);
    }
  };



  function fromSpec(filterSpec) {
    var registeredFilters = {
      "$and": AndFilter,
      "$or": OrFilter,
      "$not": NotFilter,
      "$eq": IsEqual,
      "$in": IsIn
    };

    var operator, property, value;
    for(var arg in filterSpec) {
      if(arg[0] === "$") {
        // And, Or, Not: {$and:[...]}, {$or:[...]}, {$not:[...]}
        operator = arg;
        if(operator === "$not")
          return new registeredFilters["$not"](fromSpec(filterSpec[operator]));
        return new registeredFilters[operator](filterSpec[operator].map(fromSpec));
      } else if(typeof filterSpec[arg] !== "object") {
        // shortcut: assume {property: value} is synonym for {property:{"$eq": value}}
        return new IsEqual(arg, filterSpec[arg]);
      } else {
        // IsEqual, IsIn: {property:{"$eq": value}}
        property = arg;
        for(operator in filterSpec[property]) {
          value = filterSpec[property][operator];
          return new registeredFilters[operator](property, value);
        }
      }

    }
  }

});