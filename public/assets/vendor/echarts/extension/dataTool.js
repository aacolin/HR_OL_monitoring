
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file e***REMOVED***cept in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either e***REMOVED***press or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

(function (global, factory) {
    typeof e***REMOVED***ports === 'object' && typeof module !== 'undefined' ? factory(e***REMOVED***ports, require('echarts')) :
    typeof define === 'function' && define.amd ? define(['e***REMOVED***ports', 'echarts'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dataTool = {}, global.echarts));
}(this, (function (e***REMOVED***ports, echarts) { 'use strict';

    var BUILTIN_OBJECT = reduce([
        'Function',
        'RegE***REMOVED***p',
        'Date',
        'Error',
        'CanvasGradient',
        'CanvasPattern',
        'Image',
        'Canvas'
    ], function (obj, val) {
        obj['[object ' + val + ']'] = true;
        return obj;
    }, {});
    var TYPED_ARRAY = reduce([
        'Int8',
        'Uint8',
        'Uint8Clamped',
        'Int16',
        'Uint16',
        'Int32',
        'Uint32',
        'Float32',
        'Float64'
    ], function (obj, val) {
        obj['[object ' + val + 'Array]'] = true;
        return obj;
    }, {});
    var arrayProto = Array.prototype;
    var nativeSlice = arrayProto.slice;
    var nativeMap = arrayProto.map;
    var ctorFunction = function () { }.constructor;
    var protoFunction = ctorFunction ? ctorFunction.prototype : null;
    function map(arr, cb, conte***REMOVED***t) {
        if (!arr) {
            return [];
        }
        if (!cb) {
            return slice(arr);
        }
        if (arr.map && arr.map === nativeMap) {
            return arr.map(cb, conte***REMOVED***t);
        }
        else {
            var result = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                result.push(cb.call(conte***REMOVED***t, arr[i], i, arr));
            }
            return result;
        }
    }
    function reduce(arr, cb, memo, conte***REMOVED***t) {
        if (!(arr && cb)) {
            return;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            memo = cb.call(conte***REMOVED***t, memo, arr[i], i, arr);
        }
        return memo;
    }
    function bindPolyfill(func, conte***REMOVED***t) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return function () {
            return func.apply(conte***REMOVED***t, args.concat(nativeSlice.call(arguments)));
        };
    }
    var bind = (protoFunction && isFunction(protoFunction.bind))
        ? protoFunction.call.bind(protoFunction.bind)
        : bindPolyfill;
    function isFunction(value) {
        return typeof value === 'function';
    }
    function slice(arr) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return nativeSlice.apply(arr, args);
    }

    function parse(***REMOVED***ml) {
      var doc;
      if (typeof ***REMOVED***ml === 'string') {
        var parser = new DOMParser();
        doc = parser.parseFromString(***REMOVED***ml, 'te***REMOVED***t/***REMOVED***ml');
      } else {
        doc = ***REMOVED***ml;
      }
      if (!doc || doc.getElementsByTagName('parsererror').length) {
        return null;
      }
      var ge***REMOVED***fRoot = getChildByTagName(doc, 'ge***REMOVED***f');
      if (!ge***REMOVED***fRoot) {
        return null;
      }
      var graphRoot = getChildByTagName(ge***REMOVED***fRoot, 'graph');
      var attributes = parseAttributes(getChildByTagName(graphRoot, 'attributes'));
      var attributesMap = {};
      for (var i = 0; i < attributes.length; i++) {
        attributesMap[attributes[i].id] = attributes[i];
      }
      return {
        nodes: parseNodes(getChildByTagName(graphRoot, 'nodes'), attributesMap),
        links: parseEdges(getChildByTagName(graphRoot, 'edges'))
      };
    }
    function parseAttributes(parent) {
      return parent ? map(getChildrenByTagName(parent, 'attribute'), function (attribDom) {
        return {
          id: getAttr(attribDom, 'id'),
          title: getAttr(attribDom, 'title'),
          type: getAttr(attribDom, 'type')
        };
      }) : [];
    }
    function parseNodes(parent, attributesMap) {
      return parent ? map(getChildrenByTagName(parent, 'node'), function (nodeDom) {
        var id = getAttr(nodeDom, 'id');
        var label = getAttr(nodeDom, 'label');
        var node = {
          id: id,
          name: label,
          itemStyle: {
            normal: {}
          }
        };
        var vizSizeDom = getChildByTagName(nodeDom, 'viz:size');
        var vizPosDom = getChildByTagName(nodeDom, 'viz:position');
        var vizColorDom = getChildByTagName(nodeDom, 'viz:color');
        // let vizShapeDom = getChildByTagName(nodeDom, 'viz:shape');
        var attvaluesDom = getChildByTagName(nodeDom, 'attvalues');
        if (vizSizeDom) {
          node.symbolSize = parseFloat(getAttr(vizSizeDom, 'value'));
        }
        if (vizPosDom) {
          node.***REMOVED*** = parseFloat(getAttr(vizPosDom, '***REMOVED***'));
          node.y = parseFloat(getAttr(vizPosDom, 'y'));
          // z
        }

        if (vizColorDom) {
          node.itemStyle.normal.color = 'rgb(' + [getAttr(vizColorDom, 'r') | 0, getAttr(vizColorDom, 'g') | 0, getAttr(vizColorDom, 'b') | 0].join(',') + ')';
        }
        // if (vizShapeDom) {
        // node.shape = getAttr(vizShapeDom, 'shape');
        // }
        if (attvaluesDom) {
          var attvalueDomList = getChildrenByTagName(attvaluesDom, 'attvalue');
          node.attributes = {};
          for (var j = 0; j < attvalueDomList.length; j++) {
            var attvalueDom = attvalueDomList[j];
            var attId = getAttr(attvalueDom, 'for');
            var attValue = getAttr(attvalueDom, 'value');
            var attribute = attributesMap[attId];
            if (attribute) {
              switch (attribute.type) {
                case 'integer':
                case 'long':
                  attValue = parseInt(attValue, 10);
                  break;
                case 'float':
                case 'double':
                  attValue = parseFloat(attValue);
                  break;
                case 'boolean':
                  attValue = attValue.toLowerCase() === 'true';
                  break;
              }
              node.attributes[attId] = attValue;
            }
          }
        }
        return node;
      }) : [];
    }
    function parseEdges(parent) {
      return parent ? map(getChildrenByTagName(parent, 'edge'), function (edgeDom) {
        var id = getAttr(edgeDom, 'id');
        var label = getAttr(edgeDom, 'label');
        var sourceId = getAttr(edgeDom, 'source');
        var targetId = getAttr(edgeDom, 'target');
        var edge = {
          id: id,
          name: label,
          source: sourceId,
          target: targetId,
          lineStyle: {
            normal: {}
          }
        };
        var lineStyle = edge.lineStyle.normal;
        var vizThicknessDom = getChildByTagName(edgeDom, 'viz:thickness');
        var vizColorDom = getChildByTagName(edgeDom, 'viz:color');
        // let vizShapeDom = getChildByTagName(edgeDom, 'viz:shape');
        if (vizThicknessDom) {
          lineStyle.width = parseFloat(vizThicknessDom.getAttribute('value'));
        }
        if (vizColorDom) {
          lineStyle.color = 'rgb(' + [getAttr(vizColorDom, 'r') | 0, getAttr(vizColorDom, 'g') | 0, getAttr(vizColorDom, 'b') | 0].join(',') + ')';
        }
        // if (vizShapeDom) {
        //     edge.shape = vizShapeDom.getAttribute('shape');
        // }
        return edge;
      }) : [];
    }
    function getAttr(el, attrName) {
      return el.getAttribute(attrName);
    }
    function getChildByTagName(parent, tagName) {
      var node = parent.firstChild;
      while (node) {
        if (node.nodeType !== 1 || node.nodeName.toLowerCase() !== tagName.toLowerCase()) {
          node = node.ne***REMOVED***tSibling;
        } else {
          return node;
        }
      }
      return null;
    }
    function getChildrenByTagName(parent, tagName) {
      var node = parent.firstChild;
      var children = [];
      while (node) {
        if (node.nodeName.toLowerCase() === tagName.toLowerCase()) {
          children.push(node);
        }
        node = node.ne***REMOVED***tSibling;
      }
      return children;
    }

    var ge***REMOVED***f = /*#__PURE__*/Object.freeze({
        __proto__: null,
        parse: parse
    });

    /*
    * Licensed to the Apache Software Foundation (ASF) under one
    * or more contributor license agreements.  See the NOTICE file
    * distributed with this work for additional information
    * regarding copyright ownership.  The ASF licenses this file
    * to you under the Apache License, Version 2.0 (the
    * "License"); you may not use this file e***REMOVED***cept in compliance
    * with the License.  You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing,
    * software distributed under the License is distributed on an
    * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    * KIND, either e***REMOVED***press or implied.  See the License for the
    * specific language governing permissions and limitations
    * under the License.
    */


    /**
     * AUTO-GENERATED FILE. DO NOT MODIFY.
     */

    /*
    * Licensed to the Apache Software Foundation (ASF) under one
    * or more contributor license agreements.  See the NOTICE file
    * distributed with this work for additional information
    * regarding copyright ownership.  The ASF licenses this file
    * to you under the Apache License, Version 2.0 (the
    * "License"); you may not use this file e***REMOVED***cept in compliance
    * with the License.  You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing,
    * software distributed under the License is distributed on an
    * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    * KIND, either e***REMOVED***press or implied.  See the License for the
    * specific language governing permissions and limitations
    * under the License.
    */
    function asc(arr) {
      arr.sort(function (a, b) {
        return a - b;
      });
      return arr;
    }
    function quantile(ascArr, p) {
      var H = (ascArr.length - 1) * p + 1;
      var h = Math.floor(H);
      var v = +ascArr[h - 1];
      var e = H - h;
      return e ? v + e * (ascArr[h] - v) : v;
    }
    /**
     * See:
     *  <https://en.wikipedia.org/wiki/Bo***REMOVED***_plot#cite_note-frigge_hoaglin_iglewicz-2>
     *  <http://stat.ethz.ch/R-manual/R-devel/library/grDevices/html/bo***REMOVED***plot.stats.html>
     *
     * Helper method for preparing data.
     *
     * @param {Array.<number>} rawData like
     *        [
     *            [12,232,443], (raw data set for the first bo***REMOVED***)
     *            [3843,5545,1232], (raw data set for the second bo***REMOVED***)
     *            ...
     *        ]
     * @param {Object} [opt]
     *
     * @param {(number|string)} [opt.boundIQR=1.5] Data less than min bound is outlier.
     *      default 1.5, means Q1 - 1.5 * (Q3 - Q1).
     *      If 'none'/0 passed, min bound will not be used.
     * @param {(number|string)} [opt.layout='horizontal']
     *      Bo***REMOVED*** plot layout, can be 'horizontal' or 'vertical'
     * @return {Object} {
     *      bo***REMOVED***Data: Array.<Array.<number>>
     *      outliers: Array.<Array.<number>>
     *      a***REMOVED***isData: Array.<string>
     * }
     */
    function prepareBo***REMOVED***plotData (rawData, opt) {
      opt = opt || {};
      var bo***REMOVED***Data = [];
      var outliers = [];
      var a***REMOVED***isData = [];
      var boundIQR = opt.boundIQR;
      var useE***REMOVED***treme = boundIQR === 'none' || boundIQR === 0;
      for (var i = 0; i < rawData.length; i++) {
        a***REMOVED***isData.push(i + '');
        var ascList = asc(rawData[i].slice());
        var Q1 = quantile(ascList, 0.25);
        var Q2 = quantile(ascList, 0.5);
        var Q3 = quantile(ascList, 0.75);
        var min = ascList[0];
        var ma***REMOVED*** = ascList[ascList.length - 1];
        var bound = (boundIQR == null ? 1.5 : boundIQR) * (Q3 - Q1);
        var low = useE***REMOVED***treme ? min : Math.ma***REMOVED***(min, Q1 - bound);
        var high = useE***REMOVED***treme ? ma***REMOVED*** : Math.min(ma***REMOVED***, Q3 + bound);
        bo***REMOVED***Data.push([low, Q1, Q2, Q3, high]);
        for (var j = 0; j < ascList.length; j++) {
          var dataItem = ascList[j];
          if (dataItem < low || dataItem > high) {
            var outlier = [i, dataItem];
            opt.layout === 'vertical' && outlier.reverse();
            outliers.push(outlier);
          }
        }
      }
      return {
        bo***REMOVED***Data: bo***REMOVED***Data,
        outliers: outliers,
        a***REMOVED***isData: a***REMOVED***isData
      };
    }

    // import { bo***REMOVED***plotTransform } from './bo***REMOVED***plotTransform.js';
    var version = '1.0.0';
    // e***REMOVED***port {bo***REMOVED***plotTransform};
    // For backward compatibility, where the namespace `dataTool` will
    // be mounted on `echarts` is the e***REMOVED***tension `dataTool` is imported.
    // But the old version of echarts do not have `dataTool` namespace,
    // so check it before mounting.
    if (echarts.dataTool) {
      echarts.dataTool.version = version;
      echarts.dataTool.ge***REMOVED***f = ge***REMOVED***f;
      echarts.dataTool.prepareBo***REMOVED***plotData = prepareBo***REMOVED***plotData;
      // echarts.dataTool.bo***REMOVED***plotTransform = bo***REMOVED***plotTransform;
    }

    e***REMOVED***ports.ge***REMOVED***f = ge***REMOVED***f;
    e***REMOVED***ports.prepareBo***REMOVED***plotData = prepareBo***REMOVED***plotData;
    e***REMOVED***ports.version = version;

    Object.defineProperty(e***REMOVED***ports, '__esModule', { value: true });

})));
//# sourceMappingURL=dataTool.js.map
