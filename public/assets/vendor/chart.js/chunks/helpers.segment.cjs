/*!
 * Chart.js v4.4.3
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */
'use strict';

var color$1 = require('@kurkle/color');

/**
 * @namespace Chart.helpers
 */ /**
 * An empty function that can be used, for e***REMOVED***ample, for optional callback.
 */ function noop() {
/* noop */ }
/**
 * Returns a unique id, sequentially generated from a global variable.
 */ const uid = (()=>{
    let id = 0;
    return ()=>id++;
})();
/**
 * Returns true if `value` is neither null nor undefined, else returns false.
 * @param value - The value to test.
 * @since 2.7.0
 */ function isNullOrUndef(value) {
    return value === null || typeof value === 'undefined';
}
/**
 * Returns true if `value` is an array (including typed arrays), else returns false.
 * @param value - The value to test.
 * @function
 */ function isArray(value) {
    if (Array.isArray && Array.isArray(value)) {
        return true;
    }
    const type = Object.prototype.toString.call(value);
    if (type.slice(0, 7) === '[object' && type.slice(-6) === 'Array]') {
        return true;
    }
    return false;
}
/**
 * Returns true if `value` is an object (e***REMOVED***cluding null), else returns false.
 * @param value - The value to test.
 * @since 2.7.0
 */ function isObject(value) {
    return value !== null && Object.prototype.toString.call(value) === '[object Object]';
}
/**
 * Returns true if `value` is a finite number, else returns false
 * @param value  - The value to test.
 */ function isNumberFinite(value) {
    return (typeof value === 'number' || value instanceof Number) && isFinite(+value);
}
/**
 * Returns `value` if finite, else returns `defaultValue`.
 * @param value - The value to return if defined.
 * @param defaultValue - The value to return if `value` is not finite.
 */ function finiteOrDefault(value, defaultValue) {
    return isNumberFinite(value) ? value : defaultValue;
}
/**
 * Returns `value` if defined, else returns `defaultValue`.
 * @param value - The value to return if defined.
 * @param defaultValue - The value to return if `value` is undefined.
 */ function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
}
const toPercentage = (value, dimension)=>typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 : +value / dimension;
const toDimension = (value, dimension)=>typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 * dimension : +value;
/**
 * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the
 * value returned by `fn`. If `fn` is not a function, this method returns undefined.
 * @param fn - The function to call.
 * @param args - The arguments with which `fn` should be called.
 * @param [thisArg] - The value of `this` provided for the call to `fn`.
 */ function callback(fn, args, thisArg) {
    if (fn && typeof fn.call === 'function') {
        return fn.apply(thisArg, args);
    }
}
function each(loopable, fn, thisArg, reverse) {
    let i, len, keys;
    if (isArray(loopable)) {
        len = loopable.length;
        if (reverse) {
            for(i = len - 1; i >= 0; i--){
                fn.call(thisArg, loopable[i], i);
            }
        } else {
            for(i = 0; i < len; i++){
                fn.call(thisArg, loopable[i], i);
            }
        }
    } else if (isObject(loopable)) {
        keys = Object.keys(loopable);
        len = keys.length;
        for(i = 0; i < len; i++){
            fn.call(thisArg, loopable[keys[i]], keys[i]);
        }
    }
}
/**
 * Returns true if the `a0` and `a1` arrays have the same content, else returns false.
 * @param a0 - The array to compare
 * @param a1 - The array to compare
 * @private
 */ function _elementsEqual(a0, a1) {
    let i, ilen, v0, v1;
    if (!a0 || !a1 || a0.length !== a1.length) {
        return false;
    }
    for(i = 0, ilen = a0.length; i < ilen; ++i){
        v0 = a0[i];
        v1 = a1[i];
        if (v0.datasetInde***REMOVED*** !== v1.datasetInde***REMOVED*** || v0.inde***REMOVED*** !== v1.inde***REMOVED***) {
            return false;
        }
    }
    return true;
}
/**
 * Returns a deep copy of `source` without keeping references on objects and arrays.
 * @param source - The value to clone.
 */ function clone(source) {
    if (isArray(source)) {
        return source.map(clone);
    }
    if (isObject(source)) {
        const target = Object.create(null);
        const keys = Object.keys(source);
        const klen = keys.length;
        let k = 0;
        for(; k < klen; ++k){
            target[keys[k]] = clone(source[keys[k]]);
        }
        return target;
    }
    return source;
}
function isValidKey(key) {
    return [
        '__proto__',
        'prototype',
        'constructor'
    ].inde***REMOVED***Of(key) === -1;
}
/**
 * The default merger when Chart.helpers.merge is called without merger option.
 * Note(SB): also used by mergeConfig and mergeScaleConfig as fallback.
 * @private
 */ function _merger(key, target, source, options) {
    if (!isValidKey(key)) {
        return;
    }
    const tval = target[key];
    const sval = source[key];
    if (isObject(tval) && isObject(sval)) {
        // eslint-disable-ne***REMOVED***t-line @typescript-eslint/no-use-before-define
        merge(tval, sval, options);
    } else {
        target[key] = clone(sval);
    }
}
function merge(target, source, options) {
    const sources = isArray(source) ? source : [
        source
    ];
    const ilen = sources.length;
    if (!isObject(target)) {
        return target;
    }
    options = options || {};
    const merger = options.merger || _merger;
    let current;
    for(let i = 0; i < ilen; ++i){
        current = sources[i];
        if (!isObject(current)) {
            continue;
        }
        const keys = Object.keys(current);
        for(let k = 0, klen = keys.length; k < klen; ++k){
            merger(keys[k], target, current, options);
        }
    }
    return target;
}
function mergeIf(target, source) {
    // eslint-disable-ne***REMOVED***t-line @typescript-eslint/no-use-before-define
    return merge(target, source, {
        merger: _mergerIf
    });
}
/**
 * Merges source[key] in target[key] only if target[key] is undefined.
 * @private
 */ function _mergerIf(key, target, source) {
    if (!isValidKey(key)) {
        return;
    }
    const tval = target[key];
    const sval = source[key];
    if (isObject(tval) && isObject(sval)) {
        mergeIf(tval, sval);
    } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
        target[key] = clone(sval);
    }
}
/**
 * @private
 */ function _deprecated(scope, value, previous, current) {
    if (value !== undefined) {
        console.warn(scope + ': "' + previous + '" is deprecated. Please use "' + current + '" instead');
    }
}
// resolveObjectKey resolver cache
const keyResolvers = {
    // Chart.helpers.core resolveObjectKey should resolve empty key to root object
    '': (v)=>v,
    // default resolvers
    ***REMOVED***: (o)=>o.***REMOVED***,
    y: (o)=>o.y
};
/**
 * @private
 */ function _splitKey(key) {
    const parts = key.split('.');
    const keys = [];
    let tmp = '';
    for (const part of parts){
        tmp += part;
        if (tmp.endsWith('\\')) {
            tmp = tmp.slice(0, -1) + '.';
        } else {
            keys.push(tmp);
            tmp = '';
        }
    }
    return keys;
}
function _getKeyResolver(key) {
    const keys = _splitKey(key);
    return (obj)=>{
        for (const k of keys){
            if (k === '') {
                break;
            }
            obj = obj && obj[k];
        }
        return obj;
    };
}
function resolveObjectKey(obj, key) {
    const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
    return resolver(obj);
}
/**
 * @private
 */ function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const defined = (value)=>typeof value !== 'undefined';
const isFunction = (value)=>typeof value === 'function';
// Adapted from https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality#31129384
const setsEqual = (a, b)=>{
    if (a.size !== b.size) {
        return false;
    }
    for (const item of a){
        if (!b.has(item)) {
            return false;
        }
    }
    return true;
};
/**
 * @param e - The event
 * @private
 */ function _isClickEvent(e) {
    return e.type === 'mouseup' || e.type === 'click' || e.type === 'conte***REMOVED***tmenu';
}

/**
 * @alias Chart.helpers.math
 * @namespace
 */ const PI = Math.PI;
const TAU = 2 * PI;
const PITAU = TAU + PI;
const INFINITY = Number.POSITIVE_INFINITY;
const RAD_PER_DEG = PI / 180;
const HALF_PI = PI / 2;
const QUARTER_PI = PI / 4;
const TWO_THIRDS_PI = PI * 2 / 3;
const log10 = Math.log10;
const sign = Math.sign;
function almostEquals(***REMOVED***, y, epsilon) {
    return Math.abs(***REMOVED*** - y) < epsilon;
}
/**
 * Implementation of the nice number algorithm used in determining where a***REMOVED***is labels will go
 */ function niceNum(range) {
    const roundedRange = Math.round(range);
    range = almostEquals(range, roundedRange, range / 1000) ? roundedRange : range;
    const niceRange = Math.pow(10, Math.floor(log10(range)));
    const fraction = range / niceRange;
    const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return niceFraction * niceRange;
}
/**
 * Returns an array of factors sorted from 1 to sqrt(value)
 * @private
 */ function _factorize(value) {
    const result = [];
    const sqrt = Math.sqrt(value);
    let i;
    for(i = 1; i < sqrt; i++){
        if (value % i === 0) {
            result.push(i);
            result.push(value / i);
        }
    }
    if (sqrt === (sqrt | 0)) {
        result.push(sqrt);
    }
    result.sort((a, b)=>a - b).pop();
    return result;
}
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function almostWhole(***REMOVED***, epsilon) {
    const rounded = Math.round(***REMOVED***);
    return rounded - epsilon <= ***REMOVED*** && rounded + epsilon >= ***REMOVED***;
}
/**
 * @private
 */ function _setMinAndMa***REMOVED***ByKey(array, target, property) {
    let i, ilen, value;
    for(i = 0, ilen = array.length; i < ilen; i++){
        value = array[i][property];
        if (!isNaN(value)) {
            target.min = Math.min(target.min, value);
            target.ma***REMOVED*** = Math.ma***REMOVED***(target.ma***REMOVED***, value);
        }
    }
}
function toRadians(degrees) {
    return degrees * (PI / 180);
}
function toDegrees(radians) {
    return radians * (180 / PI);
}
/**
 * Returns the number of decimal places
 * i.e. the number of digits after the decimal point, of the value of this Number.
 * @param ***REMOVED*** - A number.
 * @returns The number of decimal places.
 * @private
 */ function _decimalPlaces(***REMOVED***) {
    if (!isNumberFinite(***REMOVED***)) {
        return;
    }
    let e = 1;
    let p = 0;
    while(Math.round(***REMOVED*** * e) / e !== ***REMOVED***){
        e *= 10;
        p++;
    }
    return p;
}
// Gets the angle from vertical upright to the point about a centre.
function getAngleFromPoint(centrePoint, anglePoint) {
    const distanceFromXCenter = anglePoint.***REMOVED*** - centrePoint.***REMOVED***;
    const distanceFromYCenter = anglePoint.y - centrePoint.y;
    const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
    let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
    if (angle < -0.5 * PI) {
        angle += TAU; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
    }
    return {
        angle,
        distance: radialDistanceFromCenter
    };
}
function distanceBetweenPoints(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.***REMOVED*** - pt1.***REMOVED***, 2) + Math.pow(pt2.y - pt1.y, 2));
}
/**
 * Shortest distance between angles, in either direction.
 * @private
 */ function _angleDiff(a, b) {
    return (a - b + PITAU) % TAU - PI;
}
/**
 * Normalize angle to be between 0 and 2*PI
 * @private
 */ function _normalizeAngle(a) {
    return (a % TAU + TAU) % TAU;
}
/**
 * @private
 */ function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
    const a = _normalizeAngle(angle);
    const s = _normalizeAngle(start);
    const e = _normalizeAngle(end);
    const angleToStart = _normalizeAngle(s - a);
    const angleToEnd = _normalizeAngle(e - a);
    const startToAngle = _normalizeAngle(a - s);
    const endToAngle = _normalizeAngle(a - e);
    return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
}
/**
 * Limit `value` between `min` and `ma***REMOVED***`
 * @param value
 * @param min
 * @param ma***REMOVED***
 * @private
 */ function _limitValue(value, min, ma***REMOVED***) {
    return Math.ma***REMOVED***(min, Math.min(ma***REMOVED***, value));
}
/**
 * @param {number} value
 * @private
 */ function _int16Range(value) {
    return _limitValue(value, -32768, 32767);
}
/**
 * @param value
 * @param start
 * @param end
 * @param [epsilon]
 * @private
 */ function _isBetween(value, start, end, epsilon = 1e-6) {
    return value >= Math.min(start, end) - epsilon && value <= Math.ma***REMOVED***(start, end) + epsilon;
}

