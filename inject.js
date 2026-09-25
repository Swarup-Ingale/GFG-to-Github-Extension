// inject.js
(function () {
    function getEditorCode() {
        try {
            // Check for Monaco Editor (Standard GFG)
            if (typeof monaco !== 'undefined' && monaco.editor.getModels().length > 0) {
                return monaco.editor.getModels()[0].getValue();
            }
            // Check for Ace Editor (Older GFG pages)
            else if (typeof ace !== 'undefined') {
                return ace.edit(document.querySelector('.ace_editor')).getValue();
            }
            // Check for CodeMirror
            else if (document.querySelector('.CodeMirror')) {
                return document.querySelector('.CodeMirror').CodeMirror.getValue();
            }
        } catch (e) { }
        return '';
    }

    // Listen for the request from the content script
    document.addEventListener('GFG_REQ_CODE', function () {
        const code = getEditorCode();
        // Send the code back via a custom event
        document.dispatchEvent(new CustomEvent('GFG_RES_CODE', { detail: code }));
    });
})();