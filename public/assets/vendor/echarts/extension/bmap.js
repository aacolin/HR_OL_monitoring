
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
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.bmap = {}, global.echarts));
}(this, (function (e***REMOVED***ports, echarts) { 'use strict';

  function BMapCoordSys(bmap, api) {
    this._bmap = bmap;
    this.dimensions = ['lng', 'lat'];
    this._mapOffset = [0, 0];
    this._api = api;
    this._projection = new BMap.MercatorProjection();
  }
  BMapCoordSys.prototype.type = 'bmap';
  BMapCoordSys.prototype.dimensions = ['lng', 'lat'];
  BMapCoordSys.prototype.setZoom = function (zoom) {
    this._zoom = zoom;
  };
  BMapCoordSys.prototype.setCenter = function (center) {
    this._center = this._projection.lngLatToPoint(new BMap.Point(center[0], center[1]));
  };
  BMapCoordSys.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset;
  };
  BMapCoordSys.prototype.getBMap = function () {
    return this._bmap;
  };
  BMapCoordSys.prototype.dataToPoint = function (data) {
    var point = new BMap.Point(data[0], data[1]);
    // TODO mercator projection is toooooooo slow
    // let mercatorPoint = this._projection.lngLatToPoint(point);
    // let width = this._api.getZr().getWidth();
    // let height = this._api.getZr().getHeight();
    // let divider = Math.pow(2, 18 - 10);
    // return [
    //     Math.round((mercatorPoint.***REMOVED*** - this._center.***REMOVED***) / divider + width / 2),
    //     Math.round((this._center.y - mercatorPoint.y) / divider + height / 2)
    // ];
    var p***REMOVED*** = this._bmap.pointToOverlayPi***REMOVED***el(point);
    var mapOffset = this._mapOffset;
    return [p***REMOVED***.***REMOVED*** - mapOffset[0], p***REMOVED***.y - mapOffset[1]];
  };
  BMapCoordSys.prototype.pointToData = function (pt) {
    var mapOffset = this._mapOffset;
    pt = this._bmap.overlayPi***REMOVED***elToPoint({
      ***REMOVED***: pt[0] + mapOffset[0],
      y: pt[1] + mapOffset[1]
    });
    return [pt.lng, pt.lat];
  };
  BMapCoordSys.prototype.getViewRect = function () {
    var api = this._api;
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
  };
  BMapCoordSys.prototype.getRoamTransform = function () {
    return echarts.matri***REMOVED***.create();
  };
  BMapCoordSys.prototype.prepareCustoms = function () {
    var rect = this.getViewRect();
    return {
      coordSys: {
        // The name e***REMOVED***posed to user is always 'cartesian2d' but not 'grid'.
        type: 'bmap',
        ***REMOVED***: rect.***REMOVED***,
        y: rect.y,
        width: rect.width,
        height: rect.height
      },
      api: {
        coord: echarts.util.bind(this.dataToPoint, this),
        size: echarts.util.bind(dataToCoordSize, this)
      }
    };
  };
  BMapCoordSys.prototype.convertToPi***REMOVED***el = function (ecModel, finder, value) {
    // here we ignore finder as only one bmap component is allowed
    return this.dataToPoint(value);
  };
  BMapCoordSys.prototype.convertFromPi***REMOVED***el = function (ecModel, finder, value) {
    return this.pointToData(value);
  };
  function dataToCoordSize(dataSize, dataItem) {
    dataItem = dataItem || [0, 0];
    return echarts.util.map([0, 1], function (dimId***REMOVED***) {
      var val = dataItem[dimId***REMOVED***];
      var halfSize = dataSize[dimId***REMOVED***] / 2;
      var p1 = [];
      var p2 = [];
      p1[dimId***REMOVED***] = val - halfSize;
      p2[dimId***REMOVED***] = val + halfSize;
      p1[1 - dimId***REMOVED***] = p2[1 - dimId***REMOVED***] = dataItem[1 - dimId***REMOVED***];
      return Math.abs(this.dataToPoint(p1)[dimId***REMOVED***] - this.dataToPoint(p2)[dimId***REMOVED***]);
    }, this);
  }
  var Overlay;
  // For deciding which dimensions to use when creating list data
  BMapCoordSys.dimensions = BMapCoordSys.prototype.dimensions;
  function createOverlayCtor() {
    function Overlay(root) {
      this._root = root;
    }
    Overlay.prototype = new BMap.Overlay();
    /**
     * 初始化
     *
     * @param {BMap.Map} map
     * @override
     */
    Overlay.prototype.initialize = function (map) {
      map.getPanes().labelPane.appendChild(this._root);
      return this._root;
    };
    /**
     * @override
     */
    Overlay.prototype.draw = function () {};
    return Overlay;
  }
  BMapCoordSys.create = function (ecModel, api) {
    var bmapCoordSys;
    var root = api.getDom();
    // TODO Dispose
    ecModel.eachComponent('bmap', function (bmapModel) {
      var painter = api.getZr().painter;
      var viewportRoot = painter.getViewportRoot();
      if (typeof BMap === 'undefined') {
        throw new Error('BMap api is not loaded');
      }
      Overlay = Overlay || createOverlayCtor();
      if (bmapCoordSys) {
        throw new Error('Only one bmap component can e***REMOVED***ist');
      }
      var bmap;
      if (!bmapModel.__bmap) {
        // Not support IE8
        var bmapRoot = root.querySelector('.ec-e***REMOVED***tension-bmap');
        if (bmapRoot) {
          // Reset viewport left and top, which will be changed
          // in moving handler in BMapView
          viewportRoot.style.left = '0p***REMOVED***';
          viewportRoot.style.top = '0p***REMOVED***';
          root.removeChild(bmapRoot);
        }
        bmapRoot = document.createElement('div');
        bmapRoot.className = 'ec-e***REMOVED***tension-bmap';
        // fi***REMOVED*** #13424
        bmapRoot.style.cssTe***REMOVED***t = 'position:absolute;width:100%;height:100%';
        root.appendChild(bmapRoot);
        // initializes bmap
        var mapOptions = bmapModel.get('mapOptions');
        if (mapOptions) {
          mapOptions = echarts.util.clone(mapOptions);
          // Not support `mapType`, use `bmap.setMapType(MapType)` instead.
          delete mapOptions.mapType;
        }
        bmap = bmapModel.__bmap = new BMap.Map(bmapRoot, mapOptions);
        var overlay = new Overlay(viewportRoot);
        bmap.addOverlay(overlay);
        // Override
        painter.getViewportRootOffset = function () {
          return {
            offsetLeft: 0,
            offsetTop: 0
          };
        };
      }
      bmap = bmapModel.__bmap;
      // Set bmap options
      // centerAndZoom before layout and render
      var center = bmapModel.get('center');
      var zoom = bmapModel.get('zoom');
      if (center && zoom) {
        var bmapCenter = bmap.getCenter();
        var bmapZoom = bmap.getZoom();
        var centerOrZoomChanged = bmapModel.centerOrZoomChanged([bmapCenter.lng, bmapCenter.lat], bmapZoom);
        if (centerOrZoomChanged) {
          var pt = new BMap.Point(center[0], center[1]);
          bmap.centerAndZoom(pt, zoom);
        }
      }
      bmapCoordSys = new BMapCoordSys(bmap, api);
      bmapCoordSys.setMapOffset(bmapModel.__mapOffset || [0, 0]);
      bmapCoordSys.setZoom(zoom);
      bmapCoordSys.setCenter(center);
      bmapModel.coordinateSystem = bmapCoordSys;
    });
    ecModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'bmap') {
        seriesModel.coordinateSystem = bmapCoordSys;
      }
    });
    // return created coordinate systems
    return bmapCoordSys && [bmapCoordSys];
  };

  function v2Equal(a, b) {
    return a && b && a[0] === b[0] && a[1] === b[1];
  }
  echarts.e***REMOVED***tendComponentModel({
    type: 'bmap',
    getBMap: function () {
      // __bmap is injected when creating BMapCoordSys
      return this.__bmap;
    },
    setCenterAndZoom: function (center, zoom) {
      this.option.center = center;
      this.option.zoom = zoom;
    },
    centerOrZoomChanged: function (center, zoom) {
      var option = this.option;
      return !(v2Equal(center, option.center) && zoom === option.zoom);
    },
    defaultOption: {
      center: [104.114129, 37.550339],
      zoom: 5,
      // 2.0 https://lbsyun.baidu.com/custom/inde***REMOVED***.htm
      mapStyle: {},
      // 3.0 https://lbsyun.baidu.com/inde***REMOVED***.php?title=open/custom
      mapStyleV2: {},
      // See https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html#a0b1
      mapOptions: {},
      roam: false
    }
  });

  function isEmptyObject(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
  echarts.e***REMOVED***tendComponentView({
    type: 'bmap',
    render: function (bMapModel, ecModel, api) {
      var rendering = true;
      var bmap = bMapModel.getBMap();
      var viewportRoot = api.getZr().painter.getViewportRoot();
      var coordSys = bMapModel.coordinateSystem;
      var moveHandler = function (type, target) {
        if (rendering) {
          return;
        }
        var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
        var mapOffset = [-parseInt(offsetEl.style.left, 10) || 0, -parseInt(offsetEl.style.top, 10) || 0];
        // only update style when map offset changed
        var viewportRootStyle = viewportRoot.style;
        var offsetLeft = mapOffset[0] + 'p***REMOVED***';
        var offsetTop = mapOffset[1] + 'p***REMOVED***';
        if (viewportRootStyle.left !== offsetLeft) {
          viewportRootStyle.left = offsetLeft;
        }
        if (viewportRootStyle.top !== offsetTop) {
          viewportRootStyle.top = offsetTop;
        }
        coordSys.setMapOffset(mapOffset);
        bMapModel.__mapOffset = mapOffset;
        api.dispatchAction({
          type: 'bmapRoam',
          animation: {
            duration: 0
          }
        });
      };
      function zoomEndHandler() {
        if (rendering) {
          return;
        }
        api.dispatchAction({
          type: 'bmapRoam',
          animation: {
            duration: 0
          }
        });
      }
      bmap.removeEventListener('moving', this._oldMoveHandler);
      bmap.removeEventListener('moveend', this._oldMoveHandler);
      bmap.removeEventListener('zoomend', this._oldZoomEndHandler);
      bmap.addEventListener('moving', moveHandler);
      bmap.addEventListener('moveend', moveHandler);
      bmap.addEventListener('zoomend', zoomEndHandler);
      this._oldMoveHandler = moveHandler;
      this._oldZoomEndHandler = zoomEndHandler;
      var roam = bMapModel.get('roam');
      if (roam && roam !== 'scale') {
        bmap.enableDragging();
      } else {
        bmap.disableDragging();
      }
      if (roam && roam !== 'move') {
        bmap.enableScrollWheelZoom();
        bmap.enableDoubleClickZoom();
        bmap.enablePinchToZoom();
      } else {
        bmap.disableScrollWheelZoom();
        bmap.disableDoubleClickZoom();
        bmap.disablePinchToZoom();
      }
      /* map 2.0 */
      var originalStyle = bMapModel.__mapStyle;
      var newMapStyle = bMapModel.get('mapStyle') || {};
      // FIXME, Not use JSON methods
      var mapStyleStr = JSON.stringify(newMapStyle);
      if (JSON.stringify(originalStyle) !== mapStyleStr) {
        // FIXME May have blank tile when dragging if setMapStyle
        if (!isEmptyObject(newMapStyle)) {
          bmap.setMapStyle(echarts.util.clone(newMapStyle));
        }
        bMapModel.__mapStyle = JSON.parse(mapStyleStr);
      }
      /* map 3.0 */
      var originalStyle2 = bMapModel.__mapStyle2;
      var newMapStyle2 = bMapModel.get('mapStyleV2') || {};
      // FIXME, Not use JSON methods
      var mapStyleStr2 = JSON.stringify(newMapStyle2);
      if (JSON.stringify(originalStyle2) !== mapStyleStr2) {
        // FIXME May have blank tile when dragging if setMapStyle
        if (!isEmptyObject(newMapStyle2)) {
          bmap.setMapStyleV2(echarts.util.clone(newMapStyle2));
        }
        bMapModel.__mapStyle2 = JSON.parse(mapStyleStr2);
      }
      rendering = false;
    }
  });

  echarts.registerCoordinateSystem('bmap', BMapCoordSys);
  // Action
  echarts.registerAction({
    type: 'bmapRoam',
    event: 'bmapRoam',
    update: 'updateLayout'
  }, function (payload, ecModel) {
    ecModel.eachComponent('bmap', function (bMapModel) {
      var bmap = bMapModel.getBMap();
      var center = bmap.getCenter();
      bMapModel.setCenterAndZoom([center.lng, center.lat], bmap.getZoom());
    });
  });
  var version = '1.0.0';

  e***REMOVED***ports.version = version;

  Object.defineProperty(e***REMOVED***ports, '__esModule', { value: true });

})));
//# sourceMappingURL=bmap.js.map
