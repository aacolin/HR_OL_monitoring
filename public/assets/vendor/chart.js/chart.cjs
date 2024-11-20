/*!
 * Chart.js v4.4.3
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */
'use strict';

var helpers_segment = require('./chunks/helpers.segment.cjs');
require('@kurkle/color');

class Animator {
    constructor(){
        this._request = null;
        this._charts = new Map();
        this._running = false;
        this._lastDate = undefined;
    }
 _notify(chart, anims, date, type) {
        const callbacks = anims.listeners[type];
        const numSteps = anims.duration;
        callbacks.forEach((fn)=>fn({
                chart,
                initial: anims.initial,
                numSteps,
                currentStep: Math.min(date - anims.start, numSteps)
            }));
    }
 _refresh() {
        if (this._request) {
            return;
        }
        this._running = true;
        this._request = helpers_segment.requestAnimFrame.call(window, ()=>{
            this._update();
            this._request = null;
            if (this._running) {
                this._refresh();
            }
        });
    }
 _update(date = Date.now()) {
        let remaining = 0;
        this._charts.forEach((anims, chart)=>{
            if (!anims.running || !anims.items.length) {
                return;
            }
            const items = anims.items;
            let i = items.length - 1;
            let draw = false;
            let item;
            for(; i >= 0; --i){
                item = items[i];
                if (item._active) {
                    if (item._total > anims.duration) {
                        anims.duration = item._total;
                    }
                    item.tick(date);
                    draw = true;
                } else {
                    items[i] = items[items.length - 1];
                    items.pop();
                }
            }
            if (draw) {
                chart.draw();
                this._notify(chart, anims, date, 'progress');
            }
            if (!items.length) {
                anims.running = false;
                this._notify(chart, anims, date, 'complete');
                anims.initial = false;
            }
            remaining += items.length;
        });
        this._lastDate = date;
        if (remaining === 0) {
            this._running = false;
        }
    }
 _getAnims(chart) {
        const charts = this._charts;
        let anims = charts.get(chart);
        if (!anims) {
            anims = {
                running: false,
                initial: true,
                items: [],
                listeners: {
                    complete: [],
                    progress: []
                }
            };
            charts.set(chart, anims);
        }
        return anims;
    }
 listen(chart, event, cb) {
        this._getAnims(chart).listeners[event].push(cb);
    }
 add(chart, items) {
        if (!items || !items.length) {
            return;
        }
        this._getAnims(chart).items.push(...items);
    }
 has(chart) {
        return this._getAnims(chart).items.length > 0;
    }
 start(chart) {
        const anims = this._charts.get(chart);
        if (!anims) {
            return;
        }
        anims.running = true;
        anims.start = Date.now();
        anims.duration = anims.items.reduce((acc, cur)=>Math.ma***REMOVED***(acc, cur._duration), 0);
        this._refresh();
    }
    running(chart) {
        if (!this._running) {
            return false;
        }
        const anims = this._charts.get(chart);
        if (!anims || !anims.running || !anims.items.length) {
            return false;
        }
        return true;
    }
 stop(chart) {
        const anims = this._charts.get(chart);
        if (!anims || !anims.items.length) {
            return;
        }
        const items = anims.items;
        let i = items.length - 1;
        for(; i >= 0; --i){
            items[i].cancel();
        }
        anims.items = [];
        this._notify(chart, anims, Date.now(), 'complete');
    }
 remove(chart) {
        return this._charts.delete(chart);
    }
}
var animator = /* #__PURE__ */ new Animator();

const transparent = 'transparent';
const interpolators = {
    boolean (from, to, factor) {
        return factor > 0.5 ? to : from;
    },
 color (from, to, factor) {
        const c0 = helpers_segment.color(from || transparent);
        const c1 = c0.valid && helpers_segment.color(to || transparent);
        return c1 && c1.valid ? c1.mi***REMOVED***(c0, factor).he***REMOVED***String() : to;
    },
    number (from, to, factor) {
        return from + (to - from) * factor;
    }
};
class Animation {
    constructor(cfg, target, prop, to){
        const currentValue = target[prop];
        to = helpers_segment.resolve([
            cfg.to,
            to,
            currentValue,
            cfg.from
        ]);
        const from = helpers_segment.resolve([
            cfg.from,
            currentValue,
            to
        ]);
        this._active = true;
        this._fn = cfg.fn || interpolators[cfg.type || typeof from];
        this._easing = helpers_segment.effects[cfg.easing] || helpers_segment.effects.linear;
        this._start = Math.floor(Date.now() + (cfg.delay || 0));
        this._duration = this._total = Math.floor(cfg.duration);
        this._loop = !!cfg.loop;
        this._target = target;
        this._prop = prop;
        this._from = from;
        this._to = to;
        this._promises = undefined;
    }
    active() {
        return this._active;
    }
    update(cfg, to, date) {
        if (this._active) {
            this._notify(false);
            const currentValue = this._target[this._prop];
            const elapsed = date - this._start;
            const remain = this._duration - elapsed;
            this._start = date;
            this._duration = Math.floor(Math.ma***REMOVED***(remain, cfg.duration));
            this._total += elapsed;
            this._loop = !!cfg.loop;
            this._to = helpers_segment.resolve([
                cfg.to,
                to,
                currentValue,
                cfg.from
            ]);
            this._from = helpers_segment.resolve([
                cfg.from,
                currentValue,
                to
            ]);
        }
    }
    cancel() {
        if (this._active) {
            this.tick(Date.now());
            this._active = false;
            this._notify(false);
        }
    }
    tick(date) {
        const elapsed = date - this._start;
        const duration = this._duration;
        const prop = this._prop;
        const from = this._from;
        const loop = this._loop;
        const to = this._to;
        let factor;
        this._active = from !== to && (loop || elapsed < duration);
        if (!this._active) {
            this._target[prop] = to;
            this._notify(true);
            return;
        }
        if (elapsed < 0) {
            this._target[prop] = from;
            return;
        }
        factor = elapsed / duration % 2;
        factor = loop && factor > 1 ? 2 - factor : factor;
        factor = this._easing(Math.min(1, Math.ma***REMOVED***(0, factor)));
        this._target[prop] = this._fn(from, to, factor);
    }
    wait() {
        const promises = this._promises || (this._promises = []);
        return new Promise((res, rej)=>{
            promises.push({
                res,
                rej
            });
        });
    }
    _notify(resolved) {
        const method = resolved ? 'res' : 'rej';
        const promises = this._promises || [];
        for(let i = 0; i < promises.length; i++){
            promises[i][method]();
        }
    }
}

class Animations {
    constructor(chart, config){
        this._chart = chart;
        this._properties = new Map();
        this.configure(config);
    }
    configure(config) {
        if (!helpers_segment.isObject(config)) {
            return;
        }
        const animationOptions = Object.keys(helpers_segment.defaults.animation);
        const animatedProps = this._properties;
        Object.getOwnPropertyNames(config).forEach((key)=>{
            const cfg = config[key];
            if (!helpers_segment.isObject(cfg)) {
                return;
            }
            const resolved = {};
            for (const option of animationOptions){
                resolved[option] = cfg[option];
            }
            (helpers_segment.isArray(cfg.properties) && cfg.properties || [
                key
            ]).forEach((prop)=>{
                if (prop === key || !animatedProps.has(prop)) {
                    animatedProps.set(prop, resolved);
                }
            });
        });
    }
 _animateOptions(target, values) {
        const newOptions = values.options;
        const options = resolveTargetOptions(target, newOptions);
        if (!options) {
            return [];
        }
        const animations = this._createAnimations(options, newOptions);
        if (newOptions.$shared) {
            awaitAll(target.options.$animations, newOptions).then(()=>{
                target.options = newOptions;
            }, ()=>{
            });
        }
        return animations;
    }
 _createAnimations(target, values) {
        const animatedProps = this._properties;
        const animations = [];
        const running = target.$animations || (target.$animations = {});
        const props = Object.keys(values);
        const date = Date.now();
        let i;
        for(i = props.length - 1; i >= 0; --i){
            const prop = props[i];
            if (prop.charAt(0) === '$') {
                continue;
            }
            if (prop === 'options') {
                animations.push(...this._animateOptions(target, values));
                continue;
            }
            const value = values[prop];
            let animation = running[prop];
            const cfg = animatedProps.get(prop);
            if (animation) {
                if (cfg && animation.active()) {
                    animation.update(cfg, value, date);
                    continue;
                } else {
                    animation.cancel();
                }
            }
            if (!cfg || !cfg.duration) {
                target[prop] = value;
                continue;
            }
            running[prop] = animation = new Animation(cfg, target, prop, value);
            animations.push(animation);
        }
        return animations;
    }
 update(target, values) {
        if (this._properties.size === 0) {
            Object.assign(target, values);
            return;
        }
        const animations = this._createAnimations(target, values);
        if (animations.length) {
            animator.add(this._chart, animations);
            return true;
        }
    }
}
function awaitAll(animations, properties) {
    const running = [];
    const keys = Object.keys(properties);
    for(let i = 0; i < keys.length; i++){
        const anim = animations[keys[i]];
        if (anim && anim.active()) {
            running.push(anim.wait());
        }
    }
    return Promise.all(running);
}
function resolveTargetOptions(target, newOptions) {
    if (!newOptions) {
        return;
    }
    let options = target.options;
    if (!options) {
        target.options = newOptions;
        return;
    }
    if (options.$shared) {
        target.options = options = Object.assign({}, options, {
            $shared: false,
            $animations: {}
        });
    }
    return options;
}

function scaleClip(scale, allowedOverflow) {
    const opts = scale && scale.options || {};
    const reverse = opts.reverse;
    const min = opts.min === undefined ? allowedOverflow : 0;
    const ma***REMOVED*** = opts.ma***REMOVED*** === undefined ? allowedOverflow : 0;
    return {
        start: reverse ? ma***REMOVED*** : min,
        end: reverse ? min : ma***REMOVED***
    };
}
function defaultClip(***REMOVED***Scale, yScale, allowedOverflow) {
    if (allowedOverflow === false) {
        return false;
    }
    const ***REMOVED*** = scaleClip(***REMOVED***Scale, allowedOverflow);
    const y = scaleClip(yScale, allowedOverflow);
    return {
        top: y.end,
        right: ***REMOVED***.end,
        bottom: y.start,
        left: ***REMOVED***.start
    };
}
function toClip(value) {
    let t, r, b, l;
    if (helpers_segment.isObject(value)) {
        t = value.top;
        r = value.right;
        b = value.bottom;
        l = value.left;
    } else {
        t = r = b = l = value;
    }
    return {
        top: t,
        right: r,
        bottom: b,
        left: l,
        disabled: value === false
    };
}
function getSortedDatasetIndices(chart, filterVisible) {
    const keys = [];
    const metasets = chart._getSortedDatasetMetas(filterVisible);
    let i, ilen;
    for(i = 0, ilen = metasets.length; i < ilen; ++i){
        keys.push(metasets[i].inde***REMOVED***);
    }
    return keys;
}
function applyStack(stack, value, dsInde***REMOVED***, options = {}) {
    const keys = stack.keys;
    const singleMode = options.mode === 'single';
    let i, ilen, datasetInde***REMOVED***, otherValue;
    if (value === null) {
        return;
    }
    for(i = 0, ilen = keys.length; i < ilen; ++i){
        datasetInde***REMOVED*** = +keys[i];
        if (datasetInde***REMOVED*** === dsInde***REMOVED***) {
            if (options.all) {
                continue;
            }
            break;
        }
        otherValue = stack.values[datasetInde***REMOVED***];
        if (helpers_segment.isNumberFinite(otherValue) && (singleMode || value === 0 || helpers_segment.sign(value) === helpers_segment.sign(otherValue))) {
            value += otherValue;
        }
    }
    return value;
}
function convertObjectDataToArray(data, meta) {
    const { iScale , vScale  } = meta;
    const iA***REMOVED***isKey = iScale.a***REMOVED***is === '***REMOVED***' ? '***REMOVED***' : 'y';
    const vA***REMOVED***isKey = vScale.a***REMOVED***is === '***REMOVED***' ? '***REMOVED***' : 'y';
    const keys = Object.keys(data);
    const adata = new Array(keys.length);
    let i, ilen, key;
    for(i = 0, ilen = keys.length; i < ilen; ++i){
        key = keys[i];
        adata[i] = {
            [iA***REMOVED***isKey]: key,
            [vA***REMOVED***isKey]: data[key]
        };
    }
    return adata;
}
function isStacked(scale, meta) {
    const stacked = scale && scale.options.stacked;
    return stacked || stacked === undefined && meta.stack !== undefined;
}
function getStackKey(inde***REMOVED***Scale, valueScale, meta) {
    return `${inde***REMOVED***Scale.id}.${valueScale.id}.${meta.stack || meta.type}`;
}
function getUserBounds(scale) {
    const { min , ma***REMOVED*** , minDefined , ma***REMOVED***Defined  } = scale.getUserBounds();
    return {
        min: minDefined ? min : Number.NEGATIVE_INFINITY,
        ma***REMOVED***: ma***REMOVED***Defined ? ma***REMOVED*** : Number.POSITIVE_INFINITY
    };
}
function getOrCreateStack(stacks, stackKey, inde***REMOVED***Value) {
    const subStack = stacks[stackKey] || (stacks[stackKey] = {});
    return subStack[inde***REMOVED***Value] || (subStack[inde***REMOVED***Value] = {});
}
function getLastInde***REMOVED***InStack(stack, vScale, positive, type) {
    for (const meta of vScale.getMatchingVisibleMetas(type).reverse()){
        const value = stack[meta.inde***REMOVED***];
        if (positive && value > 0 || !positive && value < 0) {
            return meta.inde***REMOVED***;
        }
    }
    return null;
}
function updateStacks(controller, parsed) {
    const { chart , _cachedMeta: meta  } = controller;
    const stacks = chart._stacks || (chart._stacks = {});
    const { iScale , vScale , inde***REMOVED***: datasetInde***REMOVED***  } = meta;
    const iA***REMOVED***is = iScale.a***REMOVED***is;
    const vA***REMOVED***is = vScale.a***REMOVED***is;
    const key = getStackKey(iScale, vScale, meta);
    const ilen = parsed.length;
    let stack;
    for(let i = 0; i < ilen; ++i){
        const item = parsed[i];
        const { [iA***REMOVED***is]: inde***REMOVED*** , [vA***REMOVED***is]: value  } = item;
        const itemStacks = item._stacks || (item._stacks = {});
        stack = itemStacks[vA***REMOVED***is] = getOrCreateStack(stacks, key, inde***REMOVED***);
        stack[datasetInde***REMOVED***] = value;
        stack._top = getLastInde***REMOVED***InStack(stack, vScale, true, meta.type);
        stack._bottom = getLastInde***REMOVED***InStack(stack, vScale, false, meta.type);
        const visualValues = stack._visualValues || (stack._visualValues = {});
        visualValues[datasetInde***REMOVED***] = value;
    }
}
function getFirstScaleId(chart, a***REMOVED***is) {
    const scales = chart.scales;
    return Object.keys(scales).filter((key)=>scales[key].a***REMOVED***is === a***REMOVED***is).shift();
}
function createDatasetConte***REMOVED***t(parent, inde***REMOVED***) {
    return helpers_segment.createConte***REMOVED***t(parent, {
        active: false,
        dataset: undefined,
        datasetInde***REMOVED***: inde***REMOVED***,
        inde***REMOVED***,
        mode: 'default',
        type: 'dataset'
    });
}
function createDataConte***REMOVED***t(parent, inde***REMOVED***, element) {
    return helpers_segment.createConte***REMOVED***t(parent, {
        active: false,
        dataInde***REMOVED***: inde***REMOVED***,
        parsed: undefined,
        raw: undefined,
        element,
        inde***REMOVED***,
        mode: 'default',
        type: 'data'
    });
}
function clearStacks(meta, items) {
    const datasetInde***REMOVED*** = meta.controller.inde***REMOVED***;
    const a***REMOVED***is = meta.vScale && meta.vScale.a***REMOVED***is;
    if (!a***REMOVED***is) {
        return;
    }
    items = items || meta._parsed;
    for (const parsed of items){
        const stacks = parsed._stacks;
        if (!stacks || stacks[a***REMOVED***is] === undefined || stacks[a***REMOVED***is][datasetInde***REMOVED***] === undefined) {
            return;
        }
        delete stacks[a***REMOVED***is][datasetInde***REMOVED***];
        if (stacks[a***REMOVED***is]._visualValues !== undefined && stacks[a***REMOVED***is]._visualValues[datasetInde***REMOVED***] !== undefined) {
            delete stacks[a***REMOVED***is]._visualValues[datasetInde***REMOVED***];
        }
    }
}
const isDirectUpdateMode = (mode)=>mode === 'reset' || mode === 'none';
const cloneIfNotShared = (cached, shared)=>shared ? cached : Object.assign({}, cached);
const createStack = (canStack, meta, chart)=>canStack && !meta.hidden && meta._stacked && {
        keys: getSortedDatasetIndices(chart, true),
        values: null
    };
class DatasetController {
 static defaults = {};
 static datasetElementType = null;
 static dataElementType = null;
 constructor(chart, datasetInde***REMOVED***){
        this.chart = chart;
        this._ct***REMOVED*** = chart.ct***REMOVED***;
        this.inde***REMOVED*** = datasetInde***REMOVED***;
        this._cachedDataOpts = {};
        this._cachedMeta = this.getMeta();
        this._type = this._cachedMeta.type;
        this.options = undefined;
         this._parsing = false;
        this._data = undefined;
        this._objectData = undefined;
        this._sharedOptions = undefined;
        this._drawStart = undefined;
        this._drawCount = undefined;
        this.enableOptionSharing = false;
        this.supportsDecimation = false;
        this.$conte***REMOVED***t = undefined;
        this._syncList = [];
        this.datasetElementType = new.target.datasetElementType;
        this.dataElementType = new.target.dataElementType;
        this.initialize();
    }
    initialize() {
        const meta = this._cachedMeta;
        this.configure();
        this.linkScales();
        meta._stacked = isStacked(meta.vScale, meta);
        this.addElements();
        if (this.options.fill && !this.chart.isPluginEnabled('filler')) {
            console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
        }
    }
    updateInde***REMOVED***(datasetInde***REMOVED***) {
        if (this.inde***REMOVED*** !== datasetInde***REMOVED***) {
            clearStacks(this._cachedMeta);
        }
        this.inde***REMOVED*** = datasetInde***REMOVED***;
    }
    linkScales() {
        const chart = this.chart;
        const meta = this._cachedMeta;
        const dataset = this.getDataset();
        const chooseId = (a***REMOVED***is, ***REMOVED***, y, r)=>a***REMOVED***is === '***REMOVED***' ? ***REMOVED*** : a***REMOVED***is === 'r' ? r : y;
        const ***REMOVED***id = meta.***REMOVED***A***REMOVED***isID = helpers_segment.valueOrDefault(dataset.***REMOVED***A***REMOVED***isID, getFirstScaleId(chart, '***REMOVED***'));
        const yid = meta.yA***REMOVED***isID = helpers_segment.valueOrDefault(dataset.yA***REMOVED***isID, getFirstScaleId(chart, 'y'));
        const rid = meta.rA***REMOVED***isID = helpers_segment.valueOrDefault(dataset.rA***REMOVED***isID, getFirstScaleId(chart, 'r'));
        const inde***REMOVED***A***REMOVED***is = meta.inde***REMOVED***A***REMOVED***is;
        const iid = meta.iA***REMOVED***isID = chooseId(inde***REMOVED***A***REMOVED***is, ***REMOVED***id, yid, rid);
        const vid = meta.vA***REMOVED***isID = chooseId(inde***REMOVED***A***REMOVED***is, yid, ***REMOVED***id, rid);
        meta.***REMOVED***Scale = this.getScaleForId(***REMOVED***id);
        meta.yScale = this.getScaleForId(yid);
        meta.rScale = this.getScaleForId(rid);
        meta.iScale = this.getScaleForId(iid);
        meta.vScale = this.getScaleForId(vid);
    }
    getDataset() {
        return this.chart.data.datasets[this.inde***REMOVED***];
    }
    getMeta() {
        return this.chart.getDatasetMeta(this.inde***REMOVED***);
    }
 getScaleForId(scaleID) {
        return this.chart.scales[scaleID];
    }
 _getOtherScale(scale) {
        const meta = this._cachedMeta;
        return scale === meta.iScale ? meta.vScale : meta.iScale;
    }
    reset() {
        this._update('reset');
    }
 _destroy() {
        const meta = this._cachedMeta;
        if (this._data) {
            helpers_segment.unlistenArrayEvents(this._data, this);
        }
        if (meta._stacked) {
            clearStacks(meta);
        }
    }
 _dataCheck() {
        const dataset = this.getDataset();
        const data = dataset.data || (dataset.data = []);
        const _data = this._data;
        if (helpers_segment.isObject(data)) {
            const meta = this._cachedMeta;
            this._data = convertObjectDataToArray(data, meta);
        } else if (_data !== data) {
            if (_data) {
                helpers_segment.unlistenArrayEvents(_data, this);
                const meta = this._cachedMeta;
                clearStacks(meta);
                meta._parsed = [];
            }
            if (data && Object.isE***REMOVED***tensible(data)) {
                helpers_segment.listenArrayEvents(data, this);
            }
            this._syncList = [];
            this._data = data;
        }
    }
    addElements() {
        const meta = this._cachedMeta;
        this._dataCheck();
        if (this.datasetElementType) {
            meta.dataset = new this.datasetElementType();
        }
    }
    buildOrUpdateElements(resetNewElements) {
        const meta = this._cachedMeta;
        const dataset = this.getDataset();
        let stackChanged = false;
        this._dataCheck();
        const oldStacked = meta._stacked;
        meta._stacked = isStacked(meta.vScale, meta);
        if (meta.stack !== dataset.stack) {
            stackChanged = true;
            clearStacks(meta);
            meta.stack = dataset.stack;
        }
        this._resyncElements(resetNewElements);
        if (stackChanged || oldStacked !== meta._stacked) {
            updateStacks(this, meta._parsed);
        }
    }
 configure() {
        const config = this.chart.config;
        const scopeKeys = config.datasetScopeKeys(this._type);
        const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
        this.options = config.createResolver(scopes, this.getConte***REMOVED***t());
        this._parsing = this.options.parsing;
        this._cachedDataOpts = {};
    }
 parse(start, count) {
        const { _cachedMeta: meta , _data: data  } = this;
        const { iScale , _stacked  } = meta;
        const iA***REMOVED***is = iScale.a***REMOVED***is;
        let sorted = start === 0 && count === data.length ? true : meta._sorted;
        let prev = start > 0 && meta._parsed[start - 1];
        let i, cur, parsed;
        if (this._parsing === false) {
            meta._parsed = data;
            meta._sorted = true;
            parsed = data;
        } else {
            if (helpers_segment.isArray(data[start])) {
                parsed = this.parseArrayData(meta, data, start, count);
            } else if (helpers_segment.isObject(data[start])) {
                parsed = this.parseObjectData(meta, data, start, count);
            } else {
                parsed = this.parsePrimitiveData(meta, data, start, count);
            }
            const isNotInOrderComparedToPrev = ()=>cur[iA***REMOVED***is] === null || prev && cur[iA***REMOVED***is] < prev[iA***REMOVED***is];
            for(i = 0; i < count; ++i){
                meta._parsed[i + start] = cur = parsed[i];
                if (sorted) {
                    if (isNotInOrderComparedToPrev()) {
                        sorted = false;
                    }
                    prev = cur;
                }
            }
            meta._sorted = sorted;
        }
        if (_stacked) {
            updateStacks(this, parsed);
        }
    }
 parsePrimitiveData(meta, data, start, count) {
        const { iScale , vScale  } = meta;
        const iA***REMOVED***is = iScale.a***REMOVED***is;
        const vA***REMOVED***is = vScale.a***REMOVED***is;
        const labels = iScale.getLabels();
        const singleScale = iScale === vScale;
        const parsed = new Array(count);
        let i, ilen, inde***REMOVED***;
        for(i = 0, ilen = count; i < ilen; ++i){
            inde***REMOVED*** = i + start;
            parsed[i] = {
                [iA***REMOVED***is]: singleScale || iScale.parse(labels[inde***REMOVED***], inde***REMOVED***),
                [vA***REMOVED***is]: vScale.parse(data[inde***REMOVED***], inde***REMOVED***)
            };
        }
        return parsed;
    }
 parseArrayData(meta, data, start, count) {
        const { ***REMOVED***Scale , yScale  } = meta;
        const parsed = new Array(count);
        let i, ilen, inde***REMOVED***, item;
        for(i = 0, ilen = count; i < ilen; ++i){
            inde***REMOVED*** = i + start;
            item = data[inde***REMOVED***];
            parsed[i] = {
                ***REMOVED***: ***REMOVED***Scale.parse(item[0], inde***REMOVED***),
                y: yScale.parse(item[1], inde***REMOVED***)
            };
        }
        return parsed;
    }
 parseObjectData(meta, data, start, count) {
        const { ***REMOVED***Scale , yScale  } = meta;
        const { ***REMOVED***A***REMOVED***isKey ='***REMOVED***' , yA***REMOVED***isKey ='y'  } = this._parsing;
        const parsed = new Array(count);
        let i, ilen, inde***REMOVED***, item;
        for(i = 0, ilen = count; i < ilen; ++i){
            inde***REMOVED*** = i + start;
            item = data[inde***REMOVED***];
            parsed[i] = {
                ***REMOVED***: ***REMOVED***Scale.parse(helpers_segment.resolveObjectKey(item, ***REMOVED***A***REMOVED***isKey), inde***REMOVED***),
                y: yScale.parse(helpers_segment.resolveObjectKey(item, yA***REMOVED***isKey), inde***REMOVED***)
            };
        }
        return parsed;
    }
 getParsed(inde***REMOVED***) {
        return this._cachedMeta._parsed[inde***REMOVED***];
    }
 getDataElement(inde***REMOVED***) {
        return this._cachedMeta.data[inde***REMOVED***];
    }
 applyStack(scale, parsed, mode) {
        const chart = this.chart;
        const meta = this._cachedMeta;
        const value = parsed[scale.a***REMOVED***is];
        const stack = {
            keys: getSortedDatasetIndices(chart, true),
            values: parsed._stacks[scale.a***REMOVED***is]._visualValues
        };
        return applyStack(stack, value, meta.inde***REMOVED***, {
            mode
        });
    }
 updateRangeFromParsed(range, scale, parsed, stack) {
        const parsedValue = parsed[scale.a***REMOVED***is];
        let value = parsedValue === null ? NaN : parsedValue;
        const values = stack && parsed._stacks[scale.a***REMOVED***is];
        if (stack && values) {
            stack.values = values;
            value = applyStack(stack, parsedValue, this._cachedMeta.inde***REMOVED***);
        }
        range.min = Math.min(range.min, value);
        range.ma***REMOVED*** = Math.ma***REMOVED***(range.ma***REMOVED***, value);
    }
 getMinMa***REMOVED***(scale, canStack) {
        const meta = this._cachedMeta;
        const _parsed = meta._parsed;
        const sorted = meta._sorted && scale === meta.iScale;
        const ilen = _parsed.length;
        const otherScale = this._getOtherScale(scale);
        const stack = createStack(canStack, meta, this.chart);
        const range = {
            min: Number.POSITIVE_INFINITY,
            ma***REMOVED***: Number.NEGATIVE_INFINITY
        };
        const { min: otherMin , ma***REMOVED***: otherMa***REMOVED***  } = getUserBounds(otherScale);
        let i, parsed;
        function _skip() {
            parsed = _parsed[i];
            const otherValue = parsed[otherScale.a***REMOVED***is];
            return !helpers_segment.isNumberFinite(parsed[scale.a***REMOVED***is]) || otherMin > otherValue || otherMa***REMOVED*** < otherValue;
        }
        for(i = 0; i < ilen; ++i){
            if (_skip()) {
                continue;
            }
            this.updateRangeFromParsed(range, scale, parsed, stack);
            if (sorted) {
                break;
            }
        }
        if (sorted) {
            for(i = ilen - 1; i >= 0; --i){
                if (_skip()) {
                    continue;
                }
                this.updateRangeFromParsed(range, scale, parsed, stack);
                break;
            }
        }
        return range;
    }
    getAllParsedValues(scale) {
        const parsed = this._cachedMeta._parsed;
        const values = [];
        let i, ilen, value;
        for(i = 0, ilen = parsed.length; i < ilen; ++i){
            value = parsed[i][scale.a***REMOVED***is];
            if (helpers_segment.isNumberFinite(value)) {
                values.push(value);
            }
        }
        return values;
    }
 getMa***REMOVED***Overflow() {
        return false;
    }
 getLabelAndValue(inde***REMOVED***) {
        const meta = this._cachedMeta;
        const iScale = meta.iScale;
        const vScale = meta.vScale;
        const parsed = this.getParsed(inde***REMOVED***);
        return {
            label: iScale ? '' + iScale.getLabelForValue(parsed[iScale.a***REMOVED***is]) : '',
            value: vScale ? '' + vScale.getLabelForValue(parsed[vScale.a***REMOVED***is]) : ''
        };
    }
 _update(mode) {
        const meta = this._cachedMeta;
        this.update(mode || 'default');
        meta._clip = toClip(helpers_segment.valueOrDefault(this.options.clip, defaultClip(meta.***REMOVED***Scale, meta.yScale, this.getMa***REMOVED***Overflow())));
    }
 update(mode) {}
    draw() {
        const ct***REMOVED*** = this._ct***REMOVED***;
        const chart = this.chart;
        const meta = this._cachedMeta;
        const elements = meta.data || [];
        const area = chart.chartArea;
        const active = [];
        const start = this._drawStart || 0;
        const count = this._drawCount || elements.length - start;
        const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
        let i;
        if (meta.dataset) {
            meta.dataset.draw(ct***REMOVED***, area, start, count);
        }
        for(i = start; i < start + count; ++i){
            const element = elements[i];
            if (element.hidden) {
                continue;
            }
            if (element.active && drawActiveElementsOnTop) {
                active.push(element);
            } else {
                element.draw(ct***REMOVED***, area);
            }
        }
        for(i = 0; i < active.length; ++i){
            active[i].draw(ct***REMOVED***, area);
        }
    }
 getStyle(inde***REMOVED***, active) {
        const mode = active ? 'active' : 'default';
        return inde***REMOVED*** === undefined && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(inde***REMOVED*** || 0, mode);
    }
 getConte***REMOVED***t(inde***REMOVED***, active, mode) {
        const dataset = this.getDataset();
        let conte***REMOVED***t;
        if (inde***REMOVED*** >= 0 && inde***REMOVED*** < this._cachedMeta.data.length) {
            const element = this._cachedMeta.data[inde***REMOVED***];
            conte***REMOVED***t = element.$conte***REMOVED***t || (element.$conte***REMOVED***t = createDataConte***REMOVED***t(this.getConte***REMOVED***t(), inde***REMOVED***, element));
            conte***REMOVED***t.parsed = this.getParsed(inde***REMOVED***);
            conte***REMOVED***t.raw = dataset.data[inde***REMOVED***];
            conte***REMOVED***t.inde***REMOVED*** = conte***REMOVED***t.dataInde***REMOVED*** = inde***REMOVED***;
        } else {
            conte***REMOVED***t = this.$conte***REMOVED***t || (this.$conte***REMOVED***t = createDatasetConte***REMOVED***t(this.chart.getConte***REMOVED***t(), this.inde***REMOVED***));
            conte***REMOVED***t.dataset = dataset;
            conte***REMOVED***t.inde***REMOVED*** = conte***REMOVED***t.datasetInde***REMOVED*** = this.inde***REMOVED***;
        }
        conte***REMOVED***t.active = !!active;
        conte***REMOVED***t.mode = mode;
        return conte***REMOVED***t;
    }
 resolveDatasetElementOptions(mode) {
        return this._resolveElementOptions(this.datasetElementType.id, mode);
    }
 resolveDataElementOptions(inde***REMOVED***, mode) {
        return this._resolveElementOptions(this.dataElementType.id, mode, inde***REMOVED***);
    }
 _resolveElementOptions(elementType, mode = 'default', inde***REMOVED***) {
        const active = mode === 'active';
        const cache = this._cachedDataOpts;
        const cacheKey = elementType + '-' + mode;
        const cached = cache[cacheKey];
        const sharing = this.enableOptionSharing && helpers_segment.defined(inde***REMOVED***);
        if (cached) {
            return cloneIfNotShared(cached, sharing);
        }
        const config = this.chart.config;
        const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
        const prefi***REMOVED***es = active ? [
            `${elementType}Hover`,
            'hover',
            elementType,
            ''
        ] : [
            elementType,
            ''
        ];
        const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
        const names = Object.keys(helpers_segment.defaults.elements[elementType]);
        const conte***REMOVED***t = ()=>this.getConte***REMOVED***t(inde***REMOVED***, active, mode);
        const values = config.resolveNamedOptions(scopes, names, conte***REMOVED***t, prefi***REMOVED***es);
        if (values.$shared) {
            values.$shared = sharing;
            cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
        }
        return values;
    }
 _resolveAnimations(inde***REMOVED***, transition, active) {
        const chart = this.chart;
        const cache = this._cachedDataOpts;
        const cacheKey = `animation-${transition}`;
        const cached = cache[cacheKey];
        if (cached) {
            return cached;
        }
        let options;
        if (chart.options.animation !== false) {
            const config = this.chart.config;
            const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
            const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
            options = config.createResolver(scopes, this.getConte***REMOVED***t(inde***REMOVED***, active, transition));
        }
        const animations = new Animations(chart, options && options.animations);
        if (options && options._cacheable) {
            cache[cacheKey] = Object.freeze(animations);
        }
        return animations;
    }
 getSharedOptions(options) {
        if (!options.$shared) {
            return;
        }
        return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
    }
 includeOptions(mode, sharedOptions) {
        return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
    }
 _getSharedOptions(start, mode) {
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const previouslySharedOptions = this._sharedOptions;
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
        return {
            sharedOptions,
            includeOptions
        };
    }
 updateElement(element, inde***REMOVED***, properties, mode) {
        if (isDirectUpdateMode(mode)) {
            Object.assign(element, properties);
        } else {
            this._resolveAnimations(inde***REMOVED***, mode).update(element, properties);
        }
    }
 updateSharedOptions(sharedOptions, mode, newOptions) {
        if (sharedOptions && !isDirectUpdateMode(mode)) {
            this._resolveAnimations(undefined, mode).update(sharedOptions, newOptions);
        }
    }
 _setStyle(element, inde***REMOVED***, mode, active) {
        element.active = active;
        const options = this.getStyle(inde***REMOVED***, active);
        this._resolveAnimations(inde***REMOVED***, mode, active).update(element, {
            options: !active && this.getSharedOptions(options) || options
        });
    }
    removeHoverStyle(element, datasetInde***REMOVED***, inde***REMOVED***) {
        this._setStyle(element, inde***REMOVED***, 'active', false);
    }
    setHoverStyle(element, datasetInde***REMOVED***, inde***REMOVED***) {
        this._setStyle(element, inde***REMOVED***, 'active', true);
    }
 _removeDatasetHoverStyle() {
        const element = this._cachedMeta.dataset;
        if (element) {
            this._setStyle(element, undefined, 'active', false);
        }
    }
 _setDatasetHoverStyle() {
        const element = this._cachedMeta.dataset;
        if (element) {
            this._setStyle(element, undefined, 'active', true);
        }
    }
 _resyncElements(resetNewElements) {
        const data = this._data;
        const elements = this._cachedMeta.data;
        for (const [method, arg1, arg2] of this._syncList){
            this[method](arg1, arg2);
        }
        this._syncList = [];
        const numMeta = elements.length;
        const numData = data.length;
        const count = Math.min(numData, numMeta);
        if (count) {
            this.parse(0, count);
        }
        if (numData > numMeta) {
            this._insertElements(numMeta, numData - numMeta, resetNewElements);
        } else if (numData < numMeta) {
            this._removeElements(numData, numMeta - numData);
        }
    }
 _insertElements(start, count, resetNewElements = true) {
        const meta = this._cachedMeta;
        const data = meta.data;
        const end = start + count;
        let i;
        const move = (arr)=>{
            arr.length += count;
            for(i = arr.length - 1; i >= end; i--){
                arr[i] = arr[i - count];
            }
        };
        move(data);
        for(i = start; i < end; ++i){
            data[i] = new this.dataElementType();
        }
        if (this._parsing) {
            move(meta._parsed);
        }
        this.parse(start, count);
        if (resetNewElements) {
            this.updateElements(data, start, count, 'reset');
        }
    }
    updateElements(element, start, count, mode) {}
 _removeElements(start, count) {
        const meta = this._cachedMeta;
        if (this._parsing) {
            const removed = meta._parsed.splice(start, count);
            if (meta._stacked) {
                clearStacks(meta, removed);
            }
        }
        meta.data.splice(start, count);
    }
 _sync(args) {
        if (this._parsing) {
            this._syncList.push(args);
        } else {
            const [method, arg1, arg2] = args;
            this[method](arg1, arg2);
        }
        this.chart._dataChanges.push([
            this.inde***REMOVED***,
            ...args
        ]);
    }
    _onDataPush() {
        const count = arguments.length;
        this._sync([
            '_insertElements',
            this.getDataset().data.length - count,
            count
        ]);
    }
    _onDataPop() {
        this._sync([
            '_removeElements',
            this._cachedMeta.data.length - 1,
            1
        ]);
    }
    _onDataShift() {
        this._sync([
            '_removeElements',
            0,
            1
        ]);
    }
    _onDataSplice(start, count) {
        if (count) {
            this._sync([
                '_removeElements',
                start,
                count
            ]);
        }
        const newCount = arguments.length - 2;
        if (newCount) {
            this._sync([
                '_insertElements',
                start,
                newCount
            ]);
        }
    }
    _onDataUnshift() {
        this._sync([
            '_insertElements',
            0,
            arguments.length
        ]);
    }
}

function getAllScaleValues(scale, type) {
    if (!scale._cache.$bar) {
        const visibleMetas = scale.getMatchingVisibleMetas(type);
        let values = [];
        for(let i = 0, ilen = visibleMetas.length; i < ilen; i++){
            values = values.concat(visibleMetas[i].controller.getAllParsedValues(scale));
        }
        scale._cache.$bar = helpers_segment._arrayUnique(values.sort((a, b)=>a - b));
    }
    return scale._cache.$bar;
}
 function computeMinSampleSize(meta) {
    const scale = meta.iScale;
    const values = getAllScaleValues(scale, meta.type);
    let min = scale._length;
    let i, ilen, curr, prev;
    const updateMinAndPrev = ()=>{
        if (curr === 32767 || curr === -32768) {
            return;
        }
        if (helpers_segment.defined(prev)) {
            min = Math.min(min, Math.abs(curr - prev) || min);
        }
        prev = curr;
    };
    for(i = 0, ilen = values.length; i < ilen; ++i){
        curr = scale.getPi***REMOVED***elForValue(values[i]);
        updateMinAndPrev();
    }
    prev = undefined;
    for(i = 0, ilen = scale.ticks.length; i < ilen; ++i){
        curr = scale.getPi***REMOVED***elForTick(i);
        updateMinAndPrev();
    }
    return min;
}
 function computeFitCategoryTraits(inde***REMOVED***, ruler, options, stackCount) {
    const thickness = options.barThickness;
    let size, ratio;
    if (helpers_segment.isNullOrUndef(thickness)) {
        size = ruler.min * options.categoryPercentage;
        ratio = options.barPercentage;
    } else {
        size = thickness * stackCount;
        ratio = 1;
    }
    return {
        chunk: size / stackCount,
        ratio,
        start: ruler.pi***REMOVED***els[inde***REMOVED***] - size / 2
    };
}
 function computeFle***REMOVED***CategoryTraits(inde***REMOVED***, ruler, options, stackCount) {
    const pi***REMOVED***els = ruler.pi***REMOVED***els;
    const curr = pi***REMOVED***els[inde***REMOVED***];
    let prev = inde***REMOVED*** > 0 ? pi***REMOVED***els[inde***REMOVED*** - 1] : null;
    let ne***REMOVED***t = inde***REMOVED*** < pi***REMOVED***els.length - 1 ? pi***REMOVED***els[inde***REMOVED*** + 1] : null;
    const percent = options.categoryPercentage;
    if (prev === null) {
        prev = curr - (ne***REMOVED***t === null ? ruler.end - ruler.start : ne***REMOVED***t - curr);
    }
    if (ne***REMOVED***t === null) {
        ne***REMOVED***t = curr + curr - prev;
    }
    const start = curr - (curr - Math.min(prev, ne***REMOVED***t)) / 2 * percent;
    const size = Math.abs(ne***REMOVED***t - prev) / 2 * percent;
    return {
        chunk: size / stackCount,
        ratio: options.barPercentage,
        start
    };
}
function parseFloatBar(entry, item, vScale, i) {
    const startValue = vScale.parse(entry[0], i);
    const endValue = vScale.parse(entry[1], i);
    const min = Math.min(startValue, endValue);
    const ma***REMOVED*** = Math.ma***REMOVED***(startValue, endValue);
    let barStart = min;
    let barEnd = ma***REMOVED***;
    if (Math.abs(min) > Math.abs(ma***REMOVED***)) {
        barStart = ma***REMOVED***;
        barEnd = min;
    }
    item[vScale.a***REMOVED***is] = barEnd;
    item._custom = {
        barStart,
        barEnd,
        start: startValue,
        end: endValue,
        min,
        ma***REMOVED***
    };
}
function parseValue(entry, item, vScale, i) {
    if (helpers_segment.isArray(entry)) {
        parseFloatBar(entry, item, vScale, i);
    } else {
        item[vScale.a***REMOVED***is] = vScale.parse(entry, i);
    }
    return item;
}
function parseArrayOrPrimitive(meta, data, start, count) {
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const parsed = [];
    let i, ilen, item, entry;
    for(i = start, ilen = start + count; i < ilen; ++i){
        entry = data[i];
        item = {};
        item[iScale.a***REMOVED***is] = singleScale || iScale.parse(labels[i], i);
        parsed.push(parseValue(entry, item, vScale, i));
    }
    return parsed;
}
function isFloatBar(custom) {
    return custom && custom.barStart !== undefined && custom.barEnd !== undefined;
}
function barSign(size, vScale, actualBase) {
    if (size !== 0) {
        return helpers_segment.sign(size);
    }
    return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
}
function borderProps(properties) {
    let reverse, start, end, top, bottom;
    if (properties.horizontal) {
        reverse = properties.base > properties.***REMOVED***;
        start = 'left';
        end = 'right';
    } else {
        reverse = properties.base < properties.y;
        start = 'bottom';
        end = 'top';
    }
    if (reverse) {
        top = 'end';
        bottom = 'start';
    } else {
        top = 'start';
        bottom = 'end';
    }
    return {
        start,
        end,
        reverse,
        top,
        bottom
    };
}
function setBorderSkipped(properties, options, stack, inde***REMOVED***) {
    let edge = options.borderSkipped;
    const res = {};
    if (!edge) {
        properties.borderSkipped = res;
        return;
    }
    if (edge === true) {
        properties.borderSkipped = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        return;
    }
    const { start , end , reverse , top , bottom  } = borderProps(properties);
    if (edge === 'middle' && stack) {
        properties.enableBorderRadius = true;
        if ((stack._top || 0) === inde***REMOVED***) {
            edge = top;
        } else if ((stack._bottom || 0) === inde***REMOVED***) {
            edge = bottom;
        } else {
            res[parseEdge(bottom, start, end, reverse)] = true;
            edge = top;
        }
    }
    res[parseEdge(edge, start, end, reverse)] = true;
    properties.borderSkipped = res;
}
function parseEdge(edge, a, b, reverse) {
    if (reverse) {
        edge = swap(edge, a, b);
        edge = startEnd(edge, b, a);
    } else {
        edge = startEnd(edge, a, b);
    }
    return edge;
}
function swap(orig, v1, v2) {
    return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}
function startEnd(v, start, end) {
    return v === 'start' ? start : v === 'end' ? end : v;
}
function setInflateAmount(properties, { inflateAmount  }, ratio) {
    properties.inflateAmount = inflateAmount === 'auto' ? ratio === 1 ? 0.33 : 0 : inflateAmount;
}
class BarController e***REMOVED***tends DatasetController {
    static id = 'bar';
 static defaults = {
        datasetElementType: false,
        dataElementType: 'bar',
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        grouped: true,
        animations: {
            numbers: {
                type: 'number',
                properties: [
                    '***REMOVED***',
                    'y',
                    'base',
                    'width',
                    'height'
                ]
            }
        }
    };
 static overrides = {
        scales: {
            _inde***REMOVED***_: {
                type: 'category',
                offset: true,
                grid: {
                    offset: true
                }
            },
            _value_: {
                type: 'linear',
                beginAtZero: true
            }
        }
    };
 parsePrimitiveData(meta, data, start, count) {
        return parseArrayOrPrimitive(meta, data, start, count);
    }
 parseArrayData(meta, data, start, count) {
        return parseArrayOrPrimitive(meta, data, start, count);
    }
 parseObjectData(meta, data, start, count) {
        const { iScale , vScale  } = meta;
        const { ***REMOVED***A***REMOVED***isKey ='***REMOVED***' , yA***REMOVED***isKey ='y'  } = this._parsing;
        const iA***REMOVED***isKey = iScale.a***REMOVED***is === '***REMOVED***' ? ***REMOVED***A***REMOVED***isKey : yA***REMOVED***isKey;
        const vA***REMOVED***isKey = vScale.a***REMOVED***is === '***REMOVED***' ? ***REMOVED***A***REMOVED***isKey : yA***REMOVED***isKey;
        const parsed = [];
        let i, ilen, item, obj;
        for(i = start, ilen = start + count; i < ilen; ++i){
            obj = data[i];
            item = {};
            item[iScale.a***REMOVED***is] = iScale.parse(helpers_segment.resolveObjectKey(obj, iA***REMOVED***isKey), i);
            parsed.push(parseValue(helpers_segment.resolveObjectKey(obj, vA***REMOVED***isKey), item, vScale, i));
        }
        return parsed;
    }
 updateRangeFromParsed(range, scale, parsed, stack) {
        super.updateRangeFromParsed(range, scale, parsed, stack);
        const custom = parsed._custom;
        if (custom && scale === this._cachedMeta.vScale) {
            range.min = Math.min(range.min, custom.min);
            range.ma***REMOVED*** = Math.ma***REMOVED***(range.ma***REMOVED***, custom.ma***REMOVED***);
        }
    }
 getMa***REMOVED***Overflow() {
        return 0;
    }
 getLabelAndValue(inde***REMOVED***) {
        const meta = this._cachedMeta;
        const { iScale , vScale  } = meta;
        const parsed = this.getParsed(inde***REMOVED***);
        const custom = parsed._custom;
        const value = isFloatBar(custom) ? '[' + custom.start + ', ' + custom.end + ']' : '' + vScale.getLabelForValue(parsed[vScale.a***REMOVED***is]);
        return {
            label: '' + iScale.getLabelForValue(parsed[iScale.a***REMOVED***is]),
            value
        };
    }
    initialize() {
        this.enableOptionSharing = true;
        super.initialize();
        const meta = this._cachedMeta;
        meta.stack = this.getDataset().stack;
    }
    update(mode) {
        const meta = this._cachedMeta;
        this.updateElements(meta.data, 0, meta.data.length, mode);
    }
    updateElements(bars, start, count, mode) {
        const reset = mode === 'reset';
        const { inde***REMOVED*** , _cachedMeta: { vScale  }  } = this;
        const base = vScale.getBasePi***REMOVED***el();
        const horizontal = vScale.isHorizontal();
        const ruler = this._getRuler();
        const { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
        for(let i = start; i < start + count; i++){
            const parsed = this.getParsed(i);
            const vpi***REMOVED***els = reset || helpers_segment.isNullOrUndef(parsed[vScale.a***REMOVED***is]) ? {
                base,
                head: base
            } : this._calculateBarValuePi***REMOVED***els(i);
            const ipi***REMOVED***els = this._calculateBarInde***REMOVED***Pi***REMOVED***els(i, ruler);
            const stack = (parsed._stacks || {})[vScale.a***REMOVED***is];
            const properties = {
                horizontal,
                base: vpi***REMOVED***els.base,
                enableBorderRadius: !stack || isFloatBar(parsed._custom) || inde***REMOVED*** === stack._top || inde***REMOVED*** === stack._bottom,
                ***REMOVED***: horizontal ? vpi***REMOVED***els.head : ipi***REMOVED***els.center,
                y: horizontal ? ipi***REMOVED***els.center : vpi***REMOVED***els.head,
                height: horizontal ? ipi***REMOVED***els.size : Math.abs(vpi***REMOVED***els.size),
                width: horizontal ? Math.abs(vpi***REMOVED***els.size) : ipi***REMOVED***els.size
            };
            if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? 'active' : mode);
            }
            const options = properties.options || bars[i].options;
            setBorderSkipped(properties, options, stack, inde***REMOVED***);
            setInflateAmount(properties, options, ruler.ratio);
            this.updateElement(bars[i], i, properties, mode);
        }
    }
 _getStacks(last, dataInde***REMOVED***) {
        const { iScale  } = this._cachedMeta;
        const metasets = iScale.getMatchingVisibleMetas(this._type).filter((meta)=>meta.controller.options.grouped);
        const stacked = iScale.options.stacked;
        const stacks = [];
        const skipNull = (meta)=>{
            const parsed = meta.controller.getParsed(dataInde***REMOVED***);
            const val = parsed && parsed[meta.vScale.a***REMOVED***is];
            if (helpers_segment.isNullOrUndef(val) || isNaN(val)) {
                return true;
            }
        };
        for (const meta of metasets){
            if (dataInde***REMOVED*** !== undefined && skipNull(meta)) {
                continue;
            }
            if (stacked === false || stacks.inde***REMOVED***Of(meta.stack) === -1 || stacked === undefined && meta.stack === undefined) {
                stacks.push(meta.stack);
            }
            if (meta.inde***REMOVED*** === last) {
                break;
            }
        }
        if (!stacks.length) {
            stacks.push(undefined);
        }
        return stacks;
    }
 _getStackCount(inde***REMOVED***) {
        return this._getStacks(undefined, inde***REMOVED***).length;
    }
 _getStackInde***REMOVED***(datasetInde***REMOVED***, name, dataInde***REMOVED***) {
        const stacks = this._getStacks(datasetInde***REMOVED***, dataInde***REMOVED***);
        const inde***REMOVED*** = name !== undefined ? stacks.inde***REMOVED***Of(name) : -1;
        return inde***REMOVED*** === -1 ? stacks.length - 1 : inde***REMOVED***;
    }
 _getRuler() {
        const opts = this.options;
        const meta = this._cachedMeta;
        const iScale = meta.iScale;
        const pi***REMOVED***els = [];
        let i, ilen;
        for(i = 0, ilen = meta.data.length; i < ilen; ++i){
            pi***REMOVED***els.push(iScale.getPi***REMOVED***elForValue(this.getParsed(i)[iScale.a***REMOVED***is], i));
        }
        const barThickness = opts.barThickness;
        const min = barThickness || computeMinSampleSize(meta);
        return {
            min,
            pi***REMOVED***els,
            start: iScale._startPi***REMOVED***el,
            end: iScale._endPi***REMOVED***el,
            stackCount: this._getStackCount(),
            scale: iScale,
            grouped: opts.grouped,
            ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
        };
    }
 _calculateBarValuePi***REMOVED***els(inde***REMOVED***) {
        const { _cachedMeta: { vScale , _stacked , inde***REMOVED***: datasetInde***REMOVED***  } , options: { base: baseValue , minBarLength  }  } = this;
        const actualBase = baseValue || 0;
        const parsed = this.getParsed(inde***REMOVED***);
        const custom = parsed._custom;
        const floating = isFloatBar(custom);
        let value = parsed[vScale.a***REMOVED***is];
        let start = 0;
        let length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
        let head, size;
        if (length !== value) {
            start = length - value;
            length = value;
        }
        if (floating) {
            value = custom.barStart;
            length = custom.barEnd - custom.barStart;
            if (value !== 0 && helpers_segment.sign(value) !== helpers_segment.sign(custom.barEnd)) {
                start = 0;
            }
            start += value;
        }
        const startValue = !helpers_segment.isNullOrUndef(baseValue) && !floating ? baseValue : start;
        let base = vScale.getPi***REMOVED***elForValue(startValue);
        if (this.chart.getDataVisibility(inde***REMOVED***)) {
            head = vScale.getPi***REMOVED***elForValue(start + length);
        } else {
            head = base;
        }
        size = head - base;
        if (Math.abs(size) < minBarLength) {
            size = barSign(size, vScale, actualBase) * minBarLength;
            if (value === actualBase) {
                base -= size / 2;
            }
            const startPi***REMOVED***el = vScale.getPi***REMOVED***elForDecimal(0);
            const endPi***REMOVED***el = vScale.getPi***REMOVED***elForDecimal(1);
            const min = Math.min(startPi***REMOVED***el, endPi***REMOVED***el);
            const ma***REMOVED*** = Math.ma***REMOVED***(startPi***REMOVED***el, endPi***REMOVED***el);
            base = Math.ma***REMOVED***(Math.min(base, ma***REMOVED***), min);
            head = base + size;
            if (_stacked && !floating) {
                parsed._stacks[vScale.a***REMOVED***is]._visualValues[datasetInde***REMOVED***] = vScale.getValueForPi***REMOVED***el(head) - vScale.getValueForPi***REMOVED***el(base);
            }
        }
        if (base === vScale.getPi***REMOVED***elForValue(actualBase)) {
            const halfGrid = helpers_segment.sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
            base += halfGrid;
            size -= halfGrid;
        }
        return {
            size,
            base,
            head,
            center: head + size / 2
        };
    }
 _calculateBarInde***REMOVED***Pi***REMOVED***els(inde***REMOVED***, ruler) {
        const scale = ruler.scale;
        const options = this.options;
        const skipNull = options.skipNull;
        const ma***REMOVED***BarThickness = helpers_segment.valueOrDefault(options.ma***REMOVED***BarThickness, Infinity);
        let center, size;
        if (ruler.grouped) {
            const stackCount = skipNull ? this._getStackCount(inde***REMOVED***) : ruler.stackCount;
            const range = options.barThickness === 'fle***REMOVED***' ? computeFle***REMOVED***CategoryTraits(inde***REMOVED***, ruler, options, stackCount) : computeFitCategoryTraits(inde***REMOVED***, ruler, options, stackCount);
            const stackInde***REMOVED*** = this._getStackInde***REMOVED***(this.inde***REMOVED***, this._cachedMeta.stack, skipNull ? inde***REMOVED*** : undefined);
            center = range.start + range.chunk * stackInde***REMOVED*** + range.chunk / 2;
            size = Math.min(ma***REMOVED***BarThickness, range.chunk * range.ratio);
        } else {
            center = scale.getPi***REMOVED***elForValue(this.getParsed(inde***REMOVED***)[scale.a***REMOVED***is], inde***REMOVED***);
            size = Math.min(ma***REMOVED***BarThickness, ruler.min * ruler.ratio);
        }
        return {
            base: center - size / 2,
            head: center + size / 2,
            center,
            size
        };
    }
    draw() {
        const meta = this._cachedMeta;
        const vScale = meta.vScale;
        const rects = meta.data;
        const ilen = rects.length;
        let i = 0;
        for(; i < ilen; ++i){
            if (this.getParsed(i)[vScale.a***REMOVED***is] !== null && !rects[i].hidden) {
                rects[i].draw(this._ct***REMOVED***);
            }
        }
    }
}

class BubbleController e***REMOVED***tends DatasetController {
    static id = 'bubble';
 static defaults = {
        datasetElementType: false,
        dataElementType: 'point',
        animations: {
            numbers: {
                type: 'number',
                properties: [
                    '***REMOVED***',
                    'y',
                    'borderWidth',
                    'radius'
                ]
            }
        }
    };
 static overrides = {
        scales: {
            ***REMOVED***: {
                type: 'linear'
            },
            y: {
                type: 'linear'
            }
        }
    };
    initialize() {
        this.enableOptionSharing = true;
        super.initialize();
    }
 parsePrimitiveData(meta, data, start, count) {
        const parsed = super.parsePrimitiveData(meta, data, start, count);
        for(let i = 0; i < parsed.length; i++){
            parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
        }
        return parsed;
    }
 parseArrayData(meta, data, start, count) {
        const parsed = super.parseArrayData(meta, data, start, count);
        for(let i = 0; i < parsed.length; i++){
            const item = data[start + i];
            parsed[i]._custom = helpers_segment.valueOrDefault(item[2], this.resolveDataElementOptions(i + start).radius);
        }
        return parsed;
    }
 parseObjectData(meta, data, start, count) {
        const parsed = super.parseObjectData(meta, data, start, count);
        for(let i = 0; i < parsed.length; i++){
            const item = data[start + i];
            parsed[i]._custom = helpers_segment.valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
        }
        return parsed;
    }
 getMa***REMOVED***Overflow() {
        const data = this._cachedMeta.data;
        let ma***REMOVED*** = 0;
        for(let i = data.length - 1; i >= 0; --i){
            ma***REMOVED*** = Math.ma***REMOVED***(ma***REMOVED***, data[i].size(this.resolveDataElementOptions(i)) / 2);
        }
        return ma***REMOVED*** > 0 && ma***REMOVED***;
    }
 getLabelAndValue(inde***REMOVED***) {
        const meta = this._cachedMeta;
        const labels = this.chart.data.labels || [];
        const { ***REMOVED***Scale , yScale  } = meta;
        const parsed = this.getParsed(inde***REMOVED***);
        const ***REMOVED*** = ***REMOVED***Scale.getLabelForValue(parsed.***REMOVED***);
        const y = yScale.getLabelForValue(parsed.y);
        const r = parsed._custom;
        return {
            label: labels[inde***REMOVED***] || '',
            value: '(' + ***REMOVED*** + ', ' + y + (r ? ', ' + r : '') + ')'
        };
    }
    update(mode) {
        const points = this._cachedMeta.data;
        this.updateElements(points, 0, points.length, mode);
    }
    updateElements(points, start, count, mode) {
        const reset = mode === 'reset';
        const { iScale , vScale  } = this._cachedMeta;
        const { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
        const iA***REMOVED***is = iScale.a***REMOVED***is;
        const vA***REMOVED***is = vScale.a***REMOVED***is;
        for(let i = start; i < start + count; i++){
            const point = points[i];
            const parsed = !reset && this.getParsed(i);
            const properties = {};
            const iPi***REMOVED***el = properties[iA***REMOVED***is] = reset ? iScale.getPi***REMOVED***elForDecimal(0.5) : iScale.getPi***REMOVED***elForValue(parsed[iA***REMOVED***is]);
            const vPi***REMOVED***el = properties[vA***REMOVED***is] = reset ? vScale.getBasePi***REMOVED***el() : vScale.getPi***REMOVED***elForValue(parsed[vA***REMOVED***is]);
            properties.skip = isNaN(iPi***REMOVED***el) || isNaN(vPi***REMOVED***el);
            if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
                if (reset) {
                    properties.options.radius = 0;
                }
            }
            this.updateElement(point, i, properties, mode);
        }
    }
 resolveDataElementOptions(inde***REMOVED***, mode) {
        const parsed = this.getParsed(inde***REMOVED***);
        let values = super.resolveDataElementOptions(inde***REMOVED***, mode);
        if (values.$shared) {
            values = Object.assign({}, values, {
                $shared: false
            });
        }
        const radius = values.radius;
        if (mode !== 'active') {
            values.radius = 0;
        }
        values.radius += helpers_segment.valueOrDefault(parsed && parsed._custom, radius);
        return values;
    }
}

function getRatioAndOffset(rotation, circumference, cutout) {
    let ratioX = 1;
    let ratioY = 1;
    let offsetX = 0;
    let offsetY = 0;
    if (circumference < helpers_segment.TAU) {
        const startAngle = rotation;
        const endAngle = startAngle + circumference;
        const startX = Math.cos(startAngle);
        const startY = Math.sin(startAngle);
        const endX = Math.cos(endAngle);
        const endY = Math.sin(endAngle);
        const calcMa***REMOVED*** = (angle, a, b)=>helpers_segment._angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.ma***REMOVED***(a, a * cutout, b, b * cutout);
        const calcMin = (angle, a, b)=>helpers_segment._angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
        const ma***REMOVED***X = calcMa***REMOVED***(0, startX, endX);
        const ma***REMOVED***Y = calcMa***REMOVED***(helpers_segment.HALF_PI, startY, endY);
        const minX = calcMin(helpers_segment.PI, startX, endX);
        const minY = calcMin(helpers_segment.PI + helpers_segment.HALF_PI, startY, endY);
        ratioX = (ma***REMOVED***X - minX) / 2;
        ratioY = (ma***REMOVED***Y - minY) / 2;
        offsetX = -(ma***REMOVED***X + minX) / 2;
        offsetY = -(ma***REMOVED***Y + minY) / 2;
    }
    return {
        ratioX,
        ratioY,
        offsetX,
        offsetY
    };
}
class DoughnutController e***REMOVED***tends DatasetController {
    static id = 'doughnut';
 static defaults = {
        datasetElementType: false,
        dataElementType: 'arc',
        animation: {
            animateRotate: true,
            animateScale: false
        },
        animations: {
            numbers: {
                type: 'number',
                properties: [
                    'circumference',
                    'endAngle',
                    'innerRadius',
                    'outerRadius',
                    'startAngle',
                    '***REMOVED***',
                    'y',
                    'offset',
                    'borderWidth',
                    'spacing'
                ]
            }
        },
        cutout: '50%',
        rotation: 0,
        circumference: 360,
        radius: '100%',
        spacing: 0,
        inde***REMOVED***A***REMOVED***is: 'r'
    };
    static descriptors = {
        _scriptable: (name)=>name !== 'spacing',
        _inde***REMOVED***able: (name)=>name !== 'spacing' && !name.startsWith('borderDash') && !name.startsWith('hoverBorderDash')
    };
 static overrides = {
        aspectRatio: 1,
        plugins: {
            legend: {
                labels: {
                    generateLabels (chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            const { labels: { pointStyle , color  }  } = chart.legend.options;
                            return data.labels.map((label, i)=>{
                                const meta = chart.getDatasetMeta(0);
                                const style = meta.controller.getStyle(i);
                                return {
                                    te***REMOVED***t: label,
                                    fillStyle: style.backgroundColor,
                                    strokeStyle: style.borderColor,
                                    fontColor: color,
                                    lineWidth: style.borderWidth,
                                    pointStyle: pointStyle,
                                    hidden: !chart.getDataVisibility(i),
                                    inde***REMOVED***: i
                                };
                            });
                        }
                        return [];
                    }
                },
                onClick (e, legendItem, legend) {
                    legend.chart.toggleDataVisibility(legendItem.inde***REMOVED***);
                    legend.chart.update();
                }
            }
        }
    };
    constructor(chart, datasetInde***REMOVED***){
        super(chart, datasetInde***REMOVED***);
        this.enableOptionSharing = true;
        this.innerRadius = undefined;
        this.outerRadius = undefined;
        this.offsetX = undefined;
        this.offsetY = undefined;
    }
    linkScales() {}
 parse(start, count) {
        const data = this.getDataset().data;
        const meta = this._cachedMeta;
        if (this._parsing === false) {
            meta._parsed = data;
        } else {
            let getter = (i)=>+data[i];
            if (helpers_segment.isObject(data[start])) {
                const { key ='value'  } = this._parsing;
                getter = (i)=>+helpers_segment.resolveObjectKey(data[i], key);
            }
            let i, ilen;
            for(i = start, ilen = start + count; i < ilen; ++i){
                meta._parsed[i] = getter(i);
            }
        }
    }
 _getRotation() {
        return helpers_segment.toRadians(this.options.rotation - 90);
    }
 _getCircumference() {
        return helpers_segment.toRadians(this.options.circumference);
    }
 _getRotationE***REMOVED***tents() {
        let min = helpers_segment.TAU;
        let ma***REMOVED*** = -helpers_segment.TAU;
        for(let i = 0; i < this.chart.data.datasets.length; ++i){
            if (this.chart.isDatasetVisible(i) && this.chart.getDatasetMeta(i).type === this._type) {
                const controller = this.chart.getDatasetMeta(i).controller;
                const rotation = controller._getRotation();
                const circumference = controller._getCircumference();
                min = Math.min(min, rotation);
                ma***REMOVED*** = Math.ma***REMOVED***(ma***REMOVED***, rotation + circumference);
            }
        }
        return {
            rotation: min,
            circumference: ma***REMOVED*** - min
        };
    }
 update(mode) {
        const chart = this.chart;
        const { chartArea  } = chart;
        const meta = this._cachedMeta;
        const arcs = meta.data;
        const spacing = this.getMa***REMOVED***BorderWidth() + this.getMa***REMOVED***Offset(arcs) + this.options.spacing;
        const ma***REMOVED***Size = Math.ma***REMOVED***((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
        const cutout = Math.min(helpers_segment.toPercentage(this.options.cutout, ma***REMOVED***Size), 1);
        const chartWeight = this._getRingWeight(this.inde***REMOVED***);
        const { circumference , rotation  } = this._getRotationE***REMOVED***tents();
        const { ratioX , ratioY , offsetX , offsetY  } = getRatioAndOffset(rotation, circumference, cutout);
        const ma***REMOVED***Width = (chartArea.width - spacing) / ratioX;
        const ma***REMOVED***Height = (chartArea.height - spacing) / ratioY;
        const ma***REMOVED***Radius = Math.ma***REMOVED***(Math.min(ma***REMOVED***Width, ma***REMOVED***Height) / 2, 0);
        const outerRadius = helpers_segment.toDimension(this.options.radius, ma***REMOVED***Radius);
        const innerRadius = Math.ma***REMOVED***(outerRadius * cutout, 0);
        const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
        this.offsetX = offsetX * outerRadius;
        this.offsetY = offsetY * outerRadius;
        meta.total = this.calculateTotal();
        this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.inde***REMOVED***);
        this.innerRadius = Math.ma***REMOVED***(this.outerRadius - radiusLength * chartWeight, 0);
        this.updateElements(arcs, 0, arcs.length, mode);
    }
 _circumference(i, reset) {
        const opts = this.options;
        const meta = this._cachedMeta;
        const circumference = this._getCircumference();
        if (reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
            return 0;
        }
        return this.calculateCircumference(meta._parsed[i] * circumference / helpers_segment.TAU);
    }
    updateElements(arcs, start, count, mode) {
        const reset = mode === 'reset';
        const chart = this.chart;
        const chartArea = chart.chartArea;
        const opts = chart.options;
        const animationOpts = opts.animation;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        const animateScale = reset && animationOpts.animateScale;
        const innerRadius = animateScale ? 0 : this.innerRadius;
        const outerRadius = animateScale ? 0 : this.outerRadius;
        const { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
        let startAngle = this._getRotation();
        let i;
        for(i = 0; i < start; ++i){
            startAngle += this._circumference(i, reset);
        }
        for(i = start; i < start + count; ++i){
            const circumference = this._circumference(i, reset);
            const arc = arcs[i];
            const properties = {
                ***REMOVED***: centerX + this.offsetX,
                y: centerY + this.offsetY,
                startAngle,
                endAngle: startAngle + circumference,
                circumference,
                outerRadius,
                innerRadius
            };
            if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? 'active' : mode);
            }
            startAngle += circumference;
            this.updateElement(arc, i, properties, mode);
        }
    }
    calculateTotal() {
        const meta = this._cachedMeta;
        const metaData = meta.data;
        let total = 0;
        let i;
        for(i = 0; i < metaData.length; i++){
            const value = meta._parsed[i];
            if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
                total += Math.abs(value);
            }
        }
        return total;
    }
    calculateCircumference(value) {
        const total = this._cachedMeta.total;
        if (total > 0 && !isNaN(value)) {
            return helpers_segment.TAU * (Math.abs(value) / total);
        }
        return 0;
    }
    getLabelAndValue(inde***REMOVED***) {
        const meta = this._cachedMeta;
        const chart = this.chart;
        const labels = chart.data.labels || [];
        const value = helpers_segment.formatNumber(meta._parsed[inde***REMOVED***], chart.options.locale);
        return {
            label: labels[inde***REMOVED***] || '',
            value
        };
    }
    getMa***REMOVED***BorderWidth(arcs) {
        let ma***REMOVED*** = 0;
        const chart = this.chart;
        let i, ilen, meta, controller, options;
        if (!arcs) {
            for(i = 0, ilen = chart.data.datasets.length; i < ilen; ++i){
                if (chart.isDatasetVisible(i)) {
                    meta = chart.getDatasetMeta(i);
                    arcs = meta.data;
                    controller = meta.controller;
                    break;
                }
            }
        }
        if (!arcs) {
            return 0;
        }
        for(i = 0, ilen = arcs.length; i < ilen; ++i){
            options = controller.resolveDataElementOptions(i);
            if (options.borderAlign !== 'inner') {
                ma***REMOVED*** = Math.ma***REMOVED***(ma***REMOVED***, options.borderWidth || 0, options.hoverBorderWidth || 0);
            }
        }
        return ma***REMOVED***;
    }
    getMa***REMOVED***Offset(arcs) {
        let ma***REMOVED*** = 0;
        for(let i = 0, ilen = arcs.length; i < ilen; ++i){
            const options = this.resolveDataElementOptions(i);
            ma***REMOVED*** = Math.ma***REMOVED***(ma***REMOVED***, options.offset || 0, options.hoverOffset || 0);
        }
        return ma***REMOVED***;
    }
 _getRingWeightOffset(datasetInde***REMOVED***) {
        let ringWeightOffset = 0;
        for(let i = 0; i < datasetInde***REMOVED***; ++i){
            if (this.chart.isDatasetVisible(i)) {
                ringWeightOffset += this._getRingWeight(i);
            }
        }
        return ringWeightOffset;
    }
 _getRingWeight(datasetInde***REMOVED***) {
        return Math.ma***REMOVED***(helpers_segment.valueOrDefault(this.chart.data.datasets[datasetInde***REMOVED***].weight, 1), 0);
    }
 _getVisibleDatasetWeightTotal() {
        return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
    }
}

class LineController e***REMOVED***tends DatasetController {
    static id = 'line';
 static defaults = {
        datasetElementType: 'line',
        dataElementType: 'point',
        showLine: true,
        spanGaps: false
    };
 static overrides = {
        scales: {
            _inde***REMOVED***_: {
                type: 'category'
            },
            _value_: {
                type: 'linear'
            }
        }
    };
    initialize() {
        this.enableOptionSharing = true;
        this.supportsDecimation = true;
        super.initialize();
    }
    update(mode) {
        const meta = this._cachedMeta;
        const { dataset: line , data: points = [] , _dataset  } = meta;
        const animationsDisabled = this.chart._animationsDisabled;
        let { start , count  } = helpers_segment._getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
        this._drawStart = start;
        this._drawCount = count;
        if (helpers_segment._scaleRangesChanged(meta)) {
            start = 0;
            count = points.length;
        }
        line._chart = this.chart;
        line._datasetInde***REMOVED*** = this.inde***REMOVED***;
        line._decimated = !!_dataset._decimated;
        line.points = points;
        const options = this.resolveDatasetElementOptions(mode);
        if (!this.options.showLine) {
            options.borderWidth = 0;
        }
        options.segment = this.options.segment;
        this.updateElement(line, undefined, {
            animated: !animationsDisabled,
            options
        }, mode);
        this.updateElements(points, start, count, mode);
    }
    updateElements(points, start, count, mode) {
        const reset = mode === 'reset';
        const { iScale , vScale , _stacked , _dataset  } = this._cachedMeta;
        const { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
        const iA***REMOVED***is = iScale.a***REMOVED***is;
        const vA***REMOVED***is = vScale.a***REMOVED***is;
        const { spanGaps , segment  } = this.options;
        const ma***REMOVED***GapLength = helpers_segment.isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
        const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
        const end = start + count;
        const pointsCount = points.length;
        let prevParsed = start > 0 && this.getParsed(start - 1);
        for(let i = 0; i < pointsCount; ++i){
            const point = points[i];
            const properties = directUpdate ? point : {};
            if (i < start || i >= end) {
                properties.skip = true;
                continue;
            }
            const parsed = this.getParsed(i);
            const nullData = helpers_segment.isNullOrUndef(parsed[vA***REMOVED***is]);
            const iPi***REMOVED***el = properties[iA***REMOVED***is] = iScale.getPi***REMOVED***elForValue(parsed[iA***REMOVED***is], i);
            const vPi***REMOVED***el = properties[vA***REMOVED***is] = reset || nullData ? vScale.getBasePi***REMOVED***el() : vScale.getPi***REMOVED***elForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vA***REMOVED***is], i);
            properties.skip = isNaN(iPi***REMOVED***el) || isNaN(vPi***REMOVED***el) || nullData;
            properties.stop = i > 0 && Math.abs(parsed[iA***REMOVED***is] - prevParsed[iA***REMOVED***is]) > ma***REMOVED***GapLength;
            if (segment) {
                properties.parsed = parsed;
                properties.raw = _dataset.data[i];
            }
            if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
            }
            if (!directUpdate) {
                this.updateElement(point, i, properties, mode);
            }
            prevParsed = parsed;
        }
    }
 getMa***REMOVED***Overflow() {
        const meta = this._cachedMeta;
        const dataset = meta.dataset;
        const border = dataset.options && dataset.options.borderWidth || 0;
        const data = meta.data || [];
        if (!data.length) {
            return border;
        }
        const firstPoint = data[0].size(this.resolveDataElementOptions(0));
        const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
        return Math.ma***REMOVED***(border, firstPoint, lastPoint) / 2;
    }
    draw() {
        const meta = this._cachedMeta;
        meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.a***REMOVED***is);
        super.draw();
    }
}

class PolarAreaController e***REMOVED***tends DatasetController {
    static id = 'polarArea';
 static defaults = {
        dataElementType: 'arc',
        animation: {
            animateRotate: true,
            animateScale: true
        },
        animations: {
            numbers: {
                type: 'number',
                properties: [
                    '***REMOVED***',
                    'y',
                    'startAngle',
                    'endAngle',
                    'innerRadius',
                    'outerRadius'
                ]
            }
        },
        inde***REMOVED***A***REMOVED***is: 'r',
        startAngle: 0
    };
 static overrides = {
        aspectRatio: 1,
        plugins: {
            legend: {
                labels: {
                    generateLabels (chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            const { labels: { pointStyle , color  }  } = chart.legend.options;
                            return data.labels.map((label, i)=>{
                                const meta = chart.getDatasetMeta(0);
                                const style = meta.controller.getStyle(i);
                                return {
                                    te***REMOVED***t: label,
                                    fillStyle: style.backgroundColor,
                                    strokeStyle: style.borderColor,
                                    fontColor: color,
                                    lineWidth: style.borderWidth,
                                    pointStyle: pointStyle,
                                    hidden: !chart.getDataVisibility(i),
                                    inde***REMOVED***: i
                                };
                            });
                        }
                        return [];
                    }
                },
                onClick (e, legendItem, legend) {
                    legend.chart.toggleDataVisibility(legendItem.inde***REMOVED***);
                    legend.chart.update();
                }
            }
        },
        scales: {
            r: {
                type: 'radialLinear',
                angleLines: {
                    display: false
                },
                beginAtZero: true,
                grid: {
                    circular: true
                },
                pointLabels: {
                    display: false
                },
                startAngle: 0
            }
        }
    };
    constructor(chart, datasetInde***REMOVED***){
        super(chart, datasetInde***REMOVED***);
        this.innerRadius = undefined;
        this.outerRadius = undefined;
    }
    getLabelAndValue(inde***REMOVED***) {
        const meta = this._cachedMeta;
        const chart = this.chart;
        const labels = chart.data.labels || [];
        const value = helpers_segment.formatNumber(meta._parsed[inde***REMOVED***].r, chart.options.locale);
        return {
            label: labels[inde***REMOVED***] || '',
            value
        };
    }
    parseObjectData(meta, data, start, count) {
        return helpers_segment._parseObjectDataRadialScale.bind(this)(meta, data, start, count);
    }
    update(mode) {
        const arcs = this._cachedMeta.data;
        this._updateRadius();
        this.updateElements(arcs, 0, arcs.length, mode);
    }
 getMinMa***REMOVED***() {
        const meta = this._cachedMeta;
        const range = {
            min: Number.POSITIVE_INFINITY,
            ma***REMOVED***: Number.NEGATIVE_INFINITY
        };
        meta.data.forEach((element, inde***REMOVED***)=>{
            const parsed = this.getParsed(inde***REMOVED***).r;
            if (!isNaN(parsed) && this.chart.getDataVisibility(inde***REMOVED***)) {
                if (parsed < range.min) {
                    range.min = parsed;
                }
                if (parsed > range.ma***REMOVED***) {
                    range.ma***REMOVED*** = parsed;
                }
            }
        });
        return range;
    }
 _updateRadius() {
        const chart = this.chart;
        const chartArea = chart.chartArea;
        const opts = chart.options;
        const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        const outerRadius = Math.ma***REMOVED***(minSize / 2, 0);
        const innerRadius = Math.ma***REMOVED***(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
        const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
        this.outerRadius = outerRadius - radiusLength * this.inde***REMOVED***;
        this.innerRadius = this.outerRadius - radiusLength;
    }
    updateElements(arcs, start, count, mode) {
        const reset = mode === 'reset';
        const chart = this.chart;
        const opts = chart.options;
        const animationOpts = opts.animation;
        const scale = this._cachedMeta.rScale;
        const centerX = scale.***REMOVED***Center;
        const centerY = scale.yCenter;
        const datasetStartAngle = scale.getInde***REMOVED***Angle(0) - 0.5 * helpers_segment.PI;
        let angle = datasetStartAngle;
        let i;
        const defaultAngle = 360 / this.countVisibleElements();
        for(i = 0; i < start; ++i){
            angle += this._computeAngle(i, mode, defaultAngle);
        }
        for(i = start; i < start + count; i++){
            const arc = arcs[i];
            let startAngle = angle;
            let endAngle = angle + this._computeAngle(i, mode, defaultAngle);
            let outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(this.getParsed(i).r) : 0;
            angle = endAngle;
            if (reset) {
                if (animationOpts.animateScale) {
                    outerRadius = 0;
                }
                if (animationOpts.animateRotate) {
                    startAngle = endAngle = datasetStartAngle;
                }
            }
            const properties = {
                ***REMOVED***: centerX,
                y: centerY,
                innerRadius: 0,
                outerRadius,
                startAngle,
                endAngle,
                options: this.resolveDataElementOptions(i, arc.active ? 'active' : mode)
            };
            this.updateElement(arc, i, properties, mode);
        }
    }
    countVisibleElements() {
        const meta = this._cachedMeta;
        let count = 0;
        meta.data.forEach((element, inde***REMOVED***)=>{
            if (!isNaN(this.getParsed(inde***REMOVED***).r) && this.chart.getDataVisibility(inde***REMOVED***)) {
                count++;
            }
        });
        return count;
    }
 _computeAngle(inde***REMOVED***, mode, defaultAngle) {
        return this.chart.getDataVisibility(inde***REMOVED***) ? helpers_segment.toRadians(this.resolveDataElementOptions(inde***REMOVED***, mode).angle || defaultAngle) : 0;
    }
}

class PieController e***REMOVED***tends DoughnutController {
    static id = 'pie';
 static defaults = {
        cutout: 0,
        rotation: 0,
        circumference: 360,
        radius: '100%'
    };
}

class RadarController e***REMOVED***tends DatasetController {
    static id = 'radar';
 static defaults = {
        datasetElementType: 'line',
        dataElementType: 'point',
        inde***REMOVED***A***REMOVED***is: 'r',
        showLine: true,
        elements: {
            line: {
                fill: 'start'
            }
        }
    };
 static overrides = {
        aspectRatio: 1,
        scales: {
            r: {
                type: 'radialLinear'
            }
        }
    };
 getLabelAndValue(inde***REMOVED***) {
        const vScale = this._cachedMeta.vScale;
        const parsed = this.getParsed(inde***REMOVED***);
        return {
            label: vScale.getLabels()[inde***REMOVED***],
            value: '' + vScale.getLabelForValue(parsed[vScale.a***REMOVED***is])
        };
    }
    parseObjectData(meta, data, start, count) {
        return helpers_segment._parseObjectDataRadialScale.bind(this)(meta, data, start, count);
    }
    update(mode) {
        const meta = this._cachedMeta;
        const line = meta.dataset;
        const points = meta.data || [];
        const labels = meta.iScale.getLabels();
        line.points = points;
        if (mode !== 'resize') {
            const options = this.resolveDatasetElementOptions(mode);
            if (!this.options.showLine) {
                options.borderWidth = 0;
            }
            const properties = {
                _loop: true,
                _fullLoop: labels.length === points.length,
                options
            };
            this.updateElement(line, undefined, properties, mode);
        }
        this.updateElements(points, 0, points.length, mode);
    }
    updateElements(points, start, count, mode) {
        const scale = this._cachedMeta.rScale;
        const reset = mode === 'reset';
        for(let i = start; i < start + count; i++){
            const point = points[i];
            const options = this.resolveDataElementOptions(i, point.active ? 'active' : mode);
            const pointPosition = scale.getPointPositionForValue(i, this.getParsed(i).r);
            const ***REMOVED*** = reset ? scale.***REMOVED***Center : pointPosition.***REMOVED***;
            const y = reset ? scale.yCenter : pointPosition.y;
            const properties = {
                ***REMOVED***,
                y,
                angle: pointPosition.angle,
                skip: isNaN(***REMOVED***) || isNaN(y),
                options
            };
            this.updateElement(point, i, properties, mode);
        }
    }
}

class ScatterController e***REMOVED***tends DatasetController {
    static id = 'scatter';
 static defaults = {
        datasetElementType: false,
        dataElementType: 'point',
        showLine: false,
        fill: false
    };
 static overrides = {
        interaction: {
            mode: 'point'
        },
        scales: {
            ***REMOVED***: {
                type: 'linear'
            },
            y: {
                type: 'linear'
            }
        }
    };
 getLabelAndValue(inde***REMOVED***) {
        const meta = this._cachedMeta;
        const labels = this.chart.data.labels || [];
        const { ***REMOVED***Scale , yScale  } = meta;
        const parsed = this.getParsed(inde***REMOVED***);
        const ***REMOVED*** = ***REMOVED***Scale.getLabelForValue(parsed.***REMOVED***);
        const y = yScale.getLabelForValue(parsed.y);
        return {
            label: labels[inde***REMOVED***] || '',
            value: '(' + ***REMOVED*** + ', ' + y + ')'
        };
    }
    update(mode) {
        const meta = this._cachedMeta;
        const { data: points = []  } = meta;
        const animationsDisabled = this.chart._animationsDisabled;
        let { start , count  } = helpers_segment._getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
        this._drawStart = start;
        this._drawCount = count;
        if (helpers_segment._scaleRangesChanged(meta)) {
            start = 0;
            count = points.length;
        }
        if (this.options.showLine) {
            if (!this.datasetElementType) {
                this.addElements();
            }
            const { dataset: line , _dataset  } = meta;
            line._chart = this.chart;
            line._datasetInde***REMOVED*** = this.inde***REMOVED***;
            line._decimated = !!_dataset._decimated;
            line.points = points;
            const options = this.resolveDatasetElementOptions(mode);
            options.segment = this.options.segment;
            this.updateElement(line, undefined, {
                animated: !animationsDisabled,
                options
            }, mode);
        } else if (this.datasetElementType) {
            delete meta.dataset;
            this.datasetElementType = false;
        }
        this.updateElements(points, start, count, mode);
    }
    addElements() {
        const { showLine  } = this.options;
        if (!this.datasetElementType && showLine) {
            this.datasetElementType = this.chart.registry.getElement('line');
        }
        super.addElements();
    }
    updateElements(points, start, count, mode) {
        const reset = mode === 'reset';
        const { iScale , vScale , _stacked , _dataset  } = this._cachedMeta;
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions);
        const iA***REMOVED***is = iScale.a***REMOVED***is;
        const vA***REMOVED***is = vScale.a***REMOVED***is;
        const { spanGaps , segment  } = this.options;
        const ma***REMOVED***GapLength = helpers_segment.isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
        const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
        let prevParsed = start > 0 && this.getParsed(start - 1);
        for(let i = start; i < start + count; ++i){
            const point = points[i];
            const parsed = this.getParsed(i);
            const properties = directUpdate ? point : {};
            const nullData = helpers_segment.isNullOrUndef(parsed[vA***REMOVED***is]);
            const iPi***REMOVED***el = properties[iA***REMOVED***is] = iScale.getPi***REMOVED***elForValue(parsed[iA***REMOVED***is], i);
            const vPi***REMOVED***el = properties[vA***REMOVED***is] = reset || nullData ? vScale.getBasePi***REMOVED***el() : vScale.getPi***REMOVED***elForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vA***REMOVED***is], i);
            properties.skip = isNaN(iPi***REMOVED***el) || isNaN(vPi***REMOVED***el) || nullData;
            properties.stop = i > 0 && Math.abs(parsed[iA***REMOVED***is] - prevParsed[iA***REMOVED***is]) > ma***REMOVED***GapLength;
            if (segment) {
                properties.parsed = parsed;
                properties.raw = _dataset.data[i];
            }
            if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
            }
            if (!directUpdate) {
                this.updateElement(point, i, properties, mode);
            }
            prevParsed = parsed;
        }
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
    }
 getMa***REMOVED***Overflow() {
        const meta = this._cachedMeta;
        const data = meta.data || [];
        if (!this.options.showLine) {
            let ma***REMOVED*** = 0;
            for(let i = data.length - 1; i >= 0; --i){
                ma***REMOVED*** = Math.ma***REMOVED***(ma***REMOVED***, data[i].size(this.resolveDataElementOptions(i)) / 2);
            }
            return ma***REMOVED*** > 0 && ma***REMOVED***;
        }
        const dataset = meta.dataset;
        const border = dataset.options && dataset.options.borderWidth || 0;
        if (!data.length) {
            return border;
        }
        const firstPoint = data[0].size(this.resolveDataElementOptions(0));
        const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
        return Math.ma***REMOVED***(border, firstPoint, lastPoint) / 2;
    }
}

var controllers = /*#__PURE__*/Object.freeze({
__proto__: null,
BarController: BarController,
BubbleController: BubbleController,
DoughnutController: DoughnutController,
LineController: LineController,
PieController: PieController,
PolarAreaController: PolarAreaController,
RadarController: RadarController,
ScatterController: ScatterController
});

/**
 * @namespace Chart._adapters
 * @since 2.8.0
 * @private
 */ function abstract() {
    throw new Error('This method is not implemented: Check that a complete date adapter is provided.');
}
/**
 * Date adapter (current used by the time scale)
 * @namespace Chart._adapters._date
 * @memberof Chart._adapters
 * @private
 */ class DateAdapterBase {
    /**
   * Override default date adapter methods.
   * Accepts type parameter to define options type.
   * @e***REMOVED***ample
   * Chart._adapters._date.override<{myAdapterOption: string}>({
   *   init() {
   *     console.log(this.options.myAdapterOption);
   *   }
   * })
   */ static override(members) {
        Object.assign(DateAdapterBase.prototype, members);
    }
    options;
    constructor(options){
        this.options = options || {};
    }
    // eslint-disable-ne***REMOVED***t-line @typescript-eslint/no-empty-function
    init() {}
    formats() {
        return abstract();
    }
    parse() {
        return abstract();
    }
    format() {
        return abstract();
    }
    add() {
        return abstract();
    }
    diff() {
        return abstract();
    }
    startOf() {
        return abstract();
    }
    endOf() {
        return abstract();
    }
}
var adapters = {
    _date: DateAdapterBase
};

function binarySearch(metaset, a***REMOVED***is, value, intersect) {
    const { controller , data , _sorted  } = metaset;
    const iScale = controller._cachedMeta.iScale;
    if (iScale && a***REMOVED***is === iScale.a***REMOVED***is && a***REMOVED***is !== 'r' && _sorted && data.length) {
        const lookupMethod = iScale._reversePi***REMOVED***els ? helpers_segment._rlookupByKey : helpers_segment._lookupByKey;
        if (!intersect) {
            return lookupMethod(data, a***REMOVED***is, value);
        } else if (controller._sharedOptions) {
            const el = data[0];
            const range = typeof el.getRange === 'function' && el.getRange(a***REMOVED***is);
            if (range) {
                const start = lookupMethod(data, a***REMOVED***is, value - range);
                const end = lookupMethod(data, a***REMOVED***is, value + range);
                return {
                    lo: start.lo,
                    hi: end.hi
                };
            }
        }
    }
    return {
        lo: 0,
        hi: data.length - 1
    };
}
 function evaluateInteractionItems(chart, a***REMOVED***is, position, handler, intersect) {
    const metasets = chart.getSortedVisibleDatasetMetas();
    const value = position[a***REMOVED***is];
    for(let i = 0, ilen = metasets.length; i < ilen; ++i){
        const { inde***REMOVED*** , data  } = metasets[i];
        const { lo , hi  } = binarySearch(metasets[i], a***REMOVED***is, value, intersect);
        for(let j = lo; j <= hi; ++j){
            const element = data[j];
            if (!element.skip) {
                handler(element, inde***REMOVED***, j);
            }
        }
    }
}
 function getDistanceMetricForA***REMOVED***is(a***REMOVED***is) {
    const useX = a***REMOVED***is.inde***REMOVED***Of('***REMOVED***') !== -1;
    const useY = a***REMOVED***is.inde***REMOVED***Of('y') !== -1;
    return function(pt1, pt2) {
        const deltaX = useX ? Math.abs(pt1.***REMOVED*** - pt2.***REMOVED***) : 0;
        const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    };
}
 function getIntersectItems(chart, position, a***REMOVED***is, useFinalPosition, includeInvisible) {
    const items = [];
    if (!includeInvisible && !chart.isPointInArea(position)) {
        return items;
    }
    const evaluationFunc = function(element, datasetInde***REMOVED***, inde***REMOVED***) {
        if (!includeInvisible && !helpers_segment._isPointInArea(element, chart.chartArea, 0)) {
            return;
        }
        if (element.inRange(position.***REMOVED***, position.y, useFinalPosition)) {
            items.push({
                element,
                datasetInde***REMOVED***,
                inde***REMOVED***
            });
        }
    };
    evaluateInteractionItems(chart, a***REMOVED***is, position, evaluationFunc, true);
    return items;
}
 function getNearestRadialItems(chart, position, a***REMOVED***is, useFinalPosition) {
    let items = [];
    function evaluationFunc(element, datasetInde***REMOVED***, inde***REMOVED***) {
        const { startAngle , endAngle  } = element.getProps([
            'startAngle',
            'endAngle'
        ], useFinalPosition);
        const { angle  } = helpers_segment.getAngleFromPoint(element, {
            ***REMOVED***: position.***REMOVED***,
            y: position.y
        });
        if (helpers_segment._angleBetween(angle, startAngle, endAngle)) {
            items.push({
                element,
                datasetInde***REMOVED***,
                inde***REMOVED***
            });
        }
    }
    evaluateInteractionItems(chart, a***REMOVED***is, position, evaluationFunc);
    return items;
}
 function getNearestCartesianItems(chart, position, a***REMOVED***is, intersect, useFinalPosition, includeInvisible) {
    let items = [];
    const distanceMetric = getDistanceMetricForA***REMOVED***is(a***REMOVED***is);
    let minDistance = Number.POSITIVE_INFINITY;
    function evaluationFunc(element, datasetInde***REMOVED***, inde***REMOVED***) {
        const inRange = element.inRange(position.***REMOVED***, position.y, useFinalPosition);
        if (intersect && !inRange) {
            return;
        }
        const center = element.getCenterPoint(useFinalPosition);
        const pointInArea = !!includeInvisible || chart.isPointInArea(center);
        if (!pointInArea && !inRange) {
            return;
        }
        const distance = distanceMetric(position, center);
        if (distance < minDistance) {
            items = [
                {
                    element,
                    datasetInde***REMOVED***,
                    inde***REMOVED***
                }
            ];
            minDistance = distance;
        } else if (distance === minDistance) {
            items.push({
                element,
                datasetInde***REMOVED***,
                inde***REMOVED***
            });
        }
    }
    evaluateInteractionItems(chart, a***REMOVED***is, position, evaluationFunc);
    return items;
}
 function getNearestItems(chart, position, a***REMOVED***is, intersect, useFinalPosition, includeInvisible) {
    if (!includeInvisible && !chart.isPointInArea(position)) {
        return [];
    }
    return a***REMOVED***is === 'r' && !intersect ? getNearestRadialItems(chart, position, a***REMOVED***is, useFinalPosition) : getNearestCartesianItems(chart, position, a***REMOVED***is, intersect, useFinalPosition, includeInvisible);
}
 function getA***REMOVED***isItems(chart, position, a***REMOVED***is, intersect, useFinalPosition) {
    const items = [];
    const rangeMethod = a***REMOVED***is === '***REMOVED***' ? 'inXRange' : 'inYRange';
    let intersectsItem = false;
    evaluateInteractionItems(chart, a***REMOVED***is, position, (element, datasetInde***REMOVED***, inde***REMOVED***)=>{
        if (element[rangeMethod](position[a***REMOVED***is], useFinalPosition)) {
            items.push({
                element,
                datasetInde***REMOVED***,
                inde***REMOVED***
            });
            intersectsItem = intersectsItem || element.inRange(position.***REMOVED***, position.y, useFinalPosition);
        }
    });
    if (intersect && !intersectsItem) {
        return [];
    }
    return items;
}
 var Interaction = {
    evaluateInteractionItems,
    modes: {
 inde***REMOVED*** (chart, e, options, useFinalPosition) {
            const position = helpers_segment.getRelativePosition(e, chart);
            const a***REMOVED***is = options.a***REMOVED***is || '***REMOVED***';
            const includeInvisible = options.includeInvisible || false;
            const items = options.intersect ? getIntersectItems(chart, position, a***REMOVED***is, useFinalPosition, includeInvisible) : getNearestItems(chart, position, a***REMOVED***is, false, useFinalPosition, includeInvisible);
            const elements = [];
            if (!items.length) {
                return [];
            }
            chart.getSortedVisibleDatasetMetas().forEach((meta)=>{
                const inde***REMOVED*** = items[0].inde***REMOVED***;
                const element = meta.data[inde***REMOVED***];
                if (element && !element.skip) {
                    elements.push({
                        element,
                        datasetInde***REMOVED***: meta.inde***REMOVED***,
                        inde***REMOVED***
                    });
                }
            });
            return elements;
        },
 dataset (chart, e, options, useFinalPosition) {
            const position = helpers_segment.getRelativePosition(e, chart);
            const a***REMOVED***is = options.a***REMOVED***is || '***REMOVED***y';
            const includeInvisible = options.includeInvisible || false;
            let items = options.intersect ? getIntersectItems(chart, position, a***REMOVED***is, useFinalPosition, includeInvisible) : getNearestItems(chart, position, a***REMOVED***is, false, useFinalPosition, includeInvisible);
            if (items.length > 0) {
                const datasetInde***REMOVED*** = items[0].datasetInde***REMOVED***;
                const data = chart.getDatasetMeta(datasetInde***REMOVED***).data;
                items = [];
                for(let i = 0; i < data.length; ++i){
                    items.push({
                        element: data[i],
                        datasetInde***REMOVED***,
                        inde***REMOVED***: i
                    });
                }
            }
            return items;
        },
 point (chart, e, options, useFinalPosition) {
            const position = helpers_segment.getRelativePosition(e, chart);
            const a***REMOVED***is = options.a***REMOVED***is || '***REMOVED***y';
            const includeInvisible = options.includeInvisible || false;
            return getIntersectItems(chart, position, a***REMOVED***is, useFinalPosition, includeInvisible);
        },
 nearest (chart, e, options, useFinalPosition) {
            const position = helpers_segment.getRelativePosition(e, chart);
            const a***REMOVED***is = options.a***REMOVED***is || '***REMOVED***y';
            const includeInvisible = options.includeInvisible || false;
            return getNearestItems(chart, position, a***REMOVED***is, options.intersect, useFinalPosition, includeInvisible);
        },
 ***REMOVED*** (chart, e, options, useFinalPosition) {
            const position = helpers_segment.getRelativePosition(e, chart);
            return getA***REMOVED***isItems(chart, position, '***REMOVED***', options.intersect, useFinalPosition);
        },
 y (chart, e, options, useFinalPosition) {
            const position = helpers_segment.getRelativePosition(e, chart);
            return getA***REMOVED***isItems(chart, position, 'y', options.intersect, useFinalPosition);
        }
    }
};

const STATIC_POSITIONS = [
    'left',
    'top',
    'right',
    'bottom'
];
function filterByPosition(array, position) {
    return array.filter((v)=>v.pos === position);
}
function filterDynamicPositionByA***REMOVED***is(array, a***REMOVED***is) {
    return array.filter((v)=>STATIC_POSITIONS.inde***REMOVED***Of(v.pos) === -1 && v.bo***REMOVED***.a***REMOVED***is === a***REMOVED***is);
}
function sortByWeight(array, reverse) {
    return array.sort((a, b)=>{
        const v0 = reverse ? b : a;
        const v1 = reverse ? a : b;
        return v0.weight === v1.weight ? v0.inde***REMOVED*** - v1.inde***REMOVED*** : v0.weight - v1.weight;
    });
}
function wrapBo***REMOVED***es(bo***REMOVED***es) {
    const layoutBo***REMOVED***es = [];
    let i, ilen, bo***REMOVED***, pos, stack, stackWeight;
    for(i = 0, ilen = (bo***REMOVED***es || []).length; i < ilen; ++i){
        bo***REMOVED*** = bo***REMOVED***es[i];
        ({ position: pos , options: { stack , stackWeight =1  }  } = bo***REMOVED***);
        layoutBo***REMOVED***es.push({
            inde***REMOVED***: i,
            bo***REMOVED***,
            pos,
            horizontal: bo***REMOVED***.isHorizontal(),
            weight: bo***REMOVED***.weight,
            stack: stack && pos + stack,
            stackWeight
        });
    }
    return layoutBo***REMOVED***es;
}
function buildStacks(layouts) {
    const stacks = {};
    for (const wrap of layouts){
        const { stack , pos , stackWeight  } = wrap;
        if (!stack || !STATIC_POSITIONS.includes(pos)) {
            continue;
        }
        const _stack = stacks[stack] || (stacks[stack] = {
            count: 0,
            placed: 0,
            weight: 0,
            size: 0
        });
        _stack.count++;
        _stack.weight += stackWeight;
    }
    return stacks;
}
 function setLayoutDims(layouts, params) {
    const stacks = buildStacks(layouts);
    const { vBo***REMOVED***Ma***REMOVED***Width , hBo***REMOVED***Ma***REMOVED***Height  } = params;
    let i, ilen, layout;
    for(i = 0, ilen = layouts.length; i < ilen; ++i){
        layout = layouts[i];
        const { fullSize  } = layout.bo***REMOVED***;
        const stack = stacks[layout.stack];
        const factor = stack && layout.stackWeight / stack.weight;
        if (layout.horizontal) {
            layout.width = factor ? factor * vBo***REMOVED***Ma***REMOVED***Width : fullSize && params.availableWidth;
            layout.height = hBo***REMOVED***Ma***REMOVED***Height;
        } else {
            layout.width = vBo***REMOVED***Ma***REMOVED***Width;
            layout.height = factor ? factor * hBo***REMOVED***Ma***REMOVED***Height : fullSize && params.availableHeight;
        }
    }
    return stacks;
}
function buildLayoutBo***REMOVED***es(bo***REMOVED***es) {
    const layoutBo***REMOVED***es = wrapBo***REMOVED***es(bo***REMOVED***es);
    const fullSize = sortByWeight(layoutBo***REMOVED***es.filter((wrap)=>wrap.bo***REMOVED***.fullSize), true);
    const left = sortByWeight(filterByPosition(layoutBo***REMOVED***es, 'left'), true);
    const right = sortByWeight(filterByPosition(layoutBo***REMOVED***es, 'right'));
    const top = sortByWeight(filterByPosition(layoutBo***REMOVED***es, 'top'), true);
    const bottom = sortByWeight(filterByPosition(layoutBo***REMOVED***es, 'bottom'));
    const centerHorizontal = filterDynamicPositionByA***REMOVED***is(layoutBo***REMOVED***es, '***REMOVED***');
    const centerVertical = filterDynamicPositionByA***REMOVED***is(layoutBo***REMOVED***es, 'y');
    return {
        fullSize,
        leftAndTop: left.concat(top),
        rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
        chartArea: filterByPosition(layoutBo***REMOVED***es, 'chartArea'),
        vertical: left.concat(right).concat(centerVertical),
        horizontal: top.concat(bottom).concat(centerHorizontal)
    };
}
function getCombinedMa***REMOVED***(ma***REMOVED***Padding, chartArea, a, b) {
    return Math.ma***REMOVED***(ma***REMOVED***Padding[a], chartArea[a]) + Math.ma***REMOVED***(ma***REMOVED***Padding[b], chartArea[b]);
}
function updateMa***REMOVED***Padding(ma***REMOVED***Padding, bo***REMOVED***Padding) {
    ma***REMOVED***Padding.top = Math.ma***REMOVED***(ma***REMOVED***Padding.top, bo***REMOVED***Padding.top);
    ma***REMOVED***Padding.left = Math.ma***REMOVED***(ma***REMOVED***Padding.left, bo***REMOVED***Padding.left);
    ma***REMOVED***Padding.bottom = Math.ma***REMOVED***(ma***REMOVED***Padding.bottom, bo***REMOVED***Padding.bottom);
    ma***REMOVED***Padding.right = Math.ma***REMOVED***(ma***REMOVED***Padding.right, bo***REMOVED***Padding.right);
}
function updateDims(chartArea, params, layout, stacks) {
    const { pos , bo***REMOVED***  } = layout;
    const ma***REMOVED***Padding = chartArea.ma***REMOVED***Padding;
    if (!helpers_segment.isObject(pos)) {
        if (layout.size) {
            chartArea[pos] -= layout.size;
        }
        const stack = stacks[layout.stack] || {
            size: 0,
            count: 1
        };
        stack.size = Math.ma***REMOVED***(stack.size, layout.horizontal ? bo***REMOVED***.height : bo***REMOVED***.width);
        layout.size = stack.size / stack.count;
        chartArea[pos] += layout.size;
    }
    if (bo***REMOVED***.getPadding) {
        updateMa***REMOVED***Padding(ma***REMOVED***Padding, bo***REMOVED***.getPadding());
    }
    const newWidth = Math.ma***REMOVED***(0, params.outerWidth - getCombinedMa***REMOVED***(ma***REMOVED***Padding, chartArea, 'left', 'right'));
    const newHeight = Math.ma***REMOVED***(0, params.outerHeight - getCombinedMa***REMOVED***(ma***REMOVED***Padding, chartArea, 'top', 'bottom'));
    const widthChanged = newWidth !== chartArea.w;
    const heightChanged = newHeight !== chartArea.h;
    chartArea.w = newWidth;
    chartArea.h = newHeight;
    return layout.horizontal ? {
        same: widthChanged,
        other: heightChanged
    } : {
        same: heightChanged,
        other: widthChanged
    };
}
function handleMa***REMOVED***Padding(chartArea) {
    const ma***REMOVED***Padding = chartArea.ma***REMOVED***Padding;
    function updatePos(pos) {
        const change = Math.ma***REMOVED***(ma***REMOVED***Padding[pos] - chartArea[pos], 0);
        chartArea[pos] += change;
        return change;
    }
    chartArea.y += updatePos('top');
    chartArea.***REMOVED*** += updatePos('left');
    updatePos('right');
    updatePos('bottom');
}
function getMargins(horizontal, chartArea) {
    const ma***REMOVED***Padding = chartArea.ma***REMOVED***Padding;
    function marginForPositions(positions) {
        const margin = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        positions.forEach((pos)=>{
            margin[pos] = Math.ma***REMOVED***(chartArea[pos], ma***REMOVED***Padding[pos]);
        });
        return margin;
    }
    return horizontal ? marginForPositions([
        'left',
        'right'
    ]) : marginForPositions([
        'top',
        'bottom'
    ]);
}
function fitBo***REMOVED***es(bo***REMOVED***es, chartArea, params, stacks) {
    const refitBo***REMOVED***es = [];
    let i, ilen, layout, bo***REMOVED***, refit, changed;
    for(i = 0, ilen = bo***REMOVED***es.length, refit = 0; i < ilen; ++i){
        layout = bo***REMOVED***es[i];
        bo***REMOVED*** = layout.bo***REMOVED***;
        bo***REMOVED***.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
        const { same , other  } = updateDims(chartArea, params, layout, stacks);
        refit |= same && refitBo***REMOVED***es.length;
        changed = changed || other;
        if (!bo***REMOVED***.fullSize) {
            refitBo***REMOVED***es.push(layout);
        }
    }
    return refit && fitBo***REMOVED***es(refitBo***REMOVED***es, chartArea, params, stacks) || changed;
}
function setBo***REMOVED***Dims(bo***REMOVED***, left, top, width, height) {
    bo***REMOVED***.top = top;
    bo***REMOVED***.left = left;
    bo***REMOVED***.right = left + width;
    bo***REMOVED***.bottom = top + height;
    bo***REMOVED***.width = width;
    bo***REMOVED***.height = height;
}
function placeBo***REMOVED***es(bo***REMOVED***es, chartArea, params, stacks) {
    const userPadding = params.padding;
    let { ***REMOVED*** , y  } = chartArea;
    for (const layout of bo***REMOVED***es){
        const bo***REMOVED*** = layout.bo***REMOVED***;
        const stack = stacks[layout.stack] || {
            count: 1,
            placed: 0,
            weight: 1
        };
        const weight = layout.stackWeight / stack.weight || 1;
        if (layout.horizontal) {
            const width = chartArea.w * weight;
            const height = stack.size || bo***REMOVED***.height;
            if (helpers_segment.defined(stack.start)) {
                y = stack.start;
            }
            if (bo***REMOVED***.fullSize) {
                setBo***REMOVED***Dims(bo***REMOVED***, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
            } else {
                setBo***REMOVED***Dims(bo***REMOVED***, chartArea.left + stack.placed, y, width, height);
            }
            stack.start = y;
            stack.placed += width;
            y = bo***REMOVED***.bottom;
        } else {
            const height = chartArea.h * weight;
            const width = stack.size || bo***REMOVED***.width;
            if (helpers_segment.defined(stack.start)) {
                ***REMOVED*** = stack.start;
            }
            if (bo***REMOVED***.fullSize) {
                setBo***REMOVED***Dims(bo***REMOVED***, ***REMOVED***, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
            } else {
                setBo***REMOVED***Dims(bo***REMOVED***, ***REMOVED***, chartArea.top + stack.placed, width, height);
            }
            stack.start = ***REMOVED***;
            stack.placed += height;
            ***REMOVED*** = bo***REMOVED***.right;
        }
    }
    chartArea.***REMOVED*** = ***REMOVED***;
    chartArea.y = y;
}
var layouts = {
 addBo***REMOVED*** (chart, item) {
        if (!chart.bo***REMOVED***es) {
            chart.bo***REMOVED***es = [];
        }
        item.fullSize = item.fullSize || false;
        item.position = item.position || 'top';
        item.weight = item.weight || 0;
        item._layers = item._layers || function() {
            return [
                {
                    z: 0,
                    draw (chartArea) {
                        item.draw(chartArea);
                    }
                }
            ];
        };
        chart.bo***REMOVED***es.push(item);
    },
 removeBo***REMOVED*** (chart, layoutItem) {
        const inde***REMOVED*** = chart.bo***REMOVED***es ? chart.bo***REMOVED***es.inde***REMOVED***Of(layoutItem) : -1;
        if (inde***REMOVED*** !== -1) {
            chart.bo***REMOVED***es.splice(inde***REMOVED***, 1);
        }
    },
 configure (chart, item, options) {
        item.fullSize = options.fullSize;
        item.position = options.position;
        item.weight = options.weight;
    },
 update (chart, width, height, minPadding) {
        if (!chart) {
            return;
        }
        const padding = helpers_segment.toPadding(chart.options.layout.padding);
        const availableWidth = Math.ma***REMOVED***(width - padding.width, 0);
        const availableHeight = Math.ma***REMOVED***(height - padding.height, 0);
        const bo***REMOVED***es = buildLayoutBo***REMOVED***es(chart.bo***REMOVED***es);
        const verticalBo***REMOVED***es = bo***REMOVED***es.vertical;
        const horizontalBo***REMOVED***es = bo***REMOVED***es.horizontal;
        helpers_segment.each(chart.bo***REMOVED***es, (bo***REMOVED***)=>{
            if (typeof bo***REMOVED***.beforeLayout === 'function') {
                bo***REMOVED***.beforeLayout();
            }
        });
        const visibleVerticalBo***REMOVED***Count = verticalBo***REMOVED***es.reduce((total, wrap)=>wrap.bo***REMOVED***.options && wrap.bo***REMOVED***.options.display === false ? total : total + 1, 0) || 1;
        const params = Object.freeze({
            outerWidth: width,
            outerHeight: height,
            padding,
            availableWidth,
            availableHeight,
            vBo***REMOVED***Ma***REMOVED***Width: availableWidth / 2 / visibleVerticalBo***REMOVED***Count,
            hBo***REMOVED***Ma***REMOVED***Height: availableHeight / 2
        });
        const ma***REMOVED***Padding = Object.assign({}, padding);
        updateMa***REMOVED***Padding(ma***REMOVED***Padding, helpers_segment.toPadding(minPadding));
        const chartArea = Object.assign({
            ma***REMOVED***Padding,
            w: availableWidth,
            h: availableHeight,
            ***REMOVED***: padding.left,
            y: padding.top
        }, padding);
        const stacks = setLayoutDims(verticalBo***REMOVED***es.concat(horizontalBo***REMOVED***es), params);
        fitBo***REMOVED***es(bo***REMOVED***es.fullSize, chartArea, params, stacks);
        fitBo***REMOVED***es(verticalBo***REMOVED***es, chartArea, params, stacks);
        if (fitBo***REMOVED***es(horizontalBo***REMOVED***es, chartArea, params, stacks)) {
            fitBo***REMOVED***es(verticalBo***REMOVED***es, chartArea, params, stacks);
        }
        handleMa***REMOVED***Padding(chartArea);
        placeBo***REMOVED***es(bo***REMOVED***es.leftAndTop, chartArea, params, stacks);
        chartArea.***REMOVED*** += chartArea.w;
        chartArea.y += chartArea.h;
        placeBo***REMOVED***es(bo***REMOVED***es.rightAndBottom, chartArea, params, stacks);
        chart.chartArea = {
            left: chartArea.left,
            top: chartArea.top,
            right: chartArea.left + chartArea.w,
            bottom: chartArea.top + chartArea.h,
            height: chartArea.h,
            width: chartArea.w
        };
        helpers_segment.each(bo***REMOVED***es.chartArea, (layout)=>{
            const bo***REMOVED*** = layout.bo***REMOVED***;
            Object.assign(bo***REMOVED***, chart.chartArea);
            bo***REMOVED***.update(chartArea.w, chartArea.h, {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            });
        });
    }
};

class BasePlatform {
 acquireConte***REMOVED***t(canvas, aspectRatio) {}
 releaseConte***REMOVED***t(conte***REMOVED***t) {
        return false;
    }
 addEventListener(chart, type, listener) {}
 removeEventListener(chart, type, listener) {}
 getDevicePi***REMOVED***elRatio() {
        return 1;
    }
 getMa***REMOVED***imumSize(element, width, height, aspectRatio) {
        width = Math.ma***REMOVED***(0, width || element.width);
        height = height || element.height;
        return {
            width,
            height: Math.ma***REMOVED***(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
        };
    }
 isAttached(canvas) {
        return true;
    }
 updateConfig(config) {
    }
}

class BasicPlatform e***REMOVED***tends BasePlatform {
    acquireConte***REMOVED***t(item) {
        return item && item.getConte***REMOVED***t && item.getConte***REMOVED***t('2d') || null;
    }
    updateConfig(config) {
        config.options.animation = false;
    }
}

const EXPANDO_KEY = '$chartjs';
 const EVENT_TYPES = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    pointerenter: 'mouseenter',
    pointerdown: 'mousedown',
    pointermove: 'mousemove',
    pointerup: 'mouseup',
    pointerleave: 'mouseout',
    pointerout: 'mouseout'
};
const isNullOrEmpty = (value)=>value === null || value === '';
 function initCanvas(canvas, aspectRatio) {
    const style = canvas.style;
    const renderHeight = canvas.getAttribute('height');
    const renderWidth = canvas.getAttribute('width');
    canvas[EXPANDO_KEY] = {
        initial: {
            height: renderHeight,
            width: renderWidth,
            style: {
                display: style.display,
                height: style.height,
                width: style.width
            }
        }
    };
    style.display = style.display || 'block';
    style.bo***REMOVED***Sizing = style.bo***REMOVED***Sizing || 'border-bo***REMOVED***';
    if (isNullOrEmpty(renderWidth)) {
        const displayWidth = helpers_segment.readUsedSize(canvas, 'width');
        if (displayWidth !== undefined) {
            canvas.width = displayWidth;
        }
    }
    if (isNullOrEmpty(renderHeight)) {
        if (canvas.style.height === '') {
            canvas.height = canvas.width / (aspectRatio || 2);
        } else {
            const displayHeight = helpers_segment.readUsedSize(canvas, 'height');
            if (displayHeight !== undefined) {
                canvas.height = displayHeight;
            }
        }
    }
    return canvas;
}
const eventListenerOptions = helpers_segment.supportsEventListenerOptions ? {
    passive: true
} : false;
function addListener(node, type, listener) {
    if (node) {
        node.addEventListener(type, listener, eventListenerOptions);
    }
}
function removeListener(chart, type, listener) {
    if (chart && chart.canvas) {
        chart.canvas.removeEventListener(type, listener, eventListenerOptions);
    }
}
function fromNativeEvent(event, chart) {
    const type = EVENT_TYPES[event.type] || event.type;
    const { ***REMOVED*** , y  } = helpers_segment.getRelativePosition(event, chart);
    return {
        type,
        chart,
        native: event,
        ***REMOVED***: ***REMOVED*** !== undefined ? ***REMOVED*** : null,
        y: y !== undefined ? y : null
    };
}
function nodeListContains(nodeList, canvas) {
    for (const node of nodeList){
        if (node === canvas || node.contains(canvas)) {
            return true;
        }
    }
}
function createAttachObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const observer = new MutationObserver((entries)=>{
        let trigger = false;
        for (const entry of entries){
            trigger = trigger || nodeListContains(entry.addedNodes, canvas);
            trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
        }
        if (trigger) {
            listener();
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
    return observer;
}
function createDetachObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const observer = new MutationObserver((entries)=>{
        let trigger = false;
        for (const entry of entries){
            trigger = trigger || nodeListContains(entry.removedNodes, canvas);
            trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
        }
        if (trigger) {
            listener();
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
    return observer;
}
const drpListeningCharts = new Map();
let oldDevicePi***REMOVED***elRatio = 0;
function onWindowResize() {
    const dpr = window.devicePi***REMOVED***elRatio;
    if (dpr === oldDevicePi***REMOVED***elRatio) {
        return;
    }
    oldDevicePi***REMOVED***elRatio = dpr;
    drpListeningCharts.forEach((resize, chart)=>{
        if (chart.currentDevicePi***REMOVED***elRatio !== dpr) {
            resize();
        }
    });
}
function listenDevicePi***REMOVED***elRatioChanges(chart, resize) {
    if (!drpListeningCharts.size) {
        window.addEventListener('resize', onWindowResize);
    }
    drpListeningCharts.set(chart, resize);
}
function unlistenDevicePi***REMOVED***elRatioChanges(chart) {
    drpListeningCharts.delete(chart);
    if (!drpListeningCharts.size) {
        window.removeEventListener('resize', onWindowResize);
    }
}
function createResizeObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const container = canvas && helpers_segment._getParentNode(canvas);
    if (!container) {
        return;
    }
    const resize = helpers_segment.throttled((width, height)=>{
        const w = container.clientWidth;
        listener(width, height);
        if (w < container.clientWidth) {
            listener();
        }
    }, window);
    const observer = new ResizeObserver((entries)=>{
        const entry = entries[0];
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width === 0 && height === 0) {
            return;
        }
        resize(width, height);
    });
    observer.observe(container);
    listenDevicePi***REMOVED***elRatioChanges(chart, resize);
    return observer;
}
function releaseObserver(chart, type, observer) {
    if (observer) {
        observer.disconnect();
    }
    if (type === 'resize') {
        unlistenDevicePi***REMOVED***elRatioChanges(chart);
    }
}
function createPro***REMOVED***yAndListen(chart, type, listener) {
    const canvas = chart.canvas;
    const pro***REMOVED***y = helpers_segment.throttled((event)=>{
        if (chart.ct***REMOVED*** !== null) {
            listener(fromNativeEvent(event, chart));
        }
    }, chart);
    addListener(canvas, type, pro***REMOVED***y);
    return pro***REMOVED***y;
}
 class DomPlatform e***REMOVED***tends BasePlatform {
 acquireConte***REMOVED***t(canvas, aspectRatio) {
        const conte***REMOVED***t = canvas && canvas.getConte***REMOVED***t && canvas.getConte***REMOVED***t('2d');
        if (conte***REMOVED***t && conte***REMOVED***t.canvas === canvas) {
            initCanvas(canvas, aspectRatio);
            return conte***REMOVED***t;
        }
        return null;
    }
 releaseConte***REMOVED***t(conte***REMOVED***t) {
        const canvas = conte***REMOVED***t.canvas;
        if (!canvas[EXPANDO_KEY]) {
            return false;
        }
        const initial = canvas[EXPANDO_KEY].initial;
        [
            'height',
            'width'
        ].forEach((prop)=>{
            const value = initial[prop];
            if (helpers_segment.isNullOrUndef(value)) {
                canvas.removeAttribute(prop);
            } else {
                canvas.setAttribute(prop, value);
            }
        });
        const style = initial.style || {};
        Object.keys(style).forEach((key)=>{
            canvas.style[key] = style[key];
        });
        canvas.width = canvas.width;
        delete canvas[EXPANDO_KEY];
        return true;
    }
 addEventListener(chart, type, listener) {
        this.removeEventListener(chart, type);
        const pro***REMOVED***ies = chart.$pro***REMOVED***ies || (chart.$pro***REMOVED***ies = {});
        const handlers = {
            attach: createAttachObserver,
            detach: createDetachObserver,
            resize: createResizeObserver
        };
        const handler = handlers[type] || createPro***REMOVED***yAndListen;
        pro***REMOVED***ies[type] = handler(chart, type, listener);
    }
 removeEventListener(chart, type) {
        const pro***REMOVED***ies = chart.$pro***REMOVED***ies || (chart.$pro***REMOVED***ies = {});
        const pro***REMOVED***y = pro***REMOVED***ies[type];
        if (!pro***REMOVED***y) {
            return;
        }
        const handlers = {
            attach: releaseObserver,
            detach: releaseObserver,
            resize: releaseObserver
        };
        const handler = handlers[type] || removeListener;
        handler(chart, type, pro***REMOVED***y);
        pro***REMOVED***ies[type] = undefined;
    }
    getDevicePi***REMOVED***elRatio() {
        return window.devicePi***REMOVED***elRatio;
    }
 getMa***REMOVED***imumSize(canvas, width, height, aspectRatio) {
        return helpers_segment.getMa***REMOVED***imumSize(canvas, width, height, aspectRatio);
    }
 isAttached(canvas) {
        const container = canvas && helpers_segment._getParentNode(canvas);
        return !!(container && container.isConnected);
    }
}

function _detectPlatform(canvas) {
    if (!helpers_segment._isDomSupported() || typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
        return BasicPlatform;
    }
    return DomPlatform;
}

class Element {
    static defaults = {};
    static defaultRoutes = undefined;
    ***REMOVED***;
    y;
    active = false;
    options;
    $animations;
    tooltipPosition(useFinalPosition) {
        const { ***REMOVED*** , y  } = this.getProps([
            '***REMOVED***',
            'y'
        ], useFinalPosition);
        return {
            ***REMOVED***,
            y
        };
    }
    hasValue() {
        return helpers_segment.isNumber(this.***REMOVED***) && helpers_segment.isNumber(this.y);
    }
    getProps(props, final) {
        const anims = this.$animations;
        if (!final || !anims) {
            // let's not create an object, if not needed
            return this;
        }
        const ret = {};
        props.forEach((prop)=>{
            ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
        });
        return ret;
    }
}

function autoSkip(scale, ticks) {
    const tickOpts = scale.options.ticks;
    const determinedMa***REMOVED***Ticks = determineMa***REMOVED***Ticks(scale);
    const ticksLimit = Math.min(tickOpts.ma***REMOVED***TicksLimit || determinedMa***REMOVED***Ticks, determinedMa***REMOVED***Ticks);
    const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
    const numMajorIndices = majorIndices.length;
    const first = majorIndices[0];
    const last = majorIndices[numMajorIndices - 1];
    const newTicks = [];
    if (numMajorIndices > ticksLimit) {
        skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
        return newTicks;
    }
    const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
    if (numMajorIndices > 0) {
        let i, ilen;
        const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
        skip(ticks, newTicks, spacing, helpers_segment.isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
        for(i = 0, ilen = numMajorIndices - 1; i < ilen; i++){
            skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
        }
        skip(ticks, newTicks, spacing, last, helpers_segment.isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
        return newTicks;
    }
    skip(ticks, newTicks, spacing);
    return newTicks;
}
function determineMa***REMOVED***Ticks(scale) {
    const offset = scale.options.offset;
    const tickLength = scale._tickSize();
    const ma***REMOVED***Scale = scale._length / tickLength + (offset ? 0 : 1);
    const ma***REMOVED***Chart = scale._ma***REMOVED***Length / tickLength;
    return Math.floor(Math.min(ma***REMOVED***Scale, ma***REMOVED***Chart));
}
 function calculateSpacing(majorIndices, ticks, ticksLimit) {
    const evenMajorSpacing = getEvenSpacing(majorIndices);
    const spacing = ticks.length / ticksLimit;
    if (!evenMajorSpacing) {
        return Math.ma***REMOVED***(spacing, 1);
    }
    const factors = helpers_segment._factorize(evenMajorSpacing);
    for(let i = 0, ilen = factors.length - 1; i < ilen; i++){
        const factor = factors[i];
        if (factor > spacing) {
            return factor;
        }
    }
    return Math.ma***REMOVED***(spacing, 1);
}
 function getMajorIndices(ticks) {
    const result = [];
    let i, ilen;
    for(i = 0, ilen = ticks.length; i < ilen; i++){
        if (ticks[i].major) {
            result.push(i);
        }
    }
    return result;
}
 function skipMajors(ticks, newTicks, majorIndices, spacing) {
    let count = 0;
    let ne***REMOVED***t = majorIndices[0];
    let i;
    spacing = Math.ceil(spacing);
    for(i = 0; i < ticks.length; i++){
        if (i === ne***REMOVED***t) {
            newTicks.push(ticks[i]);
            count++;
            ne***REMOVED***t = majorIndices[count * spacing];
        }
    }
}
 function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
    const start = helpers_segment.valueOrDefault(majorStart, 0);
    const end = Math.min(helpers_segment.valueOrDefault(majorEnd, ticks.length), ticks.length);
    let count = 0;
    let length, i, ne***REMOVED***t;
    spacing = Math.ceil(spacing);
    if (majorEnd) {
        length = majorEnd - majorStart;
        spacing = length / Math.floor(length / spacing);
    }
    ne***REMOVED***t = start;
    while(ne***REMOVED***t < 0){
        count++;
        ne***REMOVED***t = Math.round(start + count * spacing);
    }
    for(i = Math.ma***REMOVED***(start, 0); i < end; i++){
        if (i === ne***REMOVED***t) {
            newTicks.push(ticks[i]);
            count++;
            ne***REMOVED***t = Math.round(start + count * spacing);
        }
    }
}
 function getEvenSpacing(arr) {
    const len = arr.length;
    let i, diff;
    if (len < 2) {
        return false;
    }
    for(diff = arr[0], i = 1; i < len; ++i){
        if (arr[i] - arr[i - 1] !== diff) {
            return false;
        }
    }
    return diff;
}

const reverseAlign = (align)=>align === 'left' ? 'right' : align === 'right' ? 'left' : align;
const offsetFromEdge = (scale, edge, offset)=>edge === 'top' || edge === 'left' ? scale[edge] + offset : scale[edge] - offset;
const getTicksLimit = (ticksLength, ma***REMOVED***TicksLimit)=>Math.min(ma***REMOVED***TicksLimit || ticksLength, ticksLength);
 function sample(arr, numItems) {
    const result = [];
    const increment = arr.length / numItems;
    const len = arr.length;
    let i = 0;
    for(; i < len; i += increment){
        result.push(arr[Math.floor(i)]);
    }
    return result;
}
 function getPi***REMOVED***elForGridLine(scale, inde***REMOVED***, offsetGridLines) {
    const length = scale.ticks.length;
    const validInde***REMOVED*** = Math.min(inde***REMOVED***, length - 1);
    const start = scale._startPi***REMOVED***el;
    const end = scale._endPi***REMOVED***el;
    const epsilon = 1e-6;
    let lineValue = scale.getPi***REMOVED***elForTick(validInde***REMOVED***);
    let offset;
    if (offsetGridLines) {
        if (length === 1) {
            offset = Math.ma***REMOVED***(lineValue - start, end - lineValue);
        } else if (inde***REMOVED*** === 0) {
            offset = (scale.getPi***REMOVED***elForTick(1) - lineValue) / 2;
        } else {
            offset = (lineValue - scale.getPi***REMOVED***elForTick(validInde***REMOVED*** - 1)) / 2;
        }
        lineValue += validInde***REMOVED*** < inde***REMOVED*** ? offset : -offset;
        if (lineValue < start - epsilon || lineValue > end + epsilon) {
            return;
        }
    }
    return lineValue;
}
 function garbageCollect(caches, length) {
    helpers_segment.each(caches, (cache)=>{
        const gc = cache.gc;
        const gcLen = gc.length / 2;
        let i;
        if (gcLen > length) {
            for(i = 0; i < gcLen; ++i){
                delete cache.data[gc[i]];
            }
            gc.splice(0, gcLen);
        }
    });
}
 function getTickMarkLength(options) {
    return options.drawTicks ? options.tickLength : 0;
}
 function getTitleHeight(options, fallback) {
    if (!options.display) {
        return 0;
    }
    const font = helpers_segment.toFont(options.font, fallback);
    const padding = helpers_segment.toPadding(options.padding);
    const lines = helpers_segment.isArray(options.te***REMOVED***t) ? options.te***REMOVED***t.length : 1;
    return lines * font.lineHeight + padding.height;
}
function createScaleConte***REMOVED***t(parent, scale) {
    return helpers_segment.createConte***REMOVED***t(parent, {
        scale,
        type: 'scale'
    });
}
function createTickConte***REMOVED***t(parent, inde***REMOVED***, tick) {
    return helpers_segment.createConte***REMOVED***t(parent, {
        tick,
        inde***REMOVED***,
        type: 'tick'
    });
}
function titleAlign(align, position, reverse) {
     let ret = helpers_segment._toLeftRightCenter(align);
    if (reverse && position !== 'right' || !reverse && position === 'right') {
        ret = reverseAlign(ret);
    }
    return ret;
}
function titleArgs(scale, offset, position, align) {
    const { top , left , bottom , right , chart  } = scale;
    const { chartArea , scales  } = chart;
    let rotation = 0;
    let ma***REMOVED***Width, titleX, titleY;
    const height = bottom - top;
    const width = right - left;
    if (scale.isHorizontal()) {
        titleX = helpers_segment._alignStartEnd(align, left, right);
        if (helpers_segment.isObject(position)) {
            const positionA***REMOVED***isID = Object.keys(position)[0];
            const value = position[positionA***REMOVED***isID];
            titleY = scales[positionA***REMOVED***isID].getPi***REMOVED***elForValue(value) + height - offset;
        } else if (position === 'center') {
            titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
        } else {
            titleY = offsetFromEdge(scale, position, offset);
        }
        ma***REMOVED***Width = right - left;
    } else {
        if (helpers_segment.isObject(position)) {
            const positionA***REMOVED***isID = Object.keys(position)[0];
            const value = position[positionA***REMOVED***isID];
            titleX = scales[positionA***REMOVED***isID].getPi***REMOVED***elForValue(value) - width + offset;
        } else if (position === 'center') {
            titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
        } else {
            titleX = offsetFromEdge(scale, position, offset);
        }
        titleY = helpers_segment._alignStartEnd(align, bottom, top);
        rotation = position === 'left' ? -helpers_segment.HALF_PI : helpers_segment.HALF_PI;
    }
    return {
        titleX,
        titleY,
        ma***REMOVED***Width,
        rotation
    };
}
class Scale e***REMOVED***tends Element {
    constructor(cfg){
        super();
         this.id = cfg.id;
         this.type = cfg.type;
         this.options = undefined;
         this.ct***REMOVED*** = cfg.ct***REMOVED***;
         this.chart = cfg.chart;
         this.top = undefined;
         this.bottom = undefined;
         this.left = undefined;
         this.right = undefined;
         this.width = undefined;
         this.height = undefined;
        this._margins = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
         this.ma***REMOVED***Width = undefined;
         this.ma***REMOVED***Height = undefined;
         this.paddingTop = undefined;
         this.paddingBottom = undefined;
         this.paddingLeft = undefined;
         this.paddingRight = undefined;
         this.a***REMOVED***is = undefined;
         this.labelRotation = undefined;
        this.min = undefined;
        this.ma***REMOVED*** = undefined;
        this._range = undefined;
         this.ticks = [];
         this._gridLineItems = null;
         this._labelItems = null;
         this._labelSizes = null;
        this._length = 0;
        this._ma***REMOVED***Length = 0;
        this._longestTe***REMOVED***tCache = {};
         this._startPi***REMOVED***el = undefined;
         this._endPi***REMOVED***el = undefined;
        this._reversePi***REMOVED***els = false;
        this._userMa***REMOVED*** = undefined;
        this._userMin = undefined;
        this._suggestedMa***REMOVED*** = undefined;
        this._suggestedMin = undefined;
        this._ticksLength = 0;
        this._borderValue = 0;
        this._cache = {};
        this._dataLimitsCached = false;
        this.$conte***REMOVED***t = undefined;
    }
 init(options) {
        this.options = options.setConte***REMOVED***t(this.getConte***REMOVED***t());
        this.a***REMOVED***is = options.a***REMOVED***is;
        this._userMin = this.parse(options.min);
        this._userMa***REMOVED*** = this.parse(options.ma***REMOVED***);
        this._suggestedMin = this.parse(options.suggestedMin);
        this._suggestedMa***REMOVED*** = this.parse(options.suggestedMa***REMOVED***);
    }
 parse(raw, inde***REMOVED***) {
        return raw;
    }
 getUserBounds() {
        let { _userMin , _userMa***REMOVED*** , _suggestedMin , _suggestedMa***REMOVED***  } = this;
        _userMin = helpers_segment.finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
        _userMa***REMOVED*** = helpers_segment.finiteOrDefault(_userMa***REMOVED***, Number.NEGATIVE_INFINITY);
        _suggestedMin = helpers_segment.finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
        _suggestedMa***REMOVED*** = helpers_segment.finiteOrDefault(_suggestedMa***REMOVED***, Number.NEGATIVE_INFINITY);
        return {
            min: helpers_segment.finiteOrDefault(_userMin, _suggestedMin),
            ma***REMOVED***: helpers_segment.finiteOrDefault(_userMa***REMOVED***, _suggestedMa***REMOVED***),
            minDefined: helpers_segment.isNumberFinite(_userMin),
            ma***REMOVED***Defined: helpers_segment.isNumberFinite(_userMa***REMOVED***)
        };
    }
 getMinMa***REMOVED***(canStack) {
        let { min , ma***REMOVED*** , minDefined , ma***REMOVED***Defined  } = this.getUserBounds();
        let range;
        if (minDefined && ma***REMOVED***Defined) {
            return {
                min,
                ma***REMOVED***
            };
        }
        const metas = this.getMatchingVisibleMetas();
        for(let i = 0, ilen = metas.length; i < ilen; ++i){
            range = metas[i].controller.getMinMa***REMOVED***(this, canStack);
            if (!minDefined) {
                min = Math.min(min, range.min);
            }
            if (!ma***REMOVED***Defined) {
                ma***REMOVED*** = Math.ma***REMOVED***(ma***REMOVED***, range.ma***REMOVED***);
            }
        }
        min = ma***REMOVED***Defined && min > ma***REMOVED*** ? ma***REMOVED*** : min;
        ma***REMOVED*** = minDefined && min > ma***REMOVED*** ? min : ma***REMOVED***;
        return {
            min: helpers_segment.finiteOrDefault(min, helpers_segment.finiteOrDefault(ma***REMOVED***, min)),
            ma***REMOVED***: helpers_segment.finiteOrDefault(ma***REMOVED***, helpers_segment.finiteOrDefault(min, ma***REMOVED***))
        };
    }
 getPadding() {
        return {
            left: this.paddingLeft || 0,
            top: this.paddingTop || 0,
            right: this.paddingRight || 0,
            bottom: this.paddingBottom || 0
        };
    }
 getTicks() {
        return this.ticks;
    }
 getLabels() {
        const data = this.chart.data;
        return this.options.labels || (this.isHorizontal() ? data.***REMOVED***Labels : data.yLabels) || data.labels || [];
    }
 getLabelItems(chartArea = this.chart.chartArea) {
        const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
        return items;
    }
    beforeLayout() {
        this._cache = {};
        this._dataLimitsCached = false;
    }
    beforeUpdate() {
        helpers_segment.callback(this.options.beforeUpdate, [
            this
        ]);
    }
 update(ma***REMOVED***Width, ma***REMOVED***Height, margins) {
        const { beginAtZero , grace , ticks: tickOpts  } = this.options;
        const sampleSize = tickOpts.sampleSize;
        this.beforeUpdate();
        this.ma***REMOVED***Width = ma***REMOVED***Width;
        this.ma***REMOVED***Height = ma***REMOVED***Height;
        this._margins = margins = Object.assign({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }, margins);
        this.ticks = null;
        this._labelSizes = null;
        this._gridLineItems = null;
        this._labelItems = null;
        this.beforeSetDimensions();
        this.setDimensions();
        this.afterSetDimensions();
        this._ma***REMOVED***Length = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
        if (!this._dataLimitsCached) {
            this.beforeDataLimits();
            this.determineDataLimits();
            this.afterDataLimits();
            this._range = helpers_segment._addGrace(this, grace, beginAtZero);
            this._dataLimitsCached = true;
        }
        this.beforeBuildTicks();
        this.ticks = this.buildTicks() || [];
        this.afterBuildTicks();
        const samplingEnabled = sampleSize < this.ticks.length;
        this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
        this.configure();
        this.beforeCalculateLabelRotation();
        this.calculateLabelRotation();
        this.afterCalculateLabelRotation();
        if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto')) {
            this.ticks = autoSkip(this, this.ticks);
            this._labelSizes = null;
            this.afterAutoSkip();
        }
        if (samplingEnabled) {
            this._convertTicksToLabels(this.ticks);
        }
        this.beforeFit();
        this.fit();
        this.afterFit();
        this.afterUpdate();
    }
 configure() {
        let reversePi***REMOVED***els = this.options.reverse;
        let startPi***REMOVED***el, endPi***REMOVED***el;
        if (this.isHorizontal()) {
            startPi***REMOVED***el = this.left;
            endPi***REMOVED***el = this.right;
        } else {
            startPi***REMOVED***el = this.top;
            endPi***REMOVED***el = this.bottom;
            reversePi***REMOVED***els = !reversePi***REMOVED***els;
        }
        this._startPi***REMOVED***el = startPi***REMOVED***el;
        this._endPi***REMOVED***el = endPi***REMOVED***el;
        this._reversePi***REMOVED***els = reversePi***REMOVED***els;
        this._length = endPi***REMOVED***el - startPi***REMOVED***el;
        this._alignToPi***REMOVED***els = this.options.alignToPi***REMOVED***els;
    }
    afterUpdate() {
        helpers_segment.callback(this.options.afterUpdate, [
            this
        ]);
    }
    beforeSetDimensions() {
        helpers_segment.callback(this.options.beforeSetDimensions, [
            this
        ]);
    }
    setDimensions() {
        if (this.isHorizontal()) {
            this.width = this.ma***REMOVED***Width;
            this.left = 0;
            this.right = this.width;
        } else {
            this.height = this.ma***REMOVED***Height;
            this.top = 0;
            this.bottom = this.height;
        }
        this.paddingLeft = 0;
        this.paddingTop = 0;
        this.paddingRight = 0;
        this.paddingBottom = 0;
    }
    afterSetDimensions() {
        helpers_segment.callback(this.options.afterSetDimensions, [
            this
        ]);
    }
    _callHooks(name) {
        this.chart.notifyPlugins(name, this.getConte***REMOVED***t());
        helpers_segment.callback(this.options[name], [
            this
        ]);
    }
    beforeDataLimits() {
        this._callHooks('beforeDataLimits');
    }
    determineDataLimits() {}
    afterDataLimits() {
        this._callHooks('afterDataLimits');
    }
    beforeBuildTicks() {
        this._callHooks('beforeBuildTicks');
    }
 buildTicks() {
        return [];
    }
    afterBuildTicks() {
        this._callHooks('afterBuildTicks');
    }
    beforeTickToLabelConversion() {
        helpers_segment.callback(this.options.beforeTickToLabelConversion, [
            this
        ]);
    }
 generateTickLabels(ticks) {
        const tickOpts = this.options.ticks;
        let i, ilen, tick;
        for(i = 0, ilen = ticks.length; i < ilen; i++){
            tick = ticks[i];
            tick.label = helpers_segment.callback(tickOpts.callback, [
                tick.value,
                i,
                ticks
            ], this);
        }
    }
    afterTickToLabelConversion() {
        helpers_segment.callback(this.options.afterTickToLabelConversion, [
            this
        ]);
    }
    beforeCalculateLabelRotation() {
        helpers_segment.callback(this.options.beforeCalculateLabelRotation, [
            this
        ]);
    }
    calculateLabelRotation() {
        const options = this.options;
        const tickOpts = options.ticks;
        const numTicks = getTicksLimit(this.ticks.length, options.ticks.ma***REMOVED***TicksLimit);
        const minRotation = tickOpts.minRotation || 0;
        const ma***REMOVED***Rotation = tickOpts.ma***REMOVED***Rotation;
        let labelRotation = minRotation;
        let tickWidth, ma***REMOVED***Height, ma***REMOVED***LabelDiagonal;
        if (!this._isVisible() || !tickOpts.display || minRotation >= ma***REMOVED***Rotation || numTicks <= 1 || !this.isHorizontal()) {
            this.labelRotation = minRotation;
            return;
        }
        const labelSizes = this._getLabelSizes();
        const ma***REMOVED***LabelWidth = labelSizes.widest.width;
        const ma***REMOVED***LabelHeight = labelSizes.highest.height;
        const ma***REMOVED***Width = helpers_segment._limitValue(this.chart.width - ma***REMOVED***LabelWidth, 0, this.ma***REMOVED***Width);
        tickWidth = options.offset ? this.ma***REMOVED***Width / numTicks : ma***REMOVED***Width / (numTicks - 1);
        if (ma***REMOVED***LabelWidth + 6 > tickWidth) {
            tickWidth = ma***REMOVED***Width / (numTicks - (options.offset ? 0.5 : 1));
            ma***REMOVED***Height = this.ma***REMOVED***Height - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
            ma***REMOVED***LabelDiagonal = Math.sqrt(ma***REMOVED***LabelWidth * ma***REMOVED***LabelWidth + ma***REMOVED***LabelHeight * ma***REMOVED***LabelHeight);
            labelRotation = helpers_segment.toDegrees(Math.min(Math.asin(helpers_segment._limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(helpers_segment._limitValue(ma***REMOVED***Height / ma***REMOVED***LabelDiagonal, -1, 1)) - Math.asin(helpers_segment._limitValue(ma***REMOVED***LabelHeight / ma***REMOVED***LabelDiagonal, -1, 1))));
            labelRotation = Math.ma***REMOVED***(minRotation, Math.min(ma***REMOVED***Rotation, labelRotation));
        }
        this.labelRotation = labelRotation;
    }
    afterCalculateLabelRotation() {
        helpers_segment.callback(this.options.afterCalculateLabelRotation, [
            this
        ]);
    }
    afterAutoSkip() {}
    beforeFit() {
        helpers_segment.callback(this.options.beforeFit, [
            this
        ]);
    }
    fit() {
        const minSize = {
            width: 0,
            height: 0
        };
        const { chart , options: { ticks: tickOpts , title: titleOpts , grid: gridOpts  }  } = this;
        const display = this._isVisible();
        const isHorizontal = this.isHorizontal();
        if (display) {
            const titleHeight = getTitleHeight(titleOpts, chart.options.font);
            if (isHorizontal) {
                minSize.width = this.ma***REMOVED***Width;
                minSize.height = getTickMarkLength(gridOpts) + titleHeight;
            } else {
                minSize.height = this.ma***REMOVED***Height;
                minSize.width = getTickMarkLength(gridOpts) + titleHeight;
            }
            if (tickOpts.display && this.ticks.length) {
                const { first , last , widest , highest  } = this._getLabelSizes();
                const tickPadding = tickOpts.padding * 2;
                const angleRadians = helpers_segment.toRadians(this.labelRotation);
                const cos = Math.cos(angleRadians);
                const sin = Math.sin(angleRadians);
                if (isHorizontal) {
                    const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
                    minSize.height = Math.min(this.ma***REMOVED***Height, minSize.height + labelHeight + tickPadding);
                } else {
                    const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
                    minSize.width = Math.min(this.ma***REMOVED***Width, minSize.width + labelWidth + tickPadding);
                }
                this._calculatePadding(first, last, sin, cos);
            }
        }
        this._handleMargins();
        if (isHorizontal) {
            this.width = this._length = chart.width - this._margins.left - this._margins.right;
            this.height = minSize.height;
        } else {
            this.width = minSize.width;
            this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
        }
    }
    _calculatePadding(first, last, sin, cos) {
        const { ticks: { align , padding  } , position  } = this.options;
        const isRotated = this.labelRotation !== 0;
        const labelsBelowTicks = position !== 'top' && this.a***REMOVED***is === '***REMOVED***';
        if (this.isHorizontal()) {
            const offsetLeft = this.getPi***REMOVED***elForTick(0) - this.left;
            const offsetRight = this.right - this.getPi***REMOVED***elForTick(this.ticks.length - 1);
            let paddingLeft = 0;
            let paddingRight = 0;
            if (isRotated) {
                if (labelsBelowTicks) {
                    paddingLeft = cos * first.width;
                    paddingRight = sin * last.height;
                } else {
                    paddingLeft = sin * first.height;
                    paddingRight = cos * last.width;
                }
            } else if (align === 'start') {
                paddingRight = last.width;
            } else if (align === 'end') {
                paddingLeft = first.width;
            } else if (align !== 'inner') {
                paddingLeft = first.width / 2;
                paddingRight = last.width / 2;
            }
            this.paddingLeft = Math.ma***REMOVED***((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
            this.paddingRight = Math.ma***REMOVED***((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
        } else {
            let paddingTop = last.height / 2;
            let paddingBottom = first.height / 2;
            if (align === 'start') {
                paddingTop = 0;
                paddingBottom = first.height;
            } else if (align === 'end') {
                paddingTop = last.height;
                paddingBottom = 0;
            }
            this.paddingTop = paddingTop + padding;
            this.paddingBottom = paddingBottom + padding;
        }
    }
 _handleMargins() {
        if (this._margins) {
            this._margins.left = Math.ma***REMOVED***(this.paddingLeft, this._margins.left);
            this._margins.top = Math.ma***REMOVED***(this.paddingTop, this._margins.top);
            this._margins.right = Math.ma***REMOVED***(this.paddingRight, this._margins.right);
            this._margins.bottom = Math.ma***REMOVED***(this.paddingBottom, this._margins.bottom);
        }
    }
    afterFit() {
        helpers_segment.callback(this.options.afterFit, [
            this
        ]);
    }
 isHorizontal() {
        const { a***REMOVED***is , position  } = this.options;
        return position === 'top' || position === 'bottom' || a***REMOVED***is === '***REMOVED***';
    }
 isFullSize() {
        return this.options.fullSize;
    }
 _convertTicksToLabels(ticks) {
        this.beforeTickToLabelConversion();
        this.generateTickLabels(ticks);
        let i, ilen;
        for(i = 0, ilen = ticks.length; i < ilen; i++){
            if (helpers_segment.isNullOrUndef(ticks[i].label)) {
                ticks.splice(i, 1);
                ilen--;
                i--;
            }
        }
        this.afterTickToLabelConversion();
    }
 _getLabelSizes() {
        let labelSizes = this._labelSizes;
        if (!labelSizes) {
            const sampleSize = this.options.ticks.sampleSize;
            let ticks = this.ticks;
            if (sampleSize < ticks.length) {
                ticks = sample(ticks, sampleSize);
            }
            this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.ma***REMOVED***TicksLimit);
        }
        return labelSizes;
    }
 _computeLabelSizes(ticks, length, ma***REMOVED***TicksLimit) {
        const { ct***REMOVED*** , _longestTe***REMOVED***tCache: caches  } = this;
        const widths = [];
        const heights = [];
        const increment = Math.floor(length / getTicksLimit(length, ma***REMOVED***TicksLimit));
        let widestLabelSize = 0;
        let highestLabelSize = 0;
        let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
        for(i = 0; i < length; i += increment){
            label = ticks[i].label;
            tickFont = this._resolveTickFontOptions(i);
            ct***REMOVED***.font = fontString = tickFont.string;
            cache = caches[fontString] = caches[fontString] || {
                data: {},
                gc: []
            };
            lineHeight = tickFont.lineHeight;
            width = height = 0;
            if (!helpers_segment.isNullOrUndef(label) && !helpers_segment.isArray(label)) {
                width = helpers_segment._measureTe***REMOVED***t(ct***REMOVED***, cache.data, cache.gc, width, label);
                height = lineHeight;
            } else if (helpers_segment.isArray(label)) {
                for(j = 0, jlen = label.length; j < jlen; ++j){
                    nestedLabel =  label[j];
                    if (!helpers_segment.isNullOrUndef(nestedLabel) && !helpers_segment.isArray(nestedLabel)) {
                        width = helpers_segment._measureTe***REMOVED***t(ct***REMOVED***, cache.data, cache.gc, width, nestedLabel);
                        height += lineHeight;
                    }
                }
            }
            widths.push(width);
            heights.push(height);
            widestLabelSize = Math.ma***REMOVED***(width, widestLabelSize);
            highestLabelSize = Math.ma***REMOVED***(height, highestLabelSize);
        }
        garbageCollect(caches, length);
        const widest = widths.inde***REMOVED***Of(widestLabelSize);
        const highest = heights.inde***REMOVED***Of(highestLabelSize);
        const valueAt = (id***REMOVED***)=>({
                width: widths[id***REMOVED***] || 0,
                height: heights[id***REMOVED***] || 0
            });
        return {
            first: valueAt(0),
            last: valueAt(length - 1),
            widest: valueAt(widest),
            highest: valueAt(highest),
            widths,
            heights
        };
    }
 getLabelForValue(value) {
        return value;
    }
 getPi***REMOVED***elForValue(value, inde***REMOVED***) {
        return NaN;
    }
 getValueForPi***REMOVED***el(pi***REMOVED***el) {}
 getPi***REMOVED***elForTick(inde***REMOVED***) {
        const ticks = this.ticks;
        if (inde***REMOVED*** < 0 || inde***REMOVED*** > ticks.length - 1) {
            return null;
        }
        return this.getPi***REMOVED***elForValue(ticks[inde***REMOVED***].value);
    }
 getPi***REMOVED***elForDecimal(decimal) {
        if (this._reversePi***REMOVED***els) {
            decimal = 1 - decimal;
        }
        const pi***REMOVED***el = this._startPi***REMOVED***el + decimal * this._length;
        return helpers_segment._int16Range(this._alignToPi***REMOVED***els ? helpers_segment._alignPi***REMOVED***el(this.chart, pi***REMOVED***el, 0) : pi***REMOVED***el);
    }
 getDecimalForPi***REMOVED***el(pi***REMOVED***el) {
        const decimal = (pi***REMOVED***el - this._startPi***REMOVED***el) / this._length;
        return this._reversePi***REMOVED***els ? 1 - decimal : decimal;
    }
 getBasePi***REMOVED***el() {
        return this.getPi***REMOVED***elForValue(this.getBaseValue());
    }
 getBaseValue() {
        const { min , ma***REMOVED***  } = this;
        return min < 0 && ma***REMOVED*** < 0 ? ma***REMOVED*** : min > 0 && ma***REMOVED*** > 0 ? min : 0;
    }
 getConte***REMOVED***t(inde***REMOVED***) {
        const ticks = this.ticks || [];
        if (inde***REMOVED*** >= 0 && inde***REMOVED*** < ticks.length) {
            const tick = ticks[inde***REMOVED***];
            return tick.$conte***REMOVED***t || (tick.$conte***REMOVED***t = createTickConte***REMOVED***t(this.getConte***REMOVED***t(), inde***REMOVED***, tick));
        }
        return this.$conte***REMOVED***t || (this.$conte***REMOVED***t = createScaleConte***REMOVED***t(this.chart.getConte***REMOVED***t(), this));
    }
 _tickSize() {
        const optionTicks = this.options.ticks;
        const rot = helpers_segment.toRadians(this.labelRotation);
        const cos = Math.abs(Math.cos(rot));
        const sin = Math.abs(Math.sin(rot));
        const labelSizes = this._getLabelSizes();
        const padding = optionTicks.autoSkipPadding || 0;
        const w = labelSizes ? labelSizes.widest.width + padding : 0;
        const h = labelSizes ? labelSizes.highest.height + padding : 0;
        return this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
    }
 _isVisible() {
        const display = this.options.display;
        if (display !== 'auto') {
            return !!display;
        }
        return this.getMatchingVisibleMetas().length > 0;
    }
 _computeGridLineItems(chartArea) {
        const a***REMOVED***is = this.a***REMOVED***is;
        const chart = this.chart;
        const options = this.options;
        const { grid , position , border  } = options;
        const offset = grid.offset;
        const isHorizontal = this.isHorizontal();
        const ticks = this.ticks;
        const ticksLength = ticks.length + (offset ? 1 : 0);
        const tl = getTickMarkLength(grid);
        const items = [];
        const borderOpts = border.setConte***REMOVED***t(this.getConte***REMOVED***t());
        const a***REMOVED***isWidth = borderOpts.display ? borderOpts.width : 0;
        const a***REMOVED***isHalfWidth = a***REMOVED***isWidth / 2;
        const alignBorderValue = function(pi***REMOVED***el) {
            return helpers_segment._alignPi***REMOVED***el(chart, pi***REMOVED***el, a***REMOVED***isWidth);
        };
        let borderValue, i, lineValue, alignedLineValue;
        let t***REMOVED***1, ty1, t***REMOVED***2, ty2, ***REMOVED***1, y1, ***REMOVED***2, y2;
        if (position === 'top') {
            borderValue = alignBorderValue(this.bottom);
            ty1 = this.bottom - tl;
            ty2 = borderValue - a***REMOVED***isHalfWidth;
            y1 = alignBorderValue(chartArea.top) + a***REMOVED***isHalfWidth;
            y2 = chartArea.bottom;
        } else if (position === 'bottom') {
            borderValue = alignBorderValue(this.top);
            y1 = chartArea.top;
            y2 = alignBorderValue(chartArea.bottom) - a***REMOVED***isHalfWidth;
            ty1 = borderValue + a***REMOVED***isHalfWidth;
            ty2 = this.top + tl;
        } else if (position === 'left') {
            borderValue = alignBorderValue(this.right);
            t***REMOVED***1 = this.right - tl;
            t***REMOVED***2 = borderValue - a***REMOVED***isHalfWidth;
            ***REMOVED***1 = alignBorderValue(chartArea.left) + a***REMOVED***isHalfWidth;
            ***REMOVED***2 = chartArea.right;
        } else if (position === 'right') {
            borderValue = alignBorderValue(this.left);
            ***REMOVED***1 = chartArea.left;
            ***REMOVED***2 = alignBorderValue(chartArea.right) - a***REMOVED***isHalfWidth;
            t***REMOVED***1 = borderValue + a***REMOVED***isHalfWidth;
            t***REMOVED***2 = this.left + tl;
        } else if (a***REMOVED***is === '***REMOVED***') {
            if (position === 'center') {
                borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
            } else if (helpers_segment.isObject(position)) {
                const positionA***REMOVED***isID = Object.keys(position)[0];
                const value = position[positionA***REMOVED***isID];
                borderValue = alignBorderValue(this.chart.scales[positionA***REMOVED***isID].getPi***REMOVED***elForValue(value));
            }
            y1 = chartArea.top;
            y2 = chartArea.bottom;
            ty1 = borderValue + a***REMOVED***isHalfWidth;
            ty2 = ty1 + tl;
        } else if (a***REMOVED***is === 'y') {
            if (position === 'center') {
                borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
            } else if (helpers_segment.isObject(position)) {
                const positionA***REMOVED***isID = Object.keys(position)[0];
                const value = position[positionA***REMOVED***isID];
                borderValue = alignBorderValue(this.chart.scales[positionA***REMOVED***isID].getPi***REMOVED***elForValue(value));
            }
            t***REMOVED***1 = borderValue - a***REMOVED***isHalfWidth;
            t***REMOVED***2 = t***REMOVED***1 - tl;
            ***REMOVED***1 = chartArea.left;
            ***REMOVED***2 = chartArea.right;
        }
        const limit = helpers_segment.valueOrDefault(options.ticks.ma***REMOVED***TicksLimit, ticksLength);
        const step = Math.ma***REMOVED***(1, Math.ceil(ticksLength / limit));
        for(i = 0; i < ticksLength; i += step){
            const conte***REMOVED***t = this.getConte***REMOVED***t(i);
            const optsAtInde***REMOVED*** = grid.setConte***REMOVED***t(conte***REMOVED***t);
            const optsAtInde***REMOVED***Border = border.setConte***REMOVED***t(conte***REMOVED***t);
            const lineWidth = optsAtInde***REMOVED***.lineWidth;
            const lineColor = optsAtInde***REMOVED***.color;
            const borderDash = optsAtInde***REMOVED***Border.dash || [];
            const borderDashOffset = optsAtInde***REMOVED***Border.dashOffset;
            const tickWidth = optsAtInde***REMOVED***.tickWidth;
            const tickColor = optsAtInde***REMOVED***.tickColor;
            const tickBorderDash = optsAtInde***REMOVED***.tickBorderDash || [];
            const tickBorderDashOffset = optsAtInde***REMOVED***.tickBorderDashOffset;
            lineValue = getPi***REMOVED***elForGridLine(this, i, offset);
            if (lineValue === undefined) {
                continue;
            }
            alignedLineValue = helpers_segment._alignPi***REMOVED***el(chart, lineValue, lineWidth);
            if (isHorizontal) {
                t***REMOVED***1 = t***REMOVED***2 = ***REMOVED***1 = ***REMOVED***2 = alignedLineValue;
            } else {
                ty1 = ty2 = y1 = y2 = alignedLineValue;
            }
            items.push({
                t***REMOVED***1,
                ty1,
                t***REMOVED***2,
                ty2,
                ***REMOVED***1,
                y1,
                ***REMOVED***2,
                y2,
                width: lineWidth,
                color: lineColor,
                borderDash,
                borderDashOffset,
                tickWidth,
                tickColor,
                tickBorderDash,
                tickBorderDashOffset
            });
        }
        this._ticksLength = ticksLength;
        this._borderValue = borderValue;
        return items;
    }
 _computeLabelItems(chartArea) {
        const a***REMOVED***is = this.a***REMOVED***is;
        const options = this.options;
        const { position , ticks: optionTicks  } = options;
        const isHorizontal = this.isHorizontal();
        const ticks = this.ticks;
        const { align , crossAlign , padding , mirror  } = optionTicks;
        const tl = getTickMarkLength(options.grid);
        const tickAndPadding = tl + padding;
        const hTickAndPadding = mirror ? -padding : tickAndPadding;
        const rotation = -helpers_segment.toRadians(this.labelRotation);
        const items = [];
        let i, ilen, tick, label, ***REMOVED***, y, te***REMOVED***tAlign, pi***REMOVED***el, font, lineHeight, lineCount, te***REMOVED***tOffset;
        let te***REMOVED***tBaseline = 'middle';
        if (position === 'top') {
            y = this.bottom - hTickAndPadding;
            te***REMOVED***tAlign = this._getXA***REMOVED***isLabelAlignment();
        } else if (position === 'bottom') {
            y = this.top + hTickAndPadding;
            te***REMOVED***tAlign = this._getXA***REMOVED***isLabelAlignment();
        } else if (position === 'left') {
            const ret = this._getYA***REMOVED***isLabelAlignment(tl);
            te***REMOVED***tAlign = ret.te***REMOVED***tAlign;
            ***REMOVED*** = ret.***REMOVED***;
        } else if (position === 'right') {
            const ret = this._getYA***REMOVED***isLabelAlignment(tl);
            te***REMOVED***tAlign = ret.te***REMOVED***tAlign;
            ***REMOVED*** = ret.***REMOVED***;
        } else if (a***REMOVED***is === '***REMOVED***') {
            if (position === 'center') {
                y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
            } else if (helpers_segment.isObject(position)) {
                const positionA***REMOVED***isID = Object.keys(position)[0];
                const value = position[positionA***REMOVED***isID];
                y = this.chart.scales[positionA***REMOVED***isID].getPi***REMOVED***elForValue(value) + tickAndPadding;
            }
            te***REMOVED***tAlign = this._getXA***REMOVED***isLabelAlignment();
        } else if (a***REMOVED***is === 'y') {
            if (position === 'center') {
                ***REMOVED*** = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
            } else if (helpers_segment.isObject(position)) {
                const positionA***REMOVED***isID = Object.keys(position)[0];
                const value = position[positionA***REMOVED***isID];
                ***REMOVED*** = this.chart.scales[positionA***REMOVED***isID].getPi***REMOVED***elForValue(value);
            }
            te***REMOVED***tAlign = this._getYA***REMOVED***isLabelAlignment(tl).te***REMOVED***tAlign;
        }
        if (a***REMOVED***is === 'y') {
            if (align === 'start') {
                te***REMOVED***tBaseline = 'top';
            } else if (align === 'end') {
                te***REMOVED***tBaseline = 'bottom';
            }
        }
        const labelSizes = this._getLabelSizes();
        for(i = 0, ilen = ticks.length; i < ilen; ++i){
            tick = ticks[i];
            label = tick.label;
            const optsAtInde***REMOVED*** = optionTicks.setConte***REMOVED***t(this.getConte***REMOVED***t(i));
            pi***REMOVED***el = this.getPi***REMOVED***elForTick(i) + optionTicks.labelOffset;
            font = this._resolveTickFontOptions(i);
            lineHeight = font.lineHeight;
            lineCount = helpers_segment.isArray(label) ? label.length : 1;
            const halfCount = lineCount / 2;
            const color = optsAtInde***REMOVED***.color;
            const strokeColor = optsAtInde***REMOVED***.te***REMOVED***tStrokeColor;
            const strokeWidth = optsAtInde***REMOVED***.te***REMOVED***tStrokeWidth;
            let tickTe***REMOVED***tAlign = te***REMOVED***tAlign;
            if (isHorizontal) {
                ***REMOVED*** = pi***REMOVED***el;
                if (te***REMOVED***tAlign === 'inner') {
                    if (i === ilen - 1) {
                        tickTe***REMOVED***tAlign = !this.options.reverse ? 'right' : 'left';
                    } else if (i === 0) {
                        tickTe***REMOVED***tAlign = !this.options.reverse ? 'left' : 'right';
                    } else {
                        tickTe***REMOVED***tAlign = 'center';
                    }
                }
                if (position === 'top') {
                    if (crossAlign === 'near' || rotation !== 0) {
                        te***REMOVED***tOffset = -lineCount * lineHeight + lineHeight / 2;
                    } else if (crossAlign === 'center') {
                        te***REMOVED***tOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
                    } else {
                        te***REMOVED***tOffset = -labelSizes.highest.height + lineHeight / 2;
                    }
                } else {
                    if (crossAlign === 'near' || rotation !== 0) {
                        te***REMOVED***tOffset = lineHeight / 2;
                    } else if (crossAlign === 'center') {
                        te***REMOVED***tOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
                    } else {
                        te***REMOVED***tOffset = labelSizes.highest.height - lineCount * lineHeight;
                    }
                }
                if (mirror) {
                    te***REMOVED***tOffset *= -1;
                }
                if (rotation !== 0 && !optsAtInde***REMOVED***.showLabelBackdrop) {
                    ***REMOVED*** += lineHeight / 2 * Math.sin(rotation);
                }
            } else {
                y = pi***REMOVED***el;
                te***REMOVED***tOffset = (1 - lineCount) * lineHeight / 2;
            }
            let backdrop;
            if (optsAtInde***REMOVED***.showLabelBackdrop) {
                const labelPadding = helpers_segment.toPadding(optsAtInde***REMOVED***.backdropPadding);
                const height = labelSizes.heights[i];
                const width = labelSizes.widths[i];
                let top = te***REMOVED***tOffset - labelPadding.top;
                let left = 0 - labelPadding.left;
                switch(te***REMOVED***tBaseline){
                    case 'middle':
                        top -= height / 2;
                        break;
                    case 'bottom':
                        top -= height;
                        break;
                }
                switch(te***REMOVED***tAlign){
                    case 'center':
                        left -= width / 2;
                        break;
                    case 'right':
                        left -= width;
                        break;
                    case 'inner':
                        if (i === ilen - 1) {
                            left -= width;
                        } else if (i > 0) {
                            left -= width / 2;
                        }
                        break;
                }
                backdrop = {
                    left,
                    top,
                    width: width + labelPadding.width,
                    height: height + labelPadding.height,
                    color: optsAtInde***REMOVED***.backdropColor
                };
            }
            items.push({
                label,
                font,
                te***REMOVED***tOffset,
                options: {
                    rotation,
                    color,
                    strokeColor,
                    strokeWidth,
                    te***REMOVED***tAlign: tickTe***REMOVED***tAlign,
                    te***REMOVED***tBaseline,
                    translation: [
                        ***REMOVED***,
                        y
                    ],
                    backdrop
                }
            });
        }
        return items;
    }
    _getXA***REMOVED***isLabelAlignment() {
        const { position , ticks  } = this.options;
        const rotation = -helpers_segment.toRadians(this.labelRotation);
        if (rotation) {
            return position === 'top' ? 'left' : 'right';
        }
        let align = 'center';
        if (ticks.align === 'start') {
            align = 'left';
        } else if (ticks.align === 'end') {
            align = 'right';
        } else if (ticks.align === 'inner') {
            align = 'inner';
        }
        return align;
    }
    _getYA***REMOVED***isLabelAlignment(tl) {
        const { position , ticks: { crossAlign , mirror , padding  }  } = this.options;
        const labelSizes = this._getLabelSizes();
        const tickAndPadding = tl + padding;
        const widest = labelSizes.widest.width;
        let te***REMOVED***tAlign;
        let ***REMOVED***;
        if (position === 'left') {
            if (mirror) {
                ***REMOVED*** = this.right + padding;
                if (crossAlign === 'near') {
                    te***REMOVED***tAlign = 'left';
                } else if (crossAlign === 'center') {
                    te***REMOVED***tAlign = 'center';
                    ***REMOVED*** += widest / 2;
                } else {
                    te***REMOVED***tAlign = 'right';
                    ***REMOVED*** += widest;
                }
            } else {
                ***REMOVED*** = this.right - tickAndPadding;
                if (crossAlign === 'near') {
                    te***REMOVED***tAlign = 'right';
                } else if (crossAlign === 'center') {
                    te***REMOVED***tAlign = 'center';
                    ***REMOVED*** -= widest / 2;
                } else {
                    te***REMOVED***tAlign = 'left';
                    ***REMOVED*** = this.left;
                }
            }
        } else if (position === 'right') {
            if (mirror) {
                ***REMOVED*** = this.left + padding;
                if (crossAlign === 'near') {
                    te***REMOVED***tAlign = 'right';
                } else if (crossAlign === 'center') {
                    te***REMOVED***tAlign = 'center';
                    ***REMOVED*** -= widest / 2;
                } else {
                    te***REMOVED***tAlign = 'left';
                    ***REMOVED*** -= widest;
                }
            } else {
                ***REMOVED*** = this.left + tickAndPadding;
                if (crossAlign === 'near') {
                    te***REMOVED***tAlign = 'left';
                } else if (crossAlign === 'center') {
                    te***REMOVED***tAlign = 'center';
                    ***REMOVED*** += widest / 2;
                } else {
                    te***REMOVED***tAlign = 'right';
                    ***REMOVED*** = this.right;
                }
            }
        } else {
            te***REMOVED***tAlign = 'right';
        }
        return {
            te***REMOVED***tAlign,
            ***REMOVED***
        };
    }
 _computeLabelArea() {
        if (this.options.ticks.mirror) {
            return;
        }
        const chart = this.chart;
        const position = this.options.position;
        if (position === 'left' || position === 'right') {
            return {
                top: 0,
                left: this.left,
                bottom: chart.height,
                right: this.right
            };
        }
        if (position === 'top' || position === 'bottom') {
            return {
                top: this.top,
                left: 0,
                bottom: this.bottom,
                right: chart.width
            };
        }
    }
 drawBackground() {
        const { ct***REMOVED*** , options: { backgroundColor  } , left , top , width , height  } = this;
        if (backgroundColor) {
            ct***REMOVED***.save();
            ct***REMOVED***.fillStyle = backgroundColor;
            ct***REMOVED***.fillRect(left, top, width, height);
            ct***REMOVED***.restore();
        }
    }
    getLineWidthForValue(value) {
        const grid = this.options.grid;
        if (!this._isVisible() || !grid.display) {
            return 0;
        }
        const ticks = this.ticks;
        const inde***REMOVED*** = ticks.findInde***REMOVED***((t)=>t.value === value);
        if (inde***REMOVED*** >= 0) {
            const opts = grid.setConte***REMOVED***t(this.getConte***REMOVED***t(inde***REMOVED***));
            return opts.lineWidth;
        }
        return 0;
    }
 drawGrid(chartArea) {
        const grid = this.options.grid;
        const ct***REMOVED*** = this.ct***REMOVED***;
        const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
        let i, ilen;
        const drawLine = (p1, p2, style)=>{
            if (!style.width || !style.color) {
                return;
            }
            ct***REMOVED***.save();
            ct***REMOVED***.lineWidth = style.width;
            ct***REMOVED***.strokeStyle = style.color;
            ct***REMOVED***.setLineDash(style.borderDash || []);
            ct***REMOVED***.lineDashOffset = style.borderDashOffset;
            ct***REMOVED***.beginPath();
            ct***REMOVED***.moveTo(p1.***REMOVED***, p1.y);
            ct***REMOVED***.lineTo(p2.***REMOVED***, p2.y);
            ct***REMOVED***.stroke();
            ct***REMOVED***.restore();
        };
        if (grid.display) {
            for(i = 0, ilen = items.length; i < ilen; ++i){
                const item = items[i];
                if (grid.drawOnChartArea) {
                    drawLine({
                        ***REMOVED***: item.***REMOVED***1,
                        y: item.y1
                    }, {
                        ***REMOVED***: item.***REMOVED***2,
                        y: item.y2
                    }, item);
                }
                if (grid.drawTicks) {
                    drawLine({
                        ***REMOVED***: item.t***REMOVED***1,
                        y: item.ty1
                    }, {
                        ***REMOVED***: item.t***REMOVED***2,
                        y: item.ty2
                    }, {
                        color: item.tickColor,
                        width: item.tickWidth,
                        borderDash: item.tickBorderDash,
                        borderDashOffset: item.tickBorderDashOffset
                    });
                }
            }
        }
    }
 drawBorder() {
        const { chart , ct***REMOVED*** , options: { border , grid  }  } = this;
        const borderOpts = border.setConte***REMOVED***t(this.getConte***REMOVED***t());
        const a***REMOVED***isWidth = border.display ? borderOpts.width : 0;
        if (!a***REMOVED***isWidth) {
            return;
        }
        const lastLineWidth = grid.setConte***REMOVED***t(this.getConte***REMOVED***t(0)).lineWidth;
        const borderValue = this._borderValue;
        let ***REMOVED***1, ***REMOVED***2, y1, y2;
        if (this.isHorizontal()) {
            ***REMOVED***1 = helpers_segment._alignPi***REMOVED***el(chart, this.left, a***REMOVED***isWidth) - a***REMOVED***isWidth / 2;
            ***REMOVED***2 = helpers_segment._alignPi***REMOVED***el(chart, this.right, lastLineWidth) + lastLineWidth / 2;
            y1 = y2 = borderValue;
        } else {
            y1 = helpers_segment._alignPi***REMOVED***el(chart, this.top, a***REMOVED***isWidth) - a***REMOVED***isWidth / 2;
            y2 = helpers_segment._alignPi***REMOVED***el(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
            ***REMOVED***1 = ***REMOVED***2 = borderValue;
        }
        ct***REMOVED***.save();
        ct***REMOVED***.lineWidth = borderOpts.width;
        ct***REMOVED***.strokeStyle = borderOpts.color;
        ct***REMOVED***.beginPath();
        ct***REMOVED***.moveTo(***REMOVED***1, y1);
        ct***REMOVED***.lineTo(***REMOVED***2, y2);
        ct***REMOVED***.stroke();
        ct***REMOVED***.restore();
    }
 drawLabels(chartArea) {
        const optionTicks = this.options.ticks;
        if (!optionTicks.display) {
            return;
        }
        const ct***REMOVED*** = this.ct***REMOVED***;
        const area = this._computeLabelArea();
        if (area) {
            helpers_segment.clipArea(ct***REMOVED***, area);
        }
        const items = this.getLabelItems(chartArea);
        for (const item of items){
            const renderTe***REMOVED***tOptions = item.options;
            const tickFont = item.font;
            const label = item.label;
            const y = item.te***REMOVED***tOffset;
            helpers_segment.renderTe***REMOVED***t(ct***REMOVED***, label, 0, y, tickFont, renderTe***REMOVED***tOptions);
        }
        if (area) {
            helpers_segment.unclipArea(ct***REMOVED***);
        }
    }
 drawTitle() {
        const { ct***REMOVED*** , options: { position , title , reverse  }  } = this;
        if (!title.display) {
            return;
        }
        const font = helpers_segment.toFont(title.font);
        const padding = helpers_segment.toPadding(title.padding);
        const align = title.align;
        let offset = font.lineHeight / 2;
        if (position === 'bottom' || position === 'center' || helpers_segment.isObject(position)) {
            offset += padding.bottom;
            if (helpers_segment.isArray(title.te***REMOVED***t)) {
                offset += font.lineHeight * (title.te***REMOVED***t.length - 1);
            }
        } else {
            offset += padding.top;
        }
        const { titleX , titleY , ma***REMOVED***Width , rotation  } = titleArgs(this, offset, position, align);
        helpers_segment.renderTe***REMOVED***t(ct***REMOVED***, title.te***REMOVED***t, 0, 0, font, {
            color: title.color,
            ma***REMOVED***Width,
            rotation,
            te***REMOVED***tAlign: titleAlign(align, position, reverse),
            te***REMOVED***tBaseline: 'middle',
            translation: [
                titleX,
                titleY
            ]
        });
    }
    draw(chartArea) {
        if (!this._isVisible()) {
            return;
        }
        this.drawBackground();
        this.drawGrid(chartArea);
        this.drawBorder();
        this.drawTitle();
        this.drawLabels(chartArea);
    }
 _layers() {
        const opts = this.options;
        const tz = opts.ticks && opts.ticks.z || 0;
        const gz = helpers_segment.valueOrDefault(opts.grid && opts.grid.z, -1);
        const bz = helpers_segment.valueOrDefault(opts.border && opts.border.z, 0);
        if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
            return [
                {
                    z: tz,
                    draw: (chartArea)=>{
                        this.draw(chartArea);
                    }
                }
            ];
        }
        return [
            {
                z: gz,
                draw: (chartArea)=>{
                    this.drawBackground();
                    this.drawGrid(chartArea);
                    this.drawTitle();
                }
            },
            {
                z: bz,
                draw: ()=>{
                    this.drawBorder();
                }
            },
            {
                z: tz,
                draw: (chartArea)=>{
                    this.drawLabels(chartArea);
                }
            }
        ];
    }
 getMatchingVisibleMetas(type) {
        const metas = this.chart.getSortedVisibleDatasetMetas();
        const a***REMOVED***isID = this.a***REMOVED***is + 'A***REMOVED***isID';
        const result = [];
        let i, ilen;
        for(i = 0, ilen = metas.length; i < ilen; ++i){
            const meta = metas[i];
            if (meta[a***REMOVED***isID] === this.id && (!type || meta.type === type)) {
                result.push(meta);
            }
        }
        return result;
    }
 _resolveTickFontOptions(inde***REMOVED***) {
        const opts = this.options.ticks.setConte***REMOVED***t(this.getConte***REMOVED***t(inde***REMOVED***));
        return helpers_segment.toFont(opts.font);
    }
 _ma***REMOVED***Digits() {
        const fontSize = this._resolveTickFontOptions(0).lineHeight;
        return (this.isHorizontal() ? this.width : this.height) / fontSize;
    }
}

class TypedRegistry {
    constructor(type, scope, override){
        this.type = type;
        this.scope = scope;
        this.override = override;
        this.items = Object.create(null);
    }
    isForType(type) {
        return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
    }
 register(item) {
        const proto = Object.getPrototypeOf(item);
        let parentScope;
        if (isIChartComponent(proto)) {
            parentScope = this.register(proto);
        }
        const items = this.items;
        const id = item.id;
        const scope = this.scope + '.' + id;
        if (!id) {
            throw new Error('class does not have id: ' + item);
        }
        if (id in items) {
            return scope;
        }
        items[id] = item;
        registerDefaults(item, scope, parentScope);
        if (this.override) {
            helpers_segment.defaults.override(item.id, item.overrides);
        }
        return scope;
    }
 get(id) {
        return this.items[id];
    }
 unregister(item) {
        const items = this.items;
        const id = item.id;
        const scope = this.scope;
        if (id in items) {
            delete items[id];
        }
        if (scope && id in helpers_segment.defaults[scope]) {
            delete helpers_segment.defaults[scope][id];
            if (this.override) {
                delete helpers_segment.overrides[id];
            }
        }
    }
}
function registerDefaults(item, scope, parentScope) {
    const itemDefaults = helpers_segment.merge(Object.create(null), [
        parentScope ? helpers_segment.defaults.get(parentScope) : {},
        helpers_segment.defaults.get(scope),
        item.defaults
    ]);
    helpers_segment.defaults.set(scope, itemDefaults);
    if (item.defaultRoutes) {
        routeDefaults(scope, item.defaultRoutes);
    }
    if (item.descriptors) {
        helpers_segment.defaults.describe(scope, item.descriptors);
    }
}
function routeDefaults(scope, routes) {
    Object.keys(routes).forEach((property)=>{
        const propertyParts = property.split('.');
        const sourceName = propertyParts.pop();
        const sourceScope = [
            scope
        ].concat(propertyParts).join('.');
        const parts = routes[property].split('.');
        const targetName = parts.pop();
        const targetScope = parts.join('.');
        helpers_segment.defaults.route(sourceScope, sourceName, targetScope, targetName);
    });
}
function isIChartComponent(proto) {
    return 'id' in proto && 'defaults' in proto;
}

class Registry {
    constructor(){
        this.controllers = new TypedRegistry(DatasetController, 'datasets', true);
        this.elements = new TypedRegistry(Element, 'elements');
        this.plugins = new TypedRegistry(Object, 'plugins');
        this.scales = new TypedRegistry(Scale, 'scales');
        this._typedRegistries = [
            this.controllers,
            this.scales,
            this.elements
        ];
    }
 add(...args) {
        this._each('register', args);
    }
    remove(...args) {
        this._each('unregister', args);
    }
 addControllers(...args) {
        this._each('register', args, this.controllers);
    }
 addElements(...args) {
        this._each('register', args, this.elements);
    }
 addPlugins(...args) {
        this._each('register', args, this.plugins);
    }
 addScales(...args) {
        this._each('register', args, this.scales);
    }
 getController(id) {
        return this._get(id, this.controllers, 'controller');
    }
 getElement(id) {
        return this._get(id, this.elements, 'element');
    }
 getPlugin(id) {
        return this._get(id, this.plugins, 'plugin');
    }
 getScale(id) {
        return this._get(id, this.scales, 'scale');
    }
 removeControllers(...args) {
        this._each('unregister', args, this.controllers);
    }
 removeElements(...args) {
        this._each('unregister', args, this.elements);
    }
 removePlugins(...args) {
        this._each('unregister', args, this.plugins);
    }
 removeScales(...args) {
        this._each('unregister', args, this.scales);
    }
 _each(method, args, typedRegistry) {
        [
            ...args
        ].forEach((arg)=>{
            const reg = typedRegistry || this._getRegistryForType(arg);
            if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
                this._e***REMOVED***ec(method, reg, arg);
            } else {
                helpers_segment.each(arg, (item)=>{
                    const itemReg = typedRegistry || this._getRegistryForType(item);
                    this._e***REMOVED***ec(method, itemReg, item);
                });
            }
        });
    }
 _e***REMOVED***ec(method, registry, component) {
        const camelMethod = helpers_segment._capitalize(method);
        helpers_segment.callback(component['before' + camelMethod], [], component);
        registry[method](component);
        helpers_segment.callback(component['after' + camelMethod], [], component);
    }
 _getRegistryForType(type) {
        for(let i = 0; i < this._typedRegistries.length; i++){
            const reg = this._typedRegistries[i];
            if (reg.isForType(type)) {
                return reg;
            }
        }
        return this.plugins;
    }
 _get(id, typedRegistry, type) {
        const item = typedRegistry.get(id);
        if (item === undefined) {
            throw new Error('"' + id + '" is not a registered ' + type + '.');
        }
        return item;
    }
}
var registry = /* #__PURE__ */ new Registry();

class PluginService {
    constructor(){
        this._init = [];
    }
 notify(chart, hook, args, filter) {
        if (hook === 'beforeInit') {
            this._init = this._createDescriptors(chart, true);
            this._notify(this._init, chart, 'install');
        }
        const descriptors = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
        const result = this._notify(descriptors, chart, hook, args);
        if (hook === 'afterDestroy') {
            this._notify(descriptors, chart, 'stop');
            this._notify(this._init, chart, 'uninstall');
        }
        return result;
    }
 _notify(descriptors, chart, hook, args) {
        args = args || {};
        for (const descriptor of descriptors){
            const plugin = descriptor.plugin;
            const method = plugin[hook];
            const params = [
                chart,
                args,
                descriptor.options
            ];
            if (helpers_segment.callback(method, params, plugin) === false && args.cancelable) {
                return false;
            }
        }
        return true;
    }
    invalidate() {
        if (!helpers_segment.isNullOrUndef(this._cache)) {
            this._oldCache = this._cache;
            this._cache = undefined;
        }
    }
 _descriptors(chart) {
        if (this._cache) {
            return this._cache;
        }
        const descriptors = this._cache = this._createDescriptors(chart);
        this._notifyStateChanges(chart);
        return descriptors;
    }
    _createDescriptors(chart, all) {
        const config = chart && chart.config;
        const options = helpers_segment.valueOrDefault(config.options && config.options.plugins, {});
        const plugins = allPlugins(config);
        return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
    }
 _notifyStateChanges(chart) {
        const previousDescriptors = this._oldCache || [];
        const descriptors = this._cache;
        const diff = (a, b)=>a.filter((***REMOVED***)=>!b.some((y)=>***REMOVED***.plugin.id === y.plugin.id));
        this._notify(diff(previousDescriptors, descriptors), chart, 'stop');
        this._notify(diff(descriptors, previousDescriptors), chart, 'start');
    }
}
 function allPlugins(config) {
    const localIds = {};
    const plugins = [];
    const keys = Object.keys(registry.plugins.items);
    for(let i = 0; i < keys.length; i++){
        plugins.push(registry.getPlugin(keys[i]));
    }
    const local = config.plugins || [];
    for(let i = 0; i < local.length; i++){
        const plugin = local[i];
        if (plugins.inde***REMOVED***Of(plugin) === -1) {
            plugins.push(plugin);
            localIds[plugin.id] = true;
        }
    }
    return {
        plugins,
        localIds
    };
}
function getOpts(options, all) {
    if (!all && options === false) {
        return null;
    }
    if (options === true) {
        return {};
    }
    return options;
}
function createDescriptors(chart, { plugins , localIds  }, options, all) {
    const result = [];
    const conte***REMOVED***t = chart.getConte***REMOVED***t();
    for (const plugin of plugins){
        const id = plugin.id;
        const opts = getOpts(options[id], all);
        if (opts === null) {
            continue;
        }
        result.push({
            plugin,
            options: pluginOpts(chart.config, {
                plugin,
                local: localIds[id]
            }, opts, conte***REMOVED***t)
        });
    }
    return result;
}
function pluginOpts(config, { plugin , local  }, opts, conte***REMOVED***t) {
    const keys = config.pluginScopeKeys(plugin);
    const scopes = config.getOptionScopes(opts, keys);
    if (local && plugin.defaults) {
        scopes.push(plugin.defaults);
    }
    return config.createResolver(scopes, conte***REMOVED***t, [
        ''
    ], {
        scriptable: false,
        inde***REMOVED***able: false,
        allKeys: true
    });
}

function getInde***REMOVED***A***REMOVED***is(type, options) {
    const datasetDefaults = helpers_segment.defaults.datasets[type] || {};
    const datasetOptions = (options.datasets || {})[type] || {};
    return datasetOptions.inde***REMOVED***A***REMOVED***is || options.inde***REMOVED***A***REMOVED***is || datasetDefaults.inde***REMOVED***A***REMOVED***is || '***REMOVED***';
}
function getA***REMOVED***isFromDefaultScaleID(id, inde***REMOVED***A***REMOVED***is) {
    let a***REMOVED***is = id;
    if (id === '_inde***REMOVED***_') {
        a***REMOVED***is = inde***REMOVED***A***REMOVED***is;
    } else if (id === '_value_') {
        a***REMOVED***is = inde***REMOVED***A***REMOVED***is === '***REMOVED***' ? 'y' : '***REMOVED***';
    }
    return a***REMOVED***is;
}
function getDefaultScaleIDFromA***REMOVED***is(a***REMOVED***is, inde***REMOVED***A***REMOVED***is) {
    return a***REMOVED***is === inde***REMOVED***A***REMOVED***is ? '_inde***REMOVED***_' : '_value_';
}
function idMatchesA***REMOVED***is(id) {
    if (id === '***REMOVED***' || id === 'y' || id === 'r') {
        return id;
    }
}
function a***REMOVED***isFromPosition(position) {
    if (position === 'top' || position === 'bottom') {
        return '***REMOVED***';
    }
    if (position === 'left' || position === 'right') {
        return 'y';
    }
}
function determineA***REMOVED***is(id, ...scaleOptions) {
    if (idMatchesA***REMOVED***is(id)) {
        return id;
    }
    for (const opts of scaleOptions){
        const a***REMOVED***is = opts.a***REMOVED***is || a***REMOVED***isFromPosition(opts.position) || id.length > 1 && idMatchesA***REMOVED***is(id[0].toLowerCase());
        if (a***REMOVED***is) {
            return a***REMOVED***is;
        }
    }
    throw new Error(`Cannot determine type of '${id}' a***REMOVED***is. Please provide 'a***REMOVED***is' or 'position' option.`);
}
function getA***REMOVED***isFromDataset(id, a***REMOVED***is, dataset) {
    if (dataset[a***REMOVED***is + 'A***REMOVED***isID'] === id) {
        return {
            a***REMOVED***is
        };
    }
}
function retrieveA***REMOVED***isFromDatasets(id, config) {
    if (config.data && config.data.datasets) {
        const boundDs = config.data.datasets.filter((d)=>d.***REMOVED***A***REMOVED***isID === id || d.yA***REMOVED***isID === id);
        if (boundDs.length) {
            return getA***REMOVED***isFromDataset(id, '***REMOVED***', boundDs[0]) || getA***REMOVED***isFromDataset(id, 'y', boundDs[0]);
        }
    }
    return {};
}
function mergeScaleConfig(config, options) {
    const chartDefaults = helpers_segment.overrides[config.type] || {
        scales: {}
    };
    const configScales = options.scales || {};
    const chartInde***REMOVED***A***REMOVED***is = getInde***REMOVED***A***REMOVED***is(config.type, options);
    const scales = Object.create(null);
    Object.keys(configScales).forEach((id)=>{
        const scaleConf = configScales[id];
        if (!helpers_segment.isObject(scaleConf)) {
            return console.error(`Invalid scale configuration for scale: ${id}`);
        }
        if (scaleConf._pro***REMOVED***y) {
            return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
        }
        const a***REMOVED***is = determineA***REMOVED***is(id, scaleConf, retrieveA***REMOVED***isFromDatasets(id, config), helpers_segment.defaults.scales[scaleConf.type]);
        const defaultId = getDefaultScaleIDFromA***REMOVED***is(a***REMOVED***is, chartInde***REMOVED***A***REMOVED***is);
        const defaultScaleOptions = chartDefaults.scales || {};
        scales[id] = helpers_segment.mergeIf(Object.create(null), [
            {
                a***REMOVED***is
            },
            scaleConf,
            defaultScaleOptions[a***REMOVED***is],
            defaultScaleOptions[defaultId]
        ]);
    });
    config.data.datasets.forEach((dataset)=>{
        const type = dataset.type || config.type;
        const inde***REMOVED***A***REMOVED***is = dataset.inde***REMOVED***A***REMOVED***is || getInde***REMOVED***A***REMOVED***is(type, options);
        const datasetDefaults = helpers_segment.overrides[type] || {};
        const defaultScaleOptions = datasetDefaults.scales || {};
        Object.keys(defaultScaleOptions).forEach((defaultID)=>{
            const a***REMOVED***is = getA***REMOVED***isFromDefaultScaleID(defaultID, inde***REMOVED***A***REMOVED***is);
            const id = dataset[a***REMOVED***is + 'A***REMOVED***isID'] || a***REMOVED***is;
            scales[id] = scales[id] || Object.create(null);
            helpers_segment.mergeIf(scales[id], [
                {
                    a***REMOVED***is
                },
                configScales[id],
                defaultScaleOptions[defaultID]
            ]);
        });
    });
    Object.keys(scales).forEach((key)=>{
        const scale = scales[key];
        helpers_segment.mergeIf(scale, [
            helpers_segment.defaults.scales[scale.type],
            helpers_segment.defaults.scale
        ]);
    });
    return scales;
}
function initOptions(config) {
    const options = config.options || (config.options = {});
    options.plugins = helpers_segment.valueOrDefault(options.plugins, {});
    options.scales = mergeScaleConfig(config, options);
}
function initData(data) {
    data = data || {};
    data.datasets = data.datasets || [];
    data.labels = data.labels || [];
    return data;
}
function initConfig(config) {
    config = config || {};
    config.data = initData(config.data);
    initOptions(config);
    return config;
}
const keyCache = new Map();
const keysCached = new Set();
function cachedKeys(cacheKey, generate) {
    let keys = keyCache.get(cacheKey);
    if (!keys) {
        keys = generate();
        keyCache.set(cacheKey, keys);
        keysCached.add(keys);
    }
    return keys;
}
const addIfFound = (set, obj, key)=>{
    const opts = helpers_segment.resolveObjectKey(obj, key);
    if (opts !== undefined) {
        set.add(opts);
    }
};
class Config {
    constructor(config){
        this._config = initConfig(config);
        this._scopeCache = new Map();
        this._resolverCache = new Map();
    }
    get platform() {
        return this._config.platform;
    }
    get type() {
        return this._config.type;
    }
    set type(type) {
        this._config.type = type;
    }
    get data() {
        return this._config.data;
    }
    set data(data) {
        this._config.data = initData(data);
    }
    get options() {
        return this._config.options;
    }
    set options(options) {
        this._config.options = options;
    }
    get plugins() {
        return this._config.plugins;
    }
    update() {
        const config = this._config;
        this.clearCache();
        initOptions(config);
    }
    clearCache() {
        this._scopeCache.clear();
        this._resolverCache.clear();
    }
 datasetScopeKeys(datasetType) {
        return cachedKeys(datasetType, ()=>[
                [
                    `datasets.${datasetType}`,
                    ''
                ]
            ]);
    }
 datasetAnimationScopeKeys(datasetType, transition) {
        return cachedKeys(`${datasetType}.transition.${transition}`, ()=>[
                [
                    `datasets.${datasetType}.transitions.${transition}`,
                    `transitions.${transition}`
                ],
                [
                    `datasets.${datasetType}`,
                    ''
                ]
            ]);
    }
 datasetElementScopeKeys(datasetType, elementType) {
        return cachedKeys(`${datasetType}-${elementType}`, ()=>[
                [
                    `datasets.${datasetType}.elements.${elementType}`,
                    `datasets.${datasetType}`,
                    `elements.${elementType}`,
                    ''
                ]
            ]);
    }
 pluginScopeKeys(plugin) {
        const id = plugin.id;
        const type = this.type;
        return cachedKeys(`${type}-plugin-${id}`, ()=>[
                [
                    `plugins.${id}`,
                    ...plugin.additionalOptionScopes || []
                ]
            ]);
    }
 _cachedScopes(mainScope, resetCache) {
        const _scopeCache = this._scopeCache;
        let cache = _scopeCache.get(mainScope);
        if (!cache || resetCache) {
            cache = new Map();
            _scopeCache.set(mainScope, cache);
        }
        return cache;
    }
 getOptionScopes(mainScope, keyLists, resetCache) {
        const { options , type  } = this;
        const cache = this._cachedScopes(mainScope, resetCache);
        const cached = cache.get(keyLists);
        if (cached) {
            return cached;
        }
        const scopes = new Set();
        keyLists.forEach((keys)=>{
            if (mainScope) {
                scopes.add(mainScope);
                keys.forEach((key)=>addIfFound(scopes, mainScope, key));
            }
            keys.forEach((key)=>addIfFound(scopes, options, key));
            keys.forEach((key)=>addIfFound(scopes, helpers_segment.overrides[type] || {}, key));
            keys.forEach((key)=>addIfFound(scopes, helpers_segment.defaults, key));
            keys.forEach((key)=>addIfFound(scopes, helpers_segment.descriptors, key));
        });
        const array = Array.from(scopes);
        if (array.length === 0) {
            array.push(Object.create(null));
        }
        if (keysCached.has(keyLists)) {
            cache.set(keyLists, array);
        }
        return array;
    }
 chartOptionScopes() {
        const { options , type  } = this;
        return [
            options,
            helpers_segment.overrides[type] || {},
            helpers_segment.defaults.datasets[type] || {},
            {
                type
            },
            helpers_segment.defaults,
            helpers_segment.descriptors
        ];
    }
 resolveNamedOptions(scopes, names, conte***REMOVED***t, prefi***REMOVED***es = [
        ''
    ]) {
        const result = {
            $shared: true
        };
        const { resolver , subPrefi***REMOVED***es  } = getResolver(this._resolverCache, scopes, prefi***REMOVED***es);
        let options = resolver;
        if (needConte***REMOVED***t(resolver, names)) {
            result.$shared = false;
            conte***REMOVED***t = helpers_segment.isFunction(conte***REMOVED***t) ? conte***REMOVED***t() : conte***REMOVED***t;
            const subResolver = this.createResolver(scopes, conte***REMOVED***t, subPrefi***REMOVED***es);
            options = helpers_segment._attachConte***REMOVED***t(resolver, conte***REMOVED***t, subResolver);
        }
        for (const prop of names){
            result[prop] = options[prop];
        }
        return result;
    }
 createResolver(scopes, conte***REMOVED***t, prefi***REMOVED***es = [
        ''
    ], descriptorDefaults) {
        const { resolver  } = getResolver(this._resolverCache, scopes, prefi***REMOVED***es);
        return helpers_segment.isObject(conte***REMOVED***t) ? helpers_segment._attachConte***REMOVED***t(resolver, conte***REMOVED***t, undefined, descriptorDefaults) : resolver;
    }
}
function getResolver(resolverCache, scopes, prefi***REMOVED***es) {
    let cache = resolverCache.get(scopes);
    if (!cache) {
        cache = new Map();
        resolverCache.set(scopes, cache);
    }
    const cacheKey = prefi***REMOVED***es.join();
    let cached = cache.get(cacheKey);
    if (!cached) {
        const resolver = helpers_segment._createResolver(scopes, prefi***REMOVED***es);
        cached = {
            resolver,
            subPrefi***REMOVED***es: prefi***REMOVED***es.filter((p)=>!p.toLowerCase().includes('hover'))
        };
        cache.set(cacheKey, cached);
    }
    return cached;
}
const hasFunction = (value)=>helpers_segment.isObject(value) && Object.getOwnPropertyNames(value).some((key)=>helpers_segment.isFunction(value[key]));
function needConte***REMOVED***t(pro***REMOVED***y, names) {
    const { isScriptable , isInde***REMOVED***able  } = helpers_segment._descriptors(pro***REMOVED***y);
    for (const prop of names){
        const scriptable = isScriptable(prop);
        const inde***REMOVED***able = isInde***REMOVED***able(prop);
        const value = (inde***REMOVED***able || scriptable) && pro***REMOVED***y[prop];
        if (scriptable && (helpers_segment.isFunction(value) || hasFunction(value)) || inde***REMOVED***able && helpers_segment.isArray(value)) {
            return true;
        }
    }
    return false;
}

var version = "4.4.3";

const KNOWN_POSITIONS = [
    'top',
    'bottom',
    'left',
    'right',
    'chartArea'
];
function positionIsHorizontal(position, a***REMOVED***is) {
    return position === 'top' || position === 'bottom' || KNOWN_POSITIONS.inde***REMOVED***Of(position) === -1 && a***REMOVED***is === '***REMOVED***';
}
function compare2Level(l1, l2) {
    return function(a, b) {
        return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
    };
}
function onAnimationsComplete(conte***REMOVED***t) {
    const chart = conte***REMOVED***t.chart;
    const animationOptions = chart.options.animation;
    chart.notifyPlugins('afterRender');
    helpers_segment.callback(animationOptions && animationOptions.onComplete, [
        conte***REMOVED***t
    ], chart);
}
function onAnimationProgress(conte***REMOVED***t) {
    const chart = conte***REMOVED***t.chart;
    const animationOptions = chart.options.animation;
    helpers_segment.callback(animationOptions && animationOptions.onProgress, [
        conte***REMOVED***t
    ], chart);
}
 function getCanvas(item) {
    if (helpers_segment._isDomSupported() && typeof item === 'string') {
        item = document.getElementById(item);
    } else if (item && item.length) {
        item = item[0];
    }
    if (item && item.canvas) {
        item = item.canvas;
    }
    return item;
}
const instances = {};
const getChart = (key)=>{
    const canvas = getCanvas(key);
    return Object.values(instances).filter((c)=>c.canvas === canvas).pop();
};
function moveNumericKeys(obj, start, move) {
    const keys = Object.keys(obj);
    for (const key of keys){
        const intKey = +key;
        if (intKey >= start) {
            const value = obj[key];
            delete obj[key];
            if (move > 0 || intKey > start) {
                obj[intKey + move] = value;
            }
        }
    }
}
 function determineLastEvent(e, lastEvent, inChartArea, isClick) {
    if (!inChartArea || e.type === 'mouseout') {
        return null;
    }
    if (isClick) {
        return lastEvent;
    }
    return e;
}
function getSizeForArea(scale, chartArea, field) {
    return scale.options.clip ? scale[field] : chartArea[field];
}
function getDatasetArea(meta, chartArea) {
    const { ***REMOVED***Scale , yScale  } = meta;
    if (***REMOVED***Scale && yScale) {
        return {
            left: getSizeForArea(***REMOVED***Scale, chartArea, 'left'),
            right: getSizeForArea(***REMOVED***Scale, chartArea, 'right'),
            top: getSizeForArea(yScale, chartArea, 'top'),
            bottom: getSizeForArea(yScale, chartArea, 'bottom')
        };
    }
    return chartArea;
}
class Chart {
    static defaults = helpers_segment.defaults;
    static instances = instances;
    static overrides = helpers_segment.overrides;
    static registry = registry;
    static version = version;
    static getChart = getChart;
    static register(...items) {
        registry.add(...items);
        invalidatePlugins();
    }
    static unregister(...items) {
        registry.remove(...items);
        invalidatePlugins();
    }
    constructor(item, userConfig){
        const config = this.config = new Config(userConfig);
        const initialCanvas = getCanvas(item);
        const e***REMOVED***istingChart = getChart(initialCanvas);
        if (e***REMOVED***istingChart) {
            throw new Error('Canvas is already in use. Chart with ID \'' + e***REMOVED***istingChart.id + '\'' + ' must be destroyed before the canvas with ID \'' + e***REMOVED***istingChart.canvas.id + '\' can be reused.');
        }
        const options = config.createResolver(config.chartOptionScopes(), this.getConte***REMOVED***t());
        this.platform = new (config.platform || _detectPlatform(initialCanvas))();
        this.platform.updateConfig(config);
        const conte***REMOVED***t = this.platform.acquireConte***REMOVED***t(initialCanvas, options.aspectRatio);
        const canvas = conte***REMOVED***t && conte***REMOVED***t.canvas;
        const height = canvas && canvas.height;
        const width = canvas && canvas.width;
        this.id = helpers_segment.uid();
        this.ct***REMOVED*** = conte***REMOVED***t;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this._options = options;
        this._aspectRatio = this.aspectRatio;
        this._layers = [];
        this._metasets = [];
        this._stacks = undefined;
        this.bo***REMOVED***es = [];
        this.currentDevicePi***REMOVED***elRatio = undefined;
        this.chartArea = undefined;
        this._active = [];
        this._lastEvent = undefined;
        this._listeners = {};
         this._responsiveListeners = undefined;
        this._sortedMetasets = [];
        this.scales = {};
        this._plugins = new PluginService();
        this.$pro***REMOVED***ies = {};
        this._hiddenIndices = {};
        this.attached = false;
        this._animationsDisabled = undefined;
        this.$conte***REMOVED***t = undefined;
        this._doResize = helpers_segment.debounce((mode)=>this.update(mode), options.resizeDelay || 0);
        this._dataChanges = [];
        instances[this.id] = this;
        if (!conte***REMOVED***t || !canvas) {
            console.error("Failed to create chart: can't acquire conte***REMOVED***t from the given item");
            return;
        }
        animator.listen(this, 'complete', onAnimationsComplete);
        animator.listen(this, 'progress', onAnimationProgress);
        this._initialize();
        if (this.attached) {
            this.update();
        }
    }
    get aspectRatio() {
        const { options: { aspectRatio , maintainAspectRatio  } , width , height , _aspectRatio  } = this;
        if (!helpers_segment.isNullOrUndef(aspectRatio)) {
            return aspectRatio;
        }
        if (maintainAspectRatio && _aspectRatio) {
            return _aspectRatio;
        }
        return height ? width / height : null;
    }
    get data() {
        return this.config.data;
    }
    set data(data) {
        this.config.data = data;
    }
    get options() {
        return this._options;
    }
    set options(options) {
        this.config.options = options;
    }
    get registry() {
        return registry;
    }
 _initialize() {
        this.notifyPlugins('beforeInit');
        if (this.options.responsive) {
            this.resize();
        } else {
            helpers_segment.retinaScale(this, this.options.devicePi***REMOVED***elRatio);
        }
        this.bindEvents();
        this.notifyPlugins('afterInit');
        return this;
    }
    clear() {
        helpers_segment.clearCanvas(this.canvas, this.ct***REMOVED***);
        return this;
    }
    stop() {
        animator.stop(this);
        return this;
    }
 resize(width, height) {
        if (!animator.running(this)) {
            this._resize(width, height);
        } else {
            this._resizeBeforeDraw = {
                width,
                height
            };
        }
    }
    _resize(width, height) {
        const options = this.options;
        const canvas = this.canvas;
        const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
        const newSize = this.platform.getMa***REMOVED***imumSize(canvas, width, height, aspectRatio);
        const newRatio = options.devicePi***REMOVED***elRatio || this.platform.getDevicePi***REMOVED***elRatio();
        const mode = this.width ? 'resize' : 'attach';
        this.width = newSize.width;
        this.height = newSize.height;
        this._aspectRatio = this.aspectRatio;
        if (!helpers_segment.retinaScale(this, newRatio, true)) {
            return;
        }
        this.notifyPlugins('resize', {
            size: newSize
        });
        helpers_segment.callback(options.onResize, [
            this,
            newSize
        ], this);
        if (this.attached) {
            if (this._doResize(mode)) {
                this.render();
            }
        }
    }
    ensureScalesHaveIDs() {
        const options = this.options;
        const scalesOptions = options.scales || {};
        helpers_segment.each(scalesOptions, (a***REMOVED***isOptions, a***REMOVED***isID)=>{
            a***REMOVED***isOptions.id = a***REMOVED***isID;
        });
    }
 buildOrUpdateScales() {
        const options = this.options;
        const scaleOpts = options.scales;
        const scales = this.scales;
        const updated = Object.keys(scales).reduce((obj, id)=>{
            obj[id] = false;
            return obj;
        }, {});
        let items = [];
        if (scaleOpts) {
            items = items.concat(Object.keys(scaleOpts).map((id)=>{
                const scaleOptions = scaleOpts[id];
                const a***REMOVED***is = determineA***REMOVED***is(id, scaleOptions);
                const isRadial = a***REMOVED***is === 'r';
                const isHorizontal = a***REMOVED***is === '***REMOVED***';
                return {
                    options: scaleOptions,
                    dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
                    dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
                };
            }));
        }
        helpers_segment.each(items, (item)=>{
            const scaleOptions = item.options;
            const id = scaleOptions.id;
            const a***REMOVED***is = determineA***REMOVED***is(id, scaleOptions);
            const scaleType = helpers_segment.valueOrDefault(scaleOptions.type, item.dtype);
            if (scaleOptions.position === undefined || positionIsHorizontal(scaleOptions.position, a***REMOVED***is) !== positionIsHorizontal(item.dposition)) {
                scaleOptions.position = item.dposition;
            }
            updated[id] = true;
            let scale = null;
            if (id in scales && scales[id].type === scaleType) {
                scale = scales[id];
            } else {
                const scaleClass = registry.getScale(scaleType);
                scale = new scaleClass({
                    id,
                    type: scaleType,
                    ct***REMOVED***: this.ct***REMOVED***,
                    chart: this
                });
                scales[scale.id] = scale;
            }
            scale.init(scaleOptions, options);
        });
        helpers_segment.each(updated, (hasUpdated, id)=>{
            if (!hasUpdated) {
                delete scales[id];
            }
        });
        helpers_segment.each(scales, (scale)=>{
            layouts.configure(this, scale, scale.options);
            layouts.addBo***REMOVED***(this, scale);
        });
    }
 _updateMetasets() {
        const metasets = this._metasets;
        const numData = this.data.datasets.length;
        const numMeta = metasets.length;
        metasets.sort((a, b)=>a.inde***REMOVED*** - b.inde***REMOVED***);
        if (numMeta > numData) {
            for(let i = numData; i < numMeta; ++i){
                this._destroyDatasetMeta(i);
            }
            metasets.splice(numData, numMeta - numData);
        }
        this._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'inde***REMOVED***'));
    }
 _removeUnreferencedMetasets() {
        const { _metasets: metasets , data: { datasets  }  } = this;
        if (metasets.length > datasets.length) {
            delete this._stacks;
        }
        metasets.forEach((meta, inde***REMOVED***)=>{
            if (datasets.filter((***REMOVED***)=>***REMOVED*** === meta._dataset).length === 0) {
                this._destroyDatasetMeta(inde***REMOVED***);
            }
        });
    }
    buildOrUpdateControllers() {
        const newControllers = [];
        const datasets = this.data.datasets;
        let i, ilen;
        this._removeUnreferencedMetasets();
        for(i = 0, ilen = datasets.length; i < ilen; i++){
            const dataset = datasets[i];
            let meta = this.getDatasetMeta(i);
            const type = dataset.type || this.config.type;
            if (meta.type && meta.type !== type) {
                this._destroyDatasetMeta(i);
                meta = this.getDatasetMeta(i);
            }
            meta.type = type;
            meta.inde***REMOVED***A***REMOVED***is = dataset.inde***REMOVED***A***REMOVED***is || getInde***REMOVED***A***REMOVED***is(type, this.options);
            meta.order = dataset.order || 0;
            meta.inde***REMOVED*** = i;
            meta.label = '' + dataset.label;
            meta.visible = this.isDatasetVisible(i);
            if (meta.controller) {
                meta.controller.updateInde***REMOVED***(i);
                meta.controller.linkScales();
            } else {
                const ControllerClass = registry.getController(type);
                const { datasetElementType , dataElementType  } = helpers_segment.defaults.datasets[type];
                Object.assign(ControllerClass, {
                    dataElementType: registry.getElement(dataElementType),
                    datasetElementType: datasetElementType && registry.getElement(datasetElementType)
                });
                meta.controller = new ControllerClass(this, i);
                newControllers.push(meta.controller);
            }
        }
        this._updateMetasets();
        return newControllers;
    }
 _resetElements() {
        helpers_segment.each(this.data.datasets, (dataset, datasetInde***REMOVED***)=>{
            this.getDatasetMeta(datasetInde***REMOVED***).controller.reset();
        }, this);
    }
 reset() {
        this._resetElements();
        this.notifyPlugins('reset');
    }
    update(mode) {
        const config = this.config;
        config.update();
        const options = this._options = config.createResolver(config.chartOptionScopes(), this.getConte***REMOVED***t());
        const animsDisabled = this._animationsDisabled = !options.animation;
        this._updateScales();
        this._checkEventBindings();
        this._updateHiddenIndices();
        this._plugins.invalidate();
        if (this.notifyPlugins('beforeUpdate', {
            mode,
            cancelable: true
        }) === false) {
            return;
        }
        const newControllers = this.buildOrUpdateControllers();
        this.notifyPlugins('beforeElementsUpdate');
        let minPadding = 0;
        for(let i = 0, ilen = this.data.datasets.length; i < ilen; i++){
            const { controller  } = this.getDatasetMeta(i);
            const reset = !animsDisabled && newControllers.inde***REMOVED***Of(controller) === -1;
            controller.buildOrUpdateElements(reset);
            minPadding = Math.ma***REMOVED***(+controller.getMa***REMOVED***Overflow(), minPadding);
        }
        minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
        this._updateLayout(minPadding);
        if (!animsDisabled) {
            helpers_segment.each(newControllers, (controller)=>{
                controller.reset();
            });
        }
        this._updateDatasets(mode);
        this.notifyPlugins('afterUpdate', {
            mode
        });
        this._layers.sort(compare2Level('z', '_id***REMOVED***'));
        const { _active , _lastEvent  } = this;
        if (_lastEvent) {
            this._eventHandler(_lastEvent, true);
        } else if (_active.length) {
            this._updateHoverStyles(_active, _active, true);
        }
        this.render();
    }
 _updateScales() {
        helpers_segment.each(this.scales, (scale)=>{
            layouts.removeBo***REMOVED***(this, scale);
        });
        this.ensureScalesHaveIDs();
        this.buildOrUpdateScales();
    }
 _checkEventBindings() {
        const options = this.options;
        const e***REMOVED***istingEvents = new Set(Object.keys(this._listeners));
        const newEvents = new Set(options.events);
        if (!helpers_segment.setsEqual(e***REMOVED***istingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
            this.unbindEvents();
            this.bindEvents();
        }
    }
 _updateHiddenIndices() {
        const { _hiddenIndices  } = this;
        const changes = this._getUniformDataChanges() || [];
        for (const { method , start , count  } of changes){
            const move = method === '_removeElements' ? -count : count;
            moveNumericKeys(_hiddenIndices, start, move);
        }
    }
 _getUniformDataChanges() {
        const _dataChanges = this._dataChanges;
        if (!_dataChanges || !_dataChanges.length) {
            return;
        }
        this._dataChanges = [];
        const datasetCount = this.data.datasets.length;
        const makeSet = (id***REMOVED***)=>new Set(_dataChanges.filter((c)=>c[0] === id***REMOVED***).map((c, i)=>i + ',' + c.splice(1).join(',')));
        const changeSet = makeSet(0);
        for(let i = 1; i < datasetCount; i++){
            if (!helpers_segment.setsEqual(changeSet, makeSet(i))) {
                return;
            }
        }
        return Array.from(changeSet).map((c)=>c.split(',')).map((a)=>({
                method: a[1],
                start: +a[2],
                count: +a[3]
            }));
    }
 _updateLayout(minPadding) {
        if (this.notifyPlugins('beforeLayout', {
            cancelable: true
        }) === false) {
            return;
        }
        layouts.update(this, this.width, this.height, minPadding);
        const area = this.chartArea;
        const noArea = area.width <= 0 || area.height <= 0;
        this._layers = [];
        helpers_segment.each(this.bo***REMOVED***es, (bo***REMOVED***)=>{
            if (noArea && bo***REMOVED***.position === 'chartArea') {
                return;
            }
            if (bo***REMOVED***.configure) {
                bo***REMOVED***.configure();
            }
            this._layers.push(...bo***REMOVED***._layers());
        }, this);
        this._layers.forEach((item, inde***REMOVED***)=>{
            item._id***REMOVED*** = inde***REMOVED***;
        });
        this.notifyPlugins('afterLayout');
    }
 _updateDatasets(mode) {
        if (this.notifyPlugins('beforeDatasetsUpdate', {
            mode,
            cancelable: true
        }) === false) {
            return;
        }
        for(let i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
            this.getDatasetMeta(i).controller.configure();
        }
        for(let i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
            this._updateDataset(i, helpers_segment.isFunction(mode) ? mode({
                datasetInde***REMOVED***: i
            }) : mode);
        }
        this.notifyPlugins('afterDatasetsUpdate', {
            mode
        });
    }
 _updateDataset(inde***REMOVED***, mode) {
        const meta = this.getDatasetMeta(inde***REMOVED***);
        const args = {
            meta,
            inde***REMOVED***,
            mode,
            cancelable: true
        };
        if (this.notifyPlugins('beforeDatasetUpdate', args) === false) {
            return;
        }
        meta.controller._update(mode);
        args.cancelable = false;
        this.notifyPlugins('afterDatasetUpdate', args);
    }
    render() {
        if (this.notifyPlugins('beforeRender', {
            cancelable: true
        }) === false) {
            return;
        }
        if (animator.has(this)) {
            if (this.attached && !animator.running(this)) {
                animator.start(this);
            }
        } else {
            this.draw();
            onAnimationsComplete({
                chart: this
            });
        }
    }
    draw() {
        let i;
        if (this._resizeBeforeDraw) {
            const { width , height  } = this._resizeBeforeDraw;
            this._resize(width, height);
            this._resizeBeforeDraw = null;
        }
        this.clear();
        if (this.width <= 0 || this.height <= 0) {
            return;
        }
        if (this.notifyPlugins('beforeDraw', {
            cancelable: true
        }) === false) {
            return;
        }
        const layers = this._layers;
        for(i = 0; i < layers.length && layers[i].z <= 0; ++i){
            layers[i].draw(this.chartArea);
        }
        this._drawDatasets();
        for(; i < layers.length; ++i){
            layers[i].draw(this.chartArea);
        }
        this.notifyPlugins('afterDraw');
    }
 _getSortedDatasetMetas(filterVisible) {
        const metasets = this._sortedMetasets;
        const result = [];
        let i, ilen;
        for(i = 0, ilen = metasets.length; i < ilen; ++i){
            const meta = metasets[i];
            if (!filterVisible || meta.visible) {
                result.push(meta);
            }
        }
        return result;
    }
 getSortedVisibleDatasetMetas() {
        return this._getSortedDatasetMetas(true);
    }
 _drawDatasets() {
        if (this.notifyPlugins('beforeDatasetsDraw', {
            cancelable: true
        }) === false) {
            return;
        }
        const metasets = this.getSortedVisibleDatasetMetas();
        for(let i = metasets.length - 1; i >= 0; --i){
            this._drawDataset(metasets[i]);
        }
        this.notifyPlugins('afterDatasetsDraw');
    }
 _drawDataset(meta) {
        const ct***REMOVED*** = this.ct***REMOVED***;
        const clip = meta._clip;
        const useClip = !clip.disabled;
        const area = getDatasetArea(meta, this.chartArea);
        const args = {
            meta,
            inde***REMOVED***: meta.inde***REMOVED***,
            cancelable: true
        };
        if (this.notifyPlugins('beforeDatasetDraw', args) === false) {
            return;
        }
        if (useClip) {
            helpers_segment.clipArea(ct***REMOVED***, {
                left: clip.left === false ? 0 : area.left - clip.left,
                right: clip.right === false ? this.width : area.right + clip.right,
                top: clip.top === false ? 0 : area.top - clip.top,
                bottom: clip.bottom === false ? this.height : area.bottom + clip.bottom
            });
        }
        meta.controller.draw();
        if (useClip) {
            helpers_segment.unclipArea(ct***REMOVED***);
        }
        args.cancelable = false;
        this.notifyPlugins('afterDatasetDraw', args);
    }
 isPointInArea(point) {
        return helpers_segment._isPointInArea(point, this.chartArea, this._minPadding);
    }
    getElementsAtEventForMode(e, mode, options, useFinalPosition) {
        const method = Interaction.modes[mode];
        if (typeof method === 'function') {
            return method(this, e, options, useFinalPosition);
        }
        return [];
    }
    getDatasetMeta(datasetInde***REMOVED***) {
        const dataset = this.data.datasets[datasetInde***REMOVED***];
        const metasets = this._metasets;
        let meta = metasets.filter((***REMOVED***)=>***REMOVED*** && ***REMOVED***._dataset === dataset).pop();
        if (!meta) {
            meta = {
                type: null,
                data: [],
                dataset: null,
                controller: null,
                hidden: null,
                ***REMOVED***A***REMOVED***isID: null,
                yA***REMOVED***isID: null,
                order: dataset && dataset.order || 0,
                inde***REMOVED***: datasetInde***REMOVED***,
                _dataset: dataset,
                _parsed: [],
                _sorted: false
            };
            metasets.push(meta);
        }
        return meta;
    }
    getConte***REMOVED***t() {
        return this.$conte***REMOVED***t || (this.$conte***REMOVED***t = helpers_segment.createConte***REMOVED***t(null, {
            chart: this,
            type: 'chart'
        }));
    }
    getVisibleDatasetCount() {
        return this.getSortedVisibleDatasetMetas().length;
    }
    isDatasetVisible(datasetInde***REMOVED***) {
        const dataset = this.data.datasets[datasetInde***REMOVED***];
        if (!dataset) {
            return false;
        }
        const meta = this.getDatasetMeta(datasetInde***REMOVED***);
        return typeof meta.hidden === 'boolean' ? !meta.hidden : !dataset.hidden;
    }
    setDatasetVisibility(datasetInde***REMOVED***, visible) {
        const meta = this.getDatasetMeta(datasetInde***REMOVED***);
        meta.hidden = !visible;
    }
    toggleDataVisibility(inde***REMOVED***) {
        this._hiddenIndices[inde***REMOVED***] = !this._hiddenIndices[inde***REMOVED***];
    }
    getDataVisibility(inde***REMOVED***) {
        return !this._hiddenIndices[inde***REMOVED***];
    }
 _updateVisibility(datasetInde***REMOVED***, dataInde***REMOVED***, visible) {
        const mode = visible ? 'show' : 'hide';
        const meta = this.getDatasetMeta(datasetInde***REMOVED***);
        const anims = meta.controller._resolveAnimations(undefined, mode);
        if (helpers_segment.defined(dataInde***REMOVED***)) {
            meta.data[dataInde***REMOVED***].hidden = !visible;
            this.update();
        } else {
            this.setDatasetVisibility(datasetInde***REMOVED***, visible);
            anims.update(meta, {
                visible
            });
            this.update((ct***REMOVED***)=>ct***REMOVED***.datasetInde***REMOVED*** === datasetInde***REMOVED*** ? mode : undefined);
        }
    }
    hide(datasetInde***REMOVED***, dataInde***REMOVED***) {
        this._updateVisibility(datasetInde***REMOVED***, dataInde***REMOVED***, false);
    }
    show(datasetInde***REMOVED***, dataInde***REMOVED***) {
        this._updateVisibility(datasetInde***REMOVED***, dataInde***REMOVED***, true);
    }
 _destroyDatasetMeta(datasetInde***REMOVED***) {
        const meta = this._metasets[datasetInde***REMOVED***];
        if (meta && meta.controller) {
            meta.controller._destroy();
        }
        delete this._metasets[datasetInde***REMOVED***];
    }
    _stop() {
        let i, ilen;
        this.stop();
        animator.remove(this);
        for(i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
            this._destroyDatasetMeta(i);
        }
    }
    destroy() {
        this.notifyPlugins('beforeDestroy');
        const { canvas , ct***REMOVED***  } = this;
        this._stop();
        this.config.clearCache();
        if (canvas) {
            this.unbindEvents();
            helpers_segment.clearCanvas(canvas, ct***REMOVED***);
            this.platform.releaseConte***REMOVED***t(ct***REMOVED***);
            this.canvas = null;
            this.ct***REMOVED*** = null;
        }
        delete instances[this.id];
        this.notifyPlugins('afterDestroy');
    }
    toBase64Image(...args) {
        return this.canvas.toDataURL(...args);
    }
 bindEvents() {
        this.bindUserEvents();
        if (this.options.responsive) {
            this.bindResponsiveEvents();
        } else {
            this.attached = true;
        }
    }
 bindUserEvents() {
        const listeners = this._listeners;
        const platform = this.platform;
        const _add = (type, listener)=>{
            platform.addEventListener(this, type, listener);
            listeners[type] = listener;
        };
        const listener = (e, ***REMOVED***, y)=>{
            e.offsetX = ***REMOVED***;
            e.offsetY = y;
            this._eventHandler(e);
        };
        helpers_segment.each(this.options.events, (type)=>_add(type, listener));
    }
 bindResponsiveEvents() {
        if (!this._responsiveListeners) {
            this._responsiveListeners = {};
        }
        const listeners = this._responsiveListeners;
        const platform = this.platform;
        const _add = (type, listener)=>{
            platform.addEventListener(this, type, listener);
            listeners[type] = listener;
        };
        const _remove = (type, listener)=>{
            if (listeners[type]) {
                platform.removeEventListener(this, type, listener);
                delete listeners[type];
            }
        };
        const listener = (width, height)=>{
            if (this.canvas) {
                this.resize(width, height);
            }
        };
        let detached;
        const attached = ()=>{
            _remove('attach', attached);
            this.attached = true;
            this.resize();
            _add('resize', listener);
            _add('detach', detached);
        };
        detached = ()=>{
            this.attached = false;
            _remove('resize', listener);
            this._stop();
            this._resize(0, 0);
            _add('attach', attached);
        };
        if (platform.isAttached(this.canvas)) {
            attached();
        } else {
            detached();
        }
    }
 unbindEvents() {
        helpers_segment.each(this._listeners, (listener, type)=>{
            this.platform.removeEventListener(this, type, listener);
        });
        this._listeners = {};
        helpers_segment.each(this._responsiveListeners, (listener, type)=>{
            this.platform.removeEventListener(this, type, listener);
        });
        this._responsiveListeners = undefined;
    }
    updateHoverStyle(items, mode, enabled) {
        const prefi***REMOVED*** = enabled ? 'set' : 'remove';
        let meta, item, i, ilen;
        if (mode === 'dataset') {
            meta = this.getDatasetMeta(items[0].datasetInde***REMOVED***);
            meta.controller['_' + prefi***REMOVED*** + 'DatasetHoverStyle']();
        }
        for(i = 0, ilen = items.length; i < ilen; ++i){
            item = items[i];
            const controller = item && this.getDatasetMeta(item.datasetInde***REMOVED***).controller;
            if (controller) {
                controller[prefi***REMOVED*** + 'HoverStyle'](item.element, item.datasetInde***REMOVED***, item.inde***REMOVED***);
            }
        }
    }
 getActiveElements() {
        return this._active || [];
    }
 setActiveElements(activeElements) {
        const lastActive = this._active || [];
        const active = activeElements.map(({ datasetInde***REMOVED*** , inde***REMOVED***  })=>{
            const meta = this.getDatasetMeta(datasetInde***REMOVED***);
            if (!meta) {
                throw new Error('No dataset found at inde***REMOVED*** ' + datasetInde***REMOVED***);
            }
            return {
                datasetInde***REMOVED***,
                element: meta.data[inde***REMOVED***],
                inde***REMOVED***
            };
        });
        const changed = !helpers_segment._elementsEqual(active, lastActive);
        if (changed) {
            this._active = active;
            this._lastEvent = null;
            this._updateHoverStyles(active, lastActive);
        }
    }
 notifyPlugins(hook, args, filter) {
        return this._plugins.notify(this, hook, args, filter);
    }
 isPluginEnabled(pluginId) {
        return this._plugins._cache.filter((p)=>p.plugin.id === pluginId).length === 1;
    }
 _updateHoverStyles(active, lastActive, replay) {
        const hoverOptions = this.options.hover;
        const diff = (a, b)=>a.filter((***REMOVED***)=>!b.some((y)=>***REMOVED***.datasetInde***REMOVED*** === y.datasetInde***REMOVED*** && ***REMOVED***.inde***REMOVED*** === y.inde***REMOVED***));
        const deactivated = diff(lastActive, active);
        const activated = replay ? active : diff(active, lastActive);
        if (deactivated.length) {
            this.updateHoverStyle(deactivated, hoverOptions.mode, false);
        }
        if (activated.length && hoverOptions.mode) {
            this.updateHoverStyle(activated, hoverOptions.mode, true);
        }
    }
 _eventHandler(e, replay) {
        const args = {
            event: e,
            replay,
            cancelable: true,
            inChartArea: this.isPointInArea(e)
        };
        const eventFilter = (plugin)=>(plugin.options.events || this.options.events).includes(e.native.type);
        if (this.notifyPlugins('beforeEvent', args, eventFilter) === false) {
            return;
        }
        const changed = this._handleEvent(e, replay, args.inChartArea);
        args.cancelable = false;
        this.notifyPlugins('afterEvent', args, eventFilter);
        if (changed || args.changed) {
            this.render();
        }
        return this;
    }
 _handleEvent(e, replay, inChartArea) {
        const { _active: lastActive = [] , options  } = this;
        const useFinalPosition = replay;
        const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
        const isClick = helpers_segment._isClickEvent(e);
        const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
        if (inChartArea) {
            this._lastEvent = null;
            helpers_segment.callback(options.onHover, [
                e,
                active,
                this
            ], this);
            if (isClick) {
                helpers_segment.callback(options.onClick, [
                    e,
                    active,
                    this
                ], this);
            }
        }
        const changed = !helpers_segment._elementsEqual(active, lastActive);
        if (changed || replay) {
            this._active = active;
            this._updateHoverStyles(active, lastActive, replay);
        }
        this._lastEvent = lastEvent;
        return changed;
    }
 _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
        if (e.type === 'mouseout') {
            return [];
        }
        if (!inChartArea) {
            return lastActive;
        }
        const hoverOptions = this.options.hover;
        return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
    }
}
function invalidatePlugins() {
    return helpers_segment.each(Chart.instances, (chart)=>chart._plugins.invalidate());
}

function clipArc(ct***REMOVED***, element, endAngle) {
    const { startAngle , pi***REMOVED***elMargin , ***REMOVED*** , y , outerRadius , innerRadius  } = element;
    let angleMargin = pi***REMOVED***elMargin / outerRadius;
    // Draw an inner border by clipping the arc and drawing a double-width border
    // Enlarge the clipping arc by 0.33 pi***REMOVED***els to eliminate glitches between borders
    ct***REMOVED***.beginPath();
    ct***REMOVED***.arc(***REMOVED***, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
    if (innerRadius > pi***REMOVED***elMargin) {
        angleMargin = pi***REMOVED***elMargin / innerRadius;
        ct***REMOVED***.arc(***REMOVED***, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
    } else {
        ct***REMOVED***.arc(***REMOVED***, y, pi***REMOVED***elMargin, endAngle + helpers_segment.HALF_PI, startAngle - helpers_segment.HALF_PI);
    }
    ct***REMOVED***.closePath();
    ct***REMOVED***.clip();
}
function toRadiusCorners(value) {
    return helpers_segment._readValueToProps(value, [
        'outerStart',
        'outerEnd',
        'innerStart',
        'innerEnd'
    ]);
}
/**
 * Parse border radius from the provided options
 */ function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
    const o = toRadiusCorners(arc.options.borderRadius);
    const halfThickness = (outerRadius - innerRadius) / 2;
    const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
    // Outer limits are complicated. We want to compute the available angular distance at
    // a radius of outerRadius - borderRadius because for small angular distances, this term limits.
    // We compute at r = outerRadius - borderRadius because this circle defines the center of the border corners.
    //
    // If the borderRadius is large, that value can become negative.
    // This causes the outer borders to lose their radius entirely, which is rather une***REMOVED***pected. To solve that, if borderRadius > outerRadius
    // we know that the thickness term will dominate and compute the limits at that point
    const computeOuterLimit = (val)=>{
        const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
        return helpers_segment._limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
    };
    return {
        outerStart: computeOuterLimit(o.outerStart),
        outerEnd: computeOuterLimit(o.outerEnd),
        innerStart: helpers_segment._limitValue(o.innerStart, 0, innerLimit),
        innerEnd: helpers_segment._limitValue(o.innerEnd, 0, innerLimit)
    };
}
/**
 * Convert (r, 𝜃) to (***REMOVED***, y)
 */ function rThetaToXY(r, theta, ***REMOVED***, y) {
    return {
        ***REMOVED***: ***REMOVED*** + r * Math.cos(theta),
        y: y + r * Math.sin(theta)
    };
}
/**
 * Path the arc, respecting border radius by separating into left and right halves.
 *
 *   Start      End
 *
 *    1--->a--->2    Outer
 *   /           \
 *   8           3
 *   |           |
 *   |           |
 *   7           4
 *   \           /
 *    6<---b<---5    Inner
 */ function pathArc(ct***REMOVED***, element, offset, spacing, end, circular) {
    const { ***REMOVED*** , y , startAngle: start , pi***REMOVED***elMargin , innerRadius: innerR  } = element;
    const outerRadius = Math.ma***REMOVED***(element.outerRadius + spacing + offset - pi***REMOVED***elMargin, 0);
    const innerRadius = innerR > 0 ? innerR + spacing + offset + pi***REMOVED***elMargin : 0;
    let spacingOffset = 0;
    const alpha = end - start;
    if (spacing) {
        // When spacing is present, it is the same for all items
        // So we adjust the start and end angle of the arc such that
        // the distance is the same as it would be without the spacing
        const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
        const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
        const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
        const adjustedAngle = avNogSpacingRadius !== 0 ? alpha * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha;
        spacingOffset = (alpha - adjustedAngle) / 2;
    }
    const beta = Math.ma***REMOVED***(0.001, alpha * outerRadius - offset / helpers_segment.PI) / outerRadius;
    const angleOffset = (alpha - beta) / 2;
    const startAngle = start + angleOffset + spacingOffset;
    const endAngle = end - angleOffset - spacingOffset;
    const { outerStart , outerEnd , innerStart , innerEnd  } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
    const outerStartAdjustedRadius = outerRadius - outerStart;
    const outerEndAdjustedRadius = outerRadius - outerEnd;
    const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
    const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
    const innerStartAdjustedRadius = innerRadius + innerStart;
    const innerEndAdjustedRadius = innerRadius + innerEnd;
    const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
    const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
    ct***REMOVED***.beginPath();
    if (circular) {
        // The first arc segments from point 1 to point a to point 2
        const outerMidAdjustedAngle = (outerStartAdjustedAngle + outerEndAdjustedAngle) / 2;
        ct***REMOVED***.arc(***REMOVED***, y, outerRadius, outerStartAdjustedAngle, outerMidAdjustedAngle);
        ct***REMOVED***.arc(***REMOVED***, y, outerRadius, outerMidAdjustedAngle, outerEndAdjustedAngle);
        // The corner segment from point 2 to point 3
        if (outerEnd > 0) {
            const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, ***REMOVED***, y);
            ct***REMOVED***.arc(pCenter.***REMOVED***, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + helpers_segment.HALF_PI);
        }
        // The line from point 3 to point 4
        const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, ***REMOVED***, y);
        ct***REMOVED***.lineTo(p4.***REMOVED***, p4.y);
        // The corner segment from point 4 to point 5
        if (innerEnd > 0) {
            const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, ***REMOVED***, y);
            ct***REMOVED***.arc(pCenter.***REMOVED***, pCenter.y, innerEnd, endAngle + helpers_segment.HALF_PI, innerEndAdjustedAngle + Math.PI);
        }
        // The inner arc from point 5 to point b to point 6
        const innerMidAdjustedAngle = (endAngle - innerEnd / innerRadius + (startAngle + innerStart / innerRadius)) / 2;
        ct***REMOVED***.arc(***REMOVED***, y, innerRadius, endAngle - innerEnd / innerRadius, innerMidAdjustedAngle, true);
        ct***REMOVED***.arc(***REMOVED***, y, innerRadius, innerMidAdjustedAngle, startAngle + innerStart / innerRadius, true);
        // The corner segment from point 6 to point 7
        if (innerStart > 0) {
            const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, ***REMOVED***, y);
            ct***REMOVED***.arc(pCenter.***REMOVED***, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - helpers_segment.HALF_PI);
        }
        // The line from point 7 to point 8
        const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, ***REMOVED***, y);
        ct***REMOVED***.lineTo(p8.***REMOVED***, p8.y);
        // The corner segment from point 8 to point 1
        if (outerStart > 0) {
            const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, ***REMOVED***, y);
            ct***REMOVED***.arc(pCenter.***REMOVED***, pCenter.y, outerStart, startAngle - helpers_segment.HALF_PI, outerStartAdjustedAngle);
        }
    } else {
        ct***REMOVED***.moveTo(***REMOVED***, y);
        const outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + ***REMOVED***;
        const outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y;
        ct***REMOVED***.lineTo(outerStartX, outerStartY);
        const outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + ***REMOVED***;
        const outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y;
        ct***REMOVED***.lineTo(outerEndX, outerEndY);
    }
    ct***REMOVED***.closePath();
}
function drawArc(ct***REMOVED***, element, offset, spacing, circular) {
    const { fullCircles , startAngle , circumference  } = element;
    let endAngle = element.endAngle;
    if (fullCircles) {
        pathArc(ct***REMOVED***, element, offset, spacing, endAngle, circular);
        for(let i = 0; i < fullCircles; ++i){
            ct***REMOVED***.fill();
        }
        if (!isNaN(circumference)) {
            endAngle = startAngle + (circumference % helpers_segment.TAU || helpers_segment.TAU);
        }
    }
    pathArc(ct***REMOVED***, element, offset, spacing, endAngle, circular);
    ct***REMOVED***.fill();
    return endAngle;
}
function drawBorder(ct***REMOVED***, element, offset, spacing, circular) {
    const { fullCircles , startAngle , circumference , options  } = element;
    const { borderWidth , borderJoinStyle , borderDash , borderDashOffset  } = options;
    const inner = options.borderAlign === 'inner';
    if (!borderWidth) {
        return;
    }
    ct***REMOVED***.setLineDash(borderDash || []);
    ct***REMOVED***.lineDashOffset = borderDashOffset;
    if (inner) {
        ct***REMOVED***.lineWidth = borderWidth * 2;
        ct***REMOVED***.lineJoin = borderJoinStyle || 'round';
    } else {
        ct***REMOVED***.lineWidth = borderWidth;
        ct***REMOVED***.lineJoin = borderJoinStyle || 'bevel';
    }
    let endAngle = element.endAngle;
    if (fullCircles) {
        pathArc(ct***REMOVED***, element, offset, spacing, endAngle, circular);
        for(let i = 0; i < fullCircles; ++i){
            ct***REMOVED***.stroke();
        }
        if (!isNaN(circumference)) {
            endAngle = startAngle + (circumference % helpers_segment.TAU || helpers_segment.TAU);
        }
    }
    if (inner) {
        clipArc(ct***REMOVED***, element, endAngle);
    }
    if (!fullCircles) {
        pathArc(ct***REMOVED***, element, offset, spacing, endAngle, circular);
        ct***REMOVED***.stroke();
    }
}
class ArcElement e***REMOVED***tends Element {
    static id = 'arc';
    static defaults = {
        borderAlign: 'center',
        borderColor: '#fff',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: undefined,
        borderRadius: 0,
        borderWidth: 2,
        offset: 0,
        spacing: 0,
        angle: undefined,
        circular: true
    };
    static defaultRoutes = {
        backgroundColor: 'backgroundColor'
    };
    static descriptors = {
        _scriptable: true,
        _inde***REMOVED***able: (name)=>name !== 'borderDash'
    };
    circumference;
    endAngle;
    fullCircles;
    innerRadius;
    outerRadius;
    pi***REMOVED***elMargin;
    startAngle;
    constructor(cfg){
        super();
        this.options = undefined;
        this.circumference = undefined;
        this.startAngle = undefined;
        this.endAngle = undefined;
        this.innerRadius = undefined;
        this.outerRadius = undefined;
        this.pi***REMOVED***elMargin = 0;
        this.fullCircles = 0;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    inRange(chartX, chartY, useFinalPosition) {
        const point = this.getProps([
            '***REMOVED***',
            'y'
        ], useFinalPosition);
        const { angle , distance  } = helpers_segment.getAngleFromPoint(point, {
            ***REMOVED***: chartX,
            y: chartY
        });
        const { startAngle , endAngle , innerRadius , outerRadius , circumference  } = this.getProps([
            'startAngle',
            'endAngle',
            'innerRadius',
            'outerRadius',
            'circumference'
        ], useFinalPosition);
        const rAdjust = (this.options.spacing + this.options.borderWidth) / 2;
        const _circumference = helpers_segment.valueOrDefault(circumference, endAngle - startAngle);
        const betweenAngles = _circumference >= helpers_segment.TAU || helpers_segment._angleBetween(angle, startAngle, endAngle);
        const withinRadius = helpers_segment._isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
        return betweenAngles && withinRadius;
    }
    getCenterPoint(useFinalPosition) {
        const { ***REMOVED*** , y , startAngle , endAngle , innerRadius , outerRadius  } = this.getProps([
            '***REMOVED***',
            'y',
            'startAngle',
            'endAngle',
            'innerRadius',
            'outerRadius'
        ], useFinalPosition);
        const { offset , spacing  } = this.options;
        const halfAngle = (startAngle + endAngle) / 2;
        const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
        return {
            ***REMOVED***: ***REMOVED*** + Math.cos(halfAngle) * halfRadius,
            y: y + Math.sin(halfAngle) * halfRadius
        };
    }
    tooltipPosition(useFinalPosition) {
        return this.getCenterPoint(useFinalPosition);
    }
    draw(ct***REMOVED***) {
        const { options , circumference  } = this;
        const offset = (options.offset || 0) / 4;
        const spacing = (options.spacing || 0) / 2;
        const circular = options.circular;
        this.pi***REMOVED***elMargin = options.borderAlign === 'inner' ? 0.33 : 0;
        this.fullCircles = circumference > helpers_segment.TAU ? Math.floor(circumference / helpers_segment.TAU) : 0;
        if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
            return;
        }
        ct***REMOVED***.save();
        const halfAngle = (this.startAngle + this.endAngle) / 2;
        ct***REMOVED***.translate(Math.cos(halfAngle) * offset, Math.sin(halfAngle) * offset);
        const fi***REMOVED*** = 1 - Math.sin(Math.min(helpers_segment.PI, circumference || 0));
        const radiusOffset = offset * fi***REMOVED***;
        ct***REMOVED***.fillStyle = options.backgroundColor;
        ct***REMOVED***.strokeStyle = options.borderColor;
        drawArc(ct***REMOVED***, this, radiusOffset, spacing, circular);
        drawBorder(ct***REMOVED***, this, radiusOffset, spacing, circular);
        ct***REMOVED***.restore();
    }
}

function setStyle(ct***REMOVED***, options, style = options) {
    ct***REMOVED***.lineCap = helpers_segment.valueOrDefault(style.borderCapStyle, options.borderCapStyle);
    ct***REMOVED***.setLineDash(helpers_segment.valueOrDefault(style.borderDash, options.borderDash));
    ct***REMOVED***.lineDashOffset = helpers_segment.valueOrDefault(style.borderDashOffset, options.borderDashOffset);
    ct***REMOVED***.lineJoin = helpers_segment.valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
    ct***REMOVED***.lineWidth = helpers_segment.valueOrDefault(style.borderWidth, options.borderWidth);
    ct***REMOVED***.strokeStyle = helpers_segment.valueOrDefault(style.borderColor, options.borderColor);
}
function lineTo(ct***REMOVED***, previous, target) {
    ct***REMOVED***.lineTo(target.***REMOVED***, target.y);
}
 function getLineMethod(options) {
    if (options.stepped) {
        return helpers_segment._steppedLineTo;
    }
    if (options.tension || options.cubicInterpolationMode === 'monotone') {
        return helpers_segment._bezierCurveTo;
    }
    return lineTo;
}
function pathVars(points, segment, params = {}) {
    const count = points.length;
    const { start: paramsStart = 0 , end: paramsEnd = count - 1  } = params;
    const { start: segmentStart , end: segmentEnd  } = segment;
    const start = Math.ma***REMOVED***(paramsStart, segmentStart);
    const end = Math.min(paramsEnd, segmentEnd);
    const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
    return {
        count,
        start,
        loop: segment.loop,
        ilen: end < start && !outside ? count + end - start : end - start
    };
}
 function pathSegment(ct***REMOVED***, line, segment, params) {
    const { points , options  } = line;
    const { count , start , loop , ilen  } = pathVars(points, segment, params);
    const lineMethod = getLineMethod(options);
    let { move =true , reverse  } = params || {};
    let i, point, prev;
    for(i = 0; i <= ilen; ++i){
        point = points[(start + (reverse ? ilen - i : i)) % count];
        if (point.skip) {
            continue;
        } else if (move) {
            ct***REMOVED***.moveTo(point.***REMOVED***, point.y);
            move = false;
        } else {
            lineMethod(ct***REMOVED***, prev, point, reverse, options.stepped);
        }
        prev = point;
    }
    if (loop) {
        point = points[(start + (reverse ? ilen : 0)) % count];
        lineMethod(ct***REMOVED***, prev, point, reverse, options.stepped);
    }
    return !!loop;
}
 function fastPathSegment(ct***REMOVED***, line, segment, params) {
    const points = line.points;
    const { count , start , ilen  } = pathVars(points, segment, params);
    const { move =true , reverse  } = params || {};
    let avgX = 0;
    let countX = 0;
    let i, point, prevX, minY, ma***REMOVED***Y, lastY;
    const pointInde***REMOVED*** = (inde***REMOVED***)=>(start + (reverse ? ilen - inde***REMOVED*** : inde***REMOVED***)) % count;
    const drawX = ()=>{
        if (minY !== ma***REMOVED***Y) {
            ct***REMOVED***.lineTo(avgX, ma***REMOVED***Y);
            ct***REMOVED***.lineTo(avgX, minY);
            ct***REMOVED***.lineTo(avgX, lastY);
        }
    };
    if (move) {
        point = points[pointInde***REMOVED***(0)];
        ct***REMOVED***.moveTo(point.***REMOVED***, point.y);
    }
    for(i = 0; i <= ilen; ++i){
        point = points[pointInde***REMOVED***(i)];
        if (point.skip) {
            continue;
        }
        const ***REMOVED*** = point.***REMOVED***;
        const y = point.y;
        const truncX = ***REMOVED*** | 0;
        if (truncX === prevX) {
            if (y < minY) {
                minY = y;
            } else if (y > ma***REMOVED***Y) {
                ma***REMOVED***Y = y;
            }
            avgX = (countX * avgX + ***REMOVED***) / ++countX;
        } else {
            drawX();
            ct***REMOVED***.lineTo(***REMOVED***, y);
            prevX = truncX;
            countX = 0;
            minY = ma***REMOVED***Y = y;
        }
        lastY = y;
    }
    drawX();
}
 function _getSegmentMethod(line) {
    const opts = line.options;
    const borderDash = opts.borderDash && opts.borderDash.length;
    const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== 'monotone' && !opts.stepped && !borderDash;
    return useFastPath ? fastPathSegment : pathSegment;
}
 function _getInterpolationMethod(options) {
    if (options.stepped) {
        return helpers_segment._steppedInterpolation;
    }
    if (options.tension || options.cubicInterpolationMode === 'monotone') {
        return helpers_segment._bezierInterpolation;
    }
    return helpers_segment._pointInLine;
}
function strokePathWithCache(ct***REMOVED***, line, start, count) {
    let path = line._path;
    if (!path) {
        path = line._path = new Path2D();
        if (line.path(path, start, count)) {
            path.closePath();
        }
    }
    setStyle(ct***REMOVED***, line.options);
    ct***REMOVED***.stroke(path);
}
function strokePathDirect(ct***REMOVED***, line, start, count) {
    const { segments , options  } = line;
    const segmentMethod = _getSegmentMethod(line);
    for (const segment of segments){
        setStyle(ct***REMOVED***, options, segment.style);
        ct***REMOVED***.beginPath();
        if (segmentMethod(ct***REMOVED***, line, segment, {
            start,
            end: start + count - 1
        })) {
            ct***REMOVED***.closePath();
        }
        ct***REMOVED***.stroke();
    }
}
const usePath2D = typeof Path2D === 'function';
function draw(ct***REMOVED***, line, start, count) {
    if (usePath2D && !line.options.segment) {
        strokePathWithCache(ct***REMOVED***, line, start, count);
    } else {
        strokePathDirect(ct***REMOVED***, line, start, count);
    }
}
class LineElement e***REMOVED***tends Element {
    static id = 'line';
 static defaults = {
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        borderWidth: 3,
        capBezierPoints: true,
        cubicInterpolationMode: 'default',
        fill: false,
        spanGaps: false,
        stepped: false,
        tension: 0
    };
 static defaultRoutes = {
        backgroundColor: 'backgroundColor',
        borderColor: 'borderColor'
    };
    static descriptors = {
        _scriptable: true,
        _inde***REMOVED***able: (name)=>name !== 'borderDash' && name !== 'fill'
    };
    constructor(cfg){
        super();
        this.animated = true;
        this.options = undefined;
        this._chart = undefined;
        this._loop = undefined;
        this._fullLoop = undefined;
        this._path = undefined;
        this._points = undefined;
        this._segments = undefined;
        this._decimated = false;
        this._pointsUpdated = false;
        this._datasetInde***REMOVED*** = undefined;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    updateControlPoints(chartArea, inde***REMOVED***A***REMOVED***is) {
        const options = this.options;
        if ((options.tension || options.cubicInterpolationMode === 'monotone') && !options.stepped && !this._pointsUpdated) {
            const loop = options.spanGaps ? this._loop : this._fullLoop;
            helpers_segment._updateBezierControlPoints(this._points, options, chartArea, loop, inde***REMOVED***A***REMOVED***is);
            this._pointsUpdated = true;
        }
    }
    set points(points) {
        this._points = points;
        delete this._segments;
        delete this._path;
        this._pointsUpdated = false;
    }
    get points() {
        return this._points;
    }
    get segments() {
        return this._segments || (this._segments = helpers_segment._computeSegments(this, this.options.segment));
    }
 first() {
        const segments = this.segments;
        const points = this.points;
        return segments.length && points[segments[0].start];
    }
 last() {
        const segments = this.segments;
        const points = this.points;
        const count = segments.length;
        return count && points[segments[count - 1].end];
    }
 interpolate(point, property) {
        const options = this.options;
        const value = point[property];
        const points = this.points;
        const segments = helpers_segment._boundSegments(this, {
            property,
            start: value,
            end: value
        });
        if (!segments.length) {
            return;
        }
        const result = [];
        const _interpolate = _getInterpolationMethod(options);
        let i, ilen;
        for(i = 0, ilen = segments.length; i < ilen; ++i){
            const { start , end  } = segments[i];
            const p1 = points[start];
            const p2 = points[end];
            if (p1 === p2) {
                result.push(p1);
                continue;
            }
            const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
            const interpolated = _interpolate(p1, p2, t, options.stepped);
            interpolated[property] = point[property];
            result.push(interpolated);
        }
        return result.length === 1 ? result[0] : result;
    }
 pathSegment(ct***REMOVED***, segment, params) {
        const segmentMethod = _getSegmentMethod(this);
        return segmentMethod(ct***REMOVED***, this, segment, params);
    }
 path(ct***REMOVED***, start, count) {
        const segments = this.segments;
        const segmentMethod = _getSegmentMethod(this);
        let loop = this._loop;
        start = start || 0;
        count = count || this.points.length - start;
        for (const segment of segments){
            loop &= segmentMethod(ct***REMOVED***, this, segment, {
                start,
                end: start + count - 1
            });
        }
        return !!loop;
    }
 draw(ct***REMOVED***, chartArea, start, count) {
        const options = this.options || {};
        const points = this.points || [];
        if (points.length && options.borderWidth) {
            ct***REMOVED***.save();
            draw(ct***REMOVED***, this, start, count);
            ct***REMOVED***.restore();
        }
        if (this.animated) {
            this._pointsUpdated = false;
            this._path = undefined;
        }
    }
}

function inRange$1(el, pos, a***REMOVED***is, useFinalPosition) {
    const options = el.options;
    const { [a***REMOVED***is]: value  } = el.getProps([
        a***REMOVED***is
    ], useFinalPosition);
    return Math.abs(pos - value) < options.radius + options.hitRadius;
}
class PointElement e***REMOVED***tends Element {
    static id = 'point';
    parsed;
    skip;
    stop;
    /**
   * @type {any}
   */ static defaults = {
        borderWidth: 1,
        hitRadius: 1,
        hoverBorderWidth: 1,
        hoverRadius: 4,
        pointStyle: 'circle',
        radius: 3,
        rotation: 0
    };
    /**
   * @type {any}
   */ static defaultRoutes = {
        backgroundColor: 'backgroundColor',
        borderColor: 'borderColor'
    };
    constructor(cfg){
        super();
        this.options = undefined;
        this.parsed = undefined;
        this.skip = undefined;
        this.stop = undefined;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    inRange(mouseX, mouseY, useFinalPosition) {
        const options = this.options;
        const { ***REMOVED*** , y  } = this.getProps([
            '***REMOVED***',
            'y'
        ], useFinalPosition);
        return Math.pow(mouseX - ***REMOVED***, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
    }
    inXRange(mouseX, useFinalPosition) {
        return inRange$1(this, mouseX, '***REMOVED***', useFinalPosition);
    }
    inYRange(mouseY, useFinalPosition) {
        return inRange$1(this, mouseY, 'y', useFinalPosition);
    }
    getCenterPoint(useFinalPosition) {
        const { ***REMOVED*** , y  } = this.getProps([
            '***REMOVED***',
            'y'
        ], useFinalPosition);
        return {
            ***REMOVED***,
            y
        };
    }
    size(options) {
        options = options || this.options || {};
        let radius = options.radius || 0;
        radius = Math.ma***REMOVED***(radius, radius && options.hoverRadius || 0);
        const borderWidth = radius && options.borderWidth || 0;
        return (radius + borderWidth) * 2;
    }
    draw(ct***REMOVED***, area) {
        const options = this.options;
        if (this.skip || options.radius < 0.1 || !helpers_segment._isPointInArea(this, area, this.size(options) / 2)) {
            return;
        }
        ct***REMOVED***.strokeStyle = options.borderColor;
        ct***REMOVED***.lineWidth = options.borderWidth;
        ct***REMOVED***.fillStyle = options.backgroundColor;
        helpers_segment.drawPoint(ct***REMOVED***, options, this.***REMOVED***, this.y);
    }
    getRange() {
        const options = this.options || {};
        // @ts-e***REMOVED***pect-error Fallbacks should never be hit in practice
        return options.radius + options.hitRadius;
    }
}

function getBarBounds(bar, useFinalPosition) {
    const { ***REMOVED*** , y , base , width , height  } =  bar.getProps([
        '***REMOVED***',
        'y',
        'base',
        'width',
        'height'
    ], useFinalPosition);
    let left, right, top, bottom, half;
    if (bar.horizontal) {
        half = height / 2;
        left = Math.min(***REMOVED***, base);
        right = Math.ma***REMOVED***(***REMOVED***, base);
        top = y - half;
        bottom = y + half;
    } else {
        half = width / 2;
        left = ***REMOVED*** - half;
        right = ***REMOVED*** + half;
        top = Math.min(y, base);
        bottom = Math.ma***REMOVED***(y, base);
    }
    return {
        left,
        top,
        right,
        bottom
    };
}
function skipOrLimit(skip, value, min, ma***REMOVED***) {
    return skip ? 0 : helpers_segment._limitValue(value, min, ma***REMOVED***);
}
function parseBorderWidth(bar, ma***REMOVED***W, ma***REMOVED***H) {
    const value = bar.options.borderWidth;
    const skip = bar.borderSkipped;
    const o = helpers_segment.toTRBL(value);
    return {
        t: skipOrLimit(skip.top, o.top, 0, ma***REMOVED***H),
        r: skipOrLimit(skip.right, o.right, 0, ma***REMOVED***W),
        b: skipOrLimit(skip.bottom, o.bottom, 0, ma***REMOVED***H),
        l: skipOrLimit(skip.left, o.left, 0, ma***REMOVED***W)
    };
}
function parseBorderRadius(bar, ma***REMOVED***W, ma***REMOVED***H) {
    const { enableBorderRadius  } = bar.getProps([
        'enableBorderRadius'
    ]);
    const value = bar.options.borderRadius;
    const o = helpers_segment.toTRBLCorners(value);
    const ma***REMOVED***R = Math.min(ma***REMOVED***W, ma***REMOVED***H);
    const skip = bar.borderSkipped;
    const enableBorder = enableBorderRadius || helpers_segment.isObject(value);
    return {
        topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o.topLeft, 0, ma***REMOVED***R),
        topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o.topRight, 0, ma***REMOVED***R),
        bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o.bottomLeft, 0, ma***REMOVED***R),
        bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o.bottomRight, 0, ma***REMOVED***R)
    };
}
function boundingRects(bar) {
    const bounds = getBarBounds(bar);
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const border = parseBorderWidth(bar, width / 2, height / 2);
    const radius = parseBorderRadius(bar, width / 2, height / 2);
    return {
        outer: {
            ***REMOVED***: bounds.left,
            y: bounds.top,
            w: width,
            h: height,
            radius
        },
        inner: {
            ***REMOVED***: bounds.left + border.l,
            y: bounds.top + border.t,
            w: width - border.l - border.r,
            h: height - border.t - border.b,
            radius: {
                topLeft: Math.ma***REMOVED***(0, radius.topLeft - Math.ma***REMOVED***(border.t, border.l)),
                topRight: Math.ma***REMOVED***(0, radius.topRight - Math.ma***REMOVED***(border.t, border.r)),
                bottomLeft: Math.ma***REMOVED***(0, radius.bottomLeft - Math.ma***REMOVED***(border.b, border.l)),
                bottomRight: Math.ma***REMOVED***(0, radius.bottomRight - Math.ma***REMOVED***(border.b, border.r))
            }
        }
    };
}
function inRange(bar, ***REMOVED***, y, useFinalPosition) {
    const skipX = ***REMOVED*** === null;
    const skipY = y === null;
    const skipBoth = skipX && skipY;
    const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
    return bounds && (skipX || helpers_segment._isBetween(***REMOVED***, bounds.left, bounds.right)) && (skipY || helpers_segment._isBetween(y, bounds.top, bounds.bottom));
}
function hasRadius(radius) {
    return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
}
 function addNormalRectPath(ct***REMOVED***, rect) {
    ct***REMOVED***.rect(rect.***REMOVED***, rect.y, rect.w, rect.h);
}
function inflateRect(rect, amount, refRect = {}) {
    const ***REMOVED*** = rect.***REMOVED*** !== refRect.***REMOVED*** ? -amount : 0;
    const y = rect.y !== refRect.y ? -amount : 0;
    const w = (rect.***REMOVED*** + rect.w !== refRect.***REMOVED*** + refRect.w ? amount : 0) - ***REMOVED***;
    const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
    return {
        ***REMOVED***: rect.***REMOVED*** + ***REMOVED***,
        y: rect.y + y,
        w: rect.w + w,
        h: rect.h + h,
        radius: rect.radius
    };
}
class BarElement e***REMOVED***tends Element {
    static id = 'bar';
 static defaults = {
        borderSkipped: 'start',
        borderWidth: 0,
        borderRadius: 0,
        inflateAmount: 'auto',
        pointStyle: undefined
    };
 static defaultRoutes = {
        backgroundColor: 'backgroundColor',
        borderColor: 'borderColor'
    };
    constructor(cfg){
        super();
        this.options = undefined;
        this.horizontal = undefined;
        this.base = undefined;
        this.width = undefined;
        this.height = undefined;
        this.inflateAmount = undefined;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    draw(ct***REMOVED***) {
        const { inflateAmount , options: { borderColor , backgroundColor  }  } = this;
        const { inner , outer  } = boundingRects(this);
        const addRectPath = hasRadius(outer.radius) ? helpers_segment.addRoundedRectPath : addNormalRectPath;
        ct***REMOVED***.save();
        if (outer.w !== inner.w || outer.h !== inner.h) {
            ct***REMOVED***.beginPath();
            addRectPath(ct***REMOVED***, inflateRect(outer, inflateAmount, inner));
            ct***REMOVED***.clip();
            addRectPath(ct***REMOVED***, inflateRect(inner, -inflateAmount, outer));
            ct***REMOVED***.fillStyle = borderColor;
            ct***REMOVED***.fill('evenodd');
        }
        ct***REMOVED***.beginPath();
        addRectPath(ct***REMOVED***, inflateRect(inner, inflateAmount));
        ct***REMOVED***.fillStyle = backgroundColor;
        ct***REMOVED***.fill();
        ct***REMOVED***.restore();
    }
    inRange(mouseX, mouseY, useFinalPosition) {
        return inRange(this, mouseX, mouseY, useFinalPosition);
    }
    inXRange(mouseX, useFinalPosition) {
        return inRange(this, mouseX, null, useFinalPosition);
    }
    inYRange(mouseY, useFinalPosition) {
        return inRange(this, null, mouseY, useFinalPosition);
    }
    getCenterPoint(useFinalPosition) {
        const { ***REMOVED*** , y , base , horizontal  } =  this.getProps([
            '***REMOVED***',
            'y',
            'base',
            'horizontal'
        ], useFinalPosition);
        return {
            ***REMOVED***: horizontal ? (***REMOVED*** + base) / 2 : ***REMOVED***,
            y: horizontal ? y : (y + base) / 2
        };
    }
    getRange(a***REMOVED***is) {
        return a***REMOVED***is === '***REMOVED***' ? this.width / 2 : this.height / 2;
    }
}

var elements = /*#__PURE__*/Object.freeze({
__proto__: null,
ArcElement: ArcElement,
BarElement: BarElement,
LineElement: LineElement,
PointElement: PointElement
});

const BORDER_COLORS = [
    'rgb(54, 162, 235)',
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)' // grey
];
// Border colors with 50% transparency
const BACKGROUND_COLORS = /* #__PURE__ */ BORDER_COLORS.map((color)=>color.replace('rgb(', 'rgba(').replace(')', ', 0.5)'));
function getBorderColor(i) {
    return BORDER_COLORS[i % BORDER_COLORS.length];
}
function getBackgroundColor(i) {
    return BACKGROUND_COLORS[i % BACKGROUND_COLORS.length];
}
function colorizeDefaultDataset(dataset, i) {
    dataset.borderColor = getBorderColor(i);
    dataset.backgroundColor = getBackgroundColor(i);
    return ++i;
}
function colorizeDoughnutDataset(dataset, i) {
    dataset.backgroundColor = dataset.data.map(()=>getBorderColor(i++));
    return i;
}
function colorizePolarAreaDataset(dataset, i) {
    dataset.backgroundColor = dataset.data.map(()=>getBackgroundColor(i++));
    return i;
}
function getColorizer(chart) {
    let i = 0;
    return (dataset, datasetInde***REMOVED***)=>{
        const controller = chart.getDatasetMeta(datasetInde***REMOVED***).controller;
        if (controller instanceof DoughnutController) {
            i = colorizeDoughnutDataset(dataset, i);
        } else if (controller instanceof PolarAreaController) {
            i = colorizePolarAreaDataset(dataset, i);
        } else if (controller) {
            i = colorizeDefaultDataset(dataset, i);
        }
    };
}
function containsColorsDefinitions(descriptors) {
    let k;
    for(k in descriptors){
        if (descriptors[k].borderColor || descriptors[k].backgroundColor) {
            return true;
        }
    }
    return false;
}
function containsColorsDefinition(descriptor) {
    return descriptor && (descriptor.borderColor || descriptor.backgroundColor);
}
var plugin_colors = {
    id: 'colors',
    defaults: {
        enabled: true,
        forceOverride: false
    },
    beforeLayout (chart, _args, options) {
        if (!options.enabled) {
            return;
        }
        const { data: { datasets  } , options: chartOptions  } = chart.config;
        const { elements  } = chartOptions;
        if (!options.forceOverride && (containsColorsDefinitions(datasets) || containsColorsDefinition(chartOptions) || elements && containsColorsDefinitions(elements))) {
            return;
        }
        const colorizer = getColorizer(chart);
        datasets.forEach(colorizer);
    }
};

function lttbDecimation(data, start, count, availableWidth, options) {
 const samples = options.samples || availableWidth;
    if (samples >= count) {
        return data.slice(start, start + count);
    }
    const decimated = [];
    const bucketWidth = (count - 2) / (samples - 2);
    let sampledInde***REMOVED*** = 0;
    const endInde***REMOVED*** = start + count - 1;
    let a = start;
    let i, ma***REMOVED***AreaPoint, ma***REMOVED***Area, area, ne***REMOVED***tA;
    decimated[sampledInde***REMOVED***++] = data[a];
    for(i = 0; i < samples - 2; i++){
        let avgX = 0;
        let avgY = 0;
        let j;
        const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
        const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
        const avgRangeLength = avgRangeEnd - avgRangeStart;
        for(j = avgRangeStart; j < avgRangeEnd; j++){
            avgX += data[j].***REMOVED***;
            avgY += data[j].y;
        }
        avgX /= avgRangeLength;
        avgY /= avgRangeLength;
        const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
        const rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start;
        const { ***REMOVED***: pointA***REMOVED*** , y: pointAy  } = data[a];
        ma***REMOVED***Area = area = -1;
        for(j = rangeOffs; j < rangeTo; j++){
            area = 0.5 * Math.abs((pointA***REMOVED*** - avgX) * (data[j].y - pointAy) - (pointA***REMOVED*** - data[j].***REMOVED***) * (avgY - pointAy));
            if (area > ma***REMOVED***Area) {
                ma***REMOVED***Area = area;
                ma***REMOVED***AreaPoint = data[j];
                ne***REMOVED***tA = j;
            }
        }
        decimated[sampledInde***REMOVED***++] = ma***REMOVED***AreaPoint;
        a = ne***REMOVED***tA;
    }
    decimated[sampledInde***REMOVED***++] = data[endInde***REMOVED***];
    return decimated;
}
function minMa***REMOVED***Decimation(data, start, count, availableWidth) {
    let avgX = 0;
    let countX = 0;
    let i, point, ***REMOVED***, y, prevX, minInde***REMOVED***, ma***REMOVED***Inde***REMOVED***, startInde***REMOVED***, minY, ma***REMOVED***Y;
    const decimated = [];
    const endInde***REMOVED*** = start + count - 1;
    const ***REMOVED***Min = data[start].***REMOVED***;
    const ***REMOVED***Ma***REMOVED*** = data[endInde***REMOVED***].***REMOVED***;
    const d***REMOVED*** = ***REMOVED***Ma***REMOVED*** - ***REMOVED***Min;
    for(i = start; i < start + count; ++i){
        point = data[i];
        ***REMOVED*** = (point.***REMOVED*** - ***REMOVED***Min) / d***REMOVED*** * availableWidth;
        y = point.y;
        const truncX = ***REMOVED*** | 0;
        if (truncX === prevX) {
            if (y < minY) {
                minY = y;
                minInde***REMOVED*** = i;
            } else if (y > ma***REMOVED***Y) {
                ma***REMOVED***Y = y;
                ma***REMOVED***Inde***REMOVED*** = i;
            }
            avgX = (countX * avgX + point.***REMOVED***) / ++countX;
        } else {
            const lastInde***REMOVED*** = i - 1;
            if (!helpers_segment.isNullOrUndef(minInde***REMOVED***) && !helpers_segment.isNullOrUndef(ma***REMOVED***Inde***REMOVED***)) {
                const intermediateInde***REMOVED***1 = Math.min(minInde***REMOVED***, ma***REMOVED***Inde***REMOVED***);
                const intermediateInde***REMOVED***2 = Math.ma***REMOVED***(minInde***REMOVED***, ma***REMOVED***Inde***REMOVED***);
                if (intermediateInde***REMOVED***1 !== startInde***REMOVED*** && intermediateInde***REMOVED***1 !== lastInde***REMOVED***) {
                    decimated.push({
                        ...data[intermediateInde***REMOVED***1],
                        ***REMOVED***: avgX
                    });
                }
                if (intermediateInde***REMOVED***2 !== startInde***REMOVED*** && intermediateInde***REMOVED***2 !== lastInde***REMOVED***) {
                    decimated.push({
                        ...data[intermediateInde***REMOVED***2],
                        ***REMOVED***: avgX
                    });
                }
            }
            if (i > 0 && lastInde***REMOVED*** !== startInde***REMOVED***) {
                decimated.push(data[lastInde***REMOVED***]);
            }
            decimated.push(point);
            prevX = truncX;
            countX = 0;
            minY = ma***REMOVED***Y = y;
            minInde***REMOVED*** = ma***REMOVED***Inde***REMOVED*** = startInde***REMOVED*** = i;
        }
    }
    return decimated;
}
function cleanDecimatedDataset(dataset) {
    if (dataset._decimated) {
        const data = dataset._data;
        delete dataset._decimated;
        delete dataset._data;
        Object.defineProperty(dataset, 'data', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: data
        });
    }
}
function cleanDecimatedData(chart) {
    chart.data.datasets.forEach((dataset)=>{
        cleanDecimatedDataset(dataset);
    });
}
function getStartAndCountOfVisiblePointsSimplified(meta, points) {
    const pointCount = points.length;
    let start = 0;
    let count;
    const { iScale  } = meta;
    const { min , ma***REMOVED*** , minDefined , ma***REMOVED***Defined  } = iScale.getUserBounds();
    if (minDefined) {
        start = helpers_segment._limitValue(helpers_segment._lookupByKey(points, iScale.a***REMOVED***is, min).lo, 0, pointCount - 1);
    }
    if (ma***REMOVED***Defined) {
        count = helpers_segment._limitValue(helpers_segment._lookupByKey(points, iScale.a***REMOVED***is, ma***REMOVED***).hi + 1, start, pointCount) - start;
    } else {
        count = pointCount - start;
    }
    return {
        start,
        count
    };
}
var plugin_decimation = {
    id: 'decimation',
    defaults: {
        algorithm: 'min-ma***REMOVED***',
        enabled: false
    },
    beforeElementsUpdate: (chart, args, options)=>{
        if (!options.enabled) {
            cleanDecimatedData(chart);
            return;
        }
        const availableWidth = chart.width;
        chart.data.datasets.forEach((dataset, datasetInde***REMOVED***)=>{
            const { _data , inde***REMOVED***A***REMOVED***is  } = dataset;
            const meta = chart.getDatasetMeta(datasetInde***REMOVED***);
            const data = _data || dataset.data;
            if (helpers_segment.resolve([
                inde***REMOVED***A***REMOVED***is,
                chart.options.inde***REMOVED***A***REMOVED***is
            ]) === 'y') {
                return;
            }
            if (!meta.controller.supportsDecimation) {
                return;
            }
            const ***REMOVED***A***REMOVED***is = chart.scales[meta.***REMOVED***A***REMOVED***isID];
            if (***REMOVED***A***REMOVED***is.type !== 'linear' && ***REMOVED***A***REMOVED***is.type !== 'time') {
                return;
            }
            if (chart.options.parsing) {
                return;
            }
            let { start , count  } = getStartAndCountOfVisiblePointsSimplified(meta, data);
            const threshold = options.threshold || 4 * availableWidth;
            if (count <= threshold) {
                cleanDecimatedDataset(dataset);
                return;
            }
            if (helpers_segment.isNullOrUndef(_data)) {
                dataset._data = data;
                delete dataset.data;
                Object.defineProperty(dataset, 'data', {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        return this._decimated;
                    },
                    set: function(d) {
                        this._data = d;
                    }
                });
            }
            let decimated;
            switch(options.algorithm){
                case 'lttb':
                    decimated = lttbDecimation(data, start, count, availableWidth, options);
                    break;
                case 'min-ma***REMOVED***':
                    decimated = minMa***REMOVED***Decimation(data, start, count, availableWidth);
                    break;
                default:
                    throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
            }
            dataset._decimated = decimated;
        });
    },
    destroy (chart) {
        cleanDecimatedData(chart);
    }
};

function _segments(line, target, property) {
    const segments = line.segments;
    const points = line.points;
    const tpoints = target.points;
    const parts = [];
    for (const segment of segments){
        let { start , end  } = segment;
        end = _findSegmentEnd(start, end, points);
        const bounds = _getBounds(property, points[start], points[end], segment.loop);
        if (!target.segments) {
            parts.push({
                source: segment,
                target: bounds,
                start: points[start],
                end: points[end]
            });
            continue;
        }
        const targetSegments = helpers_segment._boundSegments(target, bounds);
        for (const tgt of targetSegments){
            const subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
            const fillSources = helpers_segment._boundSegment(segment, points, subBounds);
            for (const fillSource of fillSources){
                parts.push({
                    source: fillSource,
                    target: tgt,
                    start: {
                        [property]: _getEdge(bounds, subBounds, 'start', Math.ma***REMOVED***)
                    },
                    end: {
                        [property]: _getEdge(bounds, subBounds, 'end', Math.min)
                    }
                });
            }
        }
    }
    return parts;
}
function _getBounds(property, first, last, loop) {
    if (loop) {
        return;
    }
    let start = first[property];
    let end = last[property];
    if (property === 'angle') {
        start = helpers_segment._normalizeAngle(start);
        end = helpers_segment._normalizeAngle(end);
    }
    return {
        property,
        start,
        end
    };
}
function _pointsFromSegments(boundary, line) {
    const { ***REMOVED*** =null , y =null  } = boundary || {};
    const linePoints = line.points;
    const points = [];
    line.segments.forEach(({ start , end  })=>{
        end = _findSegmentEnd(start, end, linePoints);
        const first = linePoints[start];
        const last = linePoints[end];
        if (y !== null) {
            points.push({
                ***REMOVED***: first.***REMOVED***,
                y
            });
            points.push({
                ***REMOVED***: last.***REMOVED***,
                y
            });
        } else if (***REMOVED*** !== null) {
            points.push({
                ***REMOVED***,
                y: first.y
            });
            points.push({
                ***REMOVED***,
                y: last.y
            });
        }
    });
    return points;
}
function _findSegmentEnd(start, end, points) {
    for(; end > start; end--){
        const point = points[end];
        if (!isNaN(point.***REMOVED***) && !isNaN(point.y)) {
            break;
        }
    }
    return end;
}
function _getEdge(a, b, prop, fn) {
    if (a && b) {
        return fn(a[prop], b[prop]);
    }
    return a ? a[prop] : b ? b[prop] : 0;
}

function _createBoundaryLine(boundary, line) {
    let points = [];
    let _loop = false;
    if (helpers_segment.isArray(boundary)) {
        _loop = true;
        points = boundary;
    } else {
        points = _pointsFromSegments(boundary, line);
    }
    return points.length ? new LineElement({
        points,
        options: {
            tension: 0
        },
        _loop,
        _fullLoop: _loop
    }) : null;
}
function _shouldApplyFill(source) {
    return source && source.fill !== false;
}

function _resolveTarget(sources, inde***REMOVED***, propagate) {
    const source = sources[inde***REMOVED***];
    let fill = source.fill;
    const visited = [
        inde***REMOVED***
    ];
    let target;
    if (!propagate) {
        return fill;
    }
    while(fill !== false && visited.inde***REMOVED***Of(fill) === -1){
        if (!helpers_segment.isNumberFinite(fill)) {
            return fill;
        }
        target = sources[fill];
        if (!target) {
            return false;
        }
        if (target.visible) {
            return fill;
        }
        visited.push(fill);
        fill = target.fill;
    }
    return false;
}
 function _decodeFill(line, inde***REMOVED***, count) {
     const fill = parseFillOption(line);
    if (helpers_segment.isObject(fill)) {
        return isNaN(fill.value) ? false : fill;
    }
    let target = parseFloat(fill);
    if (helpers_segment.isNumberFinite(target) && Math.floor(target) === target) {
        return decodeTargetInde***REMOVED***(fill[0], inde***REMOVED***, target, count);
    }
    return [
        'origin',
        'start',
        'end',
        'stack',
        'shape'
    ].inde***REMOVED***Of(fill) >= 0 && fill;
}
function decodeTargetInde***REMOVED***(firstCh, inde***REMOVED***, target, count) {
    if (firstCh === '-' || firstCh === '+') {
        target = inde***REMOVED*** + target;
    }
    if (target === inde***REMOVED*** || target < 0 || target >= count) {
        return false;
    }
    return target;
}
 function _getTargetPi***REMOVED***el(fill, scale) {
    let pi***REMOVED***el = null;
    if (fill === 'start') {
        pi***REMOVED***el = scale.bottom;
    } else if (fill === 'end') {
        pi***REMOVED***el = scale.top;
    } else if (helpers_segment.isObject(fill)) {
        pi***REMOVED***el = scale.getPi***REMOVED***elForValue(fill.value);
    } else if (scale.getBasePi***REMOVED***el) {
        pi***REMOVED***el = scale.getBasePi***REMOVED***el();
    }
    return pi***REMOVED***el;
}
 function _getTargetValue(fill, scale, startValue) {
    let value;
    if (fill === 'start') {
        value = startValue;
    } else if (fill === 'end') {
        value = scale.options.reverse ? scale.min : scale.ma***REMOVED***;
    } else if (helpers_segment.isObject(fill)) {
        value = fill.value;
    } else {
        value = scale.getBaseValue();
    }
    return value;
}
 function parseFillOption(line) {
    const options = line.options;
    const fillOption = options.fill;
    let fill = helpers_segment.valueOrDefault(fillOption && fillOption.target, fillOption);
    if (fill === undefined) {
        fill = !!options.backgroundColor;
    }
    if (fill === false || fill === null) {
        return false;
    }
    if (fill === true) {
        return 'origin';
    }
    return fill;
}

function _buildStackLine(source) {
    const { scale , inde***REMOVED*** , line  } = source;
    const points = [];
    const segments = line.segments;
    const sourcePoints = line.points;
    const linesBelow = getLinesBelow(scale, inde***REMOVED***);
    linesBelow.push(_createBoundaryLine({
        ***REMOVED***: null,
        y: scale.bottom
    }, line));
    for(let i = 0; i < segments.length; i++){
        const segment = segments[i];
        for(let j = segment.start; j <= segment.end; j++){
            addPointsBelow(points, sourcePoints[j], linesBelow);
        }
    }
    return new LineElement({
        points,
        options: {}
    });
}
 function getLinesBelow(scale, inde***REMOVED***) {
    const below = [];
    const metas = scale.getMatchingVisibleMetas('line');
    for(let i = 0; i < metas.length; i++){
        const meta = metas[i];
        if (meta.inde***REMOVED*** === inde***REMOVED***) {
            break;
        }
        if (!meta.hidden) {
            below.unshift(meta.dataset);
        }
    }
    return below;
}
 function addPointsBelow(points, sourcePoint, linesBelow) {
    const postponed = [];
    for(let j = 0; j < linesBelow.length; j++){
        const line = linesBelow[j];
        const { first , last , point  } = findPoint(line, sourcePoint, '***REMOVED***');
        if (!point || first && last) {
            continue;
        }
        if (first) {
            postponed.unshift(point);
        } else {
            points.push(point);
            if (!last) {
                break;
            }
        }
    }
    points.push(...postponed);
}
 function findPoint(line, sourcePoint, property) {
    const point = line.interpolate(sourcePoint, property);
    if (!point) {
        return {};
    }
    const pointValue = point[property];
    const segments = line.segments;
    const linePoints = line.points;
    let first = false;
    let last = false;
    for(let i = 0; i < segments.length; i++){
        const segment = segments[i];
        const firstValue = linePoints[segment.start][property];
        const lastValue = linePoints[segment.end][property];
        if (helpers_segment._isBetween(pointValue, firstValue, lastValue)) {
            first = pointValue === firstValue;
            last = pointValue === lastValue;
            break;
        }
    }
    return {
        first,
        last,
        point
    };
}

class simpleArc {
    constructor(opts){
        this.***REMOVED*** = opts.***REMOVED***;
        this.y = opts.y;
        this.radius = opts.radius;
    }
    pathSegment(ct***REMOVED***, bounds, opts) {
        const { ***REMOVED*** , y , radius  } = this;
        bounds = bounds || {
            start: 0,
            end: helpers_segment.TAU
        };
        ct***REMOVED***.arc(***REMOVED***, y, radius, bounds.end, bounds.start, true);
        return !opts.bounds;
    }
    interpolate(point) {
        const { ***REMOVED*** , y , radius  } = this;
        const angle = point.angle;
        return {
            ***REMOVED***: ***REMOVED*** + Math.cos(angle) * radius,
            y: y + Math.sin(angle) * radius,
            angle
        };
    }
}

function _getTarget(source) {
    const { chart , fill , line  } = source;
    if (helpers_segment.isNumberFinite(fill)) {
        return getLineByInde***REMOVED***(chart, fill);
    }
    if (fill === 'stack') {
        return _buildStackLine(source);
    }
    if (fill === 'shape') {
        return true;
    }
    const boundary = computeBoundary(source);
    if (boundary instanceof simpleArc) {
        return boundary;
    }
    return _createBoundaryLine(boundary, line);
}
 function getLineByInde***REMOVED***(chart, inde***REMOVED***) {
    const meta = chart.getDatasetMeta(inde***REMOVED***);
    const visible = meta && chart.isDatasetVisible(inde***REMOVED***);
    return visible ? meta.dataset : null;
}
function computeBoundary(source) {
    const scale = source.scale || {};
    if (scale.getPointPositionForValue) {
        return computeCircularBoundary(source);
    }
    return computeLinearBoundary(source);
}
function computeLinearBoundary(source) {
    const { scale ={} , fill  } = source;
    const pi***REMOVED***el = _getTargetPi***REMOVED***el(fill, scale);
    if (helpers_segment.isNumberFinite(pi***REMOVED***el)) {
        const horizontal = scale.isHorizontal();
        return {
            ***REMOVED***: horizontal ? pi***REMOVED***el : null,
            y: horizontal ? null : pi***REMOVED***el
        };
    }
    return null;
}
function computeCircularBoundary(source) {
    const { scale , fill  } = source;
    const options = scale.options;
    const length = scale.getLabels().length;
    const start = options.reverse ? scale.ma***REMOVED*** : scale.min;
    const value = _getTargetValue(fill, scale, start);
    const target = [];
    if (options.grid.circular) {
        const center = scale.getPointPositionForValue(0, start);
        return new simpleArc({
            ***REMOVED***: center.***REMOVED***,
            y: center.y,
            radius: scale.getDistanceFromCenterForValue(value)
        });
    }
    for(let i = 0; i < length; ++i){
        target.push(scale.getPointPositionForValue(i, value));
    }
    return target;
}

function _drawfill(ct***REMOVED***, source, area) {
    const target = _getTarget(source);
    const { line , scale , a***REMOVED***is  } = source;
    const lineOpts = line.options;
    const fillOption = lineOpts.fill;
    const color = lineOpts.backgroundColor;
    const { above =color , below =color  } = fillOption || {};
    if (target && line.points.length) {
        helpers_segment.clipArea(ct***REMOVED***, area);
        doFill(ct***REMOVED***, {
            line,
            target,
            above,
            below,
            area,
            scale,
            a***REMOVED***is
        });
        helpers_segment.unclipArea(ct***REMOVED***);
    }
}
function doFill(ct***REMOVED***, cfg) {
    const { line , target , above , below , area , scale  } = cfg;
    const property = line._loop ? 'angle' : cfg.a***REMOVED***is;
    ct***REMOVED***.save();
    if (property === '***REMOVED***' && below !== above) {
        clipVertical(ct***REMOVED***, target, area.top);
        fill(ct***REMOVED***, {
            line,
            target,
            color: above,
            scale,
            property
        });
        ct***REMOVED***.restore();
        ct***REMOVED***.save();
        clipVertical(ct***REMOVED***, target, area.bottom);
    }
    fill(ct***REMOVED***, {
        line,
        target,
        color: below,
        scale,
        property
    });
    ct***REMOVED***.restore();
}
function clipVertical(ct***REMOVED***, target, clipY) {
    const { segments , points  } = target;
    let first = true;
    let lineLoop = false;
    ct***REMOVED***.beginPath();
    for (const segment of segments){
        const { start , end  } = segment;
        const firstPoint = points[start];
        const lastPoint = points[_findSegmentEnd(start, end, points)];
        if (first) {
            ct***REMOVED***.moveTo(firstPoint.***REMOVED***, firstPoint.y);
            first = false;
        } else {
            ct***REMOVED***.lineTo(firstPoint.***REMOVED***, clipY);
            ct***REMOVED***.lineTo(firstPoint.***REMOVED***, firstPoint.y);
        }
        lineLoop = !!target.pathSegment(ct***REMOVED***, segment, {
            move: lineLoop
        });
        if (lineLoop) {
            ct***REMOVED***.closePath();
        } else {
            ct***REMOVED***.lineTo(lastPoint.***REMOVED***, clipY);
        }
    }
    ct***REMOVED***.lineTo(target.first().***REMOVED***, clipY);
    ct***REMOVED***.closePath();
    ct***REMOVED***.clip();
}
function fill(ct***REMOVED***, cfg) {
    const { line , target , property , color , scale  } = cfg;
    const segments = _segments(line, target, property);
    for (const { source: src , target: tgt , start , end  } of segments){
        const { style: { backgroundColor =color  } = {}  } = src;
        const notShape = target !== true;
        ct***REMOVED***.save();
        ct***REMOVED***.fillStyle = backgroundColor;
        clipBounds(ct***REMOVED***, scale, notShape && _getBounds(property, start, end));
        ct***REMOVED***.beginPath();
        const lineLoop = !!line.pathSegment(ct***REMOVED***, src);
        let loop;
        if (notShape) {
            if (lineLoop) {
                ct***REMOVED***.closePath();
            } else {
                interpolatedLineTo(ct***REMOVED***, target, end, property);
            }
            const targetLoop = !!target.pathSegment(ct***REMOVED***, tgt, {
                move: lineLoop,
                reverse: true
            });
            loop = lineLoop && targetLoop;
            if (!loop) {
                interpolatedLineTo(ct***REMOVED***, target, start, property);
            }
        }
        ct***REMOVED***.closePath();
        ct***REMOVED***.fill(loop ? 'evenodd' : 'nonzero');
        ct***REMOVED***.restore();
    }
}
function clipBounds(ct***REMOVED***, scale, bounds) {
    const { top , bottom  } = scale.chart.chartArea;
    const { property , start , end  } = bounds || {};
    if (property === '***REMOVED***') {
        ct***REMOVED***.beginPath();
        ct***REMOVED***.rect(start, top, end - start, bottom - top);
        ct***REMOVED***.clip();
    }
}
function interpolatedLineTo(ct***REMOVED***, target, point, property) {
    const interpolatedPoint = target.interpolate(point, property);
    if (interpolatedPoint) {
        ct***REMOVED***.lineTo(interpolatedPoint.***REMOVED***, interpolatedPoint.y);
    }
}

var inde***REMOVED*** = {
    id: 'filler',
    afterDatasetsUpdate (chart, _args, options) {
        const count = (chart.data.datasets || []).length;
        const sources = [];
        let meta, i, line, source;
        for(i = 0; i < count; ++i){
            meta = chart.getDatasetMeta(i);
            line = meta.dataset;
            source = null;
            if (line && line.options && line instanceof LineElement) {
                source = {
                    visible: chart.isDatasetVisible(i),
                    inde***REMOVED***: i,
                    fill: _decodeFill(line, i, count),
                    chart,
                    a***REMOVED***is: meta.controller.options.inde***REMOVED***A***REMOVED***is,
                    scale: meta.vScale,
                    line
                };
            }
            meta.$filler = source;
            sources.push(source);
        }
        for(i = 0; i < count; ++i){
            source = sources[i];
            if (!source || source.fill === false) {
                continue;
            }
            source.fill = _resolveTarget(sources, i, options.propagate);
        }
    },
    beforeDraw (chart, _args, options) {
        const draw = options.drawTime === 'beforeDraw';
        const metasets = chart.getSortedVisibleDatasetMetas();
        const area = chart.chartArea;
        for(let i = metasets.length - 1; i >= 0; --i){
            const source = metasets[i].$filler;
            if (!source) {
                continue;
            }
            source.line.updateControlPoints(area, source.a***REMOVED***is);
            if (draw && source.fill) {
                _drawfill(chart.ct***REMOVED***, source, area);
            }
        }
    },
    beforeDatasetsDraw (chart, _args, options) {
        if (options.drawTime !== 'beforeDatasetsDraw') {
            return;
        }
        const metasets = chart.getSortedVisibleDatasetMetas();
        for(let i = metasets.length - 1; i >= 0; --i){
            const source = metasets[i].$filler;
            if (_shouldApplyFill(source)) {
                _drawfill(chart.ct***REMOVED***, source, chart.chartArea);
            }
        }
    },
    beforeDatasetDraw (chart, args, options) {
        const source = args.meta.$filler;
        if (!_shouldApplyFill(source) || options.drawTime !== 'beforeDatasetDraw') {
            return;
        }
        _drawfill(chart.ct***REMOVED***, source, chart.chartArea);
    },
    defaults: {
        propagate: true,
        drawTime: 'beforeDatasetDraw'
    }
};

const getBo***REMOVED***Size = (labelOpts, fontSize)=>{
    let { bo***REMOVED***Height =fontSize , bo***REMOVED***Width =fontSize  } = labelOpts;
    if (labelOpts.usePointStyle) {
        bo***REMOVED***Height = Math.min(bo***REMOVED***Height, fontSize);
        bo***REMOVED***Width = labelOpts.pointStyleWidth || Math.min(bo***REMOVED***Width, fontSize);
    }
    return {
        bo***REMOVED***Width,
        bo***REMOVED***Height,
        itemHeight: Math.ma***REMOVED***(fontSize, bo***REMOVED***Height)
    };
};
const itemsEqual = (a, b)=>a !== null && b !== null && a.datasetInde***REMOVED*** === b.datasetInde***REMOVED*** && a.inde***REMOVED*** === b.inde***REMOVED***;
class Legend e***REMOVED***tends Element {
 constructor(config){
        super();
        this._added = false;
        this.legendHitBo***REMOVED***es = [];
 this._hoveredItem = null;
        this.doughnutMode = false;
        this.chart = config.chart;
        this.options = config.options;
        this.ct***REMOVED*** = config.ct***REMOVED***;
        this.legendItems = undefined;
        this.columnSizes = undefined;
        this.lineWidths = undefined;
        this.ma***REMOVED***Height = undefined;
        this.ma***REMOVED***Width = undefined;
        this.top = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.right = undefined;
        this.height = undefined;
        this.width = undefined;
        this._margins = undefined;
        this.position = undefined;
        this.weight = undefined;
        this.fullSize = undefined;
    }
    update(ma***REMOVED***Width, ma***REMOVED***Height, margins) {
        this.ma***REMOVED***Width = ma***REMOVED***Width;
        this.ma***REMOVED***Height = ma***REMOVED***Height;
        this._margins = margins;
        this.setDimensions();
        this.buildLabels();
        this.fit();
    }
    setDimensions() {
        if (this.isHorizontal()) {
            this.width = this.ma***REMOVED***Width;
            this.left = this._margins.left;
            this.right = this.width;
        } else {
            this.height = this.ma***REMOVED***Height;
            this.top = this._margins.top;
            this.bottom = this.height;
        }
    }
    buildLabels() {
        const labelOpts = this.options.labels || {};
        let legendItems = helpers_segment.callback(labelOpts.generateLabels, [
            this.chart
        ], this) || [];
        if (labelOpts.filter) {
            legendItems = legendItems.filter((item)=>labelOpts.filter(item, this.chart.data));
        }
        if (labelOpts.sort) {
            legendItems = legendItems.sort((a, b)=>labelOpts.sort(a, b, this.chart.data));
        }
        if (this.options.reverse) {
            legendItems.reverse();
        }
        this.legendItems = legendItems;
    }
    fit() {
        const { options , ct***REMOVED***  } = this;
        if (!options.display) {
            this.width = this.height = 0;
            return;
        }
        const labelOpts = options.labels;
        const labelFont = helpers_segment.toFont(labelOpts.font);
        const fontSize = labelFont.size;
        const titleHeight = this._computeTitleHeight();
        const { bo***REMOVED***Width , itemHeight  } = getBo***REMOVED***Size(labelOpts, fontSize);
        let width, height;
        ct***REMOVED***.font = labelFont.string;
        if (this.isHorizontal()) {
            width = this.ma***REMOVED***Width;
            height = this._fitRows(titleHeight, fontSize, bo***REMOVED***Width, itemHeight) + 10;
        } else {
            height = this.ma***REMOVED***Height;
            width = this._fitCols(titleHeight, labelFont, bo***REMOVED***Width, itemHeight) + 10;
        }
        this.width = Math.min(width, options.ma***REMOVED***Width || this.ma***REMOVED***Width);
        this.height = Math.min(height, options.ma***REMOVED***Height || this.ma***REMOVED***Height);
    }
 _fitRows(titleHeight, fontSize, bo***REMOVED***Width, itemHeight) {
        const { ct***REMOVED*** , ma***REMOVED***Width , options: { labels: { padding  }  }  } = this;
        const hitbo***REMOVED***es = this.legendHitBo***REMOVED***es = [];
        const lineWidths = this.lineWidths = [
            0
        ];
        const lineHeight = itemHeight + padding;
        let totalHeight = titleHeight;
        ct***REMOVED***.te***REMOVED***tAlign = 'left';
        ct***REMOVED***.te***REMOVED***tBaseline = 'middle';
        let row = -1;
        let top = -lineHeight;
        this.legendItems.forEach((legendItem, i)=>{
            const itemWidth = bo***REMOVED***Width + fontSize / 2 + ct***REMOVED***.measureTe***REMOVED***t(legendItem.te***REMOVED***t).width;
            if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > ma***REMOVED***Width) {
                totalHeight += lineHeight;
                lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
                top += lineHeight;
                row++;
            }
            hitbo***REMOVED***es[i] = {
                left: 0,
                top,
                row,
                width: itemWidth,
                height: itemHeight
            };
            lineWidths[lineWidths.length - 1] += itemWidth + padding;
        });
        return totalHeight;
    }
    _fitCols(titleHeight, labelFont, bo***REMOVED***Width, _itemHeight) {
        const { ct***REMOVED*** , ma***REMOVED***Height , options: { labels: { padding  }  }  } = this;
        const hitbo***REMOVED***es = this.legendHitBo***REMOVED***es = [];
        const columnSizes = this.columnSizes = [];
        const heightLimit = ma***REMOVED***Height - titleHeight;
        let totalWidth = padding;
        let currentColWidth = 0;
        let currentColHeight = 0;
        let left = 0;
        let col = 0;
        this.legendItems.forEach((legendItem, i)=>{
            const { itemWidth , itemHeight  } = calculateItemSize(bo***REMOVED***Width, labelFont, ct***REMOVED***, legendItem, _itemHeight);
            if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
                totalWidth += currentColWidth + padding;
                columnSizes.push({
                    width: currentColWidth,
                    height: currentColHeight
                });
                left += currentColWidth + padding;
                col++;
                currentColWidth = currentColHeight = 0;
            }
            hitbo***REMOVED***es[i] = {
                left,
                top: currentColHeight,
                col,
                width: itemWidth,
                height: itemHeight
            };
            currentColWidth = Math.ma***REMOVED***(currentColWidth, itemWidth);
            currentColHeight += itemHeight + padding;
        });
        totalWidth += currentColWidth;
        columnSizes.push({
            width: currentColWidth,
            height: currentColHeight
        });
        return totalWidth;
    }
    adjustHitBo***REMOVED***es() {
        if (!this.options.display) {
            return;
        }
        const titleHeight = this._computeTitleHeight();
        const { legendHitBo***REMOVED***es: hitbo***REMOVED***es , options: { align , labels: { padding  } , rtl  }  } = this;
        const rtlHelper = helpers_segment.getRtlAdapter(rtl, this.left, this.width);
        if (this.isHorizontal()) {
            let row = 0;
            let left = helpers_segment._alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
            for (const hitbo***REMOVED*** of hitbo***REMOVED***es){
                if (row !== hitbo***REMOVED***.row) {
                    row = hitbo***REMOVED***.row;
                    left = helpers_segment._alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
                }
                hitbo***REMOVED***.top += this.top + titleHeight + padding;
                hitbo***REMOVED***.left = rtlHelper.leftForLtr(rtlHelper.***REMOVED***(left), hitbo***REMOVED***.width);
                left += hitbo***REMOVED***.width + padding;
            }
        } else {
            let col = 0;
            let top = helpers_segment._alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
            for (const hitbo***REMOVED*** of hitbo***REMOVED***es){
                if (hitbo***REMOVED***.col !== col) {
                    col = hitbo***REMOVED***.col;
                    top = helpers_segment._alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
                }
                hitbo***REMOVED***.top = top;
                hitbo***REMOVED***.left += this.left + padding;
                hitbo***REMOVED***.left = rtlHelper.leftForLtr(rtlHelper.***REMOVED***(hitbo***REMOVED***.left), hitbo***REMOVED***.width);
                top += hitbo***REMOVED***.height + padding;
            }
        }
    }
    isHorizontal() {
        return this.options.position === 'top' || this.options.position === 'bottom';
    }
    draw() {
        if (this.options.display) {
            const ct***REMOVED*** = this.ct***REMOVED***;
            helpers_segment.clipArea(ct***REMOVED***, this);
            this._draw();
            helpers_segment.unclipArea(ct***REMOVED***);
        }
    }
 _draw() {
        const { options: opts , columnSizes , lineWidths , ct***REMOVED***  } = this;
        const { align , labels: labelOpts  } = opts;
        const defaultColor = helpers_segment.defaults.color;
        const rtlHelper = helpers_segment.getRtlAdapter(opts.rtl, this.left, this.width);
        const labelFont = helpers_segment.toFont(labelOpts.font);
        const { padding  } = labelOpts;
        const fontSize = labelFont.size;
        const halfFontSize = fontSize / 2;
        let cursor;
        this.drawTitle();
        ct***REMOVED***.te***REMOVED***tAlign = rtlHelper.te***REMOVED***tAlign('left');
        ct***REMOVED***.te***REMOVED***tBaseline = 'middle';
        ct***REMOVED***.lineWidth = 0.5;
        ct***REMOVED***.font = labelFont.string;
        const { bo***REMOVED***Width , bo***REMOVED***Height , itemHeight  } = getBo***REMOVED***Size(labelOpts, fontSize);
        const drawLegendBo***REMOVED*** = function(***REMOVED***, y, legendItem) {
            if (isNaN(bo***REMOVED***Width) || bo***REMOVED***Width <= 0 || isNaN(bo***REMOVED***Height) || bo***REMOVED***Height < 0) {
                return;
            }
            ct***REMOVED***.save();
            const lineWidth = helpers_segment.valueOrDefault(legendItem.lineWidth, 1);
            ct***REMOVED***.fillStyle = helpers_segment.valueOrDefault(legendItem.fillStyle, defaultColor);
            ct***REMOVED***.lineCap = helpers_segment.valueOrDefault(legendItem.lineCap, 'butt');
            ct***REMOVED***.lineDashOffset = helpers_segment.valueOrDefault(legendItem.lineDashOffset, 0);
            ct***REMOVED***.lineJoin = helpers_segment.valueOrDefault(legendItem.lineJoin, 'miter');
            ct***REMOVED***.lineWidth = lineWidth;
            ct***REMOVED***.strokeStyle = helpers_segment.valueOrDefault(legendItem.strokeStyle, defaultColor);
            ct***REMOVED***.setLineDash(helpers_segment.valueOrDefault(legendItem.lineDash, []));
            if (labelOpts.usePointStyle) {
                const drawOptions = {
                    radius: bo***REMOVED***Height * Math.SQRT2 / 2,
                    pointStyle: legendItem.pointStyle,
                    rotation: legendItem.rotation,
                    borderWidth: lineWidth
                };
                const centerX = rtlHelper.***REMOVED***Plus(***REMOVED***, bo***REMOVED***Width / 2);
                const centerY = y + halfFontSize;
                helpers_segment.drawPointLegend(ct***REMOVED***, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && bo***REMOVED***Width);
            } else {
                const yBo***REMOVED***Top = y + Math.ma***REMOVED***((fontSize - bo***REMOVED***Height) / 2, 0);
                const ***REMOVED***Bo***REMOVED***Left = rtlHelper.leftForLtr(***REMOVED***, bo***REMOVED***Width);
                const borderRadius = helpers_segment.toTRBLCorners(legendItem.borderRadius);
                ct***REMOVED***.beginPath();
                if (Object.values(borderRadius).some((v)=>v !== 0)) {
                    helpers_segment.addRoundedRectPath(ct***REMOVED***, {
                        ***REMOVED***: ***REMOVED***Bo***REMOVED***Left,
                        y: yBo***REMOVED***Top,
                        w: bo***REMOVED***Width,
                        h: bo***REMOVED***Height,
                        radius: borderRadius
                    });
                } else {
                    ct***REMOVED***.rect(***REMOVED***Bo***REMOVED***Left, yBo***REMOVED***Top, bo***REMOVED***Width, bo***REMOVED***Height);
                }
                ct***REMOVED***.fill();
                if (lineWidth !== 0) {
                    ct***REMOVED***.stroke();
                }
            }
            ct***REMOVED***.restore();
        };
        const fillTe***REMOVED***t = function(***REMOVED***, y, legendItem) {
            helpers_segment.renderTe***REMOVED***t(ct***REMOVED***, legendItem.te***REMOVED***t, ***REMOVED***, y + itemHeight / 2, labelFont, {
                strikethrough: legendItem.hidden,
                te***REMOVED***tAlign: rtlHelper.te***REMOVED***tAlign(legendItem.te***REMOVED***tAlign)
            });
        };
        const isHorizontal = this.isHorizontal();
        const titleHeight = this._computeTitleHeight();
        if (isHorizontal) {
            cursor = {
                ***REMOVED***: helpers_segment._alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
                y: this.top + padding + titleHeight,
                line: 0
            };
        } else {
            cursor = {
                ***REMOVED***: this.left + padding,
                y: helpers_segment._alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
                line: 0
            };
        }
        helpers_segment.overrideTe***REMOVED***tDirection(this.ct***REMOVED***, opts.te***REMOVED***tDirection);
        const lineHeight = itemHeight + padding;
        this.legendItems.forEach((legendItem, i)=>{
            ct***REMOVED***.strokeStyle = legendItem.fontColor;
            ct***REMOVED***.fillStyle = legendItem.fontColor;
            const te***REMOVED***tWidth = ct***REMOVED***.measureTe***REMOVED***t(legendItem.te***REMOVED***t).width;
            const te***REMOVED***tAlign = rtlHelper.te***REMOVED***tAlign(legendItem.te***REMOVED***tAlign || (legendItem.te***REMOVED***tAlign = labelOpts.te***REMOVED***tAlign));
            const width = bo***REMOVED***Width + halfFontSize + te***REMOVED***tWidth;
            let ***REMOVED*** = cursor.***REMOVED***;
            let y = cursor.y;
            rtlHelper.setWidth(this.width);
            if (isHorizontal) {
                if (i > 0 && ***REMOVED*** + width + padding > this.right) {
                    y = cursor.y += lineHeight;
                    cursor.line++;
                    ***REMOVED*** = cursor.***REMOVED*** = helpers_segment._alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
                }
            } else if (i > 0 && y + lineHeight > this.bottom) {
                ***REMOVED*** = cursor.***REMOVED*** = ***REMOVED*** + columnSizes[cursor.line].width + padding;
                cursor.line++;
                y = cursor.y = helpers_segment._alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
            }
            const realX = rtlHelper.***REMOVED***(***REMOVED***);
            drawLegendBo***REMOVED***(realX, y, legendItem);
            ***REMOVED*** = helpers_segment._te***REMOVED***tX(te***REMOVED***tAlign, ***REMOVED*** + bo***REMOVED***Width + halfFontSize, isHorizontal ? ***REMOVED*** + width : this.right, opts.rtl);
            fillTe***REMOVED***t(rtlHelper.***REMOVED***(***REMOVED***), y, legendItem);
            if (isHorizontal) {
                cursor.***REMOVED*** += width + padding;
            } else if (typeof legendItem.te***REMOVED***t !== 'string') {
                const fontLineHeight = labelFont.lineHeight;
                cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight) + padding;
            } else {
                cursor.y += lineHeight;
            }
        });
        helpers_segment.restoreTe***REMOVED***tDirection(this.ct***REMOVED***, opts.te***REMOVED***tDirection);
    }
 drawTitle() {
        const opts = this.options;
        const titleOpts = opts.title;
        const titleFont = helpers_segment.toFont(titleOpts.font);
        const titlePadding = helpers_segment.toPadding(titleOpts.padding);
        if (!titleOpts.display) {
            return;
        }
        const rtlHelper = helpers_segment.getRtlAdapter(opts.rtl, this.left, this.width);
        const ct***REMOVED*** = this.ct***REMOVED***;
        const position = titleOpts.position;
        const halfFontSize = titleFont.size / 2;
        const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
        let y;
        let left = this.left;
        let ma***REMOVED***Width = this.width;
        if (this.isHorizontal()) {
            ma***REMOVED***Width = Math.ma***REMOVED***(...this.lineWidths);
            y = this.top + topPaddingPlusHalfFontSize;
            left = helpers_segment._alignStartEnd(opts.align, left, this.right - ma***REMOVED***Width);
        } else {
            const ma***REMOVED***Height = this.columnSizes.reduce((acc, size)=>Math.ma***REMOVED***(acc, size.height), 0);
            y = topPaddingPlusHalfFontSize + helpers_segment._alignStartEnd(opts.align, this.top, this.bottom - ma***REMOVED***Height - opts.labels.padding - this._computeTitleHeight());
        }
        const ***REMOVED*** = helpers_segment._alignStartEnd(position, left, left + ma***REMOVED***Width);
        ct***REMOVED***.te***REMOVED***tAlign = rtlHelper.te***REMOVED***tAlign(helpers_segment._toLeftRightCenter(position));
        ct***REMOVED***.te***REMOVED***tBaseline = 'middle';
        ct***REMOVED***.strokeStyle = titleOpts.color;
        ct***REMOVED***.fillStyle = titleOpts.color;
        ct***REMOVED***.font = titleFont.string;
        helpers_segment.renderTe***REMOVED***t(ct***REMOVED***, titleOpts.te***REMOVED***t, ***REMOVED***, y, titleFont);
    }
 _computeTitleHeight() {
        const titleOpts = this.options.title;
        const titleFont = helpers_segment.toFont(titleOpts.font);
        const titlePadding = helpers_segment.toPadding(titleOpts.padding);
        return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
    }
 _getLegendItemAt(***REMOVED***, y) {
        let i, hitBo***REMOVED***, lh;
        if (helpers_segment._isBetween(***REMOVED***, this.left, this.right) && helpers_segment._isBetween(y, this.top, this.bottom)) {
            lh = this.legendHitBo***REMOVED***es;
            for(i = 0; i < lh.length; ++i){
                hitBo***REMOVED*** = lh[i];
                if (helpers_segment._isBetween(***REMOVED***, hitBo***REMOVED***.left, hitBo***REMOVED***.left + hitBo***REMOVED***.width) && helpers_segment._isBetween(y, hitBo***REMOVED***.top, hitBo***REMOVED***.top + hitBo***REMOVED***.height)) {
                    return this.legendItems[i];
                }
            }
        }
        return null;
    }
 handleEvent(e) {
        const opts = this.options;
        if (!isListened(e.type, opts)) {
            return;
        }
        const hoveredItem = this._getLegendItemAt(e.***REMOVED***, e.y);
        if (e.type === 'mousemove' || e.type === 'mouseout') {
            const previous = this._hoveredItem;
            const sameItem = itemsEqual(previous, hoveredItem);
            if (previous && !sameItem) {
                helpers_segment.callback(opts.onLeave, [
                    e,
                    previous,
                    this
                ], this);
            }
            this._hoveredItem = hoveredItem;
            if (hoveredItem && !sameItem) {
                helpers_segment.callback(opts.onHover, [
                    e,
                    hoveredItem,
                    this
                ], this);
            }
        } else if (hoveredItem) {
            helpers_segment.callback(opts.onClick, [
                e,
                hoveredItem,
                this
            ], this);
        }
    }
}
function calculateItemSize(bo***REMOVED***Width, labelFont, ct***REMOVED***, legendItem, _itemHeight) {
    const itemWidth = calculateItemWidth(legendItem, bo***REMOVED***Width, labelFont, ct***REMOVED***);
    const itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
    return {
        itemWidth,
        itemHeight
    };
}
function calculateItemWidth(legendItem, bo***REMOVED***Width, labelFont, ct***REMOVED***) {
    let legendItemTe***REMOVED***t = legendItem.te***REMOVED***t;
    if (legendItemTe***REMOVED***t && typeof legendItemTe***REMOVED***t !== 'string') {
        legendItemTe***REMOVED***t = legendItemTe***REMOVED***t.reduce((a, b)=>a.length > b.length ? a : b);
    }
    return bo***REMOVED***Width + labelFont.size / 2 + ct***REMOVED***.measureTe***REMOVED***t(legendItemTe***REMOVED***t).width;
}
function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
    let itemHeight = _itemHeight;
    if (typeof legendItem.te***REMOVED***t !== 'string') {
        itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
    }
    return itemHeight;
}
function calculateLegendItemHeight(legendItem, fontLineHeight) {
    const labelHeight = legendItem.te***REMOVED***t ? legendItem.te***REMOVED***t.length : 0;
    return fontLineHeight * labelHeight;
}
function isListened(type, opts) {
    if ((type === 'mousemove' || type === 'mouseout') && (opts.onHover || opts.onLeave)) {
        return true;
    }
    if (opts.onClick && (type === 'click' || type === 'mouseup')) {
        return true;
    }
    return false;
}
var plugin_legend = {
    id: 'legend',
 _element: Legend,
    start (chart, _args, options) {
        const legend = chart.legend = new Legend({
            ct***REMOVED***: chart.ct***REMOVED***,
            options,
            chart
        });
        layouts.configure(chart, legend, options);
        layouts.addBo***REMOVED***(chart, legend);
    },
    stop (chart) {
        layouts.removeBo***REMOVED***(chart, chart.legend);
        delete chart.legend;
    },
    beforeUpdate (chart, _args, options) {
        const legend = chart.legend;
        layouts.configure(chart, legend, options);
        legend.options = options;
    },
    afterUpdate (chart) {
        const legend = chart.legend;
        legend.buildLabels();
        legend.adjustHitBo***REMOVED***es();
    },
    afterEvent (chart, args) {
        if (!args.replay) {
            chart.legend.handleEvent(args.event);
        }
    },
    defaults: {
        display: true,
        position: 'top',
        align: 'center',
        fullSize: true,
        reverse: false,
        weight: 1000,
        onClick (e, legendItem, legend) {
            const inde***REMOVED*** = legendItem.datasetInde***REMOVED***;
            const ci = legend.chart;
            if (ci.isDatasetVisible(inde***REMOVED***)) {
                ci.hide(inde***REMOVED***);
                legendItem.hidden = true;
            } else {
                ci.show(inde***REMOVED***);
                legendItem.hidden = false;
            }
        },
        onHover: null,
        onLeave: null,
        labels: {
            color: (ct***REMOVED***)=>ct***REMOVED***.chart.options.color,
            bo***REMOVED***Width: 40,
            padding: 10,
            generateLabels (chart) {
                const datasets = chart.data.datasets;
                const { labels: { usePointStyle , pointStyle , te***REMOVED***tAlign , color , useBorderRadius , borderRadius  }  } = chart.legend.options;
                return chart._getSortedDatasetMetas().map((meta)=>{
                    const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
                    const borderWidth = helpers_segment.toPadding(style.borderWidth);
                    return {
                        te***REMOVED***t: datasets[meta.inde***REMOVED***].label,
                        fillStyle: style.backgroundColor,
                        fontColor: color,
                        hidden: !meta.visible,
                        lineCap: style.borderCapStyle,
                        lineDash: style.borderDash,
                        lineDashOffset: style.borderDashOffset,
                        lineJoin: style.borderJoinStyle,
                        lineWidth: (borderWidth.width + borderWidth.height) / 4,
                        strokeStyle: style.borderColor,
                        pointStyle: pointStyle || style.pointStyle,
                        rotation: style.rotation,
                        te***REMOVED***tAlign: te***REMOVED***tAlign || style.te***REMOVED***tAlign,
                        borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
                        datasetInde***REMOVED***: meta.inde***REMOVED***
                    };
                }, this);
            }
        },
        title: {
            color: (ct***REMOVED***)=>ct***REMOVED***.chart.options.color,
            display: false,
            position: 'center',
            te***REMOVED***t: ''
        }
    },
    descriptors: {
        _scriptable: (name)=>!name.startsWith('on'),
        labels: {
            _scriptable: (name)=>![
                    'generateLabels',
                    'filter',
                    'sort'
                ].includes(name)
        }
    }
};

class Title e***REMOVED***tends Element {
 constructor(config){
        super();
        this.chart = config.chart;
        this.options = config.options;
        this.ct***REMOVED*** = config.ct***REMOVED***;
        this._padding = undefined;
        this.top = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.right = undefined;
        this.width = undefined;
        this.height = undefined;
        this.position = undefined;
        this.weight = undefined;
        this.fullSize = undefined;
    }
    update(ma***REMOVED***Width, ma***REMOVED***Height) {
        const opts = this.options;
        this.left = 0;
        this.top = 0;
        if (!opts.display) {
            this.width = this.height = this.right = this.bottom = 0;
            return;
        }
        this.width = this.right = ma***REMOVED***Width;
        this.height = this.bottom = ma***REMOVED***Height;
        const lineCount = helpers_segment.isArray(opts.te***REMOVED***t) ? opts.te***REMOVED***t.length : 1;
        this._padding = helpers_segment.toPadding(opts.padding);
        const te***REMOVED***tSize = lineCount * helpers_segment.toFont(opts.font).lineHeight + this._padding.height;
        if (this.isHorizontal()) {
            this.height = te***REMOVED***tSize;
        } else {
            this.width = te***REMOVED***tSize;
        }
    }
    isHorizontal() {
        const pos = this.options.position;
        return pos === 'top' || pos === 'bottom';
    }
    _drawArgs(offset) {
        const { top , left , bottom , right , options  } = this;
        const align = options.align;
        let rotation = 0;
        let ma***REMOVED***Width, titleX, titleY;
        if (this.isHorizontal()) {
            titleX = helpers_segment._alignStartEnd(align, left, right);
            titleY = top + offset;
            ma***REMOVED***Width = right - left;
        } else {
            if (options.position === 'left') {
                titleX = left + offset;
                titleY = helpers_segment._alignStartEnd(align, bottom, top);
                rotation = helpers_segment.PI * -0.5;
            } else {
                titleX = right - offset;
                titleY = helpers_segment._alignStartEnd(align, top, bottom);
                rotation = helpers_segment.PI * 0.5;
            }
            ma***REMOVED***Width = bottom - top;
        }
        return {
            titleX,
            titleY,
            ma***REMOVED***Width,
            rotation
        };
    }
    draw() {
        const ct***REMOVED*** = this.ct***REMOVED***;
        const opts = this.options;
        if (!opts.display) {
            return;
        }
        const fontOpts = helpers_segment.toFont(opts.font);
        const lineHeight = fontOpts.lineHeight;
        const offset = lineHeight / 2 + this._padding.top;
        const { titleX , titleY , ma***REMOVED***Width , rotation  } = this._drawArgs(offset);
        helpers_segment.renderTe***REMOVED***t(ct***REMOVED***, opts.te***REMOVED***t, 0, 0, fontOpts, {
            color: opts.color,
            ma***REMOVED***Width,
            rotation,
            te***REMOVED***tAlign: helpers_segment._toLeftRightCenter(opts.align),
            te***REMOVED***tBaseline: 'middle',
            translation: [
                titleX,
                titleY
            ]
        });
    }
}
function createTitle(chart, titleOpts) {
    const title = new Title({
        ct***REMOVED***: chart.ct***REMOVED***,
        options: titleOpts,
        chart
    });
    layouts.configure(chart, title, titleOpts);
    layouts.addBo***REMOVED***(chart, title);
    chart.titleBlock = title;
}
var plugin_title = {
    id: 'title',
 _element: Title,
    start (chart, _args, options) {
        createTitle(chart, options);
    },
    stop (chart) {
        const titleBlock = chart.titleBlock;
        layouts.removeBo***REMOVED***(chart, titleBlock);
        delete chart.titleBlock;
    },
    beforeUpdate (chart, _args, options) {
        const title = chart.titleBlock;
        layouts.configure(chart, title, options);
        title.options = options;
    },
    defaults: {
        align: 'center',
        display: false,
        font: {
            weight: 'bold'
        },
        fullSize: true,
        padding: 10,
        position: 'top',
        te***REMOVED***t: '',
        weight: 2000
    },
    defaultRoutes: {
        color: 'color'
    },
    descriptors: {
        _scriptable: true,
        _inde***REMOVED***able: false
    }
};

const map = new WeakMap();
var plugin_subtitle = {
    id: 'subtitle',
    start (chart, _args, options) {
        const title = new Title({
            ct***REMOVED***: chart.ct***REMOVED***,
            options,
            chart
        });
        layouts.configure(chart, title, options);
        layouts.addBo***REMOVED***(chart, title);
        map.set(chart, title);
    },
    stop (chart) {
        layouts.removeBo***REMOVED***(chart, map.get(chart));
        map.delete(chart);
    },
    beforeUpdate (chart, _args, options) {
        const title = map.get(chart);
        layouts.configure(chart, title, options);
        title.options = options;
    },
    defaults: {
        align: 'center',
        display: false,
        font: {
            weight: 'normal'
        },
        fullSize: true,
        padding: 0,
        position: 'top',
        te***REMOVED***t: '',
        weight: 1500
    },
    defaultRoutes: {
        color: 'color'
    },
    descriptors: {
        _scriptable: true,
        _inde***REMOVED***able: false
    }
};

const positioners = {
 average (items) {
        if (!items.length) {
            return false;
        }
        let i, len;
        let ***REMOVED***Set = new Set();
        let y = 0;
        let count = 0;
        for(i = 0, len = items.length; i < len; ++i){
            const el = items[i].element;
            if (el && el.hasValue()) {
                const pos = el.tooltipPosition();
                ***REMOVED***Set.add(pos.***REMOVED***);
                y += pos.y;
                ++count;
            }
        }
        const ***REMOVED***Average = [
            ...***REMOVED***Set
        ].reduce((a, b)=>a + b) / ***REMOVED***Set.size;
        return {
            ***REMOVED***: ***REMOVED***Average,
            y: y / count
        };
    },
 nearest (items, eventPosition) {
        if (!items.length) {
            return false;
        }
        let ***REMOVED*** = eventPosition.***REMOVED***;
        let y = eventPosition.y;
        let minDistance = Number.POSITIVE_INFINITY;
        let i, len, nearestElement;
        for(i = 0, len = items.length; i < len; ++i){
            const el = items[i].element;
            if (el && el.hasValue()) {
                const center = el.getCenterPoint();
                const d = helpers_segment.distanceBetweenPoints(eventPosition, center);
                if (d < minDistance) {
                    minDistance = d;
                    nearestElement = el;
                }
            }
        }
        if (nearestElement) {
            const tp = nearestElement.tooltipPosition();
            ***REMOVED*** = tp.***REMOVED***;
            y = tp.y;
        }
        return {
            ***REMOVED***,
            y
        };
    }
};
function pushOrConcat(base, toPush) {
    if (toPush) {
        if (helpers_segment.isArray(toPush)) {
            Array.prototype.push.apply(base, toPush);
        } else {
            base.push(toPush);
        }
    }
    return base;
}
 function splitNewlines(str) {
    if ((typeof str === 'string' || str instanceof String) && str.inde***REMOVED***Of('\n') > -1) {
        return str.split('\n');
    }
    return str;
}
 function createTooltipItem(chart, item) {
    const { element , datasetInde***REMOVED*** , inde***REMOVED***  } = item;
    const controller = chart.getDatasetMeta(datasetInde***REMOVED***).controller;
    const { label , value  } = controller.getLabelAndValue(inde***REMOVED***);
    return {
        chart,
        label,
        parsed: controller.getParsed(inde***REMOVED***),
        raw: chart.data.datasets[datasetInde***REMOVED***].data[inde***REMOVED***],
        formattedValue: value,
        dataset: controller.getDataset(),
        dataInde***REMOVED***: inde***REMOVED***,
        datasetInde***REMOVED***,
        element
    };
}
 function getTooltipSize(tooltip, options) {
    const ct***REMOVED*** = tooltip.chart.ct***REMOVED***;
    const { body , footer , title  } = tooltip;
    const { bo***REMOVED***Width , bo***REMOVED***Height  } = options;
    const bodyFont = helpers_segment.toFont(options.bodyFont);
    const titleFont = helpers_segment.toFont(options.titleFont);
    const footerFont = helpers_segment.toFont(options.footerFont);
    const titleLineCount = title.length;
    const footerLineCount = footer.length;
    const bodyLineItemCount = body.length;
    const padding = helpers_segment.toPadding(options.padding);
    let height = padding.height;
    let width = 0;
    let combinedBodyLength = body.reduce((count, bodyItem)=>count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
    combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
    if (titleLineCount) {
        height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
    }
    if (combinedBodyLength) {
        const bodyLineHeight = options.displayColors ? Math.ma***REMOVED***(bo***REMOVED***Height, bodyFont.lineHeight) : bodyFont.lineHeight;
        height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
    }
    if (footerLineCount) {
        height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
    }
    let widthPadding = 0;
    const ma***REMOVED***LineWidth = function(line) {
        width = Math.ma***REMOVED***(width, ct***REMOVED***.measureTe***REMOVED***t(line).width + widthPadding);
    };
    ct***REMOVED***.save();
    ct***REMOVED***.font = titleFont.string;
    helpers_segment.each(tooltip.title, ma***REMOVED***LineWidth);
    ct***REMOVED***.font = bodyFont.string;
    helpers_segment.each(tooltip.beforeBody.concat(tooltip.afterBody), ma***REMOVED***LineWidth);
    widthPadding = options.displayColors ? bo***REMOVED***Width + 2 + options.bo***REMOVED***Padding : 0;
    helpers_segment.each(body, (bodyItem)=>{
        helpers_segment.each(bodyItem.before, ma***REMOVED***LineWidth);
        helpers_segment.each(bodyItem.lines, ma***REMOVED***LineWidth);
        helpers_segment.each(bodyItem.after, ma***REMOVED***LineWidth);
    });
    widthPadding = 0;
    ct***REMOVED***.font = footerFont.string;
    helpers_segment.each(tooltip.footer, ma***REMOVED***LineWidth);
    ct***REMOVED***.restore();
    width += padding.width;
    return {
        width,
        height
    };
}
function determineYAlign(chart, size) {
    const { y , height  } = size;
    if (y < height / 2) {
        return 'top';
    } else if (y > chart.height - height / 2) {
        return 'bottom';
    }
    return 'center';
}
function doesNotFitWithAlign(***REMOVED***Align, chart, options, size) {
    const { ***REMOVED*** , width  } = size;
    const caret = options.caretSize + options.caretPadding;
    if (***REMOVED***Align === 'left' && ***REMOVED*** + width + caret > chart.width) {
        return true;
    }
    if (***REMOVED***Align === 'right' && ***REMOVED*** - width - caret < 0) {
        return true;
    }
}
function determineXAlign(chart, options, size, yAlign) {
    const { ***REMOVED*** , width  } = size;
    const { width: chartWidth , chartArea: { left , right  }  } = chart;
    let ***REMOVED***Align = 'center';
    if (yAlign === 'center') {
        ***REMOVED***Align = ***REMOVED*** <= (left + right) / 2 ? 'left' : 'right';
    } else if (***REMOVED*** <= width / 2) {
        ***REMOVED***Align = 'left';
    } else if (***REMOVED*** >= chartWidth - width / 2) {
        ***REMOVED***Align = 'right';
    }
    if (doesNotFitWithAlign(***REMOVED***Align, chart, options, size)) {
        ***REMOVED***Align = 'center';
    }
    return ***REMOVED***Align;
}
 function determineAlignment(chart, options, size) {
    const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
    return {
        ***REMOVED***Align: size.***REMOVED***Align || options.***REMOVED***Align || determineXAlign(chart, options, size, yAlign),
        yAlign
    };
}
function alignX(size, ***REMOVED***Align) {
    let { ***REMOVED*** , width  } = size;
    if (***REMOVED***Align === 'right') {
        ***REMOVED*** -= width;
    } else if (***REMOVED***Align === 'center') {
        ***REMOVED*** -= width / 2;
    }
    return ***REMOVED***;
}
function alignY(size, yAlign, paddingAndSize) {
    let { y , height  } = size;
    if (yAlign === 'top') {
        y += paddingAndSize;
    } else if (yAlign === 'bottom') {
        y -= height + paddingAndSize;
    } else {
        y -= height / 2;
    }
    return y;
}
 function getBackgroundPoint(options, size, alignment, chart) {
    const { caretSize , caretPadding , cornerRadius  } = options;
    const { ***REMOVED***Align , yAlign  } = alignment;
    const paddingAndSize = caretSize + caretPadding;
    const { topLeft , topRight , bottomLeft , bottomRight  } = helpers_segment.toTRBLCorners(cornerRadius);
    let ***REMOVED*** = alignX(size, ***REMOVED***Align);
    const y = alignY(size, yAlign, paddingAndSize);
    if (yAlign === 'center') {
        if (***REMOVED***Align === 'left') {
            ***REMOVED*** += paddingAndSize;
        } else if (***REMOVED***Align === 'right') {
            ***REMOVED*** -= paddingAndSize;
        }
    } else if (***REMOVED***Align === 'left') {
        ***REMOVED*** -= Math.ma***REMOVED***(topLeft, bottomLeft) + caretSize;
    } else if (***REMOVED***Align === 'right') {
        ***REMOVED*** += Math.ma***REMOVED***(topRight, bottomRight) + caretSize;
    }
    return {
        ***REMOVED***: helpers_segment._limitValue(***REMOVED***, 0, chart.width - size.width),
        y: helpers_segment._limitValue(y, 0, chart.height - size.height)
    };
}
function getAlignedX(tooltip, align, options) {
    const padding = helpers_segment.toPadding(options.padding);
    return align === 'center' ? tooltip.***REMOVED*** + tooltip.width / 2 : align === 'right' ? tooltip.***REMOVED*** + tooltip.width - padding.right : tooltip.***REMOVED*** + padding.left;
}
 function getBeforeAfterBodyLines(callback) {
    return pushOrConcat([], splitNewlines(callback));
}
function createTooltipConte***REMOVED***t(parent, tooltip, tooltipItems) {
    return helpers_segment.createConte***REMOVED***t(parent, {
        tooltip,
        tooltipItems,
        type: 'tooltip'
    });
}
function overrideCallbacks(callbacks, conte***REMOVED***t) {
    const override = conte***REMOVED***t && conte***REMOVED***t.dataset && conte***REMOVED***t.dataset.tooltip && conte***REMOVED***t.dataset.tooltip.callbacks;
    return override ? callbacks.override(override) : callbacks;
}
const defaultCallbacks = {
    beforeTitle: helpers_segment.noop,
    title (tooltipItems) {
        if (tooltipItems.length > 0) {
            const item = tooltipItems[0];
            const labels = item.chart.data.labels;
            const labelCount = labels ? labels.length : 0;
            if (this && this.options && this.options.mode === 'dataset') {
                return item.dataset.label || '';
            } else if (item.label) {
                return item.label;
            } else if (labelCount > 0 && item.dataInde***REMOVED*** < labelCount) {
                return labels[item.dataInde***REMOVED***];
            }
        }
        return '';
    },
    afterTitle: helpers_segment.noop,
    beforeBody: helpers_segment.noop,
    beforeLabel: helpers_segment.noop,
    label (tooltipItem) {
        if (this && this.options && this.options.mode === 'dataset') {
            return tooltipItem.label + ': ' + tooltipItem.formattedValue || tooltipItem.formattedValue;
        }
        let label = tooltipItem.dataset.label || '';
        if (label) {
            label += ': ';
        }
        const value = tooltipItem.formattedValue;
        if (!helpers_segment.isNullOrUndef(value)) {
            label += value;
        }
        return label;
    },
    labelColor (tooltipItem) {
        const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetInde***REMOVED***);
        const options = meta.controller.getStyle(tooltipItem.dataInde***REMOVED***);
        return {
            borderColor: options.borderColor,
            backgroundColor: options.backgroundColor,
            borderWidth: options.borderWidth,
            borderDash: options.borderDash,
            borderDashOffset: options.borderDashOffset,
            borderRadius: 0
        };
    },
    labelTe***REMOVED***tColor () {
        return this.options.bodyColor;
    },
    labelPointStyle (tooltipItem) {
        const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetInde***REMOVED***);
        const options = meta.controller.getStyle(tooltipItem.dataInde***REMOVED***);
        return {
            pointStyle: options.pointStyle,
            rotation: options.rotation
        };
    },
    afterLabel: helpers_segment.noop,
    afterBody: helpers_segment.noop,
    beforeFooter: helpers_segment.noop,
    footer: helpers_segment.noop,
    afterFooter: helpers_segment.noop
};
 function invokeCallbackWithFallback(callbacks, name, ct***REMOVED***, arg) {
    const result = callbacks[name].call(ct***REMOVED***, arg);
    if (typeof result === 'undefined') {
        return defaultCallbacks[name].call(ct***REMOVED***, arg);
    }
    return result;
}
class Tooltip e***REMOVED***tends Element {
 static positioners = positioners;
    constructor(config){
        super();
        this.opacity = 0;
        this._active = [];
        this._eventPosition = undefined;
        this._size = undefined;
        this._cachedAnimations = undefined;
        this._tooltipItems = [];
        this.$animations = undefined;
        this.$conte***REMOVED***t = undefined;
        this.chart = config.chart;
        this.options = config.options;
        this.dataPoints = undefined;
        this.title = undefined;
        this.beforeBody = undefined;
        this.body = undefined;
        this.afterBody = undefined;
        this.footer = undefined;
        this.***REMOVED***Align = undefined;
        this.yAlign = undefined;
        this.***REMOVED*** = undefined;
        this.y = undefined;
        this.height = undefined;
        this.width = undefined;
        this.caretX = undefined;
        this.caretY = undefined;
        this.labelColors = undefined;
        this.labelPointStyles = undefined;
        this.labelTe***REMOVED***tColors = undefined;
    }
    initialize(options) {
        this.options = options;
        this._cachedAnimations = undefined;
        this.$conte***REMOVED***t = undefined;
    }
 _resolveAnimations() {
        const cached = this._cachedAnimations;
        if (cached) {
            return cached;
        }
        const chart = this.chart;
        const options = this.options.setConte***REMOVED***t(this.getConte***REMOVED***t());
        const opts = options.enabled && chart.options.animation && options.animations;
        const animations = new Animations(this.chart, opts);
        if (opts._cacheable) {
            this._cachedAnimations = Object.freeze(animations);
        }
        return animations;
    }
 getConte***REMOVED***t() {
        return this.$conte***REMOVED***t || (this.$conte***REMOVED***t = createTooltipConte***REMOVED***t(this.chart.getConte***REMOVED***t(), this, this._tooltipItems));
    }
    getTitle(conte***REMOVED***t, options) {
        const { callbacks  } = options;
        const beforeTitle = invokeCallbackWithFallback(callbacks, 'beforeTitle', this, conte***REMOVED***t);
        const title = invokeCallbackWithFallback(callbacks, 'title', this, conte***REMOVED***t);
        const afterTitle = invokeCallbackWithFallback(callbacks, 'afterTitle', this, conte***REMOVED***t);
        let lines = [];
        lines = pushOrConcat(lines, splitNewlines(beforeTitle));
        lines = pushOrConcat(lines, splitNewlines(title));
        lines = pushOrConcat(lines, splitNewlines(afterTitle));
        return lines;
    }
    getBeforeBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, 'beforeBody', this, tooltipItems));
    }
    getBody(tooltipItems, options) {
        const { callbacks  } = options;
        const bodyItems = [];
        helpers_segment.each(tooltipItems, (conte***REMOVED***t)=>{
            const bodyItem = {
                before: [],
                lines: [],
                after: []
            };
            const scoped = overrideCallbacks(callbacks, conte***REMOVED***t);
            pushOrConcat(bodyItem.before, splitNewlines(invokeCallbackWithFallback(scoped, 'beforeLabel', this, conte***REMOVED***t)));
            pushOrConcat(bodyItem.lines, invokeCallbackWithFallback(scoped, 'label', this, conte***REMOVED***t));
            pushOrConcat(bodyItem.after, splitNewlines(invokeCallbackWithFallback(scoped, 'afterLabel', this, conte***REMOVED***t)));
            bodyItems.push(bodyItem);
        });
        return bodyItems;
    }
    getAfterBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, 'afterBody', this, tooltipItems));
    }
    getFooter(tooltipItems, options) {
        const { callbacks  } = options;
        const beforeFooter = invokeCallbackWithFallback(callbacks, 'beforeFooter', this, tooltipItems);
        const footer = invokeCallbackWithFallback(callbacks, 'footer', this, tooltipItems);
        const afterFooter = invokeCallbackWithFallback(callbacks, 'afterFooter', this, tooltipItems);
        let lines = [];
        lines = pushOrConcat(lines, splitNewlines(beforeFooter));
        lines = pushOrConcat(lines, splitNewlines(footer));
        lines = pushOrConcat(lines, splitNewlines(afterFooter));
        return lines;
    }
 _createItems(options) {
        const active = this._active;
        const data = this.chart.data;
        const labelColors = [];
        const labelPointStyles = [];
        const labelTe***REMOVED***tColors = [];
        let tooltipItems = [];
        let i, len;
        for(i = 0, len = active.length; i < len; ++i){
            tooltipItems.push(createTooltipItem(this.chart, active[i]));
        }
        if (options.filter) {
            tooltipItems = tooltipItems.filter((element, inde***REMOVED***, array)=>options.filter(element, inde***REMOVED***, array, data));
        }
        if (options.itemSort) {
            tooltipItems = tooltipItems.sort((a, b)=>options.itemSort(a, b, data));
        }
        helpers_segment.each(tooltipItems, (conte***REMOVED***t)=>{
            const scoped = overrideCallbacks(options.callbacks, conte***REMOVED***t);
            labelColors.push(invokeCallbackWithFallback(scoped, 'labelColor', this, conte***REMOVED***t));
            labelPointStyles.push(invokeCallbackWithFallback(scoped, 'labelPointStyle', this, conte***REMOVED***t));
            labelTe***REMOVED***tColors.push(invokeCallbackWithFallback(scoped, 'labelTe***REMOVED***tColor', this, conte***REMOVED***t));
        });
        this.labelColors = labelColors;
        this.labelPointStyles = labelPointStyles;
        this.labelTe***REMOVED***tColors = labelTe***REMOVED***tColors;
        this.dataPoints = tooltipItems;
        return tooltipItems;
    }
    update(changed, replay) {
        const options = this.options.setConte***REMOVED***t(this.getConte***REMOVED***t());
        const active = this._active;
        let properties;
        let tooltipItems = [];
        if (!active.length) {
            if (this.opacity !== 0) {
                properties = {
                    opacity: 0
                };
            }
        } else {
            const position = positioners[options.position].call(this, active, this._eventPosition);
            tooltipItems = this._createItems(options);
            this.title = this.getTitle(tooltipItems, options);
            this.beforeBody = this.getBeforeBody(tooltipItems, options);
            this.body = this.getBody(tooltipItems, options);
            this.afterBody = this.getAfterBody(tooltipItems, options);
            this.footer = this.getFooter(tooltipItems, options);
            const size = this._size = getTooltipSize(this, options);
            const positionAndSize = Object.assign({}, position, size);
            const alignment = determineAlignment(this.chart, options, positionAndSize);
            const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
            this.***REMOVED***Align = alignment.***REMOVED***Align;
            this.yAlign = alignment.yAlign;
            properties = {
                opacity: 1,
                ***REMOVED***: backgroundPoint.***REMOVED***,
                y: backgroundPoint.y,
                width: size.width,
                height: size.height,
                caretX: position.***REMOVED***,
                caretY: position.y
            };
        }
        this._tooltipItems = tooltipItems;
        this.$conte***REMOVED***t = undefined;
        if (properties) {
            this._resolveAnimations().update(this, properties);
        }
        if (changed && options.e***REMOVED***ternal) {
            options.e***REMOVED***ternal.call(this, {
                chart: this.chart,
                tooltip: this,
                replay
            });
        }
    }
    drawCaret(tooltipPoint, ct***REMOVED***, size, options) {
        const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
        ct***REMOVED***.lineTo(caretPosition.***REMOVED***1, caretPosition.y1);
        ct***REMOVED***.lineTo(caretPosition.***REMOVED***2, caretPosition.y2);
        ct***REMOVED***.lineTo(caretPosition.***REMOVED***3, caretPosition.y3);
    }
    getCaretPosition(tooltipPoint, size, options) {
        const { ***REMOVED***Align , yAlign  } = this;
        const { caretSize , cornerRadius  } = options;
        const { topLeft , topRight , bottomLeft , bottomRight  } = helpers_segment.toTRBLCorners(cornerRadius);
        const { ***REMOVED***: ptX , y: ptY  } = tooltipPoint;
        const { width , height  } = size;
        let ***REMOVED***1, ***REMOVED***2, ***REMOVED***3, y1, y2, y3;
        if (yAlign === 'center') {
            y2 = ptY + height / 2;
            if (***REMOVED***Align === 'left') {
                ***REMOVED***1 = ptX;
                ***REMOVED***2 = ***REMOVED***1 - caretSize;
                y1 = y2 + caretSize;
                y3 = y2 - caretSize;
            } else {
                ***REMOVED***1 = ptX + width;
                ***REMOVED***2 = ***REMOVED***1 + caretSize;
                y1 = y2 - caretSize;
                y3 = y2 + caretSize;
            }
            ***REMOVED***3 = ***REMOVED***1;
        } else {
            if (***REMOVED***Align === 'left') {
                ***REMOVED***2 = ptX + Math.ma***REMOVED***(topLeft, bottomLeft) + caretSize;
            } else if (***REMOVED***Align === 'right') {
                ***REMOVED***2 = ptX + width - Math.ma***REMOVED***(topRight, bottomRight) - caretSize;
            } else {
                ***REMOVED***2 = this.caretX;
            }
            if (yAlign === 'top') {
                y1 = ptY;
                y2 = y1 - caretSize;
                ***REMOVED***1 = ***REMOVED***2 - caretSize;
                ***REMOVED***3 = ***REMOVED***2 + caretSize;
            } else {
                y1 = ptY + height;
                y2 = y1 + caretSize;
                ***REMOVED***1 = ***REMOVED***2 + caretSize;
                ***REMOVED***3 = ***REMOVED***2 - caretSize;
            }
            y3 = y1;
        }
        return {
            ***REMOVED***1,
            ***REMOVED***2,
            ***REMOVED***3,
            y1,
            y2,
            y3
        };
    }
    drawTitle(pt, ct***REMOVED***, options) {
        const title = this.title;
        const length = title.length;
        let titleFont, titleSpacing, i;
        if (length) {
            const rtlHelper = helpers_segment.getRtlAdapter(options.rtl, this.***REMOVED***, this.width);
            pt.***REMOVED*** = getAlignedX(this, options.titleAlign, options);
            ct***REMOVED***.te***REMOVED***tAlign = rtlHelper.te***REMOVED***tAlign(options.titleAlign);
            ct***REMOVED***.te***REMOVED***tBaseline = 'middle';
            titleFont = helpers_segment.toFont(options.titleFont);
            titleSpacing = options.titleSpacing;
            ct***REMOVED***.fillStyle = options.titleColor;
            ct***REMOVED***.font = titleFont.string;
            for(i = 0; i < length; ++i){
                ct***REMOVED***.fillTe***REMOVED***t(title[i], rtlHelper.***REMOVED***(pt.***REMOVED***), pt.y + titleFont.lineHeight / 2);
                pt.y += titleFont.lineHeight + titleSpacing;
                if (i + 1 === length) {
                    pt.y += options.titleMarginBottom - titleSpacing;
                }
            }
        }
    }
 _drawColorBo***REMOVED***(ct***REMOVED***, pt, i, rtlHelper, options) {
        const labelColor = this.labelColors[i];
        const labelPointStyle = this.labelPointStyles[i];
        const { bo***REMOVED***Height , bo***REMOVED***Width  } = options;
        const bodyFont = helpers_segment.toFont(options.bodyFont);
        const colorX = getAlignedX(this, 'left', options);
        const rtlColorX = rtlHelper.***REMOVED***(colorX);
        const yOffSet = bo***REMOVED***Height < bodyFont.lineHeight ? (bodyFont.lineHeight - bo***REMOVED***Height) / 2 : 0;
        const colorY = pt.y + yOffSet;
        if (options.usePointStyle) {
            const drawOptions = {
                radius: Math.min(bo***REMOVED***Width, bo***REMOVED***Height) / 2,
                pointStyle: labelPointStyle.pointStyle,
                rotation: labelPointStyle.rotation,
                borderWidth: 1
            };
            const centerX = rtlHelper.leftForLtr(rtlColorX, bo***REMOVED***Width) + bo***REMOVED***Width / 2;
            const centerY = colorY + bo***REMOVED***Height / 2;
            ct***REMOVED***.strokeStyle = options.multiKeyBackground;
            ct***REMOVED***.fillStyle = options.multiKeyBackground;
            helpers_segment.drawPoint(ct***REMOVED***, drawOptions, centerX, centerY);
            ct***REMOVED***.strokeStyle = labelColor.borderColor;
            ct***REMOVED***.fillStyle = labelColor.backgroundColor;
            helpers_segment.drawPoint(ct***REMOVED***, drawOptions, centerX, centerY);
        } else {
            ct***REMOVED***.lineWidth = helpers_segment.isObject(labelColor.borderWidth) ? Math.ma***REMOVED***(...Object.values(labelColor.borderWidth)) : labelColor.borderWidth || 1;
            ct***REMOVED***.strokeStyle = labelColor.borderColor;
            ct***REMOVED***.setLineDash(labelColor.borderDash || []);
            ct***REMOVED***.lineDashOffset = labelColor.borderDashOffset || 0;
            const outerX = rtlHelper.leftForLtr(rtlColorX, bo***REMOVED***Width);
            const innerX = rtlHelper.leftForLtr(rtlHelper.***REMOVED***Plus(rtlColorX, 1), bo***REMOVED***Width - 2);
            const borderRadius = helpers_segment.toTRBLCorners(labelColor.borderRadius);
            if (Object.values(borderRadius).some((v)=>v !== 0)) {
                ct***REMOVED***.beginPath();
                ct***REMOVED***.fillStyle = options.multiKeyBackground;
                helpers_segment.addRoundedRectPath(ct***REMOVED***, {
                    ***REMOVED***: outerX,
                    y: colorY,
                    w: bo***REMOVED***Width,
                    h: bo***REMOVED***Height,
                    radius: borderRadius
                });
                ct***REMOVED***.fill();
                ct***REMOVED***.stroke();
                ct***REMOVED***.fillStyle = labelColor.backgroundColor;
                ct***REMOVED***.beginPath();
                helpers_segment.addRoundedRectPath(ct***REMOVED***, {
                    ***REMOVED***: innerX,
                    y: colorY + 1,
                    w: bo***REMOVED***Width - 2,
                    h: bo***REMOVED***Height - 2,
                    radius: borderRadius
                });
                ct***REMOVED***.fill();
            } else {
                ct***REMOVED***.fillStyle = options.multiKeyBackground;
                ct***REMOVED***.fillRect(outerX, colorY, bo***REMOVED***Width, bo***REMOVED***Height);
                ct***REMOVED***.strokeRect(outerX, colorY, bo***REMOVED***Width, bo***REMOVED***Height);
                ct***REMOVED***.fillStyle = labelColor.backgroundColor;
                ct***REMOVED***.fillRect(innerX, colorY + 1, bo***REMOVED***Width - 2, bo***REMOVED***Height - 2);
            }
        }
        ct***REMOVED***.fillStyle = this.labelTe***REMOVED***tColors[i];
    }
    drawBody(pt, ct***REMOVED***, options) {
        const { body  } = this;
        const { bodySpacing , bodyAlign , displayColors , bo***REMOVED***Height , bo***REMOVED***Width , bo***REMOVED***Padding  } = options;
        const bodyFont = helpers_segment.toFont(options.bodyFont);
        let bodyLineHeight = bodyFont.lineHeight;
        let ***REMOVED***LinePadding = 0;
        const rtlHelper = helpers_segment.getRtlAdapter(options.rtl, this.***REMOVED***, this.width);
        const fillLineOfTe***REMOVED***t = function(line) {
            ct***REMOVED***.fillTe***REMOVED***t(line, rtlHelper.***REMOVED***(pt.***REMOVED*** + ***REMOVED***LinePadding), pt.y + bodyLineHeight / 2);
            pt.y += bodyLineHeight + bodySpacing;
        };
        const bodyAlignForCalculation = rtlHelper.te***REMOVED***tAlign(bodyAlign);
        let bodyItem, te***REMOVED***tColor, lines, i, j, ilen, jlen;
        ct***REMOVED***.te***REMOVED***tAlign = bodyAlign;
        ct***REMOVED***.te***REMOVED***tBaseline = 'middle';
        ct***REMOVED***.font = bodyFont.string;
        pt.***REMOVED*** = getAlignedX(this, bodyAlignForCalculation, options);
        ct***REMOVED***.fillStyle = options.bodyColor;
        helpers_segment.each(this.beforeBody, fillLineOfTe***REMOVED***t);
        ***REMOVED***LinePadding = displayColors && bodyAlignForCalculation !== 'right' ? bodyAlign === 'center' ? bo***REMOVED***Width / 2 + bo***REMOVED***Padding : bo***REMOVED***Width + 2 + bo***REMOVED***Padding : 0;
        for(i = 0, ilen = body.length; i < ilen; ++i){
            bodyItem = body[i];
            te***REMOVED***tColor = this.labelTe***REMOVED***tColors[i];
            ct***REMOVED***.fillStyle = te***REMOVED***tColor;
            helpers_segment.each(bodyItem.before, fillLineOfTe***REMOVED***t);
            lines = bodyItem.lines;
            if (displayColors && lines.length) {
                this._drawColorBo***REMOVED***(ct***REMOVED***, pt, i, rtlHelper, options);
                bodyLineHeight = Math.ma***REMOVED***(bodyFont.lineHeight, bo***REMOVED***Height);
            }
            for(j = 0, jlen = lines.length; j < jlen; ++j){
                fillLineOfTe***REMOVED***t(lines[j]);
                bodyLineHeight = bodyFont.lineHeight;
            }
            helpers_segment.each(bodyItem.after, fillLineOfTe***REMOVED***t);
        }
        ***REMOVED***LinePadding = 0;
        bodyLineHeight = bodyFont.lineHeight;
        helpers_segment.each(this.afterBody, fillLineOfTe***REMOVED***t);
        pt.y -= bodySpacing;
    }
    drawFooter(pt, ct***REMOVED***, options) {
        const footer = this.footer;
        const length = footer.length;
        let footerFont, i;
        if (length) {
            const rtlHelper = helpers_segment.getRtlAdapter(options.rtl, this.***REMOVED***, this.width);
            pt.***REMOVED*** = getAlignedX(this, options.footerAlign, options);
            pt.y += options.footerMarginTop;
            ct***REMOVED***.te***REMOVED***tAlign = rtlHelper.te***REMOVED***tAlign(options.footerAlign);
            ct***REMOVED***.te***REMOVED***tBaseline = 'middle';
            footerFont = helpers_segment.toFont(options.footerFont);
            ct***REMOVED***.fillStyle = options.footerColor;
            ct***REMOVED***.font = footerFont.string;
            for(i = 0; i < length; ++i){
                ct***REMOVED***.fillTe***REMOVED***t(footer[i], rtlHelper.***REMOVED***(pt.***REMOVED***), pt.y + footerFont.lineHeight / 2);
                pt.y += footerFont.lineHeight + options.footerSpacing;
            }
        }
    }
    drawBackground(pt, ct***REMOVED***, tooltipSize, options) {
        const { ***REMOVED***Align , yAlign  } = this;
        const { ***REMOVED*** , y  } = pt;
        const { width , height  } = tooltipSize;
        const { topLeft , topRight , bottomLeft , bottomRight  } = helpers_segment.toTRBLCorners(options.cornerRadius);
        ct***REMOVED***.fillStyle = options.backgroundColor;
        ct***REMOVED***.strokeStyle = options.borderColor;
        ct***REMOVED***.lineWidth = options.borderWidth;
        ct***REMOVED***.beginPath();
        ct***REMOVED***.moveTo(***REMOVED*** + topLeft, y);
        if (yAlign === 'top') {
            this.drawCaret(pt, ct***REMOVED***, tooltipSize, options);
        }
        ct***REMOVED***.lineTo(***REMOVED*** + width - topRight, y);
        ct***REMOVED***.quadraticCurveTo(***REMOVED*** + width, y, ***REMOVED*** + width, y + topRight);
        if (yAlign === 'center' && ***REMOVED***Align === 'right') {
            this.drawCaret(pt, ct***REMOVED***, tooltipSize, options);
        }
        ct***REMOVED***.lineTo(***REMOVED*** + width, y + height - bottomRight);
        ct***REMOVED***.quadraticCurveTo(***REMOVED*** + width, y + height, ***REMOVED*** + width - bottomRight, y + height);
        if (yAlign === 'bottom') {
            this.drawCaret(pt, ct***REMOVED***, tooltipSize, options);
        }
        ct***REMOVED***.lineTo(***REMOVED*** + bottomLeft, y + height);
        ct***REMOVED***.quadraticCurveTo(***REMOVED***, y + height, ***REMOVED***, y + height - bottomLeft);
        if (yAlign === 'center' && ***REMOVED***Align === 'left') {
            this.drawCaret(pt, ct***REMOVED***, tooltipSize, options);
        }
        ct***REMOVED***.lineTo(***REMOVED***, y + topLeft);
        ct***REMOVED***.quadraticCurveTo(***REMOVED***, y, ***REMOVED*** + topLeft, y);
        ct***REMOVED***.closePath();
        ct***REMOVED***.fill();
        if (options.borderWidth > 0) {
            ct***REMOVED***.stroke();
        }
    }
 _updateAnimationTarget(options) {
        const chart = this.chart;
        const anims = this.$animations;
        const animX = anims && anims.***REMOVED***;
        const animY = anims && anims.y;
        if (animX || animY) {
            const position = positioners[options.position].call(this, this._active, this._eventPosition);
            if (!position) {
                return;
            }
            const size = this._size = getTooltipSize(this, options);
            const positionAndSize = Object.assign({}, position, this._size);
            const alignment = determineAlignment(chart, options, positionAndSize);
            const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
            if (animX._to !== point.***REMOVED*** || animY._to !== point.y) {
                this.***REMOVED***Align = alignment.***REMOVED***Align;
                this.yAlign = alignment.yAlign;
                this.width = size.width;
                this.height = size.height;
                this.caretX = position.***REMOVED***;
                this.caretY = position.y;
                this._resolveAnimations().update(this, point);
            }
        }
    }
 _willRender() {
        return !!this.opacity;
    }
    draw(ct***REMOVED***) {
        const options = this.options.setConte***REMOVED***t(this.getConte***REMOVED***t());
        let opacity = this.opacity;
        if (!opacity) {
            return;
        }
        this._updateAnimationTarget(options);
        const tooltipSize = {
            width: this.width,
            height: this.height
        };
        const pt = {
            ***REMOVED***: this.***REMOVED***,
            y: this.y
        };
        opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
        const padding = helpers_segment.toPadding(options.padding);
        const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
        if (options.enabled && hasTooltipContent) {
            ct***REMOVED***.save();
            ct***REMOVED***.globalAlpha = opacity;
            this.drawBackground(pt, ct***REMOVED***, tooltipSize, options);
            helpers_segment.overrideTe***REMOVED***tDirection(ct***REMOVED***, options.te***REMOVED***tDirection);
            pt.y += padding.top;
            this.drawTitle(pt, ct***REMOVED***, options);
            this.drawBody(pt, ct***REMOVED***, options);
            this.drawFooter(pt, ct***REMOVED***, options);
            helpers_segment.restoreTe***REMOVED***tDirection(ct***REMOVED***, options.te***REMOVED***tDirection);
            ct***REMOVED***.restore();
        }
    }
 getActiveElements() {
        return this._active || [];
    }
 setActiveElements(activeElements, eventPosition) {
        const lastActive = this._active;
        const active = activeElements.map(({ datasetInde***REMOVED*** , inde***REMOVED***  })=>{
            const meta = this.chart.getDatasetMeta(datasetInde***REMOVED***);
            if (!meta) {
                throw new Error('Cannot find a dataset at inde***REMOVED*** ' + datasetInde***REMOVED***);
            }
            return {
                datasetInde***REMOVED***,
                element: meta.data[inde***REMOVED***],
                inde***REMOVED***
            };
        });
        const changed = !helpers_segment._elementsEqual(lastActive, active);
        const positionChanged = this._positionChanged(active, eventPosition);
        if (changed || positionChanged) {
            this._active = active;
            this._eventPosition = eventPosition;
            this._ignoreReplayEvents = true;
            this.update(true);
        }
    }
 handleEvent(e, replay, inChartArea = true) {
        if (replay && this._ignoreReplayEvents) {
            return false;
        }
        this._ignoreReplayEvents = false;
        const options = this.options;
        const lastActive = this._active || [];
        const active = this._getActiveElements(e, lastActive, replay, inChartArea);
        const positionChanged = this._positionChanged(active, e);
        const changed = replay || !helpers_segment._elementsEqual(active, lastActive) || positionChanged;
        if (changed) {
            this._active = active;
            if (options.enabled || options.e***REMOVED***ternal) {
                this._eventPosition = {
                    ***REMOVED***: e.***REMOVED***,
                    y: e.y
                };
                this.update(true, replay);
            }
        }
        return changed;
    }
 _getActiveElements(e, lastActive, replay, inChartArea) {
        const options = this.options;
        if (e.type === 'mouseout') {
            return [];
        }
        if (!inChartArea) {
            return lastActive.filter((i)=>this.chart.data.datasets[i.datasetInde***REMOVED***] && this.chart.getDatasetMeta(i.datasetInde***REMOVED***).controller.getParsed(i.inde***REMOVED***) !== undefined);
        }
        const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
        if (options.reverse) {
            active.reverse();
        }
        return active;
    }
 _positionChanged(active, e) {
        const { caretX , caretY , options  } = this;
        const position = positioners[options.position].call(this, active, e);
        return position !== false && (caretX !== position.***REMOVED*** || caretY !== position.y);
    }
}
var plugin_tooltip = {
    id: 'tooltip',
    _element: Tooltip,
    positioners,
    afterInit (chart, _args, options) {
        if (options) {
            chart.tooltip = new Tooltip({
                chart,
                options
            });
        }
    },
    beforeUpdate (chart, _args, options) {
        if (chart.tooltip) {
            chart.tooltip.initialize(options);
        }
    },
    reset (chart, _args, options) {
        if (chart.tooltip) {
            chart.tooltip.initialize(options);
        }
    },
    afterDraw (chart) {
        const tooltip = chart.tooltip;
        if (tooltip && tooltip._willRender()) {
            const args = {
                tooltip
            };
            if (chart.notifyPlugins('beforeTooltipDraw', {
                ...args,
                cancelable: true
            }) === false) {
                return;
            }
            tooltip.draw(chart.ct***REMOVED***);
            chart.notifyPlugins('afterTooltipDraw', args);
        }
    },
    afterEvent (chart, args) {
        if (chart.tooltip) {
            const useFinalPosition = args.replay;
            if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
                args.changed = true;
            }
        }
    },
    defaults: {
        enabled: true,
        e***REMOVED***ternal: null,
        position: 'average',
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        titleFont: {
            weight: 'bold'
        },
        titleSpacing: 2,
        titleMarginBottom: 6,
        titleAlign: 'left',
        bodyColor: '#fff',
        bodySpacing: 2,
        bodyFont: {},
        bodyAlign: 'left',
        footerColor: '#fff',
        footerSpacing: 2,
        footerMarginTop: 6,
        footerFont: {
            weight: 'bold'
        },
        footerAlign: 'left',
        padding: 6,
        caretPadding: 2,
        caretSize: 5,
        cornerRadius: 6,
        bo***REMOVED***Height: (ct***REMOVED***, opts)=>opts.bodyFont.size,
        bo***REMOVED***Width: (ct***REMOVED***, opts)=>opts.bodyFont.size,
        multiKeyBackground: '#fff',
        displayColors: true,
        bo***REMOVED***Padding: 0,
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
        animation: {
            duration: 400,
            easing: 'easeOutQuart'
        },
        animations: {
            numbers: {
                type: 'number',
                properties: [
                    '***REMOVED***',
                    'y',
                    'width',
                    'height',
                    'caretX',
                    'caretY'
                ]
            },
            opacity: {
                easing: 'linear',
                duration: 200
            }
        },
        callbacks: defaultCallbacks
    },
    defaultRoutes: {
        bodyFont: 'font',
        footerFont: 'font',
        titleFont: 'font'
    },
    descriptors: {
        _scriptable: (name)=>name !== 'filter' && name !== 'itemSort' && name !== 'e***REMOVED***ternal',
        _inde***REMOVED***able: false,
        callbacks: {
            _scriptable: false,
            _inde***REMOVED***able: false
        },
        animation: {
            _fallback: false
        },
        animations: {
            _fallback: 'animation'
        }
    },
    additionalOptionScopes: [
        'interaction'
    ]
};

var plugins = /*#__PURE__*/Object.freeze({
__proto__: null,
Colors: plugin_colors,
Decimation: plugin_decimation,
Filler: inde***REMOVED***,
Legend: plugin_legend,
SubTitle: plugin_subtitle,
Title: plugin_title,
Tooltip: plugin_tooltip
});

const addIfString = (labels, raw, inde***REMOVED***, addedLabels)=>{
    if (typeof raw === 'string') {
        inde***REMOVED*** = labels.push(raw) - 1;
        addedLabels.unshift({
            inde***REMOVED***,
            label: raw
        });
    } else if (isNaN(raw)) {
        inde***REMOVED*** = null;
    }
    return inde***REMOVED***;
};
function findOrAddLabel(labels, raw, inde***REMOVED***, addedLabels) {
    const first = labels.inde***REMOVED***Of(raw);
    if (first === -1) {
        return addIfString(labels, raw, inde***REMOVED***, addedLabels);
    }
    const last = labels.lastInde***REMOVED***Of(raw);
    return first !== last ? inde***REMOVED*** : first;
}
const validInde***REMOVED*** = (inde***REMOVED***, ma***REMOVED***)=>inde***REMOVED*** === null ? null : helpers_segment._limitValue(Math.round(inde***REMOVED***), 0, ma***REMOVED***);
function _getLabelForValue(value) {
    const labels = this.getLabels();
    if (value >= 0 && value < labels.length) {
        return labels[value];
    }
    return value;
}
class CategoryScale e***REMOVED***tends Scale {
    static id = 'category';
 static defaults = {
        ticks: {
            callback: _getLabelForValue
        }
    };
    constructor(cfg){
        super(cfg);
         this._startValue = undefined;
        this._valueRange = 0;
        this._addedLabels = [];
    }
    init(scaleOptions) {
        const added = this._addedLabels;
        if (added.length) {
            const labels = this.getLabels();
            for (const { inde***REMOVED*** , label  } of added){
                if (labels[inde***REMOVED***] === label) {
                    labels.splice(inde***REMOVED***, 1);
                }
            }
            this._addedLabels = [];
        }
        super.init(scaleOptions);
    }
    parse(raw, inde***REMOVED***) {
        if (helpers_segment.isNullOrUndef(raw)) {
            return null;
        }
        const labels = this.getLabels();
        inde***REMOVED*** = isFinite(inde***REMOVED***) && labels[inde***REMOVED***] === raw ? inde***REMOVED*** : findOrAddLabel(labels, raw, helpers_segment.valueOrDefault(inde***REMOVED***, raw), this._addedLabels);
        return validInde***REMOVED***(inde***REMOVED***, labels.length - 1);
    }
    determineDataLimits() {
        const { minDefined , ma***REMOVED***Defined  } = this.getUserBounds();
        let { min , ma***REMOVED***  } = this.getMinMa***REMOVED***(true);
        if (this.options.bounds === 'ticks') {
            if (!minDefined) {
                min = 0;
            }
            if (!ma***REMOVED***Defined) {
                ma***REMOVED*** = this.getLabels().length - 1;
            }
        }
        this.min = min;
        this.ma***REMOVED*** = ma***REMOVED***;
    }
    buildTicks() {
        const min = this.min;
        const ma***REMOVED*** = this.ma***REMOVED***;
        const offset = this.options.offset;
        const ticks = [];
        let labels = this.getLabels();
        labels = min === 0 && ma***REMOVED*** === labels.length - 1 ? labels : labels.slice(min, ma***REMOVED*** + 1);
        this._valueRange = Math.ma***REMOVED***(labels.length - (offset ? 0 : 1), 1);
        this._startValue = this.min - (offset ? 0.5 : 0);
        for(let value = min; value <= ma***REMOVED***; value++){
            ticks.push({
                value
            });
        }
        return ticks;
    }
    getLabelForValue(value) {
        return _getLabelForValue.call(this, value);
    }
 configure() {
        super.configure();
        if (!this.isHorizontal()) {
            this._reversePi***REMOVED***els = !this._reversePi***REMOVED***els;
        }
    }
    getPi***REMOVED***elForValue(value) {
        if (typeof value !== 'number') {
            value = this.parse(value);
        }
        return value === null ? NaN : this.getPi***REMOVED***elForDecimal((value - this._startValue) / this._valueRange);
    }
    getPi***REMOVED***elForTick(inde***REMOVED***) {
        const ticks = this.ticks;
        if (inde***REMOVED*** < 0 || inde***REMOVED*** > ticks.length - 1) {
            return null;
        }
        return this.getPi***REMOVED***elForValue(ticks[inde***REMOVED***].value);
    }
    getValueForPi***REMOVED***el(pi***REMOVED***el) {
        return Math.round(this._startValue + this.getDecimalForPi***REMOVED***el(pi***REMOVED***el) * this._valueRange);
    }
    getBasePi***REMOVED***el() {
        return this.bottom;
    }
}

function generateTicks$1(generationOptions, dataRange) {
    const ticks = [];
    const MIN_SPACING = 1e-14;
    const { bounds , step , min , ma***REMOVED*** , precision , count , ma***REMOVED***Ticks , ma***REMOVED***Digits , includeBounds  } = generationOptions;
    const unit = step || 1;
    const ma***REMOVED***Spaces = ma***REMOVED***Ticks - 1;
    const { min: rmin , ma***REMOVED***: rma***REMOVED***  } = dataRange;
    const minDefined = !helpers_segment.isNullOrUndef(min);
    const ma***REMOVED***Defined = !helpers_segment.isNullOrUndef(ma***REMOVED***);
    const countDefined = !helpers_segment.isNullOrUndef(count);
    const minSpacing = (rma***REMOVED*** - rmin) / (ma***REMOVED***Digits + 1);
    let spacing = helpers_segment.niceNum((rma***REMOVED*** - rmin) / ma***REMOVED***Spaces / unit) * unit;
    let factor, niceMin, niceMa***REMOVED***, numSpaces;
    if (spacing < MIN_SPACING && !minDefined && !ma***REMOVED***Defined) {
        return [
            {
                value: rmin
            },
            {
                value: rma***REMOVED***
            }
        ];
    }
    numSpaces = Math.ceil(rma***REMOVED*** / spacing) - Math.floor(rmin / spacing);
    if (numSpaces > ma***REMOVED***Spaces) {
        spacing = helpers_segment.niceNum(numSpaces * spacing / ma***REMOVED***Spaces / unit) * unit;
    }
    if (!helpers_segment.isNullOrUndef(precision)) {
        factor = Math.pow(10, precision);
        spacing = Math.ceil(spacing * factor) / factor;
    }
    if (bounds === 'ticks') {
        niceMin = Math.floor(rmin / spacing) * spacing;
        niceMa***REMOVED*** = Math.ceil(rma***REMOVED*** / spacing) * spacing;
    } else {
        niceMin = rmin;
        niceMa***REMOVED*** = rma***REMOVED***;
    }
    if (minDefined && ma***REMOVED***Defined && step && helpers_segment.almostWhole((ma***REMOVED*** - min) / step, spacing / 1000)) {
        numSpaces = Math.round(Math.min((ma***REMOVED*** - min) / spacing, ma***REMOVED***Ticks));
        spacing = (ma***REMOVED*** - min) / numSpaces;
        niceMin = min;
        niceMa***REMOVED*** = ma***REMOVED***;
    } else if (countDefined) {
        niceMin = minDefined ? min : niceMin;
        niceMa***REMOVED*** = ma***REMOVED***Defined ? ma***REMOVED*** : niceMa***REMOVED***;
        numSpaces = count - 1;
        spacing = (niceMa***REMOVED*** - niceMin) / numSpaces;
    } else {
        numSpaces = (niceMa***REMOVED*** - niceMin) / spacing;
        if (helpers_segment.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
            numSpaces = Math.round(numSpaces);
        } else {
            numSpaces = Math.ceil(numSpaces);
        }
    }
    const decimalPlaces = Math.ma***REMOVED***(helpers_segment._decimalPlaces(spacing), helpers_segment._decimalPlaces(niceMin));
    factor = Math.pow(10, helpers_segment.isNullOrUndef(precision) ? decimalPlaces : precision);
    niceMin = Math.round(niceMin * factor) / factor;
    niceMa***REMOVED*** = Math.round(niceMa***REMOVED*** * factor) / factor;
    let j = 0;
    if (minDefined) {
        if (includeBounds && niceMin !== min) {
            ticks.push({
                value: min
            });
            if (niceMin < min) {
                j++;
            }
            if (helpers_segment.almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
                j++;
            }
        } else if (niceMin < min) {
            j++;
        }
    }
    for(; j < numSpaces; ++j){
        const tickValue = Math.round((niceMin + j * spacing) * factor) / factor;
        if (ma***REMOVED***Defined && tickValue > ma***REMOVED***) {
            break;
        }
        ticks.push({
            value: tickValue
        });
    }
    if (ma***REMOVED***Defined && includeBounds && niceMa***REMOVED*** !== ma***REMOVED***) {
        if (ticks.length && helpers_segment.almostEquals(ticks[ticks.length - 1].value, ma***REMOVED***, relativeLabelSize(ma***REMOVED***, minSpacing, generationOptions))) {
            ticks[ticks.length - 1].value = ma***REMOVED***;
        } else {
            ticks.push({
                value: ma***REMOVED***
            });
        }
    } else if (!ma***REMOVED***Defined || niceMa***REMOVED*** === ma***REMOVED***) {
        ticks.push({
            value: niceMa***REMOVED***
        });
    }
    return ticks;
}
function relativeLabelSize(value, minSpacing, { horizontal , minRotation  }) {
    const rad = helpers_segment.toRadians(minRotation);
    const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001;
    const length = 0.75 * minSpacing * ('' + value).length;
    return Math.min(minSpacing / ratio, length);
}
class LinearScaleBase e***REMOVED***tends Scale {
    constructor(cfg){
        super(cfg);
         this.start = undefined;
         this.end = undefined;
         this._startValue = undefined;
         this._endValue = undefined;
        this._valueRange = 0;
    }
    parse(raw, inde***REMOVED***) {
        if (helpers_segment.isNullOrUndef(raw)) {
            return null;
        }
        if ((typeof raw === 'number' || raw instanceof Number) && !isFinite(+raw)) {
            return null;
        }
        return +raw;
    }
    handleTickRangeOptions() {
        const { beginAtZero  } = this.options;
        const { minDefined , ma***REMOVED***Defined  } = this.getUserBounds();
        let { min , ma***REMOVED***  } = this;
        const setMin = (v)=>min = minDefined ? min : v;
        const setMa***REMOVED*** = (v)=>ma***REMOVED*** = ma***REMOVED***Defined ? ma***REMOVED*** : v;
        if (beginAtZero) {
            const minSign = helpers_segment.sign(min);
            const ma***REMOVED***Sign = helpers_segment.sign(ma***REMOVED***);
            if (minSign < 0 && ma***REMOVED***Sign < 0) {
                setMa***REMOVED***(0);
            } else if (minSign > 0 && ma***REMOVED***Sign > 0) {
                setMin(0);
            }
        }
        if (min === ma***REMOVED***) {
            let offset = ma***REMOVED*** === 0 ? 1 : Math.abs(ma***REMOVED*** * 0.05);
            setMa***REMOVED***(ma***REMOVED*** + offset);
            if (!beginAtZero) {
                setMin(min - offset);
            }
        }
        this.min = min;
        this.ma***REMOVED*** = ma***REMOVED***;
    }
    getTickLimit() {
        const tickOpts = this.options.ticks;
        let { ma***REMOVED***TicksLimit , stepSize  } = tickOpts;
        let ma***REMOVED***Ticks;
        if (stepSize) {
            ma***REMOVED***Ticks = Math.ceil(this.ma***REMOVED*** / stepSize) - Math.floor(this.min / stepSize) + 1;
            if (ma***REMOVED***Ticks > 1000) {
                console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${ma***REMOVED***Ticks} ticks. Limiting to 1000.`);
                ma***REMOVED***Ticks = 1000;
            }
        } else {
            ma***REMOVED***Ticks = this.computeTickLimit();
            ma***REMOVED***TicksLimit = ma***REMOVED***TicksLimit || 11;
        }
        if (ma***REMOVED***TicksLimit) {
            ma***REMOVED***Ticks = Math.min(ma***REMOVED***TicksLimit, ma***REMOVED***Ticks);
        }
        return ma***REMOVED***Ticks;
    }
 computeTickLimit() {
        return Number.POSITIVE_INFINITY;
    }
    buildTicks() {
        const opts = this.options;
        const tickOpts = opts.ticks;
        let ma***REMOVED***Ticks = this.getTickLimit();
        ma***REMOVED***Ticks = Math.ma***REMOVED***(2, ma***REMOVED***Ticks);
        const numericGeneratorOptions = {
            ma***REMOVED***Ticks,
            bounds: opts.bounds,
            min: opts.min,
            ma***REMOVED***: opts.ma***REMOVED***,
            precision: tickOpts.precision,
            step: tickOpts.stepSize,
            count: tickOpts.count,
            ma***REMOVED***Digits: this._ma***REMOVED***Digits(),
            horizontal: this.isHorizontal(),
            minRotation: tickOpts.minRotation || 0,
            includeBounds: tickOpts.includeBounds !== false
        };
        const dataRange = this._range || this;
        const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
        if (opts.bounds === 'ticks') {
            helpers_segment._setMinAndMa***REMOVED***ByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
            ticks.reverse();
            this.start = this.ma***REMOVED***;
            this.end = this.min;
        } else {
            this.start = this.min;
            this.end = this.ma***REMOVED***;
        }
        return ticks;
    }
 configure() {
        const ticks = this.ticks;
        let start = this.min;
        let end = this.ma***REMOVED***;
        super.configure();
        if (this.options.offset && ticks.length) {
            const offset = (end - start) / Math.ma***REMOVED***(ticks.length - 1, 1) / 2;
            start -= offset;
            end += offset;
        }
        this._startValue = start;
        this._endValue = end;
        this._valueRange = end - start;
    }
    getLabelForValue(value) {
        return helpers_segment.formatNumber(value, this.chart.options.locale, this.options.ticks.format);
    }
}

class LinearScale e***REMOVED***tends LinearScaleBase {
    static id = 'linear';
 static defaults = {
        ticks: {
            callback: helpers_segment.Ticks.formatters.numeric
        }
    };
    determineDataLimits() {
        const { min , ma***REMOVED***  } = this.getMinMa***REMOVED***(true);
        this.min = helpers_segment.isNumberFinite(min) ? min : 0;
        this.ma***REMOVED*** = helpers_segment.isNumberFinite(ma***REMOVED***) ? ma***REMOVED*** : 1;
        this.handleTickRangeOptions();
    }
 computeTickLimit() {
        const horizontal = this.isHorizontal();
        const length = horizontal ? this.width : this.height;
        const minRotation = helpers_segment.toRadians(this.options.ticks.minRotation);
        const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 0.001;
        const tickFont = this._resolveTickFontOptions(0);
        return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
    }
    getPi***REMOVED***elForValue(value) {
        return value === null ? NaN : this.getPi***REMOVED***elForDecimal((value - this._startValue) / this._valueRange);
    }
    getValueForPi***REMOVED***el(pi***REMOVED***el) {
        return this._startValue + this.getDecimalForPi***REMOVED***el(pi***REMOVED***el) * this._valueRange;
    }
}

const log10Floor = (v)=>Math.floor(helpers_segment.log10(v));
const changeE***REMOVED***ponent = (v, m)=>Math.pow(10, log10Floor(v) + m);
function isMajor(tickVal) {
    const remain = tickVal / Math.pow(10, log10Floor(tickVal));
    return remain === 1;
}
function steps(min, ma***REMOVED***, rangeE***REMOVED***p) {
    const rangeStep = Math.pow(10, rangeE***REMOVED***p);
    const start = Math.floor(min / rangeStep);
    const end = Math.ceil(ma***REMOVED*** / rangeStep);
    return end - start;
}
function startE***REMOVED***p(min, ma***REMOVED***) {
    const range = ma***REMOVED*** - min;
    let rangeE***REMOVED***p = log10Floor(range);
    while(steps(min, ma***REMOVED***, rangeE***REMOVED***p) > 10){
        rangeE***REMOVED***p++;
    }
    while(steps(min, ma***REMOVED***, rangeE***REMOVED***p) < 10){
        rangeE***REMOVED***p--;
    }
    return Math.min(rangeE***REMOVED***p, log10Floor(min));
}
 function generateTicks(generationOptions, { min , ma***REMOVED***  }) {
    min = helpers_segment.finiteOrDefault(generationOptions.min, min);
    const ticks = [];
    const minE***REMOVED***p = log10Floor(min);
    let e***REMOVED***p = startE***REMOVED***p(min, ma***REMOVED***);
    let precision = e***REMOVED***p < 0 ? Math.pow(10, Math.abs(e***REMOVED***p)) : 1;
    const stepSize = Math.pow(10, e***REMOVED***p);
    const base = minE***REMOVED***p > e***REMOVED***p ? Math.pow(10, minE***REMOVED***p) : 0;
    const start = Math.round((min - base) * precision) / precision;
    const offset = Math.floor((min - base) / stepSize / 10) * stepSize * 10;
    let significand = Math.floor((start - offset) / Math.pow(10, e***REMOVED***p));
    let value = helpers_segment.finiteOrDefault(generationOptions.min, Math.round((base + offset + significand * Math.pow(10, e***REMOVED***p)) * precision) / precision);
    while(value < ma***REMOVED***){
        ticks.push({
            value,
            major: isMajor(value),
            significand
        });
        if (significand >= 10) {
            significand = significand < 15 ? 15 : 20;
        } else {
            significand++;
        }
        if (significand >= 20) {
            e***REMOVED***p++;
            significand = 2;
            precision = e***REMOVED***p >= 0 ? 1 : precision;
        }
        value = Math.round((base + offset + significand * Math.pow(10, e***REMOVED***p)) * precision) / precision;
    }
    const lastTick = helpers_segment.finiteOrDefault(generationOptions.ma***REMOVED***, value);
    ticks.push({
        value: lastTick,
        major: isMajor(lastTick),
        significand
    });
    return ticks;
}
class LogarithmicScale e***REMOVED***tends Scale {
    static id = 'logarithmic';
 static defaults = {
        ticks: {
            callback: helpers_segment.Ticks.formatters.logarithmic,
            major: {
                enabled: true
            }
        }
    };
    constructor(cfg){
        super(cfg);
         this.start = undefined;
         this.end = undefined;
         this._startValue = undefined;
        this._valueRange = 0;
    }
    parse(raw, inde***REMOVED***) {
        const value = LinearScaleBase.prototype.parse.apply(this, [
            raw,
            inde***REMOVED***
        ]);
        if (value === 0) {
            this._zero = true;
            return undefined;
        }
        return helpers_segment.isNumberFinite(value) && value > 0 ? value : null;
    }
    determineDataLimits() {
        const { min , ma***REMOVED***  } = this.getMinMa***REMOVED***(true);
        this.min = helpers_segment.isNumberFinite(min) ? Math.ma***REMOVED***(0, min) : null;
        this.ma***REMOVED*** = helpers_segment.isNumberFinite(ma***REMOVED***) ? Math.ma***REMOVED***(0, ma***REMOVED***) : null;
        if (this.options.beginAtZero) {
            this._zero = true;
        }
        if (this._zero && this.min !== this._suggestedMin && !helpers_segment.isNumberFinite(this._userMin)) {
            this.min = min === changeE***REMOVED***ponent(this.min, 0) ? changeE***REMOVED***ponent(this.min, -1) : changeE***REMOVED***ponent(this.min, 0);
        }
        this.handleTickRangeOptions();
    }
    handleTickRangeOptions() {
        const { minDefined , ma***REMOVED***Defined  } = this.getUserBounds();
        let min = this.min;
        let ma***REMOVED*** = this.ma***REMOVED***;
        const setMin = (v)=>min = minDefined ? min : v;
        const setMa***REMOVED*** = (v)=>ma***REMOVED*** = ma***REMOVED***Defined ? ma***REMOVED*** : v;
        if (min === ma***REMOVED***) {
            if (min <= 0) {
                setMin(1);
                setMa***REMOVED***(10);
            } else {
                setMin(changeE***REMOVED***ponent(min, -1));
                setMa***REMOVED***(changeE***REMOVED***ponent(ma***REMOVED***, +1));
            }
        }
        if (min <= 0) {
            setMin(changeE***REMOVED***ponent(ma***REMOVED***, -1));
        }
        if (ma***REMOVED*** <= 0) {
            setMa***REMOVED***(changeE***REMOVED***ponent(min, +1));
        }
        this.min = min;
        this.ma***REMOVED*** = ma***REMOVED***;
    }
    buildTicks() {
        const opts = this.options;
        const generationOptions = {
            min: this._userMin,
            ma***REMOVED***: this._userMa***REMOVED***
        };
        const ticks = generateTicks(generationOptions, this);
        if (opts.bounds === 'ticks') {
            helpers_segment._setMinAndMa***REMOVED***ByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
            ticks.reverse();
            this.start = this.ma***REMOVED***;
            this.end = this.min;
        } else {
            this.start = this.min;
            this.end = this.ma***REMOVED***;
        }
        return ticks;
    }
 getLabelForValue(value) {
        return value === undefined ? '0' : helpers_segment.formatNumber(value, this.chart.options.locale, this.options.ticks.format);
    }
 configure() {
        const start = this.min;
        super.configure();
        this._startValue = helpers_segment.log10(start);
        this._valueRange = helpers_segment.log10(this.ma***REMOVED***) - helpers_segment.log10(start);
    }
    getPi***REMOVED***elForValue(value) {
        if (value === undefined || value === 0) {
            value = this.min;
        }
        if (value === null || isNaN(value)) {
            return NaN;
        }
        return this.getPi***REMOVED***elForDecimal(value === this.min ? 0 : (helpers_segment.log10(value) - this._startValue) / this._valueRange);
    }
    getValueForPi***REMOVED***el(pi***REMOVED***el) {
        const decimal = this.getDecimalForPi***REMOVED***el(pi***REMOVED***el);
        return Math.pow(10, this._startValue + decimal * this._valueRange);
    }
}

function getTickBackdropHeight(opts) {
    const tickOpts = opts.ticks;
    if (tickOpts.display && opts.display) {
        const padding = helpers_segment.toPadding(tickOpts.backdropPadding);
        return helpers_segment.valueOrDefault(tickOpts.font && tickOpts.font.size, helpers_segment.defaults.font.size) + padding.height;
    }
    return 0;
}
function measureLabelSize(ct***REMOVED***, font, label) {
    label = helpers_segment.isArray(label) ? label : [
        label
    ];
    return {
        w: helpers_segment._longestTe***REMOVED***t(ct***REMOVED***, font.string, label),
        h: label.length * font.lineHeight
    };
}
function determineLimits(angle, pos, size, min, ma***REMOVED***) {
    if (angle === min || angle === ma***REMOVED***) {
        return {
            start: pos - size / 2,
            end: pos + size / 2
        };
    } else if (angle < min || angle > ma***REMOVED***) {
        return {
            start: pos - size,
            end: pos
        };
    }
    return {
        start: pos,
        end: pos + size
    };
}
 function fitWithPointLabels(scale) {
    const orig = {
        l: scale.left + scale._padding.left,
        r: scale.right - scale._padding.right,
        t: scale.top + scale._padding.top,
        b: scale.bottom - scale._padding.bottom
    };
    const limits = Object.assign({}, orig);
    const labelSizes = [];
    const padding = [];
    const valueCount = scale._pointLabels.length;
    const pointLabelOpts = scale.options.pointLabels;
    const additionalAngle = pointLabelOpts.centerPointLabels ? helpers_segment.PI / valueCount : 0;
    for(let i = 0; i < valueCount; i++){
        const opts = pointLabelOpts.setConte***REMOVED***t(scale.getPointLabelConte***REMOVED***t(i));
        padding[i] = opts.padding;
        const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle);
        const plFont = helpers_segment.toFont(opts.font);
        const te***REMOVED***tSize = measureLabelSize(scale.ct***REMOVED***, plFont, scale._pointLabels[i]);
        labelSizes[i] = te***REMOVED***tSize;
        const angleRadians = helpers_segment._normalizeAngle(scale.getInde***REMOVED***Angle(i) + additionalAngle);
        const angle = Math.round(helpers_segment.toDegrees(angleRadians));
        const hLimits = determineLimits(angle, pointPosition.***REMOVED***, te***REMOVED***tSize.w, 0, 180);
        const vLimits = determineLimits(angle, pointPosition.y, te***REMOVED***tSize.h, 90, 270);
        updateLimits(limits, orig, angleRadians, hLimits, vLimits);
    }
    scale.setCenterPoint(orig.l - limits.l, limits.r - orig.r, orig.t - limits.t, limits.b - orig.b);
    scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
}
function updateLimits(limits, orig, angle, hLimits, vLimits) {
    const sin = Math.abs(Math.sin(angle));
    const cos = Math.abs(Math.cos(angle));
    let ***REMOVED*** = 0;
    let y = 0;
    if (hLimits.start < orig.l) {
        ***REMOVED*** = (orig.l - hLimits.start) / sin;
        limits.l = Math.min(limits.l, orig.l - ***REMOVED***);
    } else if (hLimits.end > orig.r) {
        ***REMOVED*** = (hLimits.end - orig.r) / sin;
        limits.r = Math.ma***REMOVED***(limits.r, orig.r + ***REMOVED***);
    }
    if (vLimits.start < orig.t) {
        y = (orig.t - vLimits.start) / cos;
        limits.t = Math.min(limits.t, orig.t - y);
    } else if (vLimits.end > orig.b) {
        y = (vLimits.end - orig.b) / cos;
        limits.b = Math.ma***REMOVED***(limits.b, orig.b + y);
    }
}
function createPointLabelItem(scale, inde***REMOVED***, itemOpts) {
    const outerDistance = scale.drawingArea;
    const { e***REMOVED***tra , additionalAngle , padding , size  } = itemOpts;
    const pointLabelPosition = scale.getPointPosition(inde***REMOVED***, outerDistance + e***REMOVED***tra + padding, additionalAngle);
    const angle = Math.round(helpers_segment.toDegrees(helpers_segment._normalizeAngle(pointLabelPosition.angle + helpers_segment.HALF_PI)));
    const y = yForAngle(pointLabelPosition.y, size.h, angle);
    const te***REMOVED***tAlign = getTe***REMOVED***tAlignForAngle(angle);
    const left = leftForTe***REMOVED***tAlign(pointLabelPosition.***REMOVED***, size.w, te***REMOVED***tAlign);
    return {
        visible: true,
        ***REMOVED***: pointLabelPosition.***REMOVED***,
        y,
        te***REMOVED***tAlign,
        left,
        top: y,
        right: left + size.w,
        bottom: y + size.h
    };
}
function isNotOverlapped(item, area) {
    if (!area) {
        return true;
    }
    const { left , top , right , bottom  } = item;
    const ape***REMOVED***esInArea = helpers_segment._isPointInArea({
        ***REMOVED***: left,
        y: top
    }, area) || helpers_segment._isPointInArea({
        ***REMOVED***: left,
        y: bottom
    }, area) || helpers_segment._isPointInArea({
        ***REMOVED***: right,
        y: top
    }, area) || helpers_segment._isPointInArea({
        ***REMOVED***: right,
        y: bottom
    }, area);
    return !ape***REMOVED***esInArea;
}
function buildPointLabelItems(scale, labelSizes, padding) {
    const items = [];
    const valueCount = scale._pointLabels.length;
    const opts = scale.options;
    const { centerPointLabels , display  } = opts.pointLabels;
    const itemOpts = {
        e***REMOVED***tra: getTickBackdropHeight(opts) / 2,
        additionalAngle: centerPointLabels ? helpers_segment.PI / valueCount : 0
    };
    let area;
    for(let i = 0; i < valueCount; i++){
        itemOpts.padding = padding[i];
        itemOpts.size = labelSizes[i];
        const item = createPointLabelItem(scale, i, itemOpts);
        items.push(item);
        if (display === 'auto') {
            item.visible = isNotOverlapped(item, area);
            if (item.visible) {
                area = item;
            }
        }
    }
    return items;
}
function getTe***REMOVED***tAlignForAngle(angle) {
    if (angle === 0 || angle === 180) {
        return 'center';
    } else if (angle < 180) {
        return 'left';
    }
    return 'right';
}
function leftForTe***REMOVED***tAlign(***REMOVED***, w, align) {
    if (align === 'right') {
        ***REMOVED*** -= w;
    } else if (align === 'center') {
        ***REMOVED*** -= w / 2;
    }
    return ***REMOVED***;
}
function yForAngle(y, h, angle) {
    if (angle === 90 || angle === 270) {
        y -= h / 2;
    } else if (angle > 270 || angle < 90) {
        y -= h;
    }
    return y;
}
function drawPointLabelBo***REMOVED***(ct***REMOVED***, opts, item) {
    const { left , top , right , bottom  } = item;
    const { backdropColor  } = opts;
    if (!helpers_segment.isNullOrUndef(backdropColor)) {
        const borderRadius = helpers_segment.toTRBLCorners(opts.borderRadius);
        const padding = helpers_segment.toPadding(opts.backdropPadding);
        ct***REMOVED***.fillStyle = backdropColor;
        const backdropLeft = left - padding.left;
        const backdropTop = top - padding.top;
        const backdropWidth = right - left + padding.width;
        const backdropHeight = bottom - top + padding.height;
        if (Object.values(borderRadius).some((v)=>v !== 0)) {
            ct***REMOVED***.beginPath();
            helpers_segment.addRoundedRectPath(ct***REMOVED***, {
                ***REMOVED***: backdropLeft,
                y: backdropTop,
                w: backdropWidth,
                h: backdropHeight,
                radius: borderRadius
            });
            ct***REMOVED***.fill();
        } else {
            ct***REMOVED***.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
        }
    }
}
function drawPointLabels(scale, labelCount) {
    const { ct***REMOVED*** , options: { pointLabels  }  } = scale;
    for(let i = labelCount - 1; i >= 0; i--){
        const item = scale._pointLabelItems[i];
        if (!item.visible) {
            continue;
        }
        const optsAtInde***REMOVED*** = pointLabels.setConte***REMOVED***t(scale.getPointLabelConte***REMOVED***t(i));
        drawPointLabelBo***REMOVED***(ct***REMOVED***, optsAtInde***REMOVED***, item);
        const plFont = helpers_segment.toFont(optsAtInde***REMOVED***.font);
        const { ***REMOVED*** , y , te***REMOVED***tAlign  } = item;
        helpers_segment.renderTe***REMOVED***t(ct***REMOVED***, scale._pointLabels[i], ***REMOVED***, y + plFont.lineHeight / 2, plFont, {
            color: optsAtInde***REMOVED***.color,
            te***REMOVED***tAlign: te***REMOVED***tAlign,
            te***REMOVED***tBaseline: 'middle'
        });
    }
}
function pathRadiusLine(scale, radius, circular, labelCount) {
    const { ct***REMOVED***  } = scale;
    if (circular) {
        ct***REMOVED***.arc(scale.***REMOVED***Center, scale.yCenter, radius, 0, helpers_segment.TAU);
    } else {
        let pointPosition = scale.getPointPosition(0, radius);
        ct***REMOVED***.moveTo(pointPosition.***REMOVED***, pointPosition.y);
        for(let i = 1; i < labelCount; i++){
            pointPosition = scale.getPointPosition(i, radius);
            ct***REMOVED***.lineTo(pointPosition.***REMOVED***, pointPosition.y);
        }
    }
}
function drawRadiusLine(scale, gridLineOpts, radius, labelCount, borderOpts) {
    const ct***REMOVED*** = scale.ct***REMOVED***;
    const circular = gridLineOpts.circular;
    const { color , lineWidth  } = gridLineOpts;
    if (!circular && !labelCount || !color || !lineWidth || radius < 0) {
        return;
    }
    ct***REMOVED***.save();
    ct***REMOVED***.strokeStyle = color;
    ct***REMOVED***.lineWidth = lineWidth;
    ct***REMOVED***.setLineDash(borderOpts.dash);
    ct***REMOVED***.lineDashOffset = borderOpts.dashOffset;
    ct***REMOVED***.beginPath();
    pathRadiusLine(scale, radius, circular, labelCount);
    ct***REMOVED***.closePath();
    ct***REMOVED***.stroke();
    ct***REMOVED***.restore();
}
function createPointLabelConte***REMOVED***t(parent, inde***REMOVED***, label) {
    return helpers_segment.createConte***REMOVED***t(parent, {
        label,
        inde***REMOVED***,
        type: 'pointLabel'
    });
}
class RadialLinearScale e***REMOVED***tends LinearScaleBase {
    static id = 'radialLinear';
 static defaults = {
        display: true,
        animate: true,
        position: 'chartArea',
        angleLines: {
            display: true,
            lineWidth: 1,
            borderDash: [],
            borderDashOffset: 0.0
        },
        grid: {
            circular: false
        },
        startAngle: 0,
        ticks: {
            showLabelBackdrop: true,
            callback: helpers_segment.Ticks.formatters.numeric
        },
        pointLabels: {
            backdropColor: undefined,
            backdropPadding: 2,
            display: true,
            font: {
                size: 10
            },
            callback (label) {
                return label;
            },
            padding: 5,
            centerPointLabels: false
        }
    };
    static defaultRoutes = {
        'angleLines.color': 'borderColor',
        'pointLabels.color': 'color',
        'ticks.color': 'color'
    };
    static descriptors = {
        angleLines: {
            _fallback: 'grid'
        }
    };
    constructor(cfg){
        super(cfg);
         this.***REMOVED***Center = undefined;
         this.yCenter = undefined;
         this.drawingArea = undefined;
         this._pointLabels = [];
        this._pointLabelItems = [];
    }
    setDimensions() {
        const padding = this._padding = helpers_segment.toPadding(getTickBackdropHeight(this.options) / 2);
        const w = this.width = this.ma***REMOVED***Width - padding.width;
        const h = this.height = this.ma***REMOVED***Height - padding.height;
        this.***REMOVED***Center = Math.floor(this.left + w / 2 + padding.left);
        this.yCenter = Math.floor(this.top + h / 2 + padding.top);
        this.drawingArea = Math.floor(Math.min(w, h) / 2);
    }
    determineDataLimits() {
        const { min , ma***REMOVED***  } = this.getMinMa***REMOVED***(false);
        this.min = helpers_segment.isNumberFinite(min) && !isNaN(min) ? min : 0;
        this.ma***REMOVED*** = helpers_segment.isNumberFinite(ma***REMOVED***) && !isNaN(ma***REMOVED***) ? ma***REMOVED*** : 0;
        this.handleTickRangeOptions();
    }
 computeTickLimit() {
        return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
    }
    generateTickLabels(ticks) {
        LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
        this._pointLabels = this.getLabels().map((value, inde***REMOVED***)=>{
            const label = helpers_segment.callback(this.options.pointLabels.callback, [
                value,
                inde***REMOVED***
            ], this);
            return label || label === 0 ? label : '';
        }).filter((v, i)=>this.chart.getDataVisibility(i));
    }
    fit() {
        const opts = this.options;
        if (opts.display && opts.pointLabels.display) {
            fitWithPointLabels(this);
        } else {
            this.setCenterPoint(0, 0, 0, 0);
        }
    }
    setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
        this.***REMOVED***Center += Math.floor((leftMovement - rightMovement) / 2);
        this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
        this.drawingArea -= Math.min(this.drawingArea / 2, Math.ma***REMOVED***(leftMovement, rightMovement, topMovement, bottomMovement));
    }
    getInde***REMOVED***Angle(inde***REMOVED***) {
        const angleMultiplier = helpers_segment.TAU / (this._pointLabels.length || 1);
        const startAngle = this.options.startAngle || 0;
        return helpers_segment._normalizeAngle(inde***REMOVED*** * angleMultiplier + helpers_segment.toRadians(startAngle));
    }
    getDistanceFromCenterForValue(value) {
        if (helpers_segment.isNullOrUndef(value)) {
            return NaN;
        }
        const scalingFactor = this.drawingArea / (this.ma***REMOVED*** - this.min);
        if (this.options.reverse) {
            return (this.ma***REMOVED*** - value) * scalingFactor;
        }
        return (value - this.min) * scalingFactor;
    }
    getValueForDistanceFromCenter(distance) {
        if (helpers_segment.isNullOrUndef(distance)) {
            return NaN;
        }
        const scaledDistance = distance / (this.drawingArea / (this.ma***REMOVED*** - this.min));
        return this.options.reverse ? this.ma***REMOVED*** - scaledDistance : this.min + scaledDistance;
    }
    getPointLabelConte***REMOVED***t(inde***REMOVED***) {
        const pointLabels = this._pointLabels || [];
        if (inde***REMOVED*** >= 0 && inde***REMOVED*** < pointLabels.length) {
            const pointLabel = pointLabels[inde***REMOVED***];
            return createPointLabelConte***REMOVED***t(this.getConte***REMOVED***t(), inde***REMOVED***, pointLabel);
        }
    }
    getPointPosition(inde***REMOVED***, distanceFromCenter, additionalAngle = 0) {
        const angle = this.getInde***REMOVED***Angle(inde***REMOVED***) - helpers_segment.HALF_PI + additionalAngle;
        return {
            ***REMOVED***: Math.cos(angle) * distanceFromCenter + this.***REMOVED***Center,
            y: Math.sin(angle) * distanceFromCenter + this.yCenter,
            angle
        };
    }
    getPointPositionForValue(inde***REMOVED***, value) {
        return this.getPointPosition(inde***REMOVED***, this.getDistanceFromCenterForValue(value));
    }
    getBasePosition(inde***REMOVED***) {
        return this.getPointPositionForValue(inde***REMOVED*** || 0, this.getBaseValue());
    }
    getPointLabelPosition(inde***REMOVED***) {
        const { left , top , right , bottom  } = this._pointLabelItems[inde***REMOVED***];
        return {
            left,
            top,
            right,
            bottom
        };
    }
 drawBackground() {
        const { backgroundColor , grid: { circular  }  } = this.options;
        if (backgroundColor) {
            const ct***REMOVED*** = this.ct***REMOVED***;
            ct***REMOVED***.save();
            ct***REMOVED***.beginPath();
            pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
            ct***REMOVED***.closePath();
            ct***REMOVED***.fillStyle = backgroundColor;
            ct***REMOVED***.fill();
            ct***REMOVED***.restore();
        }
    }
 drawGrid() {
        const ct***REMOVED*** = this.ct***REMOVED***;
        const opts = this.options;
        const { angleLines , grid , border  } = opts;
        const labelCount = this._pointLabels.length;
        let i, offset, position;
        if (opts.pointLabels.display) {
            drawPointLabels(this, labelCount);
        }
        if (grid.display) {
            this.ticks.forEach((tick, inde***REMOVED***)=>{
                if (inde***REMOVED*** !== 0 || inde***REMOVED*** === 0 && this.min < 0) {
                    offset = this.getDistanceFromCenterForValue(tick.value);
                    const conte***REMOVED***t = this.getConte***REMOVED***t(inde***REMOVED***);
                    const optsAtInde***REMOVED*** = grid.setConte***REMOVED***t(conte***REMOVED***t);
                    const optsAtInde***REMOVED***Border = border.setConte***REMOVED***t(conte***REMOVED***t);
                    drawRadiusLine(this, optsAtInde***REMOVED***, offset, labelCount, optsAtInde***REMOVED***Border);
                }
            });
        }
        if (angleLines.display) {
            ct***REMOVED***.save();
            for(i = labelCount - 1; i >= 0; i--){
                const optsAtInde***REMOVED*** = angleLines.setConte***REMOVED***t(this.getPointLabelConte***REMOVED***t(i));
                const { color , lineWidth  } = optsAtInde***REMOVED***;
                if (!lineWidth || !color) {
                    continue;
                }
                ct***REMOVED***.lineWidth = lineWidth;
                ct***REMOVED***.strokeStyle = color;
                ct***REMOVED***.setLineDash(optsAtInde***REMOVED***.borderDash);
                ct***REMOVED***.lineDashOffset = optsAtInde***REMOVED***.borderDashOffset;
                offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.ma***REMOVED***);
                position = this.getPointPosition(i, offset);
                ct***REMOVED***.beginPath();
                ct***REMOVED***.moveTo(this.***REMOVED***Center, this.yCenter);
                ct***REMOVED***.lineTo(position.***REMOVED***, position.y);
                ct***REMOVED***.stroke();
            }
            ct***REMOVED***.restore();
        }
    }
 drawBorder() {}
 drawLabels() {
        const ct***REMOVED*** = this.ct***REMOVED***;
        const opts = this.options;
        const tickOpts = opts.ticks;
        if (!tickOpts.display) {
            return;
        }
        const startAngle = this.getInde***REMOVED***Angle(0);
        let offset, width;
        ct***REMOVED***.save();
        ct***REMOVED***.translate(this.***REMOVED***Center, this.yCenter);
        ct***REMOVED***.rotate(startAngle);
        ct***REMOVED***.te***REMOVED***tAlign = 'center';
        ct***REMOVED***.te***REMOVED***tBaseline = 'middle';
        this.ticks.forEach((tick, inde***REMOVED***)=>{
            if (inde***REMOVED*** === 0 && this.min >= 0 && !opts.reverse) {
                return;
            }
            const optsAtInde***REMOVED*** = tickOpts.setConte***REMOVED***t(this.getConte***REMOVED***t(inde***REMOVED***));
            const tickFont = helpers_segment.toFont(optsAtInde***REMOVED***.font);
            offset = this.getDistanceFromCenterForValue(this.ticks[inde***REMOVED***].value);
            if (optsAtInde***REMOVED***.showLabelBackdrop) {
                ct***REMOVED***.font = tickFont.string;
                width = ct***REMOVED***.measureTe***REMOVED***t(tick.label).width;
                ct***REMOVED***.fillStyle = optsAtInde***REMOVED***.backdropColor;
                const padding = helpers_segment.toPadding(optsAtInde***REMOVED***.backdropPadding);
                ct***REMOVED***.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
            }
            helpers_segment.renderTe***REMOVED***t(ct***REMOVED***, tick.label, 0, -offset, tickFont, {
                color: optsAtInde***REMOVED***.color,
                strokeColor: optsAtInde***REMOVED***.te***REMOVED***tStrokeColor,
                strokeWidth: optsAtInde***REMOVED***.te***REMOVED***tStrokeWidth
            });
        });
        ct***REMOVED***.restore();
    }
 drawTitle() {}
}

const INTERVALS = {
    millisecond: {
        common: true,
        size: 1,
        steps: 1000
    },
    second: {
        common: true,
        size: 1000,
        steps: 60
    },
    minute: {
        common: true,
        size: 60000,
        steps: 60
    },
    hour: {
        common: true,
        size: 3600000,
        steps: 24
    },
    day: {
        common: true,
        size: 86400000,
        steps: 30
    },
    week: {
        common: false,
        size: 604800000,
        steps: 4
    },
    month: {
        common: true,
        size: 2.628e9,
        steps: 12
    },
    quarter: {
        common: false,
        size: 7.884e9,
        steps: 4
    },
    year: {
        common: true,
        size: 3.154e10
    }
};
 const UNITS =  /* #__PURE__ */ Object.keys(INTERVALS);
 function sorter(a, b) {
    return a - b;
}
 function parse(scale, input) {
    if (helpers_segment.isNullOrUndef(input)) {
        return null;
    }
    const adapter = scale._adapter;
    const { parser , round , isoWeekday  } = scale._parseOpts;
    let value = input;
    if (typeof parser === 'function') {
        value = parser(value);
    }
    if (!helpers_segment.isNumberFinite(value)) {
        value = typeof parser === 'string' ? adapter.parse(value,  parser) : adapter.parse(value);
    }
    if (value === null) {
        return null;
    }
    if (round) {
        value = round === 'week' && (helpers_segment.isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, 'isoWeek', isoWeekday) : adapter.startOf(value, round);
    }
    return +value;
}
 function determineUnitForAutoTicks(minUnit, min, ma***REMOVED***, capacity) {
    const ilen = UNITS.length;
    for(let i = UNITS.inde***REMOVED***Of(minUnit); i < ilen - 1; ++i){
        const interval = INTERVALS[UNITS[i]];
        const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
        if (interval.common && Math.ceil((ma***REMOVED*** - min) / (factor * interval.size)) <= capacity) {
            return UNITS[i];
        }
    }
    return UNITS[ilen - 1];
}
 function determineUnitForFormatting(scale, numTicks, minUnit, min, ma***REMOVED***) {
    for(let i = UNITS.length - 1; i >= UNITS.inde***REMOVED***Of(minUnit); i--){
        const unit = UNITS[i];
        if (INTERVALS[unit].common && scale._adapter.diff(ma***REMOVED***, min, unit) >= numTicks - 1) {
            return unit;
        }
    }
    return UNITS[minUnit ? UNITS.inde***REMOVED***Of(minUnit) : 0];
}
 function determineMajorUnit(unit) {
    for(let i = UNITS.inde***REMOVED***Of(unit) + 1, ilen = UNITS.length; i < ilen; ++i){
        if (INTERVALS[UNITS[i]].common) {
            return UNITS[i];
        }
    }
}
 function addTick(ticks, time, timestamps) {
    if (!timestamps) {
        ticks[time] = true;
    } else if (timestamps.length) {
        const { lo , hi  } = helpers_segment._lookup(timestamps, time);
        const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
        ticks[timestamp] = true;
    }
}
 function setMajorTicks(scale, ticks, map, majorUnit) {
    const adapter = scale._adapter;
    const first = +adapter.startOf(ticks[0].value, majorUnit);
    const last = ticks[ticks.length - 1].value;
    let major, inde***REMOVED***;
    for(major = first; major <= last; major = +adapter.add(major, 1, majorUnit)){
        inde***REMOVED*** = map[major];
        if (inde***REMOVED*** >= 0) {
            ticks[inde***REMOVED***].major = true;
        }
    }
    return ticks;
}
 function ticksFromTimestamps(scale, values, majorUnit) {
    const ticks = [];
     const map = {};
    const ilen = values.length;
    let i, value;
    for(i = 0; i < ilen; ++i){
        value = values[i];
        map[value] = i;
        ticks.push({
            value,
            major: false
        });
    }
    return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map, majorUnit);
}
class TimeScale e***REMOVED***tends Scale {
    static id = 'time';
 static defaults = {
 bounds: 'data',
        adapters: {},
        time: {
            parser: false,
            unit: false,
            round: false,
            isoWeekday: false,
            minUnit: 'millisecond',
            displayFormats: {}
        },
        ticks: {
 source: 'auto',
            callback: false,
            major: {
                enabled: false
            }
        }
    };
 constructor(props){
        super(props);
         this._cache = {
            data: [],
            labels: [],
            all: []
        };
         this._unit = 'day';
         this._majorUnit = undefined;
        this._offsets = {};
        this._normalized = false;
        this._parseOpts = undefined;
    }
    init(scaleOpts, opts = {}) {
        const time = scaleOpts.time || (scaleOpts.time = {});
         const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
        adapter.init(opts);
        helpers_segment.mergeIf(time.displayFormats, adapter.formats());
        this._parseOpts = {
            parser: time.parser,
            round: time.round,
            isoWeekday: time.isoWeekday
        };
        super.init(scaleOpts);
        this._normalized = opts.normalized;
    }
 parse(raw, inde***REMOVED***) {
        if (raw === undefined) {
            return null;
        }
        return parse(this, raw);
    }
    beforeLayout() {
        super.beforeLayout();
        this._cache = {
            data: [],
            labels: [],
            all: []
        };
    }
    determineDataLimits() {
        const options = this.options;
        const adapter = this._adapter;
        const unit = options.time.unit || 'day';
        let { min , ma***REMOVED*** , minDefined , ma***REMOVED***Defined  } = this.getUserBounds();
 function _applyBounds(bounds) {
            if (!minDefined && !isNaN(bounds.min)) {
                min = Math.min(min, bounds.min);
            }
            if (!ma***REMOVED***Defined && !isNaN(bounds.ma***REMOVED***)) {
                ma***REMOVED*** = Math.ma***REMOVED***(ma***REMOVED***, bounds.ma***REMOVED***);
            }
        }
        if (!minDefined || !ma***REMOVED***Defined) {
            _applyBounds(this._getLabelBounds());
            if (options.bounds !== 'ticks' || options.ticks.source !== 'labels') {
                _applyBounds(this.getMinMa***REMOVED***(false));
            }
        }
        min = helpers_segment.isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
        ma***REMOVED*** = helpers_segment.isNumberFinite(ma***REMOVED***) && !isNaN(ma***REMOVED***) ? ma***REMOVED*** : +adapter.endOf(Date.now(), unit) + 1;
        this.min = Math.min(min, ma***REMOVED*** - 1);
        this.ma***REMOVED*** = Math.ma***REMOVED***(min + 1, ma***REMOVED***);
    }
 _getLabelBounds() {
        const arr = this.getLabelTimestamps();
        let min = Number.POSITIVE_INFINITY;
        let ma***REMOVED*** = Number.NEGATIVE_INFINITY;
        if (arr.length) {
            min = arr[0];
            ma***REMOVED*** = arr[arr.length - 1];
        }
        return {
            min,
            ma***REMOVED***
        };
    }
 buildTicks() {
        const options = this.options;
        const timeOpts = options.time;
        const tickOpts = options.ticks;
        const timestamps = tickOpts.source === 'labels' ? this.getLabelTimestamps() : this._generate();
        if (options.bounds === 'ticks' && timestamps.length) {
            this.min = this._userMin || timestamps[0];
            this.ma***REMOVED*** = this._userMa***REMOVED*** || timestamps[timestamps.length - 1];
        }
        const min = this.min;
        const ma***REMOVED*** = this.ma***REMOVED***;
        const ticks = helpers_segment._filterBetween(timestamps, min, ma***REMOVED***);
        this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.ma***REMOVED***, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.ma***REMOVED***));
        this._majorUnit = !tickOpts.major.enabled || this._unit === 'year' ? undefined : determineMajorUnit(this._unit);
        this.initOffsets(timestamps);
        if (options.reverse) {
            ticks.reverse();
        }
        return ticksFromTimestamps(this, ticks, this._majorUnit);
    }
    afterAutoSkip() {
        if (this.options.offsetAfterAutoskip) {
            this.initOffsets(this.ticks.map((tick)=>+tick.value));
        }
    }
 initOffsets(timestamps = []) {
        let start = 0;
        let end = 0;
        let first, last;
        if (this.options.offset && timestamps.length) {
            first = this.getDecimalForValue(timestamps[0]);
            if (timestamps.length === 1) {
                start = 1 - first;
            } else {
                start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
            }
            last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
            if (timestamps.length === 1) {
                end = last;
            } else {
                end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
            }
        }
        const limit = timestamps.length < 3 ? 0.5 : 0.25;
        start = helpers_segment._limitValue(start, 0, limit);
        end = helpers_segment._limitValue(end, 0, limit);
        this._offsets = {
            start,
            end,
            factor: 1 / (start + 1 + end)
        };
    }
 _generate() {
        const adapter = this._adapter;
        const min = this.min;
        const ma***REMOVED*** = this.ma***REMOVED***;
        const options = this.options;
        const timeOpts = options.time;
        const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, ma***REMOVED***, this._getLabelCapacity(min));
        const stepSize = helpers_segment.valueOrDefault(options.ticks.stepSize, 1);
        const weekday = minor === 'week' ? timeOpts.isoWeekday : false;
        const hasWeekday = helpers_segment.isNumber(weekday) || weekday === true;
        const ticks = {};
        let first = min;
        let time, count;
        if (hasWeekday) {
            first = +adapter.startOf(first, 'isoWeek', weekday);
        }
        first = +adapter.startOf(first, hasWeekday ? 'day' : minor);
        if (adapter.diff(ma***REMOVED***, min, minor) > 100000 * stepSize) {
            throw new Error(min + ' and ' + ma***REMOVED*** + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
        }
        const timestamps = options.ticks.source === 'data' && this.getDataTimestamps();
        for(time = first, count = 0; time < ma***REMOVED***; time = +adapter.add(time, stepSize, minor), count++){
            addTick(ticks, time, timestamps);
        }
        if (time === ma***REMOVED*** || options.bounds === 'ticks' || count === 1) {
            addTick(ticks, time, timestamps);
        }
        return Object.keys(ticks).sort(sorter).map((***REMOVED***)=>+***REMOVED***);
    }
 getLabelForValue(value) {
        const adapter = this._adapter;
        const timeOpts = this.options.time;
        if (timeOpts.tooltipFormat) {
            return adapter.format(value, timeOpts.tooltipFormat);
        }
        return adapter.format(value, timeOpts.displayFormats.datetime);
    }
 format(value, format) {
        const options = this.options;
        const formats = options.time.displayFormats;
        const unit = this._unit;
        const fmt = format || formats[unit];
        return this._adapter.format(value, fmt);
    }
 _tickFormatFunction(time, inde***REMOVED***, ticks, format) {
        const options = this.options;
        const formatter = options.ticks.callback;
        if (formatter) {
            return helpers_segment.callback(formatter, [
                time,
                inde***REMOVED***,
                ticks
            ], this);
        }
        const formats = options.time.displayFormats;
        const unit = this._unit;
        const majorUnit = this._majorUnit;
        const minorFormat = unit && formats[unit];
        const majorFormat = majorUnit && formats[majorUnit];
        const tick = ticks[inde***REMOVED***];
        const major = majorUnit && majorFormat && tick && tick.major;
        return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
    }
 generateTickLabels(ticks) {
        let i, ilen, tick;
        for(i = 0, ilen = ticks.length; i < ilen; ++i){
            tick = ticks[i];
            tick.label = this._tickFormatFunction(tick.value, i, ticks);
        }
    }
 getDecimalForValue(value) {
        return value === null ? NaN : (value - this.min) / (this.ma***REMOVED*** - this.min);
    }
 getPi***REMOVED***elForValue(value) {
        const offsets = this._offsets;
        const pos = this.getDecimalForValue(value);
        return this.getPi***REMOVED***elForDecimal((offsets.start + pos) * offsets.factor);
    }
 getValueForPi***REMOVED***el(pi***REMOVED***el) {
        const offsets = this._offsets;
        const pos = this.getDecimalForPi***REMOVED***el(pi***REMOVED***el) / offsets.factor - offsets.end;
        return this.min + pos * (this.ma***REMOVED*** - this.min);
    }
 _getLabelSize(label) {
        const ticksOpts = this.options.ticks;
        const tickLabelWidth = this.ct***REMOVED***.measureTe***REMOVED***t(label).width;
        const angle = helpers_segment.toRadians(this.isHorizontal() ? ticksOpts.ma***REMOVED***Rotation : ticksOpts.minRotation);
        const cosRotation = Math.cos(angle);
        const sinRotation = Math.sin(angle);
        const tickFontSize = this._resolveTickFontOptions(0).size;
        return {
            w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
            h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
        };
    }
 _getLabelCapacity(e***REMOVED***ampleTime) {
        const timeOpts = this.options.time;
        const displayFormats = timeOpts.displayFormats;
        const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
        const e***REMOVED***ampleLabel = this._tickFormatFunction(e***REMOVED***ampleTime, 0, ticksFromTimestamps(this, [
            e***REMOVED***ampleTime
        ], this._majorUnit), format);
        const size = this._getLabelSize(e***REMOVED***ampleLabel);
        const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
        return capacity > 0 ? capacity : 1;
    }
 getDataTimestamps() {
        let timestamps = this._cache.data || [];
        let i, ilen;
        if (timestamps.length) {
            return timestamps;
        }
        const metas = this.getMatchingVisibleMetas();
        if (this._normalized && metas.length) {
            return this._cache.data = metas[0].controller.getAllParsedValues(this);
        }
        for(i = 0, ilen = metas.length; i < ilen; ++i){
            timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
        }
        return this._cache.data = this.normalize(timestamps);
    }
 getLabelTimestamps() {
        const timestamps = this._cache.labels || [];
        let i, ilen;
        if (timestamps.length) {
            return timestamps;
        }
        const labels = this.getLabels();
        for(i = 0, ilen = labels.length; i < ilen; ++i){
            timestamps.push(parse(this, labels[i]));
        }
        return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
    }
 normalize(values) {
        return helpers_segment._arrayUnique(values.sort(sorter));
    }
}

function interpolate(table, val, reverse) {
    let lo = 0;
    let hi = table.length - 1;
    let prevSource, ne***REMOVED***tSource, prevTarget, ne***REMOVED***tTarget;
    if (reverse) {
        if (val >= table[lo].pos && val <= table[hi].pos) {
            ({ lo , hi  } = helpers_segment._lookupByKey(table, 'pos', val));
        }
        ({ pos: prevSource , time: prevTarget  } = table[lo]);
        ({ pos: ne***REMOVED***tSource , time: ne***REMOVED***tTarget  } = table[hi]);
    } else {
        if (val >= table[lo].time && val <= table[hi].time) {
            ({ lo , hi  } = helpers_segment._lookupByKey(table, 'time', val));
        }
        ({ time: prevSource , pos: prevTarget  } = table[lo]);
        ({ time: ne***REMOVED***tSource , pos: ne***REMOVED***tTarget  } = table[hi]);
    }
    const span = ne***REMOVED***tSource - prevSource;
    return span ? prevTarget + (ne***REMOVED***tTarget - prevTarget) * (val - prevSource) / span : prevTarget;
}
class TimeSeriesScale e***REMOVED***tends TimeScale {
    static id = 'timeseries';
 static defaults = TimeScale.defaults;
 constructor(props){
        super(props);
         this._table = [];
         this._minPos = undefined;
         this._tableRange = undefined;
    }
 initOffsets() {
        const timestamps = this._getTimestampsForTable();
        const table = this._table = this.buildLookupTable(timestamps);
        this._minPos = interpolate(table, this.min);
        this._tableRange = interpolate(table, this.ma***REMOVED***) - this._minPos;
        super.initOffsets(timestamps);
    }
 buildLookupTable(timestamps) {
        const { min , ma***REMOVED***  } = this;
        const items = [];
        const table = [];
        let i, ilen, prev, curr, ne***REMOVED***t;
        for(i = 0, ilen = timestamps.length; i < ilen; ++i){
            curr = timestamps[i];
            if (curr >= min && curr <= ma***REMOVED***) {
                items.push(curr);
            }
        }
        if (items.length < 2) {
            return [
                {
                    time: min,
                    pos: 0
                },
                {
                    time: ma***REMOVED***,
                    pos: 1
                }
            ];
        }
        for(i = 0, ilen = items.length; i < ilen; ++i){
            ne***REMOVED***t = items[i + 1];
            prev = items[i - 1];
            curr = items[i];
            if (Math.round((ne***REMOVED***t + prev) / 2) !== curr) {
                table.push({
                    time: curr,
                    pos: i / (ilen - 1)
                });
            }
        }
        return table;
    }
 _generate() {
        const min = this.min;
        const ma***REMOVED*** = this.ma***REMOVED***;
        let timestamps = super.getDataTimestamps();
        if (!timestamps.includes(min) || !timestamps.length) {
            timestamps.splice(0, 0, min);
        }
        if (!timestamps.includes(ma***REMOVED***) || timestamps.length === 1) {
            timestamps.push(ma***REMOVED***);
        }
        return timestamps.sort((a, b)=>a - b);
    }
 _getTimestampsForTable() {
        let timestamps = this._cache.all || [];
        if (timestamps.length) {
            return timestamps;
        }
        const data = this.getDataTimestamps();
        const label = this.getLabelTimestamps();
        if (data.length && label.length) {
            timestamps = this.normalize(data.concat(label));
        } else {
            timestamps = data.length ? data : label;
        }
        timestamps = this._cache.all = timestamps;
        return timestamps;
    }
 getDecimalForValue(value) {
        return (interpolate(this._table, value) - this._minPos) / this._tableRange;
    }
 getValueForPi***REMOVED***el(pi***REMOVED***el) {
        const offsets = this._offsets;
        const decimal = this.getDecimalForPi***REMOVED***el(pi***REMOVED***el) / offsets.factor - offsets.end;
        return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
    }
}

var scales = /*#__PURE__*/Object.freeze({
__proto__: null,
CategoryScale: CategoryScale,
LinearScale: LinearScale,
LogarithmicScale: LogarithmicScale,
RadialLinearScale: RadialLinearScale,
TimeScale: TimeScale,
TimeSeriesScale: TimeSeriesScale
});

const registerables = [
    controllers,
    elements,
    plugins,
    scales
];

e***REMOVED***ports.Ticks = helpers_segment.Ticks;
e***REMOVED***ports.defaults = helpers_segment.defaults;
e***REMOVED***ports.Animation = Animation;
e***REMOVED***ports.Animations = Animations;
e***REMOVED***ports.ArcElement = ArcElement;
e***REMOVED***ports.BarController = BarController;
e***REMOVED***ports.BarElement = BarElement;
e***REMOVED***ports.BasePlatform = BasePlatform;
e***REMOVED***ports.BasicPlatform = BasicPlatform;
e***REMOVED***ports.BubbleController = BubbleController;
e***REMOVED***ports.CategoryScale = CategoryScale;
e***REMOVED***ports.Chart = Chart;
e***REMOVED***ports.Colors = plugin_colors;
e***REMOVED***ports.DatasetController = DatasetController;
e***REMOVED***ports.Decimation = plugin_decimation;
e***REMOVED***ports.DomPlatform = DomPlatform;
e***REMOVED***ports.DoughnutController = DoughnutController;
e***REMOVED***ports.Element = Element;
e***REMOVED***ports.Filler = inde***REMOVED***;
e***REMOVED***ports.Interaction = Interaction;
e***REMOVED***ports.Legend = plugin_legend;
e***REMOVED***ports.LineController = LineController;
e***REMOVED***ports.LineElement = LineElement;
e***REMOVED***ports.LinearScale = LinearScale;
e***REMOVED***ports.LogarithmicScale = LogarithmicScale;
e***REMOVED***ports.PieController = PieController;
e***REMOVED***ports.PointElement = PointElement;
e***REMOVED***ports.PolarAreaController = PolarAreaController;
e***REMOVED***ports.RadarController = RadarController;
e***REMOVED***ports.RadialLinearScale = RadialLinearScale;
e***REMOVED***ports.Scale = Scale;
e***REMOVED***ports.ScatterController = ScatterController;
e***REMOVED***ports.SubTitle = plugin_subtitle;
e***REMOVED***ports.TimeScale = TimeScale;
e***REMOVED***ports.TimeSeriesScale = TimeSeriesScale;
e***REMOVED***ports.Title = plugin_title;
e***REMOVED***ports.Tooltip = plugin_tooltip;
e***REMOVED***ports._adapters = adapters;
e***REMOVED***ports._detectPlatform = _detectPlatform;
e***REMOVED***ports.animator = animator;
e***REMOVED***ports.controllers = controllers;
e***REMOVED***ports.elements = elements;
e***REMOVED***ports.layouts = layouts;
e***REMOVED***ports.plugins = plugins;
e***REMOVED***ports.registerables = registerables;
e***REMOVED***ports.registry = registry;
e***REMOVED***ports.scales = scales;
//# sourceMappingURL=chart.cjs.map
