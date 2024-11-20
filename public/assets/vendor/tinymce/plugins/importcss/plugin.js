/**
 * TinyMCE version 7.2.1 (2024-07-03)
 */

(function () {
    'use strict';

    var global$4 = tinymce.util.Tools.resolve('tinymce.PluginManager');

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
    const isType = type => value => typeOf(value) === type;
    const isSimpleType = type => value => typeof value === type;
    const isString = isType('string');
    const isObject = isType('object');
    const isArray = isType('array');
    const isFunction = isSimpleType('function');

    var global$3 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    var global$2 = tinymce.util.Tools.resolve('tinymce.EditorManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.Env');

    var global = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const option = name => editor => editor.options.get(name);
    const register = editor => {
      const registerOption = editor.options.register;
      const filterProcessor = value => isString(value) || isFunction(value) || isObject(value);
      registerOption('importcss_merge_classes', {
        processor: 'boolean',
        default: true
      });
      registerOption('importcss_e***REMOVED***clusive', {
        processor: 'boolean',
        default: true
      });
      registerOption('importcss_selector_converter', { processor: 'function' });
      registerOption('importcss_selector_filter', { processor: filterProcessor });
      registerOption('importcss_file_filter', { processor: filterProcessor });
      registerOption('importcss_groups', { processor: 'object[]' });
      registerOption('importcss_append', {
        processor: 'boolean',
        default: false
      });
    };
    const shouldMergeClasses = option('importcss_merge_classes');
    const shouldImportE***REMOVED***clusive = option('importcss_e***REMOVED***clusive');
    const getSelectorConverter = option('importcss_selector_converter');
    const getSelectorFilter = option('importcss_selector_filter');
    const getCssGroups = option('importcss_groups');
    const shouldAppend = option('importcss_append');
    const getFileFilter = option('importcss_file_filter');
    const getSkin = option('skin');
    const getSkinUrl = option('skin_url');

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

    const generate = () => {
      const ungroupedOrder = [];
      const groupOrder = [];
      const groups = {};
      const addItemToGroup = (groupTitle, itemInfo) => {
        if (groups[groupTitle]) {
          groups[groupTitle].push(itemInfo);
        } else {
          groupOrder.push(groupTitle);
          groups[groupTitle] = [itemInfo];
        }
      };
      const addItem = itemInfo => {
        ungroupedOrder.push(itemInfo);
      };
      const toFormats = () => {
        const groupItems = bind(groupOrder, g => {
          const items = groups[g];
          return items.length === 0 ? [] : [{
              title: g,
              items
            }];
        });
        return groupItems.concat(ungroupedOrder);
      };
      return {
        addItemToGroup,
        addItem,
        toFormats
      };
    };

    const internalEditorStyle = /^\.(?:epho***REMOVED***|tiny-pageembed|mce)(?:[.-]+\w+)+$/;
    const removeCacheSuffi***REMOVED*** = url => {
      const cacheSuffi***REMOVED*** = global$1.cacheSuffi***REMOVED***;
      if (isString(url)) {
        url = url.replace('?' + cacheSuffi***REMOVED***, '').replace('&' + cacheSuffi***REMOVED***, '');
      }
      return url;
    };
    const isSkinContentCss = (editor, href) => {
      const skin = getSkin(editor);
      if (skin) {
        const skinUrlBase = getSkinUrl(editor);
        const skinUrl = skinUrlBase ? editor.documentBaseURI.toAbsolute(skinUrlBase) : global$2.baseURL + '/skins/ui/' + skin;
        const contentSkinUrlPart = global$2.baseURL + '/skins/content/';
        const suffi***REMOVED*** = editor.editorManager.suffi***REMOVED***;
        return href === skinUrl + '/content' + (editor.inline ? '.inline' : '') + `${ suffi***REMOVED*** }.css` || href.inde***REMOVED***Of(contentSkinUrlPart) !== -1;
      }
      return false;
    };
    const compileFilter = filter => {
      if (isString(filter)) {
        return value => {
          return value.inde***REMOVED***Of(filter) !== -1;
        };
      } else if (filter instanceof RegE***REMOVED***p) {
        return value => {
          return filter.test(value);
        };
      }
      return filter;
    };
    const isCssImportRule = rule => rule.styleSheet;
    const isCssPageRule = rule => rule.selectorTe***REMOVED***t;
    const getSelectors = (editor, doc, fileFilter) => {
      const selectors = [];
      const contentCSSUrls = {};
      const append = (styleSheet, imported) => {
        let href = styleSheet.href;
        let rules;
        href = removeCacheSuffi***REMOVED***(href);
        if (!href || fileFilter && !fileFilter(href, imported) || isSkinContentCss(editor, href)) {
          return;
        }
        global.each(styleSheet.imports, styleSheet => {
          append(styleSheet, true);
        });
        try {
          rules = styleSheet.cssRules || styleSheet.rules;
        } catch (e) {
        }
        global.each(rules, cssRule => {
          if (isCssImportRule(cssRule) && cssRule.styleSheet) {
            append(cssRule.styleSheet, true);
          } else if (isCssPageRule(cssRule)) {
            global.each(cssRule.selectorTe***REMOVED***t.split(','), selector => {
              selectors.push(global.trim(selector));
            });
          }
        });
      };
      global.each(editor.contentCSS, url => {
        contentCSSUrls[url] = true;
      });
      if (!fileFilter) {
        fileFilter = (href, imported) => {
          return imported || contentCSSUrls[href];
        };
      }
      try {
        global.each(doc.styleSheets, styleSheet => {
          append(styleSheet);
        });
      } catch (e) {
      }
      return selectors;
    };
    const defaultConvertSelectorToFormat = (editor, selectorTe***REMOVED***t) => {
      let format = {};
      const selector = /^(?:([a-z0-9\-_]+))?(\.[a-z0-9_\-\.]+)$/i.e***REMOVED***ec(selectorTe***REMOVED***t);
      if (!selector) {
        return;
      }
      const elementName = selector[1];
      const classes = selector[2].substr(1).split('.').join(' ');
      const inlineSelectorElements = global.makeMap('a,img');
      if (selector[1]) {
        format = { title: selectorTe***REMOVED***t };
        if (editor.schema.getTe***REMOVED***tBlockElements()[elementName]) {
          format.block = elementName;
        } else if (editor.schema.getBlockElements()[elementName] || inlineSelectorElements[elementName.toLowerCase()]) {
          format.selector = elementName;
        } else {
          format.inline = elementName;
        }
      } else if (selector[2]) {
        format = {
          inline: 'span',
          title: selectorTe***REMOVED***t.substr(1),
          classes
        };
      }
      if (shouldMergeClasses(editor)) {
        format.classes = classes;
      } else {
        format.attributes = { class: classes };
      }
      return format;
    };
    const getGroupsBySelector = (groups, selector) => {
      return global.grep(groups, group => {
        return !group.filter || group.filter(selector);
      });
    };
    const compileUserDefinedGroups = groups => {
      return global.map(groups, group => {
        return global.e***REMOVED***tend({}, group, {
          original: group,
          selectors: {},
          filter: compileFilter(group.filter)
        });
      });
    };
    const isE***REMOVED***clusiveMode = (editor, group) => {
      return group === null || shouldImportE***REMOVED***clusive(editor);
    };
    const isUniqueSelector = (editor, selector, group, globallyUniqueSelectors) => {
      return !(isE***REMOVED***clusiveMode(editor, group) ? selector in globallyUniqueSelectors : selector in group.selectors);
    };
    const markUniqueSelector = (editor, selector, group, globallyUniqueSelectors) => {
      if (isE***REMOVED***clusiveMode(editor, group)) {
        globallyUniqueSelectors[selector] = true;
      } else {
        group.selectors[selector] = true;
      }
    };
    const convertSelectorToFormat = (editor, plugin, selector, group) => {
      let selectorConverter;
      const converter = getSelectorConverter(editor);
      if (group && group.selector_converter) {
        selectorConverter = group.selector_converter;
      } else if (converter) {
        selectorConverter = converter;
      } else {
        selectorConverter = () => {
          return defaultConvertSelectorToFormat(editor, selector);
        };
      }
      return selectorConverter.call(plugin, selector, group);
    };
    const setup = editor => {
      editor.on('init', () => {
        const model = generate();
        const globallyUniqueSelectors = {};
        const selectorFilter = compileFilter(getSelectorFilter(editor));
        const groups = compileUserDefinedGroups(getCssGroups(editor));
        const processSelector = (selector, group) => {
          if (isUniqueSelector(editor, selector, group, globallyUniqueSelectors)) {
            markUniqueSelector(editor, selector, group, globallyUniqueSelectors);
            const format = convertSelectorToFormat(editor, editor.plugins.importcss, selector, group);
            if (format) {
              const formatName = format.name || global$3.DOM.uniqueId();
              editor.formatter.register(formatName, format);
              return {
                title: format.title,
                format: formatName
              };
            }
          }
          return null;
        };
        global.each(getSelectors(editor, editor.getDoc(), compileFilter(getFileFilter(editor))), selector => {
          if (!internalEditorStyle.test(selector)) {
            if (!selectorFilter || selectorFilter(selector)) {
              const selectorGroups = getGroupsBySelector(groups, selector);
              if (selectorGroups.length > 0) {
                global.each(selectorGroups, group => {
                  const menuItem = processSelector(selector, group);
                  if (menuItem) {
                    model.addItemToGroup(group.title, menuItem);
                  }
                });
              } else {
                const menuItem = processSelector(selector, null);
                if (menuItem) {
                  model.addItem(menuItem);
                }
              }
            }
          }
        });
        const items = model.toFormats();
        editor.dispatch('addStyleModifications', {
          items,
          replace: !shouldAppend(editor)
        });
      });
    };

    const get = editor => {
      const convertSelectorToFormat = selectorTe***REMOVED***t => {
        return defaultConvertSelectorToFormat(editor, selectorTe***REMOVED***t);
      };
      return { convertSelectorToFormat };
    };

    var Plugin = () => {
      global$4.add('importcss', editor => {
        register(editor);
        setup(editor);
        return get(editor);
      });
    };

    Plugin();

})();
