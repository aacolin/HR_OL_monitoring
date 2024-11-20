/**
 * TinyMCE version 7.2.1 (2024-07-03)
 */

(function () {
    'use strict';

    var global$3 = tinymce.util.Tools.resolve('tinymce.PluginManager');

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
    const eq$1 = t => a => t === a;
    const isString = isType$1('string');
    const isArray = isType$1('array');
    const isBoolean = isSimpleType('boolean');
    const isUndefined = eq$1(undefined);
    const isNullable = a => a === null || a === undefined;
    const isNonNullable = a => !isNullable(a);
    const isFunction = isSimpleType('function');
    const isNumber = isSimpleType('number');

    const noop = () => {
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
    const call = f => {
      f();
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
    const size = obj => {
      return keys(obj).length;
    };
    const get$4 = (obj, key) => {
      return has(obj, key) ? Optional.from(obj[key]) : Optional.none();
    };
    const has = (obj, key) => hasOwnProperty.call(obj, key);
    const hasNonNullableKey = (obj, key) => has(obj, key) && obj[key] !== undefined && obj[key] !== null;
    const isEmpty$1 = r => {
      for (const ***REMOVED*** in r) {
        if (hasOwnProperty.call(r, ***REMOVED***)) {
          return false;
        }
      }
      return true;
    };

    const nativeInde***REMOVED***Of = Array.prototype.inde***REMOVED***Of;
    const nativePush = Array.prototype.push;
    const rawInde***REMOVED***Of = (ts, t) => nativeInde***REMOVED***Of.call(ts, t);
    const contains = (***REMOVED***s, ***REMOVED***) => rawInde***REMOVED***Of(***REMOVED***s, ***REMOVED***) > -1;
    const e***REMOVED***ists = (***REMOVED***s, pred) => {
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        if (pred(***REMOVED***, i)) {
          return true;
        }
      }
      return false;
    };
    const range = (num, f) => {
      const r = [];
      for (let i = 0; i < num; i++) {
        r.push(f(i));
      }
      return r;
    };
    const map = (***REMOVED***s, f) => {
      const len = ***REMOVED***s.length;
      const r = new Array(len);
      for (let i = 0; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        r[i] = f(***REMOVED***, i);
      }
      return r;
    };
    const each = (***REMOVED***s, f) => {
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
    const filter = (***REMOVED***s, pred) => {
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
      each(***REMOVED***s, (***REMOVED***, i) => {
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
    const find = (***REMOVED***s, pred) => {
      return findUntil(***REMOVED***s, pred, never);
    };
    const flatten$1 = ***REMOVED***s => {
      const r = [];
      for (let i = 0, len = ***REMOVED***s.length; i < len; ++i) {
        if (!isArray(***REMOVED***s[i])) {
          throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + ***REMOVED***s);
        }
        nativePush.apply(r, ***REMOVED***s[i]);
      }
      return r;
    };
    const bind = (***REMOVED***s, f) => flatten$1(map(***REMOVED***s, f));
    const forall = (***REMOVED***s, pred) => {
      for (let i = 0, len = ***REMOVED***s.length; i < len; ++i) {
        const ***REMOVED*** = ***REMOVED***s[i];
        if (pred(***REMOVED***, i) !== true) {
          return false;
        }
      }
      return true;
    };
    const mapToObject = (***REMOVED***s, f) => {
      const r = {};
      for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        r[String(***REMOVED***)] = f(***REMOVED***, i);
      }
      return r;
    };
    const get$3 = (***REMOVED***s, i) => i >= 0 && i < ***REMOVED***s.length ? Optional.some(***REMOVED***s[i]) : Optional.none();
    const head = ***REMOVED***s => get$3(***REMOVED***s, 0);
    const last = ***REMOVED***s => get$3(***REMOVED***s, ***REMOVED***s.length - 1);
    const findMap = (arr, f) => {
      for (let i = 0; i < arr.length; i++) {
        const r = f(arr[i], i);
        if (r.isSome()) {
          return r;
        }
      }
      return Optional.none();
    };

    const COMMENT = 8;
    const DOCUMENT = 9;
    const DOCUMENT_FRAGMENT = 11;
    const ELEMENT = 1;
    const TEXT = 3;

    const fromHtml = (html, scope) => {
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
    const fromPoint = (docElm, ***REMOVED***, y) => Optional.from(docElm.dom.elementFromPoint(***REMOVED***, y)).map(fromDom$1);
    const SugarElement = {
      fromHtml,
      fromTag,
      fromTe***REMOVED***t,
      fromDom: fromDom$1,
      fromPoint
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
      return bypassSelector(base) ? [] : map(base.querySelectorAll(selector), SugarElement.fromDom);
    };
    const one = (selector, scope) => {
      const base = scope === undefined ? document : scope.dom;
      return bypassSelector(base) ? Optional.none() : Optional.from(base.querySelector(selector)).map(SugarElement.fromDom);
    };

    const eq = (e1, e2) => e1.dom === e2.dom;
    const is$1 = is$2;

    typeof window !== 'undefined' ? window : Function('return this;')();

    const name = element => {
      const r = element.dom.nodeName;
      return r.toLowerCase();
    };
    const type = element => element.dom.nodeType;
    const isType = t => element => type(element) === t;
    const isComment = element => type(element) === COMMENT || name(element) === '#comment';
    const isElement = isType(ELEMENT);
    const isTe***REMOVED***t = isType(TEXT);
    const isDocument = isType(DOCUMENT);
    const isDocumentFragment = isType(DOCUMENT_FRAGMENT);
    const isTag = tag => e => isElement(e) && name(e) === tag;

    const owner = element => SugarElement.fromDom(element.dom.ownerDocument);
    const documentOrOwner = dos => isDocument(dos) ? dos : owner(dos);
    const parent = element => Optional.from(element.dom.parentNode).map(SugarElement.fromDom);
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
    const children$3 = element => map(element.dom.childNodes, SugarElement.fromDom);
    const child$3 = (element, inde***REMOVED***) => {
      const cs = element.dom.childNodes;
      return Optional.from(cs[inde***REMOVED***]).map(SugarElement.fromDom);
    };
    const firstChild = element => child$3(element, 0);

    const isShadowRoot = dos => isDocumentFragment(dos) && isNonNullable(dos.dom.host);
    const supported = isFunction(Element.prototype.attachShadow) && isFunction(Node.prototype.getRootNode);
    const getRootNode = supported ? e => SugarElement.fromDom(e.dom.getRootNode()) : documentOrOwner;
    const getShadowRoot = e => {
      const r = getRootNode(e);
      return isShadowRoot(r) ? Optional.some(r) : Optional.none();
    };
    const getShadowHost = e => SugarElement.fromDom(e.dom.host);

    const inBody = element => {
      const dom = isTe***REMOVED***t(element) ? element.dom.parentNode : element.dom;
      if (dom === undefined || dom === null || dom.ownerDocument === null) {
        return false;
      }
      const doc = dom.ownerDocument;
      return getShadowRoot(SugarElement.fromDom(dom)).fold(() => doc.body.contains(dom), compose1(inBody, getShadowHost));
    };

    var ClosestOrAncestor = (is, ancestor, scope, a, isRoot) => {
      if (is(scope, a)) {
        return Optional.some(scope);
      } else if (isFunction(isRoot) && isRoot(scope)) {
        return Optional.none();
      } else {
        return ancestor(scope, a, isRoot);
      }
    };

    const ancestor$1 = (scope, predicate, isRoot) => {
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
      return ClosestOrAncestor(is, ancestor$1, scope, predicate, isRoot);
    };
    const child$2 = (scope, predicate) => {
      const pred = node => predicate(SugarElement.fromDom(node));
      const result = find(scope.dom.childNodes, pred);
      return result.map(SugarElement.fromDom);
    };

    const ancestor = (scope, selector, isRoot) => ancestor$1(scope, e => is$2(e, selector), isRoot);
    const child$1 = (scope, selector) => child$2(scope, e => is$2(e, selector));
    const descendant = (scope, selector) => one(selector, scope);
    const closest$1 = (scope, selector, isRoot) => {
      const is = (element, selector) => is$2(element, selector);
      return ClosestOrAncestor(is, ancestor, scope, selector, isRoot);
    };

    const closest = target => closest$1(target, '[contenteditable]');
    const isEditable = (element, assumeEditable = false) => {
      if (inBody(element)) {
        return element.dom.isContentEditable;
      } else {
        return closest(element).fold(constant(assumeEditable), editable => getRaw$1(editable) === 'true');
      }
    };
    const getRaw$1 = element => element.dom.contentEditable;

    const getNodeName = elm => elm.nodeName.toLowerCase();
    const getBody = editor => SugarElement.fromDom(editor.getBody());
    const getIsRoot = editor => element => eq(element, getBody(editor));
    const removeP***REMOVED***Suffi***REMOVED*** = size => size ? size.replace(/p***REMOVED***$/, '') : '';
    const addP***REMOVED***Suffi***REMOVED*** = size => /^\d+(\.\d+)?$/.test(size) ? size + 'p***REMOVED***' : size;
    const getSelectionStart = editor => SugarElement.fromDom(editor.selection.getStart());
    const getSelectionEnd = editor => SugarElement.fromDom(editor.selection.getEnd());
    const isInEditableConte***REMOVED***t = cell => closest$2(cell, isTag('table')).forall(isEditable);

    const children$2 = (scope, predicate) => filter(children$3(scope), predicate);
    const descendants$1 = (scope, predicate) => {
      let result = [];
      each(children$3(scope), ***REMOVED*** => {
        if (predicate(***REMOVED***)) {
          result = result.concat([***REMOVED***]);
        }
        result = result.concat(descendants$1(***REMOVED***, predicate));
      });
      return result;
    };

    const children$1 = (scope, selector) => children$2(scope, e => is$2(e, selector));
    const descendants = (scope, selector) => all$1(selector, scope);

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
    const setAll = (element, attrs) => {
      const dom = element.dom;
      each$1(attrs, (v, k) => {
        rawSet(dom, k, v);
      });
    };
    const get$2 = (element, key) => {
      const v = element.dom.getAttribute(key);
      return v === null ? undefined : v;
    };
    const getOpt = (element, key) => Optional.from(get$2(element, key));
    const remove$2 = (element, key) => {
      element.dom.removeAttribute(key);
    };
    const clone = element => foldl(element.dom.attributes, (acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {});

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
    const lift2 = (oa, ob, f) => oa.isSome() && ob.isSome() ? Optional.some(f(oa.getOrDie(), ob.getOrDie())) : Optional.none();
    const flatten = oot => oot.bind(identity);
    const someIf = (b, a) => b ? Optional.some(a) : Optional.none();

    const removeFromStart = (str, numChars) => {
      return str.substring(numChars);
    };

    const checkRange = (str, substr, start) => substr === '' || str.length >= substr.length && str.substr(start, start + substr.length) === substr;
    const removeLeading = (str, prefi***REMOVED***) => {
      return startsWith(str, prefi***REMOVED***) ? removeFromStart(str, prefi***REMOVED***.length) : str;
    };
    const startsWith = (str, prefi***REMOVED***) => {
      return checkRange(str, prefi***REMOVED***, 0);
    };
    const blank = r => s => s.replace(r, '');
    const trim = blank(/^\s+|\s+$/g);
    const isNotEmpty = s => s.length > 0;
    const isEmpty = s => !isNotEmpty(s);
    const toInt = (value, radi***REMOVED*** = 10) => {
      const num = parseInt(value, radi***REMOVED***);
      return isNaN(num) ? Optional.none() : Optional.some(num);
    };
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
    const get$1 = (element, property) => {
      const dom = element.dom;
      const styles = window.getComputedStyle(dom);
      const r = styles.getPropertyValue(property);
      return r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
    };
    const getUnsafeProperty = (dom, property) => isSupported(dom) ? dom.style.getPropertyValue(property) : '';
    const getRaw = (element, property) => {
      const dom = element.dom;
      const raw = getUnsafeProperty(dom, property);
      return Optional.from(raw).filter(r => r.length > 0);
    };
    const remove$1 = (element, property) => {
      const dom = element.dom;
      internalRemove(dom, property);
      if (is(getOpt(element, 'style').map(trim), '')) {
        remove$2(element, 'style');
      }
    };

    const getAttrValue = (cell, name, fallback = 0) => getOpt(cell, name).map(value => parseInt(value, 10)).getOr(fallback);

    const firstLayer = (scope, selector) => {
      return filterFirstLayer(scope, selector, always);
    };
    const filterFirstLayer = (scope, selector, predicate) => {
      return bind(children$3(scope), ***REMOVED*** => {
        if (is$2(***REMOVED***, selector)) {
          return predicate(***REMOVED***) ? [***REMOVED***] : [];
        } else {
          return filterFirstLayer(***REMOVED***, selector, predicate);
        }
      });
    };

    const validSectionList = [
      'tfoot',
      'thead',
      'tbody',
      'colgroup'
    ];
    const isValidSection = parentName => contains(validSectionList, parentName);
    const grid = (rows, columns) => ({
      rows,
      columns
    });
    const detail = (element, rowspan, colspan) => ({
      element,
      rowspan,
      colspan
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

    const lookup = (tags, element, isRoot = never) => {
      if (isRoot(element)) {
        return Optional.none();
      }
      if (contains(tags, name(element))) {
        return Optional.some(element);
      }
      const isRootOrUpperTable = elm => is$2(elm, 'table') || isRoot(elm);
      return ancestor(element, tags.join(','), isRootOrUpperTable);
    };
    const cell = (element, isRoot) => lookup([
      'td',
      'th'
    ], element, isRoot);
    const cells = ancestor => firstLayer(ancestor, 'th,td');
    const columns = ancestor => {
      if (is$2(ancestor, 'colgroup')) {
        return children$1(ancestor, 'col');
      } else {
        return bind(columnGroups(ancestor), columnGroup => children$1(columnGroup, 'col'));
      }
    };
    const table = (element, isRoot) => closest$1(element, 'table', isRoot);
    const rows = ancestor => firstLayer(ancestor, 'tr');
    const columnGroups = ancestor => table(ancestor).fold(constant([]), table => children$1(table, 'colgroup'));

    const fromRowsOrColGroups = (elems, getSection) => map(elems, row => {
      if (name(row) === 'colgroup') {
        const cells = map(columns(row), column => {
          const colspan = getAttrValue(column, 'span', 1);
          return detail(column, 1, colspan);
        });
        return rowdetail(row, cells, 'colgroup');
      } else {
        const cells$1 = map(cells(row), cell => {
          const rowspan = getAttrValue(cell, 'rowspan', 1);
          const colspan = getAttrValue(cell, 'colspan', 1);
          return detail(cell, rowspan, colspan);
        });
        return rowdetail(row, cells$1, getSection(row));
      }
    });
    const getParentSection = group => parent(group).map(parent => {
      const parentName = name(parent);
      return isValidSection(parentName) ? parentName : 'tbody';
    }).getOr('tbody');
    const fromTable$1 = table => {
      const rows$1 = rows(table);
      const columnGroups$1 = columnGroups(table);
      const elems = [
        ...columnGroups$1,
        ...rows$1
      ];
      return fromRowsOrColGroups(elems, getParentSection);
    };

    const LOCKED_COL_ATTR = 'data-snooker-locked-cols';
    const getLockedColumnsFromTable = table => getOpt(table, LOCKED_COL_ATTR).bind(lockedColStr => Optional.from(lockedColStr.match(/\d+/g))).map(lockedCols => mapToObject(lockedCols, always));

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
      const all = bind(warehouse.all, r => {
        return r.cells;
      });
      return filter(all, predicate);
    };
    const generateColumns = rowData => {
      const columnsGroup = {};
      let inde***REMOVED*** = 0;
      each(rowData.cells, column => {
        const colspan = column.colspan;
        range(colspan, columnInde***REMOVED*** => {
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
      each(rows, rowData => {
        const currentRow = [];
        each(rowData.cells, rowCell => {
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
      const {columns, colgroups} = last(colgroupRows).map(rowData => {
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
    const justCells = warehouse => bind(warehouse.all, w => w.cells);
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

    var global$2 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const getTDTHOverallStyle = (dom, elm, name) => {
      const cells = dom.select('td,th', elm);
      let firstChildStyle;
      for (let i = 0; i < cells.length; i++) {
        const currentStyle = dom.getStyle(cells[i], name);
        if (isUndefined(firstChildStyle)) {
          firstChildStyle = currentStyle;
        }
        if (firstChildStyle !== currentStyle) {
          return '';
        }
      }
      return firstChildStyle;
    };
    const setAlign = (editor, elm, name) => {
      global$2.each('left center right'.split(' '), align => {
        if (align !== name) {
          editor.formatter.remove('align' + align, {}, elm);
        }
      });
      if (name) {
        editor.formatter.apply('align' + name, {}, elm);
      }
    };
    const setVAlign = (editor, elm, name) => {
      global$2.each('top middle bottom'.split(' '), align => {
        if (align !== name) {
          editor.formatter.remove('valign' + align, {}, elm);
        }
      });
      if (name) {
        editor.formatter.apply('valign' + name, {}, elm);
      }
    };

    const fireTableModified = (editor, table, data) => {
      editor.dispatch('TableModified', {
        ...data,
        table
      });
    };

    const toNumber = (p***REMOVED***, fallback) => toFloat(p***REMOVED***).getOr(fallback);
    const getProp = (element, name, fallback) => toNumber(get$1(element, name), fallback);
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
    const getInnerWidth = element => getCalculatedWidth(element, 'content-bo***REMOVED***');

    const getInner = getInnerWidth;

    var global$1 = tinymce.util.Tools.resolve('tinymce.Env');

    const defaultTableToolbar = 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol';
    const defaultCellBorderWidths = range(5, i => {
      const size = `${ i + 1 }p***REMOVED***`;
      return {
        title: size,
        value: size
      };
    });
    const defaultCellBorderStyles = map([
      'Solid',
      'Dotted',
      'Dashed',
      'Double',
      'Groove',
      'Ridge',
      'Inset',
      'Outset',
      'None',
      'Hidden'
    ], type => {
      return {
        title: type,
        value: type.toLowerCase()
      };
    });
    const defaultWidth = '100%';
    const getPi***REMOVED***elForcedWidth = editor => {
      var _a;
      const dom = editor.dom;
      const parentBlock = (_a = dom.getParent(editor.selection.getStart(), dom.isBlock)) !== null && _a !== void 0 ? _a : editor.getBody();
      return getInner(SugarElement.fromDom(parentBlock)) + 'p***REMOVED***';
    };
    const determineDefaultStyles = (editor, defaultStyles) => {
      if (isResponsiveForced(editor) || !shouldStyleWithCss(editor)) {
        return defaultStyles;
      } else if (isPi***REMOVED***elsForced(editor)) {
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
    const determineDefaultAttributes = (editor, defaultAttributes) => {
      if (isResponsiveForced(editor) || shouldStyleWithCss(editor)) {
        return defaultAttributes;
      } else if (isPi***REMOVED***elsForced(editor)) {
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
    const option = name => editor => editor.options.get(name);
    const register = editor => {
      const registerOption = editor.options.register;
      registerOption('table_border_widths', {
        processor: 'object[]',
        default: defaultCellBorderWidths
      });
      registerOption('table_border_styles', {
        processor: 'object[]',
        default: defaultCellBorderStyles
      });
      registerOption('table_cell_advtab', {
        processor: 'boolean',
        default: true
      });
      registerOption('table_row_advtab', {
        processor: 'boolean',
        default: true
      });
      registerOption('table_advtab', {
        processor: 'boolean',
        default: true
      });
      registerOption('table_appearance_options', {
        processor: 'boolean',
        default: true
      });
      registerOption('table_grid', {
        processor: 'boolean',
        default: !global$1.deviceType.isTouch()
      });
      registerOption('table_cell_class_list', {
        processor: 'object[]',
        default: []
      });
      registerOption('table_row_class_list', {
        processor: 'object[]',
        default: []
      });
      registerOption('table_class_list', {
        processor: 'object[]',
        default: []
      });
      registerOption('table_toolbar', {
        processor: 'string',
        default: defaultTableToolbar
      });
      registerOption('table_background_color_map', {
        processor: 'object[]',
        default: []
      });
      registerOption('table_border_color_map', {
        processor: 'object[]',
        default: []
      });
    };
    const getTableSizingMode = option('table_sizing_mode');
    const getTableBorderWidths = option('table_border_widths');
    const getTableBorderStyles = option('table_border_styles');
    const hasAdvancedCellTab = option('table_cell_advtab');
    const hasAdvancedRowTab = option('table_row_advtab');
    const hasAdvancedTableTab = option('table_advtab');
    const hasAppearanceOptions = option('table_appearance_options');
    const hasTableGrid = option('table_grid');
    const shouldStyleWithCss = option('table_style_by_css');
    const getCellClassList = option('table_cell_class_list');
    const getRowClassList = option('table_row_class_list');
    const getTableClassList = option('table_class_list');
    const getToolbar = option('table_toolbar');
    const getTableBackgroundColorMap = option('table_background_color_map');
    const getTableBorderColorMap = option('table_border_color_map');
    const isPi***REMOVED***elsForced = editor => getTableSizingMode(editor) === 'fi***REMOVED***ed';
    const isResponsiveForced = editor => getTableSizingMode(editor) === 'responsive';
    const getDefaultStyles = editor => {
      const options = editor.options;
      const defaultStyles = options.get('table_default_styles');
      return options.isSet('table_default_styles') ? defaultStyles : determineDefaultStyles(editor, defaultStyles);
    };
    const getDefaultAttributes = editor => {
      const options = editor.options;
      const defaultAttributes = options.get('table_default_attributes');
      return options.isSet('table_default_attributes') ? defaultAttributes : determineDefaultAttributes(editor, defaultAttributes);
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
      const startCoords = Warehouse.findItem(warehouse, startCell, eq);
      const finishCoords = Warehouse.findItem(warehouse, finishCell, eq);
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

    const getBo***REMOVED*** = (table, first, last) => {
      const warehouse = getWarehouse(table);
      return getBo***REMOVED***$1(warehouse, first, last);
    };
    const getWarehouse = Warehouse.fromTable;

    const before = (marker, element) => {
      const parent$1 = parent(marker);
      parent$1.each(v => {
        v.dom.insertBefore(element.dom, marker.dom);
      });
    };
    const after$1 = (marker, element) => {
      const sibling = ne***REMOVED***tSibling(marker);
      sibling.fold(() => {
        const parent$1 = parent(marker);
        parent$1.each(v => {
          append$1(v, element);
        });
      }, v => {
        before(v, element);
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
    const wrap = (element, wrapper) => {
      before(element, wrapper);
      append$1(wrapper, element);
    };

    const after = (marker, elements) => {
      each(elements, (***REMOVED***, i) => {
        const e = i === 0 ? marker : elements[i - 1];
        after$1(e, ***REMOVED***);
      });
    };
    const append = (parent, elements) => {
      each(elements, ***REMOVED*** => {
        append$1(parent, ***REMOVED***);
      });
    };

    const remove = element => {
      const dom = element.dom;
      if (dom.parentNode !== null) {
        dom.parentNode.removeChild(dom);
      }
    };
    const unwrap = wrapper => {
      const children = children$3(wrapper);
      if (children.length > 0) {
        after(wrapper, children);
      }
      remove(wrapper);
    };

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
    const get = element => api.get(element);
    const set = (element, value) => api.set(element, value);

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
      const clone$1 = element => {
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
        return contains(TagBoundaries, name(element));
      };
      const isEmptyTag = element => {
        if (!isElement(element)) {
          return false;
        }
        return contains([
          'br',
          'img',
          'hr',
          'input'
        ], name(element));
      };
      const isNonEditable = element => isElement(element) && get$2(element, 'contenteditable') === 'false';
      const comparePosition = (element, other) => {
        return element.dom.compareDocumentPosition(other.dom);
      };
      const copyAttributesTo = (source, destination) => {
        const as = clone(source);
        setAll(destination, as);
      };
      const isSpecial = element => {
        const tag = name(element);
        return contains([
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
          selector: ancestor,
          closest: closest$1,
          predicate: ancestor$1,
          all: parents
        }),
        down: constant({
          selector: descendants,
          predicate: descendants$1
        }),
        styles: constant({
          get: get$1,
          getRaw: getRaw,
          set: set$1,
          remove: remove$1
        }),
        attrs: constant({
          get: get$2,
          set: set$2,
          remove: remove$2,
          copyTo: copyAttributesTo
        }),
        insert: constant({
          before: before,
          after: after$1,
          afterAll: after,
          append: append$1,
          appendAll: append,
          prepend: prepend,
          wrap: wrap
        }),
        remove: constant({
          unwrap: unwrap,
          remove: remove
        }),
        create: constant({
          nu: SugarElement.fromTag,
          clone: clone$1,
          te***REMOVED***t: SugarElement.fromTe***REMOVED***t
        }),
        query: constant({
          comparePosition,
          prevSibling: prevSibling,
          ne***REMOVED***tSibling: ne***REMOVED***tSibling
        }),
        property: constant({
          children: children$3,
          name: name,
          parent: parent,
          document,
          isTe***REMOVED***t: isTe***REMOVED***t,
          isComment: isComment,
          isElement: isElement,
          isSpecial,
          getLanguage,
          getTe***REMOVED***t: get,
          setTe***REMOVED***t: set,
          isBoundary,
          isEmptyTag,
          isNonEditable
        }),
        eq: eq,
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

    const sharedOne$1 = oneAll;

    const universe = DomUniverse();
    const sharedOne = (look, elements) => {
      return sharedOne$1(universe, (_universe, element) => {
        return look(element);
      }, elements);
    };

    const lookupTable = container => {
      return ancestor(container, 'table');
    };
    const retrieve$1 = (container, selector) => {
      const sels = descendants(container, selector);
      return sels.length > 0 ? Optional.some(sels) : Optional.none();
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

    const retrieve = (container, selector) => {
      return retrieve$1(container, selector);
    };
    const retrieveBo***REMOVED*** = (container, firstSelectedSelector, lastSelectedSelector) => {
      return getEdges(container, firstSelectedSelector, lastSelectedSelector).bind(edges => {
        const isRoot = ancestor => {
          return eq(container, ancestor);
        };
        const sectionSelector = 'thead,tfoot,tbody,table';
        const firstAncestor = ancestor(edges.first, sectionSelector, isRoot);
        const lastAncestor = ancestor(edges.last, sectionSelector, isRoot);
        return firstAncestor.bind(fA => {
          return lastAncestor.bind(lA => {
            return eq(fA, lA) ? getBo***REMOVED***(edges.table, edges.first, edges.last) : Optional.none();
          });
        });
      });
    };

    const fromDom = nodes => map(nodes, SugarElement.fromDom);

    const strSelected = 'data-mce-selected';
    const strSelectedSelector = 'td[' + strSelected + '],th[' + strSelected + ']';
    const strFirstSelected = 'data-mce-first-selected';
    const strFirstSelectedSelector = 'td[' + strFirstSelected + '],th[' + strFirstSelected + ']';
    const strLastSelected = 'data-mce-last-selected';
    const strLastSelectedSelector = 'td[' + strLastSelected + '],th[' + strLastSelected + ']';
    const ephemera = {
      selected: strSelected,
      selectedSelector: strSelectedSelector,
      firstSelected: strFirstSelected,
      firstSelectedSelector: strFirstSelectedSelector,
      lastSelected: strLastSelected,
      lastSelectedSelector: strLastSelectedSelector
    };

    const getSelectionCellFallback = element => table(element).bind(table => retrieve(table, ephemera.firstSelectedSelector)).fold(constant(element), cells => cells[0]);
    const getSelectionFromSelector = selector => (initCell, isRoot) => {
      const cellName = name(initCell);
      const cell = cellName === 'col' || cellName === 'colgroup' ? getSelectionCellFallback(initCell) : initCell;
      return closest$1(cell, selector, isRoot);
    };
    const getSelectionCellOrCaption = getSelectionFromSelector('th,td,caption');
    const getSelectionCell = getSelectionFromSelector('th,td');
    const getCellsFromSelection = editor => fromDom(editor.model.table.getSelectedCells());
    const getRowsFromSelection = (selected, selector) => {
      const cellOpt = getSelectionCell(selected);
      const rowsOpt = cellOpt.bind(cell => table(cell)).map(table => rows(table));
      return lift2(cellOpt, rowsOpt, (cell, rows) => filter(rows, row => e***REMOVED***ists(fromDom(row.dom.cells), rowCell => get$2(rowCell, selector) === '1' || eq(rowCell, cell)))).getOr([]);
    };

    const verticalAlignValues = [
      {
        te***REMOVED***t: 'None',
        value: ''
      },
      {
        te***REMOVED***t: 'Top',
        value: 'top'
      },
      {
        te***REMOVED***t: 'Middle',
        value: 'middle'
      },
      {
        te***REMOVED***t: 'Bottom',
        value: 'bottom'
      }
    ];

    const he***REMOVED***Colour = value => ({ value: normalizeHe***REMOVED***(value) });
    const shorthandRege***REMOVED*** = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const longformRege***REMOVED*** = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const isHe***REMOVED***String = he***REMOVED*** => shorthandRege***REMOVED***.test(he***REMOVED***) || longformRege***REMOVED***.test(he***REMOVED***);
    const normalizeHe***REMOVED*** = he***REMOVED*** => removeLeading(he***REMOVED***, '#').toUpperCase();
    const fromString$1 = he***REMOVED*** => isHe***REMOVED***String(he***REMOVED***) ? Optional.some({ value: normalizeHe***REMOVED***(he***REMOVED***) }) : Optional.none();
    const toHe***REMOVED*** = component => {
      const he***REMOVED*** = component.toString(16);
      return (he***REMOVED***.length === 1 ? '0' + he***REMOVED*** : he***REMOVED***).toUpperCase();
    };
    const fromRgba = rgbaColour => {
      const value = toHe***REMOVED***(rgbaColour.red) + toHe***REMOVED***(rgbaColour.green) + toHe***REMOVED***(rgbaColour.blue);
      return he***REMOVED***Colour(value);
    };

    const rgbRege***REMOVED*** = /^\s*rgb\s*\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)\s*\)\s*$/i;
    const rgbaRege***REMOVED*** = /^\s*rgba\s*\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*((?:\d?\.\d+|\d+)%?)\s*\)\s*$/i;
    const rgbaColour = (red, green, blue, alpha) => ({
      red,
      green,
      blue,
      alpha
    });
    const fromStringValues = (red, green, blue, alpha) => {
      const r = parseInt(red, 10);
      const g = parseInt(green, 10);
      const b = parseInt(blue, 10);
      const a = parseFloat(alpha);
      return rgbaColour(r, g, b, a);
    };
    const fromString = rgbaString => {
      const rgbMatch = rgbRege***REMOVED***.e***REMOVED***ec(rgbaString);
      if (rgbMatch !== null) {
        return Optional.some(fromStringValues(rgbMatch[1], rgbMatch[2], rgbMatch[3], '1'));
      }
      const rgbaMatch = rgbaRege***REMOVED***.e***REMOVED***ec(rgbaString);
      if (rgbaMatch !== null) {
        return Optional.some(fromStringValues(rgbaMatch[1], rgbaMatch[2], rgbaMatch[3], rgbaMatch[4]));
      }
      return Optional.none();
    };

    const anyToHe***REMOVED*** = color => fromString$1(color).orThunk(() => fromString(color).map(fromRgba)).getOrThunk(() => {
      const canvas = document.createElement('canvas');
      canvas.height = 1;
      canvas.width = 1;
      const canvasConte***REMOVED***t = canvas.getConte***REMOVED***t('2d');
      canvasConte***REMOVED***t.clearRect(0, 0, canvas.width, canvas.height);
      canvasConte***REMOVED***t.fillStyle = '#FFFFFF';
      canvasConte***REMOVED***t.fillStyle = color;
      canvasConte***REMOVED***t.fillRect(0, 0, 1, 1);
      const rgba = canvasConte***REMOVED***t.getImageData(0, 0, 1, 1).data;
      const r = rgba[0];
      const g = rgba[1];
      const b = rgba[2];
      const a = rgba[3];
      return fromRgba(rgbaColour(r, g, b, a));
    });
    const rgbaToHe***REMOVED***String = color => fromString(color).map(fromRgba).map(h => '#' + h.value).getOr(color);

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
    const unbindable = () => singleton(s => s.unbind());

    const onSetupToggle = (editor, formatName, formatValue) => {
      return api => {
        const boundCallback = unbindable();
        const isNone = isEmpty(formatValue);
        const init = () => {
          const selectedCells = getCellsFromSelection(editor);
          const checkNode = cell => editor.formatter.match(formatName, { value: formatValue }, cell.dom, isNone);
          if (isNone) {
            api.setActive(!e***REMOVED***ists(selectedCells, checkNode));
            boundCallback.set(editor.formatter.formatChanged(formatName, match => api.setActive(!match), true));
          } else {
            api.setActive(forall(selectedCells, checkNode));
            boundCallback.set(editor.formatter.formatChanged(formatName, api.setActive, false, { value: formatValue }));
          }
        };
        editor.initialized ? init() : editor.on('init', init);
        return boundCallback.clear;
      };
    };
    const isListGroup = item => hasNonNullableKey(item, 'menu');
    const buildListItems = items => map(items, item => {
      const te***REMOVED***t = item.te***REMOVED***t || item.title || '';
      if (isListGroup(item)) {
        return {
          te***REMOVED***t,
          items: buildListItems(item.menu)
        };
      } else {
        return {
          te***REMOVED***t,
          value: item.value
        };
      }
    });
    const buildClassList = classList => {
      if (!classList.length) {
        return Optional.none();
      }
      return Optional.some(buildListItems([
        {
          te***REMOVED***t: 'Select...',
          value: 'mce-no-match'
        },
        ...classList
      ]));
    };
    const buildMenuItems = (editor, items, format, onAction) => map(items, item => {
      const te***REMOVED***t = item.te***REMOVED***t || item.title;
      if (isListGroup(item)) {
        return {
          type: 'nestedmenuitem',
          te***REMOVED***t,
          getSubmenuItems: () => buildMenuItems(editor, item.menu, format, onAction)
        };
      } else {
        return {
          te***REMOVED***t,
          type: 'togglemenuitem',
          onAction: () => onAction(item.value),
          onSetup: onSetupToggle(editor, format, item.value)
        };
      }
    });
    const applyTableCellStyle = (editor, style) => value => {
      editor.e***REMOVED***ecCommand('mceTableApplyCellStyle', false, { [style]: value });
    };
    const filterNoneItem = list => bind(list, item => {
      if (isListGroup(item)) {
        return [{
            ...item,
            menu: filterNoneItem(item.menu)
          }];
      } else {
        return isNotEmpty(item.value) ? [item] : [];
      }
    });
    const generateMenuItemsCallback = (editor, items, format, onAction) => callback => callback(buildMenuItems(editor, items, format, onAction));
    const buildColorMenu = (editor, colorList, style) => {
      const colorMap = map(colorList, entry => ({
        te***REMOVED***t: entry.title,
        value: '#' + anyToHe***REMOVED***(entry.value).value,
        type: 'choiceitem'
      }));
      return [{
          type: 'fancymenuitem',
          fancytype: 'colorswatch',
          initData: {
            colors: colorMap.length > 0 ? colorMap : undefined,
            allowCustomColors: false
          },
          onAction: data => {
            const value = data.value === 'remove' ? '' : data.value;
            editor.e***REMOVED***ecCommand('mceTableApplyCellStyle', false, { [style]: value });
          }
        }];
    };
    const changeRowHeader = editor => () => {
      const currentType = editor.queryCommandValue('mceTableRowType');
      const newType = currentType === 'header' ? 'body' : 'header';
      editor.e***REMOVED***ecCommand('mceTableRowType', false, { type: newType });
    };
    const changeColumnHeader = editor => () => {
      const currentType = editor.queryCommandValue('mceTableColType');
      const newType = currentType === 'th' ? 'td' : 'th';
      editor.e***REMOVED***ecCommand('mceTableColType', false, { type: newType });
    };

    const getClassList$1 = editor => buildClassList(getCellClassList(editor)).map(items => ({
      name: 'class',
      type: 'listbo***REMOVED***',
      label: 'Class',
      items
    }));
    const children = [
      {
        name: 'width',
        type: 'input',
        label: 'Width'
      },
      {
        name: 'celltype',
        type: 'listbo***REMOVED***',
        label: 'Cell type',
        items: [
          {
            te***REMOVED***t: 'Cell',
            value: 'td'
          },
          {
            te***REMOVED***t: 'Header cell',
            value: 'th'
          }
        ]
      },
      {
        name: 'scope',
        type: 'listbo***REMOVED***',
        label: 'Scope',
        items: [
          {
            te***REMOVED***t: 'None',
            value: ''
          },
          {
            te***REMOVED***t: 'Row',
            value: 'row'
          },
          {
            te***REMOVED***t: 'Column',
            value: 'col'
          },
          {
            te***REMOVED***t: 'Row group',
            value: 'rowgroup'
          },
          {
            te***REMOVED***t: 'Column group',
            value: 'colgroup'
          }
        ]
      },
      {
        name: 'halign',
        type: 'listbo***REMOVED***',
        label: 'Horizontal align',
        items: [
          {
            te***REMOVED***t: 'None',
            value: ''
          },
          {
            te***REMOVED***t: 'Left',
            value: 'left'
          },
          {
            te***REMOVED***t: 'Center',
            value: 'center'
          },
          {
            te***REMOVED***t: 'Right',
            value: 'right'
          }
        ]
      },
      {
        name: 'valign',
        type: 'listbo***REMOVED***',
        label: 'Vertical align',
        items: verticalAlignValues
      }
    ];
    const getItems$2 = editor => children.concat(getClassList$1(editor).toArray());

    const getAdvancedTab = (editor, dialogName) => {
      const emptyBorderStyle = [{
          te***REMOVED***t: 'Select...',
          value: ''
        }];
      const advTabItems = [
        {
          name: 'borderstyle',
          type: 'listbo***REMOVED***',
          label: 'Border style',
          items: emptyBorderStyle.concat(buildListItems(getTableBorderStyles(editor)))
        },
        {
          name: 'bordercolor',
          type: 'colorinput',
          label: 'Border color'
        },
        {
          name: 'backgroundcolor',
          type: 'colorinput',
          label: 'Background color'
        }
      ];
      const borderWidth = {
        name: 'borderwidth',
        type: 'input',
        label: 'Border width'
      };
      const items = dialogName === 'cell' ? [borderWidth].concat(advTabItems) : advTabItems;
      return {
        title: 'Advanced',
        name: 'advanced',
        items
      };
    };

    const normal = (editor, element) => {
      const dom = editor.dom;
      const setAttrib = (attr, value) => {
        dom.setAttrib(element, attr, value);
      };
      const setStyle = (prop, value) => {
        dom.setStyle(element, prop, value);
      };
      const setFormat = (formatName, value) => {
        if (value === '') {
          editor.formatter.remove(formatName, { value: null }, element, true);
        } else {
          editor.formatter.apply(formatName, { value }, element);
        }
      };
      return {
        setAttrib,
        setStyle,
        setFormat
      };
    };
    const DomModifier = { normal };

    const isHeaderCell = isTag('th');
    const getRowHeaderType = (isHeaderRow, isHeaderCells) => {
      if (isHeaderRow && isHeaderCells) {
        return 'sectionCells';
      } else if (isHeaderRow) {
        return 'section';
      } else {
        return 'cells';
      }
    };
    const getRowType$1 = row => {
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
      const headerCells = filter(cells, cell => isHeaderCell(cell.element));
      if (headerCells.length === 0) {
        return Optional.some('td');
      } else if (headerCells.length === cells.length) {
        return Optional.some('th');
      } else {
        return Optional.none();
      }
    };
    const findCommonRowType = rows => {
      const rowTypes = map(rows, row => getRowType$1(row).type);
      const hasHeader = contains(rowTypes, 'header');
      const hasFooter = contains(rowTypes, 'footer');
      if (!hasHeader && !hasFooter) {
        return Optional.some('body');
      } else {
        const hasBody = contains(rowTypes, 'body');
        if (hasHeader && !hasBody && !hasFooter) {
          return Optional.some('header');
        } else if (!hasHeader && !hasBody && hasFooter) {
          return Optional.some('footer');
        } else {
          return Optional.none();
        }
      }
    };

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

    const findInWarehouse = (warehouse, element) => findMap(warehouse.all, r => find(r.cells, e => eq(element, e.element)));
    const e***REMOVED***tractCells = (warehouse, target, predicate) => {
      const details = map(target.selection, cell$1 => {
        return cell(cell$1).bind(lc => findInWarehouse(warehouse, lc)).filter(predicate);
      });
      const cells = cat(details);
      return someIf(cells.length > 0, cells);
    };
    const onMergable = (_warehouse, target) => target.mergable;
    const onUnmergable = (_warehouse, target) => target.unmergable;
    const onCells = (warehouse, target) => e***REMOVED***tractCells(warehouse, target, always);
    const isUnlockedTableCell = (warehouse, cell) => findInWarehouse(warehouse, cell).e***REMOVED***ists(detail => !detail.isLocked);
    const allUnlocked = (warehouse, cells) => forall(cells, cell => isUnlockedTableCell(warehouse, cell));
    const onUnlockedMergable = (warehouse, target) => onMergable(warehouse, target).filter(mergeable => allUnlocked(warehouse, mergeable.cells));
    const onUnlockedUnmergable = (warehouse, target) => onUnmergable(warehouse, target).filter(cells => allUnlocked(warehouse, cells));

    const generate = cases => {
      if (!isArray(cases)) {
        throw new Error('cases must be an array');
      }
      if (cases.length === 0) {
        throw new Error('there must be at least one case');
      }
      const constructors = [];
      const adt = {};
      each(cases, (acase, count) => {
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
              return contains(branchKeys, reqKey);
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

    const adt = Adt.generate([
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
    ({ ...adt });

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
    const getRowsType = opGetRowsType;

    const rgbToHe***REMOVED*** = value => startsWith(value, 'rgb') ? rgbaToHe***REMOVED***String(value) : value;
    const e***REMOVED***tractAdvancedStyles = elm => {
      const element = SugarElement.fromDom(elm);
      return {
        borderwidth: getRaw(element, 'border-width').getOr(''),
        borderstyle: getRaw(element, 'border-style').getOr(''),
        bordercolor: getRaw(element, 'border-color').map(rgbToHe***REMOVED***).getOr(''),
        backgroundcolor: getRaw(element, 'background-color').map(rgbToHe***REMOVED***).getOr('')
      };
    };
    const getSharedValues = data => {
      const baseData = data[0];
      const comparisonData = data.slice(1);
      each(comparisonData, items => {
        each(keys(baseData), key => {
          each$1(items, (itemValue, itemKey) => {
            const comparisonValue = baseData[key];
            if (comparisonValue !== '' && key === itemKey) {
              if (comparisonValue !== itemValue) {
                baseData[key] = key === 'class' ? 'mce-no-match' : '';
              }
            }
          });
        });
      });
      return baseData;
    };
    const getAlignment = (formats, formatName, editor, elm) => find(formats, name => !isUndefined(editor.formatter.matchNode(elm, formatName + name))).getOr('');
    const getHAlignment = curry(getAlignment, [
      'left',
      'center',
      'right'
    ], 'align');
    const getVAlignment = curry(getAlignment, [
      'top',
      'middle',
      'bottom'
    ], 'valign');
    const e***REMOVED***tractDataFromSettings = (editor, hasAdvTableTab) => {
      const style = getDefaultStyles(editor);
      const attrs = getDefaultAttributes(editor);
      const e***REMOVED***tractAdvancedStyleData = () => ({
        borderstyle: get$4(style, 'border-style').getOr(''),
        bordercolor: rgbToHe***REMOVED***(get$4(style, 'border-color').getOr('')),
        backgroundcolor: rgbToHe***REMOVED***(get$4(style, 'background-color').getOr(''))
      });
      const defaultData = {
        height: '',
        width: '100%',
        cellspacing: '',
        cellpadding: '',
        caption: false,
        class: '',
        align: '',
        border: ''
      };
      const getBorder = () => {
        const borderWidth = style['border-width'];
        if (shouldStyleWithCss(editor) && borderWidth) {
          return { border: borderWidth };
        }
        return get$4(attrs, 'border').fold(() => ({}), border => ({ border }));
      };
      const advStyle = hasAdvTableTab ? e***REMOVED***tractAdvancedStyleData() : {};
      const getCellPaddingCellSpacing = () => {
        const spacing = get$4(style, 'border-spacing').or(get$4(attrs, 'cellspacing')).fold(() => ({}), cellspacing => ({ cellspacing }));
        const padding = get$4(style, 'border-padding').or(get$4(attrs, 'cellpadding')).fold(() => ({}), cellpadding => ({ cellpadding }));
        return {
          ...spacing,
          ...padding
        };
      };
      const data = {
        ...defaultData,
        ...style,
        ...attrs,
        ...advStyle,
        ...getBorder(),
        ...getCellPaddingCellSpacing()
      };
      return data;
    };
    const getRowType = elm => table(SugarElement.fromDom(elm)).map(table => {
      const target = { selection: fromDom(elm.cells) };
      return getRowsType(table, target);
    }).getOr('');
    const e***REMOVED***tractDataFromTableElement = (editor, elm, hasAdvTableTab) => {
      const getBorder = (dom, elm) => {
        const optBorderWidth = getRaw(SugarElement.fromDom(elm), 'border-width');
        if (shouldStyleWithCss(editor) && optBorderWidth.isSome()) {
          return optBorderWidth.getOr('');
        }
        return dom.getAttrib(elm, 'border') || getTDTHOverallStyle(editor.dom, elm, 'border-width') || getTDTHOverallStyle(editor.dom, elm, 'border') || '';
      };
      const dom = editor.dom;
      const cellspacing = shouldStyleWithCss(editor) ? dom.getStyle(elm, 'border-spacing') || dom.getAttrib(elm, 'cellspacing') : dom.getAttrib(elm, 'cellspacing') || dom.getStyle(elm, 'border-spacing');
      const cellpadding = shouldStyleWithCss(editor) ? getTDTHOverallStyle(dom, elm, 'padding') || dom.getAttrib(elm, 'cellpadding') : dom.getAttrib(elm, 'cellpadding') || getTDTHOverallStyle(dom, elm, 'padding');
      return {
        width: dom.getStyle(elm, 'width') || dom.getAttrib(elm, 'width'),
        height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
        cellspacing: cellspacing !== null && cellspacing !== void 0 ? cellspacing : '',
        cellpadding: cellpadding !== null && cellpadding !== void 0 ? cellpadding : '',
        border: getBorder(dom, elm),
        caption: !!dom.select('caption', elm)[0],
        class: dom.getAttrib(elm, 'class', ''),
        align: getHAlignment(editor, elm),
        ...hasAdvTableTab ? e***REMOVED***tractAdvancedStyles(elm) : {}
      };
    };
    const e***REMOVED***tractDataFromRowElement = (editor, elm, hasAdvancedRowTab) => {
      const dom = editor.dom;
      return {
        height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
        class: dom.getAttrib(elm, 'class', ''),
        type: getRowType(elm),
        align: getHAlignment(editor, elm),
        ...hasAdvancedRowTab ? e***REMOVED***tractAdvancedStyles(elm) : {}
      };
    };
    const e***REMOVED***tractDataFromCellElement = (editor, cell, hasAdvancedCellTab, column) => {
      const dom = editor.dom;
      const colElm = column.getOr(cell);
      const getStyle = (element, style) => dom.getStyle(element, style) || dom.getAttrib(element, style);
      return {
        width: getStyle(colElm, 'width'),
        scope: dom.getAttrib(cell, 'scope'),
        celltype: getNodeName(cell),
        class: dom.getAttrib(cell, 'class', ''),
        halign: getHAlignment(editor, cell),
        valign: getVAlignment(editor, cell),
        ...hasAdvancedCellTab ? e***REMOVED***tractAdvancedStyles(cell) : {}
      };
    };

    const getSelectedCells = (table, cells) => {
      const warehouse = Warehouse.fromTable(table);
      const allCells = Warehouse.justCells(warehouse);
      const filtered = filter(allCells, cellA => e***REMOVED***ists(cells, cellB => eq(cellA.element, cellB)));
      return map(filtered, cell => ({
        element: cell.element.dom,
        column: Warehouse.getColumnAt(warehouse, cell.column).map(col => col.element.dom)
      }));
    };
    const updateSimpleProps$1 = (modifier, colModifier, data, shouldUpdate) => {
      if (shouldUpdate('scope')) {
        modifier.setAttrib('scope', data.scope);
      }
      if (shouldUpdate('class') && data.class !== 'mce-no-match') {
        modifier.setAttrib('class', data.class);
      }
      if (shouldUpdate('width')) {
        colModifier.setStyle('width', addP***REMOVED***Suffi***REMOVED***(data.width));
      }
    };
    const updateAdvancedProps$1 = (modifier, data, shouldUpdate) => {
      if (shouldUpdate('backgroundcolor')) {
        modifier.setFormat('tablecellbackgroundcolor', data.backgroundcolor);
      }
      if (shouldUpdate('bordercolor')) {
        modifier.setFormat('tablecellbordercolor', data.bordercolor);
      }
      if (shouldUpdate('borderstyle')) {
        modifier.setFormat('tablecellborderstyle', data.borderstyle);
      }
      if (shouldUpdate('borderwidth')) {
        modifier.setFormat('tablecellborderwidth', addP***REMOVED***Suffi***REMOVED***(data.borderwidth));
      }
    };
    const applyStyleData$1 = (editor, cells, data, wasChanged) => {
      const isSingleCell = cells.length === 1;
      each(cells, item => {
        const cellElm = item.element;
        const shouldOverrideCurrentValue = isSingleCell ? always : wasChanged;
        const modifier = DomModifier.normal(editor, cellElm);
        const colModifier = item.column.map(col => DomModifier.normal(editor, col)).getOr(modifier);
        updateSimpleProps$1(modifier, colModifier, data, shouldOverrideCurrentValue);
        if (hasAdvancedCellTab(editor)) {
          updateAdvancedProps$1(modifier, data, shouldOverrideCurrentValue);
        }
        if (wasChanged('halign')) {
          setAlign(editor, cellElm, data.halign);
        }
        if (wasChanged('valign')) {
          setVAlign(editor, cellElm, data.valign);
        }
      });
    };
    const applyStructureData$1 = (editor, data) => {
      editor.e***REMOVED***ecCommand('mceTableCellType', false, {
        type: data.celltype,
        no_events: true
      });
    };
    const applyCellData = (editor, cells, oldData, data) => {
      const modifiedData = filter$1(data, (value, key) => oldData[key] !== value);
      if (size(modifiedData) > 0 && cells.length >= 1) {
        table(cells[0]).each(table => {
          const selectedCells = getSelectedCells(table, cells);
          const styleModified = size(filter$1(modifiedData, (_value, key) => key !== 'scope' && key !== 'celltype')) > 0;
          const structureModified = has(modifiedData, 'celltype');
          if (styleModified || has(modifiedData, 'scope')) {
            applyStyleData$1(editor, selectedCells, data, curry(has, modifiedData));
          }
          if (structureModified) {
            applyStructureData$1(editor, data);
          }
          fireTableModified(editor, table.dom, {
            structure: structureModified,
            style: styleModified
          });
        });
      }
    };
    const onSubmitCellForm = (editor, cells, oldData, api) => {
      const data = api.getData();
      api.close();
      editor.undoManager.transact(() => {
        applyCellData(editor, cells, oldData, data);
        editor.focus();
      });
    };
    const getData$1 = (editor, cells) => {
      const cellsData = table(cells[0]).map(table => map(getSelectedCells(table, cells), item => e***REMOVED***tractDataFromCellElement(editor, item.element, hasAdvancedCellTab(editor), item.column)));
      return getSharedValues(cellsData.getOrDie());
    };
    const open$2 = editor => {
      const cells = getCellsFromSelection(editor);
      if (cells.length === 0) {
        return;
      }
      const data = getData$1(editor, cells);
      const dialogTabPanel = {
        type: 'tabpanel',
        tabs: [
          {
            title: 'General',
            name: 'general',
            items: getItems$2(editor)
          },
          getAdvancedTab(editor, 'cell')
        ]
      };
      const dialogPanel = {
        type: 'panel',
        items: [{
            type: 'grid',
            columns: 2,
            items: getItems$2(editor)
          }]
      };
      editor.windowManager.open({
        title: 'Cell Properties',
        size: 'normal',
        body: hasAdvancedCellTab(editor) ? dialogTabPanel : dialogPanel,
        buttons: [
          {
            type: 'cancel',
            name: 'cancel',
            te***REMOVED***t: 'Cancel'
          },
          {
            type: 'submit',
            name: 'save',
            te***REMOVED***t: 'Save',
            primary: true
          }
        ],
        initialData: data,
        onSubmit: curry(onSubmitCellForm, editor, cells, data)
      });
    };

    const getClassList = editor => buildClassList(getRowClassList(editor)).map(items => ({
      name: 'class',
      type: 'listbo***REMOVED***',
      label: 'Class',
      items
    }));
    const formChildren = [
      {
        type: 'listbo***REMOVED***',
        name: 'type',
        label: 'Row type',
        items: [
          {
            te***REMOVED***t: 'Header',
            value: 'header'
          },
          {
            te***REMOVED***t: 'Body',
            value: 'body'
          },
          {
            te***REMOVED***t: 'Footer',
            value: 'footer'
          }
        ]
      },
      {
        type: 'listbo***REMOVED***',
        name: 'align',
        label: 'Alignment',
        items: [
          {
            te***REMOVED***t: 'None',
            value: ''
          },
          {
            te***REMOVED***t: 'Left',
            value: 'left'
          },
          {
            te***REMOVED***t: 'Center',
            value: 'center'
          },
          {
            te***REMOVED***t: 'Right',
            value: 'right'
          }
        ]
      },
      {
        label: 'Height',
        name: 'height',
        type: 'input'
      }
    ];
    const getItems$1 = editor => formChildren.concat(getClassList(editor).toArray());

    const updateSimpleProps = (modifier, data, shouldUpdate) => {
      if (shouldUpdate('class') && data.class !== 'mce-no-match') {
        modifier.setAttrib('class', data.class);
      }
      if (shouldUpdate('height')) {
        modifier.setStyle('height', addP***REMOVED***Suffi***REMOVED***(data.height));
      }
    };
    const updateAdvancedProps = (modifier, data, shouldUpdate) => {
      if (shouldUpdate('backgroundcolor')) {
        modifier.setStyle('background-color', data.backgroundcolor);
      }
      if (shouldUpdate('bordercolor')) {
        modifier.setStyle('border-color', data.bordercolor);
      }
      if (shouldUpdate('borderstyle')) {
        modifier.setStyle('border-style', data.borderstyle);
      }
    };
    const applyStyleData = (editor, rows, data, wasChanged) => {
      const isSingleRow = rows.length === 1;
      const shouldOverrideCurrentValue = isSingleRow ? always : wasChanged;
      each(rows, rowElm => {
        const rowCells = children$1(SugarElement.fromDom(rowElm), 'td,th');
        const modifier = DomModifier.normal(editor, rowElm);
        updateSimpleProps(modifier, data, shouldOverrideCurrentValue);
        if (hasAdvancedRowTab(editor)) {
          updateAdvancedProps(modifier, data, shouldOverrideCurrentValue);
        }
        if (wasChanged('height')) {
          each(rowCells, cell => {
            editor.dom.setStyle(cell.dom, 'height', null);
          });
        }
        if (wasChanged('align')) {
          setAlign(editor, rowElm, data.align);
        }
      });
    };
    const applyStructureData = (editor, data) => {
      editor.e***REMOVED***ecCommand('mceTableRowType', false, {
        type: data.type,
        no_events: true
      });
    };
    const applyRowData = (editor, rows, oldData, data) => {
      const modifiedData = filter$1(data, (value, key) => oldData[key] !== value);
      if (size(modifiedData) > 0) {
        const typeModified = has(modifiedData, 'type');
        const styleModified = typeModified ? size(modifiedData) > 1 : true;
        if (styleModified) {
          applyStyleData(editor, rows, data, curry(has, modifiedData));
        }
        if (typeModified) {
          applyStructureData(editor, data);
        }
        table(SugarElement.fromDom(rows[0])).each(table => fireTableModified(editor, table.dom, {
          structure: typeModified,
          style: styleModified
        }));
      }
    };
    const onSubmitRowForm = (editor, rows, oldData, api) => {
      const data = api.getData();
      api.close();
      editor.undoManager.transact(() => {
        applyRowData(editor, rows, oldData, data);
        editor.focus();
      });
    };
    const open$1 = editor => {
      const rows = getRowsFromSelection(getSelectionStart(editor), ephemera.selected);
      if (rows.length === 0) {
        return;
      }
      const rowsData = map(rows, rowElm => e***REMOVED***tractDataFromRowElement(editor, rowElm.dom, hasAdvancedRowTab(editor)));
      const data = getSharedValues(rowsData);
      const dialogTabPanel = {
        type: 'tabpanel',
        tabs: [
          {
            title: 'General',
            name: 'general',
            items: getItems$1(editor)
          },
          getAdvancedTab(editor, 'row')
        ]
      };
      const dialogPanel = {
        type: 'panel',
        items: [{
            type: 'grid',
            columns: 2,
            items: getItems$1(editor)
          }]
      };
      editor.windowManager.open({
        title: 'Row Properties',
        size: 'normal',
        body: hasAdvancedRowTab(editor) ? dialogTabPanel : dialogPanel,
        buttons: [
          {
            type: 'cancel',
            name: 'cancel',
            te***REMOVED***t: 'Cancel'
          },
          {
            type: 'submit',
            name: 'save',
            te***REMOVED***t: 'Save',
            primary: true
          }
        ],
        initialData: data,
        onSubmit: curry(onSubmitRowForm, editor, map(rows, r => r.dom), data)
      });
    };

    const getItems = (editor, classes, insertNewTable) => {
      const rowColCountItems = !insertNewTable ? [] : [
        {
          type: 'input',
          name: 'cols',
          label: 'Cols',
          inputMode: 'numeric'
        },
        {
          type: 'input',
          name: 'rows',
          label: 'Rows',
          inputMode: 'numeric'
        }
      ];
      const alwaysItems = [
        {
          type: 'input',
          name: 'width',
          label: 'Width'
        },
        {
          type: 'input',
          name: 'height',
          label: 'Height'
        }
      ];
      const appearanceItems = hasAppearanceOptions(editor) ? [
        {
          type: 'input',
          name: 'cellspacing',
          label: 'Cell spacing',
          inputMode: 'numeric'
        },
        {
          type: 'input',
          name: 'cellpadding',
          label: 'Cell padding',
          inputMode: 'numeric'
        },
        {
          type: 'input',
          name: 'border',
          label: 'Border width'
        },
        {
          type: 'label',
          label: 'Caption',
          items: [{
              type: 'checkbo***REMOVED***',
              name: 'caption',
              label: 'Show caption'
            }]
        }
      ] : [];
      const alignmentItem = [{
          type: 'listbo***REMOVED***',
          name: 'align',
          label: 'Alignment',
          items: [
            {
              te***REMOVED***t: 'None',
              value: ''
            },
            {
              te***REMOVED***t: 'Left',
              value: 'left'
            },
            {
              te***REMOVED***t: 'Center',
              value: 'center'
            },
            {
              te***REMOVED***t: 'Right',
              value: 'right'
            }
          ]
        }];
      const classListItem = classes.length > 0 ? [{
          name: 'class',
          type: 'listbo***REMOVED***',
          label: 'Class',
          items: classes
        }] : [];
      return rowColCountItems.concat(alwaysItems).concat(appearanceItems).concat(alignmentItem).concat(classListItem);
    };

    const styleTDTH = (dom, elm, name, value) => {
      if (elm.tagName === 'TD' || elm.tagName === 'TH') {
        if (isString(name) && isNonNullable(value)) {
          dom.setStyle(elm, name, value);
        } else {
          dom.setStyles(elm, name);
        }
      } else {
        if (elm.children) {
          for (let i = 0; i < elm.children.length; i++) {
            styleTDTH(dom, elm.children[i], name, value);
          }
        }
      }
    };
    const applyDataToElement = (editor, tableElm, data, shouldApplyOnCell) => {
      const dom = editor.dom;
      const attrs = {};
      const styles = {};
      const shouldStyleWithCss$1 = shouldStyleWithCss(editor);
      const hasAdvancedTableTab$1 = hasAdvancedTableTab(editor);
      const borderIsZero = parseFloat(data.border) === 0;
      if (!isUndefined(data.class) && data.class !== 'mce-no-match') {
        attrs.class = data.class;
      }
      styles.height = addP***REMOVED***Suffi***REMOVED***(data.height);
      if (shouldStyleWithCss$1) {
        styles.width = addP***REMOVED***Suffi***REMOVED***(data.width);
      } else if (dom.getAttrib(tableElm, 'width')) {
        attrs.width = removeP***REMOVED***Suffi***REMOVED***(data.width);
      }
      if (shouldStyleWithCss$1) {
        if (borderIsZero) {
          attrs.border = 0;
          styles['border-width'] = '';
        } else {
          styles['border-width'] = addP***REMOVED***Suffi***REMOVED***(data.border);
          attrs.border = 1;
        }
        styles['border-spacing'] = addP***REMOVED***Suffi***REMOVED***(data.cellspacing);
      } else {
        attrs.border = borderIsZero ? 0 : data.border;
        attrs.cellpadding = data.cellpadding;
        attrs.cellspacing = data.cellspacing;
      }
      if (shouldStyleWithCss$1 && tableElm.children) {
        const cellStyles = {};
        if (borderIsZero) {
          cellStyles['border-width'] = '';
        } else if (shouldApplyOnCell.border) {
          cellStyles['border-width'] = addP***REMOVED***Suffi***REMOVED***(data.border);
        }
        if (shouldApplyOnCell.cellpadding) {
          cellStyles.padding = addP***REMOVED***Suffi***REMOVED***(data.cellpadding);
        }
        if (hasAdvancedTableTab$1 && shouldApplyOnCell.bordercolor) {
          cellStyles['border-color'] = data.bordercolor;
        }
        if (!isEmpty$1(cellStyles)) {
          for (let i = 0; i < tableElm.children.length; i++) {
            styleTDTH(dom, tableElm.children[i], cellStyles);
          }
        }
      }
      if (hasAdvancedTableTab$1) {
        const advData = data;
        styles['background-color'] = advData.backgroundcolor;
        styles['border-color'] = advData.bordercolor;
        styles['border-style'] = advData.borderstyle;
      }
      dom.setStyles(tableElm, {
        ...getDefaultStyles(editor),
        ...styles
      });
      dom.setAttribs(tableElm, {
        ...getDefaultAttributes(editor),
        ...attrs
      });
    };
    const onSubmitTableForm = (editor, tableElm, oldData, api) => {
      const dom = editor.dom;
      const data = api.getData();
      const modifiedData = filter$1(data, (value, key) => oldData[key] !== value);
      api.close();
      editor.undoManager.transact(() => {
        if (!tableElm) {
          const cols = toInt(data.cols).getOr(1);
          const rows = toInt(data.rows).getOr(1);
          editor.e***REMOVED***ecCommand('mceInsertTable', false, {
            rows,
            columns: cols
          });
          tableElm = getSelectionCell(getSelectionStart(editor), getIsRoot(editor)).bind(cell => table(cell, getIsRoot(editor))).map(table => table.dom).getOrDie();
        }
        if (size(modifiedData) > 0) {
          const applicableCellProperties = {
            border: has(modifiedData, 'border'),
            bordercolor: has(modifiedData, 'bordercolor'),
            cellpadding: has(modifiedData, 'cellpadding')
          };
          applyDataToElement(editor, tableElm, data, applicableCellProperties);
          const captionElm = dom.select('caption', tableElm)[0];
          if (captionElm && !data.caption || !captionElm && data.caption) {
            editor.e***REMOVED***ecCommand('mceTableToggleCaption');
          }
          setAlign(editor, tableElm, data.align);
        }
        editor.focus();
        editor.addVisual();
        if (size(modifiedData) > 0) {
          const captionModified = has(modifiedData, 'caption');
          const styleModified = captionModified ? size(modifiedData) > 1 : true;
          fireTableModified(editor, tableElm, {
            structure: captionModified,
            style: styleModified
          });
        }
      });
    };
    const open = (editor, insertNewTable) => {
      const dom = editor.dom;
      let tableElm;
      let data = e***REMOVED***tractDataFromSettings(editor, hasAdvancedTableTab(editor));
      if (insertNewTable) {
        data.cols = '1';
        data.rows = '1';
        if (hasAdvancedTableTab(editor)) {
          data.borderstyle = '';
          data.bordercolor = '';
          data.backgroundcolor = '';
        }
      } else {
        tableElm = dom.getParent(editor.selection.getStart(), 'table', editor.getBody());
        if (tableElm) {
          data = e***REMOVED***tractDataFromTableElement(editor, tableElm, hasAdvancedTableTab(editor));
        } else {
          if (hasAdvancedTableTab(editor)) {
            data.borderstyle = '';
            data.bordercolor = '';
            data.backgroundcolor = '';
          }
        }
      }
      const classes = buildClassList(getTableClassList(editor));
      if (classes.isSome()) {
        if (data.class) {
          data.class = data.class.replace(/\s*mce\-item\-table\s*/g, '');
        }
      }
      const generalPanel = {
        type: 'grid',
        columns: 2,
        items: getItems(editor, classes.getOr([]), insertNewTable)
      };
      const nonAdvancedForm = () => ({
        type: 'panel',
        items: [generalPanel]
      });
      const advancedForm = () => ({
        type: 'tabpanel',
        tabs: [
          {
            title: 'General',
            name: 'general',
            items: [generalPanel]
          },
          getAdvancedTab(editor, 'table')
        ]
      });
      const dialogBody = hasAdvancedTableTab(editor) ? advancedForm() : nonAdvancedForm();
      editor.windowManager.open({
        title: 'Table Properties',
        size: 'normal',
        body: dialogBody,
        onSubmit: curry(onSubmitTableForm, editor, tableElm, data),
        buttons: [
          {
            type: 'cancel',
            name: 'cancel',
            te***REMOVED***t: 'Cancel'
          },
          {
            type: 'submit',
            name: 'save',
            te***REMOVED***t: 'Save',
            primary: true
          }
        ],
        initialData: data
      });
    };

    const registerCommands = editor => {
      const runAction = f => {
        if (isInEditableConte***REMOVED***t(getSelectionStart(editor))) {
          f();
        }
      };
      each$1({
        mceTableProps: curry(open, editor, false),
        mceTableRowProps: curry(open$1, editor),
        mceTableCellProps: curry(open$2, editor),
        mceInsertTableDialog: curry(open, editor, true)
      }, (func, name) => editor.addCommand(name, () => runAction(func)));
    };

    const child = (scope, selector) => child$1(scope, selector).isSome();

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

    const noMenu = cell => ({
      element: cell,
      mergable: Optional.none(),
      unmergable: Optional.none(),
      selection: [cell]
    });
    const forMenu = (selectedCells, table, cell) => ({
      element: cell,
      mergable: mergable(table, selectedCells, ephemera),
      unmergable: unmergable(selectedCells),
      selection: selection(selectedCells)
    });

    const getSelectionTargets = editor => {
      const targets = Cell(Optional.none());
      const changeHandlers = Cell([]);
      let selectionDetails = Optional.none();
      const isCaption = isTag('caption');
      const isDisabledForSelection = key => selectionDetails.forall(details => !details[key]);
      const getStart = () => getSelectionCellOrCaption(getSelectionStart(editor), getIsRoot(editor));
      const getEnd = () => getSelectionCellOrCaption(getSelectionEnd(editor), getIsRoot(editor));
      const findTargets = () => getStart().bind(startCellOrCaption => flatten(lift2(table(startCellOrCaption), getEnd().bind(table), (startTable, endTable) => {
        if (eq(startTable, endTable)) {
          if (isCaption(startCellOrCaption)) {
            return Optional.some(noMenu(startCellOrCaption));
          } else {
            return Optional.some(forMenu(getCellsFromSelection(editor), startTable, startCellOrCaption));
          }
        }
        return Optional.none();
      })));
      const getE***REMOVED***tractedDetails = targets => {
        const tableOpt = table(targets.element);
        return tableOpt.map(table => {
          const warehouse = Warehouse.fromTable(table);
          const selectedCells = onCells(warehouse, targets).getOr([]);
          const locked = foldl(selectedCells, (acc, cell) => {
            if (cell.isLocked) {
              acc.onAny = true;
              if (cell.column === 0) {
                acc.onFirst = true;
              } else if (cell.column + cell.colspan >= warehouse.grid.columns) {
                acc.onLast = true;
              }
            }
            return acc;
          }, {
            onAny: false,
            onFirst: false,
            onLast: false
          });
          return {
            mergeable: onUnlockedMergable(warehouse, targets).isSome(),
            unmergeable: onUnlockedUnmergable(warehouse, targets).isSome(),
            locked
          };
        });
      };
      const resetTargets = () => {
        targets.set(cached(findTargets)());
        selectionDetails = targets.get().bind(getE***REMOVED***tractedDetails);
        each(changeHandlers.get(), call);
      };
      const setupHandler = handler => {
        handler();
        changeHandlers.set(changeHandlers.get().concat([handler]));
        return () => {
          changeHandlers.set(filter(changeHandlers.get(), h => h !== handler));
        };
      };
      const onSetup = (api, isDisabled) => setupHandler(() => targets.get().fold(() => {
        api.setEnabled(false);
      }, targets => {
        api.setEnabled(!isDisabled(targets) && editor.selection.isEditable());
      }));
      const onSetupWithToggle = (api, isDisabled, isActive) => setupHandler(() => targets.get().fold(() => {
        api.setEnabled(false);
        api.setActive(false);
      }, targets => {
        api.setEnabled(!isDisabled(targets) && editor.selection.isEditable());
        api.setActive(isActive(targets));
      }));
      const isDisabledFromLocked = lockedDisable => selectionDetails.e***REMOVED***ists(details => details.locked[lockedDisable]);
      const onSetupTable = api => onSetup(api, _ => false);
      const onSetupCellOrRow = api => onSetup(api, targets => isCaption(targets.element));
      const onSetupColumn = lockedDisable => api => onSetup(api, targets => isCaption(targets.element) || isDisabledFromLocked(lockedDisable));
      const onSetupPasteable = getClipboardData => api => onSetup(api, targets => isCaption(targets.element) || getClipboardData().isNone());
      const onSetupPasteableColumn = (getClipboardData, lockedDisable) => api => onSetup(api, targets => isCaption(targets.element) || getClipboardData().isNone() || isDisabledFromLocked(lockedDisable));
      const onSetupMergeable = api => onSetup(api, _targets => isDisabledForSelection('mergeable'));
      const onSetupUnmergeable = api => onSetup(api, _targets => isDisabledForSelection('unmergeable'));
      const onSetupTableWithCaption = api => {
        return onSetupWithToggle(api, never, targets => {
          const tableOpt = table(targets.element, getIsRoot(editor));
          return tableOpt.e***REMOVED***ists(table => child(table, 'caption'));
        });
      };
      const onSetupTableHeaders = (command, headerType) => api => {
        return onSetupWithToggle(api, targets => isCaption(targets.element), () => editor.queryCommandValue(command) === headerType);
      };
      const onSetupTableRowHeaders = onSetupTableHeaders('mceTableRowType', 'header');
      const onSetupTableColumnHeaders = onSetupTableHeaders('mceTableColType', 'th');
      editor.on('NodeChange E***REMOVED***ecCommand TableSelectorChange', resetTargets);
      return {
        onSetupTable,
        onSetupCellOrRow,
        onSetupColumn,
        onSetupPasteable,
        onSetupPasteableColumn,
        onSetupMergeable,
        onSetupUnmergeable,
        resetTargets,
        onSetupTableWithCaption,
        onSetupTableRowHeaders,
        onSetupTableColumnHeaders,
        targets: targets.get
      };
    };

    var global = tinymce.util.Tools.resolve('tinymce.FakeClipboard');

    const tableTypeBase = '***REMOVED***-tinymce/dom-table-';
    const tableTypeRow = tableTypeBase + 'rows';
    const tableTypeColumn = tableTypeBase + 'columns';
    const getData = type => {
      var _a;
      const items = (_a = global.read()) !== null && _a !== void 0 ? _a : [];
      return findMap(items, item => Optional.from(item.getType(type)));
    };
    const getRows = () => getData(tableTypeRow);
    const getColumns = () => getData(tableTypeColumn);

    const onSetupEditable$1 = editor => api => {
      const nodeChanged = () => {
        api.setEnabled(editor.selection.isEditable());
      };
      editor.on('NodeChange', nodeChanged);
      nodeChanged();
      return () => {
        editor.off('NodeChange', nodeChanged);
      };
    };
    const addButtons = (editor, selectionTargets) => {
      editor.ui.registry.addMenuButton('table', {
        tooltip: 'Table',
        icon: 'table',
        onSetup: onSetupEditable$1(editor),
        fetch: callback => callback('inserttable | cell row column | advtablesort | tableprops deletetable')
      });
      const cmd = command => () => editor.e***REMOVED***ecCommand(command);
      const addButtonIfRegistered = (name, spec) => {
        if (editor.queryCommandSupported(spec.command)) {
          editor.ui.registry.addButton(name, {
            ...spec,
            onAction: isFunction(spec.onAction) ? spec.onAction : cmd(spec.command)
          });
        }
      };
      const addToggleButtonIfRegistered = (name, spec) => {
        if (editor.queryCommandSupported(spec.command)) {
          editor.ui.registry.addToggleButton(name, {
            ...spec,
            onAction: isFunction(spec.onAction) ? spec.onAction : cmd(spec.command)
          });
        }
      };
      addButtonIfRegistered('tableprops', {
        tooltip: 'Table properties',
        command: 'mceTableProps',
        icon: 'table',
        onSetup: selectionTargets.onSetupTable
      });
      addButtonIfRegistered('tabledelete', {
        tooltip: 'Delete table',
        command: 'mceTableDelete',
        icon: 'table-delete-table',
        onSetup: selectionTargets.onSetupTable
      });
      addButtonIfRegistered('tablecellprops', {
        tooltip: 'Cell properties',
        command: 'mceTableCellProps',
        icon: 'table-cell-properties',
        onSetup: selectionTargets.onSetupCellOrRow
      });
      addButtonIfRegistered('tablemergecells', {
        tooltip: 'Merge cells',
        command: 'mceTableMergeCells',
        icon: 'table-merge-cells',
        onSetup: selectionTargets.onSetupMergeable
      });
      addButtonIfRegistered('tablesplitcells', {
        tooltip: 'Split cell',
        command: 'mceTableSplitCells',
        icon: 'table-split-cells',
        onSetup: selectionTargets.onSetupUnmergeable
      });
      addButtonIfRegistered('tableinsertrowbefore', {
        tooltip: 'Insert row before',
        command: 'mceTableInsertRowBefore',
        icon: 'table-insert-row-above',
        onSetup: selectionTargets.onSetupCellOrRow
      });
      addButtonIfRegistered('tableinsertrowafter', {
        tooltip: 'Insert row after',
        command: 'mceTableInsertRowAfter',
        icon: 'table-insert-row-after',
        onSetup: selectionTargets.onSetupCellOrRow
      });
      addButtonIfRegistered('tabledeleterow', {
        tooltip: 'Delete row',
        command: 'mceTableDeleteRow',
        icon: 'table-delete-row',
        onSetup: selectionTargets.onSetupCellOrRow
      });
      addButtonIfRegistered('tablerowprops', {
        tooltip: 'Row properties',
        command: 'mceTableRowProps',
        icon: 'table-row-properties',
        onSetup: selectionTargets.onSetupCellOrRow
      });
      addButtonIfRegistered('tableinsertcolbefore', {
        tooltip: 'Insert column before',
        command: 'mceTableInsertColBefore',
        icon: 'table-insert-column-before',
        onSetup: selectionTargets.onSetupColumn('onFirst')
      });
      addButtonIfRegistered('tableinsertcolafter', {
        tooltip: 'Insert column after',
        command: 'mceTableInsertColAfter',
        icon: 'table-insert-column-after',
        onSetup: selectionTargets.onSetupColumn('onLast')
      });
      addButtonIfRegistered('tabledeletecol', {
        tooltip: 'Delete column',
        command: 'mceTableDeleteCol',
        icon: 'table-delete-column',
        onSetup: selectionTargets.onSetupColumn('onAny')
      });
      addButtonIfRegistered('tablecutrow', {
        tooltip: 'Cut row',
        command: 'mceTableCutRow',
        icon: 'cut-row',
        onSetup: selectionTargets.onSetupCellOrRow
      });
      addButtonIfRegistered('tablecopyrow', {
        tooltip: 'Copy row',
        command: 'mceTableCopyRow',
        icon: 'duplicate-row',
        onSetup: selectionTargets.onSetupCellOrRow
      });
      addButtonIfRegistered('tablepasterowbefore', {
        tooltip: 'Paste row before',
        command: 'mceTablePasteRowBefore',
        icon: 'paste-row-before',
        onSetup: selectionTargets.onSetupPasteable(getRows)
      });
      addButtonIfRegistered('tablepasterowafter', {
        tooltip: 'Paste row after',
        command: 'mceTablePasteRowAfter',
        icon: 'paste-row-after',
        onSetup: selectionTargets.onSetupPasteable(getRows)
      });
      addButtonIfRegistered('tablecutcol', {
        tooltip: 'Cut column',
        command: 'mceTableCutCol',
        icon: 'cut-column',
        onSetup: selectionTargets.onSetupColumn('onAny')
      });
      addButtonIfRegistered('tablecopycol', {
        tooltip: 'Copy column',
        command: 'mceTableCopyCol',
        icon: 'duplicate-column',
        onSetup: selectionTargets.onSetupColumn('onAny')
      });
      addButtonIfRegistered('tablepastecolbefore', {
        tooltip: 'Paste column before',
        command: 'mceTablePasteColBefore',
        icon: 'paste-column-before',
        onSetup: selectionTargets.onSetupPasteableColumn(getColumns, 'onFirst')
      });
      addButtonIfRegistered('tablepastecolafter', {
        tooltip: 'Paste column after',
        command: 'mceTablePasteColAfter',
        icon: 'paste-column-after',
        onSetup: selectionTargets.onSetupPasteableColumn(getColumns, 'onLast')
      });
      addButtonIfRegistered('tableinsertdialog', {
        tooltip: 'Insert table',
        command: 'mceInsertTableDialog',
        icon: 'table',
        onSetup: onSetupEditable$1(editor)
      });
      const tableClassList = filterNoneItem(getTableClassList(editor));
      if (tableClassList.length !== 0 && editor.queryCommandSupported('mceTableToggleClass')) {
        editor.ui.registry.addMenuButton('tableclass', {
          icon: 'table-classes',
          tooltip: 'Table styles',
          fetch: generateMenuItemsCallback(editor, tableClassList, 'tableclass', value => editor.e***REMOVED***ecCommand('mceTableToggleClass', false, value)),
          onSetup: selectionTargets.onSetupTable
        });
      }
      const tableCellClassList = filterNoneItem(getCellClassList(editor));
      if (tableCellClassList.length !== 0 && editor.queryCommandSupported('mceTableCellToggleClass')) {
        editor.ui.registry.addMenuButton('tablecellclass', {
          icon: 'table-cell-classes',
          tooltip: 'Cell styles',
          fetch: generateMenuItemsCallback(editor, tableCellClassList, 'tablecellclass', value => editor.e***REMOVED***ecCommand('mceTableCellToggleClass', false, value)),
          onSetup: selectionTargets.onSetupCellOrRow
        });
      }
      if (editor.queryCommandSupported('mceTableApplyCellStyle')) {
        editor.ui.registry.addMenuButton('tablecellvalign', {
          icon: 'vertical-align',
          tooltip: 'Vertical align',
          fetch: generateMenuItemsCallback(editor, verticalAlignValues, 'tablecellverticalalign', applyTableCellStyle(editor, 'vertical-align')),
          onSetup: selectionTargets.onSetupCellOrRow
        });
        editor.ui.registry.addMenuButton('tablecellborderwidth', {
          icon: 'border-width',
          tooltip: 'Border width',
          fetch: generateMenuItemsCallback(editor, getTableBorderWidths(editor), 'tablecellborderwidth', applyTableCellStyle(editor, 'border-width')),
          onSetup: selectionTargets.onSetupCellOrRow
        });
        editor.ui.registry.addMenuButton('tablecellborderstyle', {
          icon: 'border-style',
          tooltip: 'Border style',
          fetch: generateMenuItemsCallback(editor, getTableBorderStyles(editor), 'tablecellborderstyle', applyTableCellStyle(editor, 'border-style')),
          onSetup: selectionTargets.onSetupCellOrRow
        });
        editor.ui.registry.addMenuButton('tablecellbackgroundcolor', {
          icon: 'cell-background-color',
          tooltip: 'Background color',
          fetch: callback => callback(buildColorMenu(editor, getTableBackgroundColorMap(editor), 'background-color')),
          onSetup: selectionTargets.onSetupCellOrRow
        });
        editor.ui.registry.addMenuButton('tablecellbordercolor', {
          icon: 'cell-border-color',
          tooltip: 'Border color',
          fetch: callback => callback(buildColorMenu(editor, getTableBorderColorMap(editor), 'border-color')),
          onSetup: selectionTargets.onSetupCellOrRow
        });
      }
      addToggleButtonIfRegistered('tablecaption', {
        tooltip: 'Table caption',
        icon: 'table-caption',
        command: 'mceTableToggleCaption',
        onSetup: selectionTargets.onSetupTableWithCaption
      });
      addToggleButtonIfRegistered('tablerowheader', {
        tooltip: 'Row header',
        icon: 'table-top-header',
        command: 'mceTableRowType',
        onAction: changeRowHeader(editor),
        onSetup: selectionTargets.onSetupTableRowHeaders
      });
      addToggleButtonIfRegistered('tablecolheader', {
        tooltip: 'Column header',
        icon: 'table-left-header',
        command: 'mceTableColType',
        onAction: changeColumnHeader(editor),
        onSetup: selectionTargets.onSetupTableColumnHeaders
      });
    };
    const addToolbars = editor => {
      const isEditableTable = table => editor.dom.is(table, 'table') && editor.getBody().contains(table) && editor.dom.isEditable(table.parentNode);
      const toolbar = getToolbar(editor);
      if (toolbar.length > 0) {
        editor.ui.registry.addConte***REMOVED***tToolbar('table', {
          predicate: isEditableTable,
          items: toolbar,
          scope: 'node',
          position: 'node'
        });
      }
    };

    const onSetupEditable = editor => api => {
      const nodeChanged = () => {
        api.setEnabled(editor.selection.isEditable());
      };
      editor.on('NodeChange', nodeChanged);
      nodeChanged();
      return () => {
        editor.off('NodeChange', nodeChanged);
      };
    };
    const addMenuItems = (editor, selectionTargets) => {
      const cmd = command => () => editor.e***REMOVED***ecCommand(command);
      const addMenuIfRegistered = (name, spec) => {
        if (editor.queryCommandSupported(spec.command)) {
          editor.ui.registry.addMenuItem(name, {
            ...spec,
            onAction: isFunction(spec.onAction) ? spec.onAction : cmd(spec.command)
          });
          return true;
        } else {
          return false;
        }
      };
      const addToggleMenuIfRegistered = (name, spec) => {
        if (editor.queryCommandSupported(spec.command)) {
          editor.ui.registry.addToggleMenuItem(name, {
            ...spec,
            onAction: isFunction(spec.onAction) ? spec.onAction : cmd(spec.command)
          });
        }
      };
      const insertTableAction = data => {
        editor.e***REMOVED***ecCommand('mceInsertTable', false, {
          rows: data.numRows,
          columns: data.numColumns
        });
      };
      const hasRowMenuItems = [
        addMenuIfRegistered('tableinsertrowbefore', {
          te***REMOVED***t: 'Insert row before',
          icon: 'table-insert-row-above',
          command: 'mceTableInsertRowBefore',
          onSetup: selectionTargets.onSetupCellOrRow
        }),
        addMenuIfRegistered('tableinsertrowafter', {
          te***REMOVED***t: 'Insert row after',
          icon: 'table-insert-row-after',
          command: 'mceTableInsertRowAfter',
          onSetup: selectionTargets.onSetupCellOrRow
        }),
        addMenuIfRegistered('tabledeleterow', {
          te***REMOVED***t: 'Delete row',
          icon: 'table-delete-row',
          command: 'mceTableDeleteRow',
          onSetup: selectionTargets.onSetupCellOrRow
        }),
        addMenuIfRegistered('tablerowprops', {
          te***REMOVED***t: 'Row properties',
          icon: 'table-row-properties',
          command: 'mceTableRowProps',
          onSetup: selectionTargets.onSetupCellOrRow
        }),
        addMenuIfRegistered('tablecutrow', {
          te***REMOVED***t: 'Cut row',
          icon: 'cut-row',
          command: 'mceTableCutRow',
          onSetup: selectionTargets.onSetupCellOrRow
        }),
        addMenuIfRegistered('tablecopyrow', {
          te***REMOVED***t: 'Copy row',
          icon: 'duplicate-row',
          command: 'mceTableCopyRow',
          onSetup: selectionTargets.onSetupCellOrRow
        }),
        addMenuIfRegistered('tablepasterowbefore', {
          te***REMOVED***t: 'Paste row before',
          icon: 'paste-row-before',
          command: 'mceTablePasteRowBefore',
          onSetup: selectionTargets.onSetupPasteable(getRows)
        }),
        addMenuIfRegistered('tablepasterowafter', {
          te***REMOVED***t: 'Paste row after',
          icon: 'paste-row-after',
          command: 'mceTablePasteRowAfter',
          onSetup: selectionTargets.onSetupPasteable(getRows)
        })
      ];
      const hasColumnMenuItems = [
        addMenuIfRegistered('tableinsertcolumnbefore', {
          te***REMOVED***t: 'Insert column before',
          icon: 'table-insert-column-before',
          command: 'mceTableInsertColBefore',
          onSetup: selectionTargets.onSetupColumn('onFirst')
        }),
        addMenuIfRegistered('tableinsertcolumnafter', {
          te***REMOVED***t: 'Insert column after',
          icon: 'table-insert-column-after',
          command: 'mceTableInsertColAfter',
          onSetup: selectionTargets.onSetupColumn('onLast')
        }),
        addMenuIfRegistered('tabledeletecolumn', {
          te***REMOVED***t: 'Delete column',
          icon: 'table-delete-column',
          command: 'mceTableDeleteCol',
          onSetup: selectionTargets.onSetupColumn('onAny')
        }),
        addMenuIfRegistered('tablecutcolumn', {
          te***REMOVED***t: 'Cut column',
          icon: 'cut-column',
          command: 'mceTableCutCol',
          onSetup: selectionTargets.onSetupColumn('onAny')
        }),
        addMenuIfRegistered('tablecopycolumn', {
          te***REMOVED***t: 'Copy column',
          icon: 'duplicate-column',
          command: 'mceTableCopyCol',
          onSetup: selectionTargets.onSetupColumn('onAny')
        }),
        addMenuIfRegistered('tablepastecolumnbefore', {
          te***REMOVED***t: 'Paste column before',
          icon: 'paste-column-before',
          command: 'mceTablePasteColBefore',
          onSetup: selectionTargets.onSetupPasteableColumn(getColumns, 'onFirst')
        }),
        addMenuIfRegistered('tablepastecolumnafter', {
          te***REMOVED***t: 'Paste column after',
          icon: 'paste-column-after',
          command: 'mceTablePasteColAfter',
          onSetup: selectionTargets.onSetupPasteableColumn(getColumns, 'onLast')
        })
      ];
      const hasCellMenuItems = [
        addMenuIfRegistered('tablecellprops', {
          te***REMOVED***t: 'Cell properties',
          icon: 'table-cell-properties',
          command: 'mceTableCellProps',
          onSetup: selectionTargets.onSetupCellOrRow
        }),
        addMenuIfRegistered('tablemergecells', {
          te***REMOVED***t: 'Merge cells',
          icon: 'table-merge-cells',
          command: 'mceTableMergeCells',
          onSetup: selectionTargets.onSetupMergeable
        }),
        addMenuIfRegistered('tablesplitcells', {
          te***REMOVED***t: 'Split cell',
          icon: 'table-split-cells',
          command: 'mceTableSplitCells',
          onSetup: selectionTargets.onSetupUnmergeable
        })
      ];
      if (!hasTableGrid(editor)) {
        editor.ui.registry.addMenuItem('inserttable', {
          te***REMOVED***t: 'Table',
          icon: 'table',
          onAction: cmd('mceInsertTableDialog'),
          onSetup: onSetupEditable(editor)
        });
      } else {
        editor.ui.registry.addNestedMenuItem('inserttable', {
          te***REMOVED***t: 'Table',
          icon: 'table',
          getSubmenuItems: () => [{
              type: 'fancymenuitem',
              fancytype: 'inserttable',
              onAction: insertTableAction
            }],
          onSetup: onSetupEditable(editor)
        });
      }
      editor.ui.registry.addMenuItem('inserttabledialog', {
        te***REMOVED***t: 'Insert table',
        icon: 'table',
        onAction: cmd('mceInsertTableDialog'),
        onSetup: onSetupEditable(editor)
      });
      addMenuIfRegistered('tableprops', {
        te***REMOVED***t: 'Table properties',
        onSetup: selectionTargets.onSetupTable,
        command: 'mceTableProps'
      });
      addMenuIfRegistered('deletetable', {
        te***REMOVED***t: 'Delete table',
        icon: 'table-delete-table',
        onSetup: selectionTargets.onSetupTable,
        command: 'mceTableDelete'
      });
      if (contains(hasRowMenuItems, true)) {
        editor.ui.registry.addNestedMenuItem('row', {
          type: 'nestedmenuitem',
          te***REMOVED***t: 'Row',
          getSubmenuItems: constant('tableinsertrowbefore tableinsertrowafter tabledeleterow tablerowprops | tablecutrow tablecopyrow tablepasterowbefore tablepasterowafter')
        });
      }
      if (contains(hasColumnMenuItems, true)) {
        editor.ui.registry.addNestedMenuItem('column', {
          type: 'nestedmenuitem',
          te***REMOVED***t: 'Column',
          getSubmenuItems: constant('tableinsertcolumnbefore tableinsertcolumnafter tabledeletecolumn | tablecutcolumn tablecopycolumn tablepastecolumnbefore tablepastecolumnafter')
        });
      }
      if (contains(hasCellMenuItems, true)) {
        editor.ui.registry.addNestedMenuItem('cell', {
          type: 'nestedmenuitem',
          te***REMOVED***t: 'Cell',
          getSubmenuItems: constant('tablecellprops tablemergecells tablesplitcells')
        });
      }
      editor.ui.registry.addConte***REMOVED***tMenu('table', {
        update: () => {
          selectionTargets.resetTargets();
          return selectionTargets.targets().fold(constant(''), targets => {
            if (name(targets.element) === 'caption') {
              return 'tableprops deletetable';
            } else {
              return 'cell row column | advtablesort | tableprops deletetable';
            }
          });
        }
      });
      const tableClassList = filterNoneItem(getTableClassList(editor));
      if (tableClassList.length !== 0 && editor.queryCommandSupported('mceTableToggleClass')) {
        editor.ui.registry.addNestedMenuItem('tableclass', {
          icon: 'table-classes',
          te***REMOVED***t: 'Table styles',
          getSubmenuItems: () => buildMenuItems(editor, tableClassList, 'tableclass', value => editor.e***REMOVED***ecCommand('mceTableToggleClass', false, value)),
          onSetup: selectionTargets.onSetupTable
        });
      }
      const tableCellClassList = filterNoneItem(getCellClassList(editor));
      if (tableCellClassList.length !== 0 && editor.queryCommandSupported('mceTableCellToggleClass')) {
        editor.ui.registry.addNestedMenuItem('tablecellclass', {
          icon: 'table-cell-classes',
          te***REMOVED***t: 'Cell styles',
          getSubmenuItems: () => buildMenuItems(editor, tableCellClassList, 'tablecellclass', value => editor.e***REMOVED***ecCommand('mceTableCellToggleClass', false, value)),
          onSetup: selectionTargets.onSetupCellOrRow
        });
      }
      if (editor.queryCommandSupported('mceTableApplyCellStyle')) {
        editor.ui.registry.addNestedMenuItem('tablecellvalign', {
          icon: 'vertical-align',
          te***REMOVED***t: 'Vertical align',
          getSubmenuItems: () => buildMenuItems(editor, verticalAlignValues, 'tablecellverticalalign', applyTableCellStyle(editor, 'vertical-align')),
          onSetup: selectionTargets.onSetupCellOrRow
        });
        editor.ui.registry.addNestedMenuItem('tablecellborderwidth', {
          icon: 'border-width',
          te***REMOVED***t: 'Border width',
          getSubmenuItems: () => buildMenuItems(editor, getTableBorderWidths(editor), 'tablecellborderwidth', applyTableCellStyle(editor, 'border-width')),
          onSetup: selectionTargets.onSetupCellOrRow
        });
        editor.ui.registry.addNestedMenuItem('tablecellborderstyle', {
          icon: 'border-style',
          te***REMOVED***t: 'Border style',
          getSubmenuItems: () => buildMenuItems(editor, getTableBorderStyles(editor), 'tablecellborderstyle', applyTableCellStyle(editor, 'border-style')),
          onSetup: selectionTargets.onSetupCellOrRow
        });
        editor.ui.registry.addNestedMenuItem('tablecellbackgroundcolor', {
          icon: 'cell-background-color',
          te***REMOVED***t: 'Background color',
          getSubmenuItems: () => buildColorMenu(editor, getTableBackgroundColorMap(editor), 'background-color'),
          onSetup: selectionTargets.onSetupCellOrRow
        });
        editor.ui.registry.addNestedMenuItem('tablecellbordercolor', {
          icon: 'cell-border-color',
          te***REMOVED***t: 'Border color',
          getSubmenuItems: () => buildColorMenu(editor, getTableBorderColorMap(editor), 'border-color'),
          onSetup: selectionTargets.onSetupCellOrRow
        });
      }
      addToggleMenuIfRegistered('tablecaption', {
        icon: 'table-caption',
        te***REMOVED***t: 'Table caption',
        command: 'mceTableToggleCaption',
        onSetup: selectionTargets.onSetupTableWithCaption
      });
      addToggleMenuIfRegistered('tablerowheader', {
        te***REMOVED***t: 'Row header',
        icon: 'table-top-header',
        command: 'mceTableRowType',
        onAction: changeRowHeader(editor),
        onSetup: selectionTargets.onSetupTableRowHeaders
      });
      addToggleMenuIfRegistered('tablecolheader', {
        te***REMOVED***t: 'Column header',
        icon: 'table-left-header',
        command: 'mceTableColType',
        onAction: changeColumnHeader(editor),
        onSetup: selectionTargets.onSetupTableRowHeaders
      });
    };

    const Plugin = editor => {
      const selectionTargets = getSelectionTargets(editor);
      register(editor);
      registerCommands(editor);
      addMenuItems(editor, selectionTargets);
      addButtons(editor, selectionTargets);
      addToolbars(editor);
    };
    var Plugin$1 = () => {
      global$3.add('table', Plugin);
    };

    Plugin$1();

})();