function _lookup(table, value, cmp) {
    cmp = cmp || ((inde***REMOVED***)=>table[inde***REMOVED***] < value);
    let hi = table.length - 1;
    let lo = 0;
    let mid;
    while(hi - lo > 1){
        mid = lo + hi >> 1;
        if (cmp(mid)) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return {
        lo,
        hi
    };
}
/**
 * Binary search
 * @param table - the table search. must be sorted!
 * @param key - property name for the value in each entry
 * @param value - value to find
 * @param last - lookup last inde***REMOVED***
 * @private
 */ const _lookupByKey = (table, key, value, last)=>_lookup(table, value, last ? (inde***REMOVED***)=>{
        const ti = table[inde***REMOVED***][key];
        return ti < value || ti === value && table[inde***REMOVED*** + 1][key] === value;
    } : (inde***REMOVED***)=>table[inde***REMOVED***][key] < value);
/**
 * Reverse binary search
 * @param table - the table search. must be sorted!
 * @param key - property name for the value in each entry
 * @param value - value to find
 * @private
 */ const _rlookupByKey = (table, key, value)=>_lookup(table, value, (inde***REMOVED***)=>table[inde***REMOVED***][key] >= value);
/**
 * Return subset of `values` between `min` and `ma***REMOVED***` inclusive.
 * Values are assumed to be in sorted order.
 * @param values - sorted array of values
 * @param min - min value
 * @param ma***REMOVED*** - ma***REMOVED*** value
 */ function _filterBetween(values, min, ma***REMOVED***) {
    let start = 0;
    let end = values.length;
    while(start < end && values[start] < min){
        start++;
    }
    while(end > start && values[end - 1] > ma***REMOVED***){
        end--;
    }
    return start > 0 || end < values.length ? values.slice(start, end) : values;
}
const arrayEvents = [
    'push',
    'pop',
    'shift',
    'splice',
    'unshift'
];
function listenArrayEvents(array, listener) {
    if (array._chartjs) {
        array._chartjs.listeners.push(listener);
        return;
    }
    Object.defineProperty(array, '_chartjs', {
        configurable: true,
        enumerable: false,
        value: {
            listeners: [
                listener
            ]
        }
    });
    arrayEvents.forEach((key)=>{
        const method = '_onData' + _capitalize(key);
        const base = array[key];
        Object.defineProperty(array, key, {
            configurable: true,
            enumerable: false,
            value (...args) {
                const res = base.apply(this, args);
                array._chartjs.listeners.forEach((object)=>{
                    if (typeof object[method] === 'function') {
                        object[method](...args);
                    }
                });
                return res;
            }
        });
    });
}
function unlistenArrayEvents(array, listener) {
    const stub = array._chartjs;
    if (!stub) {
        return;
    }
    const listeners = stub.listeners;
    const inde***REMOVED*** = listeners.inde***REMOVED***Of(listener);
    if (inde***REMOVED*** !== -1) {
        listeners.splice(inde***REMOVED***, 1);
    }
    if (listeners.length > 0) {
        return;
    }
    arrayEvents.forEach((key)=>{
        delete array[key];
    });
    delete array._chartjs;
}
/**
 * @param items
 */ function _arrayUnique(items) {
    const set = new Set(items);
    if (set.size === items.length) {
        return items;
    }
    return Array.from(set);
}

function fontString(pi***REMOVED***elSize, fontStyle, fontFamily) {
    return fontStyle + ' ' + pi***REMOVED***elSize + 'p***REMOVED*** ' + fontFamily;
}
/**
* Request animation polyfill
*/ const requestAnimFrame = function() {
    if (typeof window === 'undefined') {
        return function(callback) {
            return callback();
        };
    }
    return window.requestAnimationFrame;
}();
/**
 * Throttles calling `fn` once per animation frame
 * Latest arguments are used on the actual call
 */ function throttled(fn, thisArg) {
    let argsToUse = [];
    let ticking = false;
    return function(...args) {
        // Save the args for use later
        argsToUse = args;
        if (!ticking) {
            ticking = true;
            requestAnimFrame.call(window, ()=>{
                ticking = false;
                fn.apply(thisArg, argsToUse);
            });
        }
    };
}
/**
 * Debounces calling `fn` for `delay` ms
 */ function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        if (delay) {
            clearTimeout(timeout);
            timeout = setTimeout(fn, delay, args);
        } else {
            fn.apply(this, args);
        }
        return delay;
    };
}
/**
 * Converts 'start' to 'left', 'end' to 'right' and others to 'center'
 * @private
 */ const _toLeftRightCenter = (align)=>align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
/**
 * Returns `start`, `end` or `(start + end) / 2` depending on `align`. Defaults to `center`
 * @private
 */ const _alignStartEnd = (align, start, end)=>align === 'start' ? start : align === 'end' ? end : (start + end) / 2;
/**
 * Returns `left`, `right` or `(left + right) / 2` depending on `align`. Defaults to `left`
 * @private
 */ const _te***REMOVED***tX = (align, left, right, rtl)=>{
    const check = rtl ? 'left' : 'right';
    return align === check ? right : align === 'center' ? (left + right) / 2 : left;
};
/**
 * Return start and count of visible points.
 * @private
 */ function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
    const pointCount = points.length;
    let start = 0;
    let count = pointCount;
    if (meta._sorted) {
        const { iScale , _parsed  } = meta;
        const a***REMOVED***is = iScale.a***REMOVED***is;
        const { min , ma***REMOVED*** , minDefined , ma***REMOVED***Defined  } = iScale.getUserBounds();
        if (minDefined) {
            start = _limitValue(Math.min(// @ts-e***REMOVED***pect-error Need to type _parsed
            _lookupByKey(_parsed, a***REMOVED***is, min).lo, // @ts-e***REMOVED***pect-error Need to fi***REMOVED*** types on _lookupByKey
            animationsDisabled ? pointCount : _lookupByKey(points, a***REMOVED***is, iScale.getPi***REMOVED***elForValue(min)).lo), 0, pointCount - 1);
        }
        if (ma***REMOVED***Defined) {
            count = _limitValue(Math.ma***REMOVED***(// @ts-e***REMOVED***pect-error Need to type _parsed
            _lookupByKey(_parsed, iScale.a***REMOVED***is, ma***REMOVED***, true).hi + 1, // @ts-e***REMOVED***pect-error Need to fi***REMOVED*** types on _lookupByKey
            animationsDisabled ? 0 : _lookupByKey(points, a***REMOVED***is, iScale.getPi***REMOVED***elForValue(ma***REMOVED***), true).hi + 1), start, pointCount) - start;
        } else {
            count = pointCount - start;
        }
    }
    return {
        start,
        count
    };
}
/**
 * Checks if the scale ranges have changed.
 * @param {object} meta - dataset meta.
 * @returns {boolean}
 * @private
 */ function _scaleRangesChanged(meta) {
    const { ***REMOVED***Scale , yScale , _scaleRanges  } = meta;
    const newRanges = {
        ***REMOVED***min: ***REMOVED***Scale.min,
        ***REMOVED***ma***REMOVED***: ***REMOVED***Scale.ma***REMOVED***,
        ymin: yScale.min,
        yma***REMOVED***: yScale.ma***REMOVED***
    };
    if (!_scaleRanges) {
        meta._scaleRanges = newRanges;
        return true;
    }
    const changed = _scaleRanges.***REMOVED***min !== ***REMOVED***Scale.min || _scaleRanges.***REMOVED***ma***REMOVED*** !== ***REMOVED***Scale.ma***REMOVED*** || _scaleRanges.ymin !== yScale.min || _scaleRanges.yma***REMOVED*** !== yScale.ma***REMOVED***;
    Object.assign(_scaleRanges, newRanges);
    return changed;
}

const atEdge = (t)=>t === 0 || t === 1;
const elasticIn = (t, s, p)=>-(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
const elasticOut = (t, s, p)=>Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
/**
 * Easing functions adapted from Robert Penner's easing equations.
 * @namespace Chart.helpers.easing.effects
 * @see http://www.robertpenner.com/easing/
 */ const effects = {
    linear: (t)=>t,
    easeInQuad: (t)=>t * t,
    easeOutQuad: (t)=>-t * (t - 2),
    easeInOutQuad: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
    easeInCubic: (t)=>t * t * t,
    easeOutCubic: (t)=>(t -= 1) * t * t + 1,
    easeInOutCubic: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
    easeInQuart: (t)=>t * t * t * t,
    easeOutQuart: (t)=>-((t -= 1) * t * t * t - 1),
    easeInOutQuart: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
    easeInQuint: (t)=>t * t * t * t * t,
    easeOutQuint: (t)=>(t -= 1) * t * t * t * t + 1,
    easeInOutQuint: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
    easeInSine: (t)=>-Math.cos(t * HALF_PI) + 1,
    easeOutSine: (t)=>Math.sin(t * HALF_PI),
    easeInOutSine: (t)=>-0.5 * (Math.cos(PI * t) - 1),
    easeInE***REMOVED***po: (t)=>t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutE***REMOVED***po: (t)=>t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
    easeInOutE***REMOVED***po: (t)=>atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
    easeInCirc: (t)=>t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
    easeOutCirc: (t)=>Math.sqrt(1 - (t -= 1) * t),
    easeInOutCirc: (t)=>(t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
    easeInElastic: (t)=>atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
    easeOutElastic: (t)=>atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
    easeInOutElastic (t) {
        const s = 0.1125;
        const p = 0.45;
        return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
    },
    easeInBack (t) {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },
    easeOutBack (t) {
        const s = 1.70158;
        return (t -= 1) * t * ((s + 1) * t + s) + 1;
    },
    easeInOutBack (t) {
        let s = 1.70158;
        if ((t /= 0.5) < 1) {
            return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
        }
        return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
    },
    easeInBounce: (t)=>1 - effects.easeOutBounce(1 - t),
    easeOutBounce (t) {
        const m = 7.5625;
        const d = 2.75;
        if (t < 1 / d) {
            return m * t * t;
        }
        if (t < 2 / d) {
            return m * (t -= 1.5 / d) * t + 0.75;
        }
        if (t < 2.5 / d) {
            return m * (t -= 2.25 / d) * t + 0.9375;
        }
        return m * (t -= 2.625 / d) * t + 0.984375;
    },
    easeInOutBounce: (t)=>t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
};

function isPatternOrGradient(value) {
    if (value && typeof value === 'object') {
        const type = value.toString();
        return type === '[object CanvasPattern]' || type === '[object CanvasGradient]';
    }
    return false;
}
function color(value) {
    return isPatternOrGradient(value) ? value : new color$1.Color(value);
}
function getHoverColor(value) {
    return isPatternOrGradient(value) ? value : new color$1.Color(value).saturate(0.5).darken(0.1).he***REMOVED***String();
}

const numbers = [
    '***REMOVED***',
    'y',
    'borderWidth',
    'radius',
    'tension'
];
const colors = [
    'color',
    'borderColor',
    'backgroundColor'
];
function applyAnimationsDefaults(defaults) {
    defaults.set('animation', {
        delay: undefined,
        duration: 1000,
        easing: 'easeOutQuart',
        fn: undefined,
        from: undefined,
        loop: undefined,
        to: undefined,
        type: undefined
    });
    defaults.describe('animation', {
        _fallback: false,
        _inde***REMOVED***able: false,
        _scriptable: (name)=>name !== 'onProgress' && name !== 'onComplete' && name !== 'fn'
    });
    defaults.set('animations', {
        colors: {
            type: 'color',
            properties: colors
        },
        numbers: {
            type: 'number',
            properties: numbers
        }
    });
    defaults.describe('animations', {
        _fallback: 'animation'
    });
    defaults.set('transitions', {
        active: {
            animation: {
                duration: 400
            }
        },
        resize: {
            animation: {
                duration: 0
            }
        },
        show: {
            animations: {
                colors: {
                    from: 'transparent'
                },
                visible: {
                    type: 'boolean',
                    duration: 0
                }
            }
        },
        hide: {
            animations: {
                colors: {
                    to: 'transparent'
                },
                visible: {
                    type: 'boolean',
                    easing: 'linear',
                    fn: (v)=>v | 0
                }
            }
        }
    });
}

function applyLayoutsDefaults(defaults) {
    defaults.set('layout', {
        autoPadding: true,
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    });
}

const intlCache = new Map();
function getNumberFormat(locale, options) {
    options = options || {};
    const cacheKey = locale + JSON.stringify(options);
    let formatter = intlCache.get(cacheKey);
    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, options);
        intlCache.set(cacheKey, formatter);
    }
    return formatter;
}
function formatNumber(num, locale, options) {
    return getNumberFormat(locale, options).format(num);
}

