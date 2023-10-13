/*!
 * Copyright 2010 - 2019 Hitachi Vantara. All rights reserved.
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
  "pentaho/module!_",
  "./Pie"
], function (module, BaseView) {

  "use strict";

  // "pentaho/visual/models/Donut"

  return BaseView.extend(module.id, {
    _configureOptions: function () {
      this.base();

      var explodedSliceRadius = this.model.explodedSliceRadius;
      // var innerRadius = this.model.slice_innerRadiusEx;

      this.options.explodedSliceRadius = explodedSliceRadius;

      //TODO: This doesn't work

      // if (this.__extension == null) {
      //   this.__extension = {"slice_innerRadiusEx": innerRadius};
      //
      // } else if (this.__extension.slice_innerRadiusEx == null || this.__extension.slice_innerRadiusEx !== innerRadius) {
      //   this.__extension.slice_innerRadiusEx = innerRadius;
      // }

      console.log(this.__extension);
    },

    _configureProperties: function () {
      this.base();
    }

  })
    .implement(module.config);
});
