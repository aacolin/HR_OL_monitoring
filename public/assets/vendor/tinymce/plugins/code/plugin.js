/**
 * TinyMCE version 7.2.1 (2024-07-03)
 */

(function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    const setContent = (editor, html) => {
      editor.focus();
      editor.undoManager.transact(() => {
        editor.setContent(html);
      });
      editor.selection.setCursorLocation();
      editor.nodeChanged();
    };
    const getContent = editor => {
      return editor.getContent({ source_view: true });
    };

    const open = editor => {
      const editorContent = getContent(editor);
      editor.windowManager.open({
        title: 'Source Code',
        size: 'large',
        body: {
          type: 'panel',
          items: [{
              type: 'te***REMOVED***tarea',
              name: 'code'
            }]
        },
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
        initialData: { code: editorContent },
        onSubmit: api => {
          setContent(editor, api.getData().code);
          api.close();
        }
      });
    };

    const register$1 = editor => {
      editor.addCommand('mceCodeEditor', () => {
        open(editor);
      });
    };

    const register = editor => {
      const onAction = () => editor.e***REMOVED***ecCommand('mceCodeEditor');
      editor.ui.registry.addButton('code', {
        icon: 'sourcecode',
        tooltip: 'Source code',
        onAction
      });
      editor.ui.registry.addMenuItem('code', {
        icon: 'sourcecode',
        te***REMOVED***t: 'Source code',
        onAction
      });
    };

    var Plugin = () => {
      global.add('code', editor => {
        register$1(editor);
        register(editor);
        return {};
      });
    };

    Plugin();

})();