const formatters = {
 values (value) {
        return isArray(value) ?  value : '' + value;
    },
 numeric (tickValue, inde***REMOVED***, ticks) {
        if (tickValue === 0) {
            return '0';
        }
        const locale = this.chart.options.locale;
        let notation;
        let delta = tickValue;
        if (ticks.length > 1) {
            const ma***REMOVED***Tick = Math.ma***REMOVED***(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
            if (ma***REMOVED***Tick < 1e-4 || ma***REMOVED***Tick > 1e+15) {
                notation = 'scientific';
            }
            delta = calculateDelta(tickValue, ticks);
        }
        const logDelta = log10(Math.abs(delta));
        const numDecimal = isNaN(logDelta) ? 1 : Math.ma***REMOVED***(Math.min(-1 * Math.floor(logDelta), 20), 0);
        const options = {
            notation,
            minimumFractionDigits: numDecimal,
            ma***REMOVED***imumFractionDigits: numDecimal
        };
        Object.assign(options, this.options.ticks.format);
        return formatNumber(tickValue, locale, options);
    },
 logarithmic (tickValue, inde***REMOVED***, ticks) {
        if (tickValue === 0) {
            return '0';
        }
        const remain = ticks[inde***REMOVED***].significand || tickValue / Math.pow(10, Math.floor(log10(tickValue)));
        if ([
            1,
            2,
            3,
            5,
            10,
            15
        ].includes(remain) || inde***REMOVED*** > 0.8 * ticks.length) {
            return formatters.numeric.call(this, tickValue, inde***REMOVED***, ticks);
        }
        return '';
    }
};
function calculateDelta(tickValue, ticks) {
    let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
    if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
        delta = tickValue - Math.floor(tickValue);
    }
    return delta;
}
 var Ticks = {
    formatters
};

function applyScaleDefaults(defaults) {
    defaults.set('scale', {
        display: true,
        offset: false,
        reverse: false,
        beginAtZero: false,
 bounds: 'ticks',
        clip: true,
 grace: 0,
        grid: {
            display: true,
            lineWidth: 1,
            drawOnChartArea: true,
            drawTicks: true,
            tickLength: 8,
            tickWidth: (_ct***REMOVED***, options)=>options.lineWidth,
            tickColor: (_ct***REMOVED***, options)=>options.color,
            offset: false
        },
        border: {
            display: true,
            dash: [],
            dashOffset: 0.0,
            width: 1
        },
        title: {
            display: false,
            te***REMOVED***t: '',
            padding: {
                top: 4,
                bottom: 4
            }
        },
        ticks: {
            minRotation: 0,
            ma***REMOVED***Rotation: 50,
            mirror: false,
            te***REMOVED***tStrokeWidth: 0,
            te***REMOVED***tStrokeColor: '',
            padding: 3,
            display: true,
            autoSkip: true,
            autoSkipPadding: 3,
            labelOffset: 0,
            callback: Ticks.formatters.values,
            minor: {},
            major: {},
            align: 'center',
            crossAlign: 'near',
            showLabelBackdrop: false,
            backdropColor: 'rgba(255, 255, 255, 0.75)',
            backdropPadding: 2
        }
    });
    defaults.route('scale.ticks', 'color', '', 'color');
    defaults.route('scale.grid', 'color', '', 'borderColor');
    defaults.route('scale.border', 'color', '', 'borderColor');
    defaults.route('scale.title', 'color', '', 'color');
    defaults.describe('scale', {
        _fallback: false,
        _scriptable: (name)=>!name.startsWith('before') && !name.startsWith('after') && name !== 'callback' && name !== 'parser',
        _inde***REMOVED***able: (name)=>name !== 'borderDash' && name !== 'tickBorderDash' && name !== 'dash'
    });
    defaults.describe('scales', {
        _fallback: 'scale'
    });
    defaults.describe('scale.ticks', {
        _scriptable: (name)=>name !== 'backdropPadding' && name !== 'callback',
        _inde***REMOVED***able: (name)=>name !== 'backdropPadding'
    });
}

const overrides = Object.create(null);
const descriptors = Object.create(null);
 function getScope$1(node, key) {
    if (!key) {
        return node;
    }
    const keys = key.split('.');
    for(let i = 0, n = keys.length; i < n; ++i){
        const k = keys[i];
        node = node[k] || (node[k] = Object.create(null));
    }
    return node;
}
function set(root, scope, values) {
    if (typeof scope === 'string') {
        return merge(getScope$1(root, scope), values);
    }
    return merge(getScope$1(root, ''), scope);
}
 class Defaults {
    constructor(_descriptors, _appliers){
        this.animation = undefined;
        this.backgroundColor = 'rgba(0,0,0,0.1)';
        this.borderColor = 'rgba(0,0,0,0.1)';
        this.color = '#666';
        this.datasets = {};
        this.devicePi***REMOVED***elRatio = (conte***REMOVED***t)=>conte***REMOVED***t.chart.platform.getDevicePi***REMOVED***elRatio();
        this.elements = {};
        this.events = [
            'mousemove',
            'mouseout',
            'click',
            'touchstart',
            'touchmove'
        ];
        this.font = {
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            size: 12,
            style: 'normal',
            lineHeight: 1.2,
            weight: null
        };
        this.hover = {};
        this.hoverBackgroundColor = (ct***REMOVED***, options)=>getHoverColor(options.backgroundColor);
        this.hoverBorderColor = (ct***REMOVED***, options)=>getHoverColor(options.borderColor);
        this.hoverColor = (ct***REMOVED***, options)=>getHoverColor(options.color);
        this.inde***REMOVED***A***REMOVED***is = '***REMOVED***';
        this.interaction = {
            mode: 'nearest',
            intersect: true,
            includeInvisible: false
        };
        this.maintainAspectRatio = true;
        this.onHover = null;
        this.onClick = null;
        this.parsing = true;
        this.plugins = {};
        this.responsive = true;
        this.scale = undefined;
        this.scales = {};
        this.showLine = true;
        this.drawActiveElementsOnTop = true;
        this.describe(_descriptors);
        this.apply(_appliers);
    }
 set(scope, values) {
        return set(this, scope, values);
    }
 get(scope) {
        return getScope$1(this, scope);
    }
 describe(scope, values) {
        return set(descriptors, scope, values);
    }
    override(scope, values) {
        return set(overrides, scope, values);
    }
 route(scope, name, targetScope, targetName) {
        const scopeObject = getScope$1(this, scope);
        const targetScopeObject = getScope$1(this, targetScope);
        const privateName = '_' + name;
        Object.defineProperties(scopeObject, {
            [privateName]: {
                value: scopeObject[name],
                writable: true
            },
            [name]: {
                enumerable: true,
                get () {
                    const local = this[privateName];
                    const target = targetScopeObject[targetName];
                    if (isObject(local)) {
                        return Object.assign({}, target, local);
                    }
                    return valueOrDefault(local, target);
                },
                set (value) {
                    this[privateName] = value;
                }
            }
        });
    }
    apply(appliers) {
        appliers.forEach((apply)=>apply(this));
    }
}
var defaults = /* #__PURE__ */ new Defaults({
    _scriptable: (name)=>!name.startsWith('on'),
    _inde***REMOVED***able: (name)=>name !== 'events',
    hover: {
        _fallback: 'interaction'
    },
    interaction: {
        _scriptable: false,
        _inde***REMOVED***able: false
    }
}, [
    applyAnimationsDefaults,
    applyLayoutsDefaults,
    applyScaleDefaults
]);

/**
 * Converts the given font object into a CSS font string.
 * @param font - A font object.
 * @return The CSS font string. See https://developer.mozilla.org/en-US/docs/Web/CSS/font
 * @private
 */ function toFontString(font) {
    if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
        return null;
    }
    return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'p***REMOVED*** ' + font.family;
}
/**
 * @private
 */ function _measureTe***REMOVED***t(ct***REMOVED***, data, gc, longest, string) {
    let te***REMOVED***tWidth = data[string];
    if (!te***REMOVED***tWidth) {
        te***REMOVED***tWidth = data[string] = ct***REMOVED***.measureTe***REMOVED***t(string).width;
        gc.push(string);
    }
    if (te***REMOVED***tWidth > longest) {
        longest = te***REMOVED***tWidth;
    }
    return longest;
}
/**
 * @private
 */ // eslint-disable-ne***REMOVED***t-line comple***REMOVED***ity
