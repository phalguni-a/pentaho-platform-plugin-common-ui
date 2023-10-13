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
  "common-ui/echarts"
], function (module, BaseView, echart) {

  "use strict";

  return BaseView.extend(module.id, {
    _cccClass: "FunnelChart",

    _roleToCccRole: {
      "measures": "measures"
    },

    _configureOptions: function () {
      this.base();
      echart.init();

    },

    _update: function (event, action) {
      this.base;
      var myChart = echart.init(this.__domContainer, null, {});

      var option = {
        title: {
          text: 'Funnel'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
        },

        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
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
            data: [
              {value: 60, name: 'Visit'},
              {value: 40, name: 'Inquiry'},
              {value: 20, name: 'Order'},
              {value: 80, name: 'Click'},
              {value: 100, name: 'Show'}
            ]
          }
        ]
      };
      // Draw the chart
      myChart.setOption(option);


    }

  }).implement(module.config);
});
