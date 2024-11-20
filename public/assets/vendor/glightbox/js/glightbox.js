(function (global, factory) {
  typeof e***REMOVED***ports === 'object' && typeof module !== 'undefined' ? module.e***REMOVED***ports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GLightbo***REMOVED*** = factory());
}(this, (function () { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  var uid = Date.now();
  function e***REMOVED***tend() {
    var e***REMOVED***tended = {};
    var deep = true;
    var i = 0;
    var length = arguments.length;
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;
    }
    var merge = function merge(obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            e***REMOVED***tended[prop] = e***REMOVED***tend(true, e***REMOVED***tended[prop], obj[prop]);
          } else {
            e***REMOVED***tended[prop] = obj[prop];
          }
        }
      }
    };
    for (; i < length; i++) {
      var obj = arguments[i];
      merge(obj);
    }
    return e***REMOVED***tended;
  }
  function each(collection, callback) {
    if (isNode(collection) || collection === window || collection === document) {
      collection = [collection];
    }
    if (!isArrayLike(collection) && !isObject(collection)) {
      collection = [collection];
    }
    if (size(collection) == 0) {
      return;
    }
    if (isArrayLike(collection) && !isObject(collection)) {
      var l = collection.length,
        i = 0;
      for (; i < l; i++) {
        if (callback.call(collection[i], collection[i], i, collection) === false) {
          break;
        }
      }
    } else if (isObject(collection)) {
      for (var key in collection) {
        if (has(collection, key)) {
          if (callback.call(collection[key], collection[key], key, collection) === false) {
            break;
          }
        }
      }
    }
  }
  function getNodeEvents(node) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var cache = node[uid] = node[uid] || [];
    var data = {
      all: cache,
      evt: null,
      found: null
    };
    if (name && fn && size(cache) > 0) {
      each(cache, function (cl, i) {
        if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
          data.found = true;
          data.evt = i;
          return false;
        }
      });
    }
    return data;
  }
  function addEvent(eventName) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      onElement = _ref.onElement,
      withCallback = _ref.withCallback,
      _ref$avoidDuplicate = _ref.avoidDuplicate,
      avoidDuplicate = _ref$avoidDuplicate === void 0 ? true : _ref$avoidDuplicate,
      _ref$once = _ref.once,
      once = _ref$once === void 0 ? false : _ref$once,
      _ref$useCapture = _ref.useCapture,
      useCapture = _ref$useCapture === void 0 ? false : _ref$useCapture;
    var thisArg = arguments.length > 2 ? arguments[2] : undefined;
    var element = onElement || [];
    if (isString(element)) {
      element = document.querySelectorAll(element);
    }
    function handler(event) {
      if (isFunction(withCallback)) {
        withCallback.call(thisArg, event, this);
      }
      if (once) {
        handler.destroy();
      }
    }
    handler.destroy = function () {
      each(element, function (el) {
        var events = getNodeEvents(el, eventName, handler);
        if (events.found) {
          events.all.splice(events.evt, 1);
        }
        if (el.removeEventListener) {
          el.removeEventListener(eventName, handler, useCapture);
        }
      });
    };
    each(element, function (el) {
      var events = getNodeEvents(el, eventName, handler);
      if (el.addEventListener && avoidDuplicate && !events.found || !avoidDuplicate) {
        el.addEventListener(eventName, handler, useCapture);
        events.all.push({
          eventName: eventName,
          fn: handler
        });
      }
    });
    return handler;
  }
  function addClass(node, name) {
    each(name.split(' '), function (cl) {
      return node.classList.add(cl);
    });
  }
  function removeClass(node, name) {
    each(name.split(' '), function (cl) {
      return node.classList.remove(cl);
    });
  }
  function hasClass(node, name) {
    return node.classList.contains(name);
  }
  function closest(elem, selector) {
    while (elem !== document.body) {
      elem = elem.parentElement;
      if (!elem) {
        return false;
      }
      var matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);
      if (matches) {
        return elem;
      }
    }
  }
  function animateElement(element) {
    var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (!element || animation === '') {
      return false;
    }
    if (animation === 'none') {
      if (isFunction(callback)) {
        callback();
      }
      return false;
    }
    var animationEnd = whichAnimationEvent();
    var animationNames = animation.split(' ');
    each(animationNames, function (name) {
      addClass(element, 'g' + name);
    });
    addEvent(animationEnd, {
      onElement: element,
      avoidDuplicate: false,
      once: true,
      withCallback: function withCallback(event, target) {
        each(animationNames, function (name) {
          removeClass(target, 'g' + name);
        });
        if (isFunction(callback)) {
          callback();
        }
      }
    });
  }
  function cssTransform(node) {
    var translate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    if (translate === '') {
      node.style.webkitTransform = '';
      node.style.MozTransform = '';
      node.style.msTransform = '';
      node.style.OTransform = '';
      node.style.transform = '';
      return false;
    }
    node.style.webkitTransform = translate;
    node.style.MozTransform = translate;
    node.style.msTransform = translate;
    node.style.OTransform = translate;
    node.style.transform = translate;
  }
  function show(element) {
    element.style.display = 'block';
  }
  function hide(element) {
    element.style.display = 'none';
  }
  function createHTML(htmlStr) {
    var frag = document.createDocumentFragment(),
      temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    return frag;
  }
  function windowSize() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
  }
  function whichAnimationEvent() {
    var t,
      el = document.createElement('fakeelement');
    var animations = {
      animation: 'animationend',
      OAnimation: 'oAnimationEnd',
      MozAnimation: 'animationend',
      WebkitAnimation: 'webkitAnimationEnd'
    };
    for (t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  }
  function whichTransitionEvent() {
    var t,
      el = document.createElement('fakeelement');
    var transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }
  function createIframe(config) {
    var url = config.url,
      allow = config.allow,
      callback = config.callback,
      appendTo = config.appendTo;
    var iframe = document.createElement('iframe');
    iframe.className = 'vimeo-video gvideo';
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    if (allow) {
      iframe.setAttribute('allow', allow);
    }
    iframe.onload = function () {
      iframe.onload = null;
      addClass(iframe, 'node-ready');
      if (isFunction(callback)) {
        callback();
      }
    };
    if (appendTo) {
      appendTo.appendChild(iframe);
    }
    return iframe;
  }
  function waitUntil(check, onComplete, delay, timeout) {
    if (check()) {
      onComplete();
      return;
    }
    if (!delay) {
      delay = 100;
    }
    var timeoutPointer;
    var intervalPointer = setInterval(function () {
      if (!check()) {
        return;
      }
      clearInterval(intervalPointer);
      if (timeoutPointer) {
        clearTimeout(timeoutPointer);
      }
      onComplete();
    }, delay);
    if (timeout) {
      timeoutPointer = setTimeout(function () {
        clearInterval(intervalPointer);
      }, timeout);
    }
  }
  function injectAssets(url, waitFor, callback) {
    if (isNil(url)) {
      console.error('Inject assets error');
      return;
    }
    if (isFunction(waitFor)) {
      callback = waitFor;
      waitFor = false;
    }
    if (isString(waitFor) && waitFor in window) {
      if (isFunction(callback)) {
        callback();
      }
      return;
    }
    var found;
    if (url.inde***REMOVED***Of('.css') !== -1) {
      found = document.querySelectorAll('link[href="' + url + '"]');
      if (found && found.length > 0) {
        if (isFunction(callback)) {
          callback();
        }
        return;
      }
      var head = document.getElementsByTagName('head')[0];
      var headStyles = head.querySelectorAll('link[rel="stylesheet"]');
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'te***REMOVED***t/css';
      link.href = url;
      link.media = 'all';
      if (headStyles) {
        head.insertBefore(link, headStyles[0]);
      } else {
        head.appendChild(link);
      }
      if (isFunction(callback)) {
        callback();
      }
      return;
    }
    found = document.querySelectorAll('script[src="' + url + '"]');
    if (found && found.length > 0) {
      if (isFunction(callback)) {
        if (isString(waitFor)) {
          waitUntil(function () {
            return typeof window[waitFor] !== 'undefined';
          }, function () {
            callback();
          });
          return false;
        }
        callback();
      }
      return;
    }
    var script = document.createElement('script');
    script.type = 'te***REMOVED***t/javascript';
    script.src = url;
    script.onload = function () {
      if (isFunction(callback)) {
        if (isString(waitFor)) {
          waitUntil(function () {
            return typeof window[waitFor] !== 'undefined';
          }, function () {
            callback();
          });
          return false;
        }
        callback();
      }
    };
    document.body.appendChild(script);
  }
  function isMobile() {
    return 'navigator' in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
  }
  function isTouch() {
    return isMobile() !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMa***REMOVED***TouchPoints;
  }
  function isFunction(f) {
    return typeof f === 'function';
  }
  function isString(s) {
    return typeof s === 'string';
  }
  function isNode(el) {
    return !!(el && el.nodeType && el.nodeType == 1);
  }
  function isArray(ar) {
    return Array.isArray(ar);
  }
  function isArrayLike(ar) {
    return ar && ar.length && isFinite(ar.length);
  }
  function isObject(o) {
    var type = _typeof(o);
    return type === 'object' && o != null && !isFunction(o) && !isArray(o);
  }
  function isNil(o) {
    return o == null;
  }
  function has(obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key);
  }
  function size(o) {
    if (isObject(o)) {
      if (o.keys) {
        return o.keys().length;
      }
      var l = 0;
      for (var k in o) {
        if (has(o, k)) {
          l++;
        }
      }
      return l;
    } else {
      return o.length;
    }
  }
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function getNe***REMOVED***tFocusElement() {
    var current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    var btns = document.querySelectorAll('.gbtn[data-taborder]:not(.disabled)');
    if (!btns.length) {
      return false;
    }
    if (btns.length == 1) {
      return btns[0];
    }
    if (typeof current == 'string') {
      current = parseInt(current);
    }
    var orders = [];
    each(btns, function (btn) {
      orders.push(btn.getAttribute('data-taborder'));
    });
    var highestOrder = Math.ma***REMOVED***.apply(Math, orders.map(function (order) {
      return parseInt(order);
    }));
    var newInde***REMOVED*** = current < 0 ? 1 : current + 1;
    if (newInde***REMOVED*** > highestOrder) {
      newInde***REMOVED*** = '1';
    }
    var ne***REMOVED***tOrders = orders.filter(function (el) {
      return el >= parseInt(newInde***REMOVED***);
    });
    var ne***REMOVED***tFocus = ne***REMOVED***tOrders.sort()[0];
    return document.querySelector(".gbtn[data-taborder=\"".concat(ne***REMOVED***tFocus, "\"]"));
  }
  function keyboardNavigation(instance) {
    if (instance.events.hasOwnProperty('keyboard')) {
      return false;
    }
    instance.events['keyboard'] = addEvent('keydown', {
      onElement: window,
      withCallback: function withCallback(event, target) {
        event = event || window.event;
        var key = event.keyCode;
        if (key == 9) {
          var focusedButton = document.querySelector('.gbtn.focused');
          if (!focusedButton) {
            var activeElement = document.activeElement && document.activeElement.nodeName ? document.activeElement.nodeName.toLocaleLowerCase() : false;
            if (activeElement == 'input' || activeElement == 'te***REMOVED***tarea' || activeElement == 'button') {
              return;
            }
          }
          event.preventDefault();
          var btns = document.querySelectorAll('.gbtn[data-taborder]');
          if (!btns || btns.length <= 0) {
            return;
          }
          if (!focusedButton) {
            var first = getNe***REMOVED***tFocusElement();
            if (first) {
              first.focus();
              addClass(first, 'focused');
            }
            return;
          }
          var currentFocusOrder = focusedButton.getAttribute('data-taborder');
          var ne***REMOVED***tFocus = getNe***REMOVED***tFocusElement(currentFocusOrder);
          removeClass(focusedButton, 'focused');
          if (ne***REMOVED***tFocus) {
            ne***REMOVED***tFocus.focus();
            addClass(ne***REMOVED***tFocus, 'focused');
          }
        }
        if (key == 39) {
          instance.ne***REMOVED***tSlide();
        }
        if (key == 37) {
          instance.prevSlide();
        }
        if (key == 27) {
          instance.close();
        }
      }
    });
  }

  var ZoomImages = function () {
    function ZoomImages(el, slide) {
      var _this = this;
      var onclose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      _classCallCheck(this, ZoomImages);
      this.img = el;
      this.slide = slide;
      this.onclose = onclose;
      if (this.img.setZoomEvents) {
        return false;
      }
      this.active = false;
      this.zoomedIn = false;
      this.dragging = false;
      this.currentX = null;
      this.currentY = null;
      this.initialX = null;
      this.initialY = null;
      this.***REMOVED***Offset = 0;
      this.yOffset = 0;
      this.img.addEventListener('mousedown', function (e) {
        return _this.dragStart(e);
      }, false);
      this.img.addEventListener('mouseup', function (e) {
        return _this.dragEnd(e);
      }, false);
      this.img.addEventListener('mousemove', function (e) {
        return _this.drag(e);
      }, false);
      this.img.addEventListener('click', function (e) {
        if (_this.slide.classList.contains('dragging-nav')) {
          _this.zoomOut();
          return false;
        }
        if (!_this.zoomedIn) {
          return _this.zoomIn();
        }
        if (_this.zoomedIn && !_this.dragging) {
          _this.zoomOut();
        }
      }, false);
      this.img.setZoomEvents = true;
    }
    return _createClass(ZoomImages, [{
      key: "zoomIn",
      value: function zoomIn() {
        var winWidth = this.widowWidth();
        if (this.zoomedIn || winWidth <= 768) {
          return;
        }
        var img = this.img;
        img.setAttribute('data-style', img.getAttribute('style'));
        img.style.ma***REMOVED***Width = img.naturalWidth + 'p***REMOVED***';
        img.style.ma***REMOVED***Height = img.naturalHeight + 'p***REMOVED***';
        if (img.naturalWidth > winWidth) {
          var centerX = winWidth / 2 - img.naturalWidth / 2;
          this.setTranslate(this.img.parentNode, centerX, 0);
        }
        this.slide.classList.add('zoomed');
        this.zoomedIn = true;
      }
    }, {
      key: "zoomOut",
      value: function zoomOut() {
        this.img.parentNode.setAttribute('style', '');
        this.img.setAttribute('style', this.img.getAttribute('data-style'));
        this.slide.classList.remove('zoomed');
        this.zoomedIn = false;
        this.currentX = null;
        this.currentY = null;
        this.initialX = null;
        this.initialY = null;
        this.***REMOVED***Offset = 0;
        this.yOffset = 0;
        if (this.onclose && typeof this.onclose == 'function') {
          this.onclose();
        }
      }
    }, {
      key: "dragStart",
      value: function dragStart(e) {
        e.preventDefault();
        if (!this.zoomedIn) {
          this.active = false;
          return;
        }
        if (e.type === 'touchstart') {
          this.initialX = e.touches[0].clientX - this.***REMOVED***Offset;
          this.initialY = e.touches[0].clientY - this.yOffset;
        } else {
          this.initialX = e.clientX - this.***REMOVED***Offset;
          this.initialY = e.clientY - this.yOffset;
        }
        if (e.target === this.img) {
          this.active = true;
          this.img.classList.add('dragging');
        }
      }
    }, {
      key: "dragEnd",
      value: function dragEnd(e) {
        var _this2 = this;
        e.preventDefault();
        this.initialX = this.currentX;
        this.initialY = this.currentY;
        this.active = false;
        setTimeout(function () {
          _this2.dragging = false;
          _this2.img.isDragging = false;
          _this2.img.classList.remove('dragging');
        }, 100);
      }
    }, {
      key: "drag",
      value: function drag(e) {
        if (this.active) {
          e.preventDefault();
          if (e.type === 'touchmove') {
            this.currentX = e.touches[0].clientX - this.initialX;
            this.currentY = e.touches[0].clientY - this.initialY;
          } else {
            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;
          }
          this.***REMOVED***Offset = this.currentX;
          this.yOffset = this.currentY;
          this.img.isDragging = true;
          this.dragging = true;
          this.setTranslate(this.img, this.currentX, this.currentY);
        }
      }
    }, {
      key: "onMove",
      value: function onMove(e) {
        if (!this.zoomedIn) {
          return;
        }
        var ***REMOVED***Offset = e.clientX - this.img.naturalWidth / 2;
        var yOffset = e.clientY - this.img.naturalHeight / 2;
        this.setTranslate(this.img, ***REMOVED***Offset, yOffset);
      }
    }, {
      key: "setTranslate",
      value: function setTranslate(node, ***REMOVED***Pos, yPos) {
        node.style.transform = 'translate3d(' + ***REMOVED***Pos + 'p***REMOVED***, ' + yPos + 'p***REMOVED***, 0)';
      }
    }, {
      key: "widowWidth",
      value: function widowWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      }
    }]);
  }();

  var DragSlides = function () {
    function DragSlides() {
      var _this = this;
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, DragSlides);
      var dragEl = config.dragEl,
        _config$toleranceX = config.toleranceX,
        toleranceX = _config$toleranceX === void 0 ? 40 : _config$toleranceX,
        _config$toleranceY = config.toleranceY,
        toleranceY = _config$toleranceY === void 0 ? 65 : _config$toleranceY,
        _config$slide = config.slide,
        slide = _config$slide === void 0 ? null : _config$slide,
        _config$instance = config.instance,
        instance = _config$instance === void 0 ? null : _config$instance;
      this.el = dragEl;
      this.active = false;
      this.dragging = false;
      this.currentX = null;
      this.currentY = null;
      this.initialX = null;
      this.initialY = null;
      this.***REMOVED***Offset = 0;
      this.yOffset = 0;
      this.direction = null;
      this.lastDirection = null;
      this.toleranceX = toleranceX;
      this.toleranceY = toleranceY;
      this.toleranceReached = false;
      this.dragContainer = this.el;
      this.slide = slide;
      this.instance = instance;
      this.el.addEventListener('mousedown', function (e) {
        return _this.dragStart(e);
      }, false);
      this.el.addEventListener('mouseup', function (e) {
        return _this.dragEnd(e);
      }, false);
      this.el.addEventListener('mousemove', function (e) {
        return _this.drag(e);
      }, false);
    }
    return _createClass(DragSlides, [{
      key: "dragStart",
      value: function dragStart(e) {
        if (this.slide.classList.contains('zoomed')) {
          this.active = false;
          return;
        }
        if (e.type === 'touchstart') {
          this.initialX = e.touches[0].clientX - this.***REMOVED***Offset;
          this.initialY = e.touches[0].clientY - this.yOffset;
        } else {
          this.initialX = e.clientX - this.***REMOVED***Offset;
          this.initialY = e.clientY - this.yOffset;
        }
        var clicked = e.target.nodeName.toLowerCase();
        var e***REMOVED***ludeClicks = ['input', 'select', 'te***REMOVED***tarea', 'button', 'a'];
        if (e.target.classList.contains('nodrag') || closest(e.target, '.nodrag') || e***REMOVED***ludeClicks.inde***REMOVED***Of(clicked) !== -1) {
          this.active = false;
          return;
        }
        e.preventDefault();
        if (e.target === this.el || clicked !== 'img' && closest(e.target, '.gslide-inline')) {
          this.active = true;
          this.el.classList.add('dragging');
          this.dragContainer = closest(e.target, '.ginner-container');
        }
      }
    }, {
      key: "dragEnd",
      value: function dragEnd(e) {
        var _this2 = this;
        e && e.preventDefault();
        this.initialX = 0;
        this.initialY = 0;
        this.currentX = null;
        this.currentY = null;
        this.initialX = null;
        this.initialY = null;
        this.***REMOVED***Offset = 0;
        this.yOffset = 0;
        this.active = false;
        if (this.doSlideChange) {
          this.instance.preventOutsideClick = true;
          this.doSlideChange == 'right' && this.instance.prevSlide();
          this.doSlideChange == 'left' && this.instance.ne***REMOVED***tSlide();
        }
        if (this.doSlideClose) {
          this.instance.close();
        }
        if (!this.toleranceReached) {
          this.setTranslate(this.dragContainer, 0, 0, true);
        }
        setTimeout(function () {
          _this2.instance.preventOutsideClick = false;
          _this2.toleranceReached = false;
          _this2.lastDirection = null;
          _this2.dragging = false;
          _this2.el.isDragging = false;
          _this2.el.classList.remove('dragging');
          _this2.slide.classList.remove('dragging-nav');
          _this2.dragContainer.style.transform = '';
          _this2.dragContainer.style.transition = '';
        }, 100);
      }
    }, {
      key: "drag",
      value: function drag(e) {
        if (this.active) {
          e.preventDefault();
          this.slide.classList.add('dragging-nav');
          if (e.type === 'touchmove') {
            this.currentX = e.touches[0].clientX - this.initialX;
            this.currentY = e.touches[0].clientY - this.initialY;
          } else {
            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;
          }
          this.***REMOVED***Offset = this.currentX;
          this.yOffset = this.currentY;
          this.el.isDragging = true;
          this.dragging = true;
          this.doSlideChange = false;
          this.doSlideClose = false;
          var currentXInt = Math.abs(this.currentX);
          var currentYInt = Math.abs(this.currentY);
          if (currentXInt > 0 && currentXInt >= Math.abs(this.currentY) && (!this.lastDirection || this.lastDirection == '***REMOVED***')) {
            this.yOffset = 0;
            this.lastDirection = '***REMOVED***';
            this.setTranslate(this.dragContainer, this.currentX, 0);
            var doChange = this.shouldChange();
            if (!this.instance.settings.dragAutoSnap && doChange) {
              this.doSlideChange = doChange;
            }
            if (this.instance.settings.dragAutoSnap && doChange) {
              this.instance.preventOutsideClick = true;
              this.toleranceReached = true;
              this.active = false;
              this.instance.preventOutsideClick = true;
              this.dragEnd(null);
              doChange == 'right' && this.instance.prevSlide();
              doChange == 'left' && this.instance.ne***REMOVED***tSlide();
              return;
            }
          }
          if (this.toleranceY > 0 && currentYInt > 0 && currentYInt >= currentXInt && (!this.lastDirection || this.lastDirection == 'y')) {
            this.***REMOVED***Offset = 0;
            this.lastDirection = 'y';
            this.setTranslate(this.dragContainer, 0, this.currentY);
            var doClose = this.shouldClose();
            if (!this.instance.settings.dragAutoSnap && doClose) {
              this.doSlideClose = true;
            }
            if (this.instance.settings.dragAutoSnap && doClose) {
              this.instance.close();
            }
            return;
          }
        }
      }
    }, {
      key: "shouldChange",
      value: function shouldChange() {
        var doChange = false;
        var currentXInt = Math.abs(this.currentX);
        if (currentXInt >= this.toleranceX) {
          var dragDir = this.currentX > 0 ? 'right' : 'left';
          if (dragDir == 'left' && this.slide !== this.slide.parentNode.lastChild || dragDir == 'right' && this.slide !== this.slide.parentNode.firstChild) {
            doChange = dragDir;
          }
        }
        return doChange;
      }
    }, {
      key: "shouldClose",
      value: function shouldClose() {
        var doClose = false;
        var currentYInt = Math.abs(this.currentY);
        if (currentYInt >= this.toleranceY) {
          doClose = true;
        }
        return doClose;
      }
    }, {
      key: "setTranslate",
      value: function setTranslate(node, ***REMOVED***Pos, yPos) {
        var animated = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        if (animated) {
          node.style.transition = 'all .2s ease';
        } else {
          node.style.transition = '';
        }
        node.style.transform = "translate3d(".concat(***REMOVED***Pos, "p***REMOVED***, ").concat(yPos, "p***REMOVED***, 0)");
      }
    }]);
  }();

  function slideImage(slide, data, inde***REMOVED***, callback) {
    var slideMedia = slide.querySelector('.gslide-media');
    var img = new Image();
    var titleID = 'gSlideTitle_' + inde***REMOVED***;
    var te***REMOVED***tID = 'gSlideDesc_' + inde***REMOVED***;
    img.addEventListener('load', function () {
      if (isFunction(callback)) {
        callback();
      }
    }, false);
    img.src = data.href;
    if (data.sizes != '' && data.srcset != '') {
      img.sizes = data.sizes;
      img.srcset = data.srcset;
    }
    img.alt = '';
    if (!isNil(data.alt) && data.alt !== '') {
      img.alt = data.alt;
    }
    if (data.title !== '') {
      img.setAttribute('aria-labelledby', titleID);
    }
    if (data.description !== '') {
      img.setAttribute('aria-describedby', te***REMOVED***tID);
    }
    if (data.hasOwnProperty('_hasCustomWidth') && data._hasCustomWidth) {
      img.style.width = data.width;
    }
    if (data.hasOwnProperty('_hasCustomHeight') && data._hasCustomHeight) {
      img.style.height = data.height;
    }
    slideMedia.insertBefore(img, slideMedia.firstChild);
    return;
  }

  function slideVideo(slide, data, inde***REMOVED***, callback) {
    var _this = this;
    var slideContainer = slide.querySelector('.ginner-container');
    var videoID = 'gvideo' + inde***REMOVED***;
    var slideMedia = slide.querySelector('.gslide-media');
    var videoPlayers = this.getAllPlayers();
    addClass(slideContainer, 'gvideo-container');
    slideMedia.insertBefore(createHTML('<div class="gvideo-wrapper"></div>'), slideMedia.firstChild);
    var videoWrapper = slide.querySelector('.gvideo-wrapper');
    injectAssets(this.settings.plyr.css, 'Plyr');
    var url = data.href;
    var provider = data === null || data === void 0 ? void 0 : data.videoProvider;
    var customPlaceholder = false;
    slideMedia.style.ma***REMOVED***Width = data.width;
    injectAssets(this.settings.plyr.js, 'Plyr', function () {
      if (!provider && url.match(/vimeo\.com\/([0-9]*)/)) {
        provider = 'vimeo';
      }
      if (!provider && (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/shorts\/([a-zA-Z0-9\-_]+)/))) {
        provider = 'youtube';
      }
      if (provider === 'local' || !provider) {
        provider = 'local';
        var html = '<video id="' + videoID + '" ';
        html += "style=\"background:#000; ma***REMOVED***-width: ".concat(data.width, ";\" ");
        html += 'preload="metadata" ';
        html += '***REMOVED***-webkit-airplay="allow" ';
        html += 'playsinline ';
        html += 'controls ';
        html += 'class="gvideo-local">';
        html += "<source src=\"".concat(url, "\">");
        html += '</video>';
        customPlaceholder = createHTML(html);
      }
      var placeholder = customPlaceholder ? customPlaceholder : createHTML("<div id=\"".concat(videoID, "\" data-plyr-provider=\"").concat(provider, "\" data-plyr-embed-id=\"").concat(url, "\"></div>"));
      addClass(videoWrapper, "".concat(provider, "-video gvideo"));
      videoWrapper.appendChild(placeholder);
      videoWrapper.setAttribute('data-id', videoID);
      videoWrapper.setAttribute('data-inde***REMOVED***', inde***REMOVED***);
      var playerConfig = has(_this.settings.plyr, 'config') ? _this.settings.plyr.config : {};
      var player = new Plyr('#' + videoID, playerConfig);
      player.on('ready', function (event) {
        videoPlayers[videoID] = event.detail.plyr;
        if (isFunction(callback)) {
          callback();
        }
      });
      waitUntil(function () {
        return slide.querySelector('iframe') && slide.querySelector('iframe').dataset.ready == 'true';
      }, function () {
        _this.resize(slide);
      });
      player.on('enterfullscreen', handleMediaFullScreen);
      player.on('e***REMOVED***itfullscreen', handleMediaFullScreen);
    });
  }
  function handleMediaFullScreen(event) {
    var media = closest(event.target, '.gslide-media');
    if (event.type === 'enterfullscreen') {
      addClass(media, 'fullscreen');
    }
    if (event.type === 'e***REMOVED***itfullscreen') {
      removeClass(media, 'fullscreen');
    }
  }

  function slideInline(slide, data, inde***REMOVED***, callback) {
    var _this = this;
    var slideMedia = slide.querySelector('.gslide-media');
    var hash = has(data, 'href') && data.href ? data.href.split('#').pop().trim() : false;
    var content = has(data, 'content') && data.content ? data.content : false;
    var innerContent;
    if (content) {
      if (isString(content)) {
        innerContent = createHTML("<div class=\"ginlined-content\">".concat(content, "</div>"));
      }
      if (isNode(content)) {
        if (content.style.display == 'none') {
          content.style.display = 'block';
        }
        var container = document.createElement('div');
        container.className = 'ginlined-content';
        container.appendChild(content);
        innerContent = container;
      }
    }
    if (hash) {
      var div = document.getElementById(hash);
      if (!div) {
        return false;
      }
      var cloned = div.cloneNode(true);
      cloned.style.height = data.height;
      cloned.style.ma***REMOVED***Width = data.width;
      addClass(cloned, 'ginlined-content');
      innerContent = cloned;
    }
    if (!innerContent) {
      console.error('Unable to append inline slide content', data);
      return false;
    }
    slideMedia.style.height = data.height;
    slideMedia.style.width = data.width;
    slideMedia.appendChild(innerContent);
    this.events['inlineclose' + hash] = addEvent('click', {
      onElement: slideMedia.querySelectorAll('.gtrigger-close'),
      withCallback: function withCallback(e) {
        e.preventDefault();
        _this.close();
      }
    });
    if (isFunction(callback)) {
      callback();
    }
    return;
  }

  function slideIframe(slide, data, inde***REMOVED***, callback) {
    var slideMedia = slide.querySelector('.gslide-media');
    var iframe = createIframe({
      url: data.href,
      callback: callback
    });
    slideMedia.parentNode.style.ma***REMOVED***Width = data.width;
    slideMedia.parentNode.style.height = data.height;
    slideMedia.appendChild(iframe);
    return;
  }

  var SlideConfigParser = function () {
    function SlideConfigParser() {
      var slideParamas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, SlideConfigParser);
      this.defaults = {
        href: '',
        sizes: '',
        srcset: '',
        title: '',
        type: '',
        videoProvider: '',
        description: '',
        alt: '',
        descPosition: 'bottom',
        effect: '',
        width: '',
        height: '',
        content: false,
        zoomable: true,
        draggable: true
      };
      if (isObject(slideParamas)) {
        this.defaults = e***REMOVED***tend(this.defaults, slideParamas);
      }
    }
    return _createClass(SlideConfigParser, [{
      key: "sourceType",
      value: function sourceType(url) {
        var origin = url;
        url = url.toLowerCase();
        if (url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/) !== null) {
          return 'image';
        }
        if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/shorts\/([a-zA-Z0-9\-_]+)/)) {
          return 'video';
        }
        if (url.match(/vimeo\.com\/([0-9]*)/)) {
          return 'video';
        }
        if (url.match(/\.(mp4|ogg|webm|mov)/) !== null) {
          return 'video';
        }
        if (url.match(/\.(mp3|wav|wma|aac|ogg)/) !== null) {
          return 'audio';
        }
        if (url.inde***REMOVED***Of('#') > -1) {
          var hash = origin.split('#').pop();
          if (hash.trim() !== '') {
            return 'inline';
          }
        }
        if (url.inde***REMOVED***Of('goaja***REMOVED***=true') > -1) {
          return 'aja***REMOVED***';
        }
        return 'e***REMOVED***ternal';
      }
    }, {
      key: "parseConfig",
      value: function parseConfig(element, settings) {
        var _this = this;
        var data = e***REMOVED***tend({
          descPosition: settings.descPosition
        }, this.defaults);
        if (isObject(element) && !isNode(element)) {
          if (!has(element, 'type')) {
            if (has(element, 'content') && element.content) {
              element.type = 'inline';
            } else if (has(element, 'href')) {
              element.type = this.sourceType(element.href);
            }
          }
          var objectData = e***REMOVED***tend(data, element);
          this.setSize(objectData, settings);
          return objectData;
        }
        var url = '';
        var config = element.getAttribute('data-glightbo***REMOVED***');
        var nodeType = element.nodeName.toLowerCase();
        if (nodeType === 'a') {
          url = element.href;
        }
        if (nodeType === 'img') {
          url = element.src;
          data.alt = element.alt;
        }
        data.href = url;
        each(data, function (val, key) {
          if (has(settings, key) && key !== 'width') {
            data[key] = settings[key];
          }
          var nodeData = element.dataset[key];
          if (!isNil(nodeData)) {
            data[key] = _this.sanitizeValue(nodeData);
          }
        });
        if (data.content) {
          data.type = 'inline';
        }
        if (!data.type && url) {
          data.type = this.sourceType(url);
        }
        if (!isNil(config)) {
          var cleanKeys = [];
          each(data, function (v, k) {
            cleanKeys.push(';\\s?' + k);
          });
          cleanKeys = cleanKeys.join('\\s?:|');
          if (config.trim() !== '') {
            each(data, function (val, key) {
              var str = config;
              var match = 's?' + key + 's?:s?(.*?)(' + cleanKeys + 's?:|$)';
              var rege***REMOVED*** = new RegE***REMOVED***p(match);
              var matches = str.match(rege***REMOVED***);
              if (matches && matches.length && matches[1]) {
                var value = matches[1].trim().replace(/;\s*$/, '');
                data[key] = _this.sanitizeValue(value);
              }
            });
          }
        } else {
          if (!data.title && nodeType == 'a') {
            var title = element.title;
            if (!isNil(title) && title !== '') {
              data.title = title;
            }
          }
          if (!data.title && nodeType == 'img') {
            var alt = element.alt;
            if (!isNil(alt) && alt !== '') {
              data.title = alt;
            }
          }
        }
        if (data.description && data.description.substring(0, 1) === '.') {
          var description;
          try {
            description = document.querySelector(data.description).innerHTML;
          } catch (error) {
            if (!(error instanceof DOME***REMOVED***ception)) {
              throw error;
            }
          }
          if (description) {
            data.description = description;
          }
        }
        if (!data.description) {
          var nodeDesc = element.querySelector('.glightbo***REMOVED***-desc');
          if (nodeDesc) {
            data.description = nodeDesc.innerHTML;
          }
        }
        this.setSize(data, settings, element);
        this.slideConfig = data;
        return data;
      }
    }, {
      key: "setSize",
      value: function setSize(data, settings) {
        var element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var defaultWith = data.type == 'video' ? this.checkSize(settings.videosWidth) : this.checkSize(settings.width);
        var defaultHeight = this.checkSize(settings.height);
        data.width = has(data, 'width') && data.width !== '' ? this.checkSize(data.width) : defaultWith;
        data.height = has(data, 'height') && data.height !== '' ? this.checkSize(data.height) : defaultHeight;
        if (element && data.type == 'image') {
          data._hasCustomWidth = element.dataset.width ? true : false;
          data._hasCustomHeight = element.dataset.height ? true : false;
        }
        return data;
      }
    }, {
      key: "checkSize",
      value: function checkSize(size) {
        return isNumber(size) ? "".concat(size, "p***REMOVED***") : size;
      }
    }, {
      key: "sanitizeValue",
      value: function sanitizeValue(val) {
        if (val !== 'true' && val !== 'false') {
          return val;
        }
        return val === 'true';
      }
    }]);
  }();

  var Slide = function () {
    function Slide(el, instance, inde***REMOVED***) {
      _classCallCheck(this, Slide);
      this.element = el;
      this.instance = instance;
      this.inde***REMOVED*** = inde***REMOVED***;
    }
    return _createClass(Slide, [{
      key: "setContent",
      value: function setContent() {
        var _this = this;
        var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (hasClass(slide, 'loaded')) {
          return false;
        }
        var settings = this.instance.settings;
        var slideConfig = this.slideConfig;
        var isMobileDevice = isMobile();
        if (isFunction(settings.beforeSlideLoad)) {
          settings.beforeSlideLoad({
            inde***REMOVED***: this.inde***REMOVED***,
            slide: slide,
            player: false
          });
        }
        var type = slideConfig.type;
        var position = slideConfig.descPosition;
        var slideMedia = slide.querySelector('.gslide-media');
        var slideTitle = slide.querySelector('.gslide-title');
        var slideTe***REMOVED***t = slide.querySelector('.gslide-desc');
        var slideDesc = slide.querySelector('.gdesc-inner');
        var finalCallback = callback;
        var titleID = 'gSlideTitle_' + this.inde***REMOVED***;
        var te***REMOVED***tID = 'gSlideDesc_' + this.inde***REMOVED***;
        if (isFunction(settings.afterSlideLoad)) {
          finalCallback = function finalCallback() {
            if (isFunction(callback)) {
              callback();
            }
            settings.afterSlideLoad({
              inde***REMOVED***: _this.inde***REMOVED***,
              slide: slide,
              player: _this.instance.getSlidePlayerInstance(_this.inde***REMOVED***)
            });
          };
        }
        if (slideConfig.title == '' && slideConfig.description == '') {
          if (slideDesc) {
            slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
          }
        } else {
          if (slideTitle && slideConfig.title !== '') {
            slideTitle.id = titleID;
            slideTitle.innerHTML = slideConfig.title;
          } else {
            slideTitle.parentNode.removeChild(slideTitle);
          }
          if (slideTe***REMOVED***t && slideConfig.description !== '') {
            slideTe***REMOVED***t.id = te***REMOVED***tID;
            if (isMobileDevice && settings.moreLength > 0) {
              slideConfig.smallDescription = this.slideShortDesc(slideConfig.description, settings.moreLength, settings.moreTe***REMOVED***t);
              slideTe***REMOVED***t.innerHTML = slideConfig.smallDescription;
              this.descriptionEvents(slideTe***REMOVED***t, slideConfig);
            } else {
              slideTe***REMOVED***t.innerHTML = slideConfig.description;
            }
          } else {
            slideTe***REMOVED***t.parentNode.removeChild(slideTe***REMOVED***t);
          }
          addClass(slideMedia.parentNode, "desc-".concat(position));
          addClass(slideDesc.parentNode, "description-".concat(position));
        }
        addClass(slideMedia, "gslide-".concat(type));
        addClass(slide, 'loaded');
        if (type === 'video') {
          slideVideo.apply(this.instance, [slide, slideConfig, this.inde***REMOVED***, finalCallback]);
          return;
        }
        if (type === 'e***REMOVED***ternal') {
          slideIframe.apply(this, [slide, slideConfig, this.inde***REMOVED***, finalCallback]);
          return;
        }
        if (type === 'inline') {
          slideInline.apply(this.instance, [slide, slideConfig, this.inde***REMOVED***, finalCallback]);
          if (slideConfig.draggable) {
            new DragSlides({
              dragEl: slide.querySelector('.gslide-inline'),
              toleranceX: settings.dragToleranceX,
              toleranceY: settings.dragToleranceY,
              slide: slide,
              instance: this.instance
            });
          }
          return;
        }
        if (type === 'image') {
          slideImage(slide, slideConfig, this.inde***REMOVED***, function () {
            var img = slide.querySelector('img');
            if (slideConfig.draggable) {
              new DragSlides({
                dragEl: img,
                toleranceX: settings.dragToleranceX,
                toleranceY: settings.dragToleranceY,
                slide: slide,
                instance: _this.instance
              });
            }
            if (slideConfig.zoomable && img.naturalWidth > img.offsetWidth) {
              addClass(img, 'zoomable');
              new ZoomImages(img, slide, function () {
                _this.instance.resize();
              });
            }
            if (isFunction(finalCallback)) {
              finalCallback();
            }
          });
          return;
        }
        if (isFunction(finalCallback)) {
          finalCallback();
        }
      }
    }, {
      key: "slideShortDesc",
      value: function slideShortDesc(string) {
        var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
        var wordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var div = document.createElement('div');
        div.innerHTML = string;
        var cleanedString = div.innerTe***REMOVED***t;
        var useWordBoundary = wordBoundary;
        string = cleanedString.trim();
        if (string.length <= n) {
          return string;
        }
        var subString = string.substr(0, n - 1);
        if (!useWordBoundary) {
          return subString;
        }
        div = null;
        return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>';
      }
    }, {
      key: "descriptionEvents",
      value: function descriptionEvents(desc, data) {
        var _this2 = this;
        var moreLink = desc.querySelector('.desc-more');
        if (!moreLink) {
          return false;
        }
        addEvent('click', {
          onElement: moreLink,
          withCallback: function withCallback(event, target) {
            event.preventDefault();
            var body = document.body;
            var desc = closest(target, '.gslide-desc');
            if (!desc) {
              return false;
            }
            desc.innerHTML = data.description;
            addClass(body, 'gdesc-open');
            var shortEvent = addEvent('click', {
              onElement: [body, closest(desc, '.gslide-description')],
              withCallback: function withCallback(event, target) {
                if (event.target.nodeName.toLowerCase() !== 'a') {
                  removeClass(body, 'gdesc-open');
                  addClass(body, 'gdesc-closed');
                  desc.innerHTML = data.smallDescription;
                  _this2.descriptionEvents(desc, data);
                  setTimeout(function () {
                    removeClass(body, 'gdesc-closed');
                  }, 400);
                  shortEvent.destroy();
                }
              }
            });
          }
        });
      }
    }, {
      key: "create",
      value: function create() {
        return createHTML(this.instance.settings.slideHTML);
      }
    }, {
      key: "getConfig",
      value: function getConfig() {
        if (!isNode(this.element) && !this.element.hasOwnProperty('draggable')) {
          this.element.draggable = this.instance.settings.draggable;
        }
        var parser = new SlideConfigParser(this.instance.settings.slideE***REMOVED***traAttributes);
        this.slideConfig = parser.parseConfig(this.element, this.instance.settings);
        return this.slideConfig;
      }
    }]);
  }();

  function getLen(v) {
    return Math.sqrt(v.***REMOVED*** * v.***REMOVED*** + v.y * v.y);
  }
  function dot(v1, v2) {
    return v1.***REMOVED*** * v2.***REMOVED*** + v1.y * v2.y;
  }
  function getAngle(v1, v2) {
    var mr = getLen(v1) * getLen(v2);
    if (mr === 0) {
      return 0;
    }
    var r = dot(v1, v2) / mr;
    if (r > 1) {
      r = 1;
    }
    return Math.acos(r);
  }
  function cross(v1, v2) {
    return v1.***REMOVED*** * v2.y - v2.***REMOVED*** * v1.y;
  }
  function getRotateAngle(v1, v2) {
    var angle = getAngle(v1, v2);
    if (cross(v1, v2) > 0) {
      angle *= -1;
    }
    return angle * 180 / Math.PI;
  }
  var EventsHandlerAdmin = function () {
    function EventsHandlerAdmin(el) {
      _classCallCheck(this, EventsHandlerAdmin);
      this.handlers = [];
      this.el = el;
    }
    return _createClass(EventsHandlerAdmin, [{
      key: "add",
      value: function add(handler) {
        this.handlers.push(handler);
      }
    }, {
      key: "del",
      value: function del(handler) {
        if (!handler) {
          this.handlers = [];
        }
        for (var i = this.handlers.length; i >= 0; i--) {
          if (this.handlers[i] === handler) {
            this.handlers.splice(i, 1);
          }
        }
      }
    }, {
      key: "dispatch",
      value: function dispatch() {
        for (var i = 0, len = this.handlers.length; i < len; i++) {
          var handler = this.handlers[i];
          if (typeof handler === 'function') {
            handler.apply(this.el, arguments);
          }
        }
      }
    }]);
  }();
  function wrapFunc(el, handler) {
    var EventshandlerAdmin = new EventsHandlerAdmin(el);
    EventshandlerAdmin.add(handler);
    return EventshandlerAdmin;
  }
  var TouchEvents = function () {
    function TouchEvents(el, option) {
      _classCallCheck(this, TouchEvents);
      this.element = typeof el == 'string' ? document.querySelector(el) : el;
      this.start = this.start.bind(this);
      this.move = this.move.bind(this);
      this.end = this.end.bind(this);
      this.cancel = this.cancel.bind(this);
      this.element.addEventListener('touchstart', this.start, false);
      this.element.addEventListener('touchmove', this.move, false);
      this.element.addEventListener('touchend', this.end, false);
      this.element.addEventListener('touchcancel', this.cancel, false);
      this.preV = {
        ***REMOVED***: null,
        y: null
      };
      this.pinchStartLen = null;
      this.zoom = 1;
      this.isDoubleTap = false;
      var noop = function noop() {};
      this.rotate = wrapFunc(this.element, option.rotate || noop);
      this.touchStart = wrapFunc(this.element, option.touchStart || noop);
      this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
      this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
      this.pinch = wrapFunc(this.element, option.pinch || noop);
      this.swipe = wrapFunc(this.element, option.swipe || noop);
      this.tap = wrapFunc(this.element, option.tap || noop);
      this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
      this.longTap = wrapFunc(this.element, option.longTap || noop);
      this.singleTap = wrapFunc(this.element, option.singleTap || noop);
      this.pressMove = wrapFunc(this.element, option.pressMove || noop);
      this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop);
      this.touchMove = wrapFunc(this.element, option.touchMove || noop);
      this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
      this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);
      this.translateContainer = this.element;
      this._cancelAllHandler = this.cancelAll.bind(this);
      window.addEventListener('scroll', this._cancelAllHandler);
      this.delta = null;
      this.last = null;
      this.now = null;
      this.tapTimeout = null;
      this.singleTapTimeout = null;
      this.longTapTimeout = null;
      this.swipeTimeout = null;
      this.***REMOVED***1 = this.***REMOVED***2 = this.y1 = this.y2 = null;
      this.preTapPosition = {
        ***REMOVED***: null,
        y: null
      };
    }
    return _createClass(TouchEvents, [{
      key: "start",
      value: function start(evt) {
        if (!evt.touches) {
          return;
        }
        var ignoreDragFor = ['a', 'button', 'input'];
        if (evt.target && evt.target.nodeName && ignoreDragFor.inde***REMOVED***Of(evt.target.nodeName.toLowerCase()) >= 0) {
          console.log('ignore drag for this touched element', evt.target.nodeName.toLowerCase());
          return;
        }
        this.now = Date.now();
        this.***REMOVED***1 = evt.touches[0].pageX;
        this.y1 = evt.touches[0].pageY;
        this.delta = this.now - (this.last || this.now);
        this.touchStart.dispatch(evt, this.element);
        if (this.preTapPosition.***REMOVED*** !== null) {
          this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.***REMOVED*** - this.***REMOVED***1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30;
          if (this.isDoubleTap) {
            clearTimeout(this.singleTapTimeout);
          }
        }
        this.preTapPosition.***REMOVED*** = this.***REMOVED***1;
        this.preTapPosition.y = this.y1;
        this.last = this.now;
        var preV = this.preV,
          len = evt.touches.length;
        if (len > 1) {
          this._cancelLongTap();
          this._cancelSingleTap();
          var v = {
            ***REMOVED***: evt.touches[1].pageX - this.***REMOVED***1,
            y: evt.touches[1].pageY - this.y1
          };
          preV.***REMOVED*** = v.***REMOVED***;
          preV.y = v.y;
          this.pinchStartLen = getLen(preV);
          this.multipointStart.dispatch(evt, this.element);
        }
        this._preventTap = false;
        this.longTapTimeout = setTimeout(function () {
          this.longTap.dispatch(evt, this.element);
          this._preventTap = true;
        }.bind(this), 750);
      }
    }, {
      key: "move",
      value: function move(evt) {
        if (!evt.touches) {
          return;
        }
        var preV = this.preV,
          len = evt.touches.length,
          currentX = evt.touches[0].pageX,
          currentY = evt.touches[0].pageY;
        this.isDoubleTap = false;
        if (len > 1) {
          var sCurrentX = evt.touches[1].pageX,
            sCurrentY = evt.touches[1].pageY;
          var v = {
            ***REMOVED***: evt.touches[1].pageX - currentX,
            y: evt.touches[1].pageY - currentY
          };
          if (preV.***REMOVED*** !== null) {
            if (this.pinchStartLen > 0) {
              evt.zoom = getLen(v) / this.pinchStartLen;
              this.pinch.dispatch(evt, this.element);
            }
            evt.angle = getRotateAngle(v, preV);
            this.rotate.dispatch(evt, this.element);
          }
          preV.***REMOVED*** = v.***REMOVED***;
          preV.y = v.y;
          if (this.***REMOVED***2 !== null && this.s***REMOVED***2 !== null) {
            evt.deltaX = (currentX - this.***REMOVED***2 + sCurrentX - this.s***REMOVED***2) / 2;
            evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
          } else {
            evt.deltaX = 0;
            evt.deltaY = 0;
          }
          this.twoFingerPressMove.dispatch(evt, this.element);
          this.s***REMOVED***2 = sCurrentX;
          this.sy2 = sCurrentY;
        } else {
          if (this.***REMOVED***2 !== null) {
            evt.deltaX = currentX - this.***REMOVED***2;
            evt.deltaY = currentY - this.y2;
            var movedX = Math.abs(this.***REMOVED***1 - this.***REMOVED***2),
              movedY = Math.abs(this.y1 - this.y2);
            if (movedX > 10 || movedY > 10) {
              this._preventTap = true;
            }
          } else {
            evt.deltaX = 0;
            evt.deltaY = 0;
          }
          this.pressMove.dispatch(evt, this.element);
        }
        this.touchMove.dispatch(evt, this.element);
        this._cancelLongTap();
        this.***REMOVED***2 = currentX;
        this.y2 = currentY;
        if (len > 1) {
          evt.preventDefault();
        }
      }
    }, {
      key: "end",
      value: function end(evt) {
        if (!evt.changedTouches) {
          return;
        }
        this._cancelLongTap();
        var self = this;
        if (evt.touches.length < 2) {
          this.multipointEnd.dispatch(evt, this.element);
          this.s***REMOVED***2 = this.sy2 = null;
        }
        if (this.***REMOVED***2 && Math.abs(this.***REMOVED***1 - this.***REMOVED***2) > 30 || this.y2 && Math.abs(this.y1 - this.y2) > 30) {
          evt.direction = this._swipeDirection(this.***REMOVED***1, this.***REMOVED***2, this.y1, this.y2);
          this.swipeTimeout = setTimeout(function () {
            self.swipe.dispatch(evt, self.element);
          }, 0);
        } else {
          this.tapTimeout = setTimeout(function () {
            if (!self._preventTap) {
              self.tap.dispatch(evt, self.element);
            }
            if (self.isDoubleTap) {
              self.doubleTap.dispatch(evt, self.element);
              self.isDoubleTap = false;
            }
          }, 0);
          if (!self.isDoubleTap) {
            self.singleTapTimeout = setTimeout(function () {
              self.singleTap.dispatch(evt, self.element);
            }, 250);
          }
        }
        this.touchEnd.dispatch(evt, this.element);
        this.preV.***REMOVED*** = 0;
        this.preV.y = 0;
        this.zoom = 1;
        this.pinchStartLen = null;
        this.***REMOVED***1 = this.***REMOVED***2 = this.y1 = this.y2 = null;
      }
    }, {
      key: "cancelAll",
      value: function cancelAll() {
        this._preventTap = true;
        clearTimeout(this.singleTapTimeout);
        clearTimeout(this.tapTimeout);
        clearTimeout(this.longTapTimeout);
        clearTimeout(this.swipeTimeout);
      }
    }, {
      key: "cancel",
      value: function cancel(evt) {
        this.cancelAll();
        this.touchCancel.dispatch(evt, this.element);
      }
    }, {
      key: "_cancelLongTap",
      value: function _cancelLongTap() {
        clearTimeout(this.longTapTimeout);
      }
    }, {
      key: "_cancelSingleTap",
      value: function _cancelSingleTap() {
        clearTimeout(this.singleTapTimeout);
      }
    }, {
      key: "_swipeDirection",
      value: function _swipeDirection(***REMOVED***1, ***REMOVED***2, y1, y2) {
        return Math.abs(***REMOVED***1 - ***REMOVED***2) >= Math.abs(y1 - y2) ? ***REMOVED***1 - ***REMOVED***2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
      }
    }, {
      key: "on",
      value: function on(evt, handler) {
        if (this[evt]) {
          this[evt].add(handler);
        }
      }
    }, {
      key: "off",
      value: function off(evt, handler) {
        if (this[evt]) {
          this[evt].del(handler);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this.singleTapTimeout) {
          clearTimeout(this.singleTapTimeout);
        }
        if (this.tapTimeout) {
          clearTimeout(this.tapTimeout);
        }
        if (this.longTapTimeout) {
          clearTimeout(this.longTapTimeout);
        }
        if (this.swipeTimeout) {
          clearTimeout(this.swipeTimeout);
        }
        this.element.removeEventListener('touchstart', this.start);
        this.element.removeEventListener('touchmove', this.move);
        this.element.removeEventListener('touchend', this.end);
        this.element.removeEventListener('touchcancel', this.cancel);
        this.rotate.del();
        this.touchStart.del();
        this.multipointStart.del();
        this.multipointEnd.del();
        this.pinch.del();
        this.swipe.del();
        this.tap.del();
        this.doubleTap.del();
        this.longTap.del();
        this.singleTap.del();
        this.pressMove.del();
        this.twoFingerPressMove.del();
        this.touchMove.del();
        this.touchEnd.del();
        this.touchCancel.del();
        this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.***REMOVED***1 = this.***REMOVED***2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;
        window.removeEventListener('scroll', this._cancelAllHandler);
        return null;
      }
    }]);
  }();

  function resetSlideMove(slide) {
    var transitionEnd = whichTransitionEvent();
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var media = hasClass(slide, 'gslide-media') ? slide : slide.querySelector('.gslide-media');
    var container = closest(media, '.ginner-container');
    var desc = slide.querySelector('.gslide-description');
    if (windowWidth > 769) {
      media = container;
    }
    addClass(media, 'greset');
    cssTransform(media, 'translate3d(0, 0, 0)');
    addEvent(transitionEnd, {
      onElement: media,
      once: true,
      withCallback: function withCallback(event, target) {
        removeClass(media, 'greset');
      }
    });
    media.style.opacity = '';
    if (desc) {
      desc.style.opacity = '';
    }
  }
  function touchNavigation(instance) {
    if (instance.events.hasOwnProperty('touch')) {
      return false;
    }
    var winSize = windowSize();
    var winWidth = winSize.width;
    var winHeight = winSize.height;
    var process = false;
    var currentSlide = null;
    var media = null;
    var mediaImage = null;
    var doingMove = false;
    var initScale = 1;
    var ma***REMOVED***Scale = 4.5;
    var currentScale = 1;
    var doingZoom = false;
    var imageZoomed = false;
    var zoomedPosX = null;
    var zoomedPosY = null;
    var lastZoomedPosX = null;
    var lastZoomedPosY = null;
    var hDistance;
    var vDistance;
    var hDistancePercent = 0;
    var vDistancePercent = 0;
    var vSwipe = false;
    var hSwipe = false;
    var startCoords = {};
    var endCoords = {};
    var ***REMOVED***Down = 0;
    var yDown = 0;
    var isInlined;
    var sliderWrapper = document.getElementById('glightbo***REMOVED***-slider');
    var overlay = document.querySelector('.goverlay');
    var touchInstance = new TouchEvents(sliderWrapper, {
      touchStart: function touchStart(e) {
        process = true;
        if (hasClass(e.targetTouches[0].target, 'ginner-container') || closest(e.targetTouches[0].target, '.gslide-desc') || e.targetTouches[0].target.nodeName.toLowerCase() == 'a') {
          process = false;
        }
        if (closest(e.targetTouches[0].target, '.gslide-inline') && !hasClass(e.targetTouches[0].target.parentNode, 'gslide-inline')) {
          process = false;
        }
        if (process) {
          endCoords = e.targetTouches[0];
          startCoords.pageX = e.targetTouches[0].pageX;
          startCoords.pageY = e.targetTouches[0].pageY;
          ***REMOVED***Down = e.targetTouches[0].clientX;
          yDown = e.targetTouches[0].clientY;
          currentSlide = instance.activeSlide;
          media = currentSlide.querySelector('.gslide-media');
          isInlined = currentSlide.querySelector('.gslide-inline');
          mediaImage = null;
          if (hasClass(media, 'gslide-image')) {
            mediaImage = media.querySelector('img');
          }
          var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          if (windowWidth > 769) {
            media = currentSlide.querySelector('.ginner-container');
          }
          removeClass(overlay, 'greset');
          if (e.pageX > 20 && e.pageX < window.innerWidth - 20) {
            return;
          }
          e.preventDefault();
        }
      },
      touchMove: function touchMove(e) {
        if (!process) {
          return;
        }
        endCoords = e.targetTouches[0];
        if (doingZoom || imageZoomed) {
          return;
        }
        if (isInlined && isInlined.offsetHeight > winHeight) {
          var moved = startCoords.pageX - endCoords.pageX;
          if (Math.abs(moved) <= 13) {
            return false;
          }
        }
        doingMove = true;
        var ***REMOVED***Up = e.targetTouches[0].clientX;
        var yUp = e.targetTouches[0].clientY;
        var ***REMOVED***Diff = ***REMOVED***Down - ***REMOVED***Up;
        var yDiff = yDown - yUp;
        if (Math.abs(***REMOVED***Diff) > Math.abs(yDiff)) {
          vSwipe = false;
          hSwipe = true;
        } else {
          hSwipe = false;
          vSwipe = true;
        }
        hDistance = endCoords.pageX - startCoords.pageX;
        hDistancePercent = hDistance * 100 / winWidth;
        vDistance = endCoords.pageY - startCoords.pageY;
        vDistancePercent = vDistance * 100 / winHeight;
        var opacity;
        if (vSwipe && mediaImage) {
          opacity = 1 - Math.abs(vDistance) / winHeight;
          overlay.style.opacity = opacity;
          if (instance.settings.touchFollowA***REMOVED***is) {
            hDistancePercent = 0;
          }
        }
        if (hSwipe) {
          opacity = 1 - Math.abs(hDistance) / winWidth;
          media.style.opacity = opacity;
          if (instance.settings.touchFollowA***REMOVED***is) {
            vDistancePercent = 0;
          }
        }
        if (!mediaImage) {
          return cssTransform(media, "translate3d(".concat(hDistancePercent, "%, 0, 0)"));
        }
        cssTransform(media, "translate3d(".concat(hDistancePercent, "%, ").concat(vDistancePercent, "%, 0)"));
      },
      touchEnd: function touchEnd() {
        if (!process) {
          return;
        }
        doingMove = false;
        if (imageZoomed || doingZoom) {
          lastZoomedPosX = zoomedPosX;
          lastZoomedPosY = zoomedPosY;
          return;
        }
        var v = Math.abs(parseInt(vDistancePercent));
        var h = Math.abs(parseInt(hDistancePercent));
        if (v > 29 && mediaImage) {
          instance.close();
          return;
        }
        if (v < 29 && h < 25) {
          addClass(overlay, 'greset');
          overlay.style.opacity = 1;
          return resetSlideMove(media);
        }
      },
      multipointEnd: function multipointEnd() {
        setTimeout(function () {
          doingZoom = false;
        }, 50);
      },
      multipointStart: function multipointStart() {
        doingZoom = true;
        initScale = currentScale ? currentScale : 1;
      },
      pinch: function pinch(evt) {
        if (!mediaImage || doingMove) {
          return false;
        }
        doingZoom = true;
        mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom;
        var scale = initScale * evt.zoom;
        imageZoomed = true;
        if (scale <= 1) {
          imageZoomed = false;
          scale = 1;
          lastZoomedPosY = null;
          lastZoomedPosX = null;
          zoomedPosX = null;
          zoomedPosY = null;
          mediaImage.setAttribute('style', '');
          return;
        }
        if (scale > ma***REMOVED***Scale) {
          scale = ma***REMOVED***Scale;
        }
        mediaImage.style.transform = "scale3d(".concat(scale, ", ").concat(scale, ", 1)");
        currentScale = scale;
      },
      pressMove: function pressMove(e) {
        if (imageZoomed && !doingZoom) {
          var mhDistance = endCoords.pageX - startCoords.pageX;
          var mvDistance = endCoords.pageY - startCoords.pageY;
          if (lastZoomedPosX) {
            mhDistance = mhDistance + lastZoomedPosX;
          }
          if (lastZoomedPosY) {
            mvDistance = mvDistance + lastZoomedPosY;
          }
          zoomedPosX = mhDistance;
          zoomedPosY = mvDistance;
          var style = "translate3d(".concat(mhDistance, "p***REMOVED***, ").concat(mvDistance, "p***REMOVED***, 0)");
          if (currentScale) {
            style += " scale3d(".concat(currentScale, ", ").concat(currentScale, ", 1)");
          }
          cssTransform(mediaImage, style);
        }
      },
      swipe: function swipe(evt) {
        if (imageZoomed) {
          return;
        }
        if (doingZoom) {
          doingZoom = false;
          return;
        }
        if (evt.direction == 'Left') {
          if (instance.inde***REMOVED*** == instance.elements.length - 1) {
            return resetSlideMove(media);
          }
          instance.ne***REMOVED***tSlide();
        }
        if (evt.direction == 'Right') {
          if (instance.inde***REMOVED*** == 0) {
            return resetSlideMove(media);
          }
          instance.prevSlide();
        }
      }
    });
    instance.events['touch'] = touchInstance;
  }

  var _version = '3.3.0';
  var isMobile$1 = isMobile();
  var isTouch$1 = isTouch();
  var html = document.getElementsByTagName('html')[0];
  var defaults = {
    selector: '.glightbo***REMOVED***',
    elements: null,
    skin: 'clean',
    theme: 'clean',
    closeButton: true,
    startAt: null,
    autoplayVideos: true,
    autofocusVideos: true,
    descPosition: 'bottom',
    width: '900p***REMOVED***',
    height: '506p***REMOVED***',
    videosWidth: '960p***REMOVED***',
    beforeSlideChange: null,
    afterSlideChange: null,
    beforeSlideLoad: null,
    afterSlideLoad: null,
    slideInserted: null,
    slideRemoved: null,
    slideE***REMOVED***traAttributes: null,
    onOpen: null,
    onClose: null,
    loop: false,
    zoomable: true,
    draggable: true,
    dragAutoSnap: false,
    dragToleranceX: 40,
    dragToleranceY: 65,
    preload: true,
    oneSlidePerOpen: false,
    touchNavigation: true,
    touchFollowA***REMOVED***is: true,
    keyboardNavigation: true,
    closeOnOutsideClick: true,
    plugins: false,
    plyr: {
      css: 'https://cdn.plyr.io/3.6.12/plyr.css',
      js: 'https://cdn.plyr.io/3.6.12/plyr.js',
      config: {
        ratio: '16:9',
        fullscreen: {
          enabled: true,
          iosNative: true
        },
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3
        },
        vimeo: {
          byline: false,
          portrait: false,
          title: false,
          transparent: false
        }
      }
    },
    openEffect: 'zoom',
    closeEffect: 'zoom',
    slideEffect: 'slide',
    moreTe***REMOVED***t: 'See more',
    moreLength: 60,
    cssEfects: {
      fade: {
        "in": 'fadeIn',
        out: 'fadeOut'
      },
      zoom: {
        "in": 'zoomIn',
        out: 'zoomOut'
      },
      slide: {
        "in": 'slideInRight',
        out: 'slideOutLeft'
      },
      slideBack: {
        "in": 'slideInLeft',
        out: 'slideOutRight'
      },
      none: {
        "in": 'none',
        out: 'none'
      }
    },
    svg: {
      close: '<svg ***REMOVED***mlns="http://www.w3.org/2000/svg" ***REMOVED***mlns:***REMOVED***link="http://www.w3.org/1999/***REMOVED***link" ***REMOVED***="0p***REMOVED***" y="0p***REMOVED***" viewBo***REMOVED***="0 0 512 512" ***REMOVED***ml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
      ne***REMOVED***t: '<svg ***REMOVED***mlns="http://www.w3.org/2000/svg" ***REMOVED***mlns:***REMOVED***link="http://www.w3.org/1999/***REMOVED***link" ***REMOVED***="0p***REMOVED***" y="0p***REMOVED***" viewBo***REMOVED***="0 0 477.175 477.175" ***REMOVED***ml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
      prev: '<svg ***REMOVED***mlns="http://www.w3.org/2000/svg" ***REMOVED***mlns:***REMOVED***link="http://www.w3.org/1999/***REMOVED***link" ***REMOVED***="0p***REMOVED***" y="0p***REMOVED***" viewBo***REMOVED***="0 0 477.175 477.175" ***REMOVED***ml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
    }
  };
  defaults.slideHTML = "<div class=\"gslide\">\n    <div class=\"gslide-inner-content\">\n        <div class=\"ginner-container\">\n            <div class=\"gslide-media\">\n            </div>\n            <div class=\"gslide-description\">\n                <div class=\"gdesc-inner\">\n                    <h4 class=\"gslide-title\"></h4>\n                    <div class=\"gslide-desc\"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
  defaults.lightbo***REMOVED***HTML = "<div id=\"glightbo***REMOVED***-body\" class=\"glightbo***REMOVED***-container\" tabinde***REMOVED***=\"-1\" role=\"dialog\" aria-hidden=\"false\">\n    <div class=\"gloader visible\"></div>\n    <div class=\"goverlay\"></div>\n    <div class=\"gcontainer\">\n    <div id=\"glightbo***REMOVED***-slider\" class=\"gslider\"></div>\n    <button class=\"gclose gbtn\" aria-label=\"Close\" data-taborder=\"3\">{closeSVG}</button>\n    <button class=\"gprev gbtn\" aria-label=\"Previous\" data-taborder=\"2\">{prevSVG}</button>\n    <button class=\"gne***REMOVED***t gbtn\" aria-label=\"Ne***REMOVED***t\" data-taborder=\"1\">{ne***REMOVED***tSVG}</button>\n</div>\n</div>";
  var Glightbo***REMOVED***Init = function () {
    function Glightbo***REMOVED***Init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, Glightbo***REMOVED***Init);
      this.customOptions = options;
      this.settings = e***REMOVED***tend(defaults, options);
      this.effectsClasses = this.getAnimationClasses();
      this.videoPlayers = {};
      this.apiEvents = [];
      this.fullElementsList = false;
    }
    return _createClass(Glightbo***REMOVED***Init, [{
      key: "init",
      value: function init() {
        var _this = this;
        var selector = this.getSelector();
        if (selector) {
          this.baseEvents = addEvent('click', {
            onElement: selector,
            withCallback: function withCallback(e, target) {
              e.preventDefault();
              _this.open(target);
            }
          });
        }
        this.elements = this.getElements();
      }
    }, {
      key: "open",
      value: function open() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var startAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (this.elements.length === 0) {
          return false;
        }
        this.activeSlide = null;
        this.prevActiveSlideInde***REMOVED*** = null;
        this.prevActiveSlide = null;
        var inde***REMOVED*** = isNumber(startAt) ? startAt : this.settings.startAt;
        if (isNode(element)) {
          var gallery = element.getAttribute('data-gallery');
          if (gallery) {
            this.fullElementsList = this.elements;
            this.elements = this.getGalleryElements(this.elements, gallery);
          }
          if (isNil(inde***REMOVED***)) {
            inde***REMOVED*** = this.getElementInde***REMOVED***(element);
            if (inde***REMOVED*** < 0) {
              inde***REMOVED*** = 0;
            }
          }
        }
        if (!isNumber(inde***REMOVED***)) {
          inde***REMOVED*** = 0;
        }
        this.build();
        animateElement(this.overlay, this.settings.openEffect === 'none' ? 'none' : this.settings.cssEfects.fade["in"]);
        var body = document.body;
        var scrollBar = window.innerWidth - document.documentElement.clientWidth;
        if (scrollBar > 0) {
          var styleSheet = document.createElement('style');
          styleSheet.type = 'te***REMOVED***t/css';
          styleSheet.className = 'gcss-styles';
          styleSheet.innerTe***REMOVED***t = ".gscrollbar-fi***REMOVED***er {margin-right: ".concat(scrollBar, "p***REMOVED***}");
          document.head.appendChild(styleSheet);
          addClass(body, 'gscrollbar-fi***REMOVED***er');
        }
        addClass(body, 'glightbo***REMOVED***-open');
        addClass(html, 'glightbo***REMOVED***-open');
        if (isMobile$1) {
          addClass(document.body, 'glightbo***REMOVED***-mobile');
          this.settings.slideEffect = 'slide';
        }
        this.showSlide(inde***REMOVED***, true);
        if (this.elements.length === 1) {
          addClass(this.prevButton, 'glightbo***REMOVED***-button-hidden');
          addClass(this.ne***REMOVED***tButton, 'glightbo***REMOVED***-button-hidden');
        } else {
          removeClass(this.prevButton, 'glightbo***REMOVED***-button-hidden');
          removeClass(this.ne***REMOVED***tButton, 'glightbo***REMOVED***-button-hidden');
        }
        this.lightbo***REMOVED***Open = true;
        this.trigger('open');
        if (isFunction(this.settings.onOpen)) {
          this.settings.onOpen();
        }
        if (isTouch$1 && this.settings.touchNavigation) {
          touchNavigation(this);
        }
        if (this.settings.keyboardNavigation) {
          keyboardNavigation(this);
        }
      }
    }, {
      key: "openAt",
      value: function openAt() {
        var inde***REMOVED*** = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.open(null, inde***REMOVED***);
      }
    }, {
      key: "showSlide",
      value: function showSlide() {
        var _this2 = this;
        var inde***REMOVED*** = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        show(this.loader);
        this.inde***REMOVED*** = parseInt(inde***REMOVED***);
        var current = this.slidesContainer.querySelector('.current');
        if (current) {
          removeClass(current, 'current');
        }
        this.slideAnimateOut();
        var slideNode = this.slidesContainer.querySelectorAll('.gslide')[inde***REMOVED***];
        if (hasClass(slideNode, 'loaded')) {
          this.slideAnimateIn(slideNode, first);
          hide(this.loader);
        } else {
          show(this.loader);
          var slide = this.elements[inde***REMOVED***];
          var slideData = {
            inde***REMOVED***: this.inde***REMOVED***,
            slide: slideNode,
            slideNode: slideNode,
            slideConfig: slide.slideConfig,
            slideInde***REMOVED***: this.inde***REMOVED***,
            trigger: slide.node,
            player: null
          };
          this.trigger('slide_before_load', slideData);
          slide.instance.setContent(slideNode, function () {
            hide(_this2.loader);
            _this2.resize();
            _this2.slideAnimateIn(slideNode, first);
            _this2.trigger('slide_after_load', slideData);
          });
        }
        this.slideDescription = slideNode.querySelector('.gslide-description');
        this.slideDescriptionContained = this.slideDescription && hasClass(this.slideDescription.parentNode, 'gslide-media');
        if (this.settings.preload) {
          this.preloadSlide(inde***REMOVED*** + 1);
          this.preloadSlide(inde***REMOVED*** - 1);
        }
        this.updateNavigationClasses();
        this.activeSlide = slideNode;
      }
    }, {
      key: "preloadSlide",
      value: function preloadSlide(inde***REMOVED***) {
        var _this3 = this;
        if (inde***REMOVED*** < 0 || inde***REMOVED*** > this.elements.length - 1) {
          return false;
        }
        if (isNil(this.elements[inde***REMOVED***])) {
          return false;
        }
        var slideNode = this.slidesContainer.querySelectorAll('.gslide')[inde***REMOVED***];
        if (hasClass(slideNode, 'loaded')) {
          return false;
        }
        var slide = this.elements[inde***REMOVED***];
        var type = slide.type;
        var slideData = {
          inde***REMOVED***: inde***REMOVED***,
          slide: slideNode,
          slideNode: slideNode,
          slideConfig: slide.slideConfig,
          slideInde***REMOVED***: inde***REMOVED***,
          trigger: slide.node,
          player: null
        };
        this.trigger('slide_before_load', slideData);
        if (type === 'video' || type === 'e***REMOVED***ternal') {
          setTimeout(function () {
            slide.instance.setContent(slideNode, function () {
              _this3.trigger('slide_after_load', slideData);
            });
          }, 200);
        } else {
          slide.instance.setContent(slideNode, function () {
            _this3.trigger('slide_after_load', slideData);
          });
        }
      }
    }, {
      key: "prevSlide",
      value: function prevSlide() {
        this.goToSlide(this.inde***REMOVED*** - 1);
      }
    }, {
      key: "ne***REMOVED***tSlide",
      value: function ne***REMOVED***tSlide() {
        this.goToSlide(this.inde***REMOVED*** + 1);
      }
    }, {
      key: "goToSlide",
      value: function goToSlide() {
        var inde***REMOVED*** = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this.prevActiveSlide = this.activeSlide;
        this.prevActiveSlideInde***REMOVED*** = this.inde***REMOVED***;
        if (!this.loop() && (inde***REMOVED*** < 0 || inde***REMOVED*** > this.elements.length - 1)) {
          return false;
        }
        if (inde***REMOVED*** < 0) {
          inde***REMOVED*** = this.elements.length - 1;
        } else if (inde***REMOVED*** >= this.elements.length) {
          inde***REMOVED*** = 0;
        }
        this.showSlide(inde***REMOVED***);
      }
    }, {
      key: "insertSlide",
      value: function insertSlide() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var inde***REMOVED*** = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
        if (inde***REMOVED*** < 0) {
          inde***REMOVED*** = this.elements.length;
        }
        var slide = new Slide(config, this, inde***REMOVED***);
        var data = slide.getConfig();
        var slideInfo = e***REMOVED***tend({}, data);
        var newSlide = slide.create();
        var totalSlides = this.elements.length - 1;
        slideInfo.inde***REMOVED*** = inde***REMOVED***;
        slideInfo.node = false;
        slideInfo.instance = slide;
        slideInfo.slideConfig = data;
        this.elements.splice(inde***REMOVED***, 0, slideInfo);
        var addedSlideNode = null;
        var addedSlidePlayer = null;
        if (this.slidesContainer) {
          if (inde***REMOVED*** > totalSlides) {
            this.slidesContainer.appendChild(newSlide);
          } else {
            var e***REMOVED***istingSlide = this.slidesContainer.querySelectorAll('.gslide')[inde***REMOVED***];
            this.slidesContainer.insertBefore(newSlide, e***REMOVED***istingSlide);
          }
          if (this.settings.preload && this.inde***REMOVED*** == 0 && inde***REMOVED*** == 0 || this.inde***REMOVED*** - 1 == inde***REMOVED*** || this.inde***REMOVED*** + 1 == inde***REMOVED***) {
            this.preloadSlide(inde***REMOVED***);
          }
          if (this.inde***REMOVED*** === 0 && inde***REMOVED*** === 0) {
            this.inde***REMOVED*** = 1;
          }
          this.updateNavigationClasses();
          addedSlideNode = this.slidesContainer.querySelectorAll('.gslide')[inde***REMOVED***];
          addedSlidePlayer = this.getSlidePlayerInstance(inde***REMOVED***);
          slideInfo.slideNode = addedSlideNode;
        }
        this.trigger('slide_inserted', {
          inde***REMOVED***: inde***REMOVED***,
          slide: addedSlideNode,
          slideNode: addedSlideNode,
          slideConfig: data,
          slideInde***REMOVED***: inde***REMOVED***,
          trigger: null,
          player: addedSlidePlayer
        });
        if (isFunction(this.settings.slideInserted)) {
          this.settings.slideInserted({
            inde***REMOVED***: inde***REMOVED***,
            slide: addedSlideNode,
            player: addedSlidePlayer
          });
        }
      }
    }, {
      key: "removeSlide",
      value: function removeSlide() {
        var inde***REMOVED*** = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
        if (inde***REMOVED*** < 0 || inde***REMOVED*** > this.elements.length - 1) {
          return false;
        }
        var slide = this.slidesContainer && this.slidesContainer.querySelectorAll('.gslide')[inde***REMOVED***];
        if (slide) {
          if (this.getActiveSlideInde***REMOVED***() == inde***REMOVED***) {
            if (inde***REMOVED*** == this.elements.length - 1) {
              this.prevSlide();
            } else {
              this.ne***REMOVED***tSlide();
            }
          }
          slide.parentNode.removeChild(slide);
        }
        this.elements.splice(inde***REMOVED***, 1);
        this.trigger('slide_removed', inde***REMOVED***);
        if (isFunction(this.settings.slideRemoved)) {
          this.settings.slideRemoved(inde***REMOVED***);
        }
      }
    }, {
      key: "slideAnimateIn",
      value: function slideAnimateIn(slide, first) {
        var _this4 = this;
        var slideMedia = slide.querySelector('.gslide-media');
        var slideDesc = slide.querySelector('.gslide-description');
        var prevData = {
          inde***REMOVED***: this.prevActiveSlideInde***REMOVED***,
          slide: this.prevActiveSlide,
          slideNode: this.prevActiveSlide,
          slideInde***REMOVED***: this.prevActiveSlide,
          slideConfig: isNil(this.prevActiveSlideInde***REMOVED***) ? null : this.elements[this.prevActiveSlideInde***REMOVED***].slideConfig,
          trigger: isNil(this.prevActiveSlideInde***REMOVED***) ? null : this.elements[this.prevActiveSlideInde***REMOVED***].node,
          player: this.getSlidePlayerInstance(this.prevActiveSlideInde***REMOVED***)
        };
        var ne***REMOVED***tData = {
          inde***REMOVED***: this.inde***REMOVED***,
          slide: this.activeSlide,
          slideNode: this.activeSlide,
          slideConfig: this.elements[this.inde***REMOVED***].slideConfig,
          slideInde***REMOVED***: this.inde***REMOVED***,
          trigger: this.elements[this.inde***REMOVED***].node,
          player: this.getSlidePlayerInstance(this.inde***REMOVED***)
        };
        if (slideMedia.offsetWidth > 0 && slideDesc) {
          hide(slideDesc);
          slideDesc.style.display = '';
        }
        removeClass(slide, this.effectsClasses);
        if (first) {
          animateElement(slide, this.settings.cssEfects[this.settings.openEffect]["in"], function () {
            if (_this4.settings.autoplayVideos) {
              _this4.slidePlayerPlay(slide);
            }
            _this4.trigger('slide_changed', {
              prev: prevData,
              current: ne***REMOVED***tData
            });
            if (isFunction(_this4.settings.afterSlideChange)) {
              _this4.settings.afterSlideChange.apply(_this4, [prevData, ne***REMOVED***tData]);
            }
          });
        } else {
          var effectName = this.settings.slideEffect;
          var animIn = effectName !== 'none' ? this.settings.cssEfects[effectName]["in"] : effectName;
          if (this.prevActiveSlideInde***REMOVED*** > this.inde***REMOVED***) {
            if (this.settings.slideEffect == 'slide') {
              animIn = this.settings.cssEfects.slideBack["in"];
            }
          }
          animateElement(slide, animIn, function () {
            if (_this4.settings.autoplayVideos) {
              _this4.slidePlayerPlay(slide);
            }
            _this4.trigger('slide_changed', {
              prev: prevData,
              current: ne***REMOVED***tData
            });
            if (isFunction(_this4.settings.afterSlideChange)) {
              _this4.settings.afterSlideChange.apply(_this4, [prevData, ne***REMOVED***tData]);
            }
          });
        }
        setTimeout(function () {
          _this4.resize(slide);
        }, 100);
        addClass(slide, 'current');
      }
    }, {
      key: "slideAnimateOut",
      value: function slideAnimateOut() {
        if (!this.prevActiveSlide) {
          return false;
        }
        var prevSlide = this.prevActiveSlide;
        removeClass(prevSlide, this.effectsClasses);
        addClass(prevSlide, 'prev');
        var animation = this.settings.slideEffect;
        var animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation;
        this.slidePlayerPause(prevSlide);
        this.trigger('slide_before_change', {
          prev: {
            inde***REMOVED***: this.prevActiveSlideInde***REMOVED***,
            slide: this.prevActiveSlide,
            slideNode: this.prevActiveSlide,
            slideInde***REMOVED***: this.prevActiveSlideInde***REMOVED***,
            slideConfig: isNil(this.prevActiveSlideInde***REMOVED***) ? null : this.elements[this.prevActiveSlideInde***REMOVED***].slideConfig,
            trigger: isNil(this.prevActiveSlideInde***REMOVED***) ? null : this.elements[this.prevActiveSlideInde***REMOVED***].node,
            player: this.getSlidePlayerInstance(this.prevActiveSlideInde***REMOVED***)
          },
          current: {
            inde***REMOVED***: this.inde***REMOVED***,
            slide: this.activeSlide,
            slideNode: this.activeSlide,
            slideInde***REMOVED***: this.inde***REMOVED***,
            slideConfig: this.elements[this.inde***REMOVED***].slideConfig,
            trigger: this.elements[this.inde***REMOVED***].node,
            player: this.getSlidePlayerInstance(this.inde***REMOVED***)
          }
        });
        if (isFunction(this.settings.beforeSlideChange)) {
          this.settings.beforeSlideChange.apply(this, [{
            inde***REMOVED***: this.prevActiveSlideInde***REMOVED***,
            slide: this.prevActiveSlide,
            player: this.getSlidePlayerInstance(this.prevActiveSlideInde***REMOVED***)
          }, {
            inde***REMOVED***: this.inde***REMOVED***,
            slide: this.activeSlide,
            player: this.getSlidePlayerInstance(this.inde***REMOVED***)
          }]);
        }
        if (this.prevActiveSlideInde***REMOVED*** > this.inde***REMOVED*** && this.settings.slideEffect == 'slide') {
          animOut = this.settings.cssEfects.slideBack.out;
        }
        animateElement(prevSlide, animOut, function () {
          var container = prevSlide.querySelector('.ginner-container');
          var media = prevSlide.querySelector('.gslide-media');
          var desc = prevSlide.querySelector('.gslide-description');
          container.style.transform = '';
          media.style.transform = '';
          removeClass(media, 'greset');
          media.style.opacity = '';
          if (desc) {
            desc.style.opacity = '';
          }
          removeClass(prevSlide, 'prev');
        });
      }
    }, {
      key: "getAllPlayers",
      value: function getAllPlayers() {
        return this.videoPlayers;
      }
    }, {
      key: "getSlidePlayerInstance",
      value: function getSlidePlayerInstance(inde***REMOVED***) {
        var id = 'gvideo' + inde***REMOVED***;
        var videoPlayers = this.getAllPlayers();
        if (has(videoPlayers, id) && videoPlayers[id]) {
          return videoPlayers[id];
        }
        return false;
      }
    }, {
      key: "stopSlideVideo",
      value: function stopSlideVideo(slide) {
        if (isNode(slide)) {
          var node = slide.querySelector('.gvideo-wrapper');
          if (node) {
            slide = node.getAttribute('data-inde***REMOVED***');
          }
        }
        console.log('stopSlideVideo is deprecated, use slidePlayerPause');
        var player = this.getSlidePlayerInstance(slide);
        if (player && player.playing) {
          player.pause();
        }
      }
    }, {
      key: "slidePlayerPause",
      value: function slidePlayerPause(slide) {
        if (isNode(slide)) {
          var node = slide.querySelector('.gvideo-wrapper');
          if (node) {
            slide = node.getAttribute('data-inde***REMOVED***');
          }
        }
        var player = this.getSlidePlayerInstance(slide);
        if (player && player.playing) {
          player.pause();
        }
      }
    }, {
      key: "playSlideVideo",
      value: function playSlideVideo(slide) {
        if (isNode(slide)) {
          var node = slide.querySelector('.gvideo-wrapper');
          if (node) {
            slide = node.getAttribute('data-inde***REMOVED***');
          }
        }
        console.log('playSlideVideo is deprecated, use slidePlayerPlay');
        var player = this.getSlidePlayerInstance(slide);
        if (player && !player.playing) {
          player.play();
        }
      }
    }, {
      key: "slidePlayerPlay",
      value: function slidePlayerPlay(slide) {
        var _this$settings$plyr$c;
        if (isMobile$1 && !((_this$settings$plyr$c = this.settings.plyr.config) !== null && _this$settings$plyr$c !== void 0 && _this$settings$plyr$c.muted)) {
          return;
        }
        if (isNode(slide)) {
          var node = slide.querySelector('.gvideo-wrapper');
          if (node) {
            slide = node.getAttribute('data-inde***REMOVED***');
          }
        }
        var player = this.getSlidePlayerInstance(slide);
        if (player && !player.playing) {
          player.play();
          if (this.settings.autofocusVideos) {
            player.elements.container.focus();
          }
        }
      }
    }, {
      key: "setElements",
      value: function setElements(elements) {
        var _this5 = this;
        this.settings.elements = false;
        var newElements = [];
        if (elements && elements.length) {
          each(elements, function (el, i) {
            var slide = new Slide(el, _this5, i);
            var data = slide.getConfig();
            var slideInfo = e***REMOVED***tend({}, data);
            slideInfo.slideConfig = data;
            slideInfo.instance = slide;
            slideInfo.inde***REMOVED*** = i;
            newElements.push(slideInfo);
          });
        }
        this.elements = newElements;
        if (this.lightbo***REMOVED***Open) {
          this.slidesContainer.innerHTML = '';
          if (this.elements.length) {
            each(this.elements, function () {
              var slide = createHTML(_this5.settings.slideHTML);
              _this5.slidesContainer.appendChild(slide);
            });
            this.showSlide(0, true);
          }
        }
      }
    }, {
      key: "getElementInde***REMOVED***",
      value: function getElementInde***REMOVED***(node) {
        var inde***REMOVED*** = false;
        each(this.elements, function (el, i) {
          if (has(el, 'node') && el.node == node) {
            inde***REMOVED*** = i;
            return true;
          }
        });
        return inde***REMOVED***;
      }
    }, {
      key: "getElements",
      value: function getElements() {
        var _this6 = this;
        var list = [];
        this.elements = this.elements ? this.elements : [];
        if (!isNil(this.settings.elements) && isArray(this.settings.elements) && this.settings.elements.length) {
          each(this.settings.elements, function (el, i) {
            var slide = new Slide(el, _this6, i);
            var elData = slide.getConfig();
            var slideInfo = e***REMOVED***tend({}, elData);
            slideInfo.node = false;
            slideInfo.inde***REMOVED*** = i;
            slideInfo.instance = slide;
            slideInfo.slideConfig = elData;
            list.push(slideInfo);
          });
        }
        var nodes = false;
        var selector = this.getSelector();
        if (selector) {
          nodes = document.querySelectorAll(this.getSelector());
        }
        if (!nodes) {
          return list;
        }
        each(nodes, function (el, i) {
          var slide = new Slide(el, _this6, i);
          var elData = slide.getConfig();
          var slideInfo = e***REMOVED***tend({}, elData);
          slideInfo.node = el;
          slideInfo.inde***REMOVED*** = i;
          slideInfo.instance = slide;
          slideInfo.slideConfig = elData;
          slideInfo.gallery = el.getAttribute('data-gallery');
          list.push(slideInfo);
        });
        return list;
      }
    }, {
      key: "getGalleryElements",
      value: function getGalleryElements(list, gallery) {
        return list.filter(function (el) {
          return el.gallery == gallery;
        });
      }
    }, {
      key: "getSelector",
      value: function getSelector() {
        if (this.settings.elements) {
          return false;
        }
        if (this.settings.selector && this.settings.selector.substring(0, 5) == 'data-') {
          return "*[".concat(this.settings.selector, "]");
        }
        return this.settings.selector;
      }
    }, {
      key: "getActiveSlide",
      value: function getActiveSlide() {
        return this.slidesContainer.querySelectorAll('.gslide')[this.inde***REMOVED***];
      }
    }, {
      key: "getActiveSlideInde***REMOVED***",
      value: function getActiveSlideInde***REMOVED***() {
        return this.inde***REMOVED***;
      }
    }, {
      key: "getAnimationClasses",
      value: function getAnimationClasses() {
        var effects = [];
        for (var key in this.settings.cssEfects) {
          if (this.settings.cssEfects.hasOwnProperty(key)) {
            var effect = this.settings.cssEfects[key];
            effects.push("g".concat(effect["in"]));
            effects.push("g".concat(effect.out));
          }
        }
        return effects.join(' ');
      }
    }, {
      key: "build",
      value: function build() {
        var _this7 = this;
        if (this.built) {
          return false;
        }
        var children = document.body.childNodes;
        var bodyChildElms = [];
        each(children, function (el) {
          if (el.parentNode == document.body && el.nodeName.charAt(0) !== '#' && el.hasAttribute && !el.hasAttribute('aria-hidden')) {
            bodyChildElms.push(el);
            el.setAttribute('aria-hidden', 'true');
          }
        });
        var ne***REMOVED***tSVG = has(this.settings.svg, 'ne***REMOVED***t') ? this.settings.svg.ne***REMOVED***t : '';
        var prevSVG = has(this.settings.svg, 'prev') ? this.settings.svg.prev : '';
        var closeSVG = has(this.settings.svg, 'close') ? this.settings.svg.close : '';
        var lightbo***REMOVED***HTML = this.settings.lightbo***REMOVED***HTML;
        lightbo***REMOVED***HTML = lightbo***REMOVED***HTML.replace(/{ne***REMOVED***tSVG}/g, ne***REMOVED***tSVG);
        lightbo***REMOVED***HTML = lightbo***REMOVED***HTML.replace(/{prevSVG}/g, prevSVG);
        lightbo***REMOVED***HTML = lightbo***REMOVED***HTML.replace(/{closeSVG}/g, closeSVG);
        lightbo***REMOVED***HTML = createHTML(lightbo***REMOVED***HTML);
        document.body.appendChild(lightbo***REMOVED***HTML);
        var modal = document.getElementById('glightbo***REMOVED***-body');
        this.modal = modal;
        var closeButton = modal.querySelector('.gclose');
        this.prevButton = modal.querySelector('.gprev');
        this.ne***REMOVED***tButton = modal.querySelector('.gne***REMOVED***t');
        this.overlay = modal.querySelector('.goverlay');
        this.loader = modal.querySelector('.gloader');
        this.slidesContainer = document.getElementById('glightbo***REMOVED***-slider');
        this.bodyHiddenChildElms = bodyChildElms;
        this.events = {};
        addClass(this.modal, 'glightbo***REMOVED***-' + this.settings.skin);
        if (this.settings.closeButton && closeButton) {
          this.events['close'] = addEvent('click', {
            onElement: closeButton,
            withCallback: function withCallback(e, target) {
              e.preventDefault();
              _this7.close();
            }
          });
        }
        if (closeButton && !this.settings.closeButton) {
          closeButton.parentNode.removeChild(closeButton);
        }
        if (this.ne***REMOVED***tButton) {
          this.events['ne***REMOVED***t'] = addEvent('click', {
            onElement: this.ne***REMOVED***tButton,
            withCallback: function withCallback(e, target) {
              e.preventDefault();
              _this7.ne***REMOVED***tSlide();
            }
          });
        }
        if (this.prevButton) {
          this.events['prev'] = addEvent('click', {
            onElement: this.prevButton,
            withCallback: function withCallback(e, target) {
              e.preventDefault();
              _this7.prevSlide();
            }
          });
        }
        if (this.settings.closeOnOutsideClick) {
          this.events['outClose'] = addEvent('click', {
            onElement: modal,
            withCallback: function withCallback(e, target) {
              if (!_this7.preventOutsideClick && !hasClass(document.body, 'glightbo***REMOVED***-mobile') && !closest(e.target, '.ginner-container')) {
                if (!closest(e.target, '.gbtn') && !hasClass(e.target, 'gne***REMOVED***t') && !hasClass(e.target, 'gprev')) {
                  _this7.close();
                }
              }
            }
          });
        }
        each(this.elements, function (slide, i) {
          _this7.slidesContainer.appendChild(slide.instance.create());
          slide.slideNode = _this7.slidesContainer.querySelectorAll('.gslide')[i];
        });
        if (isTouch$1) {
          addClass(document.body, 'glightbo***REMOVED***-touch');
        }
        this.events['resize'] = addEvent('resize', {
          onElement: window,
          withCallback: function withCallback() {
            _this7.resize();
          }
        });
        this.built = true;
      }
    }, {
      key: "resize",
      value: function resize() {
        var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        slide = !slide ? this.activeSlide : slide;
        if (!slide || hasClass(slide, 'zoomed')) {
          return;
        }
        var winSize = windowSize();
        var video = slide.querySelector('.gvideo-wrapper');
        var image = slide.querySelector('.gslide-image');
        var description = this.slideDescription;
        var winWidth = winSize.width;
        var winHeight = winSize.height;
        if (winWidth <= 768) {
          addClass(document.body, 'glightbo***REMOVED***-mobile');
        } else {
          removeClass(document.body, 'glightbo***REMOVED***-mobile');
        }
        if (!video && !image) {
          return;
        }
        var descriptionResize = false;
        if (description && (hasClass(description, 'description-bottom') || hasClass(description, 'description-top')) && !hasClass(description, 'gabsolute')) {
          descriptionResize = true;
        }
        if (image) {
          if (winWidth <= 768) {
            var imgNode = image.querySelector('img');
          } else if (descriptionResize) {
            var _slideTriggerNode$get;
            var descHeight = description.offsetHeight;
            var _imgNode = image.querySelector('img');
            var slideTriggerNode = this.elements[this.inde***REMOVED***].node;
            var ma***REMOVED***HeightValue = (_slideTriggerNode$get = slideTriggerNode.getAttribute('data-height')) !== null && _slideTriggerNode$get !== void 0 ? _slideTriggerNode$get : '100vh';
            _imgNode.setAttribute('style', "ma***REMOVED***-height: calc(".concat(ma***REMOVED***HeightValue, " - ").concat(descHeight, "p***REMOVED***)"));
            description.setAttribute('style', "ma***REMOVED***-width: ".concat(_imgNode.offsetWidth, "p***REMOVED***;"));
          }
        }
        if (video) {
          var ratio = has(this.settings.plyr.config, 'ratio') ? this.settings.plyr.config.ratio : '';
          if (!ratio) {
            var containerWidth = video.clientWidth;
            var containerHeight = video.clientHeight;
            var divisor = containerWidth / containerHeight;
            ratio = "".concat(containerWidth / divisor, ":").concat(containerHeight / divisor);
          }
          var videoRatio = ratio.split(':');
          var videoWidth = this.settings.videosWidth;
          var ma***REMOVED***Width = this.settings.videosWidth;
          if (isNumber(videoWidth) || videoWidth.inde***REMOVED***Of('p***REMOVED***') !== -1) {
            ma***REMOVED***Width = parseInt(videoWidth);
          } else {
            if (videoWidth.inde***REMOVED***Of('vw') !== -1) {
              ma***REMOVED***Width = winWidth * parseInt(videoWidth) / 100;
            } else if (videoWidth.inde***REMOVED***Of('vh') !== -1) {
              ma***REMOVED***Width = winHeight * parseInt(videoWidth) / 100;
            } else if (videoWidth.inde***REMOVED***Of('%') !== -1) {
              ma***REMOVED***Width = winWidth * parseInt(videoWidth) / 100;
            } else {
              ma***REMOVED***Width = parseInt(video.clientWidth);
            }
          }
          var ma***REMOVED***Height = ma***REMOVED***Width / (parseInt(videoRatio[0]) / parseInt(videoRatio[1]));
          ma***REMOVED***Height = Math.floor(ma***REMOVED***Height);
          if (descriptionResize) {
            winHeight = winHeight - description.offsetHeight;
          }
          if (ma***REMOVED***Width > winWidth || ma***REMOVED***Height > winHeight || winHeight < ma***REMOVED***Height && winWidth > ma***REMOVED***Width) {
            var vwidth = video.offsetWidth;
            var vheight = video.offsetHeight;
            var _ratio = winHeight / vheight;
            var vsize = {
              width: vwidth * _ratio,
              height: vheight * _ratio
            };
            video.parentNode.setAttribute('style', "ma***REMOVED***-width: ".concat(vsize.width, "p***REMOVED***"));
            if (descriptionResize) {
              description.setAttribute('style', "ma***REMOVED***-width: ".concat(vsize.width, "p***REMOVED***;"));
            }
          } else {
            video.parentNode.style.ma***REMOVED***Width = "".concat(videoWidth);
            if (descriptionResize) {
              description.setAttribute('style', "ma***REMOVED***-width: ".concat(videoWidth, ";"));
            }
          }
        }
      }
    }, {
      key: "reload",
      value: function reload() {
        this.init();
      }
    }, {
      key: "updateNavigationClasses",
      value: function updateNavigationClasses() {
        var loop = this.loop();
        removeClass(this.ne***REMOVED***tButton, 'disabled');
        removeClass(this.prevButton, 'disabled');
        if (this.inde***REMOVED*** == 0 && this.elements.length - 1 == 0) {
          addClass(this.prevButton, 'disabled');
          addClass(this.ne***REMOVED***tButton, 'disabled');
        } else if (this.inde***REMOVED*** === 0 && !loop) {
          addClass(this.prevButton, 'disabled');
        } else if (this.inde***REMOVED*** === this.elements.length - 1 && !loop) {
          addClass(this.ne***REMOVED***tButton, 'disabled');
        }
      }
    }, {
      key: "loop",
      value: function loop() {
        var loop = has(this.settings, 'loopAtEnd') ? this.settings.loopAtEnd : null;
        loop = has(this.settings, 'loop') ? this.settings.loop : loop;
        return loop;
      }
    }, {
      key: "close",
      value: function close() {
        var _this8 = this;
        if (!this.lightbo***REMOVED***Open) {
          if (this.events) {
            for (var key in this.events) {
              if (this.events.hasOwnProperty(key)) {
                this.events[key].destroy();
              }
            }
            this.events = null;
          }
          return false;
        }
        if (this.closing) {
          return false;
        }
        this.closing = true;
        this.slidePlayerPause(this.activeSlide);
        if (this.fullElementsList) {
          this.elements = this.fullElementsList;
        }
        if (this.bodyHiddenChildElms.length) {
          each(this.bodyHiddenChildElms, function (el) {
            el.removeAttribute('aria-hidden');
          });
        }
        addClass(this.modal, 'glightbo***REMOVED***-closing');
        animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out);
        animateElement(this.activeSlide, this.settings.cssEfects[this.settings.closeEffect].out, function () {
          _this8.activeSlide = null;
          _this8.prevActiveSlideInde***REMOVED*** = null;
          _this8.prevActiveSlide = null;
          _this8.built = false;
          if (_this8.events) {
            for (var _key in _this8.events) {
              if (_this8.events.hasOwnProperty(_key)) {
                _this8.events[_key].destroy();
              }
            }
            _this8.events = null;
          }
          var body = document.body;
          removeClass(html, 'glightbo***REMOVED***-open');
          removeClass(body, 'glightbo***REMOVED***-open touching gdesc-open glightbo***REMOVED***-touch glightbo***REMOVED***-mobile gscrollbar-fi***REMOVED***er');
          _this8.modal.parentNode.removeChild(_this8.modal);
          _this8.trigger('close');
          if (isFunction(_this8.settings.onClose)) {
            _this8.settings.onClose();
          }
          var styles = document.querySelector('.gcss-styles');
          if (styles) {
            styles.parentNode.removeChild(styles);
          }
          _this8.lightbo***REMOVED***Open = false;
          _this8.closing = null;
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.close();
        this.clearAllEvents();
        if (this.baseEvents) {
          this.baseEvents.destroy();
        }
      }
    }, {
      key: "on",
      value: function on(evt, callback) {
        var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (!evt || !isFunction(callback)) {
          throw new TypeError('Event name and callback must be defined');
        }
        this.apiEvents.push({
          evt: evt,
          once: once,
          callback: callback
        });
      }
    }, {
      key: "once",
      value: function once(evt, callback) {
        this.on(evt, callback, true);
      }
    }, {
      key: "trigger",
      value: function trigger(eventName) {
        var _this9 = this;
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var onceTriggered = [];
        each(this.apiEvents, function (event, i) {
          var evt = event.evt,
            once = event.once,
            callback = event.callback;
          if (evt == eventName) {
            callback(data);
            if (once) {
              onceTriggered.push(i);
            }
          }
        });
        if (onceTriggered.length) {
          each(onceTriggered, function (i) {
            return _this9.apiEvents.splice(i, 1);
          });
        }
      }
    }, {
      key: "clearAllEvents",
      value: function clearAllEvents() {
        this.apiEvents.splice(0, this.apiEvents.length);
      }
    }, {
      key: "version",
      value: function version() {
        return _version;
      }
    }]);
  }();
  function glightbo***REMOVED*** () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var instance = new Glightbo***REMOVED***Init(options);
    instance.init();
    return instance;
  }

  return glightbo***REMOVED***;

})));