function _longestTe***REMOVED***t(ct***REMOVED***, font, arrayOfThings, cache) {
    cache = cache || {};
    let data = cache.data = cache.data || {};
    let gc = cache.garbageCollect = cache.garbageCollect || [];
    if (cache.font !== font) {
        data = cache.data = {};
        gc = cache.garbageCollect = [];
        cache.font = font;
    }
    ct***REMOVED***.save();
    ct***REMOVED***.font = font;
    let longest = 0;
    const ilen = arrayOfThings.length;
    let i, j, jlen, thing, nestedThing;
    for(i = 0; i < ilen; i++){
        thing = arrayOfThings[i];
        // Undefined strings and arrays should not be measured
        if (thing !== undefined && thing !== null && !isArray(thing)) {
            longest = _measureTe***REMOVED***t(ct***REMOVED***, data, gc, longest, thing);
        } else if (isArray(thing)) {
            // if it is an array lets measure each element
            // to do maybe simplify this function a bit so we can do this more recursively?
            for(j = 0, jlen = thing.length; j < jlen; j++){
                nestedThing = thing[j];
                // Undefined strings and arrays should not be measured
                if (nestedThing !== undefined && nestedThing !== null && !isArray(nestedThing)) {
                    longest = _measureTe***REMOVED***t(ct***REMOVED***, data, gc, longest, nestedThing);
                }
            }
        }
    }
    ct***REMOVED***.restore();
    const gcLen = gc.length / 2;
    if (gcLen > arrayOfThings.length) {
        for(i = 0; i < gcLen; i++){
            delete data[gc[i]];
        }
        gc.splice(0, gcLen);
    }
    return longest;
}
/**
 * Returns the aligned pi***REMOVED***el value to avoid anti-aliasing blur
 * @param chart - The chart instance.
 * @param pi***REMOVED***el - A pi***REMOVED***el value.
 * @param width - The width of the element.
 * @returns The aligned pi***REMOVED***el value.
 * @private
 */ function _alignPi***REMOVED***el(chart, pi***REMOVED***el, width) {
    const devicePi***REMOVED***elRatio = chart.currentDevicePi***REMOVED***elRatio;
    const halfWidth = width !== 0 ? Math.ma***REMOVED***(width / 2, 0.5) : 0;
    return Math.round((pi***REMOVED***el - halfWidth) * devicePi***REMOVED***elRatio) / devicePi***REMOVED***elRatio + halfWidth;
}
/**
 * Clears the entire canvas.
 */ function clearCanvas(canvas, ct***REMOVED***) {
    if (!ct***REMOVED*** && !canvas) {
        return;
    }
    ct***REMOVED*** = ct***REMOVED*** || canvas.getConte***REMOVED***t('2d');
    ct***REMOVED***.save();
    // canvas.width and canvas.height do not consider the canvas transform,
    // while clearRect does
    ct***REMOVED***.resetTransform();
    ct***REMOVED***.clearRect(0, 0, canvas.width, canvas.height);
    ct***REMOVED***.restore();
}
function drawPoint(ct***REMOVED***, options, ***REMOVED***, y) {
    // eslint-disable-ne***REMOVED***t-line @typescript-eslint/no-use-before-define
    drawPointLegend(ct***REMOVED***, options, ***REMOVED***, y, null);
}
// eslint-disable-ne***REMOVED***t-line comple***REMOVED***ity
function drawPointLegend(ct***REMOVED***, options, ***REMOVED***, y, w) {
    let type, ***REMOVED***Offset, yOffset, size, cornerRadius, width, ***REMOVED***OffsetW, yOffsetW;
    const style = options.pointStyle;
    const rotation = options.rotation;
    const radius = options.radius;
    let rad = (rotation || 0) * RAD_PER_DEG;
    if (style && typeof style === 'object') {
        type = style.toString();
        if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
            ct***REMOVED***.save();
            ct***REMOVED***.translate(***REMOVED***, y);
            ct***REMOVED***.rotate(rad);
            ct***REMOVED***.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
            ct***REMOVED***.restore();
            return;
        }
    }
    if (isNaN(radius) || radius <= 0) {
        return;
    }
    ct***REMOVED***.beginPath();
    switch(style){
        // Default includes circle
        default:
            if (w) {
                ct***REMOVED***.ellipse(***REMOVED***, y, w / 2, radius, 0, 0, TAU);
            } else {
                ct***REMOVED***.arc(***REMOVED***, y, radius, 0, TAU);
            }
            ct***REMOVED***.closePath();
            break;
        case 'triangle':
            width = w ? w / 2 : radius;
            ct***REMOVED***.moveTo(***REMOVED*** + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            rad += TWO_THIRDS_PI;
            ct***REMOVED***.lineTo(***REMOVED*** + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            rad += TWO_THIRDS_PI;
            ct***REMOVED***.lineTo(***REMOVED*** + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            ct***REMOVED***.closePath();
            break;
        case 'rectRounded':
            // NOTE: the rounded rect implementation changed to use `arc` instead of
            // `quadraticCurveTo` since it generates better results when rect is
            // almost a circle. 0.516 (instead of 0.5) produces results with visually
            // closer proportion to the previous impl and it is inscribed in the
            // circle with `radius`. For more details, see the following PRs:
            // https://github.com/chartjs/Chart.js/issues/5597
            // https://github.com/chartjs/Chart.js/issues/5858
            cornerRadius = radius * 0.516;
            size = radius - cornerRadius;
            ***REMOVED***Offset = Math.cos(rad + QUARTER_PI) * size;
            ***REMOVED***OffsetW = Math.cos(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
            yOffset = Math.sin(rad + QUARTER_PI) * size;
            yOffsetW = Math.sin(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
            ct***REMOVED***.arc(***REMOVED*** - ***REMOVED***OffsetW, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
            ct***REMOVED***.arc(***REMOVED*** + yOffsetW, y - ***REMOVED***Offset, cornerRadius, rad - HALF_PI, rad);
            ct***REMOVED***.arc(***REMOVED*** + ***REMOVED***OffsetW, y + yOffset, cornerRadius, rad, rad + HALF_PI);
            ct***REMOVED***.arc(***REMOVED*** - yOffsetW, y + ***REMOVED***Offset, cornerRadius, rad + HALF_PI, rad + PI);
            ct***REMOVED***.closePath();
            break;
        case 'rect':
            if (!rotation) {
                size = Math.SQRT1_2 * radius;
                width = w ? w / 2 : size;
                ct***REMOVED***.rect(***REMOVED*** - width, y - size, 2 * width, 2 * size);
                break;
            }
            rad += QUARTER_PI;
        /* falls through */ case 'rectRot':
            ***REMOVED***OffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            ***REMOVED***Offset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ct***REMOVED***.moveTo(***REMOVED*** - ***REMOVED***OffsetW, y - yOffset);
            ct***REMOVED***.lineTo(***REMOVED*** + yOffsetW, y - ***REMOVED***Offset);
            ct***REMOVED***.lineTo(***REMOVED*** + ***REMOVED***OffsetW, y + yOffset);
            ct***REMOVED***.lineTo(***REMOVED*** - yOffsetW, y + ***REMOVED***Offset);
            ct***REMOVED***.closePath();
            break;
        case 'crossRot':
            rad += QUARTER_PI;
        /* falls through */ case 'cross':
            ***REMOVED***OffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            ***REMOVED***Offset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ct***REMOVED***.moveTo(***REMOVED*** - ***REMOVED***OffsetW, y - yOffset);
            ct***REMOVED***.lineTo(***REMOVED*** + ***REMOVED***OffsetW, y + yOffset);
            ct***REMOVED***.moveTo(***REMOVED*** + yOffsetW, y - ***REMOVED***Offset);
            ct***REMOVED***.lineTo(***REMOVED*** - yOffsetW, y + ***REMOVED***Offset);
            break;
        case 'star':
            ***REMOVED***OffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            ***REMOVED***Offset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ct***REMOVED***.moveTo(***REMOVED*** - ***REMOVED***OffsetW, y - yOffset);
            ct***REMOVED***.lineTo(***REMOVED*** + ***REMOVED***OffsetW, y + yOffset);
            ct***REMOVED***.moveTo(***REMOVED*** + yOffsetW, y - ***REMOVED***Offset);
            ct***REMOVED***.lineTo(***REMOVED*** - yOffsetW, y + ***REMOVED***Offset);
            rad += QUARTER_PI;
            ***REMOVED***OffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            ***REMOVED***Offset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ct***REMOVED***.moveTo(***REMOVED*** - ***REMOVED***OffsetW, y - yOffset);
            ct***REMOVED***.lineTo(***REMOVED*** + ***REMOVED***OffsetW, y + yOffset);
            ct***REMOVED***.moveTo(***REMOVED*** + yOffsetW, y - ***REMOVED***Offset);
            ct***REMOVED***.lineTo(***REMOVED*** - yOffsetW, y + ***REMOVED***Offset);
            break;
        case 'line':
            ***REMOVED***Offset = w ? w / 2 : Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            ct***REMOVED***.moveTo(***REMOVED*** - ***REMOVED***Offset, y - yOffset);
            ct***REMOVED***.lineTo(***REMOVED*** + ***REMOVED***Offset, y + yOffset);
            break;
        case 'dash':
            ct***REMOVED***.moveTo(***REMOVED***, y);
            ct***REMOVED***.lineTo(***REMOVED*** + Math.cos(rad) * (w ? w / 2 : radius), y + Math.sin(rad) * radius);
            break;
        case false:
            ct***REMOVED***.closePath();
            break;
    }
    ct***REMOVED***.fill();
    if (options.borderWidth > 0) {
        ct***REMOVED***.stroke();
    }
}
/**
 * Returns true if the point is inside the rectangle
 * @param point - The point to test
 * @param area - The rectangle
 * @param margin - allowed margin
 * @private
 */ function _isPointInArea(point, area, margin) {
    margin = margin || 0.5; // margin - default is to match rounded decimals
    return !area || point && point.***REMOVED*** > area.left - margin && point.***REMOVED*** < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
}
function clipArea(ct***REMOVED***, area) {
    ct***REMOVED***.save();
    ct***REMOVED***.beginPath();
    ct***REMOVED***.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
    ct***REMOVED***.clip();
}
function unclipArea(ct***REMOVED***) {
    ct***REMOVED***.restore();
}
/**
 * @private
 */ function _steppedLineTo(ct***REMOVED***, previous, target, flip, mode) {
    if (!previous) {
        return ct***REMOVED***.lineTo(target.***REMOVED***, target.y);
    }
    if (mode === 'middle') {
        const midpoint = (previous.***REMOVED*** + target.***REMOVED***) / 2.0;
        ct***REMOVED***.lineTo(midpoint, previous.y);
        ct***REMOVED***.lineTo(midpoint, target.y);
    } else if (mode === 'after' !== !!flip) {
        ct***REMOVED***.lineTo(previous.***REMOVED***, target.y);
    } else {
        ct***REMOVED***.lineTo(target.***REMOVED***, previous.y);
    }
    ct***REMOVED***.lineTo(target.***REMOVED***, target.y);
}
/**
 * @private
 */ function _bezierCurveTo(ct***REMOVED***, previous, target, flip) {
    if (!previous) {
        return ct***REMOVED***.lineTo(target.***REMOVED***, target.y);
    }
    ct***REMOVED***.bezierCurveTo(flip ? previous.cp1***REMOVED*** : previous.cp2***REMOVED***, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2***REMOVED*** : target.cp1***REMOVED***, flip ? target.cp2y : target.cp1y, target.***REMOVED***, target.y);
}
function setRenderOpts(ct***REMOVED***, opts) {
    if (opts.translation) {
        ct***REMOVED***.translate(opts.translation[0], opts.translation[1]);
    }
    if (!isNullOrUndef(opts.rotation)) {
        ct***REMOVED***.rotate(opts.rotation);
    }
    if (opts.color) {
        ct***REMOVED***.fillStyle = opts.color;
    }
    if (opts.te***REMOVED***tAlign) {
        ct***REMOVED***.te***REMOVED***tAlign = opts.te***REMOVED***tAlign;
    }
    if (opts.te***REMOVED***tBaseline) {
        ct***REMOVED***.te***REMOVED***tBaseline = opts.te***REMOVED***tBaseline;
    }
}
function decorateTe***REMOVED***t(ct***REMOVED***, ***REMOVED***, y, line, opts) {
    if (opts.strikethrough || opts.underline) {
        /**
     * Now that IE11 support has been dropped, we can use more
     * of the Te***REMOVED***tMetrics object. The actual bounding bo***REMOVED***es
     * are unflagged in Chrome, Firefo***REMOVED***, Edge, and Safari so they
     * can be safely used.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Te***REMOVED***tMetrics#Browser_compatibility
     */ const metrics = ct***REMOVED***.measureTe***REMOVED***t(line);
        const left = ***REMOVED*** - metrics.actualBoundingBo***REMOVED***Left;
        const right = ***REMOVED*** + metrics.actualBoundingBo***REMOVED***Right;
        const top = y - metrics.actualBoundingBo***REMOVED***Ascent;
        const bottom = y + metrics.actualBoundingBo***REMOVED***Descent;
        const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
        ct***REMOVED***.strokeStyle = ct***REMOVED***.fillStyle;
        ct***REMOVED***.beginPath();
        ct***REMOVED***.lineWidth = opts.decorationWidth || 2;
        ct***REMOVED***.moveTo(left, yDecoration);
        ct***REMOVED***.lineTo(right, yDecoration);
        ct***REMOVED***.stroke();
    }
}
function drawBackdrop(ct***REMOVED***, opts) {
    const oldColor = ct***REMOVED***.fillStyle;
    ct***REMOVED***.fillStyle = opts.color;
    ct***REMOVED***.fillRect(opts.left, opts.top, opts.width, opts.height);
    ct***REMOVED***.fillStyle = oldColor;
}
/**
 * Render te***REMOVED***t onto the canvas
 */ function renderTe***REMOVED***t(ct***REMOVED***, te***REMOVED***t, ***REMOVED***, y, font, opts = {}) {
    const lines = isArray(te***REMOVED***t) ? te***REMOVED***t : [
        te***REMOVED***t
    ];
    const stroke = opts.strokeWidth > 0 && opts.strokeColor !== '';
    let i, line;
    ct***REMOVED***.save();
    ct***REMOVED***.font = font.string;
    setRenderOpts(ct***REMOVED***, opts);
    for(i = 0; i < lines.length; ++i){
        line = lines[i];
        if (opts.backdrop) {
            drawBackdrop(ct***REMOVED***, opts.backdrop);
        }
        if (stroke) {
            if (opts.strokeColor) {
                ct***REMOVED***.strokeStyle = opts.strokeColor;
            }
            if (!isNullOrUndef(opts.strokeWidth)) {
                ct***REMOVED***.lineWidth = opts.strokeWidth;
            }
            ct***REMOVED***.strokeTe***REMOVED***t(line, ***REMOVED***, y, opts.ma***REMOVED***Width);
        }
        ct***REMOVED***.fillTe***REMOVED***t(line, ***REMOVED***, y, opts.ma***REMOVED***Width);
        decorateTe***REMOVED***t(ct***REMOVED***, ***REMOVED***, y, line, opts);
        y += Number(font.lineHeight);
    }
    ct***REMOVED***.restore();
}
/**
 * Add a path of a rectangle with rounded corners to the current sub-path
 * @param ct***REMOVED*** - Conte***REMOVED***t
 * @param rect - Bounding rect
 */ function addRoundedRectPath(ct***REMOVED***, rect) {
    const { ***REMOVED*** , y , w , h , radius  } = rect;
    // top left arc
    ct***REMOVED***.arc(***REMOVED*** + radius.topLeft, y + radius.topLeft, radius.topLeft, 1.5 * PI, PI, true);
    // line from top left to bottom left
    ct***REMOVED***.lineTo(***REMOVED***, y + h - radius.bottomLeft);
    // bottom left arc
    ct***REMOVED***.arc(***REMOVED*** + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
    // line from bottom left to bottom right
    ct***REMOVED***.lineTo(***REMOVED*** + w - radius.bottomRight, y + h);
    // bottom right arc
    ct***REMOVED***.arc(***REMOVED*** + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
    // line from bottom right to top right
    ct***REMOVED***.lineTo(***REMOVED*** + w, y + radius.topRight);
    // top right arc
    ct***REMOVED***.arc(***REMOVED*** + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
    // line from top right to top left
    ct***REMOVED***.lineTo(***REMOVED*** + radius.topLeft, y);
}

const LINE_HEIGHT = /^(normal|(\d+(?:\.\d+)?)(p***REMOVED***|em|%)?)$/;
const FONT_STYLE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
/**
 * @alias Chart.helpers.options
 * @namespace
 */ /**
 * Converts the given line height `value` in pi***REMOVED***els for a specific font `size`.
 * @param value - The lineHeight to parse (eg. 1.6, '14p***REMOVED***', '75%', '1.6em').
 * @param size - The font size (in pi***REMOVED***els) used to resolve relative `value`.
 * @returns The effective line height in pi***REMOVED***els (size * 1.2 if value is invalid).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
 * @since 2.7.0
 */ function toLineHeight(value, size) {
    const matches = ('' + value).match(LINE_HEIGHT);
    if (!matches || matches[1] === 'normal') {
        return size * 1.2;
    }
    value = +matches[2];
    switch(matches[3]){
        case 'p***REMOVED***':
            return value;
        case '%':
            value /= 100;
            break;
    }
    return size * value;
}
const numberOrZero = (v)=>+v || 0;
function _readValueToProps(value, props) {
    const ret = {};
    const objProps = isObject(props);
    const keys = objProps ? Object.keys(props) : props;
    const read = isObject(value) ? objProps ? (prop)=>valueOrDefault(value[prop], value[props[prop]]) : (prop)=>value[prop] : ()=>value;
    for (const prop of keys){
        ret[prop] = numberOrZero(read(prop));
    }
    return ret;
}
/**
 * Converts the given value into a TRBL object.
 * @param value - If a number, set the value to all TRBL component,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 *  ***REMOVED*** / y are shorthands for same value for left/right and top/bottom.
 * @returns The padding values (top, right, bottom, left)
 * @since 3.0.0
 */ function toTRBL(value) {
    return _readValueToProps(value, {
        top: 'y',
        right: '***REMOVED***',
        bottom: 'y',
        left: '***REMOVED***'
    });
}
/**
 * Converts the given value into a TRBL corners object (similar with css border-radius).
 * @param value - If a number, set the value to all TRBL corner components,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 * @returns The TRBL corner values (topLeft, topRight, bottomLeft, bottomRight)
 * @since 3.0.0
 */ function toTRBLCorners(value) {
    return _readValueToProps(value, [
        'topLeft',
        'topRight',
        'bottomLeft',
        'bottomRight'
    ]);
}
/**
 * Converts the given value into a padding object with pre-computed width/height.
 * @param value - If a number, set the value to all TRBL component,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 *  ***REMOVED*** / y are shorthands for same value for left/right and top/bottom.
 * @returns The padding values (top, right, bottom, left, width, height)
 * @since 2.7.0
 */ function toPadding(value) {
    const obj = toTRBL(value);
    obj.width = obj.left + obj.right;
    obj.height = obj.top + obj.bottom;
    return obj;
}
/**
 * Parses font options and returns the font object.
 * @param options - A object that contains font options to be parsed.
 * @param fallback - A object that contains fallback font options.
 * @return The font object.
 * @private
 */ function toFont(options, fallback) {
    options = options || {};
    fallback = fallback || defaults.font;
    let size = valueOrDefault(options.size, fallback.size);
    if (typeof size === 'string') {
        size = parseInt(size, 10);
    }
    let style = valueOrDefault(options.style, fallback.style);
    if (style && !('' + style).match(FONT_STYLE)) {
        console.warn('Invalid font style specified: "' + style + '"');
        style = undefined;
    }
    const font = {
        family: valueOrDefault(options.family, fallback.family),
        lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
        size,
        style,
        weight: valueOrDefault(options.weight, fallback.weight),
        string: ''
    };
    font.string = toFontString(font);
    return font;
}
/**
 * Evaluates the given `inputs` sequentially and returns the first defined value.
 * @param inputs - An array of values, falling back to the last value.
 * @param conte***REMOVED***t - If defined and the current value is a function, the value
 * is called with `conte***REMOVED***t` as first argument and the result becomes the new input.
 * @param inde***REMOVED*** - If defined and the current value is an array, the value
 * at `inde***REMOVED***` become the new input.
 * @param info - object to return information about resolution in
 * @param info.cacheable - Will be set to `false` if option is not cacheable.
 * @since 2.7.0
 */ function resolve(inputs, conte***REMOVED***t, inde***REMOVED***, info) {
    let cacheable = true;
    let i, ilen, value;
    for(i = 0, ilen = inputs.length; i < ilen; ++i){
        value = inputs[i];
        if (value === undefined) {
            continue;
        }
        if (conte***REMOVED***t !== undefined && typeof value === 'function') {
            value = value(conte***REMOVED***t);
            cacheable = false;
        }
        if (inde***REMOVED*** !== undefined && isArray(value)) {
            value = value[inde***REMOVED*** % value.length];
            cacheable = false;
        }
        if (value !== undefined) {
            if (info && !cacheable) {
                info.cacheable = false;
            }
            return value;
        }
    }
}
/**
 * @param minma***REMOVED***
 * @param grace
 * @param beginAtZero
 * @private
 */ function _addGrace(minma***REMOVED***, grace, beginAtZero) {
    const { min , ma***REMOVED***  } = minma***REMOVED***;
    const change = toDimension(grace, (ma***REMOVED*** - min) / 2);
    const keepZero = (value, add)=>beginAtZero && value === 0 ? 0 : value + add;
    return {
        min: keepZero(min, -Math.abs(change)),
        ma***REMOVED***: keepZero(ma***REMOVED***, change)
    };
}
function createConte***REMOVED***t(parentConte***REMOVED***t, conte***REMOVED***t) {
    return Object.assign(Object.create(parentConte***REMOVED***t), conte***REMOVED***t);
}

/**
 * Creates a Pro***REMOVED***y for resolving raw values for options.
 * @param scopes - The option scopes to look for values, in resolution order
 * @param prefi***REMOVED***es - The prefi***REMOVED***es for values, in resolution order.
 * @param rootScopes - The root option scopes
 * @param fallback - Parent scopes fallback
 * @param getTarget - callback for getting the target for changed values
 * @returns Pro***REMOVED***y
 * @private
 */ function _createResolver(scopes, prefi***REMOVED***es = [
    ''
], rootScopes, fallback, getTarget = ()=>scopes[0]) {
    const finalRootScopes = rootScopes || scopes;
    if (typeof fallback === 'undefined') {
        fallback = _resolve('_fallback', scopes);
    }
    const cache = {
        [Symbol.toStringTag]: 'Object',
        _cacheable: true,
        _scopes: scopes,
        _rootScopes: finalRootScopes,
        _fallback: fallback,
        _getTarget: getTarget,
        override: (scope)=>_createResolver([
                scope,
                ...scopes
            ], prefi***REMOVED***es, finalRootScopes, fallback)
    };
    return new Pro***REMOVED***y(cache, {
        /**
     * A trap for the delete operator.
     */ deleteProperty (target, prop) {
            delete target[prop]; // remove from cache
            delete target._keys; // remove cached keys
            delete scopes[0][prop]; // remove from top level scope
            return true;
        },
        /**
     * A trap for getting property values.
     */ get (target, prop) {
            return _cached(target, prop, ()=>_resolveWithPrefi***REMOVED***es(prop, prefi***REMOVED***es, scopes, target));
        },
        /**
     * A trap for Object.getOwnPropertyDescriptor.
     * Also used by Object.hasOwnProperty.
     */ getOwnPropertyDescriptor (target, prop) {
            return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
        },
        /**
     * A trap for Object.getPrototypeOf.
     */ getPrototypeOf () {
            return Reflect.getPrototypeOf(scopes[0]);
        },
        /**
     * A trap for the in operator.
     */ has (target, prop) {
            return getKeysFromAllScopes(target).includes(prop);
        },
        /**
     * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
     */ ownKeys (target) {
            return getKeysFromAllScopes(target);
        },
        /**
     * A trap for setting property values.
     */ set (target, prop, value) {
            const storage = target._storage || (target._storage = getTarget());
            target[prop] = storage[prop] = value; // set to top level scope + cache
            delete target._keys; // remove cached keys
            return true;
        }
    });
}
/**
 * Returns an Pro***REMOVED***y for resolving option values with conte***REMOVED***t.
 * @param pro***REMOVED***y - The Pro***REMOVED***y returned by `_createResolver`
 * @param conte***REMOVED***t - Conte***REMOVED***t object for scriptable/inde***REMOVED***able options
 * @param subPro***REMOVED***y - The pro***REMOVED***y provided for scriptable options
 * @param descriptorDefaults - Defaults for descriptors
 * @private
 */ function _attachConte***REMOVED***t(pro***REMOVED***y, conte***REMOVED***t, subPro***REMOVED***y, descriptorDefaults) {
    const cache = {
        _cacheable: false,
        _pro***REMOVED***y: pro***REMOVED***y,
        _conte***REMOVED***t: conte***REMOVED***t,
        _subPro***REMOVED***y: subPro***REMOVED***y,
        _stack: new Set(),
        _descriptors: _descriptors(pro***REMOVED***y, descriptorDefaults),
        setConte***REMOVED***t: (ct***REMOVED***)=>_attachConte***REMOVED***t(pro***REMOVED***y, ct***REMOVED***, subPro***REMOVED***y, descriptorDefaults),
        override: (scope)=>_attachConte***REMOVED***t(pro***REMOVED***y.override(scope), conte***REMOVED***t, subPro***REMOVED***y, descriptorDefaults)
    };
    return new Pro***REMOVED***y(cache, {
        /**
     * A trap for the delete operator.
     */ deleteProperty (target, prop) {
            delete target[prop]; // remove from cache
            delete pro***REMOVED***y[prop]; // remove from pro***REMOVED***y
            return true;
        },
        /**
     * A trap for getting property values.
     */ get (target, prop, receiver) {
            return _cached(target, prop, ()=>_resolveWithConte***REMOVED***t(target, prop, receiver));
        },
        /**
     * A trap for Object.getOwnPropertyDescriptor.
     * Also used by Object.hasOwnProperty.
     */ getOwnPropertyDescriptor (target, prop) {
            return target._descriptors.allKeys ? Reflect.has(pro***REMOVED***y, prop) ? {
                enumerable: true,
                configurable: true
            } : undefined : Reflect.getOwnPropertyDescriptor(pro***REMOVED***y, prop);
        },
        /**
     * A trap for Object.getPrototypeOf.
     */ getPrototypeOf () {
            return Reflect.getPrototypeOf(pro***REMOVED***y);
        },
        /**
     * A trap for the in operator.
     */ has (target, prop) {
            return Reflect.has(pro***REMOVED***y, prop);
        },
        /**
     * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
     */ ownKeys () {
            return Reflect.ownKeys(pro***REMOVED***y);
        },
        /**
     * A trap for setting property values.
     */ set (target, prop, value) {
            pro***REMOVED***y[prop] = value; // set to pro***REMOVED***y
            delete target[prop]; // remove from cache
            return true;
        }
    });
}
/**
 * @private
 */ function _descriptors(pro***REMOVED***y, defaults = {
    scriptable: true,
    inde***REMOVED***able: true
}) {
    const { _scriptable =defaults.scriptable , _inde***REMOVED***able =defaults.inde***REMOVED***able , _allKeys =defaults.allKeys  } = pro***REMOVED***y;
    return {
        allKeys: _allKeys,
        scriptable: _scriptable,
        inde***REMOVED***able: _inde***REMOVED***able,
        isScriptable: isFunction(_scriptable) ? _scriptable : ()=>_scriptable,
        isInde***REMOVED***able: isFunction(_inde***REMOVED***able) ? _inde***REMOVED***able : ()=>_inde***REMOVED***able
    };
}
const readKey = (prefi***REMOVED***, name)=>prefi***REMOVED*** ? prefi***REMOVED*** + _capitalize(name) : name;
const needsSubResolver = (prop, value)=>isObject(value) && prop !== 'adapters' && (Object.getPrototypeOf(value) === null || value.constructor === Object);
function _cached(target, prop, resolve) {
    if (Object.prototype.hasOwnProperty.call(target, prop) || prop === 'constructor') {
        return target[prop];
    }
    const value = resolve();
    // cache the resolved value
    target[prop] = value;
    return value;
}
function _resolveWithConte***REMOVED***t(target, prop, receiver) {
    const { _pro***REMOVED***y , _conte***REMOVED***t , _subPro***REMOVED***y , _descriptors: descriptors  } = target;
    let value = _pro***REMOVED***y[prop]; // resolve from pro***REMOVED***y
    // resolve with conte***REMOVED***t
    if (isFunction(value) && descriptors.isScriptable(prop)) {
        value = _resolveScriptable(prop, value, target, receiver);
    }
    if (isArray(value) && value.length) {
        value = _resolveArray(prop, value, target, descriptors.isInde***REMOVED***able);
    }
    if (needsSubResolver(prop, value)) {
        // if the resolved value is an object, create a sub resolver for it
        value = _attachConte***REMOVED***t(value, _conte***REMOVED***t, _subPro***REMOVED***y && _subPro***REMOVED***y[prop], descriptors);
    }
    return value;
}
function _resolveScriptable(prop, getValue, target, receiver) {
    const { _pro***REMOVED***y , _conte***REMOVED***t , _subPro***REMOVED***y , _stack  } = target;
    if (_stack.has(prop)) {
        throw new Error('Recursion detected: ' + Array.from(_stack).join('->') + '->' + prop);
    }
    _stack.add(prop);
    let value = getValue(_conte***REMOVED***t, _subPro***REMOVED***y || receiver);
    _stack.delete(prop);
    if (needsSubResolver(prop, value)) {
        // When scriptable option returns an object, create a resolver on that.
        value = createSubResolver(_pro***REMOVED***y._scopes, _pro***REMOVED***y, prop, value);
    }
    return value;
}
function _resolveArray(prop, value, target, isInde***REMOVED***able) {
    const { _pro***REMOVED***y , _conte***REMOVED***t , _subPro***REMOVED***y , _descriptors: descriptors  } = target;
    if (typeof _conte***REMOVED***t.inde***REMOVED*** !== 'undefined' && isInde***REMOVED***able(prop)) {
        return value[_conte***REMOVED***t.inde***REMOVED*** % value.length];
    } else if (isObject(value[0])) {
        // Array of objects, return array or resolvers
        const arr = value;
        const scopes = _pro***REMOVED***y._scopes.filter((s)=>s !== arr);
        value = [];
        for (const item of arr){
            const resolver = createSubResolver(scopes, _pro***REMOVED***y, prop, item);
            value.push(_attachConte***REMOVED***t(resolver, _conte***REMOVED***t, _subPro***REMOVED***y && _subPro***REMOVED***y[prop], descriptors));
        }
    }
    return value;
}
function resolveFallback(fallback, prop, value) {
    return isFunction(fallback) ? fallback(prop, value) : fallback;
}
const getScope = (key, parent)=>key === true ? parent : typeof key === 'string' ? resolveObjectKey(parent, key) : undefined;
function addScopes(set, parentScopes, key, parentFallback, value) {
    for (const parent of parentScopes){
        const scope = getScope(key, parent);
        if (scope) {
            set.add(scope);
            const fallback = resolveFallback(scope._fallback, key, value);
            if (typeof fallback !== 'undefined' && fallback !== key && fallback !== parentFallback) {
                // When we reach the descriptor that defines a new _fallback, return that.
                // The fallback will resume to that new scope.
                return fallback;
            }
        } else if (scope === false && typeof parentFallback !== 'undefined' && key !== parentFallback) {
            // Fallback to `false` results to `false`, when falling back to different key.
            // For e***REMOVED***ample `interaction` from `hover` or `plugins.tooltip` and `animation` from `animations`
            return null;
        }
    }
    return false;
}
function createSubResolver(parentScopes, resolver, prop, value) {
    const rootScopes = resolver._rootScopes;
    const fallback = resolveFallback(resolver._fallback, prop, value);
    const allScopes = [
        ...parentScopes,
        ...rootScopes
    ];
    const set = new Set();
    set.add(value);
    let key = addScopesFromKey(set, allScopes, prop, fallback || prop, value);
    if (key === null) {
        return false;
    }
    if (typeof fallback !== 'undefined' && fallback !== prop) {
        key = addScopesFromKey(set, allScopes, fallback, key, value);
        if (key === null) {
            return false;
        }
    }
    return _createResolver(Array.from(set), [
        ''
    ], rootScopes, fallback, ()=>subGetTarget(resolver, prop, value));
}
function addScopesFromKey(set, allScopes, key, fallback, item) {
    while(key){
        key = addScopes(set, allScopes, key, fallback, item);
    }
    return key;
}
function subGetTarget(resolver, prop, value) {
    const parent = resolver._getTarget();
    if (!(prop in parent)) {
        parent[prop] = {};
    }
    const target = parent[prop];
    if (isArray(target) && isObject(value)) {
        // For array of objects, the object is used to store updated values
        return value;
    }
    return target || {};
}
function _resolveWithPrefi***REMOVED***es(prop, prefi***REMOVED***es, scopes, pro***REMOVED***y) {
    let value;
    for (const prefi***REMOVED*** of prefi***REMOVED***es){
        value = _resolve(readKey(prefi***REMOVED***, prop), scopes);
        if (typeof value !== 'undefined') {
            return needsSubResolver(prop, value) ? createSubResolver(scopes, pro***REMOVED***y, prop, value) : value;
        }
    }
}
function _resolve(key, scopes) {
    for (const scope of scopes){
        if (!scope) {
            continue;
        }
        const value = scope[key];
        if (typeof value !== 'undefined') {
            return value;
        }
    }
}
function getKeysFromAllScopes(target) {
    let keys = target._keys;
    if (!keys) {
        keys = target._keys = resolveKeysFromAllScopes(target._scopes);
    }
    return keys;
}
function resolveKeysFromAllScopes(scopes) {
    const set = new Set();
    for (const scope of scopes){
        for (const key of Object.keys(scope).filter((k)=>!k.startsWith('_'))){
            set.add(key);
        }
    }
    return Array.from(set);
}
function _parseObjectDataRadialScale(meta, data, start, count) {
    const { iScale  } = meta;
    const { key ='r'  } = this._parsing;
    const parsed = new Array(count);
    let i, ilen, inde***REMOVED***, item;
    for(i = 0, ilen = count; i < ilen; ++i){
        inde***REMOVED*** = i + start;
        item = data[inde***REMOVED***];
        parsed[i] = {
            r: iScale.parse(resolveObjectKey(item, key), inde***REMOVED***)
        };
    }
    return parsed;
}

const EPSILON = Number.EPSILON || 1e-14;
const getPoint = (points, i)=>i < points.length && !points[i].skip && points[i];
const getValueA***REMOVED***is = (inde***REMOVED***A***REMOVED***is)=>inde***REMOVED***A***REMOVED***is === '***REMOVED***' ? 'y' : '***REMOVED***';
function splineCurve(firstPoint, middlePoint, afterPoint, t) {
    // Props to Rob Spencer at scaled innovation for his post on splining between points
    // http://scaledinnovation.com/analytics/splines/aboutSplines.html
    // This function must also respect "skipped" points
    const previous = firstPoint.skip ? middlePoint : firstPoint;
    const current = middlePoint;
    const ne***REMOVED***t = afterPoint.skip ? middlePoint : afterPoint;
    const d01 = distanceBetweenPoints(current, previous);
    const d12 = distanceBetweenPoints(ne***REMOVED***t, current);
    let s01 = d01 / (d01 + d12);
    let s12 = d12 / (d01 + d12);
    // If all points are the same, s01 & s02 will be inf
    s01 = isNaN(s01) ? 0 : s01;
    s12 = isNaN(s12) ? 0 : s12;
    const fa = t * s01; // scaling factor for triangle Ta
    const fb = t * s12;
    return {
        previous: {
            ***REMOVED***: current.***REMOVED*** - fa * (ne***REMOVED***t.***REMOVED*** - previous.***REMOVED***),
            y: current.y - fa * (ne***REMOVED***t.y - previous.y)
        },
        ne***REMOVED***t: {
            ***REMOVED***: current.***REMOVED*** + fb * (ne***REMOVED***t.***REMOVED*** - previous.***REMOVED***),
            y: current.y + fb * (ne***REMOVED***t.y - previous.y)
        }
    };
}
/**
 * Adjust tangents to ensure monotonic properties
 */ function monotoneAdjust(points, deltaK, mK) {
    const pointsLen = points.length;
    let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for(let i = 0; i < pointsLen - 1; ++i){
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent || !pointAfter) {
            continue;
        }
        if (almostEquals(deltaK[i], 0, EPSILON)) {
            mK[i] = mK[i + 1] = 0;
            continue;
        }
        alphaK = mK[i] / deltaK[i];
        betaK = mK[i + 1] / deltaK[i];
        squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
        if (squaredMagnitude <= 9) {
            continue;
        }
        tauK = 3 / Math.sqrt(squaredMagnitude);
        mK[i] = alphaK * tauK * deltaK[i];
        mK[i + 1] = betaK * tauK * deltaK[i];
    }
}
function monotoneCompute(points, mK, inde***REMOVED***A***REMOVED***is = '***REMOVED***') {
    const valueA***REMOVED***is = getValueA***REMOVED***is(inde***REMOVED***A***REMOVED***is);
    const pointsLen = points.length;
    let delta, pointBefore, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for(let i = 0; i < pointsLen; ++i){
        pointBefore = pointCurrent;
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent) {
            continue;
        }
        const iPi***REMOVED***el = pointCurrent[inde***REMOVED***A***REMOVED***is];
        const vPi***REMOVED***el = pointCurrent[valueA***REMOVED***is];
        if (pointBefore) {
            delta = (iPi***REMOVED***el - pointBefore[inde***REMOVED***A***REMOVED***is]) / 3;
            pointCurrent[`cp1${inde***REMOVED***A***REMOVED***is}`] = iPi***REMOVED***el - delta;
            pointCurrent[`cp1${valueA***REMOVED***is}`] = vPi***REMOVED***el - delta * mK[i];
        }
        if (pointAfter) {
            delta = (pointAfter[inde***REMOVED***A***REMOVED***is] - iPi***REMOVED***el) / 3;
            pointCurrent[`cp2${inde***REMOVED***A***REMOVED***is}`] = iPi***REMOVED***el + delta;
            pointCurrent[`cp2${valueA***REMOVED***is}`] = vPi***REMOVED***el + delta * mK[i];
        }
    }
}
/**
 * This function calculates Bézier control points in a similar way than |splineCurve|,
 * but preserves monotonicity of the provided data and ensures no local e***REMOVED***tremums are added
 * between the dataset discrete points due to the interpolation.
 * See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation
 */ function splineCurveMonotone(points, inde***REMOVED***A***REMOVED***is = '***REMOVED***') {
    const valueA***REMOVED***is = getValueA***REMOVED***is(inde***REMOVED***A***REMOVED***is);
    const pointsLen = points.length;
    const deltaK = Array(pointsLen).fill(0);
    const mK = Array(pointsLen);
    // Calculate slopes (deltaK) and initialize tangents (mK)
    let i, pointBefore, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for(i = 0; i < pointsLen; ++i){
        pointBefore = pointCurrent;
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent) {
            continue;
        }
        if (pointAfter) {
            const slopeDelta = pointAfter[inde***REMOVED***A***REMOVED***is] - pointCurrent[inde***REMOVED***A***REMOVED***is];
            // In the case of two points that appear at the same ***REMOVED*** pi***REMOVED***el, slopeDeltaX is 0
            deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueA***REMOVED***is] - pointCurrent[valueA***REMOVED***is]) / slopeDelta : 0;
        }
        mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
    }
    monotoneAdjust(points, deltaK, mK);
    monotoneCompute(points, mK, inde***REMOVED***A***REMOVED***is);
}
function capControlPoint(pt, min, ma***REMOVED***) {
    return Math.ma***REMOVED***(Math.min(pt, ma***REMOVED***), min);
}
function capBezierPoints(points, area) {
    let i, ilen, point, inArea, inAreaPrev;
    let inAreaNe***REMOVED***t = _isPointInArea(points[0], area);
    for(i = 0, ilen = points.length; i < ilen; ++i){
        inAreaPrev = inArea;
        inArea = inAreaNe***REMOVED***t;
        inAreaNe***REMOVED***t = i < ilen - 1 && _isPointInArea(points[i + 1], area);
        if (!inArea) {
            continue;
        }
        point = points[i];
        if (inAreaPrev) {
            point.cp1***REMOVED*** = capControlPoint(point.cp1***REMOVED***, area.left, area.right);
            point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
        }
        if (inAreaNe***REMOVED***t) {
            point.cp2***REMOVED*** = capControlPoint(point.cp2***REMOVED***, area.left, area.right);
            point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
        }
    }
}
/**
 * @private
 */ function _updateBezierControlPoints(points, options, area, loop, inde***REMOVED***A***REMOVED***is) {
    let i, ilen, point, controlPoints;
    // Only consider points that are drawn in case the spanGaps option is used
    if (options.spanGaps) {
        points = points.filter((pt)=>!pt.skip);
    }
    if (options.cubicInterpolationMode === 'monotone') {
        splineCurveMonotone(points, inde***REMOVED***A***REMOVED***is);
    } else {
        let prev = loop ? points[points.length - 1] : points[0];
        for(i = 0, ilen = points.length; i < ilen; ++i){
            point = points[i];
            controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
            point.cp1***REMOVED*** = controlPoints.previous.***REMOVED***;
            point.cp1y = controlPoints.previous.y;
            point.cp2***REMOVED*** = controlPoints.ne***REMOVED***t.***REMOVED***;
            point.cp2y = controlPoints.ne***REMOVED***t.y;
            prev = point;
        }
    }
    if (options.capBezierPoints) {
        capBezierPoints(points, area);
    }
}

/**
 * Note: typedefs are auto-e***REMOVED***ported, so use a made-up `dom` namespace where
 * necessary to avoid duplicates with `e***REMOVED***port * from './helpers`; see
 * https://github.com/microsoft/TypeScript/issues/46011
 * @typedef { import('../core/core.controller.js').default } dom.Chart
 * @typedef { import('../../types').ChartEvent } ChartEvent
 */ /**
 * @private
 */ function _isDomSupported() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * @private
 */ function _getParentNode(domNode) {
    let parent = domNode.parentNode;
    if (parent && parent.toString() === '[object ShadowRoot]') {
        parent = parent.host;
    }
    return parent;
}
/**
 * convert ma***REMOVED***-width/ma***REMOVED***-height values that may be percentages into a number
 * @private
 */ function parseMa***REMOVED***Style(styleValue, node, parentProperty) {
    let valueInPi***REMOVED***els;
    if (typeof styleValue === 'string') {
        valueInPi***REMOVED***els = parseInt(styleValue, 10);
        if (styleValue.inde***REMOVED***Of('%') !== -1) {
            // percentage * size in dimension
            valueInPi***REMOVED***els = valueInPi***REMOVED***els / 100 * node.parentNode[parentProperty];
        }
    } else {
        valueInPi***REMOVED***els = styleValue;
    }
    return valueInPi***REMOVED***els;
}
const getComputedStyle = (element)=>element.ownerDocument.defaultView.getComputedStyle(element, null);
function getStyle(el, property) {
    return getComputedStyle(el).getPropertyValue(property);
}
const positions = [
    'top',
    'right',
    'bottom',
    'left'
];
function getPositionedStyle(styles, style, suffi***REMOVED***) {
    const result = {};
    suffi***REMOVED*** = suffi***REMOVED*** ? '-' + suffi***REMOVED*** : '';
    for(let i = 0; i < 4; i++){
        const pos = positions[i];
        result[pos] = parseFloat(styles[style + '-' + pos + suffi***REMOVED***]) || 0;
    }
    result.width = result.left + result.right;
    result.height = result.top + result.bottom;
    return result;
}
const useOffsetPos = (***REMOVED***, y, target)=>(***REMOVED*** > 0 || y > 0) && (!target || !target.shadowRoot);
/**
 * @param e
 * @param canvas
 * @returns Canvas position
 */ function getCanvasPosition(e, canvas) {
    const touches = e.touches;
    const source = touches && touches.length ? touches[0] : e;
    const { offsetX , offsetY  } = source;
    let bo***REMOVED*** = false;
    let ***REMOVED***, y;
    if (useOffsetPos(offsetX, offsetY, e.target)) {
        ***REMOVED*** = offsetX;
        y = offsetY;
    } else {
        const rect = canvas.getBoundingClientRect();
        ***REMOVED*** = source.clientX - rect.left;
        y = source.clientY - rect.top;
        bo***REMOVED*** = true;
    }
    return {
        ***REMOVED***,
        y,
        bo***REMOVED***
    };
}
/**
 * Gets an event's ***REMOVED***, y coordinates, relative to the chart area
 * @param event
 * @param chart
 * @returns ***REMOVED*** and y coordinates of the event
 */ function getRelativePosition(event, chart) {
    if ('native' in event) {
        return event;
    }
    const { canvas , currentDevicePi***REMOVED***elRatio  } = chart;
    const style = getComputedStyle(canvas);
    const borderBo***REMOVED*** = style.bo***REMOVED***Sizing === 'border-bo***REMOVED***';
    const paddings = getPositionedStyle(style, 'padding');
    const borders = getPositionedStyle(style, 'border', 'width');
    const { ***REMOVED*** , y , bo***REMOVED***  } = getCanvasPosition(event, canvas);
    const ***REMOVED***Offset = paddings.left + (bo***REMOVED*** && borders.left);
    const yOffset = paddings.top + (bo***REMOVED*** && borders.top);
    let { width , height  } = chart;
    if (borderBo***REMOVED***) {
        width -= paddings.width + borders.width;
        height -= paddings.height + borders.height;
    }
    return {
        ***REMOVED***: Math.round((***REMOVED*** - ***REMOVED***Offset) / width * canvas.width / currentDevicePi***REMOVED***elRatio),
        y: Math.round((y - yOffset) / height * canvas.height / currentDevicePi***REMOVED***elRatio)
    };
}
function getContainerSize(canvas, width, height) {
    let ma***REMOVED***Width, ma***REMOVED***Height;
    if (width === undefined || height === undefined) {
        const container = canvas && _getParentNode(canvas);
        if (!container) {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
        } else {
            const rect = container.getBoundingClientRect(); // this is the border bo***REMOVED*** of the container
            const containerStyle = getComputedStyle(container);
            const containerBorder = getPositionedStyle(containerStyle, 'border', 'width');
            const containerPadding = getPositionedStyle(containerStyle, 'padding');
            width = rect.width - containerPadding.width - containerBorder.width;
            height = rect.height - containerPadding.height - containerBorder.height;
            ma***REMOVED***Width = parseMa***REMOVED***Style(containerStyle.ma***REMOVED***Width, container, 'clientWidth');
            ma***REMOVED***Height = parseMa***REMOVED***Style(containerStyle.ma***REMOVED***Height, container, 'clientHeight');
        }
    }
    return {
        width,
        height,
        ma***REMOVED***Width: ma***REMOVED***Width || INFINITY,
        ma***REMOVED***Height: ma***REMOVED***Height || INFINITY
    };
}
const round1 = (v)=>Math.round(v * 10) / 10;
// eslint-disable-ne***REMOVED***t-line comple***REMOVED***ity
function getMa***REMOVED***imumSize(canvas, bbWidth, bbHeight, aspectRatio) {
    const style = getComputedStyle(canvas);
    const margins = getPositionedStyle(style, 'margin');
    const ma***REMOVED***Width = parseMa***REMOVED***Style(style.ma***REMOVED***Width, canvas, 'clientWidth') || INFINITY;
    const ma***REMOVED***Height = parseMa***REMOVED***Style(style.ma***REMOVED***Height, canvas, 'clientHeight') || INFINITY;
    const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
    let { width , height  } = containerSize;
    if (style.bo***REMOVED***Sizing === 'content-bo***REMOVED***') {
        const borders = getPositionedStyle(style, 'border', 'width');
        const paddings = getPositionedStyle(style, 'padding');
        width -= paddings.width + borders.width;
        height -= paddings.height + borders.height;
    }
    width = Math.ma***REMOVED***(0, width - margins.width);
    height = Math.ma***REMOVED***(0, aspectRatio ? width / aspectRatio : height - margins.height);
    width = round1(Math.min(width, ma***REMOVED***Width, containerSize.ma***REMOVED***Width));
    height = round1(Math.min(height, ma***REMOVED***Height, containerSize.ma***REMOVED***Height));
    if (width && !height) {
        // https://github.com/chartjs/Chart.js/issues/4659
        // If the canvas has width, but no height, default to aspectRatio of 2 (canvas default)
        height = round1(width / 2);
    }
    const maintainHeight = bbWidth !== undefined || bbHeight !== undefined;
    if (maintainHeight && aspectRatio && containerSize.height && height > containerSize.height) {
        height = containerSize.height;
        width = round1(Math.floor(height * aspectRatio));
    }
    return {
        width,
        height
    };
}
/**
 * @param chart
 * @param forceRatio
 * @param forceStyle
 * @returns True if the canvas conte***REMOVED***t size or transformation has changed.
 */ function retinaScale(chart, forceRatio, forceStyle) {
    const pi***REMOVED***elRatio = forceRatio || 1;
    const deviceHeight = Math.floor(chart.height * pi***REMOVED***elRatio);
    const deviceWidth = Math.floor(chart.width * pi***REMOVED***elRatio);
    chart.height = Math.floor(chart.height);
    chart.width = Math.floor(chart.width);
    const canvas = chart.canvas;
    // If no style has been set on the canvas, the render size is used as display size,
    // making the chart visually bigger, so let's enforce it to the "correct" values.
    // See https://github.com/chartjs/Chart.js/issues/3575
    if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
        canvas.style.height = `${chart.height}p***REMOVED***`;
        canvas.style.width = `${chart.width}p***REMOVED***`;
    }
    if (chart.currentDevicePi***REMOVED***elRatio !== pi***REMOVED***elRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
        chart.currentDevicePi***REMOVED***elRatio = pi***REMOVED***elRatio;
        canvas.height = deviceHeight;
        canvas.width = deviceWidth;
        chart.ct***REMOVED***.setTransform(pi***REMOVED***elRatio, 0, 0, pi***REMOVED***elRatio, 0, 0);
        return true;
    }
    return false;
}
/**
 * Detects support for options object argument in addEventListener.
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
 * @private
 */ const supportsEventListenerOptions = function() {
    let passiveSupported = false;
    try {
        const options = {
            get passive () {
                passiveSupported = true;
                return false;
            }
        };
        if (_isDomSupported()) {
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        }
    } catch (e) {
    // continue regardless of error
    }
    return passiveSupported;
}();
/**
 * The "used" size is the final value of a dimension property after all calculations have
 * been performed. This method uses the computed style of `element` but returns undefined
 * if the computed style is not e***REMOVED***pressed in pi***REMOVED***els. That can happen in some cases where
 * `element` has a size relative to its parent and this last one is not yet displayed,
 * for e***REMOVED***ample because of `display: none` on a parent node.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
 * @returns Size in pi***REMOVED***els or undefined if unknown.
 */ function readUsedSize(element, property) {
    const value = getStyle(element, property);
    const matches = value && value.match(/^(\d+)(\.\d+)?p***REMOVED***$/);
    return matches ? +matches[1] : undefined;
}

/**
 * @private
 */ function _pointInLine(p1, p2, t, mode) {
    return {
        ***REMOVED***: p1.***REMOVED*** + t * (p2.***REMOVED*** - p1.***REMOVED***),
        y: p1.y + t * (p2.y - p1.y)
    };
}
/**
 * @private
 */ function _steppedInterpolation(p1, p2, t, mode) {
    return {
        ***REMOVED***: p1.***REMOVED*** + t * (p2.***REMOVED*** - p1.***REMOVED***),
        y: mode === 'middle' ? t < 0.5 ? p1.y : p2.y : mode === 'after' ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
    };
}
/**
 * @private
 */ function _bezierInterpolation(p1, p2, t, mode) {
    const cp1 = {
        ***REMOVED***: p1.cp2***REMOVED***,
        y: p1.cp2y
    };
    const cp2 = {
        ***REMOVED***: p2.cp1***REMOVED***,
        y: p2.cp1y
    };
    const a = _pointInLine(p1, cp1, t);
    const b = _pointInLine(cp1, cp2, t);
    const c = _pointInLine(cp2, p2, t);
    const d = _pointInLine(a, b, t);
    const e = _pointInLine(b, c, t);
    return _pointInLine(d, e, t);
}

const getRightToLeftAdapter = function(rectX, width) {
    return {
        ***REMOVED*** (***REMOVED***) {
            return rectX + rectX + width - ***REMOVED***;
        },
        setWidth (w) {
            width = w;
        },
        te***REMOVED***tAlign (align) {
            if (align === 'center') {
                return align;
            }
            return align === 'right' ? 'left' : 'right';
        },
        ***REMOVED***Plus (***REMOVED***, value) {
            return ***REMOVED*** - value;
        },
        leftForLtr (***REMOVED***, itemWidth) {
            return ***REMOVED*** - itemWidth;
        }
    };
};
const getLeftToRightAdapter = function() {
    return {
        ***REMOVED*** (***REMOVED***) {
            return ***REMOVED***;
        },
        setWidth (w) {},
        te***REMOVED***tAlign (align) {
            return align;
        },
        ***REMOVED***Plus (***REMOVED***, value) {
            return ***REMOVED*** + value;
        },
        leftForLtr (***REMOVED***, _itemWidth) {
            return ***REMOVED***;
        }
    };
};
function getRtlAdapter(rtl, rectX, width) {
    return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
}
function overrideTe***REMOVED***tDirection(ct***REMOVED***, direction) {
    let style, original;
    if (direction === 'ltr' || direction === 'rtl') {
        style = ct***REMOVED***.canvas.style;
        original = [
            style.getPropertyValue('direction'),
            style.getPropertyPriority('direction')
        ];
        style.setProperty('direction', direction, 'important');
        ct***REMOVED***.prevTe***REMOVED***tDirection = original;
    }
}
function restoreTe***REMOVED***tDirection(ct***REMOVED***, original) {
    if (original !== undefined) {
        delete ct***REMOVED***.prevTe***REMOVED***tDirection;
        ct***REMOVED***.canvas.style.setProperty('direction', original[0], original[1]);
    }
}

function propertyFn(property) {
    if (property === 'angle') {
        return {
            between: _angleBetween,
            compare: _angleDiff,
            normalize: _normalizeAngle
        };
    }
    return {
        between: _isBetween,
        compare: (a, b)=>a - b,
        normalize: (***REMOVED***)=>***REMOVED***
    };
}
function normalizeSegment({ start , end , count , loop , style  }) {
    return {
        start: start % count,
        end: end % count,
        loop: loop && (end - start + 1) % count === 0,
        style
    };
}
function getSegment(segment, points, bounds) {
    const { property , start: startBound , end: endBound  } = bounds;
    const { between , normalize  } = propertyFn(property);
    const count = points.length;
    let { start , end , loop  } = segment;
    let i, ilen;
    if (loop) {
        start += count;
        end += count;
        for(i = 0, ilen = count; i < ilen; ++i){
            if (!between(normalize(points[start % count][property]), startBound, endBound)) {
                break;
            }
            start--;
            end--;
        }
        start %= count;
        end %= count;
    }
    if (end < start) {
        end += count;
    }
    return {
        start,
        end,
        loop,
        style: segment.style
    };
}
 function _boundSegment(segment, points, bounds) {
    if (!bounds) {
        return [
            segment
        ];
    }
    const { property , start: startBound , end: endBound  } = bounds;
    const count = points.length;
    const { compare , between , normalize  } = propertyFn(property);
    const { start , end , loop , style  } = getSegment(segment, points, bounds);
    const result = [];
    let inside = false;
    let subStart = null;
    let value, point, prevValue;
    const startIsBefore = ()=>between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
    const endIsBefore = ()=>compare(endBound, value) === 0 || between(endBound, prevValue, value);
    const shouldStart = ()=>inside || startIsBefore();
    const shouldStop = ()=>!inside || endIsBefore();
    for(let i = start, prev = start; i <= end; ++i){
        point = points[i % count];
        if (point.skip) {
            continue;
        }
        value = normalize(point[property]);
        if (value === prevValue) {
            continue;
        }
        inside = between(value, startBound, endBound);
        if (subStart === null && shouldStart()) {
            subStart = compare(value, startBound) === 0 ? i : prev;
        }
        if (subStart !== null && shouldStop()) {
            result.push(normalizeSegment({
                start: subStart,
                end: i,
                loop,
                count,
                style
            }));
            subStart = null;
        }
        prev = i;
        prevValue = value;
    }
    if (subStart !== null) {
        result.push(normalizeSegment({
            start: subStart,
            end,
            loop,
            count,
            style
        }));
    }
    return result;
}
 function _boundSegments(line, bounds) {
    const result = [];
    const segments = line.segments;
    for(let i = 0; i < segments.length; i++){
        const sub = _boundSegment(segments[i], line.points, bounds);
        if (sub.length) {
            result.push(...sub);
        }
    }
    return result;
}
 function findStartAndEnd(points, count, loop, spanGaps) {
    let start = 0;
    let end = count - 1;
    if (loop && !spanGaps) {
        while(start < count && !points[start].skip){
            start++;
        }
    }
    while(start < count && points[start].skip){
        start++;
    }
    start %= count;
    if (loop) {
        end += start;
    }
    while(end > start && points[end % count].skip){
        end--;
    }
    end %= count;
    return {
        start,
        end
    };
}
 function solidSegments(points, start, ma***REMOVED***, loop) {
    const count = points.length;
    const result = [];
    let last = start;
    let prev = points[start];
    let end;
    for(end = start + 1; end <= ma***REMOVED***; ++end){
        const cur = points[end % count];
        if (cur.skip || cur.stop) {
            if (!prev.skip) {
                loop = false;
                result.push({
                    start: start % count,
                    end: (end - 1) % count,
                    loop
                });
                start = last = cur.stop ? end : null;
            }
        } else {
            last = end;
            if (prev.skip) {
                start = end;
            }
        }
        prev = cur;
    }
    if (last !== null) {
        result.push({
            start: start % count,
            end: last % count,
            loop
        });
    }
    return result;
}
 function _computeSegments(line, segmentOptions) {
    const points = line.points;
    const spanGaps = line.options.spanGaps;
    const count = points.length;
    if (!count) {
        return [];
    }
    const loop = !!line._loop;
    const { start , end  } = findStartAndEnd(points, count, loop, spanGaps);
    if (spanGaps === true) {
        return splitByStyles(line, [
            {
                start,
                end,
                loop
            }
        ], points, segmentOptions);
    }
    const ma***REMOVED*** = end < start ? end + count : end;
    const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
    return splitByStyles(line, solidSegments(points, start, ma***REMOVED***, completeLoop), points, segmentOptions);
}
 function splitByStyles(line, segments, points, segmentOptions) {
    if (!segmentOptions || !segmentOptions.setConte***REMOVED***t || !points) {
        return segments;
    }
    return doSplitByStyles(line, segments, points, segmentOptions);
}
 function doSplitByStyles(line, segments, points, segmentOptions) {
    const chartConte***REMOVED***t = line._chart.getConte***REMOVED***t();
    const baseStyle = readStyle(line.options);
    const { _datasetInde***REMOVED***: datasetInde***REMOVED*** , options: { spanGaps  }  } = line;
    const count = points.length;
    const result = [];
    let prevStyle = baseStyle;
    let start = segments[0].start;
    let i = start;
    function addStyle(s, e, l, st) {
        const dir = spanGaps ? -1 : 1;
        if (s === e) {
            return;
        }
        s += count;
        while(points[s % count].skip){
            s -= dir;
        }
        while(points[e % count].skip){
            e += dir;
        }
        if (s % count !== e % count) {
            result.push({
                start: s % count,
                end: e % count,
                loop: l,
                style: st
            });
            prevStyle = st;
            start = e % count;
        }
    }
    for (const segment of segments){
        start = spanGaps ? start : segment.start;
        let prev = points[start % count];
        let style;
        for(i = start + 1; i <= segment.end; i++){
            const pt = points[i % count];
            style = readStyle(segmentOptions.setConte***REMOVED***t(createConte***REMOVED***t(chartConte***REMOVED***t, {
                type: 'segment',
                p0: prev,
                p1: pt,
                p0DataInde***REMOVED***: (i - 1) % count,
                p1DataInde***REMOVED***: i % count,
                datasetInde***REMOVED***
            })));
            if (styleChanged(style, prevStyle)) {
                addStyle(start, i - 1, segment.loop, prevStyle);
            }
            prev = pt;
            prevStyle = style;
        }
        if (start < i - 1) {
            addStyle(start, i - 1, segment.loop, prevStyle);
        }
    }
    return result;
}
function readStyle(options) {
    return {
        backgroundColor: options.backgroundColor,
        borderCapStyle: options.borderCapStyle,
        borderDash: options.borderDash,
        borderDashOffset: options.borderDashOffset,
        borderJoinStyle: options.borderJoinStyle,
        borderWidth: options.borderWidth,
        borderColor: options.borderColor
    };
}
function styleChanged(style, prevStyle) {
    if (!prevStyle) {
        return false;
    }
    const cache = [];
    const replacer = function(key, value) {
        if (!isPatternOrGradient(value)) {
            return value;
        }
        if (!cache.includes(value)) {
            cache.push(value);
        }
        return cache.inde***REMOVED***Of(value);
    };
    return JSON.stringify(style, replacer) !== JSON.stringify(prevStyle, replacer);
}

e***REMOVED***ports.HALF_PI = HALF_PI;
e***REMOVED***ports.INFINITY = INFINITY;
e***REMOVED***ports.PI = PI;
e***REMOVED***ports.PITAU = PITAU;
e***REMOVED***ports.QUARTER_PI = QUARTER_PI;
e***REMOVED***ports.RAD_PER_DEG = RAD_PER_DEG;
e***REMOVED***ports.TAU = TAU;
e***REMOVED***ports.TWO_THIRDS_PI = TWO_THIRDS_PI;
e***REMOVED***ports.Ticks = Ticks;
e***REMOVED***ports._addGrace = _addGrace;
e***REMOVED***ports._alignPi***REMOVED***el = _alignPi***REMOVED***el;
e***REMOVED***ports._alignStartEnd = _alignStartEnd;
e***REMOVED***ports._angleBetween = _angleBetween;
e***REMOVED***ports._angleDiff = _angleDiff;
e***REMOVED***ports._arrayUnique = _arrayUnique;
e***REMOVED***ports._attachConte***REMOVED***t = _attachConte***REMOVED***t;
e***REMOVED***ports._bezierCurveTo = _bezierCurveTo;
e***REMOVED***ports._bezierInterpolation = _bezierInterpolation;
e***REMOVED***ports._boundSegment = _boundSegment;
e***REMOVED***ports._boundSegments = _boundSegments;
e***REMOVED***ports._capitalize = _capitalize;
e***REMOVED***ports._computeSegments = _computeSegments;
e***REMOVED***ports._createResolver = _createResolver;
e***REMOVED***ports._decimalPlaces = _decimalPlaces;
e***REMOVED***ports._deprecated = _deprecated;
e***REMOVED***ports._descriptors = _descriptors;
e***REMOVED***ports._elementsEqual = _elementsEqual;
e***REMOVED***ports._factorize = _factorize;
e***REMOVED***ports._filterBetween = _filterBetween;
e***REMOVED***ports._getParentNode = _getParentNode;
e***REMOVED***ports._getStartAndCountOfVisiblePoints = _getStartAndCountOfVisiblePoints;
e***REMOVED***ports._int16Range = _int16Range;
e***REMOVED***ports._isBetween = _isBetween;
e***REMOVED***ports._isClickEvent = _isClickEvent;
e***REMOVED***ports._isDomSupported = _isDomSupported;
e***REMOVED***ports._isPointInArea = _isPointInArea;
e***REMOVED***ports._limitValue = _limitValue;
e***REMOVED***ports._longestTe***REMOVED***t = _longestTe***REMOVED***t;
e***REMOVED***ports._lookup = _lookup;
e***REMOVED***ports._lookupByKey = _lookupByKey;
e***REMOVED***ports._measureTe***REMOVED***t = _measureTe***REMOVED***t;
e***REMOVED***ports._merger = _merger;
e***REMOVED***ports._mergerIf = _mergerIf;
e***REMOVED***ports._normalizeAngle = _normalizeAngle;
e***REMOVED***ports._parseObjectDataRadialScale = _parseObjectDataRadialScale;
e***REMOVED***ports._pointInLine = _pointInLine;
e***REMOVED***ports._readValueToProps = _readValueToProps;
e***REMOVED***ports._rlookupByKey = _rlookupByKey;
e***REMOVED***ports._scaleRangesChanged = _scaleRangesChanged;
e***REMOVED***ports._setMinAndMa***REMOVED***ByKey = _setMinAndMa***REMOVED***ByKey;
e***REMOVED***ports._splitKey = _splitKey;
e***REMOVED***ports._steppedInterpolation = _steppedInterpolation;
e***REMOVED***ports._steppedLineTo = _steppedLineTo;
e***REMOVED***ports._te***REMOVED***tX = _te***REMOVED***tX;
e***REMOVED***ports._toLeftRightCenter = _toLeftRightCenter;
e***REMOVED***ports._updateBezierControlPoints = _updateBezierControlPoints;
e***REMOVED***ports.addRoundedRectPath = addRoundedRectPath;
e***REMOVED***ports.almostEquals = almostEquals;
e***REMOVED***ports.almostWhole = almostWhole;
e***REMOVED***ports.callback = callback;
e***REMOVED***ports.clearCanvas = clearCanvas;
e***REMOVED***ports.clipArea = clipArea;
e***REMOVED***ports.clone = clone;
e***REMOVED***ports.color = color;
e***REMOVED***ports.createConte***REMOVED***t = createConte***REMOVED***t;
e***REMOVED***ports.debounce = debounce;
e***REMOVED***ports.defaults = defaults;
e***REMOVED***ports.defined = defined;
e***REMOVED***ports.descriptors = descriptors;
e***REMOVED***ports.distanceBetweenPoints = distanceBetweenPoints;
e***REMOVED***ports.drawPoint = drawPoint;
e***REMOVED***ports.drawPointLegend = drawPointLegend;
e***REMOVED***ports.each = each;
e***REMOVED***ports.effects = effects;
e***REMOVED***ports.finiteOrDefault = finiteOrDefault;
e***REMOVED***ports.fontString = fontString;
e***REMOVED***ports.formatNumber = formatNumber;
e***REMOVED***ports.getAngleFromPoint = getAngleFromPoint;
e***REMOVED***ports.getHoverColor = getHoverColor;
e***REMOVED***ports.getMa***REMOVED***imumSize = getMa***REMOVED***imumSize;
e***REMOVED***ports.getRelativePosition = getRelativePosition;
e***REMOVED***ports.getRtlAdapter = getRtlAdapter;
e***REMOVED***ports.getStyle = getStyle;
e***REMOVED***ports.isArray = isArray;
e***REMOVED***ports.isFunction = isFunction;
e***REMOVED***ports.isNullOrUndef = isNullOrUndef;
e***REMOVED***ports.isNumber = isNumber;
e***REMOVED***ports.isNumberFinite = isNumberFinite;
e***REMOVED***ports.isObject = isObject;
e***REMOVED***ports.isPatternOrGradient = isPatternOrGradient;
e***REMOVED***ports.listenArrayEvents = listenArrayEvents;
e***REMOVED***ports.log10 = log10;
e***REMOVED***ports.merge = merge;
e***REMOVED***ports.mergeIf = mergeIf;
e***REMOVED***ports.niceNum = niceNum;
e***REMOVED***ports.noop = noop;
e***REMOVED***ports.overrideTe***REMOVED***tDirection = overrideTe***REMOVED***tDirection;
e***REMOVED***ports.overrides = overrides;
e***REMOVED***ports.readUsedSize = readUsedSize;
e***REMOVED***ports.renderTe***REMOVED***t = renderTe***REMOVED***t;
e***REMOVED***ports.requestAnimFrame = requestAnimFrame;
e***REMOVED***ports.resolve = resolve;
e***REMOVED***ports.resolveObjectKey = resolveObjectKey;
e***REMOVED***ports.restoreTe***REMOVED***tDirection = restoreTe***REMOVED***tDirection;
e***REMOVED***ports.retinaScale = retinaScale;
e***REMOVED***ports.setsEqual = setsEqual;
e***REMOVED***ports.sign = sign;
e***REMOVED***ports.splineCurve = splineCurve;
e***REMOVED***ports.splineCurveMonotone = splineCurveMonotone;
e***REMOVED***ports.supportsEventListenerOptions = supportsEventListenerOptions;
e***REMOVED***ports.throttled = throttled;
e***REMOVED***ports.toDegrees = toDegrees;
e***REMOVED***ports.toDimension = toDimension;
e***REMOVED***ports.toFont = toFont;
e***REMOVED***ports.toFontString = toFontString;
e***REMOVED***ports.toLineHeight = toLineHeight;
e***REMOVED***ports.toPadding = toPadding;
e***REMOVED***ports.toPercentage = toPercentage;
e***REMOVED***ports.toRadians = toRadians;
e***REMOVED***ports.toTRBL = toTRBL;
e***REMOVED***ports.toTRBLCorners = toTRBLCorners;
e***REMOVED***ports.uid = uid;
e***REMOVED***ports.unclipArea = unclipArea;
e***REMOVED***ports.unlistenArrayEvents = unlistenArrayEvents;
e***REMOVED***ports.valueOrDefault = valueOrDefault;
//# sourceMappingURL=helpers.segment.cjs.map
