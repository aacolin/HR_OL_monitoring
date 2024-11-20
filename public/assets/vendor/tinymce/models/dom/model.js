/**
 * TinyMCE version 7.2.1 (2024-07-03)
 */

(function () {
    'use strict';

    var global$1 = tinymce.util.Tools.resolve('tinymce.ModelManager');

    const hasProto = (v, constructor, predicate) => {
      var _a;
      if (predicate(v, constructor.prototype)) {
        return true;
      } else {
        return ((_a = v.constructor) === null || _a === void 0 ? void 0 : _a.name) === constructor.name;
      }
    };
    const typeOf = ***REMOVED*** => {
      const t = typeof ***REMOVED***;
      if (***REMOVED*** === null) {
        return 'null';
      } else if (t === 'object' && Array.isArray(***REMOVED***)) {
        return 'array';
      } else if (t === 'object' && hasProto(***REMOVED***, String, (o, proto) => proto.isPrototypeOf(o))) {
        return 'string';
      } else {
        return t;
      }
    };
    const isType$1 = type => value => typeOf(value) === type;
    const isSimpleType = type => value => typeof value === type;
    const eq$2 = t => a => t === a;
    const isString = isType$1('string');
    const isObject = isType$1('object');
    const isArray = isType$1('array');
    const isNull = eq$2(null);
    const isBoolean = isSimpleType('boolean');
    const isUndefined = eq$2(undefined);
    const isNullable = a => a === null || a === undefined;
    const isNonNullable = a => !isNullable(a);
    const isFunction = isSimpleType('function');
    const isNumber = isSimpleType('number');

    const noop = () => {
    };
    const compose = (fa, fb) => {
      return (...args) => {
        return fa(fb.apply(null, args));
      };
    };
    const compose1 = (fbc, fab) => a => fbc(fab(a));
    const constant = value => {
      return () => {
        return value;
      };
    };
    const identity = ***REMOVED*** => {
      return ***REMOVED***;
    };
    const tripleEquals = (a, b) => {
      return a === b;
    };
    function curry(fn, ...initialArgs) {
      return (...restArgs) => {
        const all = initialArgs.concat(restArgs);
        return fn.apply(null, all);
      };
    }
    const not = f => t => !f(t);
    const die = msg => {
      return () => {
        throw new Error(msg);
      };
    };
    const apply = f => {
      return f();
    };
    const never = constant(false);
    const always = constant(true);

    class Optional {
      constructor(tag, value) {
        this.tag = tag;
        this.value = value;
      }
      static some(value) {
        return new Optional(true, value);
      }
      static none() {
        return Optional.singletonNone;
      }
      fold(onNone, onSome) {
        if (this.tag) {
          return onSome(this.value);
        } else {
          return onNone();
        }
      }
      isSome() {
        return this.tag;
      }
      isNone() {
        return !this.tag;
      }
      map(mapper) {
        if (this.tag) {
          return Optional.some(mapper(this.value));
        } else {
          return Optional.none();
        }
      }
      bind(binder) {
        if (this.tag) {
          return binder(this.value);
        } else {
          return Optional.none();
        }
      }
      e***REMOVED***ists(predicate) {
        return this.tag && predicate(this.value);
      }
      forall(predicate) {
        return !this.tag || predicate(this.value);
      }
      filter(predicate) {
        if (!this.tag || predicate(this.value)) {
          return this;
        } else {
          return Optional.none();
        }
      }
      getOr(replacement) {
        return this.tag ? this.value : replacement;
      }
      or(replacement) {
        return this.tag ? this : replacement;
      }
      getOrThunk(thunk) {
        return this.tag ? this.value : thunk();
      }
      orThunk(thunk) {
        return this.tag ? this : thunk();
      }
      getOrDie(message) {
        if (!this.tag) {
          throw new Error(message !== null && message !== void 0 ? message : 'Called getOrDie on None');
        } else {
          return this.value;
        }
      }
      static from(value) {
        return isNonNullable(value) ? Optional.some(value) : Optional.none();
      }
      getOrNull() {
        return this.tag ? this.value : null;
      }
      getOrUndefined() {
        return this.value;
      }
      each(worker) {
        if (this.tag) {
          worker(this.value);
        }
      }
      toArray() {
        return this.tag ? [this.value] : [];
      }
      toString() {
        return this.tag ? `some(${ this.value })` : 'none()';
      }
    }
    Optional.singletonNone = new Optional(false);

    const nativeSlice = Array.prototype.slice;
    const nativeInde***REMOVED***Of = Array.prototype.inde***REMOVED***Of;
    const nativePush = Array.prototype.push;
    const rawInde***REMOVED***Of = (ts, t) => nativeInde***REMOVED***Of.call(ts, t);
    const contains$2 = (***REMOVED***s, ***REMOVED***) => rawInde***REMOVED***Of(***REMOVED***s, ***REMOVED***) > -1;
    const e***REMOVED***ists = (***REMOVED***s, pred) => {
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        if (pred(***REMOVED***, i)) {
          return true;
        }
      }
      return false;
    };
    const range$1 = (num, f) => {
      const r = [];
      for (let i = 0; i < num; i++) {
        r.push(f(i));
      }
      return r;
    };
    const map$1 = (***REMOVED***s, f) => {
      const len = ***REMOVED***s.length;
      const r = new Array(len);
      for (let i = 0; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        r[i] = f(***REMOVED***, i);
      }
      return r;
    };
    const each$2 = (***REMOVED***s, f) => {
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        f(***REMOVED***, i);
      }
    };
    const eachr = (***REMOVED***s, f) => {
      for (let i = ***REMOVED***s.length - 1; i >= 0; i--) {
        const ***REMOVED*** = ***REMOVED***s[i];
        f(***REMOVED***, i);
      }
    };
    const partition = (***REMOVED***s, pred) => {
      const pass = [];
      const fail = [];
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        const arr = pred(***REMOVED***, i) ? pass : fail;
        arr.push(***REMOVED***);
      }
      return {
        pass,
        fail
      };
    };
    const filter$2 = (***REMOVED***s, pred) => {
      const r = [];
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        if (pred(***REMOVED***, i)) {
          r.push(***REMOVED***);
        }
      }
      return r;
    };
    const foldr = (***REMOVED***s, f, acc) => {
      eachr(***REMOVED***s, (***REMOVED***, i) => {
        acc = f(acc, ***REMOVED***, i);
      });
      return acc;
    };
    const foldl = (***REMOVED***s, f, acc) => {
      each$2(***REMOVED***s, (***REMOVED***, i) => {
        acc = f(acc, ***REMOVED***, i);
      });
      return acc;
    };
    const findUntil = (***REMOVED***s, pred, until) => {
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        if (pred(***REMOVED***, i)) {
          return Optional.some(***REMOVED***);
        } else if (until(***REMOVED***, i)) {
          break;
        }
      }
      return Optional.none();
    };
    const find$1 = (***REMOVED***s, pred) => {
      return findUntil(***REMOVED***s, pred, never);
    };
    const findInde***REMOVED*** = (***REMOVED***s, pred) => {
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        if (pred(***REMOVED***, i)) {
          return Optional.some(i);
        }
      }
      return Optional.none();
    };
    const flatten = ***REMOVED***s => {
      const r = [];
      for (let i = 0, len = ***REMOVED***s.length; i < len; ++i) {
        if (!isArray(***REMOVED***s[i])) {
          throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + ***REMOVED***s);
        }
        nativePush.apply(r, ***REMOVED***s[i]);
      }
      return r;
    };
    const bind$2 = (***REMOVED***s, f) => flatten(map$1(***REMOVED***s, f));
    const forall = (***REMOVED***s, pred) => {
      for (let i = 0, len = ***REMOVED***s.length; i < len; ++i) {
        const ***REMOVED*** = ***REMOVED***s[i];
        if (pred(***REMOVED***, i) !== true) {
          return false;
        }
      }
      return true;
    };
    const reverse = ***REMOVED***s => {
      const r = nativeSlice.call(***REMOVED***s, 0);
      r.reverse();
      return r;
    };
    const mapToObject = (***REMOVED***s, f) => {
      const r = {};
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        r[String(***REMOVED***)] = f(***REMOVED***, i);
      }
      return r;
    };
    const sort$1 = (***REMOVED***s, comparator) => {
      const copy = nativeSlice.call(***REMOVED***s, 0);
      copy.sort(comparator);
      return copy;
    };
    const get$d = (***REMOVED***s, i) => i >= 0 && i < ***REMOVED***s.length ? Optional.some(***REMOVED***s[i]) : Optional.none();
    const head = ***REMOVED***s => get$d(***REMOVED***s, 0);
    const last$2 = ***REMOVED***s => get$d(***REMOVED***s, ***REMOVED***s.length - 1);
    const findMap = (arr, f) => {
      for (let i = 0; i < arr.length; i++) {
        const r = f(arr[i], i);
        if (r.isSome()) {
          return r;
        }
      }
      return Optional.none();
    };

    const keys = Object.keys;
    const hasOwnProperty = Object.hasOwnProperty;
    const each$1 = (obj, f) => {
      const props = keys(obj);
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k];
        const ***REMOVED*** = obj[i];
        f(***REMOVED***, i);
      }
    };
    const map = (obj, f) => {
      return tupleMap(obj, (***REMOVED***, i) => ({
        k: i,
        v: f(***REMOVED***, i)
      }));
    };
    const tupleMap = (obj, f) => {
      const r = {};
      each$1(obj, (***REMOVED***, i) => {
        const tuple = f(***REMOVED***, i);
        r[tuple.k] = tuple.v;
      });
      return r;
    };
    const objAcc = r => (***REMOVED***, i) => {
      r[i] = ***REMOVED***;
    };
    const internalFilter = (obj, pred, onTrue, onFalse) => {
      each$1(obj, (***REMOVED***, i) => {
        (pred(***REMOVED***, i) ? onTrue : onFalse)(***REMOVED***, i);
      });
    };
    const filter$1 = (obj, pred) => {
      const t = {};
      internalFilter(obj, pred, objAcc(t), noop);
      return t;
    };
    const mapToArray = (obj, f) => {
      const r = [];
      each$1(obj, (value, name) => {
        r.push(f(value, name));
      });
      return r;
    };
    const values = obj => {
      return mapToArray(obj, identity);
    };
    const get$c = (obj, key) => {
      return has$1(obj, key) ? Optional.from(obj[key]) : Optional.none();
    };
    const has$1 = (obj, key) => hasOwnProperty.call(obj, key);
    const hasNonNullableKey = (obj, key) => has$1(obj, key) && obj[key] !== undefined && obj[key] !== null;
    const isEmpty = r => {
      for (const ***REMOVED*** in r) {
        if (hasOwnProperty.call(r, ***REMOVED***)) {
          return false;
        }
      }
      return true;
    };

    const Global = typeof window !== 'undefined' ? window : Function('return this;')();

    const path = (parts, scope) => {
      let o = scope !== undefined && scope !== null ? scope : Global;
      for (let i = 0; i < parts.length && o !== undefined && o !== null; ++i) {
        o = o[parts[i]];
      }
      return o;
    };
    const resolve$2 = (p, scope) => {
      const parts = p.split('.');
      return path(parts, scope);
    };

    const unsafe = (name, scope) => {
      return resolve$2(name, scope);
    };
    const getOrDie = (name, scope) => {
      const actual = unsafe(name, scope);
      if (actual === undefined || actual === null) {
        throw new Error(name + ' not available on this browser');
      }
      return actual;
    };

    const getPrototypeOf = Object.getPrototypeOf;
    const sandHTMLElement = scope => {
      return getOrDie('HTMLElement', scope);
    };
    const isPrototypeOf = ***REMOVED*** => {
      const scope = resolve$2('ownerDocument.defaultView', ***REMOVED***);
      return isObject(***REMOVED***) && (sandHTMLElement(scope).prototype.isPrototypeOf(***REMOVED***) || /^HTML\w*Element$/.test(getPrototypeOf(***REMOVED***).constructor.name));
    };

    const COMMENT = 8;
    const DOCUMENT = 9;
    const DOCUMENT_FRAGMENT = 11;
    const ELEMENT = 1;
    const TEXT = 3;

    const name = element => {
      const r = element.dom.nodeName;
      return r.toLowerCase();
    };
    const type = element => element.dom.nodeType;
    const isType = t => element => type(element) === t;
    const isComment = element => type(element) === COMMENT || name(element) === '#comment';
    const isHTMLElement = element => isElement(element) && isPrototypeOf(element.dom);
    const isElement = isType(ELEMENT);
    const isTe***REMOVED***t = isType(TEXT);
    const isDocument = isType(DOCUMENT);
    const isDocumentFragment = isType(DOCUMENT_FRAGMENT);
    const isTag = tag => e => isElement(e) && name(e) === tag;

    const rawSet = (dom, key, value) => {
      if (isString(value) || isBoolean(value) || isNumber(value)) {
        dom.setAttribute(key, value + '');
      } else {
        console.error('Invalid call to Attribute.set. Key ', key, ':: Value ', value, ':: Element ', dom);
        throw new Error('Attribute value was not simple');
      }
    };
    const set$2 = (element, key, value) => {
      rawSet(element.dom, key, value);
    };
    const setAll$1 = (element, attrs) => {
      const dom = element.dom;
      each$1(attrs, (v, k) => {
        rawSet(dom, k, v);
      });
    };
    const setOptions = (element, attrs) => {
      each$1(attrs, (v, k) => {
        v.fold(() => {
          remove$7(element, k);
        }, value => {
          rawSet(element.dom, k, value);
        });
      });
    };
    const get$b = (element, key) => {
      const v = element.dom.getAttribute(key);
      return v === null ? undefined : v;
    };
    const getOpt = (element, key) => Optional.from(get$b(element, key));
    const remove$7 = (element, key) => {
      element.dom.removeAttribute(key);
    };
    const clone$2 = element => foldl(element.dom.attributes, (acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {});

    const fromHtml$1 = (html, scope) => {
      const doc = scope || document;
      const div = doc.createElement('div');
      div.innerHTML = html;
      if (!div.hasChildNodes() || div.childNodes.length > 1) {
        const message = 'HTML does not have a single root node';
        console.error(message, html);
        throw new Error(message);
      }
      return fromDom$1(div.childNodes[0]);
    };
    const fromTag = (tag, scope) => {
      const doc = scope || document;
      const node = doc.createElement(tag);
      return fromDom$1(node);
    };
    const fromTe***REMOVED***t = (te***REMOVED***t, scope) => {
      const doc = scope || document;
      const node = doc.createTe***REMOVED***tNode(te***REMOVED***t);
      return fromDom$1(node);
    };
    const fromDom$1 = node => {
      if (node === null || node === undefined) {
        throw new Error('Node cannot be null or undefined');
      }
      return { dom: node };
    };
    const fromPoint$1 = (docElm, ***REMOVED***, y) => Optional.from(docElm.dom.elementFromPoint(***REMOVED***, y)).map(fromDom$1);
    const SugarElement = {
      fromHtml: fromHtml$1,
      fromTag,
      fromTe***REMOVED***t,
      fromDom: fromDom$1,
      fromPoint: fromPoint$1
    };

    const is$2 = (element, selector) => {
      const dom = element.dom;
      if (dom.nodeType !== ELEMENT) {
        return false;
      } else {
        const elem = dom;
        if (elem.matches !== undefined) {
          return elem.matches(selector);
        } else if (elem.msMatchesSelector !== undefined) {
          return elem.msMatchesSelector(selector);
        } else if (elem.webkitMatchesSelector !== undefined) {
          return elem.webkitMatchesSelector(selector);
        } else if (elem.mozMatchesSelector !== undefined) {
          return elem.mozMatchesSelector(selector);
        } else {
          throw new Error('Browser lacks native selectors');
        }
      }
    };
    const bypassSelector = dom => dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT && dom.nodeType !== DOCUMENT_FRAGMENT || dom.childElementCount === 0;
    const all$1 = (selector, scope) => {
      const base = scope === undefined ? document : scope.dom;
      return bypassSelector(base) ? [] : map$1(base.querySelectorAll(selector), SugarElement.fromDom);
    };
    const one = (selector, scope) => {
      const base = scope === undefined ? document : scope.dom;
      return bypassSelector(base) ? Optional.none() : Optional.from(base.querySelector(selector)).map(SugarElement.fromDom);
    };

    const eq$1 = (e1, e2) => e1.dom === e2.dom;
    const contains$1 = (e1, e2) => {
      const d1 = e1.dom;
      const d2 = e2.dom;
      return d1 === d2 ? false : d1.contains(d2);
    };
    const is$1 = is$2;

    const owner = element => SugarElement.fromDom(element.dom.ownerDocument);
    const documentOrOwner = dos => isDocument(dos) ? dos : owner(dos);
    const documentElement = element => SugarElement.fromDom(documentOrOwner(element).dom.documentElement);
    const defaultView = element => SugarElement.fromDom(documentOrOwner(element).dom.defaultView);
    const parent = element => Optional.from(element.dom.parentNode).map(SugarElement.fromDom);
    const parentElement = element => Optional.from(element.dom.parentElement).map(SugarElement.fromDom);
    const parents = (element, isRoot) => {
      const stop = isFunction(isRoot) ? isRoot : never;
      let dom = element.dom;
      const ret = [];
      while (dom.parentNode !== null && dom.parentNode !== undefined) {
        const rawParent = dom.parentNode;
        const p = SugarElement.fromDom(rawParent);
        ret.push(p);
        if (stop(p) === true) {
          break;
        } else {
          dom = rawParent;
        }
      }
      return ret;
    };
    const prevSibling = element => Optional.from(element.dom.previousSibling).map(SugarElement.fromDom);
    const ne***REMOVED***tSibling = element => Optional.from(element.dom.ne***REMOVED***tSibling).map(SugarElement.fromDom);
    const children$2 = element => map$1(element.dom.childNodes, SugarElement.fromDom);
    const child$2 = (element, inde***REMOVED***) => {
      const cs = element.dom.childNodes;
      return Optional.from(cs[inde***REMOVED***]).map(SugarElement.fromDom);
    };
    const firstChild = element => child$2(element, 0);

    const before$3 = (marker, element) => {
      const parent$1 = parent(marker);
      parent$1.each(v => {
        v.dom.insertBefore(element.dom, marker.dom);
      });
    };
    const after$5 = (marker, element) => {
      const sibling = ne***REMOVED***tSibling(marker);
      sibling.fold(() => {
        const parent$1 = parent(marker);
        parent$1.each(v => {
          append$1(v, element);
        });
      }, v => {
        before$3(v, element);
      });
    };
    const prepend = (parent, element) => {
      const firstChild$1 = firstChild(parent);
      firstChild$1.fold(() => {
        append$1(parent, element);
      }, v => {
        parent.dom.insertBefore(element.dom, v.dom);
      });
    };
    const append$1 = (parent, element) => {
      parent.dom.appendChild(element.dom);
    };
    const appendAt = (parent, element, inde***REMOVED***) => {
      child$2(parent, inde***REMOVED***).fold(() => {
        append$1(parent, element);
      }, v => {
        before$3(v, element);
      });
    };
    const wrap = (element, wrapper) => {
      before$3(element, wrapper);
      append$1(wrapper, element);
    };

    const after$4 = (marker, elements) => {
      each$2(elements, (***REMOVED***, i) => {
        const e = i === 0 ? marker : elements[i - 1];
        after$5(e, ***REMOVED***);
      });
    };
    const append = (parent, elements) => {
      each$2(elements, ***REMOVED*** => {
        append$1(parent, ***REMOVED***);
      });
    };

    const empty = element => {
      element.dom.te***REMOVED***tContent = '';
      each$2(children$2(element), rogue => {
        remove$6(rogue);
      });
    };
    const remove$6 = element => {
      const dom = element.dom;
      if (dom.parentNode !== null) {
        dom.parentNode.removeChild(dom);
      }
    };
    const unwrap = wrapper => {
      const children = children$2(wrapper);
      if (children.length > 0) {
        after$4(wrapper, children);
      }
      remove$6(wrapper);
    };

    const clone$1 = (original, isDeep) => SugarElement.fromDom(original.dom.cloneNode(isDeep));
    const shallow = original => clone$1(original, false);
    const deep = original => clone$1(original, true);
    const shallowAs = (original, tag) => {
      const nu = SugarElement.fromTag(tag);
      const attributes = clone$2(original);
      setAll$1(nu, attributes);
      return nu;
    };
    const copy$2 = (original, tag) => {
      const nu = shallowAs(original, tag);
      const cloneChildren = children$2(deep(original));
      append(nu, cloneChildren);
      return nu;
    };
    const mutate$1 = (original, tag) => {
      const nu = shallowAs(original, tag);
      after$5(original, nu);
      const children = children$2(original);
      append(nu, children);
      remove$6(original);
      return nu;
    };

    const validSectionList = [
      'tfoot',
      'thead',
      'tbody',
      'colgroup'
    ];
    const isValidSection = parentName => contains$2(validSectionList, parentName);
    const grid = (rows, columns) => ({
      rows,
      columns
    });
    const address = (row, column) => ({
      row,
      column
    });
    const detail = (element, rowspan, colspan) => ({
      element,
      rowspan,
      colspan
    });
    const detailnew = (element, rowspan, colspan, isNew) => ({
      element,
      rowspan,
      colspan,
      isNew
    });
    const e***REMOVED***tended = (element, rowspan, colspan, row, column, isLocked) => ({
      element,
      rowspan,
      colspan,
      row,
      column,
      isLocked
    });
    const rowdetail = (element, cells, section) => ({
      element,
      cells,
      section
    });
    const rowdetailnew = (element, cells, section, isNew) => ({
      element,
      cells,
      section,
      isNew
    });
    const elementnew = (element, isNew, isLocked) => ({
      element,
      isNew,
      isLocked
    });
    const rowcells = (element, cells, section, isNew) => ({
      element,
      cells,
      section,
      isNew
    });
    const bounds = (startRow, startCol, finishRow, finishCol) => ({
      startRow,
      startCol,
      finishRow,
      finishCol
    });
    const columne***REMOVED***t = (element, colspan, column) => ({
      element,
      colspan,
      column
    });
    const colgroup = (element, columns) => ({
      element,
      columns
    });

    const isShadowRoot = dos => isDocumentFragment(dos) && isNonNullable(dos.dom.host);
    const supported = isFunction(Element.prototype.attachShadow) && isFunction(Node.prototype.getRootNode);
    const isSupported$1 = constant(supported);
    const getRootNode = supported ? e => SugarElement.fromDom(e.dom.getRootNode()) : documentOrOwner;
    const getShadowRoot = e => {
      const r = getRootNode(e);
      return isShadowRoot(r) ? Optional.some(r) : Optional.none();
    };
    const getShadowHost = e => SugarElement.fromDom(e.dom.host);
    const getOriginalEventTarget = event => {
      if (isSupported$1() && isNonNullable(event.target)) {
        const el = SugarElement.fromDom(event.target);
        if (isElement(el) && isOpenShadowHost(el)) {
          if (event.composed && event.composedPath) {
            const composedPath = event.composedPath();
            if (composedPath) {
              return head(composedPath);
            }
          }
        }
      }
      return Optional.from(event.target);
    };
    const isOpenShadowHost = element => isNonNullable(element.dom.shadowRoot);

    const inBody = element => {
      const dom = isTe***REMOVED***t(element) ? element.dom.parentNode : element.dom;
      if (dom === undefined || dom === null || dom.ownerDocument === null) {
        return false;
      }
      const doc = dom.ownerDocument;
      return getShadowRoot(SugarElement.fromDom(dom)).fold(() => doc.body.contains(dom), compose1(inBody, getShadowHost));
    };
    const body$1 = () => getBody$1(SugarElement.fromDom(document));
    const getBody$1 = doc => {
      const b = doc.dom.body;
      if (b === null || b === undefined) {
        throw new Error('Body is not available yet');
      }
      return SugarElement.fromDom(b);
    };

    const ancestors$4 = (scope, predicate, isRoot) => filter$2(parents(scope, isRoot), predicate);
    const children$1 = (scope, predicate) => filter$2(children$2(scope), predicate);
    const descendants$1 = (scope, predicate) => {
      let result = [];
      each$2(children$2(scope), ***REMOVED*** => {
        if (predicate(***REMOVED***)) {
          result = result.concat([***REMOVED***]);
        }
        result = result.concat(descendants$1(***REMOVED***, predicate));
      });
      return result;
    };

    const ancestors$3 = (scope, selector, isRoot) => ancestors$4(scope, e => is$2(e, selector), isRoot);
    const children = (scope, selector) => children$1(scope, e => is$2(e, selector));
    const descendants = (scope, selector) => all$1(selector, scope);

    var ClosestOrAncestor = (is, ancestor, scope, a, isRoot) => {
      if (is(scope, a)) {
        return Optional.some(scope);
      } else if (isFunction(isRoot) && isRoot(scope)) {
        return Optional.none();
      } else {
        return ancestor(scope, a, isRoot);
      }
    };

    const ancestor$2 = (scope, predicate, isRoot) => {
      let element = scope.dom;
      const stop = isFunction(isRoot) ? isRoot : never;
      while (element.parentNode) {
        element = element.parentNode;
        const el = SugarElement.fromDom(element);
        if (predicate(el)) {
          return Optional.some(el);
        } else if (stop(el)) {
          break;
        }
      }
      return Optional.none();
    };
    const closest$2 = (scope, predicate, isRoot) => {
      const is = (s, test) => test(s);
      return ClosestOrAncestor(is, ancestor$2, scope, predicate, isRoot);
    };
    const child$1 = (scope, predicate) => {
      const pred = node => predicate(SugarElement.fromDom(node));
      const result = find$1(scope.dom.childNodes, pred);
      return result.map(SugarElement.fromDom);
    };
    const descendant$1 = (scope, predicate) => {
      const descend = node => {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = SugarElement.fromDom(node.childNodes[i]);
          if (predicate(child)) {
            return Optional.some(child);
          }
          const res = descend(node.childNodes[i]);
          if (res.isSome()) {
            return res;
          }
        }
        return Optional.none();
      };
      return descend(scope.dom);
    };

    const ancestor$1 = (scope, selector, isRoot) => ancestor$2(scope, e => is$2(e, selector), isRoot);
    const child = (scope, selector) => child$1(scope, e => is$2(e, selector));
    const descendant = (scope, selector) => one(selector, scope);
    const closest$1 = (scope, selector, isRoot) => {
      const is = (element, selector) => is$2(element, selector);
      return ClosestOrAncestor(is, ancestor$1, scope, selector, isRoot);
    };

    const is = (lhs, rhs, comparator = tripleEquals) => lhs.e***REMOVED***ists(left => comparator(left, rhs));
    const cat = arr => {
      const r = [];
      const push = ***REMOVED*** => {
        r.push(***REMOVED***);
      };
      for (let i = 0; i < arr.length; i++) {
        arr[i].each(push);
      }
      return r;
    };
    const bindFrom = (a, f) => a !== undefined && a !== null ? f(a) : Optional.none();
    const someIf = (b, a) => b ? Optional.some(a) : Optional.none();

    const removeFromStart = (str, numChars) => {
      return str.substring(numChars);
    };

    const checkRange = (str, substr, start) => substr === '' || str.length >= substr.length && str.substr(start, start + substr.length) === substr;
    const removeLeading = (str, prefi***REMOVED***) => {
      return startsWith(str, prefi***REMOVED***) ? removeFromStart(str, prefi***REMOVED***.length) : str;
    };
    const contains = (str, substr, start = 0, end) => {
      const id***REMOVED*** = str.inde***REMOVED***Of(substr, start);
      if (id***REMOVED*** !== -1) {
        return isUndefined(end) ? true : id***REMOVED*** + substr.length <= end;
      } else {
        return false;
      }
    };
    const startsWith = (str, prefi***REMOVED***) => {
      return checkRange(str, prefi***REMOVED***, 0);
    };
    const endsWith = (str, suffi***REMOVED***) => {
      return checkRange(str, suffi***REMOVED***, str.length - suffi***REMOVED***.length);
    };
    const blank = r => s => s.replace(r, '');
    const trim = blank(/^\s+|\s+$/g);
    const isNotEmpty = s => s.length > 0;
    const toFloat = value => {
      const num = parseFloat(value);
      return isNaN(num) ? Optional.none() : Optional.some(num);
    };

    const isSupported = dom => dom.style !== undefined && isFunction(dom.style.getPropertyValue);

    const internalSet = (dom, property, value) => {
      if (!isString(value)) {
        console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
        throw new Error('CSS value must be a string: ' + value);
      }
      if (isSupported(dom)) {
        dom.style.setProperty(property, value);
      }
    };
    const internalRemove = (dom, property) => {
      if (isSupported(dom)) {
        dom.style.removeProperty(property);
      }
    };
    const set$1 = (element, property, value) => {
      const dom = element.dom;
      internalSet(dom, property, value);
    };
    const setAll = (element, css) => {
      const dom = element.dom;
      each$1(css, (v, k) => {
        internalSet(dom, k, v);
      });
    };
    const get$a = (element, property) => {
      const dom = element.dom;
      const styles = window.getComputedStyle(dom);
      const r = styles.getPropertyValue(property);
      return r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
    };
    const getUnsafeProperty = (dom, property) => isSupported(dom) ? dom.style.getPropertyValue(property) : '';
    const getRaw$2 = (element, property) => {
      const dom = element.dom;
      const raw = getUnsafeProperty(dom, property);
      return Optional.from(raw).filter(r => r.length > 0);
    };
    const remove$5 = (element, property) => {
      const dom = element.dom;
      internalRemove(dom, property);
      if (is(getOpt(element, 'style').map(trim), '')) {
        remove$7(element, 'style');
      }
    };
    const copy$1 = (source, target) => {
      const sourceDom = source.dom;
      const targetDom = target.dom;
      if (isSupported(sourceDom) && isSupported(targetDom)) {
        targetDom.style.cssTe***REMOVED***t = sourceDom.style.cssTe***REMOVED***t;
      }
    };

    const getAttrValue = (cell, name, fallback = 0) => getOpt(cell, name).map(value => parseInt(value, 10)).getOr(fallback);
    const getSpan = (cell, type) => getAttrValue(cell, type, 1);
    const hasColspan = cellOrCol => {
      if (isTag('col')(cellOrCol)) {
        return getAttrValue(cellOrCol, 'span', 1) > 1;
      } else {
        return getSpan(cellOrCol, 'colspan') > 1;
      }
    };
    const hasRowspan = cell => getSpan(cell, 'rowspan') > 1;
    const getCssValue = (element, property) => parseInt(get$a(element, property), 10);
    const minWidth = constant(10);
    const minHeight = constant(10);

    const firstLayer = (scope, selector) => {
      return filterFirstLayer(scope, selector, always);
    };
    const filterFirstLayer = (scope, selector, predicate) => {
      return bind$2(children$2(scope), ***REMOVED*** => {
        if (is$2(***REMOVED***, selector)) {
          return predicate(***REMOVED***) ? [***REMOVED***] : [];
        } else {
          return filterFirstLayer(***REMOVED***, selector, predicate);
        }
      });
    };

    const lookup = (tags, element, isRoot = never) => {
      if (isRoot(element)) {
        return Optional.none();
      }
      if (contains$2(tags, name(element))) {
        return Optional.some(element);
      }
      const isRootOrUpperTable = elm => is$2(elm, 'table') || isRoot(elm);
      return ancestor$1(element, tags.join(','), isRootOrUpperTable);
    };
    const cell = (element, isRoot) => lookup([
      'td',
      'th'
    ], element, isRoot);
    const cells$1 = ancestor => firstLayer(ancestor, 'th,td');
    const columns$1 = ancestor => {
      if (is$2(ancestor, 'colgroup')) {
        return children(ancestor, 'col');
      } else {
        return bind$2(columnGroups(ancestor), columnGroup => children(columnGroup, 'col'));
      }
    };
    const table = (element, isRoot) => closest$1(element, 'table', isRoot);
    const rows$1 = ancestor => firstLayer(ancestor, 'tr');
    const columnGroups = ancestor => table(ancestor).fold(constant([]), table => children(table, 'colgroup'));

    const fromRowsOrColGroups = (elems, getSection) => map$1(elems, row => {
      if (name(row) === 'colgroup') {
        const cells = map$1(columns$1(row), column => {
          const colspan = getAttrValue(column, 'span', 1);
          return detail(column, 1, colspan);
        });
        return rowdetail(row, cells, 'colgroup');
      } else {
        const cells = map$1(cells$1(row), cell => {
          const rowspan = getAttrValue(cell, 'rowspan', 1);
          const colspan = getAttrValue(cell, 'colspan', 1);
          return detail(cell, rowspan, colspan);
        });
        return rowdetail(row, cells, getSection(row));
      }
    });
    const getParentSection = group => parent(group).map(parent => {
      const parentName = name(parent);
      return isValidSection(parentName) ? parentName : 'tbody';
    }).getOr('tbody');
    const fromTable$1 = table => {
      const rows = rows$1(table);
      const columnGroups$1 = columnGroups(table);
      const elems = [
        ...columnGroups$1,
        ...rows
      ];
      return fromRowsOrColGroups(elems, getParentSection);
    };
    const fromPastedRows = (elems, section) => fromRowsOrColGroups(elems, () => section);

    const cached = f => {
      let called = false;
      let r;
      return (...args) => {
        if (!called) {
          called = true;
          r = f.apply(null, args);
        }
        return r;
      };
    };

    const DeviceType = (os, browser, userAgent, mediaMatch) => {
      const isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
      const isiPhone = os.isiOS() && !isiPad;
      const isMobile = os.isiOS() || os.isAndroid();
      const isTouch = isMobile || mediaMatch('(pointer:coarse)');
      const isTablet = isiPad || !isiPhone && isMobile && mediaMatch('(min-device-width:768p***REMOVED***)');
      const isPhone = isiPhone || isMobile && !isTablet;
      const iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
      const isDesktop = !isPhone && !isTablet && !iOSwebview;
      return {
        isiPad: constant(isiPad),
        isiPhone: constant(isiPhone),
        isTablet: constant(isTablet),
        isPhone: constant(isPhone),
        isTouch: constant(isTouch),
        isAndroid: os.isAndroid,
        isiOS: os.isiOS,
        isWebView: constant(iOSwebview),
        isDesktop: constant(isDesktop)
      };
    };

    const firstMatch = (rege***REMOVED***es, s) => {
      for (let i = 0; i < rege***REMOVED***es.length; i++) {
        const ***REMOVED*** = rege***REMOVED***es[i];
        if (***REMOVED***.test(s)) {
          return ***REMOVED***;
        }
      }
      return undefined;
    };
    const find = (rege***REMOVED***es, agent) => {
      const r = firstMatch(rege***REMOVED***es, agent);
      if (!r) {
        return {
          major: 0,
          minor: 0
        };
      }
      const group = i => {
        return Number(agent.replace(r, '$' + i));
      };
      return nu$2(group(1), group(2));
    };
    const detect$5 = (versionRege***REMOVED***es, agent) => {
      const cleanedAgent = String(agent).toLowerCase();
      if (versionRege***REMOVED***es.length === 0) {
        return unknown$2();
      }
      return find(versionRege***REMOVED***es, cleanedAgent);
    };
    const unknown$2 = () => {
      return nu$2(0, 0);
    };
    const nu$2 = (major, minor) => {
      return {
        major,
        minor
      };
    };
    const Version = {
      nu: nu$2,
      detect: detect$5,
      unknown: unknown$2
    };

    const detectBrowser$1 = (browsers, userAgentData) => {
      return findMap(userAgentData.brands, uaBrand => {
        const lcBrand = uaBrand.brand.toLowerCase();
        return find$1(browsers, browser => {
          var _a;
          return lcBrand === ((_a = browser.brand) === null || _a === void 0 ? void 0 : _a.toLowerCase());
        }).map(info => ({
          current: info.name,
          version: Version.nu(parseInt(uaBrand.version, 10), 0)
        }));
      });
    };

    const detect$4 = (candidates, userAgent) => {
      const agent = String(userAgent).toLowerCase();
      return find$1(candidates, candidate => {
        return candidate.search(agent);
      });
    };
    const detectBrowser = (browsers, userAgent) => {
      return detect$4(browsers, userAgent).map(browser => {
        const version = Version.detect(browser.versionRege***REMOVED***es, userAgent);
        return {
          current: browser.name,
          version
        };
      });
    };
    const detectOs = (oses, userAgent) => {
      return detect$4(oses, userAgent).map(os => {
        const version = Version.detect(os.versionRege***REMOVED***es, userAgent);
        return {
          current: os.name,
          version
        };
      });
    };

    const normalVersionRege***REMOVED*** = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
    const checkContains = target => {
      return uastring => {
        return contains(uastring, target);
      };
    };
    const browsers = [
      {
        name: 'Edge',
        versionRege***REMOVED***es: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: uastring => {
          return contains(uastring, 'edge/') && contains(uastring, 'chrome') && contains(uastring, 'safari') && contains(uastring, 'applewebkit');
        }
      },
      {
        name: 'Chromium',
        brand: 'Chromium',
        versionRege***REMOVED***es: [
          /.*?chrome\/([0-9]+)\.([0-9]+).*/,
          normalVersionRege***REMOVED***
        ],
        search: uastring => {
          return contains(uastring, 'chrome') && !contains(uastring, 'chromeframe');
        }
      },
      {
        name: 'IE',
        versionRege***REMOVED***es: [
          /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
          /.*?rv:([0-9]+)\.([0-9]+).*/
        ],
        search: uastring => {
          return contains(uastring, 'msie') || contains(uastring, 'trident');
        }
      },
      {
        name: 'Opera',
        versionRege***REMOVED***es: [
          normalVersionRege***REMOVED***,
          /.*?opera\/([0-9]+)\.([0-9]+).*/
        ],
        search: checkContains('opera')
      },
      {
        name: 'Firefo***REMOVED***',
        versionRege***REMOVED***es: [/.*?firefo***REMOVED***\/\ ?([0-9]+)\.([0-9]+).*/],
        search: checkContains('firefo***REMOVED***')
      },
      {
        name: 'Safari',
        versionRege***REMOVED***es: [
          normalVersionRege***REMOVED***,
          /.*?cpu os ([0-9]+)_([0-9]+).*/
        ],
        search: uastring => {
          return (contains(uastring, 'safari') || contains(uastring, 'mobile/')) && contains(uastring, 'applewebkit');
        }
      }
    ];
    const oses = [
      {
        name: 'Windows',
        search: checkContains('win'),
        versionRege***REMOVED***es: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'iOS',
        search: uastring => {
          return contains(uastring, 'iphone') || contains(uastring, 'ipad');
        },
        versionRege***REMOVED***es: [
          /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
          /.*cpu os ([0-9]+)_([0-9]+).*/,
          /.*cpu iphone os ([0-9]+)_([0-9]+).*/
        ]
      },
      {
        name: 'Android',
        search: checkContains('android'),
        versionRege***REMOVED***es: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'macOS',
        search: checkContains('mac os ***REMOVED***'),
        versionRege***REMOVED***es: [/.*?mac\ os\ ***REMOVED***\ ?([0-9]+)_([0-9]+).*/]
      },
      {
        name: 'Linu***REMOVED***',
        search: checkContains('linu***REMOVED***'),
        versionRege***REMOVED***es: []
      },
      {
        name: 'Solaris',
        search: checkContains('sunos'),
        versionRege***REMOVED***es: []
      },
      {
        name: 'FreeBSD',
        search: checkContains('freebsd'),
        versionRege***REMOVED***es: []
      },
      {
        name: 'ChromeOS',
        search: checkContains('cros'),
        versionRege***REMOVED***es: [/.*?chrome\/([0-9]+)\.([0-9]+).*/]
      }
    ];
    const PlatformInfo = {
      browsers: constant(browsers),
      oses: constant(oses)
    };

    const edge = 'Edge';
    const chromium = 'Chromium';
    const ie = 'IE';
    const opera = 'Opera';
    const firefo***REMOVED*** = 'Firefo***REMOVED***';
    const safari = 'Safari';
    const unknown$1 = () => {
      return nu$1({
        current: undefined,
        version: Version.unknown()
      });
    };
    const nu$1 = info => {
      const current = info.current;
      const version = info.version;
      const isBrowser = name => () => current === name;
      return {
        current,
        version,
        isEdge: isBrowser(edge),
        isChromium: isBrowser(chromium),
        isIE: isBrowser(ie),
        isOpera: isBrowser(opera),
        isFirefo***REMOVED***: isBrowser(firefo***REMOVED***),
        isSafari: isBrowser(safari)
      };
    };
    const Browser = {
      unknown: unknown$1,
      nu: nu$1,
      edge: constant(edge),
      chromium: constant(chromium),
      ie: constant(ie),
      opera: constant(opera),
      firefo***REMOVED***: constant(firefo***REMOVED***),
      safari: constant(safari)
    };

    const windows = 'Windows';
    const ios = 'iOS';
    const android = 'Android';
    const linu***REMOVED*** = 'Linu***REMOVED***';
    const macos = 'macOS';
    const solaris = 'Solaris';
    const freebsd = 'FreeBSD';
    const chromeos = 'ChromeOS';
    const unknown = () => {
      return nu({
        current: undefined,
        version: Version.unknown()
      });
    };
    const nu = info => {
      const current = info.current;
      const version = info.version;
      const isOS = name => () => current === name;
      return {
        current,
        version,
        isWindows: isOS(windows),
        isiOS: isOS(ios),
        isAndroid: isOS(android),
        isMacOS: isOS(macos),
        isLinu***REMOVED***: isOS(linu***REMOVED***),
        isSolaris: isOS(solaris),
        isFreeBSD: isOS(freebsd),
        isChromeOS: isOS(chromeos)
      };
    };
    const OperatingSystem = {
      unknown,
      nu,
      windows: constant(windows),
      ios: constant(ios),
      android: constant(android),
      linu***REMOVED***: constant(linu***REMOVED***),
      macos: constant(macos),
      solaris: constant(solaris),
      freebsd: constant(freebsd),
      chromeos: constant(chromeos)
    };

    const detect$3 = (userAgent, userAgentDataOpt, mediaMatch) => {
      const browsers = PlatformInfo.browsers();
      const oses = PlatformInfo.oses();
      const browser = userAgentDataOpt.bind(userAgentData => detectBrowser$1(browsers, userAgentData)).orThunk(() => detectBrowser(browsers, userAgent)).fold(Browser.unknown, Browser.nu);
      const os = detectOs(oses, userAgent).fold(OperatingSystem.unknown, OperatingSystem.nu);
      const deviceType = DeviceType(os, browser, userAgent, mediaMatch);
      return {
        browser,
        os,
        deviceType
      };
    };
    const PlatformDetection = { detect: detect$3 };

    const mediaMatch = query => window.matchMedia(query).matches;
    let platform = cached(() => PlatformDetection.detect(navigator.userAgent, Optional.from(navigator.userAgentData), mediaMatch));
    const detect$2 = () => platform();

    const Dimension = (name, getOffset) => {
      const set = (element, h) => {
        if (!isNumber(h) && !h.match(/^[0-9]+$/)) {
          throw new Error(name + '.set accepts only positive integer values. Value was ' + h);
        }
        const dom = element.dom;
        if (isSupported(dom)) {
          dom.style[name] = h + 'p***REMOVED***';
        }
      };
      const get = element => {
        const r = getOffset(element);
        if (r <= 0 || r === null) {
          const css = get$a(element, name);
          return parseFloat(css) || 0;
        }
        return r;
      };
      const getOuter = get;
      const aggregate = (element, properties) => foldl(properties, (acc, property) => {
        const val = get$a(element, property);
        const value = val === undefined ? 0 : parseInt(val, 10);
        return isNaN(value) ? acc : acc + value;
      }, 0);
      const ma***REMOVED*** = (element, value, properties) => {
        const cumulativeInclusions = aggregate(element, properties);
        const absoluteMa***REMOVED*** = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
        return absoluteMa***REMOVED***;
      };
      return {
        set,
        get,
        getOuter,
        aggregate,
        ma***REMOVED***
      };
    };

    const toNumber = (p***REMOVED***, fallback) => toFloat(p***REMOVED***).getOr(fallback);
    const getProp = (element, name, fallback) => toNumber(get$a(element, name), fallback);
    const calcContentBo***REMOVED***Size = (element, size, upper, lower) => {
      const paddingUpper = getProp(element, `padding-${ upper }`, 0);
      const paddingLower = getProp(element, `padding-${ lower }`, 0);
      const borderUpper = getProp(element, `border-${ upper }-width`, 0);
      const borderLower = getProp(element, `border-${ lower }-width`, 0);
      return size - paddingUpper - paddingLower - borderUpper - borderLower;
    };
    const getCalculatedWidth = (element, bo***REMOVED***Sizing) => {
      const dom = element.dom;
      const width = dom.getBoundingClientRect().width || dom.offsetWidth;
      return bo***REMOVED***Sizing === 'border-bo***REMOVED***' ? width : calcContentBo***REMOVED***Size(element, width, 'left', 'right');
    };
    const getHeight$1 = element => getProp(element, 'height', element.dom.offsetHeight);
    const getWidth = element => getProp(element, 'width', element.dom.offsetWidth);
    const getInnerWidth = element => getCalculatedWidth(element, 'content-bo***REMOVED***');

    const api$2 = Dimension('width', element => element.dom.offsetWidth);
    const get$9 = element => api$2.get(element);
    const getOuter$2 = element => api$2.getOuter(element);
    const getInner = getInnerWidth;
    const getRuntime$1 = getWidth;

    const addCells = (gridRow, inde***REMOVED***, cells) => {
      const e***REMOVED***istingCells = gridRow.cells;
      const before = e***REMOVED***istingCells.slice(0, inde***REMOVED***);
      const after = e***REMOVED***istingCells.slice(inde***REMOVED***);
      const newCells = before.concat(cells).concat(after);
      return setCells(gridRow, newCells);
    };
    const addCell = (gridRow, inde***REMOVED***, cell) => addCells(gridRow, inde***REMOVED***, [cell]);
    const mutateCell = (gridRow, inde***REMOVED***, cell) => {
      const cells = gridRow.cells;
      cells[inde***REMOVED***] = cell;
    };
    const setCells = (gridRow, cells) => rowcells(gridRow.element, cells, gridRow.section, gridRow.isNew);
    const mapCells = (gridRow, f) => {
      const cells = gridRow.cells;
      const r = map$1(cells, f);
      return rowcells(gridRow.element, r, gridRow.section, gridRow.isNew);
    };
    const getCell = (gridRow, inde***REMOVED***) => gridRow.cells[inde***REMOVED***];
    const getCellElement = (gridRow, inde***REMOVED***) => getCell(gridRow, inde***REMOVED***).element;
    const cellLength = gridRow => gridRow.cells.length;
    const e***REMOVED***tractGridDetails = grid => {
      const result = partition(grid, row => row.section === 'colgroup');
      return {
        rows: result.fail,
        cols: result.pass
      };
    };
    const clone = (gridRow, cloneRow, cloneCell) => {
      const newCells = map$1(gridRow.cells, cloneCell);
      return rowcells(cloneRow(gridRow.element), newCells, gridRow.section, true);
    };

    const LOCKED_COL_ATTR = 'data-snooker-locked-cols';
    const getLockedColumnsFromTable = table => getOpt(table, LOCKED_COL_ATTR).bind(lockedColStr => Optional.from(lockedColStr.match(/\d+/g))).map(lockedCols => mapToObject(lockedCols, always));
    const getLockedColumnsFromGrid = grid => {
      const locked = foldl(e***REMOVED***tractGridDetails(grid).rows, (acc, row) => {
        each$2(row.cells, (cell, id***REMOVED***) => {
          if (cell.isLocked) {
            acc[id***REMOVED***] = true;
          }
        });
        return acc;
      }, {});
      const lockedArr = mapToArray(locked, (_val, key) => parseInt(key, 10));
      return sort$1(lockedArr);
    };

    const key = (row, column) => {
      return row + ',' + column;
    };
    const getAt = (warehouse, row, column) => Optional.from(warehouse.access[key(row, column)]);
    const findItem = (warehouse, item, comparator) => {
      const filtered = filterItems(warehouse, detail => {
        return comparator(item, detail.element);
      });
      return filtered.length > 0 ? Optional.some(filtered[0]) : Optional.none();
    };
    const filterItems = (warehouse, predicate) => {
      const all = bind$2(warehouse.all, r => {
        return r.cells;
      });
      return filter$2(all, predicate);
    };
    const generateColumns = rowData => {
      const columnsGroup = {};
      let inde***REMOVED*** = 0;
      each$2(rowData.cells, column => {
        const colspan = column.colspan;
        range$1(colspan, columnInde***REMOVED*** => {
          const colInde***REMOVED*** = inde***REMOVED*** + columnInde***REMOVED***;
          columnsGroup[colInde***REMOVED***] = columne***REMOVED***t(column.element, colspan, colInde***REMOVED***);
        });
        inde***REMOVED*** += colspan;
      });
      return columnsGroup;
    };
    const generate$1 = list => {
      const access = {};
      const cells = [];
      const tableOpt = head(list).map(rowData => rowData.element).bind(table);
      const lockedColumns = tableOpt.bind(getLockedColumnsFromTable).getOr({});
      let ma***REMOVED***Rows = 0;
      let ma***REMOVED***Columns = 0;
      let rowCount = 0;
      const {
        pass: colgroupRows,
        fail: rows
      } = partition(list, rowData => rowData.section === 'colgroup');
      each$2(rows, rowData => {
        const currentRow = [];
        each$2(rowData.cells, rowCell => {
          let start = 0;
          while (access[key(rowCount, start)] !== undefined) {
            start++;
          }
          const isLocked = hasNonNullableKey(lockedColumns, start.toString());
          const current = e***REMOVED***tended(rowCell.element, rowCell.rowspan, rowCell.colspan, rowCount, start, isLocked);
          for (let occupiedColumnPosition = 0; occupiedColumnPosition < rowCell.colspan; occupiedColumnPosition++) {
            for (let occupiedRowPosition = 0; occupiedRowPosition < rowCell.rowspan; occupiedRowPosition++) {
              const rowPosition = rowCount + occupiedRowPosition;
              const columnPosition = start + occupiedColumnPosition;
              const newpos = key(rowPosition, columnPosition);
              access[newpos] = current;
              ma***REMOVED***Columns = Math.ma***REMOVED***(ma***REMOVED***Columns, columnPosition + 1);
            }
          }
          currentRow.push(current);
        });
        ma***REMOVED***Rows++;
        cells.push(rowdetail(rowData.element, currentRow, rowData.section));
        rowCount++;
      });
      const {columns, colgroups} = last$2(colgroupRows).map(rowData => {
        const columns = generateColumns(rowData);
        const colgroup$1 = colgroup(rowData.element, values(columns));
        return {
          colgroups: [colgroup$1],
          columns
        };
      }).getOrThunk(() => ({
        colgroups: [],
        columns: {}
      }));
      const grid$1 = grid(ma***REMOVED***Rows, ma***REMOVED***Columns);
      return {
        grid: grid$1,
        access,
        all: cells,
        columns,
        colgroups
      };
    };
    const fromTable = table => {
      const list = fromTable$1(table);
      return generate$1(list);
    };
    const justCells = warehouse => bind$2(warehouse.all, w => w.cells);
    const justColumns = warehouse => values(warehouse.columns);
    const hasColumns = warehouse => keys(warehouse.columns).length > 0;
    const getColumnAt = (warehouse, columnInde***REMOVED***) => Optional.from(warehouse.columns[columnInde***REMOVED***]);
    const Warehouse = {
      fromTable,
      generate: generate$1,
      getAt,
      findItem,
      filterItems,
      justCells,
      justColumns,
      hasColumns,
      getColumnAt
    };

    const columns = (warehouse, isValidCell = always) => {
      const grid = warehouse.grid;
      const cols = range$1(grid.columns, identity);
      const rowsArr = range$1(grid.rows, identity);
      return map$1(cols, col => {
        const getBlock = () => bind$2(rowsArr, r => Warehouse.getAt(warehouse, r, col).filter(detail => detail.column === col).toArray());
        const isValid = detail => detail.colspan === 1 && isValidCell(detail.element);
        const getFallback = () => Warehouse.getAt(warehouse, 0, col);
        return decide(getBlock, isValid, getFallback);
      });
    };
    const decide = (getBlock, isValid, getFallback) => {
      const inBlock = getBlock();
      const validInBlock = find$1(inBlock, isValid);
      const detailOption = validInBlock.orThunk(() => Optional.from(inBlock[0]).orThunk(getFallback));
      return detailOption.map(detail => detail.element);
    };
    const rows = warehouse => {
      const grid = warehouse.grid;
      const rowsArr = range$1(grid.rows, identity);
      const cols = range$1(grid.columns, identity);
      return map$1(rowsArr, row => {
        const getBlock = () => bind$2(cols, c => Warehouse.getAt(warehouse, row, c).filter(detail => detail.row === row).fold(constant([]), detail => [detail]));
        const isSingle = detail => detail.rowspan === 1;
        const getFallback = () => Warehouse.getAt(warehouse, row, 0);
        return decide(getBlock, isSingle, getFallback);
      });
    };

    const deduce = (***REMOVED***s, inde***REMOVED***) => {
      if (inde***REMOVED*** < 0 || inde***REMOVED*** >= ***REMOVED***s.length - 1) {
        return Optional.none();
      }
      const current = ***REMOVED***s[inde***REMOVED***].fold(() => {
        const rest = reverse(***REMOVED***s.slice(0, inde***REMOVED***));
        return findMap(rest, (a, i) => a.map(aa => ({
          value: aa,
          delta: i + 1
        })));
      }, c => Optional.some({
        value: c,
        delta: 0
      }));
      const ne***REMOVED***t = ***REMOVED***s[inde***REMOVED*** + 1].fold(() => {
        const rest = ***REMOVED***s.slice(inde***REMOVED*** + 1);
        return findMap(rest, (a, i) => a.map(aa => ({
          value: aa,
          delta: i + 1
        })));
      }, n => Optional.some({
        value: n,
        delta: 1
      }));
      return current.bind(c => ne***REMOVED***t.map(n => {
        const e***REMOVED***tras = n.delta + c.delta;
        return Math.abs(n.value - c.value) / e***REMOVED***tras;
      }));
    };

    const onDirection = (isLtr, isRtl) => element => getDirection(element) === 'rtl' ? isRtl : isLtr;
    const getDirection = element => get$a(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';

    const api$1 = Dimension('height', element => {
      const dom = element.dom;
      return inBody(element) ? dom.getBoundingClientRect().height : dom.offsetHeight;
    });
    const get$8 = element => api$1.get(element);
    const getOuter$1 = element => api$1.getOuter(element);
    const getRuntime = getHeight$1;

    const r = (left, top) => {
      const translate = (***REMOVED***, y) => r(left + ***REMOVED***, top + y);
      return {
        left,
        top,
        translate
      };
    };
    const SugarPosition = r;

    const bo***REMOVED***Position = dom => {
      const bo***REMOVED*** = dom.getBoundingClientRect();
      return SugarPosition(bo***REMOVED***.left, bo***REMOVED***.top);
    };
    const firstDefinedOrZero = (a, b) => {
      if (a !== undefined) {
        return a;
      } else {
        return b !== undefined ? b : 0;
      }
    };
    const absolute = element => {
      const doc = element.dom.ownerDocument;
      const body = doc.body;
      const win = doc.defaultView;
      const html = doc.documentElement;
      if (body === element.dom) {
        return SugarPosition(body.offsetLeft, body.offsetTop);
      }
      const scrollTop = firstDefinedOrZero(win === null || win === void 0 ? void 0 : win.pageYOffset, html.scrollTop);
      const scrollLeft = firstDefinedOrZero(win === null || win === void 0 ? void 0 : win.pageXOffset, html.scrollLeft);
      const clientTop = firstDefinedOrZero(html.clientTop, body.clientTop);
      const clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft);
      return viewport(element).translate(scrollLeft - clientLeft, scrollTop - clientTop);
    };
    const viewport = element => {
      const dom = element.dom;
      const doc = dom.ownerDocument;
      const body = doc.body;
      if (body === dom) {
        return SugarPosition(body.offsetLeft, body.offsetTop);
      }
      if (!inBody(element)) {
        return SugarPosition(0, 0);
      }
      return bo***REMOVED***Position(dom);
    };

    const rowInfo = (row, y) => ({
      row,
      y
    });
    const colInfo = (col, ***REMOVED***) => ({
      col,
      ***REMOVED***
    });
    const rtlEdge = cell => {
      const pos = absolute(cell);
      return pos.left + getOuter$2(cell);
    };
    const ltrEdge = cell => {
      return absolute(cell).left;
    };
    const getLeftEdge = (inde***REMOVED***, cell) => {
      return colInfo(inde***REMOVED***, ltrEdge(cell));
    };
    const getRightEdge = (inde***REMOVED***, cell) => {
      return colInfo(inde***REMOVED***, rtlEdge(cell));
    };
    const getTop$1 = cell => {
      return absolute(cell).top;
    };
    const getTopEdge = (inde***REMOVED***, cell) => {
      return rowInfo(inde***REMOVED***, getTop$1(cell));
    };
    const getBottomEdge = (inde***REMOVED***, cell) => {
      return rowInfo(inde***REMOVED***, getTop$1(cell) + getOuter$1(cell));
    };
    const findPositions = (getInnerEdge, getOuterEdge, array) => {
      if (array.length === 0) {
        return [];
      }
      const lines = map$1(array.slice(1), (cellOption, inde***REMOVED***) => {
        return cellOption.map(cell => {
          return getInnerEdge(inde***REMOVED***, cell);
        });
      });
      const lastLine = array[array.length - 1].map(cell => {
        return getOuterEdge(array.length - 1, cell);
      });
      return lines.concat([lastLine]);
    };
    const negate = step => {
      return -step;
    };
    const height = {
      delta: identity,
      positions: optElements => findPositions(getTopEdge, getBottomEdge, optElements),
      edge: getTop$1
    };
    const ltr$1 = {
      delta: identity,
      edge: ltrEdge,
      positions: optElements => findPositions(getLeftEdge, getRightEdge, optElements)
    };
    const rtl$1 = {
      delta: negate,
      edge: rtlEdge,
      positions: optElements => findPositions(getRightEdge, getLeftEdge, optElements)
    };
    const detect$1 = onDirection(ltr$1, rtl$1);
    const width = {
      delta: (amount, table) => detect$1(table).delta(amount, table),
      positions: (cols, table) => detect$1(table).positions(cols, table),
      edge: cell => detect$1(cell).edge(cell)
    };

    const units = {
      unsupportedLength: [
        'em',
        'e***REMOVED***',
        'cap',
        'ch',
        'ic',
        'rem',
        'lh',
        'rlh',
        'vw',
        'vh',
        'vi',
        'vb',
        'vmin',
        'vma***REMOVED***',
        'cm',
        'mm',
        'Q',
        'in',
        'pc',
        'pt',
        'p***REMOVED***'
      ],
      fi***REMOVED***ed: [
        'p***REMOVED***',
        'pt'
      ],
      relative: ['%'],
      empty: ['']
    };
    const pattern = (() => {
      const decimalDigits = '[0-9]+';
      const signedInteger = '[+-]?' + decimalDigits;
      const e***REMOVED***ponentPart = '[eE]' + signedInteger;
      const dot = '\\.';
      const opt = input => `(?:${ input })?`;
      const unsignedDecimalLiteral = [
        'Infinity',
        decimalDigits + dot + opt(decimalDigits) + opt(e***REMOVED***ponentPart),
        dot + decimalDigits + opt(e***REMOVED***ponentPart),
        decimalDigits + opt(e***REMOVED***ponentPart)
      ].join('|');
      const float = `[+-]?(?:${ unsignedDecimalLiteral })`;
      return new RegE***REMOVED***p(`^(${ float })(.*)$`);
    })();
    const isUnit = (unit, accepted) => e***REMOVED***ists(accepted, acc => e***REMOVED***ists(units[acc], check => unit === check));
    const parse = (input, accepted) => {
      const match = Optional.from(pattern.e***REMOVED***ec(input));
      return match.bind(array => {
        const value = Number(array[1]);
        const unitRaw = array[2];
        if (isUnit(unitRaw, accepted)) {
          return Optional.some({
            value,
            unit: unitRaw
          });
        } else {
          return Optional.none();
        }
      });
    };

    const rPercentageBasedSizeRege***REMOVED*** = /(\d+(\.\d+)?)%/;
    const rPi***REMOVED***elBasedSizeRege***REMOVED*** = /(\d+(\.\d+)?)p***REMOVED***|em/;
    const isCol$2 = isTag('col');
    const isRow$2 = isTag('tr');
    const getPercentSize = (elm, outerGetter, innerGetter) => {
      const relativeParent = parentElement(elm).getOrThunk(() => getBody$1(owner(elm)));
      return outerGetter(elm) / innerGetter(relativeParent) * 100;
    };
    const setPi***REMOVED***elWidth = (cell, amount) => {
      set$1(cell, 'width', amount + 'p***REMOVED***');
    };
    const setPercentageWidth = (cell, amount) => {
      set$1(cell, 'width', amount + '%');
    };
    const setHeight = (cell, amount) => {
      set$1(cell, 'height', amount + 'p***REMOVED***');
    };
    const removeHeight = cell => {
      remove$5(cell, 'height');
    };
    const getHeightValue = cell => getRuntime(cell) + 'p***REMOVED***';
    const convert = (cell, number, getter, setter) => {
      const newSize = table(cell).map(table => {
        const total = getter(table);
        return Math.floor(number / 100 * total);
      }).getOr(number);
      setter(cell, newSize);
      return newSize;
    };
    const normalizePi***REMOVED***elSize = (value, cell, getter, setter) => {
      const number = parseFloat(value);
      return endsWith(value, '%') && name(cell) !== 'table' ? convert(cell, number, getter, setter) : number;
    };
    const getTotalHeight = cell => {
      const value = getHeightValue(cell);
      if (!value) {
        return get$8(cell);
      }
      return normalizePi***REMOVED***elSize(value, cell, get$8, setHeight);
    };
    const get$7 = (cell, type, f) => {
      const v = f(cell);
      const span = getSpan(cell, type);
      return v / span;
    };
    const getRaw$1 = (element, prop) => {
      return getRaw$2(element, prop).orThunk(() => {
        return getOpt(element, prop).map(val => val + 'p***REMOVED***');
      });
    };
    const getRawWidth$1 = element => getRaw$1(element, 'width');
    const getRawHeight$1 = element => getRaw$1(element, 'height');
    const getPercentageWidth = cell => getPercentSize(cell, get$9, getInner);
    const getPi***REMOVED***elWidth$1 = cell => isCol$2(cell) ? get$9(cell) : getRuntime$1(cell);
    const getHeight = cell => {
      return isRow$2(cell) ? get$8(cell) : get$7(cell, 'rowspan', getTotalHeight);
    };
    const getGenericWidth = cell => {
      const width = getRawWidth$1(cell);
      return width.bind(w => parse(w, [
        'fi***REMOVED***ed',
        'relative',
        'empty'
      ]));
    };
    const setGenericWidth = (cell, amount, unit) => {
      set$1(cell, 'width', amount + unit);
    };
    const getPi***REMOVED***elTableWidth = table => get$9(table) + 'p***REMOVED***';
    const getPi***REMOVED***elTableHeight = table => get$8(table) + 'p***REMOVED***';
    const getPercentTableWidth = table => getPercentSize(table, get$9, getInner) + '%';
    const isPercentSizing$1 = table => getRawWidth$1(table).e***REMOVED***ists(size => rPercentageBasedSizeRege***REMOVED***.test(size));
    const isPi***REMOVED***elSizing$1 = table => getRawWidth$1(table).e***REMOVED***ists(size => rPi***REMOVED***elBasedSizeRege***REMOVED***.test(size));
    const isNoneSizing$1 = table => getRawWidth$1(table).isNone();
    const percentageBasedSizeRege***REMOVED*** = constant(rPercentageBasedSizeRege***REMOVED***);

    const isCol$1 = isTag('col');
    const getRawW = cell => {
      return getRawWidth$1(cell).getOrThunk(() => getPi***REMOVED***elWidth$1(cell) + 'p***REMOVED***');
    };
    const getRawH = cell => {
      return getRawHeight$1(cell).getOrThunk(() => getHeight(cell) + 'p***REMOVED***');
    };
    const justCols = warehouse => map$1(Warehouse.justColumns(warehouse), column => Optional.from(column.element));
    const isValidColumn = cell => {
      const browser = detect$2().browser;
      const supportsColWidths = browser.isChromium() || browser.isFirefo***REMOVED***();
      return isCol$1(cell) ? supportsColWidths : true;
    };
    const getDimension = (cellOpt, inde***REMOVED***, backups, filter, getter, fallback) => cellOpt.filter(filter).fold(() => fallback(deduce(backups, inde***REMOVED***)), cell => getter(cell));
    const getWidthFrom = (warehouse, table, getWidth, fallback) => {
      const columnCells = columns(warehouse);
      const columns$1 = Warehouse.hasColumns(warehouse) ? justCols(warehouse) : columnCells;
      const backups = [Optional.some(width.edge(table))].concat(map$1(width.positions(columnCells, table), pos => pos.map(p => p.***REMOVED***)));
      const colFilter = not(hasColspan);
      return map$1(columns$1, (cellOption, c) => {
        return getDimension(cellOption, c, backups, colFilter, column => {
          if (isValidColumn(column)) {
            return getWidth(column);
          } else {
            const cell = bindFrom(columnCells[c], identity);
            return getDimension(cell, c, backups, colFilter, cell => fallback(Optional.some(get$9(cell))), fallback);
          }
        }, fallback);
      });
    };
    const getDeduced = deduced => {
      return deduced.map(d => {
        return d + 'p***REMOVED***';
      }).getOr('');
    };
    const getRawWidths = (warehouse, table) => {
      return getWidthFrom(warehouse, table, getRawW, getDeduced);
    };
    const getPercentageWidths = (warehouse, table, tableSize) => {
      return getWidthFrom(warehouse, table, getPercentageWidth, deduced => {
        return deduced.fold(() => {
          return tableSize.minCellWidth();
        }, cellWidth => {
          return cellWidth / tableSize.pi***REMOVED***elWidth() * 100;
        });
      });
    };
    const getPi***REMOVED***elWidths = (warehouse, table, tableSize) => {
      return getWidthFrom(warehouse, table, getPi***REMOVED***elWidth$1, deduced => {
        return deduced.getOrThunk(tableSize.minCellWidth);
      });
    };
    const getHeightFrom = (warehouse, table, getHeight, fallback) => {
      const rowCells = rows(warehouse);
      const rows$1 = map$1(warehouse.all, r => Optional.some(r.element));
      const backups = [Optional.some(height.edge(table))].concat(map$1(height.positions(rowCells, table), pos => pos.map(p => p.y)));
      return map$1(rows$1, (row, i) => getDimension(row, i, backups, always, getHeight, fallback));
    };
    const getPi***REMOVED***elHeights = (warehouse, table) => {
      return getHeightFrom(warehouse, table, getHeight, deduced => {
        return deduced.getOrThunk(minHeight);
      });
    };
    const getRawHeights = (warehouse, table) => {
      return getHeightFrom(warehouse, table, getRawH, getDeduced);
    };

    const widthLookup = (table, getter) => () => {
      if (inBody(table)) {
        return getter(table);
      } else {
        return parseFloat(getRaw$2(table, 'width').getOr('0'));
      }
    };
    const noneSize = table => {
      const getWidth = widthLookup(table, get$9);
      const zero = constant(0);
      const getWidths = (warehouse, tableSize) => getPi***REMOVED***elWidths(warehouse, table, tableSize);
      return {
        width: getWidth,
        pi***REMOVED***elWidth: getWidth,
        getWidths,
        getCellDelta: zero,
        singleColumnWidth: constant([0]),
        minCellWidth: zero,
        setElementWidth: noop,
        adjustTableWidth: noop,
        isRelative: true,
        label: 'none'
      };
    };
    const percentageSize = table => {
      const getFloatWidth = widthLookup(table, elem => parseFloat(getPercentTableWidth(elem)));
      const getWidth = widthLookup(table, get$9);
      const getCellDelta = delta => delta / getWidth() * 100;
      const singleColumnWidth = (w, _delta) => [100 - w];
      const minCellWidth = () => minWidth() / getWidth() * 100;
      const adjustTableWidth = delta => {
        const currentWidth = getFloatWidth();
        const change = delta / 100 * currentWidth;
        const newWidth = currentWidth + change;
        setPercentageWidth(table, newWidth);
      };
      const getWidths = (warehouse, tableSize) => getPercentageWidths(warehouse, table, tableSize);
      return {
        width: getFloatWidth,
        pi***REMOVED***elWidth: getWidth,
        getWidths,
        getCellDelta,
        singleColumnWidth,
        minCellWidth,
        setElementWidth: setPercentageWidth,
        adjustTableWidth,
        isRelative: true,
        label: 'percent'
      };
    };
    const pi***REMOVED***elSize = table => {
      const getWidth = widthLookup(table, get$9);
      const getCellDelta = identity;
      const singleColumnWidth = (w, delta) => {
        const newNe***REMOVED***t = Math.ma***REMOVED***(minWidth(), w + delta);
        return [newNe***REMOVED***t - w];
      };
      const adjustTableWidth = delta => {
        const newWidth = getWidth() + delta;
        setPi***REMOVED***elWidth(table, newWidth);
      };
      const getWidths = (warehouse, tableSize) => getPi***REMOVED***elWidths(warehouse, table, tableSize);
      return {
        width: getWidth,
        pi***REMOVED***elWidth: getWidth,
        getWidths,
        getCellDelta,
        singleColumnWidth,
        minCellWidth: minWidth,
        setElementWidth: setPi***REMOVED***elWidth,
        adjustTableWidth,
        isRelative: false,
        label: 'pi***REMOVED***el'
      };
    };
    const chooseSize = (element, width) => {
      const percentMatch = percentageBasedSizeRege***REMOVED***().e***REMOVED***ec(width);
      if (percentMatch !== null) {
        return percentageSize(element);
      } else {
        return pi***REMOVED***elSize(element);
      }
    };
    const getTableSize = table => {
      const width = getRawWidth$1(table);
      return width.fold(() => noneSize(table), w => chooseSize(table, w));
    };
    const TableSize = {
      getTableSize,
      pi***REMOVED***elSize,
      percentageSize,
      noneSize
    };

    const statsStruct = (minRow, minCol, ma***REMOVED***Row, ma***REMOVED***Col, allCells, selectedCells) => ({
      minRow,
      minCol,
      ma***REMOVED***Row,
      ma***REMOVED***Col,
      allCells,
      selectedCells
    });
    const findSelectedStats = (house, isSelected) => {
      const totalColumns = house.grid.columns;
      const totalRows = house.grid.rows;
      let minRow = totalRows;
      let minCol = totalColumns;
      let ma***REMOVED***Row = 0;
      let ma***REMOVED***Col = 0;
      const allCells = [];
      const selectedCells = [];
      each$1(house.access, detail => {
        allCells.push(detail);
        if (isSelected(detail)) {
          selectedCells.push(detail);
          const startRow = detail.row;
          const endRow = startRow + detail.rowspan - 1;
          const startCol = detail.column;
          const endCol = startCol + detail.colspan - 1;
          if (startRow < minRow) {
            minRow = startRow;
          } else if (endRow > ma***REMOVED***Row) {
            ma***REMOVED***Row = endRow;
          }
          if (startCol < minCol) {
            minCol = startCol;
          } else if (endCol > ma***REMOVED***Col) {
            ma***REMOVED***Col = endCol;
          }
        }
      });
      return statsStruct(minRow, minCol, ma***REMOVED***Row, ma***REMOVED***Col, allCells, selectedCells);
    };
    const makeCell = (list, seenSelected, rowInde***REMOVED***) => {
      const row = list[rowInde***REMOVED***].element;
      const td = SugarElement.fromTag('td');
      append$1(td, SugarElement.fromTag('br'));
      const f = seenSelected ? append$1 : prepend;
      f(row, td);
    };
    const fillInGaps = (list, house, stats, isSelected) => {
      const rows = filter$2(list, row => row.section !== 'colgroup');
      const totalColumns = house.grid.columns;
      const totalRows = house.grid.rows;
      for (let i = 0; i < totalRows; i++) {
        let seenSelected = false;
        for (let j = 0; j < totalColumns; j++) {
          if (!(i < stats.minRow || i > stats.ma***REMOVED***Row || j < stats.minCol || j > stats.ma***REMOVED***Col)) {
            const needCell = Warehouse.getAt(house, i, j).filter(isSelected).isNone();
            if (needCell) {
              makeCell(rows, seenSelected, i);
            } else {
              seenSelected = true;
            }
          }
        }
      }
    };
    const clean = (replica, stats, house, widthDelta) => {
      each$1(house.columns, col => {
        if (col.column < stats.minCol || col.column > stats.ma***REMOVED***Col) {
          remove$6(col.element);
        }
      });
      const emptyRows = filter$2(firstLayer(replica, 'tr'), row => row.dom.childElementCount === 0);
      each$2(emptyRows, remove$6);
      if (stats.minCol === stats.ma***REMOVED***Col || stats.minRow === stats.ma***REMOVED***Row) {
        each$2(firstLayer(replica, 'th,td'), cell => {
          remove$7(cell, 'rowspan');
          remove$7(cell, 'colspan');
        });
      }
      remove$7(replica, LOCKED_COL_ATTR);
      remove$7(replica, 'data-snooker-col-series');
      const tableSize = TableSize.getTableSize(replica);
      tableSize.adjustTableWidth(widthDelta);
    };
    const getTableWidthDelta = (table, warehouse, tableSize, stats) => {
      if (stats.minCol === 0 && warehouse.grid.columns === stats.ma***REMOVED***Col + 1) {
        return 0;
      }
      const colWidths = getPi***REMOVED***elWidths(warehouse, table, tableSize);
      const allColsWidth = foldl(colWidths, (acc, width) => acc + width, 0);
      const selectedColsWidth = foldl(colWidths.slice(stats.minCol, stats.ma***REMOVED***Col + 1), (acc, width) => acc + width, 0);
      const newWidth = selectedColsWidth / allColsWidth * tableSize.pi***REMOVED***elWidth();
      const delta = newWidth - tableSize.pi***REMOVED***elWidth();
      return tableSize.getCellDelta(delta);
    };
    const e***REMOVED***tract$1 = (table, selectedSelector) => {
      const isSelected = detail => is$2(detail.element, selectedSelector);
      const replica = deep(table);
      const list = fromTable$1(replica);
      const tableSize = TableSize.getTableSize(table);
      const replicaHouse = Warehouse.generate(list);
      const replicaStats = findSelectedStats(replicaHouse, isSelected);
      const selector = 'th:not(' + selectedSelector + ')' + ',td:not(' + selectedSelector + ')';
      const unselectedCells = filterFirstLayer(replica, 'th,td', cell => is$2(cell, selector));
      each$2(unselectedCells, remove$6);
      fillInGaps(list, replicaHouse, replicaStats, isSelected);
      const house = Warehouse.fromTable(table);
      const widthDelta = getTableWidthDelta(table, house, tableSize, replicaStats);
      clean(replica, replicaStats, replicaHouse, widthDelta);
      return replica;
    };

    const nbsp = '\***REMOVED***A0';

    const NodeValue = (is, name) => {
      const get = element => {
        if (!is(element)) {
          throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
        }
        return getOption(element).getOr('');
      };
      const getOption = element => is(element) ? Optional.from(element.dom.nodeValue) : Optional.none();
      const set = (element, value) => {
        if (!is(element)) {
          throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
        }
        element.dom.nodeValue = value;
      };
      return {
        get,
        getOption,
        set
      };
    };

    const api = NodeValue(isTe***REMOVED***t, 'te***REMOVED***t');
    const get$6 = element => api.get(element);
    const getOption = element => api.getOption(element);
    const set = (element, value) => api.set(element, value);

    const getEnd = element => name(element) === 'img' ? 1 : getOption(element).fold(() => children$2(element).length, v => v.length);
    const isTe***REMOVED***tNodeWithCursorPosition = el => getOption(el).filter(te***REMOVED***t => te***REMOVED***t.trim().length !== 0 || te***REMOVED***t.inde***REMOVED***Of(nbsp) > -1).isSome();
    const isContentEditableFalse = elem => isHTMLElement(elem) && get$b(elem, 'contenteditable') === 'false';
    const elementsWithCursorPosition = [
      'img',
      'br'
    ];
    const isCursorPosition = elem => {
      const hasCursorPosition = isTe***REMOVED***tNodeWithCursorPosition(elem);
      return hasCursorPosition || contains$2(elementsWithCursorPosition, name(elem)) || isContentEditableFalse(elem);
    };

    const first = element => descendant$1(element, isCursorPosition);
    const last$1 = element => descendantRtl(element, isCursorPosition);
    const descendantRtl = (scope, predicate) => {
      const descend = element => {
        const children = children$2(element);
        for (let i = children.length - 1; i >= 0; i--) {
          const child = children[i];
          if (predicate(child)) {
            return Optional.some(child);
          }
          const res = descend(child);
          if (res.isSome()) {
            return res;
          }
        }
        return Optional.none();
      };
      return descend(scope);
    };

    const transferableAttributes = {
      scope: [
        'row',
        'col'
      ]
    };
    const createCell = doc => () => {
      const td = SugarElement.fromTag('td', doc.dom);
      append$1(td, SugarElement.fromTag('br', doc.dom));
      return td;
    };
    const createCol = doc => () => {
      return SugarElement.fromTag('col', doc.dom);
    };
    const createColgroup = doc => () => {
      return SugarElement.fromTag('colgroup', doc.dom);
    };
    const createRow$1 = doc => () => {
      return SugarElement.fromTag('tr', doc.dom);
    };
    const replace$1 = (cell, tag, attrs) => {
      const replica = copy$2(cell, tag);
      each$1(attrs, (v, k) => {
        if (v === null) {
          remove$7(replica, k);
        } else {
          set$2(replica, k, v);
        }
      });
      return replica;
    };
    const pasteReplace = cell => {
      return cell;
    };
    const cloneFormats = (oldCell, newCell, formats) => {
      const first$1 = first(oldCell);
      return first$1.map(firstTe***REMOVED***t => {
        const formatSelector = formats.join(',');
        const parents = ancestors$3(firstTe***REMOVED***t, formatSelector, element => {
          return eq$1(element, oldCell);
        });
        return foldr(parents, (last, parent) => {
          const clonedFormat = shallow(parent);
          append$1(last, clonedFormat);
          return clonedFormat;
        }, newCell);
      }).getOr(newCell);
    };
    const cloneAppropriateAttributes = (original, clone) => {
      each$1(transferableAttributes, (validAttributes, attributeName) => getOpt(original, attributeName).filter(attribute => contains$2(validAttributes, attribute)).each(attribute => set$2(clone, attributeName, attribute)));
    };
    const cellOperations = (mutate, doc, formatsToClone) => {
      const cloneCss = (prev, clone) => {
        copy$1(prev.element, clone);
        remove$5(clone, 'height');
        if (prev.colspan !== 1) {
          remove$5(clone, 'width');
        }
      };
      const newCell = prev => {
        const td = SugarElement.fromTag(name(prev.element), doc.dom);
        const formats = formatsToClone.getOr([
          'strong',
          'em',
          'b',
          'i',
          'span',
          'font',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'p',
          'div'
        ]);
        const lastNode = formats.length > 0 ? cloneFormats(prev.element, td, formats) : td;
        append$1(lastNode, SugarElement.fromTag('br'));
        cloneCss(prev, td);
        cloneAppropriateAttributes(prev.element, td);
        mutate(prev.element, td);
        return td;
      };
      const newCol = prev => {
        const col = SugarElement.fromTag(name(prev.element), doc.dom);
        cloneCss(prev, col);
        mutate(prev.element, col);
        return col;
      };
      return {
        col: newCol,
        colgroup: createColgroup(doc),
        row: createRow$1(doc),
        cell: newCell,
        replace: replace$1,
        colGap: createCol(doc),
        gap: createCell(doc)
      };
    };
    const paste$1 = doc => {
      return {
        col: createCol(doc),
        colgroup: createColgroup(doc),
        row: createRow$1(doc),
        cell: createCell(doc),
        replace: pasteReplace,
        colGap: createCol(doc),
        gap: createCell(doc)
      };
    };

    const fromHtml = (html, scope) => {
      const doc = scope || document;
      const div = doc.createElement('div');
      div.innerHTML = html;
      return children$2(SugarElement.fromDom(div));
    };
    const fromDom = nodes => map$1(nodes, SugarElement.fromDom);

    const option = name => editor => editor.options.get(name);
    const defaultWidth = '100%';
    const getPi***REMOVED***elForcedWidth = editor => {
      var _a;
      const dom = editor.dom;
      const parentBlock = (_a = dom.getParent(editor.selection.getStart(), dom.isBlock)) !== null && _a !== void 0 ? _a : editor.getBody();
      return getInner(SugarElement.fromDom(parentBlock)) + 'p***REMOVED***';
    };
    const determineDefaultTableStyles = (editor, defaultStyles) => {
      if (isTableResponsiveForced(editor) || !shouldStyleWithCss(editor)) {
        return defaultStyles;
      } else if (isTablePi***REMOVED***elsForced(editor)) {
        return {
          ...defaultStyles,
          width: getPi***REMOVED***elForcedWidth(editor)
        };
      } else {
        return {
          ...defaultStyles,
          width: defaultWidth
        };
      }
    };
    const determineDefaultTableAttributes = (editor, defaultAttributes) => {
      if (isTableResponsiveForced(editor) || shouldStyleWithCss(editor)) {
        return defaultAttributes;
      } else if (isTablePi***REMOVED***elsForced(editor)) {
        return {
          ...defaultAttributes,
          width: getPi***REMOVED***elForcedWidth(editor)
        };
      } else {
        return {
          ...defaultAttributes,
          width: defaultWidth
        };
      }
    };
    const register = editor => {
      const registerOption = editor.options.register;
      registerOption('table_clone_elements', { processor: 'string[]' });
      registerOption('table_use_colgroups', {
        processor: 'boolean',
        default: true
      });
      registerOption('table_header_type', {
        processor: value => {
          const valid = contains$2([
            'section',
            'cells',
            'sectionCells',
            'auto'
          ], value);
          return valid ? {
            value,
            valid
          } : {
            valid: false,
            message: 'Must be one of: section, cells, sectionCells or auto.'
          };
        },
        default: 'section'
      });
      registerOption('table_sizing_mode', {
        processor: 'string',
        default: 'auto'
      });
      registerOption('table_default_attributes', {
        processor: 'object',
        default: { border: '1' }
      });
      registerOption('table_default_styles', {
        processor: 'object',
        default: { 'border-collapse': 'collapse' }
      });
      registerOption('table_column_resizing', {
        processor: value => {
          const valid = contains$2([
            'preservetable',
            'resizetable'
          ], value);
          return valid ? {
            value,
            valid
          } : {
            valid: false,
            message: 'Must be preservetable, or resizetable.'
          };
        },
        default: 'preservetable'
      });
      registerOption('table_resize_bars', {
        processor: 'boolean',
        default: true
      });
      registerOption('table_style_by_css', {
        processor: 'boolean',
        default: true
      });
      registerOption('table_merge_content_on_paste', {
        processor: 'boolean',
        default: true
      });
    };
    const getTableCloneElements = editor => {
      return Optional.from(editor.options.get('table_clone_elements'));
    };
    const hasTableObjectResizing = editor => {
      const objectResizing = editor.options.get('object_resizing');
      return contains$2(objectResizing.split(','), 'table');
    };
    const getTableHeaderType = option('table_header_type');
    const getTableColumnResizingBehaviour = option('table_column_resizing');
    const isPreserveTableColumnResizing = editor => getTableColumnResizingBehaviour(editor) === 'preservetable';
    const isResizeTableColumnResizing = editor => getTableColumnResizingBehaviour(editor) === 'resizetable';
    const getTableSizingMode = option('table_sizing_mode');
    const isTablePercentagesForced = editor => getTableSizingMode(editor) === 'relative';
    const isTablePi***REMOVED***elsForced = editor => getTableSizingMode(editor) === 'fi***REMOVED***ed';
    const isTableResponsiveForced = editor => getTableSizingMode(editor) === 'responsive';
    const hasTableResizeBars = option('table_resize_bars');
    const shouldStyleWithCss = option('table_style_by_css');
    const shouldMergeContentOnPaste = option('table_merge_content_on_paste');
    const getTableDefaultAttributes = editor => {
      const options = editor.options;
      const defaultAttributes = options.get('table_default_attributes');
      return options.isSet('table_default_attributes') ? defaultAttributes : determineDefaultTableAttributes(editor, defaultAttributes);
    };
    const getTableDefaultStyles = editor => {
      const options = editor.options;
      const defaultStyles = options.get('table_default_styles');
      return options.isSet('table_default_styles') ? defaultStyles : determineDefaultTableStyles(editor, defaultStyles);
    };
    const tableUseColumnGroup = option('table_use_colgroups');

    const closest = target => closest$1(target, '[contenteditable]');
    const isEditable$1 = (element, assumeEditable = false) => {
      if (inBody(element)) {
        return element.dom.isContentEditable;
      } else {
        return closest(element).fold(constant(assumeEditable), editable => getRaw(editable) === 'true');
      }
    };
    const getRaw = element => element.dom.contentEditable;

    const getBody = editor => SugarElement.fromDom(editor.getBody());
    const getIsRoot = editor => element => eq$1(element, getBody(editor));
    const removeDataStyle = table => {
      remove$7(table, 'data-mce-style');
      const removeStyleAttribute = element => remove$7(element, 'data-mce-style');
      each$2(cells$1(table), removeStyleAttribute);
      each$2(columns$1(table), removeStyleAttribute);
      each$2(rows$1(table), removeStyleAttribute);
    };
    const getSelectionStart = editor => SugarElement.fromDom(editor.selection.getStart());
    const getPi***REMOVED***elWidth = elm => elm.getBoundingClientRect().width;
    const getPi***REMOVED***elHeight = elm => elm.getBoundingClientRect().height;
    const getRawValue = prop => (editor, elm) => {
      const raw = editor.dom.getStyle(elm, prop) || editor.dom.getAttrib(elm, prop);
      return Optional.from(raw).filter(isNotEmpty);
    };
    const getRawWidth = getRawValue('width');
    const getRawHeight = getRawValue('height');
    const isPercentage$1 = value => /^(\d+(\.\d+)?)%$/.test(value);
    const isPi***REMOVED***el = value => /^(\d+(\.\d+)?)p***REMOVED***$/.test(value);
    const isInEditableConte***REMOVED***t$1 = cell => closest$2(cell, isTag('table')).e***REMOVED***ists(isEditable$1);

    const inSelection = (bounds, detail) => {
      const leftEdge = detail.column;
      const rightEdge = detail.column + detail.colspan - 1;
      const topEdge = detail.row;
      const bottomEdge = detail.row + detail.rowspan - 1;
      return leftEdge <= bounds.finishCol && rightEdge >= bounds.startCol && (topEdge <= bounds.finishRow && bottomEdge >= bounds.startRow);
    };
    const isWithin = (bounds, detail) => {
      return detail.column >= bounds.startCol && detail.column + detail.colspan - 1 <= bounds.finishCol && detail.row >= bounds.startRow && detail.row + detail.rowspan - 1 <= bounds.finishRow;
    };
    const isRectangular = (warehouse, bounds) => {
      let isRect = true;
      const detailIsWithin = curry(isWithin, bounds);
      for (let i = bounds.startRow; i <= bounds.finishRow; i++) {
        for (let j = bounds.startCol; j <= bounds.finishCol; j++) {
          isRect = isRect && Warehouse.getAt(warehouse, i, j).e***REMOVED***ists(detailIsWithin);
        }
      }
      return isRect ? Optional.some(bounds) : Optional.none();
    };

    const getBounds = (detailA, detailB) => {
      return bounds(Math.min(detailA.row, detailB.row), Math.min(detailA.column, detailB.column), Math.ma***REMOVED***(detailA.row + detailA.rowspan - 1, detailB.row + detailB.rowspan - 1), Math.ma***REMOVED***(detailA.column + detailA.colspan - 1, detailB.column + detailB.colspan - 1));
    };
    const getAnyBo***REMOVED*** = (warehouse, startCell, finishCell) => {
      const startCoords = Warehouse.findItem(warehouse, startCell, eq$1);
      const finishCoords = Warehouse.findItem(warehouse, finishCell, eq$1);
      return startCoords.bind(sc => {
        return finishCoords.map(fc => {
          return getBounds(sc, fc);
        });
      });
    };
    const getBo***REMOVED***$1 = (warehouse, startCell, finishCell) => {
      return getAnyBo***REMOVED***(warehouse, startCell, finishCell).bind(bounds => {
        return isRectangular(warehouse, bounds);
      });
    };

    const moveBy$1 = (warehouse, cell, row, column) => {
      return Warehouse.findItem(warehouse, cell, eq$1).bind(detail => {
        const startRow = row > 0 ? detail.row + detail.rowspan - 1 : detail.row;
        const startCol = column > 0 ? detail.column + detail.colspan - 1 : detail.column;
        const dest = Warehouse.getAt(warehouse, startRow + row, startCol + column);
        return dest.map(d => {
          return d.element;
        });
      });
    };
    const intercepts$1 = (warehouse, start, finish) => {
      return getAnyBo***REMOVED***(warehouse, start, finish).map(bounds => {
        const inside = Warehouse.filterItems(warehouse, curry(inSelection, bounds));
        return map$1(inside, detail => {
          return detail.element;
        });
      });
    };
    const parentCell = (warehouse, innerCell) => {
      const isContainedBy = (c1, c2) => {
        return contains$1(c2, c1);
      };
      return Warehouse.findItem(warehouse, innerCell, isContainedBy).map(detail => {
        return detail.element;
      });
    };

    const moveBy = (cell, deltaRow, deltaColumn) => {
      return table(cell).bind(table => {
        const warehouse = getWarehouse(table);
        return moveBy$1(warehouse, cell, deltaRow, deltaColumn);
      });
    };
    const intercepts = (table, first, last) => {
      const warehouse = getWarehouse(table);
      return intercepts$1(warehouse, first, last);
    };
    const nestedIntercepts = (table, first, firstTable, last, lastTable) => {
      const warehouse = getWarehouse(table);
      const optStartCell = eq$1(table, firstTable) ? Optional.some(first) : parentCell(warehouse, first);
      const optLastCell = eq$1(table, lastTable) ? Optional.some(last) : parentCell(warehouse, last);
      return optStartCell.bind(startCell => optLastCell.bind(lastCell => intercepts$1(warehouse, startCell, lastCell)));
    };
    const getBo***REMOVED*** = (table, first, last) => {
      const warehouse = getWarehouse(table);
      return getBo***REMOVED***$1(warehouse, first, last);
    };
    const getWarehouse = Warehouse.fromTable;

    var TagBoundaries = [
      'body',
      'p',
      'div',
      'article',
      'aside',
      'figcaption',
      'figure',
      'footer',
      'header',
      'nav',
      'section',
      'ol',
      'ul',
      'li',
      'table',
      'thead',
      'tbody',
      'tfoot',
      'caption',
      'tr',
      'td',
      'th',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'pre',
      'address'
    ];

    var DomUniverse = () => {
      const clone = element => {
        return SugarElement.fromDom(element.dom.cloneNode(false));
      };
      const document = element => documentOrOwner(element).dom;
      const isBoundary = element => {
        if (!isElement(element)) {
          return false;
        }
        if (name(element) === 'body') {
          return true;
        }
        return contains$2(TagBoundaries, name(element));
      };
      const isEmptyTag = element => {
        if (!isElement(element)) {
          return false;
        }
        return contains$2([
          'br',
          'img',
          'hr',
          'input'
        ], name(element));
      };
      const isNonEditable = element => isElement(element) && get$b(element, 'contenteditable') === 'false';
      const comparePosition = (element, other) => {
        return element.dom.compareDocumentPosition(other.dom);
      };
      const copyAttributesTo = (source, destination) => {
        const as = clone$2(source);
        setAll$1(destination, as);
      };
      const isSpecial = element => {
        const tag = name(element);
        return contains$2([
          'script',
          'noscript',
          'iframe',
          'noframes',
          'noembed',
          'title',
          'style',
          'te***REMOVED***tarea',
          '***REMOVED***mp'
        ], tag);
      };
      const getLanguage = element => isElement(element) ? getOpt(element, 'lang') : Optional.none();
      return {
        up: constant({
          selector: ancestor$1,
          closest: closest$1,
          predicate: ancestor$2,
          all: parents
        }),
        down: constant({
          selector: descendants,
          predicate: descendants$1
        }),
        styles: constant({
          get: get$a,
          getRaw: getRaw$2,
          set: set$1,
          remove: remove$5
        }),
        attrs: constant({
          get: get$b,
          set: set$2,
          remove: remove$7,
          copyTo: copyAttributesTo
        }),
        insert: constant({
          before: before$3,
          after: after$5,
          afterAll: after$4,
          append: append$1,
          appendAll: append,
          prepend: prepend,
          wrap: wrap
        }),
        remove: constant({
          unwrap: unwrap,
          remove: remove$6
        }),
        create: constant({
          nu: SugarElement.fromTag,
          clone,
          te***REMOVED***t: SugarElement.fromTe***REMOVED***t
        }),
        query: constant({
          comparePosition,
          prevSibling: prevSibling,
          ne***REMOVED***tSibling: ne***REMOVED***tSibling
        }),
        property: constant({
          children: children$2,
          name: name,
          parent: parent,
          document,
          isTe***REMOVED***t: isTe***REMOVED***t,
          isComment: isComment,
          isElement: isElement,
          isSpecial,
          getLanguage,
          getTe***REMOVED***t: get$6,
          setTe***REMOVED***t: set,
          isBoundary,
          isEmptyTag,
          isNonEditable
        }),
        eq: eq$1,
        is: is$1
      };
    };

    const all = (universe, look, elements, f) => {
      const head = elements[0];
      const tail = elements.slice(1);
      return f(universe, look, head, tail);
    };
    const oneAll = (universe, look, elements) => {
      return elements.length > 0 ? all(universe, look, elements, unsafeOne) : Optional.none();
    };
    const unsafeOne = (universe, look, head, tail) => {
      const start = look(universe, head);
      return foldr(tail, (b, a) => {
        const current = look(universe, a);
        return commonElement(universe, b, current);
      }, start);
    };
    const commonElement = (universe, start, end) => {
      return start.bind(s => {
        return end.filter(curry(universe.eq, s));
      });
    };

    const eq = (universe, item) => {
      return curry(universe.eq, item);
    };
    const ancestors$2 = (universe, start, end, isRoot = never) => {
      const ps1 = [start].concat(universe.up().all(start));
      const ps2 = [end].concat(universe.up().all(end));
      const prune = path => {
        const inde***REMOVED*** = findInde***REMOVED***(path, isRoot);
        return inde***REMOVED***.fold(() => {
          return path;
        }, ind => {
          return path.slice(0, ind + 1);
        });
      };
      const pruned1 = prune(ps1);
      const pruned2 = prune(ps2);
      const shared = find$1(pruned1, ***REMOVED*** => {
        return e***REMOVED***ists(pruned2, eq(universe, ***REMOVED***));
      });
      return {
        firstpath: pruned1,
        secondpath: pruned2,
        shared
      };
    };

    const sharedOne$1 = oneAll;
    const ancestors$1 = ancestors$2;

    const universe$3 = DomUniverse();
    const sharedOne = (look, elements) => {
      return sharedOne$1(universe$3, (_universe, element) => {
        return look(element);
      }, elements);
    };
    const ancestors = (start, finish, isRoot) => {
      return ancestors$1(universe$3, start, finish, isRoot);
    };

    const lookupTable = container => {
      return ancestor$1(container, 'table');
    };
    const identify = (start, finish, isRoot) => {
      const getIsRoot = rootTable => {
        return element => {
          return isRoot !== undefined && isRoot(element) || eq$1(element, rootTable);
        };
      };
      if (eq$1(start, finish)) {
        return Optional.some({
          bo***REMOVED***es: Optional.some([start]),
          start,
          finish
        });
      } else {
        return lookupTable(start).bind(startTable => {
          return lookupTable(finish).bind(finishTable => {
            if (eq$1(startTable, finishTable)) {
              return Optional.some({
                bo***REMOVED***es: intercepts(startTable, start, finish),
                start,
                finish
              });
            } else if (contains$1(startTable, finishTable)) {
              const ancestorCells = ancestors$3(finish, 'td,th', getIsRoot(startTable));
              const finishCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : finish;
              return Optional.some({
                bo***REMOVED***es: nestedIntercepts(startTable, start, startTable, finish, finishTable),
                start,
                finish: finishCell
              });
            } else if (contains$1(finishTable, startTable)) {
              const ancestorCells = ancestors$3(start, 'td,th', getIsRoot(finishTable));
              const startCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : start;
              return Optional.some({
                bo***REMOVED***es: nestedIntercepts(finishTable, start, startTable, finish, finishTable),
                start,
                finish: startCell
              });
            } else {
              return ancestors(start, finish).shared.bind(lca => {
                return closest$1(lca, 'table', isRoot).bind(lcaTable => {
                  const finishAncestorCells = ancestors$3(finish, 'td,th', getIsRoot(lcaTable));
                  const finishCell = finishAncestorCells.length > 0 ? finishAncestorCells[finishAncestorCells.length - 1] : finish;
                  const startAncestorCells = ancestors$3(start, 'td,th', getIsRoot(lcaTable));
                  const startCell = startAncestorCells.length > 0 ? startAncestorCells[startAncestorCells.length - 1] : start;
                  return Optional.some({
                    bo***REMOVED***es: nestedIntercepts(lcaTable, start, startTable, finish, finishTable),
                    start: startCell,
                    finish: finishCell
                  });
                });
              });
            }
          });
        });
      }
    };
    const retrieve$1 = (container, selector) => {
      const sels = descendants(container, selector);
      return sels.length > 0 ? Optional.some(sels) : Optional.none();
    };
    const getLast = (bo***REMOVED***es, lastSelectedSelector) => {
      return find$1(bo***REMOVED***es, bo***REMOVED*** => {
        return is$2(bo***REMOVED***, lastSelectedSelector);
      });
    };
    const getEdges = (container, firstSelectedSelector, lastSelectedSelector) => {
      return descendant(container, firstSelectedSelector).bind(first => {
        return descendant(container, lastSelectedSelector).bind(last => {
          return sharedOne(lookupTable, [
            first,
            last
          ]).map(table => {
            return {
              first,
              last,
              table
            };
          });
        });
      });
    };
    const e***REMOVED***pandTo = (finish, firstSelectedSelector) => {
      return ancestor$1(finish, 'table').bind(table => {
        return descendant(table, firstSelectedSelector).bind(start => {
          return identify(start, finish).bind(identified => {
            return identified.bo***REMOVED***es.map(bo***REMOVED***es => {
              return {
                bo***REMOVED***es,
                start: identified.start,
                finish: identified.finish
              };
            });
          });
        });
      });
    };
    const shiftSelection = (bo***REMOVED***es, deltaRow, deltaColumn, firstSelectedSelector, lastSelectedSelector) => {
      return getLast(bo***REMOVED***es, lastSelectedSelector).bind(last => {
        return moveBy(last, deltaRow, deltaColumn).bind(finish => {
          return e***REMOVED***pandTo(finish, firstSelectedSelector);
        });
      });
    };

    const retrieve = (container, selector) => {
      return retrieve$1(container, selector);
    };
    const retrieveBo***REMOVED*** = (container, firstSelectedSelector, lastSelectedSelector) => {
      return getEdges(container, firstSelectedSelector, lastSelectedSelector).bind(edges => {
        const isRoot = ancestor => {
          return eq$1(container, ancestor);
        };
        const sectionSelector = 'thead,tfoot,tbody,table';
        const firstAncestor = ancestor$1(edges.first, sectionSelector, isRoot);
        const lastAncestor = ancestor$1(edges.last, sectionSelector, isRoot);
        return firstAncestor.bind(fA => {
          return lastAncestor.bind(lA => {
            return eq$1(fA, lA) ? getBo***REMOVED***(edges.table, edges.first, edges.last) : Optional.none();
          });
        });
      });
    };

    const selection = identity;
    const unmergable = selectedCells => {
      const hasSpan = (elem, type) => getOpt(elem, type).e***REMOVED***ists(span => parseInt(span, 10) > 1);
      const hasRowOrColSpan = elem => hasSpan(elem, 'rowspan') || hasSpan(elem, 'colspan');
      return selectedCells.length > 0 && forall(selectedCells, hasRowOrColSpan) ? Optional.some(selectedCells) : Optional.none();
    };
    const mergable = (table, selectedCells, ephemera) => {
      if (selectedCells.length <= 1) {
        return Optional.none();
      } else {
        return retrieveBo***REMOVED***(table, ephemera.firstSelectedSelector, ephemera.lastSelectedSelector).map(bounds => ({
          bounds,
          cells: selectedCells
        }));
      }
    };

    const strSelected = 'data-mce-selected';
    const strSelectedSelector = 'td[' + strSelected + '],th[' + strSelected + ']';
    const strAttributeSelector = '[' + strSelected + ']';
    const strFirstSelected = 'data-mce-first-selected';
    const strFirstSelectedSelector = 'td[' + strFirstSelected + '],th[' + strFirstSelected + ']';
    const strLastSelected = 'data-mce-last-selected';
    const strLastSelectedSelector = 'td[' + strLastSelected + '],th[' + strLastSelected + ']';
    const attributeSelector = strAttributeSelector;
    const ephemera = {
      selected: strSelected,
      selectedSelector: strSelectedSelector,
      firstSelected: strFirstSelected,
      firstSelectedSelector: strFirstSelectedSelector,
      lastSelected: strLastSelected,
      lastSelectedSelector: strLastSelectedSelector
    };

    const forMenu = (selectedCells, table, cell) => ({
      element: cell,
      mergable: mergable(table, selectedCells, ephemera),
      unmergable: unmergable(selectedCells),
      selection: selection(selectedCells)
    });
    const paste = (element, clipboard, generators) => ({
      element,
      clipboard,
      generators
    });
    const pasteRows = (selectedCells, _cell, clipboard, generators) => ({
      selection: selection(selectedCells),
      clipboard,
      generators
    });

    const getSelectionCellFallback = element => table(element).bind(table => retrieve(table, ephemera.firstSelectedSelector)).fold(constant(element), cells => cells[0]);
    const getSelectionFromSelector = selector => (initCell, isRoot) => {
      const cellName = name(initCell);
      const cell = cellName === 'col' || cellName === 'colgroup' ? getSelectionCellFallback(initCell) : initCell;
      return closest$1(cell, selector, isRoot);
    };
    const getSelectionCellOrCaption = getSelectionFromSelector('th,td,caption');
    const getSelectionCell = getSelectionFromSelector('th,td');
    const getCellsFromSelection = editor => fromDom(editor.model.table.getSelectedCells());
    const getCellsFromFakeSelection = editor => filter$2(getCellsFromSelection(editor), cell => is$2(cell, ephemera.selectedSelector));

    const e***REMOVED***tractSelected = cells => {
      return table(cells[0]).map(table => {
        const replica = e***REMOVED***tract$1(table, attributeSelector);
        removeDataStyle(replica);
        return [replica];
      });
    };
    const serializeElements = (editor, elements) => map$1(elements, elm => editor.selection.serializer.serialize(elm.dom, {})).join('');
    const getTe***REMOVED***tContent = elements => map$1(elements, element => element.dom.innerTe***REMOVED***t).join('');
    const registerEvents = (editor, actions) => {
      editor.on('BeforeGetContent', e => {
        const multiCellConte***REMOVED***t = cells => {
          e.preventDefault();
          e***REMOVED***tractSelected(cells).each(elements => {
            e.content = e.format === 'te***REMOVED***t' ? getTe***REMOVED***tContent(elements) : serializeElements(editor, elements);
          });
        };
        if (e.selection === true) {
          const cells = getCellsFromFakeSelection(editor);
          if (cells.length >= 1) {
            multiCellConte***REMOVED***t(cells);
          }
        }
      });
      editor.on('BeforeSetContent', e => {
        if (e.selection === true && e.paste === true) {
          const selectedCells = getCellsFromSelection(editor);
          head(selectedCells).each(cell => {
            table(cell).each(table => {
              const elements = filter$2(fromHtml(e.content), content => {
                return name(content) !== 'meta';
              });
              const isTable = isTag('table');
              if (shouldMergeContentOnPaste(editor) && elements.length === 1 && isTable(elements[0])) {
                e.preventDefault();
                const doc = SugarElement.fromDom(editor.getDoc());
                const generators = paste$1(doc);
                const targets = paste(cell, elements[0], generators);
                actions.pasteCells(table, targets).each(() => {
                  editor.focus();
                });
              }
            });
          });
        }
      });
    };

    const point = (element, offset) => ({
      element,
      offset
    });

    const scan$1 = (universe, element, direction) => {
      if (universe.property().isTe***REMOVED***t(element) && universe.property().getTe***REMOVED***t(element).trim().length === 0 || universe.property().isComment(element)) {
        return direction(element).bind(elem => {
          return scan$1(universe, elem, direction).orThunk(() => {
            return Optional.some(elem);
          });
        });
      } else {
        return Optional.none();
      }
    };
    const toEnd = (universe, element) => {
      if (universe.property().isTe***REMOVED***t(element)) {
        return universe.property().getTe***REMOVED***t(element).length;
      }
      const children = universe.property().children(element);
      return children.length;
    };
    const freefallRtl$2 = (universe, element) => {
      const candidate = scan$1(universe, element, universe.query().prevSibling).getOr(element);
      if (universe.property().isTe***REMOVED***t(candidate)) {
        return point(candidate, toEnd(universe, candidate));
      }
      const children = universe.property().children(candidate);
      return children.length > 0 ? freefallRtl$2(universe, children[children.length - 1]) : point(candidate, toEnd(universe, candidate));
    };

    const freefallRtl$1 = freefallRtl$2;

    const universe$2 = DomUniverse();
    const freefallRtl = element => {
      return freefallRtl$1(universe$2, element);
    };

    const halve = (main, other) => {
      if (!hasColspan(main)) {
        const width = getGenericWidth(main);
        width.each(w => {
          const newWidth = w.value / 2;
          setGenericWidth(main, newWidth, w.unit);
          setGenericWidth(other, newWidth, w.unit);
        });
      }
    };

    const zero = array => map$1(array, constant(0));
    const surround = (sizes, startInde***REMOVED***, endInde***REMOVED***, results, f) => f(sizes.slice(0, startInde***REMOVED***)).concat(results).concat(f(sizes.slice(endInde***REMOVED***)));
    const clampDeltaHelper = predicate => (sizes, inde***REMOVED***, delta, minCellSize) => {
      if (!predicate(delta)) {
        return delta;
      } else {
        const newSize = Math.ma***REMOVED***(minCellSize, sizes[inde***REMOVED***] - Math.abs(delta));
        const diff = Math.abs(newSize - sizes[inde***REMOVED***]);
        return delta >= 0 ? diff : -diff;
      }
    };
    const clampNegativeDelta = clampDeltaHelper(delta => delta < 0);
    const clampDelta = clampDeltaHelper(always);
    const resizeTable = () => {
      const calcFi***REMOVED***edDeltas = (sizes, inde***REMOVED***, ne***REMOVED***t, delta, minCellSize) => {
        const clampedDelta = clampNegativeDelta(sizes, inde***REMOVED***, delta, minCellSize);
        return surround(sizes, inde***REMOVED***, ne***REMOVED***t + 1, [
          clampedDelta,
          0
        ], zero);
      };
      const calcRelativeDeltas = (sizes, inde***REMOVED***, delta, minCellSize) => {
        const ratio = (100 + delta) / 100;
        const newThis = Math.ma***REMOVED***(minCellSize, (sizes[inde***REMOVED***] + delta) / ratio);
        return map$1(sizes, (size, id***REMOVED***) => {
          const newSize = id***REMOVED*** === inde***REMOVED*** ? newThis : size / ratio;
          return newSize - size;
        });
      };
      const calcLeftEdgeDeltas = (sizes, inde***REMOVED***, ne***REMOVED***t, delta, minCellSize, isRelative) => {
        if (isRelative) {
          return calcRelativeDeltas(sizes, inde***REMOVED***, delta, minCellSize);
        } else {
          return calcFi***REMOVED***edDeltas(sizes, inde***REMOVED***, ne***REMOVED***t, delta, minCellSize);
        }
      };
      const calcMiddleDeltas = (sizes, _prev, inde***REMOVED***, ne***REMOVED***t, delta, minCellSize, isRelative) => calcLeftEdgeDeltas(sizes, inde***REMOVED***, ne***REMOVED***t, delta, minCellSize, isRelative);
      const resizeTable = (resizer, delta) => resizer(delta);
      const calcRightEdgeDeltas = (sizes, _prev, inde***REMOVED***, delta, minCellSize, isRelative) => {
        if (isRelative) {
          return calcRelativeDeltas(sizes, inde***REMOVED***, delta, minCellSize);
        } else {
          const clampedDelta = clampNegativeDelta(sizes, inde***REMOVED***, delta, minCellSize);
          return zero(sizes.slice(0, inde***REMOVED***)).concat([clampedDelta]);
        }
      };
      const calcRedestributedWidths = (sizes, totalWidth, pi***REMOVED***elDelta, isRelative) => {
        if (isRelative) {
          const tableWidth = totalWidth + pi***REMOVED***elDelta;
          const ratio = tableWidth / totalWidth;
          const newSizes = map$1(sizes, size => size / ratio);
          return {
            delta: ratio * 100 - 100,
            newSizes
          };
        } else {
          return {
            delta: pi***REMOVED***elDelta,
            newSizes: sizes
          };
        }
      };
      return {
        resizeTable,
        clampTableDelta: clampNegativeDelta,
        calcLeftEdgeDeltas,
        calcMiddleDeltas,
        calcRightEdgeDeltas,
        calcRedestributedWidths
      };
    };
    const preserveTable = () => {
      const calcLeftEdgeDeltas = (sizes, inde***REMOVED***, ne***REMOVED***t, delta, minCellSize) => {
        const id***REMOVED*** = delta >= 0 ? ne***REMOVED***t : inde***REMOVED***;
        const clampedDelta = clampDelta(sizes, id***REMOVED***, delta, minCellSize);
        return surround(sizes, inde***REMOVED***, ne***REMOVED***t + 1, [
          clampedDelta,
          -clampedDelta
        ], zero);
      };
      const calcMiddleDeltas = (sizes, _prev, inde***REMOVED***, ne***REMOVED***t, delta, minCellSize) => calcLeftEdgeDeltas(sizes, inde***REMOVED***, ne***REMOVED***t, delta, minCellSize);
      const resizeTable = (resizer, delta, isLastColumn) => {
        if (isLastColumn) {
          resizer(delta);
        }
      };
      const calcRightEdgeDeltas = (sizes, _prev, _inde***REMOVED***, delta, _minCellSize, isRelative) => {
        if (isRelative) {
          return zero(sizes);
        } else {
          const diff = delta / sizes.length;
          return map$1(sizes, constant(diff));
        }
      };
      const clampTableDelta = (sizes, inde***REMOVED***, delta, minCellSize, isLastColumn) => {
        if (isLastColumn) {
          if (delta >= 0) {
            return delta;
          } else {
            const ma***REMOVED***Delta = foldl(sizes, (a, b) => a + b - minCellSize, 0);
            return Math.ma***REMOVED***(-ma***REMOVED***Delta, delta);
          }
        } else {
          return clampNegativeDelta(sizes, inde***REMOVED***, delta, minCellSize);
        }
      };
      const calcRedestributedWidths = (sizes, _totalWidth, _pi***REMOVED***elDelta, _isRelative) => ({
        delta: 0,
        newSizes: sizes
      });
      return {
        resizeTable,
        clampTableDelta,
        calcLeftEdgeDeltas,
        calcMiddleDeltas,
        calcRightEdgeDeltas,
        calcRedestributedWidths
      };
    };

    const getGridSize = table => {
      const warehouse = Warehouse.fromTable(table);
      return warehouse.grid;
    };

    const isHeaderCell = isTag('th');
    const isHeaderCells = cells => forall(cells, cell => isHeaderCell(cell.element));
    const getRowHeaderType = (isHeaderRow, isHeaderCells) => {
      if (isHeaderRow && isHeaderCells) {
        return 'sectionCells';
      } else if (isHeaderRow) {
        return 'section';
      } else {
        return 'cells';
      }
    };
    const getRowType = row => {
      const isHeaderRow = row.section === 'thead';
      const isHeaderCells = is(findCommonCellType(row.cells), 'th');
      if (row.section === 'tfoot') {
        return { type: 'footer' };
      } else if (isHeaderRow || isHeaderCells) {
        return {
          type: 'header',
          subType: getRowHeaderType(isHeaderRow, isHeaderCells)
        };
      } else {
        return { type: 'body' };
      }
    };
    const findCommonCellType = cells => {
      const headerCells = filter$2(cells, cell => isHeaderCell(cell.element));
      if (headerCells.length === 0) {
        return Optional.some('td');
      } else if (headerCells.length === cells.length) {
        return Optional.some('th');
      } else {
        return Optional.none();
      }
    };
    const findCommonRowType = rows => {
      const rowTypes = map$1(rows, row => getRowType(row).type);
      const hasHeader = contains$2(rowTypes, 'header');
      const hasFooter = contains$2(rowTypes, 'footer');
      if (!hasHeader && !hasFooter) {
        return Optional.some('body');
      } else {
        const hasBody = contains$2(rowTypes, 'body');
        if (hasHeader && !hasBody && !hasFooter) {
          return Optional.some('header');
        } else if (!hasHeader && !hasBody && hasFooter) {
          return Optional.some('footer');
        } else {
          return Optional.none();
        }
      }
    };
    const findTableRowHeaderType = warehouse => findMap(warehouse.all, row => {
      const rowType = getRowType(row);
      return rowType.type === 'header' ? Optional.from(rowType.subType) : Optional.none();
    });

    const transformCell = (cell, comparator, substitution) => elementnew(substitution(cell.element, comparator), true, cell.isLocked);
    const transformRow = (row, section) => row.section !== section ? rowcells(row.element, row.cells, section, row.isNew) : row;
    const section = () => ({
      transformRow,
      transformCell: (cell, comparator, substitution) => {
        const newCell = substitution(cell.element, comparator);
        const fi***REMOVED***edCell = name(newCell) !== 'td' ? mutate$1(newCell, 'td') : newCell;
        return elementnew(fi***REMOVED***edCell, cell.isNew, cell.isLocked);
      }
    });
    const sectionCells = () => ({
      transformRow,
      transformCell
    });
    const cells = () => ({
      transformRow: (row, section) => {
        const newSection = section === 'thead' ? 'tbody' : section;
        return transformRow(row, newSection);
      },
      transformCell
    });
    const fallback = () => ({
      transformRow: identity,
      transformCell
    });
    const getTableSectionType = (table, fallback) => {
      const warehouse = Warehouse.fromTable(table);
      const type = findTableRowHeaderType(warehouse).getOr(fallback);
      switch (type) {
      case 'section':
        return section();
      case 'sectionCells':
        return sectionCells();
      case 'cells':
        return cells();
      }
    };
    const TableSection = {
      getTableSectionType,
      section,
      sectionCells,
      cells,
      fallback
    };

    const setIfNot = (element, property, value, ignore) => {
      if (value === ignore) {
        remove$7(element, property);
      } else {
        set$2(element, property, value);
      }
    };
    const insert$1 = (table, selector, element) => {
      last$2(children(table, selector)).fold(() => prepend(table, element), child => after$5(child, element));
    };
    const generateSection = (table, sectionName) => {
      const section = child(table, sectionName).getOrThunk(() => {
        const newSection = SugarElement.fromTag(sectionName, owner(table).dom);
        if (sectionName === 'thead') {
          insert$1(table, 'caption,colgroup', newSection);
        } else if (sectionName === 'colgroup') {
          insert$1(table, 'caption', newSection);
        } else {
          append$1(table, newSection);
        }
        return newSection;
      });
      empty(section);
      return section;
    };
    const render$1 = (table, grid) => {
      const newRows = [];
      const newCells = [];
      const syncRows = gridSection => map$1(gridSection, row => {
        if (row.isNew) {
          newRows.push(row.element);
        }
        const tr = row.element;
        empty(tr);
        each$2(row.cells, cell => {
          if (cell.isNew) {
            newCells.push(cell.element);
          }
          setIfNot(cell.element, 'colspan', cell.colspan, 1);
          setIfNot(cell.element, 'rowspan', cell.rowspan, 1);
          append$1(tr, cell.element);
        });
        return tr;
      });
      const syncColGroup = gridSection => bind$2(gridSection, colGroup => map$1(colGroup.cells, col => {
        setIfNot(col.element, 'span', col.colspan, 1);
        return col.element;
      }));
      const renderSection = (gridSection, sectionName) => {
        const section = generateSection(table, sectionName);
        const sync = sectionName === 'colgroup' ? syncColGroup : syncRows;
        const sectionElems = sync(gridSection);
        append(section, sectionElems);
      };
      const removeSection = sectionName => {
        child(table, sectionName).each(remove$6);
      };
      const renderOrRemoveSection = (gridSection, sectionName) => {
        if (gridSection.length > 0) {
          renderSection(gridSection, sectionName);
        } else {
          removeSection(sectionName);
        }
      };
      const headSection = [];
      const bodySection = [];
      const footSection = [];
      const columnGroupsSection = [];
      each$2(grid, row => {
        switch (row.section) {
        case 'thead':
          headSection.push(row);
          break;
        case 'tbody':
          bodySection.push(row);
          break;
        case 'tfoot':
          footSection.push(row);
          break;
        case 'colgroup':
          columnGroupsSection.push(row);
          break;
        }
      });
      renderOrRemoveSection(columnGroupsSection, 'colgroup');
      renderOrRemoveSection(headSection, 'thead');
      renderOrRemoveSection(bodySection, 'tbody');
      renderOrRemoveSection(footSection, 'tfoot');
      return {
        newRows,
        newCells
      };
    };
    const copy = grid => map$1(grid, row => {
      const tr = shallow(row.element);
      each$2(row.cells, cell => {
        const clonedCell = deep(cell.element);
        setIfNot(clonedCell, 'colspan', cell.colspan, 1);
        setIfNot(clonedCell, 'rowspan', cell.rowspan, 1);
        append$1(tr, clonedCell);
      });
      return tr;
    });

    const getColumn = (grid, inde***REMOVED***) => {
      return map$1(grid, row => {
        return getCell(row, inde***REMOVED***);
      });
    };
    const getRow = (grid, inde***REMOVED***) => {
      return grid[inde***REMOVED***];
    };
    const findDiff = (***REMOVED***s, comp) => {
      if (***REMOVED***s.length === 0) {
        return 0;
      }
      const first = ***REMOVED***s[0];
      const inde***REMOVED*** = findInde***REMOVED***(***REMOVED***s, ***REMOVED*** => {
        return !comp(first.element, ***REMOVED***.element);
      });
      return inde***REMOVED***.getOr(***REMOVED***s.length);
    };
    const subgrid = (grid, row, column, comparator) => {
      const gridRow = getRow(grid, row);
      const isColRow = gridRow.section === 'colgroup';
      const colspan = findDiff(gridRow.cells.slice(column), comparator);
      const rowspan = isColRow ? 1 : findDiff(getColumn(grid.slice(row), column), comparator);
      return {
        colspan,
        rowspan
      };
    };

    const toDetails = (grid, comparator) => {
      const seen = map$1(grid, row => map$1(row.cells, never));
      const updateSeen = (rowInde***REMOVED***, columnInde***REMOVED***, rowspan, colspan) => {
        for (let row = rowInde***REMOVED***; row < rowInde***REMOVED*** + rowspan; row++) {
          for (let column = columnInde***REMOVED***; column < columnInde***REMOVED*** + colspan; column++) {
            seen[row][column] = true;
          }
        }
      };
      return map$1(grid, (row, rowInde***REMOVED***) => {
        const details = bind$2(row.cells, (cell, columnInde***REMOVED***) => {
          if (seen[rowInde***REMOVED***][columnInde***REMOVED***] === false) {
            const result = subgrid(grid, rowInde***REMOVED***, columnInde***REMOVED***, comparator);
            updateSeen(rowInde***REMOVED***, columnInde***REMOVED***, result.rowspan, result.colspan);
            return [detailnew(cell.element, result.rowspan, result.colspan, cell.isNew)];
          } else {
            return [];
          }
        });
        return rowdetailnew(row.element, details, row.section, row.isNew);
      });
    };
    const toGrid = (warehouse, generators, isNew) => {
      const grid = [];
      each$2(warehouse.colgroups, colgroup => {
        const colgroupCols = [];
        for (let columnInde***REMOVED*** = 0; columnInde***REMOVED*** < warehouse.grid.columns; columnInde***REMOVED***++) {
          const element = Warehouse.getColumnAt(warehouse, columnInde***REMOVED***).map(column => elementnew(column.element, isNew, false)).getOrThunk(() => elementnew(generators.colGap(), true, false));
          colgroupCols.push(element);
        }
        grid.push(rowcells(colgroup.element, colgroupCols, 'colgroup', isNew));
      });
      for (let rowInde***REMOVED*** = 0; rowInde***REMOVED*** < warehouse.grid.rows; rowInde***REMOVED***++) {
        const rowCells = [];
        for (let columnInde***REMOVED*** = 0; columnInde***REMOVED*** < warehouse.grid.columns; columnInde***REMOVED***++) {
          const element = Warehouse.getAt(warehouse, rowInde***REMOVED***, columnInde***REMOVED***).map(item => elementnew(item.element, isNew, item.isLocked)).getOrThunk(() => elementnew(generators.gap(), true, false));
          rowCells.push(element);
        }
        const rowDetail = warehouse.all[rowInde***REMOVED***];
        const row = rowcells(rowDetail.element, rowCells, rowDetail.section, isNew);
        grid.push(row);
      }
      return grid;
    };

    const fromWarehouse = (warehouse, generators) => toGrid(warehouse, generators, false);
    const toDetailList = grid => toDetails(grid, eq$1);
    const findInWarehouse = (warehouse, element) => findMap(warehouse.all, r => find$1(r.cells, e => eq$1(element, e.element)));
    const e***REMOVED***tractCells = (warehouse, target, predicate) => {
      const details = map$1(target.selection, cell$1 => {
        return cell(cell$1).bind(lc => findInWarehouse(warehouse, lc)).filter(predicate);
      });
      const cells = cat(details);
      return someIf(cells.length > 0, cells);
    };
    const run = (operation, e***REMOVED***tract, adjustment, postAction, genWrappers) => (table, target, generators, behaviours) => {
      const warehouse = Warehouse.fromTable(table);
      const tableSection = Optional.from(behaviours === null || behaviours === void 0 ? void 0 : behaviours.section).getOrThunk(TableSection.fallback);
      const output = e***REMOVED***tract(warehouse, target).map(info => {
        const model = fromWarehouse(warehouse, generators);
        const result = operation(model, info, eq$1, genWrappers(generators), tableSection);
        const lockedColumns = getLockedColumnsFromGrid(result.grid);
        const grid = toDetailList(result.grid);
        return {
          info,
          grid,
          cursor: result.cursor,
          lockedColumns
        };
      });
      return output.bind(out => {
        const newElements = render$1(table, out.grid);
        const tableSizing = Optional.from(behaviours === null || behaviours === void 0 ? void 0 : behaviours.sizing).getOrThunk(() => TableSize.getTableSize(table));
        const resizing = Optional.from(behaviours === null || behaviours === void 0 ? void 0 : behaviours.resize).getOrThunk(preserveTable);
        adjustment(table, out.grid, out.info, {
          sizing: tableSizing,
          resize: resizing,
          section: tableSection
        });
        postAction(table);
        remove$7(table, LOCKED_COL_ATTR);
        if (out.lockedColumns.length > 0) {
          set$2(table, LOCKED_COL_ATTR, out.lockedColumns.join(','));
        }
        return Optional.some({
          cursor: out.cursor,
          newRows: newElements.newRows,
          newCells: newElements.newCells
        });
      });
    };
    const onPaste = (warehouse, target) => cell(target.element).bind(cell => findInWarehouse(warehouse, cell).map(details => {
      const value = {
        ...details,
        generators: target.generators,
        clipboard: target.clipboard
      };
      return value;
    }));
    const onPasteByEditor = (warehouse, target) => e***REMOVED***tractCells(warehouse, target, always).map(cells => ({
      cells,
      generators: target.generators,
      clipboard: target.clipboard
    }));
    const onMergable = (_warehouse, target) => target.mergable;
    const onUnmergable = (_warehouse, target) => target.unmergable;
    const onCells = (warehouse, target) => e***REMOVED***tractCells(warehouse, target, always);
    const onUnlockedCells = (warehouse, target) => e***REMOVED***tractCells(warehouse, target, detail => !detail.isLocked);
    const isUnlockedTableCell = (warehouse, cell) => findInWarehouse(warehouse, cell).e***REMOVED***ists(detail => !detail.isLocked);
    const allUnlocked = (warehouse, cells) => forall(cells, cell => isUnlockedTableCell(warehouse, cell));
    const onUnlockedMergable = (warehouse, target) => onMergable(warehouse, target).filter(mergeable => allUnlocked(warehouse, mergeable.cells));
    const onUnlockedUnmergable = (warehouse, target) => onUnmergable(warehouse, target).filter(cells => allUnlocked(warehouse, cells));

    const merge$2 = (grid, bounds, comparator, substitution) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      if (rows.length === 0) {
        return grid;
      }
      for (let i = bounds.startRow; i <= bounds.finishRow; i++) {
        for (let j = bounds.startCol; j <= bounds.finishCol; j++) {
          const row = rows[i];
          const isLocked = getCell(row, j).isLocked;
          mutateCell(row, j, elementnew(substitution(), false, isLocked));
        }
      }
      return grid;
    };
    const unmerge = (grid, target, comparator, substitution) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      let first = true;
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < cellLength(rows[0]); j++) {
          const row = rows[i];
          const currentCell = getCell(row, j);
          const currentCellElm = currentCell.element;
          const isToReplace = comparator(currentCellElm, target);
          if (isToReplace && !first) {
            mutateCell(row, j, elementnew(substitution(), true, currentCell.isLocked));
          } else if (isToReplace) {
            first = false;
          }
        }
      }
      return grid;
    };
    const uniqueCells = (row, comparator) => {
      return foldl(row, (rest, cell) => {
        return e***REMOVED***ists(rest, currentCell => {
          return comparator(currentCell.element, cell.element);
        }) ? rest : rest.concat([cell]);
      }, []);
    };
    const splitCols = (grid, inde***REMOVED***, comparator, substitution) => {
      if (inde***REMOVED*** > 0 && inde***REMOVED*** < grid[0].cells.length) {
        each$2(grid, row => {
          const prevCell = row.cells[inde***REMOVED*** - 1];
          let offset = 0;
          const substitute = substitution();
          while (row.cells.length > inde***REMOVED*** + offset && comparator(prevCell.element, row.cells[inde***REMOVED*** + offset].element)) {
            mutateCell(row, inde***REMOVED*** + offset, elementnew(substitute, true, row.cells[inde***REMOVED*** + offset].isLocked));
            offset++;
          }
        });
      }
      return grid;
    };
    const splitRows = (grid, inde***REMOVED***, comparator, substitution) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      if (inde***REMOVED*** > 0 && inde***REMOVED*** < rows.length) {
        const rowPrevCells = rows[inde***REMOVED*** - 1].cells;
        const cells = uniqueCells(rowPrevCells, comparator);
        each$2(cells, cell => {
          let replacement = Optional.none();
          for (let i = inde***REMOVED***; i < rows.length; i++) {
            for (let j = 0; j < cellLength(rows[0]); j++) {
              const row = rows[i];
              const current = getCell(row, j);
              const isToReplace = comparator(current.element, cell.element);
              if (isToReplace) {
                if (replacement.isNone()) {
                  replacement = Optional.some(substitution());
                }
                replacement.each(sub => {
                  mutateCell(row, j, elementnew(sub, true, current.isLocked));
                });
              }
            }
          }
        });
      }
      return grid;
    };

    const value$1 = value => {
      const applyHelper = fn => fn(value);
      const constHelper = constant(value);
      const outputHelper = () => output;
      const output = {
        tag: true,
        inner: value,
        fold: (_onError, onValue) => onValue(value),
        isValue: always,
        isError: never,
        map: mapper => Result.value(mapper(value)),
        mapError: outputHelper,
        bind: applyHelper,
        e***REMOVED***ists: applyHelper,
        forall: applyHelper,
        getOr: constHelper,
        or: outputHelper,
        getOrThunk: constHelper,
        orThunk: outputHelper,
        getOrDie: constHelper,
        each: fn => {
          fn(value);
        },
        toOptional: () => Optional.some(value)
      };
      return output;
    };
    const error = error => {
      const outputHelper = () => output;
      const output = {
        tag: false,
        inner: error,
        fold: (onError, _onValue) => onError(error),
        isValue: never,
        isError: always,
        map: outputHelper,
        mapError: mapper => Result.error(mapper(error)),
        bind: outputHelper,
        e***REMOVED***ists: never,
        forall: always,
        getOr: identity,
        or: identity,
        getOrThunk: apply,
        orThunk: apply,
        getOrDie: die(String(error)),
        each: noop,
        toOptional: Optional.none
      };
      return output;
    };
    const fromOption = (optional, err) => optional.fold(() => error(err), value$1);
    const Result = {
      value: value$1,
      error,
      fromOption
    };

    const measure = (startAddress, gridA, gridB) => {
      if (startAddress.row >= gridA.length || startAddress.column > cellLength(gridA[0])) {
        return Result.error('invalid start address out of table bounds, row: ' + startAddress.row + ', column: ' + startAddress.column);
      }
      const rowRemainder = gridA.slice(startAddress.row);
      const colRemainder = rowRemainder[0].cells.slice(startAddress.column);
      const colRequired = cellLength(gridB[0]);
      const rowRequired = gridB.length;
      return Result.value({
        rowDelta: rowRemainder.length - rowRequired,
        colDelta: colRemainder.length - colRequired
      });
    };
    const measureWidth = (gridA, gridB) => {
      const colLengthA = cellLength(gridA[0]);
      const colLengthB = cellLength(gridB[0]);
      return {
        rowDelta: 0,
        colDelta: colLengthA - colLengthB
      };
    };
    const measureHeight = (gridA, gridB) => {
      const rowLengthA = gridA.length;
      const rowLengthB = gridB.length;
      return {
        rowDelta: rowLengthA - rowLengthB,
        colDelta: 0
      };
    };
    const generateElements = (amount, row, generators, isLocked) => {
      const generator = row.section === 'colgroup' ? generators.col : generators.cell;
      return range$1(amount, id***REMOVED*** => elementnew(generator(), true, isLocked(id***REMOVED***)));
    };
    const rowFill = (grid, amount, generators, lockedColumns) => {
      const e***REMOVED***ampleRow = grid[grid.length - 1];
      return grid.concat(range$1(amount, () => {
        const generator = e***REMOVED***ampleRow.section === 'colgroup' ? generators.colgroup : generators.row;
        const row = clone(e***REMOVED***ampleRow, generator, identity);
        const elements = generateElements(row.cells.length, row, generators, id***REMOVED*** => has$1(lockedColumns, id***REMOVED***.toString()));
        return setCells(row, elements);
      }));
    };
    const colFill = (grid, amount, generators, startInde***REMOVED***) => map$1(grid, row => {
      const newChildren = generateElements(amount, row, generators, never);
      return addCells(row, startInde***REMOVED***, newChildren);
    });
    const lockedColFill = (grid, generators, lockedColumns) => map$1(grid, row => {
      return foldl(lockedColumns, (acc, colNum) => {
        const newChild = generateElements(1, row, generators, always)[0];
        return addCell(acc, colNum, newChild);
      }, row);
    });
    const tailor = (gridA, delta, generators) => {
      const fillCols = delta.colDelta < 0 ? colFill : identity;
      const fillRows = delta.rowDelta < 0 ? rowFill : identity;
      const lockedColumns = getLockedColumnsFromGrid(gridA);
      const gridWidth = cellLength(gridA[0]);
      const isLastColLocked = e***REMOVED***ists(lockedColumns, locked => locked === gridWidth - 1);
      const modifiedCols = fillCols(gridA, Math.abs(delta.colDelta), generators, isLastColLocked ? gridWidth - 1 : gridWidth);
      const newLockedColumns = getLockedColumnsFromGrid(modifiedCols);
      return fillRows(modifiedCols, Math.abs(delta.rowDelta), generators, mapToObject(newLockedColumns, always));
    };

    const isSpanning = (grid, row, col, comparator) => {
      const candidate = getCell(grid[row], col);
      const matching = curry(comparator, candidate.element);
      const currentRow = grid[row];
      return grid.length > 1 && cellLength(currentRow) > 1 && (col > 0 && matching(getCellElement(currentRow, col - 1)) || col < currentRow.cells.length - 1 && matching(getCellElement(currentRow, col + 1)) || row > 0 && matching(getCellElement(grid[row - 1], col)) || row < grid.length - 1 && matching(getCellElement(grid[row + 1], col)));
    };
    const mergeTables = (startAddress, gridA, gridBRows, generator, comparator, lockedColumns) => {
      const startRow = startAddress.row;
      const startCol = startAddress.column;
      const mergeHeight = gridBRows.length;
      const mergeWidth = cellLength(gridBRows[0]);
      const endRow = startRow + mergeHeight;
      const endCol = startCol + mergeWidth + lockedColumns.length;
      const lockedColumnObj = mapToObject(lockedColumns, always);
      for (let r = startRow; r < endRow; r++) {
        let skippedCol = 0;
        for (let c = startCol; c < endCol; c++) {
          if (lockedColumnObj[c]) {
            skippedCol++;
            continue;
          }
          if (isSpanning(gridA, r, c, comparator)) {
            unmerge(gridA, getCellElement(gridA[r], c), comparator, generator.cell);
          }
          const gridBColInde***REMOVED*** = c - startCol - skippedCol;
          const newCell = getCell(gridBRows[r - startRow], gridBColInde***REMOVED***);
          const newCellElm = newCell.element;
          const replacement = generator.replace(newCellElm);
          mutateCell(gridA[r], c, elementnew(replacement, true, newCell.isLocked));
        }
      }
      return gridA;
    };
    const getValidStartAddress = (currentStartAddress, grid, lockedColumns) => {
      const gridColLength = cellLength(grid[0]);
      const adjustedRowAddress = e***REMOVED***tractGridDetails(grid).cols.length + currentStartAddress.row;
      const possibleColAddresses = range$1(gridColLength - currentStartAddress.column, num => num + currentStartAddress.column);
      const validColAddress = find$1(possibleColAddresses, num => forall(lockedColumns, col => col !== num)).getOr(gridColLength - 1);
      return {
        row: adjustedRowAddress,
        column: validColAddress
      };
    };
    const getLockedColumnsWithinBounds = (startAddress, rows, lockedColumns) => filter$2(lockedColumns, colNum => colNum >= startAddress.column && colNum <= cellLength(rows[0]) + startAddress.column);
    const merge$1 = (startAddress, gridA, gridB, generator, comparator) => {
      const lockedColumns = getLockedColumnsFromGrid(gridA);
      const validStartAddress = getValidStartAddress(startAddress, gridA, lockedColumns);
      const gridBRows = e***REMOVED***tractGridDetails(gridB).rows;
      const lockedColumnsWithinBounds = getLockedColumnsWithinBounds(validStartAddress, gridBRows, lockedColumns);
      const result = measure(validStartAddress, gridA, gridBRows);
      return result.map(diff => {
        const delta = {
          ...diff,
          colDelta: diff.colDelta - lockedColumnsWithinBounds.length
        };
        const fittedGrid = tailor(gridA, delta, generator);
        const newLockedColumns = getLockedColumnsFromGrid(fittedGrid);
        const newLockedColumnsWithinBounds = getLockedColumnsWithinBounds(validStartAddress, gridBRows, newLockedColumns);
        return mergeTables(validStartAddress, fittedGrid, gridBRows, generator, comparator, newLockedColumnsWithinBounds);
      });
    };
    const insertCols = (inde***REMOVED***, gridA, gridB, generator, comparator) => {
      splitCols(gridA, inde***REMOVED***, comparator, generator.cell);
      const delta = measureHeight(gridB, gridA);
      const fittedNewGrid = tailor(gridB, delta, generator);
      const secondDelta = measureHeight(gridA, fittedNewGrid);
      const fittedOldGrid = tailor(gridA, secondDelta, generator);
      return map$1(fittedOldGrid, (gridRow, i) => {
        return addCells(gridRow, inde***REMOVED***, fittedNewGrid[i].cells);
      });
    };
    const insertRows = (inde***REMOVED***, gridA, gridB, generator, comparator) => {
      splitRows(gridA, inde***REMOVED***, comparator, generator.cell);
      const locked = getLockedColumnsFromGrid(gridA);
      const diff = measureWidth(gridA, gridB);
      const delta = {
        ...diff,
        colDelta: diff.colDelta - locked.length
      };
      const fittedOldGrid = tailor(gridA, delta, generator);
      const {
        cols: oldCols,
        rows: oldRows
      } = e***REMOVED***tractGridDetails(fittedOldGrid);
      const newLocked = getLockedColumnsFromGrid(fittedOldGrid);
      const secondDiff = measureWidth(gridB, gridA);
      const secondDelta = {
        ...secondDiff,
        colDelta: secondDiff.colDelta + newLocked.length
      };
      const fittedGridB = lockedColFill(gridB, generator, newLocked);
      const fittedNewGrid = tailor(fittedGridB, secondDelta, generator);
      return [
        ...oldCols,
        ...oldRows.slice(0, inde***REMOVED***),
        ...fittedNewGrid,
        ...oldRows.slice(inde***REMOVED***, oldRows.length)
      ];
    };

    const cloneRow = (row, cloneCell, comparator, substitution) => clone(row, elem => substitution(elem, comparator), cloneCell);
    const insertRowAt = (grid, inde***REMOVED***, e***REMOVED***ample, comparator, substitution) => {
      const {rows, cols} = e***REMOVED***tractGridDetails(grid);
      const before = rows.slice(0, inde***REMOVED***);
      const after = rows.slice(inde***REMOVED***);
      const newRow = cloneRow(rows[e***REMOVED***ample], (e***REMOVED***, c) => {
        const withinSpan = inde***REMOVED*** > 0 && inde***REMOVED*** < rows.length && comparator(getCellElement(rows[inde***REMOVED*** - 1], c), getCellElement(rows[inde***REMOVED***], c));
        const ret = withinSpan ? getCell(rows[inde***REMOVED***], c) : elementnew(substitution(e***REMOVED***.element, comparator), true, e***REMOVED***.isLocked);
        return ret;
      }, comparator, substitution);
      return [
        ...cols,
        ...before,
        newRow,
        ...after
      ];
    };
    const getElementFor = (row, column, section, withinSpan, e***REMOVED***ample, comparator, substitution) => {
      if (section === 'colgroup' || !withinSpan) {
        const cell = getCell(row, e***REMOVED***ample);
        return elementnew(substitution(cell.element, comparator), true, false);
      } else {
        return getCell(row, column);
      }
    };
    const insertColumnAt = (grid, inde***REMOVED***, e***REMOVED***ample, comparator, substitution) => map$1(grid, row => {
      const withinSpan = inde***REMOVED*** > 0 && inde***REMOVED*** < cellLength(row) && comparator(getCellElement(row, inde***REMOVED*** - 1), getCellElement(row, inde***REMOVED***));
      const sub = getElementFor(row, inde***REMOVED***, row.section, withinSpan, e***REMOVED***ample, comparator, substitution);
      return addCell(row, inde***REMOVED***, sub);
    });
    const deleteColumnsAt = (grid, columns) => bind$2(grid, row => {
      const e***REMOVED***istingCells = row.cells;
      const cells = foldr(columns, (acc, column) => column >= 0 && column < acc.length ? acc.slice(0, column).concat(acc.slice(column + 1)) : acc, e***REMOVED***istingCells);
      return cells.length > 0 ? [rowcells(row.element, cells, row.section, row.isNew)] : [];
    });
    const deleteRowsAt = (grid, start, finish) => {
      const {rows, cols} = e***REMOVED***tractGridDetails(grid);
      return [
        ...cols,
        ...rows.slice(0, start),
        ...rows.slice(finish + 1)
      ];
    };

    const notInStartRow = (grid, rowInde***REMOVED***, colInde***REMOVED***, comparator) => getCellElement(grid[rowInde***REMOVED***], colInde***REMOVED***) !== undefined && (rowInde***REMOVED*** > 0 && comparator(getCellElement(grid[rowInde***REMOVED*** - 1], colInde***REMOVED***), getCellElement(grid[rowInde***REMOVED***], colInde***REMOVED***)));
    const notInStartColumn = (row, inde***REMOVED***, comparator) => inde***REMOVED*** > 0 && comparator(getCellElement(row, inde***REMOVED*** - 1), getCellElement(row, inde***REMOVED***));
    const isDuplicatedCell = (grid, rowInde***REMOVED***, colInde***REMOVED***, comparator) => notInStartRow(grid, rowInde***REMOVED***, colInde***REMOVED***, comparator) || notInStartColumn(grid[rowInde***REMOVED***], colInde***REMOVED***, comparator);
    const rowReplacerPredicate = (targetRow, columnHeaders) => {
      const entireTableIsHeader = forall(columnHeaders, identity) && isHeaderCells(targetRow.cells);
      return entireTableIsHeader ? always : (cell, _rowInde***REMOVED***, colInde***REMOVED***) => {
        const type = name(cell.element);
        return !(type === 'th' && columnHeaders[colInde***REMOVED***]);
      };
    };
    const columnReplacePredicate = (targetColumn, rowHeaders) => {
      const entireTableIsHeader = forall(rowHeaders, identity) && isHeaderCells(targetColumn);
      return entireTableIsHeader ? always : (cell, rowInde***REMOVED***, _colInde***REMOVED***) => {
        const type = name(cell.element);
        return !(type === 'th' && rowHeaders[rowInde***REMOVED***]);
      };
    };
    const determineScope = (applyScope, cell, newScope, isInHeader) => {
      const hasSpan = scope => scope === 'row' ? hasRowspan(cell) : hasColspan(cell);
      const getScope = scope => hasSpan(scope) ? `${ scope }group` : scope;
      if (applyScope) {
        return isHeaderCell(cell) ? getScope(newScope) : null;
      } else if (isInHeader && isHeaderCell(cell)) {
        const oppositeScope = newScope === 'row' ? 'col' : 'row';
        return getScope(oppositeScope);
      } else {
        return null;
      }
    };
    const rowScopeGenerator = (applyScope, columnHeaders) => (cell, rowInde***REMOVED***, columnInde***REMOVED***) => Optional.some(determineScope(applyScope, cell.element, 'col', columnHeaders[columnInde***REMOVED***]));
    const columnScopeGenerator = (applyScope, rowHeaders) => (cell, rowInde***REMOVED***) => Optional.some(determineScope(applyScope, cell.element, 'row', rowHeaders[rowInde***REMOVED***]));
    const replace = (cell, comparator, substitute) => elementnew(substitute(cell.element, comparator), true, cell.isLocked);
    const replaceIn = (grid, targets, comparator, substitute, replacer, genScope, shouldReplace) => {
      const isTarget = cell => {
        return e***REMOVED***ists(targets, target => {
          return comparator(cell.element, target.element);
        });
      };
      return map$1(grid, (row, rowInde***REMOVED***) => {
        return mapCells(row, (cell, colInde***REMOVED***) => {
          if (isTarget(cell)) {
            const newCell = shouldReplace(cell, rowInde***REMOVED***, colInde***REMOVED***) ? replacer(cell, comparator, substitute) : cell;
            genScope(newCell, rowInde***REMOVED***, colInde***REMOVED***).each(scope => {
              setOptions(newCell.element, { scope: Optional.from(scope) });
            });
            return newCell;
          } else {
            return cell;
          }
        });
      });
    };
    const getColumnCells = (rows, columnInde***REMOVED***, comparator) => bind$2(rows, (row, i) => {
      return isDuplicatedCell(rows, i, columnInde***REMOVED***, comparator) ? [] : [getCell(row, columnInde***REMOVED***)];
    });
    const getRowCells = (rows, rowInde***REMOVED***, comparator) => {
      const targetRow = rows[rowInde***REMOVED***];
      return bind$2(targetRow.cells, (item, i) => {
        return isDuplicatedCell(rows, rowInde***REMOVED***, i, comparator) ? [] : [item];
      });
    };
    const replaceColumns = (grid, inde***REMOVED***es, applyScope, comparator, substitution) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      const targets = bind$2(inde***REMOVED***es, inde***REMOVED*** => getColumnCells(rows, inde***REMOVED***, comparator));
      const rowHeaders = map$1(rows, row => isHeaderCells(row.cells));
      const shouldReplaceCell = columnReplacePredicate(targets, rowHeaders);
      const scopeGenerator = columnScopeGenerator(applyScope, rowHeaders);
      return replaceIn(grid, targets, comparator, substitution, replace, scopeGenerator, shouldReplaceCell);
    };
    const replaceRows = (grid, inde***REMOVED***es, section, applyScope, comparator, substitution, tableSection) => {
      const {cols, rows} = e***REMOVED***tractGridDetails(grid);
      const targetRow = rows[inde***REMOVED***es[0]];
      const targets = bind$2(inde***REMOVED***es, inde***REMOVED*** => getRowCells(rows, inde***REMOVED***, comparator));
      const columnHeaders = map$1(targetRow.cells, (_cell, inde***REMOVED***) => isHeaderCells(getColumnCells(rows, inde***REMOVED***, comparator)));
      const newRows = [...rows];
      each$2(inde***REMOVED***es, inde***REMOVED*** => {
        newRows[inde***REMOVED***] = tableSection.transformRow(rows[inde***REMOVED***], section);
      });
      const newGrid = [
        ...cols,
        ...newRows
      ];
      const shouldReplaceCell = rowReplacerPredicate(targetRow, columnHeaders);
      const scopeGenerator = rowScopeGenerator(applyScope, columnHeaders);
      return replaceIn(newGrid, targets, comparator, substitution, tableSection.transformCell, scopeGenerator, shouldReplaceCell);
    };
    const replaceCells = (grid, details, comparator, substitution) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      const targetCells = map$1(details, detail => getCell(rows[detail.row], detail.column));
      return replaceIn(grid, targetCells, comparator, substitution, replace, Optional.none, always);
    };

    const generate = cases => {
      if (!isArray(cases)) {
        throw new Error('cases must be an array');
      }
      if (cases.length === 0) {
        throw new Error('there must be at least one case');
      }
      const constructors = [];
      const adt = {};
      each$2(cases, (acase, count) => {
        const keys$1 = keys(acase);
        if (keys$1.length !== 1) {
          throw new Error('one and only one name per case');
        }
        const key = keys$1[0];
        const value = acase[key];
        if (adt[key] !== undefined) {
          throw new Error('duplicate key detected:' + key);
        } else if (key === 'cata') {
          throw new Error('cannot have a case named cata (sorry)');
        } else if (!isArray(value)) {
          throw new Error('case arguments must be an array');
        }
        constructors.push(key);
        adt[key] = (...args) => {
          const argLength = args.length;
          if (argLength !== value.length) {
            throw new Error('Wrong number of arguments to case ' + key + '. E***REMOVED***pected ' + value.length + ' (' + value + '), got ' + argLength);
          }
          const match = branches => {
            const branchKeys = keys(branches);
            if (constructors.length !== branchKeys.length) {
              throw new Error('Wrong number of arguments to match. E***REMOVED***pected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
            }
            const allReqd = forall(constructors, reqKey => {
              return contains$2(branchKeys, reqKey);
            });
            if (!allReqd) {
              throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
            }
            return branches[key].apply(null, args);
          };
          return {
            fold: (...foldArgs) => {
              if (foldArgs.length !== cases.length) {
                throw new Error('Wrong number of arguments to fold. E***REMOVED***pected ' + cases.length + ', got ' + foldArgs.length);
              }
              const target = foldArgs[count];
              return target.apply(null, args);
            },
            match,
            log: label => {
              console.log(label, {
                constructors,
                constructor: key,
                params: args
              });
            }
          };
        };
      });
      return adt;
    };
    const Adt = { generate };

    const adt$6 = Adt.generate([
      { none: [] },
      { only: ['inde***REMOVED***'] },
      {
        left: [
          'inde***REMOVED***',
          'ne***REMOVED***t'
        ]
      },
      {
        middle: [
          'prev',
          'inde***REMOVED***',
          'ne***REMOVED***t'
        ]
      },
      {
        right: [
          'prev',
          'inde***REMOVED***'
        ]
      }
    ]);
    const ColumnConte***REMOVED***t = { ...adt$6 };

    const neighbours = (input, inde***REMOVED***) => {
      if (input.length === 0) {
        return ColumnConte***REMOVED***t.none();
      }
      if (input.length === 1) {
        return ColumnConte***REMOVED***t.only(0);
      }
      if (inde***REMOVED*** === 0) {
        return ColumnConte***REMOVED***t.left(0, 1);
      }
      if (inde***REMOVED*** === input.length - 1) {
        return ColumnConte***REMOVED***t.right(inde***REMOVED*** - 1, inde***REMOVED***);
      }
      if (inde***REMOVED*** > 0 && inde***REMOVED*** < input.length - 1) {
        return ColumnConte***REMOVED***t.middle(inde***REMOVED*** - 1, inde***REMOVED***, inde***REMOVED*** + 1);
      }
      return ColumnConte***REMOVED***t.none();
    };
    const determine = (input, column, step, tableSize, resize) => {
      const result = input.slice(0);
      const conte***REMOVED***t = neighbours(input, column);
      const onNone = constant(map$1(result, constant(0)));
      const onOnly = inde***REMOVED*** => tableSize.singleColumnWidth(result[inde***REMOVED***], step);
      const onLeft = (inde***REMOVED***, ne***REMOVED***t) => resize.calcLeftEdgeDeltas(result, inde***REMOVED***, ne***REMOVED***t, step, tableSize.minCellWidth(), tableSize.isRelative);
      const onMiddle = (prev, inde***REMOVED***, ne***REMOVED***t) => resize.calcMiddleDeltas(result, prev, inde***REMOVED***, ne***REMOVED***t, step, tableSize.minCellWidth(), tableSize.isRelative);
      const onRight = (prev, inde***REMOVED***) => resize.calcRightEdgeDeltas(result, prev, inde***REMOVED***, step, tableSize.minCellWidth(), tableSize.isRelative);
      return conte***REMOVED***t.fold(onNone, onOnly, onLeft, onMiddle, onRight);
    };

    const total = (start, end, measures) => {
      let r = 0;
      for (let i = start; i < end; i++) {
        r += measures[i] !== undefined ? measures[i] : 0;
      }
      return r;
    };
    const recalculateWidthForCells = (warehouse, widths) => {
      const all = Warehouse.justCells(warehouse);
      return map$1(all, cell => {
        const width = total(cell.column, cell.column + cell.colspan, widths);
        return {
          element: cell.element,
          width,
          colspan: cell.colspan
        };
      });
    };
    const recalculateWidthForColumns = (warehouse, widths) => {
      const groups = Warehouse.justColumns(warehouse);
      return map$1(groups, (column, inde***REMOVED***) => ({
        element: column.element,
        width: widths[inde***REMOVED***],
        colspan: column.colspan
      }));
    };
    const matchRowHeight = (warehouse, heights) => {
      return map$1(warehouse.all, (row, i) => {
        return {
          element: row.element,
          height: heights[i]
        };
      });
    };

    const sumUp = newSize => foldr(newSize, (b, a) => b + a, 0);
    const recalculate = (warehouse, widths) => {
      if (Warehouse.hasColumns(warehouse)) {
        return recalculateWidthForColumns(warehouse, widths);
      } else {
        return recalculateWidthForCells(warehouse, widths);
      }
    };
    const recalculateAndApply = (warehouse, widths, tableSize) => {
      const newSizes = recalculate(warehouse, widths);
      each$2(newSizes, cell => {
        tableSize.setElementWidth(cell.element, cell.width);
      });
    };
    const adjustWidth = (table, delta, inde***REMOVED***, resizing, tableSize) => {
      const warehouse = Warehouse.fromTable(table);
      const step = tableSize.getCellDelta(delta);
      const widths = tableSize.getWidths(warehouse, tableSize);
      const isLastColumn = inde***REMOVED*** === warehouse.grid.columns - 1;
      const clampedStep = resizing.clampTableDelta(widths, inde***REMOVED***, step, tableSize.minCellWidth(), isLastColumn);
      const deltas = determine(widths, inde***REMOVED***, clampedStep, tableSize, resizing);
      const newWidths = map$1(deltas, (d***REMOVED***, i) => d***REMOVED*** + widths[i]);
      recalculateAndApply(warehouse, newWidths, tableSize);
      resizing.resizeTable(tableSize.adjustTableWidth, clampedStep, isLastColumn);
    };
    const adjustHeight = (table, delta, inde***REMOVED***) => {
      const warehouse = Warehouse.fromTable(table);
      const heights = getPi***REMOVED***elHeights(warehouse, table);
      const newHeights = map$1(heights, (dy, i) => inde***REMOVED*** === i ? Math.ma***REMOVED***(delta + dy, minHeight()) : dy);
      const newRowSizes = matchRowHeight(warehouse, newHeights);
      each$2(newRowSizes, row => {
        setHeight(row.element, row.height);
      });
      each$2(Warehouse.justCells(warehouse), cell => {
        removeHeight(cell.element);
      });
      const total = sumUp(newHeights);
      setHeight(table, total);
    };
    const adjustAndRedistributeWidths$1 = (_table, list, details, tableSize, resizeBehaviour) => {
      const warehouse = Warehouse.generate(list);
      const sizes = tableSize.getWidths(warehouse, tableSize);
      const tablePi***REMOVED***elWidth = tableSize.pi***REMOVED***elWidth();
      const {newSizes, delta} = resizeBehaviour.calcRedestributedWidths(sizes, tablePi***REMOVED***elWidth, details.pi***REMOVED***elDelta, tableSize.isRelative);
      recalculateAndApply(warehouse, newSizes, tableSize);
      tableSize.adjustTableWidth(delta);
    };
    const adjustWidthTo = (_table, list, _info, tableSize) => {
      const warehouse = Warehouse.generate(list);
      const widths = tableSize.getWidths(warehouse, tableSize);
      recalculateAndApply(warehouse, widths, tableSize);
    };

    const uniqueColumns = details => {
      const uniqueCheck = (rest, detail) => {
        const columnE***REMOVED***ists = e***REMOVED***ists(rest, currentDetail => currentDetail.column === detail.column);
        return columnE***REMOVED***ists ? rest : rest.concat([detail]);
      };
      return foldl(details, uniqueCheck, []).sort((detailA, detailB) => detailA.column - detailB.column);
    };

    const isCol = isTag('col');
    const isColgroup = isTag('colgroup');
    const isRow$1 = element => name(element) === 'tr' || isColgroup(element);
    const elementToData = element => {
      const colspan = getAttrValue(element, 'colspan', 1);
      const rowspan = getAttrValue(element, 'rowspan', 1);
      return {
        element,
        colspan,
        rowspan
      };
    };
    const modification = (generators, toData = elementToData) => {
      const nuCell = data => isCol(data.element) ? generators.col(data) : generators.cell(data);
      const nuRow = data => isColgroup(data.element) ? generators.colgroup(data) : generators.row(data);
      const add = element => {
        if (isRow$1(element)) {
          return nuRow({ element });
        } else {
          const cell = element;
          const replacement = nuCell(toData(cell));
          recent = Optional.some({
            item: cell,
            replacement
          });
          return replacement;
        }
      };
      let recent = Optional.none();
      const getOrInit = (element, comparator) => {
        return recent.fold(() => {
          return add(element);
        }, p => {
          return comparator(element, p.item) ? p.replacement : add(element);
        });
      };
      return { getOrInit };
    };
    const transform$1 = tag => {
      return generators => {
        const list = [];
        const find = (element, comparator) => {
          return find$1(list, ***REMOVED*** => {
            return comparator(***REMOVED***.item, element);
          });
        };
        const makeNew = element => {
          const attrs = tag === 'td' ? { scope: null } : {};
          const cell = generators.replace(element, tag, attrs);
          list.push({
            item: element,
            sub: cell
          });
          return cell;
        };
        const replaceOrInit = (element, comparator) => {
          if (isRow$1(element) || isCol(element)) {
            return element;
          } else {
            const cell = element;
            return find(cell, comparator).fold(() => {
              return makeNew(cell);
            }, p => {
              return comparator(element, p.item) ? p.sub : makeNew(cell);
            });
          }
        };
        return { replaceOrInit };
      };
    };
    const getScopeAttribute = cell => getOpt(cell, 'scope').map(attribute => attribute.substr(0, 3));
    const merging = generators => {
      const unmerge = cell => {
        const scope = getScopeAttribute(cell);
        scope.each(attribute => set$2(cell, 'scope', attribute));
        return () => {
          const raw = generators.cell({
            element: cell,
            colspan: 1,
            rowspan: 1
          });
          remove$5(raw, 'width');
          remove$5(cell, 'width');
          scope.each(attribute => set$2(raw, 'scope', attribute));
          return raw;
        };
      };
      const merge = cells => {
        const getScopeProperty = () => {
          const stringAttributes = cat(map$1(cells, getScopeAttribute));
          if (stringAttributes.length === 0) {
            return Optional.none();
          } else {
            const baseScope = stringAttributes[0];
            const scopes = [
              'row',
              'col'
            ];
            const isMi***REMOVED***ed = e***REMOVED***ists(stringAttributes, attribute => {
              return attribute !== baseScope && contains$2(scopes, attribute);
            });
            return isMi***REMOVED***ed ? Optional.none() : Optional.from(baseScope);
          }
        };
        remove$5(cells[0], 'width');
        getScopeProperty().fold(() => remove$7(cells[0], 'scope'), attribute => set$2(cells[0], 'scope', attribute + 'group'));
        return constant(cells[0]);
      };
      return {
        unmerge,
        merge
      };
    };
    const Generators = {
      modification,
      transform: transform$1,
      merging
    };

    const blockList = [
      'body',
      'p',
      'div',
      'article',
      'aside',
      'figcaption',
      'figure',
      'footer',
      'header',
      'nav',
      'section',
      'ol',
      'ul',
      'table',
      'thead',
      'tfoot',
      'tbody',
      'caption',
      'tr',
      'td',
      'th',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'pre',
      'address'
    ];
    const isList$1 = (universe, item) => {
      const tagName = universe.property().name(item);
      return contains$2([
        'ol',
        'ul'
      ], tagName);
    };
    const isBlock$1 = (universe, item) => {
      const tagName = universe.property().name(item);
      return contains$2(blockList, tagName);
    };
    const isEmptyTag$1 = (universe, item) => {
      return contains$2([
        'br',
        'img',
        'hr',
        'input'
      ], universe.property().name(item));
    };

    const universe$1 = DomUniverse();
    const isBlock = element => {
      return isBlock$1(universe$1, element);
    };
    const isList = element => {
      return isList$1(universe$1, element);
    };
    const isEmptyTag = element => {
      return isEmptyTag$1(universe$1, element);
    };

    const merge = cells => {
      const isBr = isTag('br');
      const advancedBr = children => {
        return forall(children, c => {
          return isBr(c) || isTe***REMOVED***t(c) && get$6(c).trim().length === 0;
        });
      };
      const isListItem = el => {
        return name(el) === 'li' || ancestor$2(el, isList).isSome();
      };
      const siblingIsBlock = el => {
        return ne***REMOVED***tSibling(el).map(rightSibling => {
          if (isBlock(rightSibling)) {
            return true;
          }
          if (isEmptyTag(rightSibling)) {
            return name(rightSibling) === 'img' ? false : true;
          }
          return false;
        }).getOr(false);
      };
      const markCell = cell => {
        return last$1(cell).bind(rightEdge => {
          const rightSiblingIsBlock = siblingIsBlock(rightEdge);
          return parent(rightEdge).map(parent => {
            return rightSiblingIsBlock === true || isListItem(parent) || isBr(rightEdge) || isBlock(parent) && !eq$1(cell, parent) ? [] : [SugarElement.fromTag('br')];
          });
        }).getOr([]);
      };
      const markContent = () => {
        const content = bind$2(cells, cell => {
          const children = children$2(cell);
          return advancedBr(children) ? [] : children.concat(markCell(cell));
        });
        return content.length === 0 ? [SugarElement.fromTag('br')] : content;
      };
      const contents = markContent();
      empty(cells[0]);
      append(cells[0], contents);
    };

    const isEditable = elem => isEditable$1(elem, true);
    const prune = table => {
      const cells = cells$1(table);
      if (cells.length === 0) {
        remove$6(table);
      }
    };
    const outcome = (grid, cursor) => ({
      grid,
      cursor
    });
    const findEditableCursorPosition = rows => findMap(rows, row => findMap(row.cells, cell => {
      const elem = cell.element;
      return someIf(isEditable(elem), elem);
    }));
    const elementFromGrid = (grid, row, column) => {
      var _a, _b;
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      return Optional.from((_b = (_a = rows[row]) === null || _a === void 0 ? void 0 : _a.cells[column]) === null || _b === void 0 ? void 0 : _b.element).filter(isEditable).orThunk(() => findEditableCursorPosition(rows));
    };
    const bundle = (grid, row, column) => {
      const cursorElement = elementFromGrid(grid, row, column);
      return outcome(grid, cursorElement);
    };
    const uniqueRows = details => {
      const rowCompilation = (rest, detail) => {
        const rowE***REMOVED***ists = e***REMOVED***ists(rest, currentDetail => currentDetail.row === detail.row);
        return rowE***REMOVED***ists ? rest : rest.concat([detail]);
      };
      return foldl(details, rowCompilation, []).sort((detailA, detailB) => detailA.row - detailB.row);
    };
    const opInsertRowsBefore = (grid, details, comparator, genWrappers) => {
      const targetInde***REMOVED*** = details[0].row;
      const rows = uniqueRows(details);
      const newGrid = foldr(rows, (acc, row) => {
        const newG = insertRowAt(acc.grid, targetInde***REMOVED***, row.row + acc.delta, comparator, genWrappers.getOrInit);
        return {
          grid: newG,
          delta: acc.delta + 1
        };
      }, {
        grid,
        delta: 0
      }).grid;
      return bundle(newGrid, targetInde***REMOVED***, details[0].column);
    };
    const opInsertRowsAfter = (grid, details, comparator, genWrappers) => {
      const rows = uniqueRows(details);
      const target = rows[rows.length - 1];
      const targetInde***REMOVED*** = target.row + target.rowspan;
      const newGrid = foldr(rows, (newG, row) => {
        return insertRowAt(newG, targetInde***REMOVED***, row.row, comparator, genWrappers.getOrInit);
      }, grid);
      return bundle(newGrid, targetInde***REMOVED***, details[0].column);
    };
    const opInsertColumnsBefore = (grid, e***REMOVED***tractDetail, comparator, genWrappers) => {
      const details = e***REMOVED***tractDetail.details;
      const columns = uniqueColumns(details);
      const targetInde***REMOVED*** = columns[0].column;
      const newGrid = foldr(columns, (acc, col) => {
        const newG = insertColumnAt(acc.grid, targetInde***REMOVED***, col.column + acc.delta, comparator, genWrappers.getOrInit);
        return {
          grid: newG,
          delta: acc.delta + 1
        };
      }, {
        grid,
        delta: 0
      }).grid;
      return bundle(newGrid, details[0].row, targetInde***REMOVED***);
    };
    const opInsertColumnsAfter = (grid, e***REMOVED***tractDetail, comparator, genWrappers) => {
      const details = e***REMOVED***tractDetail.details;
      const target = details[details.length - 1];
      const targetInde***REMOVED*** = target.column + target.colspan;
      const columns = uniqueColumns(details);
      const newGrid = foldr(columns, (newG, col) => {
        return insertColumnAt(newG, targetInde***REMOVED***, col.column, comparator, genWrappers.getOrInit);
      }, grid);
      return bundle(newGrid, details[0].row, targetInde***REMOVED***);
    };
    const opMakeColumnsHeader = (initialGrid, details, comparator, genWrappers) => {
      const columns = uniqueColumns(details);
      const columnInde***REMOVED***es = map$1(columns, detail => detail.column);
      const newGrid = replaceColumns(initialGrid, columnInde***REMOVED***es, true, comparator, genWrappers.replaceOrInit);
      return bundle(newGrid, details[0].row, details[0].column);
    };
    const opMakeCellsHeader = (initialGrid, details, comparator, genWrappers) => {
      const newGrid = replaceCells(initialGrid, details, comparator, genWrappers.replaceOrInit);
      return bundle(newGrid, details[0].row, details[0].column);
    };
    const opUnmakeColumnsHeader = (initialGrid, details, comparator, genWrappers) => {
      const columns = uniqueColumns(details);
      const columnInde***REMOVED***es = map$1(columns, detail => detail.column);
      const newGrid = replaceColumns(initialGrid, columnInde***REMOVED***es, false, comparator, genWrappers.replaceOrInit);
      return bundle(newGrid, details[0].row, details[0].column);
    };
    const opUnmakeCellsHeader = (initialGrid, details, comparator, genWrappers) => {
      const newGrid = replaceCells(initialGrid, details, comparator, genWrappers.replaceOrInit);
      return bundle(newGrid, details[0].row, details[0].column);
    };
    const makeRowsSection = (section, applyScope) => (initialGrid, details, comparator, genWrappers, tableSection) => {
      const rows = uniqueRows(details);
      const rowInde***REMOVED***es = map$1(rows, detail => detail.row);
      const newGrid = replaceRows(initialGrid, rowInde***REMOVED***es, section, applyScope, comparator, genWrappers.replaceOrInit, tableSection);
      return bundle(newGrid, details[0].row, details[0].column);
    };
    const opMakeRowsHeader = makeRowsSection('thead', true);
    const opMakeRowsBody = makeRowsSection('tbody', false);
    const opMakeRowsFooter = makeRowsSection('tfoot', false);
    const opEraseColumns = (grid, e***REMOVED***tractDetail, _comparator, _genWrappers) => {
      const columns = uniqueColumns(e***REMOVED***tractDetail.details);
      const newGrid = deleteColumnsAt(grid, map$1(columns, column => column.column));
      const ma***REMOVED***ColInde***REMOVED*** = newGrid.length > 0 ? newGrid[0].cells.length - 1 : 0;
      return bundle(newGrid, columns[0].row, Math.min(columns[0].column, ma***REMOVED***ColInde***REMOVED***));
    };
    const opEraseRows = (grid, details, _comparator, _genWrappers) => {
      const rows = uniqueRows(details);
      const newGrid = deleteRowsAt(grid, rows[0].row, rows[rows.length - 1].row);
      const ma***REMOVED***RowInde***REMOVED*** = Math.ma***REMOVED***(e***REMOVED***tractGridDetails(newGrid).rows.length - 1, 0);
      return bundle(newGrid, Math.min(details[0].row, ma***REMOVED***RowInde***REMOVED***), details[0].column);
    };
    const opMergeCells = (grid, mergable, comparator, genWrappers) => {
      const cells = mergable.cells;
      merge(cells);
      const newGrid = merge$2(grid, mergable.bounds, comparator, genWrappers.merge(cells));
      return outcome(newGrid, Optional.from(cells[0]));
    };
    const opUnmergeCells = (grid, unmergable, comparator, genWrappers) => {
      const unmerge$1 = (b, cell) => unmerge(b, cell, comparator, genWrappers.unmerge(cell));
      const newGrid = foldr(unmergable, unmerge$1, grid);
      return outcome(newGrid, Optional.from(unmergable[0]));
    };
    const opPasteCells = (grid, pasteDetails, comparator, _genWrappers) => {
      const gridify = (table, generators) => {
        const wh = Warehouse.fromTable(table);
        return toGrid(wh, generators, true);
      };
      const gridB = gridify(pasteDetails.clipboard, pasteDetails.generators);
      const startAddress = address(pasteDetails.row, pasteDetails.column);
      const mergedGrid = merge$1(startAddress, grid, gridB, pasteDetails.generators, comparator);
      return mergedGrid.fold(() => outcome(grid, Optional.some(pasteDetails.element)), newGrid => {
        return bundle(newGrid, pasteDetails.row, pasteDetails.column);
      });
    };
    const gridifyRows = (rows, generators, conte***REMOVED***t) => {
      const pasteDetails = fromPastedRows(rows, conte***REMOVED***t.section);
      const wh = Warehouse.generate(pasteDetails);
      return toGrid(wh, generators, true);
    };
    const opPasteColsBefore = (grid, pasteDetails, comparator, _genWrappers) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      const inde***REMOVED*** = pasteDetails.cells[0].column;
      const conte***REMOVED***t = rows[pasteDetails.cells[0].row];
      const gridB = gridifyRows(pasteDetails.clipboard, pasteDetails.generators, conte***REMOVED***t);
      const mergedGrid = insertCols(inde***REMOVED***, grid, gridB, pasteDetails.generators, comparator);
      return bundle(mergedGrid, pasteDetails.cells[0].row, pasteDetails.cells[0].column);
    };
    const opPasteColsAfter = (grid, pasteDetails, comparator, _genWrappers) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      const inde***REMOVED*** = pasteDetails.cells[pasteDetails.cells.length - 1].column + pasteDetails.cells[pasteDetails.cells.length - 1].colspan;
      const conte***REMOVED***t = rows[pasteDetails.cells[0].row];
      const gridB = gridifyRows(pasteDetails.clipboard, pasteDetails.generators, conte***REMOVED***t);
      const mergedGrid = insertCols(inde***REMOVED***, grid, gridB, pasteDetails.generators, comparator);
      return bundle(mergedGrid, pasteDetails.cells[0].row, inde***REMOVED***);
    };
    const opPasteRowsBefore = (grid, pasteDetails, comparator, _genWrappers) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      const inde***REMOVED*** = pasteDetails.cells[0].row;
      const conte***REMOVED***t = rows[inde***REMOVED***];
      const gridB = gridifyRows(pasteDetails.clipboard, pasteDetails.generators, conte***REMOVED***t);
      const mergedGrid = insertRows(inde***REMOVED***, grid, gridB, pasteDetails.generators, comparator);
      return bundle(mergedGrid, pasteDetails.cells[0].row, pasteDetails.cells[0].column);
    };
    const opPasteRowsAfter = (grid, pasteDetails, comparator, _genWrappers) => {
      const rows = e***REMOVED***tractGridDetails(grid).rows;
      const inde***REMOVED*** = pasteDetails.cells[pasteDetails.cells.length - 1].row + pasteDetails.cells[pasteDetails.cells.length - 1].rowspan;
      const conte***REMOVED***t = rows[pasteDetails.cells[0].row];
      const gridB = gridifyRows(pasteDetails.clipboard, pasteDetails.generators, conte***REMOVED***t);
      const mergedGrid = insertRows(inde***REMOVED***, grid, gridB, pasteDetails.generators, comparator);
      return bundle(mergedGrid, inde***REMOVED***, pasteDetails.cells[0].column);
    };
    const opGetColumnsType = (table, target) => {
      const house = Warehouse.fromTable(table);
      const details = onCells(house, target);
      return details.bind(selectedCells => {
        const lastSelectedCell = selectedCells[selectedCells.length - 1];
        const minColRange = selectedCells[0].column;
        const ma***REMOVED***ColRange = lastSelectedCell.column + lastSelectedCell.colspan;
        const selectedColumnCells = flatten(map$1(house.all, row => filter$2(row.cells, cell => cell.column >= minColRange && cell.column < ma***REMOVED***ColRange)));
        return findCommonCellType(selectedColumnCells);
      }).getOr('');
    };
    const opGetCellsType = (table, target) => {
      const house = Warehouse.fromTable(table);
      const details = onCells(house, target);
      return details.bind(findCommonCellType).getOr('');
    };
    const opGetRowsType = (table, target) => {
      const house = Warehouse.fromTable(table);
      const details = onCells(house, target);
      return details.bind(selectedCells => {
        const lastSelectedCell = selectedCells[selectedCells.length - 1];
        const minRowRange = selectedCells[0].row;
        const ma***REMOVED***RowRange = lastSelectedCell.row + lastSelectedCell.rowspan;
        const selectedRows = house.all.slice(minRowRange, ma***REMOVED***RowRange);
        return findCommonRowType(selectedRows);
      }).getOr('');
    };
    const resize = (table, list, details, behaviours) => adjustWidthTo(table, list, details, behaviours.sizing);
    const adjustAndRedistributeWidths = (table, list, details, behaviours) => adjustAndRedistributeWidths$1(table, list, details, behaviours.sizing, behaviours.resize);
    const firstColumnIsLocked = (_warehouse, details) => e***REMOVED***ists(details, detail => detail.column === 0 && detail.isLocked);
    const lastColumnIsLocked = (warehouse, details) => e***REMOVED***ists(details, detail => detail.column + detail.colspan >= warehouse.grid.columns && detail.isLocked);
    const getColumnsWidth = (warehouse, details) => {
      const columns$1 = columns(warehouse);
      const uniqueCols = uniqueColumns(details);
      return foldl(uniqueCols, (acc, detail) => {
        const column = columns$1[detail.column];
        const colWidth = column.map(getOuter$2).getOr(0);
        return acc + colWidth;
      }, 0);
    };
    const insertColumnsE***REMOVED***tractor = before => (warehouse, target) => onCells(warehouse, target).filter(details => {
      const checkLocked = before ? firstColumnIsLocked : lastColumnIsLocked;
      return !checkLocked(warehouse, details);
    }).map(details => ({
      details,
      pi***REMOVED***elDelta: getColumnsWidth(warehouse, details)
    }));
    const eraseColumnsE***REMOVED***tractor = (warehouse, target) => onUnlockedCells(warehouse, target).map(details => ({
      details,
      pi***REMOVED***elDelta: -getColumnsWidth(warehouse, details)
    }));
    const pasteColumnsE***REMOVED***tractor = before => (warehouse, target) => onPasteByEditor(warehouse, target).filter(details => {
      const checkLocked = before ? firstColumnIsLocked : lastColumnIsLocked;
      return !checkLocked(warehouse, details.cells);
    });
    const headerCellGenerator = Generators.transform('th');
    const bodyCellGenerator = Generators.transform('td');
    const insertRowsBefore = run(opInsertRowsBefore, onCells, noop, noop, Generators.modification);
    const insertRowsAfter = run(opInsertRowsAfter, onCells, noop, noop, Generators.modification);
    const insertColumnsBefore = run(opInsertColumnsBefore, insertColumnsE***REMOVED***tractor(true), adjustAndRedistributeWidths, noop, Generators.modification);
    const insertColumnsAfter = run(opInsertColumnsAfter, insertColumnsE***REMOVED***tractor(false), adjustAndRedistributeWidths, noop, Generators.modification);
    const eraseColumns = run(opEraseColumns, eraseColumnsE***REMOVED***tractor, adjustAndRedistributeWidths, prune, Generators.modification);
    const eraseRows = run(opEraseRows, onCells, noop, prune, Generators.modification);
    const makeColumnsHeader = run(opMakeColumnsHeader, onUnlockedCells, noop, noop, headerCellGenerator);
    const unmakeColumnsHeader = run(opUnmakeColumnsHeader, onUnlockedCells, noop, noop, bodyCellGenerator);
    const makeRowsHeader = run(opMakeRowsHeader, onUnlockedCells, noop, noop, headerCellGenerator);
    const makeRowsBody = run(opMakeRowsBody, onUnlockedCells, noop, noop, bodyCellGenerator);
    const makeRowsFooter = run(opMakeRowsFooter, onUnlockedCells, noop, noop, bodyCellGenerator);
    const makeCellsHeader = run(opMakeCellsHeader, onUnlockedCells, noop, noop, headerCellGenerator);
    const unmakeCellsHeader = run(opUnmakeCellsHeader, onUnlockedCells, noop, noop, bodyCellGenerator);
    const mergeCells = run(opMergeCells, onUnlockedMergable, resize, noop, Generators.merging);
    const unmergeCells = run(opUnmergeCells, onUnlockedUnmergable, resize, noop, Generators.merging);
    const pasteCells = run(opPasteCells, onPaste, resize, noop, Generators.modification);
    const pasteColsBefore = run(opPasteColsBefore, pasteColumnsE***REMOVED***tractor(true), noop, noop, Generators.modification);
    const pasteColsAfter = run(opPasteColsAfter, pasteColumnsE***REMOVED***tractor(false), noop, noop, Generators.modification);
    const pasteRowsBefore = run(opPasteRowsBefore, onPasteByEditor, noop, noop, Generators.modification);
    const pasteRowsAfter = run(opPasteRowsAfter, onPasteByEditor, noop, noop, Generators.modification);
    const getColumnsType = opGetColumnsType;
    const getCellsType = opGetCellsType;
    const getRowsType = opGetRowsType;

    const fireNewRow = (editor, row) => editor.dispatch('NewRow', { node: row });
    const fireNewCell = (editor, cell) => editor.dispatch('NewCell', { node: cell });
    const fireTableModified = (editor, table, data) => {
      editor.dispatch('TableModified', {
        ...data,
        table
      });
    };
    const fireTableSelectionChange = (editor, cells, start, finish, otherCells) => {
      editor.dispatch('TableSelectionChange', {
        cells,
        start,
        finish,
        otherCells
      });
    };
    const fireTableSelectionClear = editor => {
      editor.dispatch('TableSelectionClear');
    };
    const fireObjectResizeStart = (editor, target, width, height, origin) => {
      editor.dispatch('ObjectResizeStart', {
        target,
        width,
        height,
        origin
      });
    };
    const fireObjectResized = (editor, target, width, height, origin) => {
      editor.dispatch('ObjectResized', {
        target,
        width,
        height,
        origin
      });
    };
    const styleModified = {
      structure: false,
      style: true
    };
    const structureModified = {
      structure: true,
      style: false
    };
    const styleAndStructureModified = {
      structure: true,
      style: true
    };

    const get$5 = (editor, table) => {
      if (isTablePercentagesForced(editor)) {
        return TableSize.percentageSize(table);
      } else if (isTablePi***REMOVED***elsForced(editor)) {
        return TableSize.pi***REMOVED***elSize(table);
      } else {
        return TableSize.getTableSize(table);
      }
    };

    const TableActions = (editor, resizeHandler, cellSelectionHandler) => {
      const isTableBody = editor => name(getBody(editor)) === 'table';
      const lastRowGuard = table => !isTableBody(editor) || getGridSize(table).rows > 1;
      const lastColumnGuard = table => !isTableBody(editor) || getGridSize(table).columns > 1;
      const cloneFormats = getTableCloneElements(editor);
      const colMutationOp = isResizeTableColumnResizing(editor) ? noop : halve;
      const getTableSectionType = table => {
        switch (getTableHeaderType(editor)) {
        case 'section':
          return TableSection.section();
        case 'sectionCells':
          return TableSection.sectionCells();
        case 'cells':
          return TableSection.cells();
        default:
          return TableSection.getTableSectionType(table, 'section');
        }
      };
      const setSelectionFromAction = (table, result) => result.cursor.fold(() => {
        const cells = cells$1(table);
        return head(cells).filter(inBody).map(firstCell => {
          cellSelectionHandler.clearSelectedCells(table.dom);
          const rng = editor.dom.createRng();
          rng.selectNode(firstCell.dom);
          editor.selection.setRng(rng);
          set$2(firstCell, 'data-mce-selected', '1');
          return rng;
        });
      }, cell => {
        const des = freefallRtl(cell);
        const rng = editor.dom.createRng();
        rng.setStart(des.element.dom, des.offset);
        rng.setEnd(des.element.dom, des.offset);
        editor.selection.setRng(rng);
        cellSelectionHandler.clearSelectedCells(table.dom);
        return Optional.some(rng);
      });
      const e***REMOVED***ecute = (operation, guard, mutate, effect) => (table, target, noEvents = false) => {
        removeDataStyle(table);
        const doc = SugarElement.fromDom(editor.getDoc());
        const generators = cellOperations(mutate, doc, cloneFormats);
        const behaviours = {
          sizing: get$5(editor, table),
          resize: isResizeTableColumnResizing(editor) ? resizeTable() : preserveTable(),
          section: getTableSectionType(table)
        };
        return guard(table) ? operation(table, target, generators, behaviours).bind(result => {
          resizeHandler.refresh(table.dom);
          each$2(result.newRows, row => {
            fireNewRow(editor, row.dom);
          });
          each$2(result.newCells, cell => {
            fireNewCell(editor, cell.dom);
          });
          const range = setSelectionFromAction(table, result);
          if (inBody(table)) {
            removeDataStyle(table);
            if (!noEvents) {
              fireTableModified(editor, table.dom, effect);
            }
          }
          return range.map(rng => ({
            rng,
            effect
          }));
        }) : Optional.none();
      };
      const deleteRow = e***REMOVED***ecute(eraseRows, lastRowGuard, noop, structureModified);
      const deleteColumn = e***REMOVED***ecute(eraseColumns, lastColumnGuard, noop, structureModified);
      const insertRowsBefore$1 = e***REMOVED***ecute(insertRowsBefore, always, noop, structureModified);
      const insertRowsAfter$1 = e***REMOVED***ecute(insertRowsAfter, always, noop, structureModified);
      const insertColumnsBefore$1 = e***REMOVED***ecute(insertColumnsBefore, always, colMutationOp, structureModified);
      const insertColumnsAfter$1 = e***REMOVED***ecute(insertColumnsAfter, always, colMutationOp, structureModified);
      const mergeCells$1 = e***REMOVED***ecute(mergeCells, always, noop, structureModified);
      const unmergeCells$1 = e***REMOVED***ecute(unmergeCells, always, noop, structureModified);
      const pasteColsBefore$1 = e***REMOVED***ecute(pasteColsBefore, always, noop, structureModified);
      const pasteColsAfter$1 = e***REMOVED***ecute(pasteColsAfter, always, noop, structureModified);
      const pasteRowsBefore$1 = e***REMOVED***ecute(pasteRowsBefore, always, noop, structureModified);
      const pasteRowsAfter$1 = e***REMOVED***ecute(pasteRowsAfter, always, noop, structureModified);
      const pasteCells$1 = e***REMOVED***ecute(pasteCells, always, noop, styleAndStructureModified);
      const makeCellsHeader$1 = e***REMOVED***ecute(makeCellsHeader, always, noop, structureModified);
      const unmakeCellsHeader$1 = e***REMOVED***ecute(unmakeCellsHeader, always, noop, structureModified);
      const makeColumnsHeader$1 = e***REMOVED***ecute(makeColumnsHeader, always, noop, structureModified);
      const unmakeColumnsHeader$1 = e***REMOVED***ecute(unmakeColumnsHeader, always, noop, structureModified);
      const makeRowsHeader$1 = e***REMOVED***ecute(makeRowsHeader, always, noop, structureModified);
      const makeRowsBody$1 = e***REMOVED***ecute(makeRowsBody, always, noop, structureModified);
      const makeRowsFooter$1 = e***REMOVED***ecute(makeRowsFooter, always, noop, structureModified);
      const getTableCellType = getCellsType;
      const getTableColType = getColumnsType;
      const getTableRowType = getRowsType;
      return {
        deleteRow,
        deleteColumn,
        insertRowsBefore: insertRowsBefore$1,
        insertRowsAfter: insertRowsAfter$1,
        insertColumnsBefore: insertColumnsBefore$1,
        insertColumnsAfter: insertColumnsAfter$1,
        mergeCells: mergeCells$1,
        unmergeCells: unmergeCells$1,
        pasteColsBefore: pasteColsBefore$1,
        pasteColsAfter: pasteColsAfter$1,
        pasteRowsBefore: pasteRowsBefore$1,
        pasteRowsAfter: pasteRowsAfter$1,
        pasteCells: pasteCells$1,
        makeCellsHeader: makeCellsHeader$1,
        unmakeCellsHeader: unmakeCellsHeader$1,
        makeColumnsHeader: makeColumnsHeader$1,
        unmakeColumnsHeader: unmakeColumnsHeader$1,
        makeRowsHeader: makeRowsHeader$1,
        makeRowsBody: makeRowsBody$1,
        makeRowsFooter: makeRowsFooter$1,
        getTableRowType,
        getTableCellType,
        getTableColType
      };
    };

    const constrainSpan = (element, property, value) => {
      const currentColspan = getAttrValue(element, property, 1);
      if (value === 1 || currentColspan <= 1) {
        remove$7(element, property);
      } else {
        set$2(element, property, Math.min(value, currentColspan));
      }
    };
    const isColInRange = (minColRange, ma***REMOVED***ColRange) => cell => {
      const endCol = cell.column + cell.colspan - 1;
      const startCol = cell.column;
      return endCol >= minColRange && startCol < ma***REMOVED***ColRange;
    };
    const generateColGroup = (house, minColRange, ma***REMOVED***ColRange) => {
      if (Warehouse.hasColumns(house)) {
        const colsToCopy = filter$2(Warehouse.justColumns(house), isColInRange(minColRange, ma***REMOVED***ColRange));
        const copiedCols = map$1(colsToCopy, c => {
          const clonedCol = deep(c.element);
          constrainSpan(clonedCol, 'span', ma***REMOVED***ColRange - minColRange);
          return clonedCol;
        });
        const fakeColgroup = SugarElement.fromTag('colgroup');
        append(fakeColgroup, copiedCols);
        return [fakeColgroup];
      } else {
        return [];
      }
    };
    const generateRows = (house, minColRange, ma***REMOVED***ColRange) => map$1(house.all, row => {
      const cellsToCopy = filter$2(row.cells, isColInRange(minColRange, ma***REMOVED***ColRange));
      const copiedCells = map$1(cellsToCopy, cell => {
        const clonedCell = deep(cell.element);
        constrainSpan(clonedCell, 'colspan', ma***REMOVED***ColRange - minColRange);
        return clonedCell;
      });
      const fakeTR = SugarElement.fromTag('tr');
      append(fakeTR, copiedCells);
      return fakeTR;
    });
    const copyCols = (table, target) => {
      const house = Warehouse.fromTable(table);
      const details = onUnlockedCells(house, target);
      return details.map(selectedCells => {
        const lastSelectedCell = selectedCells[selectedCells.length - 1];
        const minColRange = selectedCells[0].column;
        const ma***REMOVED***ColRange = lastSelectedCell.column + lastSelectedCell.colspan;
        const fakeColGroups = generateColGroup(house, minColRange, ma***REMOVED***ColRange);
        const fakeRows = generateRows(house, minColRange, ma***REMOVED***ColRange);
        return [
          ...fakeColGroups,
          ...fakeRows
        ];
      });
    };

    const copyRows = (table, target, generators) => {
      const warehouse = Warehouse.fromTable(table);
      const details = onCells(warehouse, target);
      return details.bind(selectedCells => {
        const grid = toGrid(warehouse, generators, false);
        const rows = e***REMOVED***tractGridDetails(grid).rows;
        const slicedGrid = rows.slice(selectedCells[0].row, selectedCells[selectedCells.length - 1].row + selectedCells[selectedCells.length - 1].rowspan);
        const filteredGrid = bind$2(slicedGrid, row => {
          const newCells = filter$2(row.cells, cell => !cell.isLocked);
          return newCells.length > 0 ? [{
              ...row,
              cells: newCells
            }] : [];
        });
        const slicedDetails = toDetailList(filteredGrid);
        return someIf(slicedDetails.length > 0, slicedDetails);
      }).map(slicedDetails => copy(slicedDetails));
    };

    const adt$5 = Adt.generate([
      { invalid: ['raw'] },
      { pi***REMOVED***els: ['value'] },
      { percent: ['value'] }
    ]);
    const validateFor = (suffi***REMOVED***, type, value) => {
      const rawAmount = value.substring(0, value.length - suffi***REMOVED***.length);
      const amount = parseFloat(rawAmount);
      return rawAmount === amount.toString() ? type(amount) : adt$5.invalid(value);
    };
    const from = value => {
      if (endsWith(value, '%')) {
        return validateFor('%', adt$5.percent, value);
      }
      if (endsWith(value, 'p***REMOVED***')) {
        return validateFor('p***REMOVED***', adt$5.pi***REMOVED***els, value);
      }
      return adt$5.invalid(value);
    };
    const Size = {
      ...adt$5,
      from
    };

    const redistributeToPercent = (widths, totalWidth) => {
      return map$1(widths, w => {
        const colType = Size.from(w);
        return colType.fold(() => {
          return w;
        }, p***REMOVED*** => {
          const ratio = p***REMOVED*** / totalWidth * 100;
          return ratio + '%';
        }, pc => {
          return pc + '%';
        });
      });
    };
    const redistributeToP***REMOVED*** = (widths, totalWidth, newTotalWidth) => {
      const scale = newTotalWidth / totalWidth;
      return map$1(widths, w => {
        const colType = Size.from(w);
        return colType.fold(() => {
          return w;
        }, p***REMOVED*** => {
          return p***REMOVED*** * scale + 'p***REMOVED***';
        }, pc => {
          return pc / 100 * newTotalWidth + 'p***REMOVED***';
        });
      });
    };
    const redistributeEmpty = (newWidthType, columns) => {
      const f = newWidthType.fold(() => constant(''), pi***REMOVED***els => {
        const num = pi***REMOVED***els / columns;
        return constant(num + 'p***REMOVED***');
      }, () => {
        const num = 100 / columns;
        return constant(num + '%');
      });
      return range$1(columns, f);
    };
    const redistributeValues = (newWidthType, widths, totalWidth) => {
      return newWidthType.fold(() => {
        return widths;
      }, p***REMOVED*** => {
        return redistributeToP***REMOVED***(widths, totalWidth, p***REMOVED***);
      }, _pc => {
        return redistributeToPercent(widths, totalWidth);
      });
    };
    const redistribute$1 = (widths, totalWidth, newWidth) => {
      const newType = Size.from(newWidth);
      const floats = forall(widths, s => {
        return s === '0p***REMOVED***';
      }) ? redistributeEmpty(newType, widths.length) : redistributeValues(newType, widths, totalWidth);
      return normalize(floats);
    };
    const sum = (values, fallback) => {
      if (values.length === 0) {
        return fallback;
      }
      return foldr(values, (rest, v) => {
        return Size.from(v).fold(constant(0), identity, identity) + rest;
      }, 0);
    };
    const roundDown = (num, unit) => {
      const floored = Math.floor(num);
      return {
        value: floored + unit,
        remainder: num - floored
      };
    };
    const add$3 = (value, amount) => {
      return Size.from(value).fold(constant(value), p***REMOVED*** => {
        return p***REMOVED*** + amount + 'p***REMOVED***';
      }, pc => {
        return pc + amount + '%';
      });
    };
    const normalize = values => {
      if (values.length === 0) {
        return values;
      }
      const scan = foldr(values, (rest, value) => {
        const info = Size.from(value).fold(() => ({
          value,
          remainder: 0
        }), num => roundDown(num, 'p***REMOVED***'), num => ({
          value: num + '%',
          remainder: 0
        }));
        return {
          output: [info.value].concat(rest.output),
          remainder: rest.remainder + info.remainder
        };
      }, {
        output: [],
        remainder: 0
      });
      const r = scan.output;
      return r.slice(0, r.length - 1).concat([add$3(r[r.length - 1], Math.round(scan.remainder))]);
    };
    const validate = Size.from;

    const redistributeToW = (newWidths, cells, unit) => {
      each$2(cells, cell => {
        const widths = newWidths.slice(cell.column, cell.colspan + cell.column);
        const w = sum(widths, minWidth());
        set$1(cell.element, 'width', w + unit);
      });
    };
    const redistributeToColumns = (newWidths, columns, unit) => {
      each$2(columns, (column, inde***REMOVED***) => {
        const width = sum([newWidths[inde***REMOVED***]], minWidth());
        set$1(column.element, 'width', width + unit);
      });
    };
    const redistributeToH = (newHeights, rows, cells) => {
      each$2(cells, cell => {
        remove$5(cell.element, 'height');
      });
      each$2(rows, (row, i) => {
        set$1(row.element, 'height', newHeights[i]);
      });
    };
    const getUnit = newSize => {
      return validate(newSize).fold(constant('p***REMOVED***'), constant('p***REMOVED***'), constant('%'));
    };
    const redistribute = (table, optWidth, optHeight) => {
      const warehouse = Warehouse.fromTable(table);
      const rows = warehouse.all;
      const cells = Warehouse.justCells(warehouse);
      const columns = Warehouse.justColumns(warehouse);
      optWidth.each(newWidth => {
        const widthUnit = getUnit(newWidth);
        const totalWidth = get$9(table);
        const oldWidths = getRawWidths(warehouse, table);
        const nuWidths = redistribute$1(oldWidths, totalWidth, newWidth);
        if (Warehouse.hasColumns(warehouse)) {
          redistributeToColumns(nuWidths, columns, widthUnit);
        } else {
          redistributeToW(nuWidths, cells, widthUnit);
        }
        set$1(table, 'width', newWidth);
      });
      optHeight.each(newHeight => {
        const totalHeight = get$8(table);
        const oldHeights = getRawHeights(warehouse, table);
        const nuHeights = redistribute$1(oldHeights, totalHeight, newHeight);
        redistributeToH(nuHeights, rows, cells);
        set$1(table, 'height', newHeight);
      });
    };
    const isPercentSizing = isPercentSizing$1;
    const isPi***REMOVED***elSizing = isPi***REMOVED***elSizing$1;
    const isNoneSizing = isNoneSizing$1;

    const cleanupLegacyAttributes = element => {
      remove$7(element, 'width');
      remove$7(element, 'height');
    };
    const convertToPercentSizeWidth = table => {
      const newWidth = getPercentTableWidth(table);
      redistribute(table, Optional.some(newWidth), Optional.none());
      cleanupLegacyAttributes(table);
    };
    const convertToPi***REMOVED***elSizeWidth = table => {
      const newWidth = getPi***REMOVED***elTableWidth(table);
      redistribute(table, Optional.some(newWidth), Optional.none());
      cleanupLegacyAttributes(table);
    };
    const convertToPi***REMOVED***elSizeHeight = table => {
      const newHeight = getPi***REMOVED***elTableHeight(table);
      redistribute(table, Optional.none(), Optional.some(newHeight));
      cleanupLegacyAttributes(table);
    };
    const convertToNoneSizeWidth = table => {
      remove$5(table, 'width');
      const columns = columns$1(table);
      const rowElements = columns.length > 0 ? columns : cells$1(table);
      each$2(rowElements, cell => {
        remove$5(cell, 'width');
        cleanupLegacyAttributes(cell);
      });
      cleanupLegacyAttributes(table);
    };

    const DefaultRenderOptions = {
      styles: {
        'border-collapse': 'collapse',
        'width': '100%'
      },
      attributes: { border: '1' },
      colGroups: false
    };
    const tableHeaderCell = () => SugarElement.fromTag('th');
    const tableCell = () => SugarElement.fromTag('td');
    const tableColumn = () => SugarElement.fromTag('col');
    const createRow = (columns, rowHeaders, columnHeaders, rowInde***REMOVED***) => {
      const tr = SugarElement.fromTag('tr');
      for (let j = 0; j < columns; j++) {
        const td = rowInde***REMOVED*** < rowHeaders || j < columnHeaders ? tableHeaderCell() : tableCell();
        if (j < columnHeaders) {
          set$2(td, 'scope', 'row');
        }
        if (rowInde***REMOVED*** < rowHeaders) {
          set$2(td, 'scope', 'col');
        }
        append$1(td, SugarElement.fromTag('br'));
        append$1(tr, td);
      }
      return tr;
    };
    const createGroupRow = columns => {
      const columnGroup = SugarElement.fromTag('colgroup');
      range$1(columns, () => append$1(columnGroup, tableColumn()));
      return columnGroup;
    };
    const createRows = (rows, columns, rowHeaders, columnHeaders) => range$1(rows, r => createRow(columns, rowHeaders, columnHeaders, r));
    const render = (rows, columns, rowHeaders, columnHeaders, headerType, renderOpts = DefaultRenderOptions) => {
      const table = SugarElement.fromTag('table');
      const rowHeadersGoInThead = headerType !== 'cells';
      setAll(table, renderOpts.styles);
      setAll$1(table, renderOpts.attributes);
      if (renderOpts.colGroups) {
        append$1(table, createGroupRow(columns));
      }
      const actualRowHeaders = Math.min(rows, rowHeaders);
      if (rowHeadersGoInThead && rowHeaders > 0) {
        const thead = SugarElement.fromTag('thead');
        append$1(table, thead);
        const theadRowHeaders = headerType === 'sectionCells' ? actualRowHeaders : 0;
        const theadRows = createRows(rowHeaders, columns, theadRowHeaders, columnHeaders);
        append(thead, theadRows);
      }
      const tbody = SugarElement.fromTag('tbody');
      append$1(table, tbody);
      const numRows = rowHeadersGoInThead ? rows - actualRowHeaders : rows;
      const numRowHeaders = rowHeadersGoInThead ? 0 : rowHeaders;
      const tbodyRows = createRows(numRows, columns, numRowHeaders, columnHeaders);
      append(tbody, tbodyRows);
      return table;
    };

    const get$4 = element => element.dom.innerHTML;
    const getOuter = element => {
      const container = SugarElement.fromTag('div');
      const clone = SugarElement.fromDom(element.dom.cloneNode(true));
      append$1(container, clone);
      return get$4(container);
    };

    const placeCaretInCell = (editor, cell) => {
      editor.selection.select(cell.dom, true);
      editor.selection.collapse(true);
    };
    const selectFirstCellInTable = (editor, tableElm) => {
      descendant(tableElm, 'td,th').each(curry(placeCaretInCell, editor));
    };
    const fireEvents = (editor, table) => {
      each$2(descendants(table, 'tr'), row => {
        fireNewRow(editor, row.dom);
        each$2(descendants(row, 'th,td'), cell => {
          fireNewCell(editor, cell.dom);
        });
      });
    };
    const isPercentage = width => isString(width) && width.inde***REMOVED***Of('%') !== -1;
    const insert = (editor, columns, rows, colHeaders, rowHeaders) => {
      const defaultStyles = getTableDefaultStyles(editor);
      const options = {
        styles: defaultStyles,
        attributes: getTableDefaultAttributes(editor),
        colGroups: tableUseColumnGroup(editor)
      };
      editor.undoManager.ignore(() => {
        const table = render(rows, columns, rowHeaders, colHeaders, getTableHeaderType(editor), options);
        set$2(table, 'data-mce-id', '__mce');
        const html = getOuter(table);
        editor.insertContent(html);
        editor.addVisual();
      });
      return descendant(getBody(editor), 'table[data-mce-id="__mce"]').map(table => {
        if (isTablePi***REMOVED***elsForced(editor)) {
          convertToPi***REMOVED***elSizeWidth(table);
        } else if (isTableResponsiveForced(editor)) {
          convertToNoneSizeWidth(table);
        } else if (isTablePercentagesForced(editor) || isPercentage(defaultStyles.width)) {
          convertToPercentSizeWidth(table);
        }
        removeDataStyle(table);
        remove$7(table, 'data-mce-id');
        fireEvents(editor, table);
        selectFirstCellInTable(editor, table);
        return table.dom;
      }).getOrNull();
    };
    const insertTable = (editor, rows, columns, options = {}) => {
      const checkInput = val => isNumber(val) && val > 0;
      if (checkInput(rows) && checkInput(columns)) {
        const headerRows = options.headerRows || 0;
        const headerColumns = options.headerColumns || 0;
        return insert(editor, columns, rows, headerColumns, headerRows);
      } else {
        console.error('Invalid values for mceInsertTable - rows and columns values are required to insert a table.');
        return null;
      }
    };

    var global = tinymce.util.Tools.resolve('tinymce.FakeClipboard');

    const tableTypeBase = '***REMOVED***-tinymce/dom-table-';
    const tableTypeRow = tableTypeBase + 'rows';
    const tableTypeColumn = tableTypeBase + 'columns';
    const setData = items => {
      const fakeClipboardItem = global.FakeClipboardItem(items);
      global.write([fakeClipboardItem]);
    };
    const getData = type => {
      var _a;
      const items = (_a = global.read()) !== null && _a !== void 0 ? _a : [];
      return findMap(items, item => Optional.from(item.getType(type)));
    };
    const clearData = type => {
      if (getData(type).isSome()) {
        global.clear();
      }
    };
    const setRows = rowsOpt => {
      rowsOpt.fold(clearRows, rows => setData({ [tableTypeRow]: rows }));
    };
    const getRows = () => getData(tableTypeRow);
    const clearRows = () => clearData(tableTypeRow);
    const setColumns = columnsOpt => {
      columnsOpt.fold(clearColumns, columns => setData({ [tableTypeColumn]: columns }));
    };
    const getColumns = () => getData(tableTypeColumn);
    const clearColumns = () => clearData(tableTypeColumn);

    const getSelectionStartCellOrCaption = editor => getSelectionCellOrCaption(getSelectionStart(editor), getIsRoot(editor)).filter(isInEditableConte***REMOVED***t$1);
    const getSelectionStartCell = editor => getSelectionCell(getSelectionStart(editor), getIsRoot(editor)).filter(isInEditableConte***REMOVED***t$1);
    const registerCommands = (editor, actions) => {
      const isRoot = getIsRoot(editor);
      const eraseTable = () => getSelectionStartCellOrCaption(editor).each(cellOrCaption => {
        table(cellOrCaption, isRoot).filter(not(isRoot)).each(table => {
          const cursor = SugarElement.fromTe***REMOVED***t('');
          after$5(table, cursor);
          remove$6(table);
          if (editor.dom.isEmpty(editor.getBody())) {
            editor.setContent('');
            editor.selection.setCursorLocation();
          } else {
            const rng = editor.dom.createRng();
            rng.setStart(cursor.dom, 0);
            rng.setEnd(cursor.dom, 0);
            editor.selection.setRng(rng);
            editor.nodeChanged();
          }
        });
      });
      const setSizingMode = sizing => getSelectionStartCellOrCaption(editor).each(cellOrCaption => {
        const isForcedSizing = isTableResponsiveForced(editor) || isTablePi***REMOVED***elsForced(editor) || isTablePercentagesForced(editor);
        if (!isForcedSizing) {
          table(cellOrCaption, isRoot).each(table => {
            if (sizing === 'relative' && !isPercentSizing(table)) {
              convertToPercentSizeWidth(table);
            } else if (sizing === 'fi***REMOVED***ed' && !isPi***REMOVED***elSizing(table)) {
              convertToPi***REMOVED***elSizeWidth(table);
            } else if (sizing === 'responsive' && !isNoneSizing(table)) {
              convertToNoneSizeWidth(table);
            }
            removeDataStyle(table);
            fireTableModified(editor, table.dom, structureModified);
          });
        }
      });
      const getTableFromCell = cell => table(cell, isRoot);
      const performActionOnSelection = action => getSelectionStartCell(editor).bind(cell => getTableFromCell(cell).map(table => action(table, cell)));
      const toggleTableClass = (_ui, clazz) => {
        performActionOnSelection(table => {
          editor.formatter.toggle('tableclass', { value: clazz }, table.dom);
          fireTableModified(editor, table.dom, styleModified);
        });
      };
      const toggleTableCellClass = (_ui, clazz) => {
        performActionOnSelection(table => {
          const selectedCells = getCellsFromSelection(editor);
          const allHaveClass = forall(selectedCells, cell => editor.formatter.match('tablecellclass', { value: clazz }, cell.dom));
          const formatterAction = allHaveClass ? editor.formatter.remove : editor.formatter.apply;
          each$2(selectedCells, cell => formatterAction('tablecellclass', { value: clazz }, cell.dom));
          fireTableModified(editor, table.dom, styleModified);
        });
      };
      const toggleCaption = () => {
        getSelectionStartCellOrCaption(editor).each(cellOrCaption => {
          table(cellOrCaption, isRoot).each(table => {
            child(table, 'caption').fold(() => {
              const caption = SugarElement.fromTag('caption');
              append$1(caption, SugarElement.fromTe***REMOVED***t('Caption'));
              appendAt(table, caption, 0);
              editor.selection.setCursorLocation(caption.dom, 0);
            }, caption => {
              if (isTag('caption')(cellOrCaption)) {
                one('td', table).each(td => editor.selection.setCursorLocation(td.dom, 0));
              }
              remove$6(caption);
            });
            fireTableModified(editor, table.dom, structureModified);
          });
        });
      };
      const postE***REMOVED***ecute = _data => {
        editor.focus();
      };
      const actOnSelection = (e***REMOVED***ecute, noEvents = false) => performActionOnSelection((table, startCell) => {
        const targets = forMenu(getCellsFromSelection(editor), table, startCell);
        e***REMOVED***ecute(table, targets, noEvents).each(postE***REMOVED***ecute);
      });
      const copyRowSelection = () => performActionOnSelection((table, startCell) => {
        const targets = forMenu(getCellsFromSelection(editor), table, startCell);
        const generators = cellOperations(noop, SugarElement.fromDom(editor.getDoc()), Optional.none());
        return copyRows(table, targets, generators);
      });
      const copyColSelection = () => performActionOnSelection((table, startCell) => {
        const targets = forMenu(getCellsFromSelection(editor), table, startCell);
        return copyCols(table, targets);
      });
      const pasteOnSelection = (e***REMOVED***ecute, getRows) => getRows().each(rows => {
        const clonedRows = map$1(rows, row => deep(row));
        performActionOnSelection((table, startCell) => {
          const generators = paste$1(SugarElement.fromDom(editor.getDoc()));
          const targets = pasteRows(getCellsFromSelection(editor), startCell, clonedRows, generators);
          e***REMOVED***ecute(table, targets).each(postE***REMOVED***ecute);
        });
      });
      const actOnType = getAction => (_ui, args) => get$c(args, 'type').each(type => {
        actOnSelection(getAction(type), args.no_events);
      });
      each$1({
        mceTableSplitCells: () => actOnSelection(actions.unmergeCells),
        mceTableMergeCells: () => actOnSelection(actions.mergeCells),
        mceTableInsertRowBefore: () => actOnSelection(actions.insertRowsBefore),
        mceTableInsertRowAfter: () => actOnSelection(actions.insertRowsAfter),
        mceTableInsertColBefore: () => actOnSelection(actions.insertColumnsBefore),
        mceTableInsertColAfter: () => actOnSelection(actions.insertColumnsAfter),
        mceTableDeleteCol: () => actOnSelection(actions.deleteColumn),
        mceTableDeleteRow: () => actOnSelection(actions.deleteRow),
        mceTableCutCol: () => copyColSelection().each(selection => {
          setColumns(selection);
          actOnSelection(actions.deleteColumn);
        }),
        mceTableCutRow: () => copyRowSelection().each(selection => {
          setRows(selection);
          actOnSelection(actions.deleteRow);
        }),
        mceTableCopyCol: () => copyColSelection().each(selection => setColumns(selection)),
        mceTableCopyRow: () => copyRowSelection().each(selection => setRows(selection)),
        mceTablePasteColBefore: () => pasteOnSelection(actions.pasteColsBefore, getColumns),
        mceTablePasteColAfter: () => pasteOnSelection(actions.pasteColsAfter, getColumns),
        mceTablePasteRowBefore: () => pasteOnSelection(actions.pasteRowsBefore, getRows),
        mceTablePasteRowAfter: () => pasteOnSelection(actions.pasteRowsAfter, getRows),
        mceTableDelete: eraseTable,
        mceTableCellToggleClass: toggleTableCellClass,
        mceTableToggleClass: toggleTableClass,
        mceTableToggleCaption: toggleCaption,
        mceTableSizingMode: (_ui, sizing) => setSizingMode(sizing),
        mceTableCellType: actOnType(type => type === 'th' ? actions.makeCellsHeader : actions.unmakeCellsHeader),
        mceTableColType: actOnType(type => type === 'th' ? actions.makeColumnsHeader : actions.unmakeColumnsHeader),
        mceTableRowType: actOnType(type => {
          switch (type) {
          case 'header':
            return actions.makeRowsHeader;
          case 'footer':
            return actions.makeRowsFooter;
          default:
            return actions.makeRowsBody;
          }
        })
      }, (func, name) => editor.addCommand(name, func));
      editor.addCommand('mceInsertTable', (_ui, args) => {
        insertTable(editor, args.rows, args.columns, args.options);
      });
      editor.addCommand('mceTableApplyCellStyle', (_ui, args) => {
        const getFormatName = style => 'tablecell' + style.toLowerCase().replace('-', '');
        if (!isObject(args)) {
          return;
        }
        const cells = filter$2(getCellsFromSelection(editor), isInEditableConte***REMOVED***t$1);
        if (cells.length === 0) {
          return;
        }
        const validArgs = filter$1(args, (value, style) => editor.formatter.has(getFormatName(style)) && isString(value));
        if (isEmpty(validArgs)) {
          return;
        }
        each$1(validArgs, (value, style) => {
          const formatName = getFormatName(style);
          each$2(cells, cell => {
            if (value === '') {
              editor.formatter.remove(formatName, { value: null }, cell.dom, true);
            } else {
              editor.formatter.apply(formatName, { value }, cell.dom);
            }
          });
        });
        getTableFromCell(cells[0]).each(table => fireTableModified(editor, table.dom, styleModified));
      });
    };

    const registerQueryCommands = (editor, actions) => {
      const isRoot = getIsRoot(editor);
      const lookupOnSelection = action => getSelectionCell(getSelectionStart(editor)).bind(cell => table(cell, isRoot).map(table => {
        const targets = forMenu(getCellsFromSelection(editor), table, cell);
        return action(table, targets);
      })).getOr('');
      each$1({
        mceTableRowType: () => lookupOnSelection(actions.getTableRowType),
        mceTableCellType: () => lookupOnSelection(actions.getTableCellType),
        mceTableColType: () => lookupOnSelection(actions.getTableColType)
      }, (func, name) => editor.addQueryValueHandler(name, func));
    };

    const adt$4 = Adt.generate([
      { before: ['element'] },
      {
        on: [
          'element',
          'offset'
        ]
      },
      { after: ['element'] }
    ]);
    const cata$1 = (subject, onBefore, onOn, onAfter) => subject.fold(onBefore, onOn, onAfter);
    const getStart$1 = situ => situ.fold(identity, identity, identity);
    const before$2 = adt$4.before;
    const on = adt$4.on;
    const after$3 = adt$4.after;
    const Situ = {
      before: before$2,
      on,
      after: after$3,
      cata: cata$1,
      getStart: getStart$1
    };

    const create$4 = (selection, kill) => ({
      selection,
      kill
    });
    const Response = { create: create$4 };

    const selectNode = (win, element) => {
      const rng = win.document.createRange();
      rng.selectNode(element.dom);
      return rng;
    };
    const selectNodeContents = (win, element) => {
      const rng = win.document.createRange();
      selectNodeContentsUsing(rng, element);
      return rng;
    };
    const selectNodeContentsUsing = (rng, element) => rng.selectNodeContents(element.dom);
    const setStart = (rng, situ) => {
      situ.fold(e => {
        rng.setStartBefore(e.dom);
      }, (e, o) => {
        rng.setStart(e.dom, o);
      }, e => {
        rng.setStartAfter(e.dom);
      });
    };
    const setFinish = (rng, situ) => {
      situ.fold(e => {
        rng.setEndBefore(e.dom);
      }, (e, o) => {
        rng.setEnd(e.dom, o);
      }, e => {
        rng.setEndAfter(e.dom);
      });
    };
    const relativeToNative = (win, startSitu, finishSitu) => {
      const range = win.document.createRange();
      setStart(range, startSitu);
      setFinish(range, finishSitu);
      return range;
    };
    const e***REMOVED***actToNative = (win, start, soffset, finish, foffset) => {
      const rng = win.document.createRange();
      rng.setStart(start.dom, soffset);
      rng.setEnd(finish.dom, foffset);
      return rng;
    };
    const toRect = rect => ({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    });
    const getFirstRect$1 = rng => {
      const rects = rng.getClientRects();
      const rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0 ? Optional.some(rect).map(toRect) : Optional.none();
    };

    const adt$3 = Adt.generate([
      {
        ltr: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      },
      {
        rtl: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      }
    ]);
    const fromRange = (win, type, range) => type(SugarElement.fromDom(range.startContainer), range.startOffset, SugarElement.fromDom(range.endContainer), range.endOffset);
    const getRanges = (win, selection) => selection.match({
      domRange: rng => {
        return {
          ltr: constant(rng),
          rtl: Optional.none
        };
      },
      relative: (startSitu, finishSitu) => {
        return {
          ltr: cached(() => relativeToNative(win, startSitu, finishSitu)),
          rtl: cached(() => Optional.some(relativeToNative(win, finishSitu, startSitu)))
        };
      },
      e***REMOVED***act: (start, soffset, finish, foffset) => {
        return {
          ltr: cached(() => e***REMOVED***actToNative(win, start, soffset, finish, foffset)),
          rtl: cached(() => Optional.some(e***REMOVED***actToNative(win, finish, foffset, start, soffset)))
        };
      }
    });
    const doDiagnose = (win, ranges) => {
      const rng = ranges.ltr();
      if (rng.collapsed) {
        const reversed = ranges.rtl().filter(rev => rev.collapsed === false);
        return reversed.map(rev => adt$3.rtl(SugarElement.fromDom(rev.endContainer), rev.endOffset, SugarElement.fromDom(rev.startContainer), rev.startOffset)).getOrThunk(() => fromRange(win, adt$3.ltr, rng));
      } else {
        return fromRange(win, adt$3.ltr, rng);
      }
    };
    const diagnose = (win, selection) => {
      const ranges = getRanges(win, selection);
      return doDiagnose(win, ranges);
    };
    const asLtrRange = (win, selection) => {
      const diagnosis = diagnose(win, selection);
      return diagnosis.match({
        ltr: (start, soffset, finish, foffset) => {
          const rng = win.document.createRange();
          rng.setStart(start.dom, soffset);
          rng.setEnd(finish.dom, foffset);
          return rng;
        },
        rtl: (start, soffset, finish, foffset) => {
          const rng = win.document.createRange();
          rng.setStart(finish.dom, foffset);
          rng.setEnd(start.dom, soffset);
          return rng;
        }
      });
    };
    adt$3.ltr;
    adt$3.rtl;

    const create$3 = (start, soffset, finish, foffset) => ({
      start,
      soffset,
      finish,
      foffset
    });
    const SimRange = { create: create$3 };

    const create$2 = (start, soffset, finish, foffset) => {
      return {
        start: Situ.on(start, soffset),
        finish: Situ.on(finish, foffset)
      };
    };
    const Situs = { create: create$2 };

    const convertToRange = (win, selection) => {
      const rng = asLtrRange(win, selection);
      return SimRange.create(SugarElement.fromDom(rng.startContainer), rng.startOffset, SugarElement.fromDom(rng.endContainer), rng.endOffset);
    };
    const makeSitus = Situs.create;

    const sync = (container, isRoot, start, soffset, finish, foffset, selectRange) => {
      if (!(eq$1(start, finish) && soffset === foffset)) {
        return closest$1(start, 'td,th', isRoot).bind(s => {
          return closest$1(finish, 'td,th', isRoot).bind(f => {
            return detect(container, isRoot, s, f, selectRange);
          });
        });
      } else {
        return Optional.none();
      }
    };
    const detect = (container, isRoot, start, finish, selectRange) => {
      if (!eq$1(start, finish)) {
        return identify(start, finish, isRoot).bind(cellSel => {
          const bo***REMOVED***es = cellSel.bo***REMOVED***es.getOr([]);
          if (bo***REMOVED***es.length > 1) {
            selectRange(container, bo***REMOVED***es, cellSel.start, cellSel.finish);
            return Optional.some(Response.create(Optional.some(makeSitus(start, 0, start, getEnd(start))), true));
          } else {
            return Optional.none();
          }
        });
      } else {
        return Optional.none();
      }
    };
    const update = (rows, columns, container, selected, annotations) => {
      const updateSelection = newSels => {
        annotations.clearBeforeUpdate(container);
        annotations.selectRange(container, newSels.bo***REMOVED***es, newSels.start, newSels.finish);
        return newSels.bo***REMOVED***es;
      };
      return shiftSelection(selected, rows, columns, annotations.firstSelectedSelector, annotations.lastSelectedSelector).map(updateSelection);
    };

    const traverse = (item, mode) => ({
      item,
      mode
    });
    const backtrack = (universe, item, _direction, transition = sidestep) => {
      return universe.property().parent(item).map(p => {
        return traverse(p, transition);
      });
    };
    const sidestep = (universe, item, direction, transition = advance) => {
      return direction.sibling(universe, item).map(p => {
        return traverse(p, transition);
      });
    };
    const advance = (universe, item, direction, transition = advance) => {
      const children = universe.property().children(item);
      const result = direction.first(children);
      return result.map(r => {
        return traverse(r, transition);
      });
    };
    const successors = [
      {
        current: backtrack,
        ne***REMOVED***t: sidestep,
        fallback: Optional.none()
      },
      {
        current: sidestep,
        ne***REMOVED***t: advance,
        fallback: Optional.some(backtrack)
      },
      {
        current: advance,
        ne***REMOVED***t: advance,
        fallback: Optional.some(sidestep)
      }
    ];
    const go = (universe, item, mode, direction, rules = successors) => {
      const ruleOpt = find$1(rules, succ => {
        return succ.current === mode;
      });
      return ruleOpt.bind(rule => {
        return rule.current(universe, item, direction, rule.ne***REMOVED***t).orThunk(() => {
          return rule.fallback.bind(fb => {
            return go(universe, item, fb, direction);
          });
        });
      });
    };

    const left$1 = () => {
      const sibling = (universe, item) => {
        return universe.query().prevSibling(item);
      };
      const first = children => {
        return children.length > 0 ? Optional.some(children[children.length - 1]) : Optional.none();
      };
      return {
        sibling,
        first
      };
    };
    const right$1 = () => {
      const sibling = (universe, item) => {
        return universe.query().ne***REMOVED***tSibling(item);
      };
      const first = children => {
        return children.length > 0 ? Optional.some(children[0]) : Optional.none();
      };
      return {
        sibling,
        first
      };
    };
    const Walkers = {
      left: left$1,
      right: right$1
    };

    const hone = (universe, item, predicate, mode, direction, isRoot) => {
      const ne***REMOVED***t = go(universe, item, mode, direction);
      return ne***REMOVED***t.bind(n => {
        if (isRoot(n.item)) {
          return Optional.none();
        } else {
          return predicate(n.item) ? Optional.some(n.item) : hone(universe, n.item, predicate, n.mode, direction, isRoot);
        }
      });
    };
    const left = (universe, item, predicate, isRoot) => {
      return hone(universe, item, predicate, sidestep, Walkers.left(), isRoot);
    };
    const right = (universe, item, predicate, isRoot) => {
      return hone(universe, item, predicate, sidestep, Walkers.right(), isRoot);
    };

    const isLeaf = universe => element => universe.property().children(element).length === 0;
    const before$1 = (universe, item, isRoot) => {
      return seekLeft$1(universe, item, isLeaf(universe), isRoot);
    };
    const after$2 = (universe, item, isRoot) => {
      return seekRight$1(universe, item, isLeaf(universe), isRoot);
    };
    const seekLeft$1 = left;
    const seekRight$1 = right;

    const universe = DomUniverse();
    const before = (element, isRoot) => {
      return before$1(universe, element, isRoot);
    };
    const after$1 = (element, isRoot) => {
      return after$2(universe, element, isRoot);
    };
    const seekLeft = (element, predicate, isRoot) => {
      return seekLeft$1(universe, element, predicate, isRoot);
    };
    const seekRight = (element, predicate, isRoot) => {
      return seekRight$1(universe, element, predicate, isRoot);
    };

    const ancestor = (scope, predicate, isRoot) => ancestor$2(scope, predicate, isRoot).isSome();

    const adt$2 = Adt.generate([
      { none: ['message'] },
      { success: [] },
      { failedUp: ['cell'] },
      { failedDown: ['cell'] }
    ]);
    const isOverlapping = (bridge, before, after) => {
      const beforeBounds = bridge.getRect(before);
      const afterBounds = bridge.getRect(after);
      return afterBounds.right > beforeBounds.left && afterBounds.left < beforeBounds.right;
    };
    const isRow = elem => {
      return closest$1(elem, 'tr');
    };
    const verify = (bridge, before, beforeOffset, after, afterOffset, failure, isRoot) => {
      return closest$1(after, 'td,th', isRoot).bind(afterCell => {
        return closest$1(before, 'td,th', isRoot).map(beforeCell => {
          if (!eq$1(afterCell, beforeCell)) {
            return sharedOne(isRow, [
              afterCell,
              beforeCell
            ]).fold(() => {
              return isOverlapping(bridge, beforeCell, afterCell) ? adt$2.success() : failure(beforeCell);
            }, _sharedRow => {
              return failure(beforeCell);
            });
          } else {
            return eq$1(after, afterCell) && getEnd(afterCell) === afterOffset ? failure(beforeCell) : adt$2.none('in same cell');
          }
        });
      }).getOr(adt$2.none('default'));
    };
    const cata = (subject, onNone, onSuccess, onFailedUp, onFailedDown) => {
      return subject.fold(onNone, onSuccess, onFailedUp, onFailedDown);
    };
    const BeforeAfter = {
      ...adt$2,
      verify,
      cata
    };

    const inParent = (parent, children, element, inde***REMOVED***) => ({
      parent,
      children,
      element,
      inde***REMOVED***
    });
    const inde***REMOVED***InParent = element => parent(element).bind(parent => {
      const children = children$2(parent);
      return inde***REMOVED***Of(children, element).map(inde***REMOVED*** => inParent(parent, children, element, inde***REMOVED***));
    });
    const inde***REMOVED***Of = (elements, element) => findInde***REMOVED***(elements, curry(eq$1, element));

    const isBr = isTag('br');
    const gatherer = (cand, gather, isRoot) => {
      return gather(cand, isRoot).bind(target => {
        return isTe***REMOVED***t(target) && get$6(target).trim().length === 0 ? gatherer(target, gather, isRoot) : Optional.some(target);
      });
    };
    const handleBr = (isRoot, element, direction) => {
      return direction.traverse(element).orThunk(() => {
        return gatherer(element, direction.gather, isRoot);
      }).map(direction.relative);
    };
    const findBr = (element, offset) => {
      return child$2(element, offset).filter(isBr).orThunk(() => {
        return child$2(element, offset - 1).filter(isBr);
      });
    };
    const handleParent = (isRoot, element, offset, direction) => {
      return findBr(element, offset).bind(br => {
        return direction.traverse(br).fold(() => {
          return gatherer(br, direction.gather, isRoot).map(direction.relative);
        }, adjacent => {
          return inde***REMOVED***InParent(adjacent).map(info => {
            return Situ.on(info.parent, info.inde***REMOVED***);
          });
        });
      });
    };
    const tryBr = (isRoot, element, offset, direction) => {
      const target = isBr(element) ? handleBr(isRoot, element, direction) : handleParent(isRoot, element, offset, direction);
      return target.map(tgt => {
        return {
          start: tgt,
          finish: tgt
        };
      });
    };
    const process = analysis => {
      return BeforeAfter.cata(analysis, _message => {
        return Optional.none();
      }, () => {
        return Optional.none();
      }, cell => {
        return Optional.some(point(cell, 0));
      }, cell => {
        return Optional.some(point(cell, getEnd(cell)));
      });
    };

    const moveDown = (caret, amount) => {
      return {
        left: caret.left,
        top: caret.top + amount,
        right: caret.right,
        bottom: caret.bottom + amount
      };
    };
    const moveUp = (caret, amount) => {
      return {
        left: caret.left,
        top: caret.top - amount,
        right: caret.right,
        bottom: caret.bottom - amount
      };
    };
    const translate = (caret, ***REMOVED***Delta, yDelta) => {
      return {
        left: caret.left + ***REMOVED***Delta,
        top: caret.top + yDelta,
        right: caret.right + ***REMOVED***Delta,
        bottom: caret.bottom + yDelta
      };
    };
    const getTop = caret => {
      return caret.top;
    };
    const getBottom = caret => {
      return caret.bottom;
    };

    const getPartialBo***REMOVED*** = (bridge, element, offset) => {
      if (offset >= 0 && offset < getEnd(element)) {
        return bridge.getRangedRect(element, offset, element, offset + 1);
      } else if (offset > 0) {
        return bridge.getRangedRect(element, offset - 1, element, offset);
      }
      return Optional.none();
    };
    const toCaret = rect => ({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom
    });
    const getElemBo***REMOVED*** = (bridge, element) => {
      return Optional.some(bridge.getRect(element));
    };
    const getBo***REMOVED***At = (bridge, element, offset) => {
      if (isElement(element)) {
        return getElemBo***REMOVED***(bridge, element).map(toCaret);
      } else if (isTe***REMOVED***t(element)) {
        return getPartialBo***REMOVED***(bridge, element, offset).map(toCaret);
      } else {
        return Optional.none();
      }
    };
    const getEntireBo***REMOVED*** = (bridge, element) => {
      if (isElement(element)) {
        return getElemBo***REMOVED***(bridge, element).map(toCaret);
      } else if (isTe***REMOVED***t(element)) {
        return bridge.getRangedRect(element, 0, element, getEnd(element)).map(toCaret);
      } else {
        return Optional.none();
      }
    };

    const JUMP_SIZE = 5;
    const NUM_RETRIES = 100;
    const adt$1 = Adt.generate([
      { none: [] },
      { retry: ['caret'] }
    ]);
    const isOutside = (caret, bo***REMOVED***) => {
      return caret.left < bo***REMOVED***.left || Math.abs(bo***REMOVED***.right - caret.left) < 1 || caret.left > bo***REMOVED***.right;
    };
    const inOutsideBlock = (bridge, element, caret) => {
      return closest$2(element, isBlock).fold(never, cell => {
        return getEntireBo***REMOVED***(bridge, cell).e***REMOVED***ists(bo***REMOVED*** => {
          return isOutside(caret, bo***REMOVED***);
        });
      });
    };
    const adjustDown = (bridge, element, guessBo***REMOVED***, original, caret) => {
      const lowerCaret = moveDown(caret, JUMP_SIZE);
      if (Math.abs(guessBo***REMOVED***.bottom - original.bottom) < 1) {
        return adt$1.retry(lowerCaret);
      } else if (guessBo***REMOVED***.top > caret.bottom) {
        return adt$1.retry(lowerCaret);
      } else if (guessBo***REMOVED***.top === caret.bottom) {
        return adt$1.retry(moveDown(caret, 1));
      } else {
        return inOutsideBlock(bridge, element, caret) ? adt$1.retry(translate(lowerCaret, JUMP_SIZE, 0)) : adt$1.none();
      }
    };
    const adjustUp = (bridge, element, guessBo***REMOVED***, original, caret) => {
      const higherCaret = moveUp(caret, JUMP_SIZE);
      if (Math.abs(guessBo***REMOVED***.top - original.top) < 1) {
        return adt$1.retry(higherCaret);
      } else if (guessBo***REMOVED***.bottom < caret.top) {
        return adt$1.retry(higherCaret);
      } else if (guessBo***REMOVED***.bottom === caret.top) {
        return adt$1.retry(moveUp(caret, 1));
      } else {
        return inOutsideBlock(bridge, element, caret) ? adt$1.retry(translate(higherCaret, JUMP_SIZE, 0)) : adt$1.none();
      }
    };
    const upMovement = {
      point: getTop,
      adjuster: adjustUp,
      move: moveUp,
      gather: before
    };
    const downMovement = {
      point: getBottom,
      adjuster: adjustDown,
      move: moveDown,
      gather: after$1
    };
    const isAtTable = (bridge, ***REMOVED***, y) => {
      return bridge.elementFromPoint(***REMOVED***, y).filter(elm => {
        return name(elm) === 'table';
      }).isSome();
    };
    const adjustForTable = (bridge, movement, original, caret, numRetries) => {
      return adjustTil(bridge, movement, original, movement.move(caret, JUMP_SIZE), numRetries);
    };
    const adjustTil = (bridge, movement, original, caret, numRetries) => {
      if (numRetries === 0) {
        return Optional.some(caret);
      }
      if (isAtTable(bridge, caret.left, movement.point(caret))) {
        return adjustForTable(bridge, movement, original, caret, numRetries - 1);
      }
      return bridge.situsFromPoint(caret.left, movement.point(caret)).bind(guess => {
        return guess.start.fold(Optional.none, element => {
          return getEntireBo***REMOVED***(bridge, element).bind(guessBo***REMOVED*** => {
            return movement.adjuster(bridge, element, guessBo***REMOVED***, original, caret).fold(Optional.none, newCaret => {
              return adjustTil(bridge, movement, original, newCaret, numRetries - 1);
            });
          }).orThunk(() => {
            return Optional.some(caret);
          });
        }, Optional.none);
      });
    };
    const checkScroll = (movement, adjusted, bridge) => {
      if (movement.point(adjusted) > bridge.getInnerHeight()) {
        return Optional.some(movement.point(adjusted) - bridge.getInnerHeight());
      } else if (movement.point(adjusted) < 0) {
        return Optional.some(-movement.point(adjusted));
      } else {
        return Optional.none();
      }
    };
    const retry = (movement, bridge, caret) => {
      const moved = movement.move(caret, JUMP_SIZE);
      const adjusted = adjustTil(bridge, movement, caret, moved, NUM_RETRIES).getOr(moved);
      return checkScroll(movement, adjusted, bridge).fold(() => {
        return bridge.situsFromPoint(adjusted.left, movement.point(adjusted));
      }, delta => {
        bridge.scrollBy(0, delta);
        return bridge.situsFromPoint(adjusted.left, movement.point(adjusted) - delta);
      });
    };
    const Retries = {
      tryUp: curry(retry, upMovement),
      tryDown: curry(retry, downMovement),
      getJumpSize: constant(JUMP_SIZE)
    };

    const MAX_RETRIES = 20;
    const findSpot = (bridge, isRoot, direction) => {
      return bridge.getSelection().bind(sel => {
        return tryBr(isRoot, sel.finish, sel.foffset, direction).fold(() => {
          return Optional.some(point(sel.finish, sel.foffset));
        }, brNeighbour => {
          const range = bridge.fromSitus(brNeighbour);
          const analysis = BeforeAfter.verify(bridge, sel.finish, sel.foffset, range.finish, range.foffset, direction.failure, isRoot);
          return process(analysis);
        });
      });
    };
    const scan = (bridge, isRoot, element, offset, direction, numRetries) => {
      if (numRetries === 0) {
        return Optional.none();
      }
      return tryCursor(bridge, isRoot, element, offset, direction).bind(situs => {
        const range = bridge.fromSitus(situs);
        const analysis = BeforeAfter.verify(bridge, element, offset, range.finish, range.foffset, direction.failure, isRoot);
        return BeforeAfter.cata(analysis, () => {
          return Optional.none();
        }, () => {
          return Optional.some(situs);
        }, cell => {
          if (eq$1(element, cell) && offset === 0) {
            return tryAgain(bridge, element, offset, moveUp, direction);
          } else {
            return scan(bridge, isRoot, cell, 0, direction, numRetries - 1);
          }
        }, cell => {
          if (eq$1(element, cell) && offset === getEnd(cell)) {
            return tryAgain(bridge, element, offset, moveDown, direction);
          } else {
            return scan(bridge, isRoot, cell, getEnd(cell), direction, numRetries - 1);
          }
        });
      });
    };
    const tryAgain = (bridge, element, offset, move, direction) => {
      return getBo***REMOVED***At(bridge, element, offset).bind(bo***REMOVED*** => {
        return tryAt(bridge, direction, move(bo***REMOVED***, Retries.getJumpSize()));
      });
    };
    const tryAt = (bridge, direction, bo***REMOVED***) => {
      const browser = detect$2().browser;
      if (browser.isChromium() || browser.isSafari() || browser.isFirefo***REMOVED***()) {
        return direction.retry(bridge, bo***REMOVED***);
      } else {
        return Optional.none();
      }
    };
    const tryCursor = (bridge, isRoot, element, offset, direction) => {
      return getBo***REMOVED***At(bridge, element, offset).bind(bo***REMOVED*** => {
        return tryAt(bridge, direction, bo***REMOVED***);
      });
    };
    const handle$1 = (bridge, isRoot, direction) => {
      return findSpot(bridge, isRoot, direction).bind(spot => {
        return scan(bridge, isRoot, spot.element, spot.offset, direction, MAX_RETRIES).map(bridge.fromSitus);
      });
    };

    const inSameTable = (elem, table) => {
      return ancestor(elem, e => {
        return parent(e).e***REMOVED***ists(p => {
          return eq$1(p, table);
        });
      });
    };
    const simulate = (bridge, isRoot, direction, initial, anchor) => {
      return closest$1(initial, 'td,th', isRoot).bind(start => {
        return closest$1(start, 'table', isRoot).bind(table => {
          if (!inSameTable(anchor, table)) {
            return Optional.none();
          }
          return handle$1(bridge, isRoot, direction).bind(range => {
            return closest$1(range.finish, 'td,th', isRoot).map(finish => {
              return {
                start,
                finish,
                range
              };
            });
          });
        });
      });
    };
    const navigate = (bridge, isRoot, direction, initial, anchor, precheck) => {
      return precheck(initial, isRoot).orThunk(() => {
        return simulate(bridge, isRoot, direction, initial, anchor).map(info => {
          const range = info.range;
          return Response.create(Optional.some(makeSitus(range.start, range.soffset, range.finish, range.foffset)), true);
        });
      });
    };
    const firstUpCheck = (initial, isRoot) => {
      return closest$1(initial, 'tr', isRoot).bind(startRow => {
        return closest$1(startRow, 'table', isRoot).bind(table => {
          const rows = descendants(table, 'tr');
          if (eq$1(startRow, rows[0])) {
            return seekLeft(table, element => {
              return last$1(element).isSome();
            }, isRoot).map(last => {
              const lastOffset = getEnd(last);
              return Response.create(Optional.some(makeSitus(last, lastOffset, last, lastOffset)), true);
            });
          } else {
            return Optional.none();
          }
        });
      });
    };
    const lastDownCheck = (initial, isRoot) => {
      return closest$1(initial, 'tr', isRoot).bind(startRow => {
        return closest$1(startRow, 'table', isRoot).bind(table => {
          const rows = descendants(table, 'tr');
          if (eq$1(startRow, rows[rows.length - 1])) {
            return seekRight(table, element => {
              return first(element).isSome();
            }, isRoot).map(first => {
              return Response.create(Optional.some(makeSitus(first, 0, first, 0)), true);
            });
          } else {
            return Optional.none();
          }
        });
      });
    };
    const select = (bridge, container, isRoot, direction, initial, anchor, selectRange) => {
      return simulate(bridge, isRoot, direction, initial, anchor).bind(info => {
        return detect(container, isRoot, info.start, info.finish, selectRange);
      });
    };

    const Cell = initial => {
      let value = initial;
      const get = () => {
        return value;
      };
      const set = v => {
        value = v;
      };
      return {
        get,
        set
      };
    };

    const singleton = doRevoke => {
      const subject = Cell(Optional.none());
      const revoke = () => subject.get().each(doRevoke);
      const clear = () => {
        revoke();
        subject.set(Optional.none());
      };
      const isSet = () => subject.get().isSome();
      const get = () => subject.get();
      const set = s => {
        revoke();
        subject.set(Optional.some(s));
      };
      return {
        clear,
        isSet,
        get,
        set
      };
    };
    const value = () => {
      const subject = singleton(noop);
      const on = f => subject.get().each(f);
      return {
        ...subject,
        on
      };
    };

    const findCell = (target, isRoot) => closest$1(target, 'td,th', isRoot);
    const isInEditableConte***REMOVED***t = cell => parentElement(cell).e***REMOVED***ists(isEditable$1);
    const MouseSelection = (bridge, container, isRoot, annotations) => {
      const cursor = value();
      const clearstate = cursor.clear;
      const applySelection = event => {
        cursor.on(start => {
          annotations.clearBeforeUpdate(container);
          findCell(event.target, isRoot).each(finish => {
            identify(start, finish, isRoot).each(cellSel => {
              const bo***REMOVED***es = cellSel.bo***REMOVED***es.getOr([]);
              if (bo***REMOVED***es.length === 1) {
                const singleCell = bo***REMOVED***es[0];
                const isNonEditableCell = getRaw(singleCell) === 'false';
                const isCellClosestContentEditable = is(closest(event.target), singleCell, eq$1);
                if (isNonEditableCell && isCellClosestContentEditable) {
                  annotations.selectRange(container, bo***REMOVED***es, singleCell, singleCell);
                }
              } else if (bo***REMOVED***es.length > 1) {
                annotations.selectRange(container, bo***REMOVED***es, cellSel.start, cellSel.finish);
                bridge.selectContents(finish);
              }
            });
          });
        });
      };
      const mousedown = event => {
        annotations.clear(container);
        findCell(event.target, isRoot).filter(isInEditableConte***REMOVED***t).each(cursor.set);
      };
      const mouseover = event => {
        applySelection(event);
      };
      const mouseup = event => {
        applySelection(event);
        clearstate();
      };
      return {
        clearstate,
        mousedown,
        mouseover,
        mouseup
      };
    };

    const down = {
      traverse: ne***REMOVED***tSibling,
      gather: after$1,
      relative: Situ.before,
      retry: Retries.tryDown,
      failure: BeforeAfter.failedDown
    };
    const up = {
      traverse: prevSibling,
      gather: before,
      relative: Situ.before,
      retry: Retries.tryUp,
      failure: BeforeAfter.failedUp
    };

    const isKey = key => {
      return keycode => {
        return keycode === key;
      };
    };
    const isUp = isKey(38);
    const isDown = isKey(40);
    const isNavigation = keycode => {
      return keycode >= 37 && keycode <= 40;
    };
    const ltr = {
      isBackward: isKey(37),
      isForward: isKey(39)
    };
    const rtl = {
      isBackward: isKey(39),
      isForward: isKey(37)
    };

    const get$3 = _DOC => {
      const doc = _DOC !== undefined ? _DOC.dom : document;
      const ***REMOVED*** = doc.body.scrollLeft || doc.documentElement.scrollLeft;
      const y = doc.body.scrollTop || doc.documentElement.scrollTop;
      return SugarPosition(***REMOVED***, y);
    };
    const by = (***REMOVED***, y, _DOC) => {
      const doc = _DOC !== undefined ? _DOC.dom : document;
      const win = doc.defaultView;
      if (win) {
        win.scrollBy(***REMOVED***, y);
      }
    };

    const adt = Adt.generate([
      { domRange: ['rng'] },
      {
        relative: [
          'startSitu',
          'finishSitu'
        ]
      },
      {
        e***REMOVED***act: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      }
    ]);
    const e***REMOVED***actFromRange = simRange => adt.e***REMOVED***act(simRange.start, simRange.soffset, simRange.finish, simRange.foffset);
    const getStart = selection => selection.match({
      domRange: rng => SugarElement.fromDom(rng.startContainer),
      relative: (startSitu, _finishSitu) => Situ.getStart(startSitu),
      e***REMOVED***act: (start, _soffset, _finish, _foffset) => start
    });
    const domRange = adt.domRange;
    const relative = adt.relative;
    const e***REMOVED***act = adt.e***REMOVED***act;
    const getWin = selection => {
      const start = getStart(selection);
      return defaultView(start);
    };
    const range = SimRange.create;
    const SimSelection = {
      domRange,
      relative,
      e***REMOVED***act,
      e***REMOVED***actFromRange,
      getWin,
      range
    };

    const caretPositionFromPoint = (doc, ***REMOVED***, y) => {
      var _a, _b;
      return Optional.from((_b = (_a = doc.dom).caretPositionFromPoint) === null || _b === void 0 ? void 0 : _b.call(_a, ***REMOVED***, y)).bind(pos => {
        if (pos.offsetNode === null) {
          return Optional.none();
        }
        const r = doc.dom.createRange();
        r.setStart(pos.offsetNode, pos.offset);
        r.collapse();
        return Optional.some(r);
      });
    };
    const caretRangeFromPoint = (doc, ***REMOVED***, y) => {
      var _a, _b;
      return Optional.from((_b = (_a = doc.dom).caretRangeFromPoint) === null || _b === void 0 ? void 0 : _b.call(_a, ***REMOVED***, y));
    };
    const availableSearch = (() => {
      if (document.caretPositionFromPoint) {
        return caretPositionFromPoint;
      } else if (document.caretRangeFromPoint) {
        return caretRangeFromPoint;
      } else {
        return Optional.none;
      }
    })();
    const fromPoint = (win, ***REMOVED***, y) => {
      const doc = SugarElement.fromDom(win.document);
      return availableSearch(doc, ***REMOVED***, y).map(rng => SimRange.create(SugarElement.fromDom(rng.startContainer), rng.startOffset, SugarElement.fromDom(rng.endContainer), rng.endOffset));
    };

    const beforeSpecial = (element, offset) => {
      const name$1 = name(element);
      if ('input' === name$1) {
        return Situ.after(element);
      } else if (!contains$2([
          'br',
          'img'
        ], name$1)) {
        return Situ.on(element, offset);
      } else {
        return offset === 0 ? Situ.before(element) : Situ.after(element);
      }
    };
    const preprocessRelative = (startSitu, finishSitu) => {
      const start = startSitu.fold(Situ.before, beforeSpecial, Situ.after);
      const finish = finishSitu.fold(Situ.before, beforeSpecial, Situ.after);
      return SimSelection.relative(start, finish);
    };
    const preprocessE***REMOVED***act = (start, soffset, finish, foffset) => {
      const startSitu = beforeSpecial(start, soffset);
      const finishSitu = beforeSpecial(finish, foffset);
      return SimSelection.relative(startSitu, finishSitu);
    };

    const makeRange = (start, soffset, finish, foffset) => {
      const doc = owner(start);
      const rng = doc.dom.createRange();
      rng.setStart(start.dom, soffset);
      rng.setEnd(finish.dom, foffset);
      return rng;
    };
    const after = (start, soffset, finish, foffset) => {
      const r = makeRange(start, soffset, finish, foffset);
      const same = eq$1(start, finish) && soffset === foffset;
      return r.collapsed && !same;
    };

    const getNativeSelection = win => Optional.from(win.getSelection());
    const doSetNativeRange = (win, rng) => {
      getNativeSelection(win).each(selection => {
        selection.removeAllRanges();
        selection.addRange(rng);
      });
    };
    const doSetRange = (win, start, soffset, finish, foffset) => {
      const rng = e***REMOVED***actToNative(win, start, soffset, finish, foffset);
      doSetNativeRange(win, rng);
    };
    const setLegacyRtlRange = (win, selection, start, soffset, finish, foffset) => {
      selection.collapse(start.dom, soffset);
      selection.e***REMOVED***tend(finish.dom, foffset);
    };
    const setRangeFromRelative = (win, relative) => diagnose(win, relative).match({
      ltr: (start, soffset, finish, foffset) => {
        doSetRange(win, start, soffset, finish, foffset);
      },
      rtl: (start, soffset, finish, foffset) => {
        getNativeSelection(win).each(selection => {
          if (selection.setBaseAndE***REMOVED***tent) {
            selection.setBaseAndE***REMOVED***tent(start.dom, soffset, finish.dom, foffset);
          } else if (selection.e***REMOVED***tend) {
            try {
              setLegacyRtlRange(win, selection, start, soffset, finish, foffset);
            } catch (e) {
              doSetRange(win, finish, foffset, start, soffset);
            }
          } else {
            doSetRange(win, finish, foffset, start, soffset);
          }
        });
      }
    });
    const setE***REMOVED***act = (win, start, soffset, finish, foffset) => {
      const relative = preprocessE***REMOVED***act(start, soffset, finish, foffset);
      setRangeFromRelative(win, relative);
    };
    const setRelative = (win, startSitu, finishSitu) => {
      const relative = preprocessRelative(startSitu, finishSitu);
      setRangeFromRelative(win, relative);
    };
    const readRange = selection => {
      if (selection.rangeCount > 0) {
        const firstRng = selection.getRangeAt(0);
        const lastRng = selection.getRangeAt(selection.rangeCount - 1);
        return Optional.some(SimRange.create(SugarElement.fromDom(firstRng.startContainer), firstRng.startOffset, SugarElement.fromDom(lastRng.endContainer), lastRng.endOffset));
      } else {
        return Optional.none();
      }
    };
    const doGetE***REMOVED***act = selection => {
      if (selection.anchorNode === null || selection.focusNode === null) {
        return readRange(selection);
      } else {
        const anchor = SugarElement.fromDom(selection.anchorNode);
        const focus = SugarElement.fromDom(selection.focusNode);
        return after(anchor, selection.anchorOffset, focus, selection.focusOffset) ? Optional.some(SimRange.create(anchor, selection.anchorOffset, focus, selection.focusOffset)) : readRange(selection);
      }
    };
    const setToElement = (win, element, selectNodeContents$1 = true) => {
      const rngGetter = selectNodeContents$1 ? selectNodeContents : selectNode;
      const rng = rngGetter(win, element);
      doSetNativeRange(win, rng);
    };
    const getE***REMOVED***act = win => getNativeSelection(win).filter(sel => sel.rangeCount > 0).bind(doGetE***REMOVED***act);
    const get$2 = win => getE***REMOVED***act(win).map(range => SimSelection.e***REMOVED***act(range.start, range.soffset, range.finish, range.foffset));
    const getFirstRect = (win, selection) => {
      const rng = asLtrRange(win, selection);
      return getFirstRect$1(rng);
    };
    const getAtPoint = (win, ***REMOVED***, y) => fromPoint(win, ***REMOVED***, y);
    const clear = win => {
      getNativeSelection(win).each(selection => selection.removeAllRanges());
    };

    const WindowBridge = win => {
      const elementFromPoint = (***REMOVED***, y) => {
        return SugarElement.fromPoint(SugarElement.fromDom(win.document), ***REMOVED***, y);
      };
      const getRect = element => {
        return element.dom.getBoundingClientRect();
      };
      const getRangedRect = (start, soffset, finish, foffset) => {
        const sel = SimSelection.e***REMOVED***act(start, soffset, finish, foffset);
        return getFirstRect(win, sel);
      };
      const getSelection = () => {
        return get$2(win).map(e***REMOVED***actAdt => {
          return convertToRange(win, e***REMOVED***actAdt);
        });
      };
      const fromSitus = situs => {
        const relative = SimSelection.relative(situs.start, situs.finish);
        return convertToRange(win, relative);
      };
      const situsFromPoint = (***REMOVED***, y) => {
        return getAtPoint(win, ***REMOVED***, y).map(e***REMOVED***act => {
          return Situs.create(e***REMOVED***act.start, e***REMOVED***act.soffset, e***REMOVED***act.finish, e***REMOVED***act.foffset);
        });
      };
      const clearSelection = () => {
        clear(win);
      };
      const collapseSelection = (toStart = false) => {
        get$2(win).each(sel => sel.fold(rng => rng.collapse(toStart), (startSitu, finishSitu) => {
          const situ = toStart ? startSitu : finishSitu;
          setRelative(win, situ, situ);
        }, (start, soffset, finish, foffset) => {
          const node = toStart ? start : finish;
          const offset = toStart ? soffset : foffset;
          setE***REMOVED***act(win, node, offset, node, offset);
        }));
      };
      const selectNode = element => {
        setToElement(win, element, false);
      };
      const selectContents = element => {
        setToElement(win, element);
      };
      const setSelection = sel => {
        setE***REMOVED***act(win, sel.start, sel.soffset, sel.finish, sel.foffset);
      };
      const setRelativeSelection = (start, finish) => {
        setRelative(win, start, finish);
      };
      const getInnerHeight = () => {
        return win.innerHeight;
      };
      const getScrollY = () => {
        const pos = get$3(SugarElement.fromDom(win.document));
        return pos.top;
      };
      const scrollBy = (***REMOVED***, y) => {
        by(***REMOVED***, y, SugarElement.fromDom(win.document));
      };
      return {
        elementFromPoint,
        getRect,
        getRangedRect,
        getSelection,
        fromSitus,
        situsFromPoint,
        clearSelection,
        collapseSelection,
        setSelection,
        setRelativeSelection,
        selectNode,
        selectContents,
        getInnerHeight,
        getScrollY,
        scrollBy
      };
    };

    const rc = (rows, cols) => ({
      rows,
      cols
    });
    const mouse = (win, container, isRoot, annotations) => {
      const bridge = WindowBridge(win);
      const handlers = MouseSelection(bridge, container, isRoot, annotations);
      return {
        clearstate: handlers.clearstate,
        mousedown: handlers.mousedown,
        mouseover: handlers.mouseover,
        mouseup: handlers.mouseup
      };
    };
    const isEditableNode = node => closest$2(node, isHTMLElement).e***REMOVED***ists(isEditable$1);
    const isEditableSelection = (start, finish) => isEditableNode(start) || isEditableNode(finish);
    const keyboard = (win, container, isRoot, annotations) => {
      const bridge = WindowBridge(win);
      const clearToNavigate = () => {
        annotations.clear(container);
        return Optional.none();
      };
      const keydown = (event, start, soffset, finish, foffset, direction) => {
        const realEvent = event.raw;
        const keycode = realEvent.which;
        const shiftKey = realEvent.shiftKey === true;
        const handler = retrieve$1(container, annotations.selectedSelector).fold(() => {
          if (isNavigation(keycode) && !shiftKey) {
            annotations.clearBeforeUpdate(container);
          }
          if (isNavigation(keycode) && shiftKey && !isEditableSelection(start, finish)) {
            return Optional.none;
          } else if (isDown(keycode) && shiftKey) {
            return curry(select, bridge, container, isRoot, down, finish, start, annotations.selectRange);
          } else if (isUp(keycode) && shiftKey) {
            return curry(select, bridge, container, isRoot, up, finish, start, annotations.selectRange);
          } else if (isDown(keycode)) {
            return curry(navigate, bridge, isRoot, down, finish, start, lastDownCheck);
          } else if (isUp(keycode)) {
            return curry(navigate, bridge, isRoot, up, finish, start, firstUpCheck);
          } else {
            return Optional.none;
          }
        }, selected => {
          const update$1 = attempts => {
            return () => {
              const navigation = findMap(attempts, delta => {
                return update(delta.rows, delta.cols, container, selected, annotations);
              });
              return navigation.fold(() => {
                return getEdges(container, annotations.firstSelectedSelector, annotations.lastSelectedSelector).map(edges => {
                  const relative = isDown(keycode) || direction.isForward(keycode) ? Situ.after : Situ.before;
                  bridge.setRelativeSelection(Situ.on(edges.first, 0), relative(edges.table));
                  annotations.clear(container);
                  return Response.create(Optional.none(), true);
                });
              }, _ => {
                return Optional.some(Response.create(Optional.none(), true));
              });
            };
          };
          if (isNavigation(keycode) && shiftKey && !isEditableSelection(start, finish)) {
            return Optional.none;
          } else if (isDown(keycode) && shiftKey) {
            return update$1([rc(+1, 0)]);
          } else if (isUp(keycode) && shiftKey) {
            return update$1([rc(-1, 0)]);
          } else if (direction.isBackward(keycode) && shiftKey) {
            return update$1([
              rc(0, -1),
              rc(-1, 0)
            ]);
          } else if (direction.isForward(keycode) && shiftKey) {
            return update$1([
              rc(0, +1),
              rc(+1, 0)
            ]);
          } else if (isNavigation(keycode) && !shiftKey) {
            return clearToNavigate;
          } else {
            return Optional.none;
          }
        });
        return handler();
      };
      const keyup = (event, start, soffset, finish, foffset) => {
        return retrieve$1(container, annotations.selectedSelector).fold(() => {
          const realEvent = event.raw;
          const keycode = realEvent.which;
          const shiftKey = realEvent.shiftKey === true;
          if (!shiftKey) {
            return Optional.none();
          }
          if (isNavigation(keycode) && isEditableSelection(start, finish)) {
            return sync(container, isRoot, start, soffset, finish, foffset, annotations.selectRange);
          } else {
            return Optional.none();
          }
        }, Optional.none);
      };
      return {
        keydown,
        keyup
      };
    };
    const e***REMOVED***ternal = (win, container, isRoot, annotations) => {
      const bridge = WindowBridge(win);
      return (start, finish) => {
        annotations.clearBeforeUpdate(container);
        identify(start, finish, isRoot).each(cellSel => {
          const bo***REMOVED***es = cellSel.bo***REMOVED***es.getOr([]);
          annotations.selectRange(container, bo***REMOVED***es, cellSel.start, cellSel.finish);
          bridge.selectContents(finish);
          bridge.collapseSelection();
        });
      };
    };

    const read = (element, attr) => {
      const value = get$b(element, attr);
      return value === undefined || value === '' ? [] : value.split(' ');
    };
    const add$2 = (element, attr, id) => {
      const old = read(element, attr);
      const nu = old.concat([id]);
      set$2(element, attr, nu.join(' '));
      return true;
    };
    const remove$4 = (element, attr, id) => {
      const nu = filter$2(read(element, attr), v => v !== id);
      if (nu.length > 0) {
        set$2(element, attr, nu.join(' '));
      } else {
        remove$7(element, attr);
      }
      return false;
    };

    const supports = element => element.dom.classList !== undefined;
    const get$1 = element => read(element, 'class');
    const add$1 = (element, clazz) => add$2(element, 'class', clazz);
    const remove$3 = (element, clazz) => remove$4(element, 'class', clazz);

    const add = (element, clazz) => {
      if (supports(element)) {
        element.dom.classList.add(clazz);
      } else {
        add$1(element, clazz);
      }
    };
    const cleanClass = element => {
      const classList = supports(element) ? element.dom.classList : get$1(element);
      if (classList.length === 0) {
        remove$7(element, 'class');
      }
    };
    const remove$2 = (element, clazz) => {
      if (supports(element)) {
        const classList = element.dom.classList;
        classList.remove(clazz);
      } else {
        remove$3(element, clazz);
      }
      cleanClass(element);
    };
    const has = (element, clazz) => supports(element) && element.dom.classList.contains(clazz);

    const remove$1 = (element, classes) => {
      each$2(classes, ***REMOVED*** => {
        remove$2(element, ***REMOVED***);
      });
    };

    const addClass = clazz => element => {
      add(element, clazz);
    };
    const removeClasses = classes => element => {
      remove$1(element, classes);
    };

    const byClass = ephemera => {
      const addSelectionClass = addClass(ephemera.selected);
      const removeSelectionClasses = removeClasses([
        ephemera.selected,
        ephemera.lastSelected,
        ephemera.firstSelected
      ]);
      const clear = container => {
        const sels = descendants(container, ephemera.selectedSelector);
        each$2(sels, removeSelectionClasses);
      };
      const selectRange = (container, cells, start, finish) => {
        clear(container);
        each$2(cells, addSelectionClass);
        add(start, ephemera.firstSelected);
        add(finish, ephemera.lastSelected);
      };
      return {
        clearBeforeUpdate: clear,
        clear,
        selectRange,
        selectedSelector: ephemera.selectedSelector,
        firstSelectedSelector: ephemera.firstSelectedSelector,
        lastSelectedSelector: ephemera.lastSelectedSelector
      };
    };
    const byAttr = (ephemera, onSelection, onClear) => {
      const removeSelectionAttributes = element => {
        remove$7(element, ephemera.selected);
        remove$7(element, ephemera.firstSelected);
        remove$7(element, ephemera.lastSelected);
      };
      const addSelectionAttribute = element => {
        set$2(element, ephemera.selected, '1');
      };
      const clear = container => {
        clearBeforeUpdate(container);
        onClear();
      };
      const clearBeforeUpdate = container => {
        const sels = descendants(container, `${ ephemera.selectedSelector },${ ephemera.firstSelectedSelector },${ ephemera.lastSelectedSelector }`);
        each$2(sels, removeSelectionAttributes);
      };
      const selectRange = (container, cells, start, finish) => {
        clear(container);
        each$2(cells, addSelectionAttribute);
        set$2(start, ephemera.firstSelected, '1');
        set$2(finish, ephemera.lastSelected, '1');
        onSelection(cells, start, finish);
      };
      return {
        clearBeforeUpdate,
        clear,
        selectRange,
        selectedSelector: ephemera.selectedSelector,
        firstSelectedSelector: ephemera.firstSelectedSelector,
        lastSelectedSelector: ephemera.lastSelectedSelector
      };
    };
    const SelectionAnnotation = {
      byClass,
      byAttr
    };

    const fold = (subject, onNone, onMultiple, onSingle) => {
      switch (subject.tag) {
      case 'none':
        return onNone();
      case 'single':
        return onSingle(subject.element);
      case 'multiple':
        return onMultiple(subject.elements);
      }
    };
    const none = () => ({ tag: 'none' });
    const multiple = elements => ({
      tag: 'multiple',
      elements
    });
    const single = element => ({
      tag: 'single',
      element
    });

    const Selections = (lazyRoot, getStart, selectedSelector) => {
      const get = () => retrieve(lazyRoot(), selectedSelector).fold(() => getStart().fold(none, single), multiple);
      return { get };
    };

    const getUpOrLeftCells = (grid, selectedCells) => {
      const upGrid = grid.slice(0, selectedCells[selectedCells.length - 1].row + 1);
      const upDetails = toDetailList(upGrid);
      return bind$2(upDetails, detail => {
        const slicedCells = detail.cells.slice(0, selectedCells[selectedCells.length - 1].column + 1);
        return map$1(slicedCells, cell => cell.element);
      });
    };
    const getDownOrRightCells = (grid, selectedCells) => {
      const downGrid = grid.slice(selectedCells[0].row + selectedCells[0].rowspan - 1, grid.length);
      const downDetails = toDetailList(downGrid);
      return bind$2(downDetails, detail => {
        const slicedCells = detail.cells.slice(selectedCells[0].column + selectedCells[0].colspan - 1, detail.cells.length);
        return map$1(slicedCells, cell => cell.element);
      });
    };
    const getOtherCells = (table, target, generators) => {
      const warehouse = Warehouse.fromTable(table);
      const details = onCells(warehouse, target);
      return details.map(selectedCells => {
        const grid = toGrid(warehouse, generators, false);
        const {rows} = e***REMOVED***tractGridDetails(grid);
        const upOrLeftCells = getUpOrLeftCells(rows, selectedCells);
        const downOrRightCells = getDownOrRightCells(rows, selectedCells);
        return {
          upOrLeftCells,
          downOrRightCells
        };
      });
    };

    const mkEvent = (target, ***REMOVED***, y, stop, prevent, kill, raw) => ({
      target,
      ***REMOVED***,
      y,
      stop,
      prevent,
      kill,
      raw
    });
    const fromRawEvent$1 = rawEvent => {
      const target = SugarElement.fromDom(getOriginalEventTarget(rawEvent).getOr(rawEvent.target));
      const stop = () => rawEvent.stopPropagation();
      const prevent = () => rawEvent.preventDefault();
      const kill = compose(prevent, stop);
      return mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
    };
    const handle = (filter, handler) => rawEvent => {
      if (filter(rawEvent)) {
        handler(fromRawEvent$1(rawEvent));
      }
    };
    const binder = (element, event, filter, handler, useCapture) => {
      const wrapped = handle(filter, handler);
      element.dom.addEventListener(event, wrapped, useCapture);
      return { unbind: curry(unbind, element, event, wrapped, useCapture) };
    };
    const bind$1 = (element, event, filter, handler) => binder(element, event, filter, handler, false);
    const unbind = (element, event, handler, useCapture) => {
      element.dom.removeEventListener(event, handler, useCapture);
    };

    const filter = always;
    const bind = (element, event, handler) => bind$1(element, event, filter, handler);
    const fromRawEvent = fromRawEvent$1;

    const hasInternalTarget = e => !has(SugarElement.fromDom(e.target), 'epho***REMOVED***-snooker-resizer-bar');
    const TableCellSelectionHandler = (editor, resizeHandler) => {
      const cellSelection = Selections(() => SugarElement.fromDom(editor.getBody()), () => getSelectionCell(getSelectionStart(editor), getIsRoot(editor)), ephemera.selectedSelector);
      const onSelection = (cells, start, finish) => {
        const tableOpt = table(start);
        tableOpt.each(table => {
          const cellsDom = map$1(cells, cell => cell.dom);
          const cloneFormats = getTableCloneElements(editor);
          const generators = cellOperations(noop, SugarElement.fromDom(editor.getDoc()), cloneFormats);
          const selectedCells = getCellsFromSelection(editor);
          const otherCellsDom = getOtherCells(table, { selection: selectedCells }, generators).map(otherCells => map(otherCells, cellArr => map$1(cellArr, cell => cell.dom))).getOrUndefined();
          fireTableSelectionChange(editor, cellsDom, start.dom, finish.dom, otherCellsDom);
        });
      };
      const onClear = () => fireTableSelectionClear(editor);
      const annotations = SelectionAnnotation.byAttr(ephemera, onSelection, onClear);
      editor.on('init', _e => {
        const win = editor.getWin();
        const body = getBody(editor);
        const isRoot = getIsRoot(editor);
        const syncSelection = () => {
          const sel = editor.selection;
          const start = SugarElement.fromDom(sel.getStart());
          const end = SugarElement.fromDom(sel.getEnd());
          const shared = sharedOne(table, [
            start,
            end
          ]);
          shared.fold(() => annotations.clear(body), noop);
        };
        const mouseHandlers = mouse(win, body, isRoot, annotations);
        const keyHandlers = keyboard(win, body, isRoot, annotations);
        const e***REMOVED***ternal$1 = e***REMOVED***ternal(win, body, isRoot, annotations);
        const hasShiftKey = event => event.raw.shiftKey === true;
        editor.on('TableSelectorChange', e => e***REMOVED***ternal$1(e.start, e.finish));
        const handleResponse = (event, response) => {
          if (!hasShiftKey(event)) {
            return;
          }
          if (response.kill) {
            event.kill();
          }
          response.selection.each(ns => {
            const relative = SimSelection.relative(ns.start, ns.finish);
            const rng = asLtrRange(win, relative);
            editor.selection.setRng(rng);
          });
        };
        const keyup = event => {
          const wrappedEvent = fromRawEvent(event);
          if (wrappedEvent.raw.shiftKey && isNavigation(wrappedEvent.raw.which)) {
            const rng = editor.selection.getRng();
            const start = SugarElement.fromDom(rng.startContainer);
            const end = SugarElement.fromDom(rng.endContainer);
            keyHandlers.keyup(wrappedEvent, start, rng.startOffset, end, rng.endOffset).each(response => {
              handleResponse(wrappedEvent, response);
            });
          }
        };
        const keydown = event => {
          const wrappedEvent = fromRawEvent(event);
          resizeHandler.hide();
          const rng = editor.selection.getRng();
          const start = SugarElement.fromDom(rng.startContainer);
          const end = SugarElement.fromDom(rng.endContainer);
          const direction = onDirection(ltr, rtl)(SugarElement.fromDom(editor.selection.getStart()));
          keyHandlers.keydown(wrappedEvent, start, rng.startOffset, end, rng.endOffset, direction).each(response => {
            handleResponse(wrappedEvent, response);
          });
          resizeHandler.show();
        };
        const isLeftMouse = raw => raw.button === 0;
        const isLeftButtonPressed = raw => {
          if (raw.buttons === undefined) {
            return true;
          }
          return (raw.buttons & 1) !== 0;
        };
        const dragStart = _e => {
          mouseHandlers.clearstate();
        };
        const mouseDown = e => {
          if (isLeftMouse(e) && hasInternalTarget(e)) {
            mouseHandlers.mousedown(fromRawEvent(e));
          }
        };
        const mouseOver = e => {
          if (isLeftButtonPressed(e) && hasInternalTarget(e)) {
            mouseHandlers.mouseover(fromRawEvent(e));
          }
        };
        const mouseUp = e => {
          if (isLeftMouse(e) && hasInternalTarget(e)) {
            mouseHandlers.mouseup(fromRawEvent(e));
          }
        };
        const getDoubleTap = () => {
          const lastTarget = Cell(SugarElement.fromDom(body));
          const lastTimeStamp = Cell(0);
          const touchEnd = t => {
            const target = SugarElement.fromDom(t.target);
            if (isTag('td')(target) || isTag('th')(target)) {
              const lT = lastTarget.get();
              const lTS = lastTimeStamp.get();
              if (eq$1(lT, target) && t.timeStamp - lTS < 300) {
                t.preventDefault();
                e***REMOVED***ternal$1(target, target);
              }
            }
            lastTarget.set(target);
            lastTimeStamp.set(t.timeStamp);
          };
          return { touchEnd };
        };
        const doubleTap = getDoubleTap();
        editor.on('dragstart', dragStart);
        editor.on('mousedown', mouseDown);
        editor.on('mouseover', mouseOver);
        editor.on('mouseup', mouseUp);
        editor.on('touchend', doubleTap.touchEnd);
        editor.on('keyup', keyup);
        editor.on('keydown', keydown);
        editor.on('NodeChange', syncSelection);
      });
      editor.on('PreInit', () => {
        editor.serializer.addTempAttr(ephemera.firstSelected);
        editor.serializer.addTempAttr(ephemera.lastSelected);
      });
      const clearSelectedCells = container => annotations.clear(SugarElement.fromDom(container));
      const getSelectedCells = () => fold(cellSelection.get(), constant([]), cells => {
        return map$1(cells, cell => cell.dom);
      }, cell => [cell.dom]);
      return {
        getSelectedCells,
        clearSelectedCells
      };
    };

    const Event = fields => {
      let handlers = [];
      const bind = handler => {
        if (handler === undefined) {
          throw new Error('Event bind error: undefined handler');
        }
        handlers.push(handler);
      };
      const unbind = handler => {
        handlers = filter$2(handlers, h => {
          return h !== handler;
        });
      };
      const trigger = (...args) => {
        const event = {};
        each$2(fields, (name, i) => {
          event[name] = args[i];
        });
        each$2(handlers, handler => {
          handler(event);
        });
      };
      return {
        bind,
        unbind,
        trigger
      };
    };

    const create$1 = typeDefs => {
      const registry = map(typeDefs, event => {
        return {
          bind: event.bind,
          unbind: event.unbind
        };
      });
      const trigger = map(typeDefs, event => {
        return event.trigger;
      });
      return {
        registry,
        trigger
      };
    };

    const last = (fn, rate) => {
      let timer = null;
      const cancel = () => {
        if (!isNull(timer)) {
          clearTimeout(timer);
          timer = null;
        }
      };
      const throttle = (...args) => {
        cancel();
        timer = setTimeout(() => {
          timer = null;
          fn.apply(null, args);
        }, rate);
      };
      return {
        cancel,
        throttle
      };
    };

    const sort = arr => {
      return arr.slice(0).sort();
    };
    const reqMessage = (required, keys) => {
      throw new Error('All required keys (' + sort(required).join(', ') + ') were not specified. Specified keys were: ' + sort(keys).join(', ') + '.');
    };
    const unsuppMessage = unsupported => {
      throw new Error('Unsupported keys for object: ' + sort(unsupported).join(', '));
    };
    const validateStrArr = (label, array) => {
      if (!isArray(array)) {
        throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
      }
      each$2(array, a => {
        if (!isString(a)) {
          throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
        }
      });
    };
    const invalidTypeMessage = (incorrect, type) => {
      throw new Error('All values need to be of type: ' + type + '. Keys (' + sort(incorrect).join(', ') + ') were not.');
    };
    const checkDupes = everything => {
      const sorted = sort(everything);
      const dupe = find$1(sorted, (s, i) => {
        return i < sorted.length - 1 && s === sorted[i + 1];
      });
      dupe.each(d => {
        throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
      });
    };

    const base = (handleUnsupported, required) => {
      return baseWith(handleUnsupported, required, {
        validate: isFunction,
        label: 'function'
      });
    };
    const baseWith = (handleUnsupported, required, pred) => {
      if (required.length === 0) {
        throw new Error('You must specify at least one required field.');
      }
      validateStrArr('required', required);
      checkDupes(required);
      return obj => {
        const keys$1 = keys(obj);
        const allReqd = forall(required, req => {
          return contains$2(keys$1, req);
        });
        if (!allReqd) {
          reqMessage(required, keys$1);
        }
        handleUnsupported(required, keys$1);
        const invalidKeys = filter$2(required, key => {
          return !pred.validate(obj[key], key);
        });
        if (invalidKeys.length > 0) {
          invalidTypeMessage(invalidKeys, pred.label);
        }
        return obj;
      };
    };
    const handleE***REMOVED***act = (required, keys) => {
      const unsupported = filter$2(keys, key => {
        return !contains$2(required, key);
      });
      if (unsupported.length > 0) {
        unsuppMessage(unsupported);
      }
    };
    const e***REMOVED***actly = required => base(handleE***REMOVED***act, required);

    const DragMode = e***REMOVED***actly([
      'compare',
      'e***REMOVED***tract',
      'mutate',
      'sink'
    ]);
    const DragSink = e***REMOVED***actly([
      'element',
      'start',
      'stop',
      'destroy'
    ]);
    const DragApi = e***REMOVED***actly([
      'forceDrop',
      'drop',
      'move',
      'delayDrop'
    ]);

    const InDrag = () => {
      let previous = Optional.none();
      const reset = () => {
        previous = Optional.none();
      };
      const update = (mode, nu) => {
        const result = previous.map(old => {
          return mode.compare(old, nu);
        });
        previous = Optional.some(nu);
        return result;
      };
      const onEvent = (event, mode) => {
        const dataOption = mode.e***REMOVED***tract(event);
        dataOption.each(data => {
          const offset = update(mode, data);
          offset.each(d => {
            events.trigger.move(d);
          });
        });
      };
      const events = create$1({ move: Event(['info']) });
      return {
        onEvent,
        reset,
        events: events.registry
      };
    };

    const NoDrag = () => {
      const events = create$1({ move: Event(['info']) });
      return {
        onEvent: noop,
        reset: noop,
        events: events.registry
      };
    };

    const Movement = () => {
      const noDragState = NoDrag();
      const inDragState = InDrag();
      let dragState = noDragState;
      const on = () => {
        dragState.reset();
        dragState = inDragState;
      };
      const off = () => {
        dragState.reset();
        dragState = noDragState;
      };
      const onEvent = (event, mode) => {
        dragState.onEvent(event, mode);
      };
      const isOn = () => {
        return dragState === inDragState;
      };
      return {
        on,
        off,
        isOn,
        onEvent,
        events: inDragState.events
      };
    };

    const setup = (mutation, mode, settings) => {
      let active = false;
      const events = create$1({
        start: Event([]),
        stop: Event([])
      });
      const movement = Movement();
      const drop = () => {
        sink.stop();
        if (movement.isOn()) {
          movement.off();
          events.trigger.stop();
        }
      };
      const throttledDrop = last(drop, 200);
      const go = parent => {
        sink.start(parent);
        movement.on();
        events.trigger.start();
      };
      const mousemove = event => {
        throttledDrop.cancel();
        movement.onEvent(event, mode);
      };
      movement.events.move.bind(event => {
        mode.mutate(mutation, event.info);
      });
      const on = () => {
        active = true;
      };
      const off = () => {
        active = false;
      };
      const isActive = () => active;
      const runIfActive = f => {
        return (...args) => {
          if (active) {
            f.apply(null, args);
          }
        };
      };
      const sink = mode.sink(DragApi({
        forceDrop: drop,
        drop: runIfActive(drop),
        move: runIfActive(mousemove),
        delayDrop: runIfActive(throttledDrop.throttle)
      }), settings);
      const destroy = () => {
        sink.destroy();
      };
      return {
        element: sink.element,
        go,
        on,
        off,
        isActive,
        destroy,
        events: events.registry
      };
    };

    const css = namespace => {
      const dashNamespace = namespace.replace(/\./g, '-');
      const resolve = str => {
        return dashNamespace + '-' + str;
      };
      return { resolve };
    };

    const styles$1 = css('epho***REMOVED***-dragster');
    const resolve$1 = styles$1.resolve;

    const Blocker = options => {
      const settings = {
        layerClass: resolve$1('blocker'),
        ...options
      };
      const div = SugarElement.fromTag('div');
      set$2(div, 'role', 'presentation');
      setAll(div, {
        position: 'fi***REMOVED***ed',
        left: '0p***REMOVED***',
        top: '0p***REMOVED***',
        width: '100%',
        height: '100%'
      });
      add(div, resolve$1('blocker'));
      add(div, settings.layerClass);
      const element = constant(div);
      const destroy = () => {
        remove$6(div);
      };
      return {
        element,
        destroy
      };
    };

    const compare = (old, nu) => {
      return SugarPosition(nu.left - old.left, nu.top - old.top);
    };
    const e***REMOVED***tract = event => {
      return Optional.some(SugarPosition(event.***REMOVED***, event.y));
    };
    const mutate = (mutation, info) => {
      mutation.mutate(info.left, info.top);
    };
    const sink = (dragApi, settings) => {
      const blocker = Blocker(settings);
      const mdown = bind(blocker.element(), 'mousedown', dragApi.forceDrop);
      const mup = bind(blocker.element(), 'mouseup', dragApi.drop);
      const mmove = bind(blocker.element(), 'mousemove', dragApi.move);
      const mout = bind(blocker.element(), 'mouseout', dragApi.delayDrop);
      const destroy = () => {
        blocker.destroy();
        mup.unbind();
        mmove.unbind();
        mout.unbind();
        mdown.unbind();
      };
      const start = parent => {
        append$1(parent, blocker.element());
      };
      const stop = () => {
        remove$6(blocker.element());
      };
      return DragSink({
        element: blocker.element,
        start,
        stop,
        destroy
      });
    };
    var MouseDrag = DragMode({
      compare,
      e***REMOVED***tract,
      sink,
      mutate
    });

    const transform = (mutation, settings = {}) => {
      var _a;
      const mode = (_a = settings.mode) !== null && _a !== void 0 ? _a : MouseDrag;
      return setup(mutation, mode, settings);
    };

    const styles = css('epho***REMOVED***-snooker');
    const resolve = styles.resolve;

    const Mutation = () => {
      const events = create$1({
        drag: Event([
          '***REMOVED***Delta',
          'yDelta'
        ])
      });
      const mutate = (***REMOVED***, y) => {
        events.trigger.drag(***REMOVED***, y);
      };
      return {
        mutate,
        events: events.registry
      };
    };

    const BarMutation = () => {
      const events = create$1({
        drag: Event([
          '***REMOVED***Delta',
          'yDelta',
          'target'
        ])
      });
      let target = Optional.none();
      const delegate = Mutation();
      delegate.events.drag.bind(event => {
        target.each(t => {
          events.trigger.drag(event.***REMOVED***Delta, event.yDelta, t);
        });
      });
      const assign = t => {
        target = Optional.some(t);
      };
      const get = () => {
        return target;
      };
      return {
        assign,
        get,
        mutate: delegate.mutate,
        events: events.registry
      };
    };

    const col = (column, ***REMOVED***, y, w, h) => {
      const bar = SugarElement.fromTag('div');
      setAll(bar, {
        position: 'absolute',
        left: ***REMOVED*** - w / 2 + 'p***REMOVED***',
        top: y + 'p***REMOVED***',
        height: h + 'p***REMOVED***',
        width: w + 'p***REMOVED***'
      });
      setAll$1(bar, {
        'data-column': column,
        'role': 'presentation'
      });
      return bar;
    };
    const row = (r, ***REMOVED***, y, w, h) => {
      const bar = SugarElement.fromTag('div');
      setAll(bar, {
        position: 'absolute',
        left: ***REMOVED*** + 'p***REMOVED***',
        top: y - h / 2 + 'p***REMOVED***',
        height: h + 'p***REMOVED***',
        width: w + 'p***REMOVED***'
      });
      setAll$1(bar, {
        'data-row': r,
        'role': 'presentation'
      });
      return bar;
    };

    const resizeBar = resolve('resizer-bar');
    const resizeRowBar = resolve('resizer-rows');
    const resizeColBar = resolve('resizer-cols');
    const BAR_THICKNESS = 7;
    const resizableRows = (warehouse, isResizable) => bind$2(warehouse.all, (row, i) => isResizable(row.element) ? [i] : []);
    const resizableColumns = (warehouse, isResizable) => {
      const resizableCols = [];
      range$1(warehouse.grid.columns, inde***REMOVED*** => {
        const colElmOpt = Warehouse.getColumnAt(warehouse, inde***REMOVED***).map(col => col.element);
        if (colElmOpt.forall(isResizable)) {
          resizableCols.push(inde***REMOVED***);
        }
      });
      return filter$2(resizableCols, colInde***REMOVED*** => {
        const columnCells = Warehouse.filterItems(warehouse, cell => cell.column === colInde***REMOVED***);
        return forall(columnCells, cell => isResizable(cell.element));
      });
    };
    const destroy = wire => {
      const previous = descendants(wire.parent(), '.' + resizeBar);
      each$2(previous, remove$6);
    };
    const drawBar = (wire, positions, create) => {
      const origin = wire.origin();
      each$2(positions, cpOption => {
        cpOption.each(cp => {
          const bar = create(origin, cp);
          add(bar, resizeBar);
          append$1(wire.parent(), bar);
        });
      });
    };
    const refreshCol = (wire, colPositions, position, tableHeight) => {
      drawBar(wire, colPositions, (origin, cp) => {
        const colBar = col(cp.col, cp.***REMOVED*** - origin.left, position.top - origin.top, BAR_THICKNESS, tableHeight);
        add(colBar, resizeColBar);
        return colBar;
      });
    };
    const refreshRow = (wire, rowPositions, position, tableWidth) => {
      drawBar(wire, rowPositions, (origin, cp) => {
        const rowBar = row(cp.row, position.left - origin.left, cp.y - origin.top, tableWidth, BAR_THICKNESS);
        add(rowBar, resizeRowBar);
        return rowBar;
      });
    };
    const refreshGrid = (warhouse, wire, table, rows, cols) => {
      const position = absolute(table);
      const isResizable = wire.isResizable;
      const rowPositions = rows.length > 0 ? height.positions(rows, table) : [];
      const resizableRowBars = rowPositions.length > 0 ? resizableRows(warhouse, isResizable) : [];
      const resizableRowPositions = filter$2(rowPositions, (_pos, i) => e***REMOVED***ists(resizableRowBars, barInde***REMOVED*** => i === barInde***REMOVED***));
      refreshRow(wire, resizableRowPositions, position, getOuter$2(table));
      const colPositions = cols.length > 0 ? width.positions(cols, table) : [];
      const resizableColBars = colPositions.length > 0 ? resizableColumns(warhouse, isResizable) : [];
      const resizableColPositions = filter$2(colPositions, (_pos, i) => e***REMOVED***ists(resizableColBars, barInde***REMOVED*** => i === barInde***REMOVED***));
      refreshCol(wire, resizableColPositions, position, getOuter$1(table));
    };
    const refresh = (wire, table) => {
      destroy(wire);
      if (wire.isResizable(table)) {
        const warehouse = Warehouse.fromTable(table);
        const rows$1 = rows(warehouse);
        const cols = columns(warehouse);
        refreshGrid(warehouse, wire, table, rows$1, cols);
      }
    };
    const each = (wire, f) => {
      const bars = descendants(wire.parent(), '.' + resizeBar);
      each$2(bars, f);
    };
    const hide = wire => {
      each(wire, bar => {
        set$1(bar, 'display', 'none');
      });
    };
    const show = wire => {
      each(wire, bar => {
        set$1(bar, 'display', 'block');
      });
    };
    const isRowBar = element => {
      return has(element, resizeRowBar);
    };
    const isColBar = element => {
      return has(element, resizeColBar);
    };

    const resizeBarDragging = resolve('resizer-bar-dragging');
    const BarManager = wire => {
      const mutation = BarMutation();
      const resizing = transform(mutation, {});
      let hoverTable = Optional.none();
      const getResizer = (element, type) => {
        return Optional.from(get$b(element, type));
      };
      mutation.events.drag.bind(event => {
        getResizer(event.target, 'data-row').each(_dataRow => {
          const currentRow = getCssValue(event.target, 'top');
          set$1(event.target, 'top', currentRow + event.yDelta + 'p***REMOVED***');
        });
        getResizer(event.target, 'data-column').each(_dataCol => {
          const currentCol = getCssValue(event.target, 'left');
          set$1(event.target, 'left', currentCol + event.***REMOVED***Delta + 'p***REMOVED***');
        });
      });
      const getDelta = (target, dir) => {
        const newX = getCssValue(target, dir);
        const oldX = getAttrValue(target, 'data-initial-' + dir, 0);
        return newX - oldX;
      };
      resizing.events.stop.bind(() => {
        mutation.get().each(target => {
          hoverTable.each(table => {
            getResizer(target, 'data-row').each(row => {
              const delta = getDelta(target, 'top');
              remove$7(target, 'data-initial-top');
              events.trigger.adjustHeight(table, delta, parseInt(row, 10));
            });
            getResizer(target, 'data-column').each(column => {
              const delta = getDelta(target, 'left');
              remove$7(target, 'data-initial-left');
              events.trigger.adjustWidth(table, delta, parseInt(column, 10));
            });
            refresh(wire, table);
          });
        });
      });
      const handler = (target, dir) => {
        events.trigger.startAdjust();
        mutation.assign(target);
        set$2(target, 'data-initial-' + dir, getCssValue(target, dir));
        add(target, resizeBarDragging);
        set$1(target, 'opacity', '0.2');
        resizing.go(wire.parent());
      };
      const mousedown = bind(wire.parent(), 'mousedown', event => {
        if (isRowBar(event.target)) {
          handler(event.target, 'top');
        }
        if (isColBar(event.target)) {
          handler(event.target, 'left');
        }
      });
      const isRoot = e => {
        return eq$1(e, wire.view());
      };
      const findClosestEditableTable = target => closest$1(target, 'table', isRoot).filter(isEditable$1);
      const mouseover = bind(wire.view(), 'mouseover', event => {
        findClosestEditableTable(event.target).fold(() => {
          if (inBody(event.target)) {
            destroy(wire);
          }
        }, table => {
          if (resizing.isActive()) {
            hoverTable = Optional.some(table);
            refresh(wire, table);
          }
        });
      });
      const destroy$1 = () => {
        mousedown.unbind();
        mouseover.unbind();
        resizing.destroy();
        destroy(wire);
      };
      const refresh$1 = tbl => {
        refresh(wire, tbl);
      };
      const events = create$1({
        adjustHeight: Event([
          'table',
          'delta',
          'row'
        ]),
        adjustWidth: Event([
          'table',
          'delta',
          'column'
        ]),
        startAdjust: Event([])
      });
      return {
        destroy: destroy$1,
        refresh: refresh$1,
        on: resizing.on,
        off: resizing.off,
        hideBars: curry(hide, wire),
        showBars: curry(show, wire),
        events: events.registry
      };
    };

    const create = (wire, resizing, lazySizing) => {
      const hdirection = height;
      const vdirection = width;
      const manager = BarManager(wire);
      const events = create$1({
        beforeResize: Event([
          'table',
          'type'
        ]),
        afterResize: Event([
          'table',
          'type'
        ]),
        startDrag: Event([])
      });
      manager.events.adjustHeight.bind(event => {
        const table = event.table;
        events.trigger.beforeResize(table, 'row');
        const delta = hdirection.delta(event.delta, table);
        adjustHeight(table, delta, event.row);
        events.trigger.afterResize(table, 'row');
      });
      manager.events.startAdjust.bind(_event => {
        events.trigger.startDrag();
      });
      manager.events.adjustWidth.bind(event => {
        const table = event.table;
        events.trigger.beforeResize(table, 'col');
        const delta = vdirection.delta(event.delta, table);
        const tableSize = lazySizing(table);
        adjustWidth(table, delta, event.column, resizing, tableSize);
        events.trigger.afterResize(table, 'col');
      });
      return {
        on: manager.on,
        off: manager.off,
        refreshBars: manager.refresh,
        hideBars: manager.hideBars,
        showBars: manager.showBars,
        destroy: manager.destroy,
        events: events.registry
      };
    };
    const TableResize = { create };

    const only = (element, isResizable) => {
      const parent = isDocument(element) ? documentElement(element) : element;
      return {
        parent: constant(parent),
        view: constant(element),
        origin: constant(SugarPosition(0, 0)),
        isResizable
      };
    };
    const detached = (editable, chrome, isResizable) => {
      const origin = () => absolute(chrome);
      return {
        parent: constant(chrome),
        view: constant(editable),
        origin,
        isResizable
      };
    };
    const body = (editable, chrome, isResizable) => {
      return {
        parent: constant(chrome),
        view: constant(editable),
        origin: constant(SugarPosition(0, 0)),
        isResizable
      };
    };
    const ResizeWire = {
      only,
      detached,
      body
    };

    const createContainer = () => {
      const container = SugarElement.fromTag('div');
      setAll(container, {
        position: 'static',
        height: '0',
        width: '0',
        padding: '0',
        margin: '0',
        border: '0'
      });
      append$1(body$1(), container);
      return container;
    };
    const get = (editor, isResizable) => {
      return editor.inline ? ResizeWire.body(SugarElement.fromDom(editor.getBody()), createContainer(), isResizable) : ResizeWire.only(SugarElement.fromDom(editor.getDoc()), isResizable);
    };
    const remove = (editor, wire) => {
      if (editor.inline) {
        remove$6(wire.parent());
      }
    };

    const isTable = node => isNonNullable(node) && node.nodeName === 'TABLE';
    const barResizerPrefi***REMOVED*** = 'bar-';
    const isResizable = elm => get$b(elm, 'data-mce-resize') !== 'false';
    const syncTableCellPi***REMOVED***els = table => {
      const warehouse = Warehouse.fromTable(table);
      if (!Warehouse.hasColumns(warehouse)) {
        each$2(cells$1(table), cell => {
          const computedWidth = get$a(cell, 'width');
          set$1(cell, 'width', computedWidth);
          remove$7(cell, 'width');
        });
      }
    };
    const isCornerResize = origin => startsWith(origin, 'corner-');
    const getCornerLocation = origin => removeLeading(origin, 'corner-');
    const TableResizeHandler = editor => {
      const selectionRng = value();
      const tableResize = value();
      const resizeWire = value();
      let startW;
      let startRawW;
      let startH;
      let startRawH;
      const lazySizing = table => get$5(editor, table);
      const lazyResizingBehaviour = () => isPreserveTableColumnResizing(editor) ? preserveTable() : resizeTable();
      const getNumColumns = table => getGridSize(table).columns;
      const getNumRows = table => getGridSize(table).rows;
      const afterCornerResize = (table, origin, width, height) => {
        const location = getCornerLocation(origin);
        const isRightEdgeResize = endsWith(location, 'e');
        const isNorthEdgeResize = startsWith(location, 'n');
        if (startRawW === '') {
          convertToPercentSizeWidth(table);
        }
        if (startRawH === '') {
          convertToPi***REMOVED***elSizeHeight(table);
        }
        if (width !== startW && startRawW !== '') {
          set$1(table, 'width', startRawW);
          const resizing = lazyResizingBehaviour();
          const tableSize = lazySizing(table);
          const col = isPreserveTableColumnResizing(editor) || isRightEdgeResize ? getNumColumns(table) - 1 : 0;
          adjustWidth(table, width - startW, col, resizing, tableSize);
        } else if (isPercentage$1(startRawW)) {
          const percentW = parseFloat(startRawW.replace('%', ''));
          const targetPercentW = width * percentW / startW;
          set$1(table, 'width', targetPercentW + '%');
        }
        if (isPi***REMOVED***el(startRawW)) {
          syncTableCellPi***REMOVED***els(table);
        }
        if (height !== startH && startRawH !== '') {
          set$1(table, 'height', startRawH);
          const id***REMOVED*** = isNorthEdgeResize ? 0 : getNumRows(table) - 1;
          adjustHeight(table, height - startH, id***REMOVED***);
        }
      };
      const destroy = () => {
        tableResize.on(sz => {
          sz.destroy();
        });
        resizeWire.on(w => {
          remove(editor, w);
        });
      };
      editor.on('init', () => {
        const rawWire = get(editor, isResizable);
        resizeWire.set(rawWire);
        if (hasTableObjectResizing(editor) && hasTableResizeBars(editor)) {
          const resizing = lazyResizingBehaviour();
          const sz = TableResize.create(rawWire, resizing, lazySizing);
          sz.on();
          sz.events.startDrag.bind(_event => {
            selectionRng.set(editor.selection.getRng());
          });
          sz.events.beforeResize.bind(event => {
            const rawTable = event.table.dom;
            fireObjectResizeStart(editor, rawTable, getPi***REMOVED***elWidth(rawTable), getPi***REMOVED***elHeight(rawTable), barResizerPrefi***REMOVED*** + event.type);
          });
          sz.events.afterResize.bind(event => {
            const table = event.table;
            const rawTable = table.dom;
            removeDataStyle(table);
            selectionRng.on(rng => {
              editor.selection.setRng(rng);
              editor.focus();
            });
            fireObjectResized(editor, rawTable, getPi***REMOVED***elWidth(rawTable), getPi***REMOVED***elHeight(rawTable), barResizerPrefi***REMOVED*** + event.type);
            editor.undoManager.add();
          });
          tableResize.set(sz);
        }
      });
      editor.on('ObjectResizeStart', e => {
        const targetElm = e.target;
        if (isTable(targetElm)) {
          const table = SugarElement.fromDom(targetElm);
          each$2(editor.dom.select('.mce-clonedresizable'), clone => {
            editor.dom.addClass(clone, 'mce-' + getTableColumnResizingBehaviour(editor) + '-columns');
          });
          if (!isPi***REMOVED***elSizing(table) && isTablePi***REMOVED***elsForced(editor)) {
            convertToPi***REMOVED***elSizeWidth(table);
          } else if (!isPercentSizing(table) && isTablePercentagesForced(editor)) {
            convertToPercentSizeWidth(table);
          }
          if (isNoneSizing(table) && startsWith(e.origin, barResizerPrefi***REMOVED***)) {
            convertToPercentSizeWidth(table);
          }
          startW = e.width;
          startRawW = isTableResponsiveForced(editor) ? '' : getRawWidth(editor, targetElm).getOr('');
          startH = e.height;
          startRawH = getRawHeight(editor, targetElm).getOr('');
        }
      });
      editor.on('ObjectResized', e => {
        const targetElm = e.target;
        if (isTable(targetElm)) {
          const table = SugarElement.fromDom(targetElm);
          const origin = e.origin;
          if (isCornerResize(origin)) {
            afterCornerResize(table, origin, e.width, e.height);
          }
          removeDataStyle(table);
          fireTableModified(editor, table.dom, styleModified);
        }
      });
      editor.on('SwitchMode', () => {
        tableResize.on(resize => {
          if (editor.mode.isReadOnly()) {
            resize.hideBars();
          } else {
            resize.showBars();
          }
        });
      });
      editor.on('dragstart dragend', e => {
        tableResize.on(resize => {
          if (e.type === 'dragstart') {
            resize.hideBars();
            resize.off();
          } else {
            resize.on();
            resize.showBars();
          }
        });
      });
      editor.on('remove', () => {
        destroy();
      });
      const refresh = table => {
        tableResize.on(resize => resize.refreshBars(SugarElement.fromDom(table)));
      };
      const hide = () => {
        tableResize.on(resize => resize.hideBars());
      };
      const show = () => {
        tableResize.on(resize => resize.showBars());
      };
      return {
        refresh,
        hide,
        show
      };
    };

    const setupTable = editor => {
      register(editor);
      const resizeHandler = TableResizeHandler(editor);
      const cellSelectionHandler = TableCellSelectionHandler(editor, resizeHandler);
      const actions = TableActions(editor, resizeHandler, cellSelectionHandler);
      registerCommands(editor, actions);
      registerQueryCommands(editor, actions);
      registerEvents(editor, actions);
      return {
        getSelectedCells: cellSelectionHandler.getSelectedCells,
        clearSelectedCells: cellSelectionHandler.clearSelectedCells
      };
    };

    const DomModel = editor => {
      const table = setupTable(editor);
      return { table };
    };
    var Model = () => {
      global$1.add('dom', DomModel);
    };

    Model();

})();
