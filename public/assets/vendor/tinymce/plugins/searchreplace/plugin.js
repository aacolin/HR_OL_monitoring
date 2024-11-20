/**
 * TinyMCE version 7.2.1 (2024-07-03)
 */

(function () {
    'use strict';

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
    const isString = isType$1('string');
    const isArray = isType$1('array');
    const isBoolean = isSimpleType('boolean');
    const isNullable = a => a === null || a === undefined;
    const isNonNullable = a => !isNullable(a);
    const isNumber = isSimpleType('number');

    const noop = () => {
    };
    const constant = value => {
      return () => {
        return value;
      };
    };
    const always = constant(true);

    const punctuationStr = `[~\u2116|!-*+-\\/:;?@\\[-\`{}\u00A1\u00AB\u00B7\u00BB\u00BF;\u00B7\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1361-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u3008\u3009\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30\u2E31\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]`;

    const punctuation$1 = constant(punctuationStr);

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

    const punctuation = punctuation$1;

    var global$2 = tinymce.util.Tools.resolve('tinymce.Env');

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const nativeSlice = Array.prototype.slice;
    const nativePush = Array.prototype.push;
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
    const groupBy = (***REMOVED***s, f) => {
      if (***REMOVED***s.length === 0) {
        return [];
      } else {
        let wasType = f(***REMOVED***s[0]);
        const r = [];
        let group = [];
        for (let i = 0, len = ***REMOVED***s.length; i < len; i++) {
          const ***REMOVED*** = ***REMOVED***s[i];
          const type = f(***REMOVED***);
          if (type !== wasType) {
            r.push(group);
            group = [];
          }
          wasType = type;
          group.push(***REMOVED***);
        }
        if (group.length !== 0) {
          r.push(group);
        }
        return r;
      }
    };
    const foldl = (***REMOVED***s, f, acc) => {
      each(***REMOVED***s, (***REMOVED***, i) => {
        acc = f(acc, ***REMOVED***, i);
      });
      return acc;
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
    const bind = (***REMOVED***s, f) => flatten(map(***REMOVED***s, f));
    const sort = (***REMOVED***s, comparator) => {
      const copy = nativeSlice.call(***REMOVED***s, 0);
      copy.sort(comparator);
      return copy;
    };

    const hasOwnProperty = Object.hasOwnProperty;
    const has = (obj, key) => hasOwnProperty.call(obj, key);

    typeof window !== 'undefined' ? window : Function('return this;')();

    const DOCUMENT = 9;
    const DOCUMENT_FRAGMENT = 11;
    const ELEMENT = 1;
    const TEXT = 3;

    const type = element => element.dom.nodeType;
    const isType = t => element => type(element) === t;
    const isTe***REMOVED***t$1 = isType(TEXT);

    const rawSet = (dom, key, value) => {
      if (isString(value) || isBoolean(value) || isNumber(value)) {
        dom.setAttribute(key, value + '');
      } else {
        console.error('Invalid call to Attribute.set. Key ', key, ':: Value ', value, ':: Element ', dom);
        throw new Error('Attribute value was not simple');
      }
    };
    const set = (element, key, value) => {
      rawSet(element.dom, key, value);
    };

    const fromHtml = (html, scope) => {
      const doc = scope || document;
      const div = doc.createElement('div');
      div.innerHTML = html;
      if (!div.hasChildNodes() || div.childNodes.length > 1) {
        const message = 'HTML does not have a single root node';
        console.error(message, html);
        throw new Error(message);
      }
      return fromDom(div.childNodes[0]);
    };
    const fromTag = (tag, scope) => {
      const doc = scope || document;
      const node = doc.createElement(tag);
      return fromDom(node);
    };
    const fromTe***REMOVED***t = (te***REMOVED***t, scope) => {
      const doc = scope || document;
      const node = doc.createTe***REMOVED***tNode(te***REMOVED***t);
      return fromDom(node);
    };
    const fromDom = node => {
      if (node === null || node === undefined) {
        throw new Error('Node cannot be null or undefined');
      }
      return { dom: node };
    };
    const fromPoint = (docElm, ***REMOVED***, y) => Optional.from(docElm.dom.elementFromPoint(***REMOVED***, y)).map(fromDom);
    const SugarElement = {
      fromHtml,
      fromTag,
      fromTe***REMOVED***t,
      fromDom,
      fromPoint
    };

    const bypassSelector = dom => dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT && dom.nodeType !== DOCUMENT_FRAGMENT || dom.childElementCount === 0;
    const all = (selector, scope) => {
      const base = scope === undefined ? document : scope.dom;
      return bypassSelector(base) ? [] : map(base.querySelectorAll(selector), SugarElement.fromDom);
    };

    const parent = element => Optional.from(element.dom.parentNode).map(SugarElement.fromDom);
    const children = element => map(element.dom.childNodes, SugarElement.fromDom);
    const spot = (element, offset) => ({
      element,
      offset
    });
    const leaf = (element, offset) => {
      const cs = children(element);
      return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
    };

    const before = (marker, element) => {
      const parent$1 = parent(marker);
      parent$1.each(v => {
        v.dom.insertBefore(element.dom, marker.dom);
      });
    };
    const append = (parent, element) => {
      parent.dom.appendChild(element.dom);
    };
    const wrap = (element, wrapper) => {
      before(element, wrapper);
      append(wrapper, element);
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

    const api = NodeValue(isTe***REMOVED***t$1, 'te***REMOVED***t');
    const get$1 = element => api.get(element);

    const compareDocumentPosition = (a, b, match) => {
      return (a.compareDocumentPosition(b) & match) !== 0;
    };
    const documentPositionPreceding = (a, b) => {
      return compareDocumentPosition(a, b, Node.DOCUMENT_POSITION_PRECEDING);
    };

    const descendants = (scope, selector) => all(selector, scope);

    var global = tinymce.util.Tools.resolve('tinymce.dom.TreeWalker');

    const isSimpleBoundary = (dom, node) => dom.isBlock(node) || has(dom.schema.getVoidElements(), node.nodeName);
    const isContentEditableFalse = (dom, node) => !dom.isEditable(node);
    const isContentEditableTrueInCef = (dom, node) => dom.getContentEditable(node) === 'true' && node.parentNode && !dom.isEditable(node.parentNode);
    const isHidden = (dom, node) => !dom.isBlock(node) && has(dom.schema.getWhitespaceElements(), node.nodeName);
    const isBoundary = (dom, node) => isSimpleBoundary(dom, node) || isContentEditableFalse(dom, node) || isHidden(dom, node) || isContentEditableTrueInCef(dom, node);
    const isTe***REMOVED***t = node => node.nodeType === 3;
    const nuSection = () => ({
      sOffset: 0,
      fOffset: 0,
      elements: []
    });
    const toLeaf = (node, offset) => leaf(SugarElement.fromDom(node), offset);
    const walk = (dom, walkerFn, startNode, callbacks, endNode, skipStart = true) => {
      let ne***REMOVED***t = skipStart ? walkerFn(false) : startNode;
      while (ne***REMOVED***t) {
        const isCefNode = isContentEditableFalse(dom, ne***REMOVED***t);
        if (isCefNode || isHidden(dom, ne***REMOVED***t)) {
          const stopWalking = isCefNode ? callbacks.cef(ne***REMOVED***t) : callbacks.boundary(ne***REMOVED***t);
          if (stopWalking) {
            break;
          } else {
            ne***REMOVED***t = walkerFn(true);
            continue;
          }
        } else if (isSimpleBoundary(dom, ne***REMOVED***t)) {
          if (callbacks.boundary(ne***REMOVED***t)) {
            break;
          }
        } else if (isTe***REMOVED***t(ne***REMOVED***t)) {
          callbacks.te***REMOVED***t(ne***REMOVED***t);
        }
        if (ne***REMOVED***t === endNode) {
          break;
        } else {
          ne***REMOVED***t = walkerFn(false);
        }
      }
    };
    const collectTe***REMOVED***tToBoundary = (dom, section, node, rootNode, forwards) => {
      var _a;
      if (isBoundary(dom, node)) {
        return;
      }
      const rootBlock = (_a = dom.getParent(rootNode, dom.isBlock)) !== null && _a !== void 0 ? _a : dom.getRoot();
      const walker = new global(node, rootBlock);
      const walkerFn = forwards ? walker.ne***REMOVED***t.bind(walker) : walker.prev.bind(walker);
      walk(dom, walkerFn, node, {
        boundary: always,
        cef: always,
        te***REMOVED***t: ne***REMOVED***t => {
          if (forwards) {
            section.fOffset += ne***REMOVED***t.length;
          } else {
            section.sOffset += ne***REMOVED***t.length;
          }
          section.elements.push(SugarElement.fromDom(ne***REMOVED***t));
        }
      });
    };
    const collect = (dom, rootNode, startNode, endNode, callbacks, skipStart = true) => {
      const walker = new global(startNode, rootNode);
      const sections = [];
      let current = nuSection();
      collectTe***REMOVED***tToBoundary(dom, current, startNode, rootNode, false);
      const finishSection = () => {
        if (current.elements.length > 0) {
          sections.push(current);
          current = nuSection();
        }
        return false;
      };
      walk(dom, walker.ne***REMOVED***t.bind(walker), startNode, {
        boundary: finishSection,
        cef: node => {
          finishSection();
          if (callbacks) {
            sections.push(...callbacks.cef(node));
          }
          return false;
        },
        te***REMOVED***t: ne***REMOVED***t => {
          current.elements.push(SugarElement.fromDom(ne***REMOVED***t));
          if (callbacks) {
            callbacks.te***REMOVED***t(ne***REMOVED***t, current);
          }
        }
      }, endNode, skipStart);
      if (endNode) {
        collectTe***REMOVED***tToBoundary(dom, current, endNode, rootNode, true);
      }
      finishSection();
      return sections;
    };
    const collectRangeSections = (dom, rng) => {
      const start = toLeaf(rng.startContainer, rng.startOffset);
      const startNode = start.element.dom;
      const end = toLeaf(rng.endContainer, rng.endOffset);
      const endNode = end.element.dom;
      return collect(dom, rng.commonAncestorContainer, startNode, endNode, {
        te***REMOVED***t: (node, section) => {
          if (node === endNode) {
            section.fOffset += node.length - end.offset;
          } else if (node === startNode) {
            section.sOffset += start.offset;
          }
        },
        cef: node => {
          const sections = bind(descendants(SugarElement.fromDom(node), '*[contenteditable=true]'), e => {
            const ceTrueNode = e.dom;
            return collect(dom, ceTrueNode, ceTrueNode);
          });
          return sort(sections, (a, b) => documentPositionPreceding(a.elements[0].dom, b.elements[0].dom) ? 1 : -1);
        }
      }, false);
    };
    const fromRng = (dom, rng) => rng.collapsed ? [] : collectRangeSections(dom, rng);
    const fromNode = (dom, node) => {
      const rng = dom.createRng();
      rng.selectNode(node);
      return fromRng(dom, rng);
    };
    const fromNodes = (dom, nodes) => bind(nodes, node => fromNode(dom, node));

    const find$2 = (te***REMOVED***t, pattern, start = 0, finish = te***REMOVED***t.length) => {
      const rege***REMOVED*** = pattern.rege***REMOVED***;
      rege***REMOVED***.lastInde***REMOVED*** = start;
      const results = [];
      let match;
      while (match = rege***REMOVED***.e***REMOVED***ec(te***REMOVED***t)) {
        const matchedTe***REMOVED***t = match[pattern.matchInde***REMOVED***];
        const matchStart = match.inde***REMOVED*** + match[0].inde***REMOVED***Of(matchedTe***REMOVED***t);
        const matchFinish = matchStart + matchedTe***REMOVED***t.length;
        if (matchFinish > finish) {
          break;
        }
        results.push({
          start: matchStart,
          finish: matchFinish
        });
        rege***REMOVED***.lastInde***REMOVED*** = matchFinish;
      }
      return results;
    };
    const e***REMOVED***tract = (elements, matches) => {
      const nodePositions = foldl(elements, (acc, element) => {
        const content = get$1(element);
        const start = acc.last;
        const finish = start + content.length;
        const positions = bind(matches, (match, matchId***REMOVED***) => {
          if (match.start < finish && match.finish > start) {
            return [{
                element,
                start: Math.ma***REMOVED***(start, match.start) - start,
                finish: Math.min(finish, match.finish) - start,
                matchId: matchId***REMOVED***
              }];
          } else {
            return [];
          }
        });
        return {
          results: acc.results.concat(positions),
          last: finish
        };
      }, {
        results: [],
        last: 0
      }).results;
      return groupBy(nodePositions, position => position.matchId);
    };

    const find$1 = (pattern, sections) => bind(sections, section => {
      const elements = section.elements;
      const content = map(elements, get$1).join('');
      const positions = find$2(content, pattern, section.sOffset, content.length - section.fOffset);
      return e***REMOVED***tract(elements, positions);
    });
    const mark = (matches, replacementNode) => {
      eachr(matches, (match, id***REMOVED***) => {
        eachr(match, pos => {
          const wrapper = SugarElement.fromDom(replacementNode.cloneNode(false));
          set(wrapper, 'data-mce-inde***REMOVED***', id***REMOVED***);
          const te***REMOVED***tNode = pos.element.dom;
          if (te***REMOVED***tNode.length === pos.finish && pos.start === 0) {
            wrap(pos.element, wrapper);
          } else {
            if (te***REMOVED***tNode.length !== pos.finish) {
              te***REMOVED***tNode.splitTe***REMOVED***t(pos.finish);
            }
            const matchNode = te***REMOVED***tNode.splitTe***REMOVED***t(pos.start);
            wrap(SugarElement.fromDom(matchNode), wrapper);
          }
        });
      });
    };
    const findAndMark = (dom, pattern, node, replacementNode) => {
      const te***REMOVED***tSections = fromNode(dom, node);
      const matches = find$1(pattern, te***REMOVED***tSections);
      mark(matches, replacementNode);
      return matches.length;
    };
    const findAndMarkInSelection = (dom, pattern, selection, replacementNode) => {
      const bookmark = selection.getBookmark();
      const nodes = dom.select('td[data-mce-selected],th[data-mce-selected]');
      const te***REMOVED***tSections = nodes.length > 0 ? fromNodes(dom, nodes) : fromRng(dom, selection.getRng());
      const matches = find$1(pattern, te***REMOVED***tSections);
      mark(matches, replacementNode);
      selection.moveToBookmark(bookmark);
      return matches.length;
    };

    const getElmInde***REMOVED*** = elm => {
      return elm.getAttribute('data-mce-inde***REMOVED***');
    };
    const markAllMatches = (editor, currentSearchState, pattern, inSelection) => {
      const marker = editor.dom.create('span', { 'data-mce-bogus': 1 });
      marker.className = 'mce-match-marker';
      const node = editor.getBody();
      done(editor, currentSearchState, false);
      if (inSelection) {
        return findAndMarkInSelection(editor.dom, pattern, editor.selection, marker);
      } else {
        return findAndMark(editor.dom, pattern, node, marker);
      }
    };
    const unwrap = node => {
      var _a;
      const parentNode = node.parentNode;
      if (node.firstChild) {
        parentNode.insertBefore(node.firstChild, node);
      }
      (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(node);
    };
    const findSpansByInde***REMOVED*** = (editor, inde***REMOVED***) => {
      const spans = [];
      const nodes = global$1.toArray(editor.getBody().getElementsByTagName('span'));
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const nodeInde***REMOVED*** = getElmInde***REMOVED***(nodes[i]);
          if (nodeInde***REMOVED*** === null || !nodeInde***REMOVED***.length) {
            continue;
          }
          if (nodeInde***REMOVED*** === inde***REMOVED***.toString()) {
            spans.push(nodes[i]);
          }
        }
      }
      return spans;
    };
    const moveSelection = (editor, currentSearchState, forward) => {
      const searchState = currentSearchState.get();
      let testInde***REMOVED*** = searchState.inde***REMOVED***;
      const dom = editor.dom;
      if (forward) {
        if (testInde***REMOVED*** + 1 === searchState.count) {
          testInde***REMOVED*** = 0;
        } else {
          testInde***REMOVED***++;
        }
      } else {
        if (testInde***REMOVED*** - 1 === -1) {
          testInde***REMOVED*** = searchState.count - 1;
        } else {
          testInde***REMOVED***--;
        }
      }
      dom.removeClass(findSpansByInde***REMOVED***(editor, searchState.inde***REMOVED***), 'mce-match-marker-selected');
      const spans = findSpansByInde***REMOVED***(editor, testInde***REMOVED***);
      if (spans.length) {
        dom.addClass(findSpansByInde***REMOVED***(editor, testInde***REMOVED***), 'mce-match-marker-selected');
        editor.selection.scrollIntoView(spans[0]);
        return testInde***REMOVED***;
      }
      return -1;
    };
    const removeNode = (dom, node) => {
      const parent = node.parentNode;
      dom.remove(node);
      if (parent && dom.isEmpty(parent)) {
        dom.remove(parent);
      }
    };
    const escapeSearchTe***REMOVED***t = (te***REMOVED***t, wholeWord) => {
      const escapedTe***REMOVED***t = te***REMOVED***t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/\s/g, '[^\\S\\r\\n\\uFEFF]');
      const wordRege***REMOVED*** = '(' + escapedTe***REMOVED***t + ')';
      return wholeWord ? `(?:^|\\s|${ punctuation() })` + wordRege***REMOVED*** + `(?=$|\\s|${ punctuation() })` : wordRege***REMOVED***;
    };
    const find = (editor, currentSearchState, te***REMOVED***t, matchCase, wholeWord, inSelection) => {
      const selection = editor.selection;
      const escapedTe***REMOVED***t = escapeSearchTe***REMOVED***t(te***REMOVED***t, wholeWord);
      const isForwardSelection = selection.isForward();
      const pattern = {
        rege***REMOVED***: new RegE***REMOVED***p(escapedTe***REMOVED***t, matchCase ? 'g' : 'gi'),
        matchInde***REMOVED***: 1
      };
      const count = markAllMatches(editor, currentSearchState, pattern, inSelection);
      if (global$2.browser.isSafari()) {
        selection.setRng(selection.getRng(), isForwardSelection);
      }
      if (count) {
        const newInde***REMOVED*** = moveSelection(editor, currentSearchState, true);
        currentSearchState.set({
          inde***REMOVED***: newInde***REMOVED***,
          count,
          te***REMOVED***t,
          matchCase,
          wholeWord,
          inSelection
        });
      }
      return count;
    };
    const ne***REMOVED***t = (editor, currentSearchState) => {
      const inde***REMOVED*** = moveSelection(editor, currentSearchState, true);
      currentSearchState.set({
        ...currentSearchState.get(),
        inde***REMOVED***
      });
    };
    const prev = (editor, currentSearchState) => {
      const inde***REMOVED*** = moveSelection(editor, currentSearchState, false);
      currentSearchState.set({
        ...currentSearchState.get(),
        inde***REMOVED***
      });
    };
    const isMatchSpan = node => {
      const matchInde***REMOVED*** = getElmInde***REMOVED***(node);
      return matchInde***REMOVED*** !== null && matchInde***REMOVED***.length > 0;
    };
    const replace = (editor, currentSearchState, te***REMOVED***t, forward, all) => {
      const searchState = currentSearchState.get();
      const currentInde***REMOVED*** = searchState.inde***REMOVED***;
      let currentMatchInde***REMOVED***, ne***REMOVED***tInde***REMOVED*** = currentInde***REMOVED***;
      forward = forward !== false;
      const node = editor.getBody();
      const nodes = global$1.grep(global$1.toArray(node.getElementsByTagName('span')), isMatchSpan);
      for (let i = 0; i < nodes.length; i++) {
        const nodeInde***REMOVED*** = getElmInde***REMOVED***(nodes[i]);
        let matchInde***REMOVED*** = currentMatchInde***REMOVED*** = parseInt(nodeInde***REMOVED***, 10);
        if (all || matchInde***REMOVED*** === searchState.inde***REMOVED***) {
          if (te***REMOVED***t.length) {
            nodes[i].innerTe***REMOVED***t = te***REMOVED***t;
            unwrap(nodes[i]);
          } else {
            removeNode(editor.dom, nodes[i]);
          }
          while (nodes[++i]) {
            matchInde***REMOVED*** = parseInt(getElmInde***REMOVED***(nodes[i]), 10);
            if (matchInde***REMOVED*** === currentMatchInde***REMOVED***) {
              removeNode(editor.dom, nodes[i]);
            } else {
              i--;
              break;
            }
          }
          if (forward) {
            ne***REMOVED***tInde***REMOVED***--;
          }
        } else if (currentMatchInde***REMOVED*** > currentInde***REMOVED***) {
          nodes[i].setAttribute('data-mce-inde***REMOVED***', String(currentMatchInde***REMOVED*** - 1));
        }
      }
      currentSearchState.set({
        ...searchState,
        count: all ? 0 : searchState.count - 1,
        inde***REMOVED***: ne***REMOVED***tInde***REMOVED***
      });
      if (forward) {
        ne***REMOVED***t(editor, currentSearchState);
      } else {
        prev(editor, currentSearchState);
      }
      return !all && currentSearchState.get().count > 0;
    };
    const done = (editor, currentSearchState, keepEditorSelection) => {
      let startContainer;
      let endContainer;
      const searchState = currentSearchState.get();
      const nodes = global$1.toArray(editor.getBody().getElementsByTagName('span'));
      for (let i = 0; i < nodes.length; i++) {
        const nodeInde***REMOVED*** = getElmInde***REMOVED***(nodes[i]);
        if (nodeInde***REMOVED*** !== null && nodeInde***REMOVED***.length) {
          if (nodeInde***REMOVED*** === searchState.inde***REMOVED***.toString()) {
            if (!startContainer) {
              startContainer = nodes[i].firstChild;
            }
            endContainer = nodes[i].firstChild;
          }
          unwrap(nodes[i]);
        }
      }
      currentSearchState.set({
        ...searchState,
        inde***REMOVED***: -1,
        count: 0,
        te***REMOVED***t: ''
      });
      if (startContainer && endContainer) {
        const rng = editor.dom.createRng();
        rng.setStart(startContainer, 0);
        rng.setEnd(endContainer, endContainer.data.length);
        if (keepEditorSelection !== false) {
          editor.selection.setRng(rng);
        }
        return rng;
      } else {
        return undefined;
      }
    };
    const hasNe***REMOVED***t = (editor, currentSearchState) => currentSearchState.get().count > 1;
    const hasPrev = (editor, currentSearchState) => currentSearchState.get().count > 1;

    const get = (editor, currentState) => {
      const done$1 = keepEditorSelection => {
        return done(editor, currentState, keepEditorSelection);
      };
      const find$1 = (te***REMOVED***t, matchCase, wholeWord, inSelection = false) => {
        return find(editor, currentState, te***REMOVED***t, matchCase, wholeWord, inSelection);
      };
      const ne***REMOVED***t$1 = () => {
        return ne***REMOVED***t(editor, currentState);
      };
      const prev$1 = () => {
        return prev(editor, currentState);
      };
      const replace$1 = (te***REMOVED***t, forward, all) => {
        return replace(editor, currentState, te***REMOVED***t, forward, all);
      };
      return {
        done: done$1,
        find: find$1,
        ne***REMOVED***t: ne***REMOVED***t$1,
        prev: prev$1,
        replace: replace$1
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

    const open = (editor, currentSearchState) => {
      const dialogApi = value();
      editor.undoManager.add();
      const selectedTe***REMOVED***t = global$1.trim(editor.selection.getContent({ format: 'te***REMOVED***t' }));
      const updateButtonStates = api => {
        api.setEnabled('ne***REMOVED***t', hasNe***REMOVED***t(editor, currentSearchState));
        api.setEnabled('prev', hasPrev(editor, currentSearchState));
      };
      const updateSearchState = api => {
        const data = api.getData();
        const current = currentSearchState.get();
        currentSearchState.set({
          ...current,
          matchCase: data.matchcase,
          wholeWord: data.wholewords,
          inSelection: data.inselection
        });
      };
      const disableAll = (api, disable) => {
        const buttons = [
          'replace',
          'replaceall',
          'prev',
          'ne***REMOVED***t'
        ];
        const toggle = name => api.setEnabled(name, !disable);
        each(buttons, toggle);
      };
      const toggleNotFoundAlert = (isVisible, api) => {
        api.redial(getDialogSpec(isVisible, api.getData()));
      };
      const focusButtonIfRequired = (api, name) => {
        if (global$2.browser.isSafari() && global$2.deviceType.isTouch() && (name === 'find' || name === 'replace' || name === 'replaceall')) {
          api.focus(name);
        }
      };
      const reset = api => {
        done(editor, currentSearchState, false);
        disableAll(api, true);
        updateButtonStates(api);
      };
      const doFind = api => {
        const data = api.getData();
        const last = currentSearchState.get();
        if (!data.findte***REMOVED***t.length) {
          reset(api);
          return;
        }
        if (last.te***REMOVED***t === data.findte***REMOVED***t && last.matchCase === data.matchcase && last.wholeWord === data.wholewords) {
          ne***REMOVED***t(editor, currentSearchState);
        } else {
          const count = find(editor, currentSearchState, data.findte***REMOVED***t, data.matchcase, data.wholewords, data.inselection);
          if (count <= 0) {
            toggleNotFoundAlert(true, api);
          }
          disableAll(api, count === 0);
        }
        updateButtonStates(api);
      };
      const initialState = currentSearchState.get();
      const initialData = {
        findte***REMOVED***t: selectedTe***REMOVED***t,
        replacete***REMOVED***t: '',
        wholewords: initialState.wholeWord,
        matchcase: initialState.matchCase,
        inselection: initialState.inSelection
      };
      const getPanelItems = error => {
        const items = [
          {
            type: 'label',
            label: 'Find',
            for: 'findte***REMOVED***t',
            items: [{
                type: 'bar',
                items: [
                  {
                    type: 'input',
                    name: 'findte***REMOVED***t',
                    ma***REMOVED***imized: true,
                    inputMode: 'search'
                  },
                  {
                    type: 'button',
                    name: 'prev',
                    te***REMOVED***t: 'Previous',
                    icon: 'action-prev',
                    enabled: false,
                    borderless: true
                  },
                  {
                    type: 'button',
                    name: 'ne***REMOVED***t',
                    te***REMOVED***t: 'Ne***REMOVED***t',
                    icon: 'action-ne***REMOVED***t',
                    enabled: false,
                    borderless: true
                  }
                ]
              }]
          },
          {
            type: 'input',
            name: 'replacete***REMOVED***t',
            label: 'Replace with',
            inputMode: 'search'
          }
        ];
        if (error) {
          items.push({
            type: 'alertbanner',
            level: 'error',
            te***REMOVED***t: 'Could not find the specified string.',
            icon: 'warning'
          });
        }
        return items;
      };
      const getDialogSpec = (showNoMatchesAlertBanner, initialData) => ({
        title: 'Find and Replace',
        size: 'normal',
        body: {
          type: 'panel',
          items: getPanelItems(showNoMatchesAlertBanner)
        },
        buttons: [
          {
            type: 'menu',
            name: 'options',
            icon: 'preferences',
            tooltip: 'Preferences',
            align: 'start',
            items: [
              {
                type: 'togglemenuitem',
                name: 'matchcase',
                te***REMOVED***t: 'Match case'
              },
              {
                type: 'togglemenuitem',
                name: 'wholewords',
                te***REMOVED***t: 'Find whole words only'
              },
              {
                type: 'togglemenuitem',
                name: 'inselection',
                te***REMOVED***t: 'Find in selection'
              }
            ]
          },
          {
            type: 'custom',
            name: 'find',
            te***REMOVED***t: 'Find',
            primary: true
          },
          {
            type: 'custom',
            name: 'replace',
            te***REMOVED***t: 'Replace',
            enabled: false
          },
          {
            type: 'custom',
            name: 'replaceall',
            te***REMOVED***t: 'Replace all',
            enabled: false
          }
        ],
        initialData,
        onChange: (api, details) => {
          if (showNoMatchesAlertBanner) {
            toggleNotFoundAlert(false, api);
          }
          if (details.name === 'findte***REMOVED***t' && currentSearchState.get().count > 0) {
            reset(api);
          }
        },
        onAction: (api, details) => {
          const data = api.getData();
          switch (details.name) {
          case 'find':
            doFind(api);
            break;
          case 'replace':
            if (!replace(editor, currentSearchState, data.replacete***REMOVED***t)) {
              reset(api);
            } else {
              updateButtonStates(api);
            }
            break;
          case 'replaceall':
            replace(editor, currentSearchState, data.replacete***REMOVED***t, true, true);
            reset(api);
            break;
          case 'prev':
            prev(editor, currentSearchState);
            updateButtonStates(api);
            break;
          case 'ne***REMOVED***t':
            ne***REMOVED***t(editor, currentSearchState);
            updateButtonStates(api);
            break;
          case 'matchcase':
          case 'wholewords':
          case 'inselection':
            toggleNotFoundAlert(false, api);
            updateSearchState(api);
            reset(api);
            break;
          }
          focusButtonIfRequired(api, details.name);
        },
        onSubmit: api => {
          doFind(api);
          focusButtonIfRequired(api, 'find');
        },
        onClose: () => {
          editor.focus();
          done(editor, currentSearchState);
          editor.undoManager.add();
        }
      });
      dialogApi.set(editor.windowManager.open(getDialogSpec(false, initialData), { inline: 'toolbar' }));
    };

    const register$1 = (editor, currentSearchState) => {
      editor.addCommand('SearchReplace', () => {
        open(editor, currentSearchState);
      });
    };

    const showDialog = (editor, currentSearchState) => () => {
      open(editor, currentSearchState);
    };
    const register = (editor, currentSearchState) => {
      editor.ui.registry.addMenuItem('searchreplace', {
        te***REMOVED***t: 'Find and replace...',
        shortcut: 'Meta+F',
        onAction: showDialog(editor, currentSearchState),
        icon: 'search'
      });
      editor.ui.registry.addButton('searchreplace', {
        tooltip: 'Find and replace',
        onAction: showDialog(editor, currentSearchState),
        icon: 'search',
        shortcut: 'Meta+F'
      });
      editor.shortcuts.add('Meta+F', '', showDialog(editor, currentSearchState));
    };

    var Plugin = () => {
      global$3.add('searchreplace', editor => {
        const currentSearchState = Cell({
          inde***REMOVED***: -1,
          count: 0,
          te***REMOVED***t: '',
          matchCase: false,
          wholeWord: false,
          inSelection: false
        });
        register$1(editor, currentSearchState);
        register(editor, currentSearchState);
        return get(editor, currentSearchState);
      });
    };

    Plugin();

})();
