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
  "pentaho/visual/impl/View",
  "common-ui/echarts",
  "./_util",
  "pentaho/visual/color/util",
], function (module, BaseView, echarts, util, visualColorUtils) {

  "use strict";
  var font = util.defaultFont(null, 12);

  return BaseView.extend(module.id, {
    _cccClass: "FunnelChart",

    _roleToCccRole: {
      "measures": "measures"
    },

    configureLabel: function (option) {
      // var font = util.defaultFont(null, 12);

      var label = {
        show: true,
        position: this.model.labelsOption,
        formatter: '{b}: {d}%',
        backgroundColor: 'transparent',
        fontSize: font.substring(0, font.indexOf(' ')),
        fontFamily: font.substring(font.indexOf(' ') + 1)
      };

      option.series.forEach(function (row) {
        row.label = label;
      })
    },

    configureLegend: function (option, records) {
      var categories = [];
      var font = util.defaultFont(null, 14);

      records.forEach(function (record) {
          categories.push(record.name);
        }
      );

      var legend = {
        data: categories,
        type: 'scroll',
        textStyle: {
          fontSize: font.substring(0, font.indexOf(' ')),
          fontFamily: font.substring(font.indexOf(' ') + 1),
        }
      };
      option.legend = legend;
    },

    configureColors: function () {
      return this.model.palette.colors.toArray(function (color) {
        return color.value;
      });
    },

    _updateAll: function () {
      this.base();
      var myChart = echarts.init(this.__domContainer, null, {});

      var dataTable = this.model.data;
      if (dataTable.originalCrossTable) {
        dataTable = dataTable.originalCrossTable.toPlainTable({skipRowsWithAllNullMeasures: true});
      }

      var rowLength = dataTable.getNumberOfRows();
      var colLength = dataTable.getNumberOfColumns();
      var range = dataTable.getColumnRange(colLength - 1);

      var records = [];
// TODO: Change below logic
      for (var i = 0; i < rowLength; i++) {
        var tooltipFormatString = '';
        for (var j = 0; j < colLength; j++) {
          tooltipFormatString = tooltipFormatString + dataTable.getColumnLabel(j) + " : " + dataTable.getFormattedValue(i, j) + "<br />";
        }
        records.push({
          name: dataTable.getFormattedValue(i, colLength - 2),
          value: dataTable.getValue(i, colLength - 1),
          tooltip: {
            formatter: tooltipFormatString,
            fontSize: font.substring(0, font.indexOf(' ')),
            fontFamily: font.substring(font.indexOf(' ') + 1)
          },
        });
      }

      var option = {
        tooltip: {
          trigger: 'item'
        },
        color: this.configureColors(),
        series: [
          {
            type: 'funnel',
            left: '20%',
            right: '20%',
            top: '10%',
            bottom: '10%',
            width: 'auto',
            height: 'auto',
            min: range.min,
            max: range.max,
            minSize: 5,
            maxSize: '100%',
            sort: this.model.order === "bySizeDescending" ? "descending" : "ascending",
            legendHoverLink: true,
            gap: 4,
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: records
          }
        ]
      };

      this.configureLabel(option);
      this.configureLegend(option, records);

      // Draw the chart
      myChart.setOption(option);
    }

  }).implement(module.config);
});
