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

    var global$4 = tinymce.util.Tools.resolve('tinymce.PluginManager');

    let unique = 0;
    const generate = prefi***REMOVED*** => {
      const date = new Date();
      const time = date.getTime();
      const random = Math.floor(Math.random() * 1000000000);
      unique++;
      return prefi***REMOVED*** + '_' + random + unique + String(time);
    };

    const get$1 = customTabs => {
      const addTab = spec => {
        var _a;
        const name = (_a = spec.name) !== null && _a !== void 0 ? _a : generate('tab-name');
        const currentCustomTabs = customTabs.get();
        currentCustomTabs[name] = spec;
        customTabs.set(currentCustomTabs);
      };
      return { addTab };
    };

    const register$2 = (editor, dialogOpener) => {
      editor.addCommand('mceHelp', dialogOpener);
    };

    const option = name => editor => editor.options.get(name);
    const register$1 = editor => {
      const registerOption = editor.options.register;
      registerOption('help_tabs', { processor: 'array' });
    };
    const getHelpTabs = option('help_tabs');
    const getForcedPlugins = option('forced_plugins');

    const register = (editor, dialogOpener) => {
      editor.ui.registry.addButton('help', {
        icon: 'help',
        tooltip: 'Help',
        onAction: dialogOpener
      });
      editor.ui.registry.addMenuItem('help', {
        te***REMOVED***t: 'Help',
        icon: 'help',
        shortcut: 'Alt+0',
        onAction: dialogOpener
      });
    };

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
    const eq = t => a => t === a;
    const isString = isType('string');
    const isUndefined = eq(undefined);
    const isNullable = a => a === null || a === undefined;
    const isNonNullable = a => !isNullable(a);
    const isFunction = isSimpleType('function');

    const constant = value => {
      return () => {
        return value;
      };
    };
    const never = constant(false);

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
    const rawInde***REMOVED***Of = (ts, t) => nativeInde***REMOVED***Of.call(ts, t);
    const contains = (***REMOVED***s, ***REMOVED***) => rawInde***REMOVED***Of(***REMOVED***s, ***REMOVED***) > -1;
    const map = (***REMOVED***s, f) => {
      const len = ***REMOVED***s.length;
      const r = new Array(len);
      for (let i = 0; i < len; i++) {
        const ***REMOVED*** = ***REMOVED***s[i];
        r[i] = f(***REMOVED***, i);
      }
      return r;
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
    const sort = (***REMOVED***s, comparator) => {
      const copy = nativeSlice.call(***REMOVED***s, 0);
      copy.sort(comparator);
      return copy;
    };

    const keys = Object.keys;
    const hasOwnProperty = Object.hasOwnProperty;
    const get = (obj, key) => {
      return has(obj, key) ? Optional.from(obj[key]) : Optional.none();
    };
    const has = (obj, key) => hasOwnProperty.call(obj, key);

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

    var global$3 = tinymce.util.Tools.resolve('tinymce.Resource');

    var global$2 = tinymce.util.Tools.resolve('tinymce.util.I18n');

    const pLoadHtmlByLangCode = (baseUrl, langCode) => global$3.load(`tinymce.html-i18n.help-keynav.${ langCode }`, `${ baseUrl }/js/i18n/keynav/${ langCode }.js`);
    const pLoadI18nHtml = baseUrl => pLoadHtmlByLangCode(baseUrl, global$2.getCode()).catch(() => pLoadHtmlByLangCode(baseUrl, 'en'));
    const initI18nLoad = (editor, baseUrl) => {
      editor.on('init', () => {
        pLoadI18nHtml(baseUrl);
      });
    };

    const pTab = async pluginUrl => {
      const body = {
        type: 'htmlpanel',
        presets: 'document',
        html: await pLoadI18nHtml(pluginUrl)
      };
      return {
        name: 'keyboardnav',
        title: 'Keyboard Navigation',
        items: [body]
      };
    };

    var global$1 = tinymce.util.Tools.resolve('tinymce.Env');

    const convertTe***REMOVED***t = source => {
      const isMac = global$1.os.isMacOS() || global$1.os.isiOS();
      const mac = {
        alt: '&#***REMOVED***2325;',
        ctrl: '&#***REMOVED***2303;',
        shift: '&#***REMOVED***21E7;',
        meta: '&#***REMOVED***2318;',
        access: '&#***REMOVED***2303;&#***REMOVED***2325;'
      };
      const other = {
        meta: 'Ctrl ',
        access: 'Shift + Alt '
      };
      const replace = isMac ? mac : other;
      const shortcut = source.split('+');
      const updated = map(shortcut, segment => {
        const search = segment.toLowerCase().trim();
        return has(replace, search) ? replace[search] : segment;
      });
      return isMac ? updated.join('').replace(/\s/, '') : updated.join('+');
    };

    const shortcuts = [
      {
        shortcuts: ['Meta + B'],
        action: 'Bold'
      },
      {
        shortcuts: ['Meta + I'],
        action: 'Italic'
      },
      {
        shortcuts: ['Meta + U'],
        action: 'Underline'
      },
      {
        shortcuts: ['Meta + A'],
        action: 'Select all'
      },
      {
        shortcuts: [
          'Meta + Y',
          'Meta + Shift + Z'
        ],
        action: 'Redo'
      },
      {
        shortcuts: ['Meta + Z'],
        action: 'Undo'
      },
      {
        shortcuts: ['Access + 1'],
        action: 'Heading 1'
      },
      {
        shortcuts: ['Access + 2'],
        action: 'Heading 2'
      },
      {
        shortcuts: ['Access + 3'],
        action: 'Heading 3'
      },
      {
        shortcuts: ['Access + 4'],
        action: 'Heading 4'
      },
      {
        shortcuts: ['Access + 5'],
        action: 'Heading 5'
      },
      {
        shortcuts: ['Access + 6'],
        action: 'Heading 6'
      },
      {
        shortcuts: ['Access + 7'],
        action: 'Paragraph'
      },
      {
        shortcuts: ['Access + 8'],
        action: 'Div'
      },
      {
        shortcuts: ['Access + 9'],
        action: 'Address'
      },
      {
        shortcuts: ['Alt + 0'],
        action: 'Open help dialog'
      },
      {
        shortcuts: ['Alt + F9'],
        action: 'Focus to menubar'
      },
      {
        shortcuts: ['Alt + F10'],
        action: 'Focus to toolbar'
      },
      {
        shortcuts: ['Alt + F11'],
        action: 'Focus to element path'
      },
      {
        shortcuts: ['Alt + F12'],
        action: 'Focus to notification'
      },
      {
        shortcuts: ['Ctrl + F9'],
        action: 'Focus to conte***REMOVED***tual toolbar'
      },
      {
        shortcuts: ['Shift + Enter'],
        action: 'Open popup menu for split buttons'
      },
      {
        shortcuts: ['Meta + K'],
        action: 'Insert link (if link plugin activated)'
      },
      {
        shortcuts: ['Meta + S'],
        action: 'Save (if save plugin activated)'
      },
      {
        shortcuts: ['Meta + F'],
        action: 'Find (if searchreplace plugin activated)'
      },
      {
        shortcuts: ['Meta + Shift + F'],
        action: 'Switch to or from fullscreen mode'
      }
    ];

    const tab$2 = () => {
      const shortcutList = map(shortcuts, shortcut => {
        const shortcutTe***REMOVED***t = map(shortcut.shortcuts, convertTe***REMOVED***t).join(' or ');
        return [
          shortcut.action,
          shortcutTe***REMOVED***t
        ];
      });
      const tablePanel = {
        type: 'table',
        header: [
          'Action',
          'Shortcut'
        ],
        cells: shortcutList
      };
      return {
        name: 'shortcuts',
        title: 'Handy Shortcuts',
        items: [tablePanel]
      };
    };

    const urls = map([
      {
        key: 'accordion',
        name: 'Accordion'
      },
      {
        key: 'anchor',
        name: 'Anchor'
      },
      {
        key: 'autolink',
        name: 'Autolink'
      },
      {
        key: 'autoresize',
        name: 'Autoresize'
      },
      {
        key: 'autosave',
        name: 'Autosave'
      },
      {
        key: 'charmap',
        name: 'Character Map'
      },
      {
        key: 'code',
        name: 'Code'
      },
      {
        key: 'codesample',
        name: 'Code Sample'
      },
      {
        key: 'colorpicker',
        name: 'Color Picker'
      },
      {
        key: 'directionality',
        name: 'Directionality'
      },
      {
        key: 'emoticons',
        name: 'Emoticons'
      },
      {
        key: 'fullscreen',
        name: 'Full Screen'
      },
      {
        key: 'help',
        name: 'Help'
      },
      {
        key: 'image',
        name: 'Image'
      },
      {
        key: 'importcss',
        name: 'Import CSS'
      },
      {
        key: 'insertdatetime',
        name: 'Insert Date/Time'
      },
      {
        key: 'link',
        name: 'Link'
      },
      {
        key: 'lists',
        name: 'Lists'
      },
      {
        key: 'advlist',
        name: 'List Styles'
      },
      {
        key: 'media',
        name: 'Media'
      },
      {
        key: 'nonbreaking',
        name: 'Nonbreaking'
      },
      {
        key: 'pagebreak',
        name: 'Page Break'
      },
      {
        key: 'preview',
        name: 'Preview'
      },
      {
        key: 'quickbars',
        name: 'Quick Toolbars'
      },
      {
        key: 'save',
        name: 'Save'
      },
      {
        key: 'searchreplace',
        name: 'Search and Replace'
      },
      {
        key: 'table',
        name: 'Table'
      },
      {
        key: 'te***REMOVED***tcolor',
        name: 'Te***REMOVED***t Color'
      },
      {
        key: 'visualblocks',
        name: 'Visual Blocks'
      },
      {
        key: 'visualchars',
        name: 'Visual Characters'
      },
      {
        key: 'wordcount',
        name: 'Word Count'
      },
      {
        key: 'a11ychecker',
        name: 'Accessibility Checker',
        type: 'premium'
      },
      {
        key: 'typography',
        name: 'Advanced Typography',
        type: 'premium',
        slug: 'advanced-typography'
      },
      {
        key: 'ai',
        name: 'AI Assistant',
        type: 'premium'
      },
      {
        key: 'casechange',
        name: 'Case Change',
        type: 'premium'
      },
      {
        key: 'checklist',
        name: 'Checklist',
        type: 'premium'
      },
      {
        key: 'advcode',
        name: 'Enhanced Code Editor',
        type: 'premium'
      },
      {
        key: 'mediaembed',
        name: 'Enhanced Media Embed',
        type: 'premium',
        slug: 'introduction-to-mediaembed'
      },
      {
        key: 'advtable',
        name: 'Enhanced Tables',
        type: 'premium'
      },
      {
        key: 'e***REMOVED***portpdf',
        name: 'E***REMOVED***port to PDF',
        type: 'premium'
      },
      {
        key: 'e***REMOVED***portword',
        name: 'E***REMOVED***port to Word',
        type: 'premium'
      },
      {
        key: 'footnotes',
        name: 'Footnotes',
        type: 'premium'
      },
      {
        key: 'formatpainter',
        name: 'Format Painter',
        type: 'premium'
      },
      {
        key: 'editimage',
        name: 'Image Editing',
        type: 'premium'
      },
      {
        key: 'importword',
        name: 'Import from Word',
        type: 'premium'
      },
      {
        key: 'inlinecss',
        name: 'Inline CSS',
        type: 'premium',
        slug: 'inline-css'
      },
      {
        key: 'linkchecker',
        name: 'Link Checker',
        type: 'premium'
      },
      {
        key: 'math',
        name: 'Math',
        type: 'premium'
      },
      {
        key: 'markdown',
        name: 'Markdown',
        type: 'premium'
      },
      {
        key: 'mentions',
        name: 'Mentions',
        type: 'premium'
      },
      {
        key: 'mergetags',
        name: 'Merge Tags',
        type: 'premium'
      },
      {
        key: 'pageembed',
        name: 'Page Embed',
        type: 'premium'
      },
      {
        key: 'permanentpen',
        name: 'Permanent Pen',
        type: 'premium'
      },
      {
        key: 'powerpaste',
        name: 'PowerPaste',
        type: 'premium',
        slug: 'introduction-to-powerpaste'
      },
      {
        key: 'revisionhistory',
        name: 'Revision History',
        type: 'premium'
      },
      {
        key: 'tinymcespellchecker',
        name: 'Spell Checker',
        type: 'premium',
        slug: 'introduction-to-tiny-spellchecker'
      },
      {
        key: 'autocorrect',
        name: 'Spelling Autocorrect',
        type: 'premium'
      },
      {
        key: 'tableofcontents',
        name: 'Table of Contents',
        type: 'premium'
      },
      {
        key: 'advtemplate',
        name: 'Templates',
        type: 'premium',
        slug: 'advanced-templates'
      },
      {
        key: 'tinycomments',
        name: 'Tiny Comments',
        type: 'premium',
        slug: 'introduction-to-tiny-comments'
      },
      {
        key: 'tinydrive',
        name: 'Tiny Drive',
        type: 'premium',
        slug: 'tinydrive-introduction'
      }
    ], item => ({
      ...item,
      type: item.type || 'opensource',
      slug: item.slug || item.key
    }));

    const tab$1 = editor => {
      const availablePlugins = () => {
        const premiumPlugins = filter(urls, ({type}) => {
          return type === 'premium';
        });
        const sortedPremiumPlugins = sort(map(premiumPlugins, p => p.name), (s1, s2) => s1.localeCompare(s2));
        const premiumPluginList = map(sortedPremiumPlugins, pluginName => `<li>${ pluginName }</li>`).join('');
        return '<div>' + '<p><b>' + global$2.translate('Premium plugins:') + '</b></p>' + '<ul>' + premiumPluginList + '<li class="to***REMOVED***-help__more-link" ">' + '<a href="https://www.tiny.cloud/pricing/?utm_campaign=help_dialog_plugin_tab&utm_source=tiny&utm_medium=referral&utm_term=read_more&utm_content=premium_plugin_heading" rel="noopener" target="_blank"' + ' data-alloy-tabstop="true" tabinde***REMOVED***="-1">' + global$2.translate('Learn more...') + '</a></li>' + '</ul>' + '</div>';
      };
      const makeLink = p => `<a data-alloy-tabstop="true" tabinde***REMOVED***="-1" href="${ p.url }" target="_blank" rel="noopener">${ p.name }</a>`;
      const identifyUnknownPlugin = (editor, key) => {
        const getMetadata = editor.plugins[key].getMetadata;
        if (isFunction(getMetadata)) {
          const metadata = getMetadata();
          return {
            name: metadata.name,
            html: makeLink(metadata)
          };
        } else {
          return {
            name: key,
            html: key
          };
        }
      };
      const getPluginData = (editor, key) => find(urls, ***REMOVED*** => {
        return ***REMOVED***.key === key;
      }).fold(() => {
        return identifyUnknownPlugin(editor, key);
      }, ***REMOVED*** => {
        const name = ***REMOVED***.type === 'premium' ? `${ ***REMOVED***.name }*` : ***REMOVED***.name;
        const html = makeLink({
          name,
          url: `https://www.tiny.cloud/docs/tinymce/7/${ ***REMOVED***.slug }/`
        });
        return {
          name,
          html
        };
      });
      const getPluginKeys = editor => {
        const keys$1 = keys(editor.plugins);
        const forcedPlugins = getForcedPlugins(editor);
        return isUndefined(forcedPlugins) ? keys$1 : filter(keys$1, k => !contains(forcedPlugins, k));
      };
      const pluginLister = editor => {
        const pluginKeys = getPluginKeys(editor);
        const sortedPluginData = sort(map(pluginKeys, k => getPluginData(editor, k)), (pd1, pd2) => pd1.name.localeCompare(pd2.name));
        const pluginLis = map(sortedPluginData, key => {
          return '<li>' + key.html + '</li>';
        });
        const count = pluginLis.length;
        const pluginsString = pluginLis.join('');
        const html = '<p><b>' + global$2.translate([
          'Plugins installed ({0}):',
          count
        ]) + '</b></p>' + '<ul>' + pluginsString + '</ul>';
        return html;
      };
      const installedPlugins = editor => {
        if (editor == null) {
          return '';
        }
        return '<div>' + pluginLister(editor) + '</div>';
      };
      const htmlPanel = {
        type: 'htmlpanel',
        presets: 'document',
        html: [
          installedPlugins(editor),
          availablePlugins()
        ].join('')
      };
      return {
        name: 'plugins',
        title: 'Plugins',
        items: [htmlPanel]
      };
    };

    var global = tinymce.util.Tools.resolve('tinymce.EditorManager');

    const tab = () => {
      const getVersion = (major, minor) => major.inde***REMOVED***Of('@') === 0 ? 'X.X.X' : major + '.' + minor;
      const version = getVersion(global.majorVersion, global.minorVersion);
      const changeLogLink = '<a data-alloy-tabstop="true" tabinde***REMOVED***="-1" href="https://www.tiny.cloud/docs/tinymce/7/changelog/?utm_campaign=help_dialog_version_tab&utm_source=tiny&utm_medium=referral" rel="noopener" target="_blank">TinyMCE ' + version + '</a>';
      const htmlPanel = {
        type: 'htmlpanel',
        html: '<p>' + global$2.translate([
          'You are using {0}',
          changeLogLink
        ]) + '</p>',
        presets: 'document'
      };
      return {
        name: 'versions',
        title: 'Version',
        items: [htmlPanel]
      };
    };

    const parseHelpTabsSetting = (tabsFromSettings, tabs) => {
      const newTabs = {};
      const names = map(tabsFromSettings, t => {
        var _a;
        if (isString(t)) {
          if (has(tabs, t)) {
            newTabs[t] = tabs[t];
          }
          return t;
        } else {
          const name = (_a = t.name) !== null && _a !== void 0 ? _a : generate('tab-name');
          newTabs[name] = t;
          return name;
        }
      });
      return {
        tabs: newTabs,
        names
      };
    };
    const getNamesFromTabs = tabs => {
      const names = keys(tabs);
      const id***REMOVED*** = names.inde***REMOVED***Of('versions');
      if (id***REMOVED*** !== -1) {
        names.splice(id***REMOVED***, 1);
        names.push('versions');
      }
      return {
        tabs,
        names
      };
    };
    const pParseCustomTabs = async (editor, customTabs, pluginUrl) => {
      const shortcuts = tab$2();
      const nav = await pTab(pluginUrl);
      const plugins = tab$1(editor);
      const versions = tab();
      const tabs = {
        [shortcuts.name]: shortcuts,
        [nav.name]: nav,
        [plugins.name]: plugins,
        [versions.name]: versions,
        ...customTabs.get()
      };
      return Optional.from(getHelpTabs(editor)).fold(() => getNamesFromTabs(tabs), tabsFromSettings => parseHelpTabsSetting(tabsFromSettings, tabs));
    };
    const init = (editor, customTabs, pluginUrl) => () => {
      pParseCustomTabs(editor, customTabs, pluginUrl).then(({tabs, names}) => {
        const foundTabs = map(names, name => get(tabs, name));
        const dialogTabs = cat(foundTabs);
        const body = {
          type: 'tabpanel',
          tabs: dialogTabs
        };
        editor.windowManager.open({
          title: 'Help',
          size: 'medium',
          body,
          buttons: [{
              type: 'cancel',
              name: 'close',
              te***REMOVED***t: 'Close',
              primary: true
            }],
          initialData: {}
        });
      });
    };

    var Plugin = () => {
      global$4.add('help', (editor, pluginUrl) => {
        const customTabs = Cell({});
        const api = get$1(customTabs);
        register$1(editor);
        const dialogOpener = init(editor, customTabs, pluginUrl);
        register(editor, dialogOpener);
        register$2(editor, dialogOpener);
        editor.shortcuts.add('Alt+0', 'Open help dialog', 'mceHelp');
        initI18nLoad(editor, pluginUrl);
        return api;
      });
    };

    Plugin();

})();
