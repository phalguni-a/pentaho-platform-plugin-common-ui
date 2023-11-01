/*
 * This program is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License, version 2.1 as published by the Free Software
 * Foundation.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, you can obtain a copy at http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * or from the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * Copyright 2016 - 2019 Hitachi Vantara. All rights reserved.
 */
define([
  "pentaho/module!_",
  "pentaho/i18n!./i18n/model",
  "../Model",
  "./mixins/ScaleColorDiscrete",
  "./types/SliceOrder",
  "./types/LabelsOption",
], function (module, bundle, BaseModel, ScaleColorDiscreteModel, SliceOrder, LabelsOption) {
  "use strict";

  return BaseModel.extend({
    $type: {
      id: module.id,
      mixins: [ScaleColorDiscreteModel],
      category: "funnelchart",
      label: "Funnel",
      props: [
        // VISUAL_ROLE
        {
          name: "rows",
          base: "pentaho/visual/role/Property",
          isVisualKey: true,
          modes: {dataType: "list"},
          fields: {isRequired: true},
          ordinal: 5
        },
        {
          name: "measures",
          base: "pentaho/visual/role/Property",
          modes: {dataType: "number"},
          fields: {isRequired: true},
          ordinal: 7
        },
        //End VISUAL_ROLE
        {
          name: "order",
          valueType: SliceOrder,
          domain: ["bySizeDescending", "bySizeAscending"],
          isRequired: true,
          defaultValue: "bySizeDescending"
        },
        {
          name: "labelsOption",
          valueType: LabelsOption,
          domain: ["inside","insideRight","insideLeft","left","right","leftTop","leftBottom","rightTop","rightBottom"],
          isRequired: true,
          defaultValue: "inside"

        }
      ]
    }
  })
    .localize({$type: bundle.structured.Funnel})
    .configure();
});