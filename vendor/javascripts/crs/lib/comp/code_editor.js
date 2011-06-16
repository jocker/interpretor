Ext.define("Crs.lib.comp.CodeEditor",{
    extend:"Ext.form.TextArea",
    alias:"widget.code_editor",
    language_id: 'text',
    codeMirrorPath: "/CodeMirror/",
    initComponent: function() {
        this.initialized = false;
        this.callParent(arguments)
        this.addEvents("ready","cursor_activity","modified");
        this.on({
            resize: function(ta, width, height) {
                var el = Ext.select('.'+this.id, true);
                if (el) {
                    width -= 35;
                    el.elements.forEach(function(e) {
                        e.setSize(width, height);
                    });
                }
            },
            afterrender: function() {
                var parser, stylesheet;
                switch (this.language_id.toLowerCase()) {
                    case 'mono':
                        parser = ['tokenizecsharp.js', 'parsecsharp.js'];
                        stylesheet = this.codeMirrorPath+'/css/csharpcolors.css';
                        break;
                    case 'java':
                        parser = ['tokenizejava.js', 'parsejava.js'];
                        stylesheet = this.codeMirrorPath+'/css/javacolors.css';
                        break;
                    case 'python':
                        parser = ['parsepython.js'];
                        stylesheet = this.codeMirrorPath+'/css/pythoncolors.css';
                        break;
                    case 'ruby':
                        parser = ['tokenizeruby.js', 'parseruby.js'];
                        stylesheet = this.codeMirrorPath+'/css/rubycolors.css';
                        break;
                    case 'css':
                        parser = 'parsecss.js';
                        stylesheet = this.codeMirrorPath+'/css/csscolors.css';
                        break;
                    case 'js':
                        parser = ['tokenizejavascript.js', 'parsejavascript.js'];
                        stylesheet = this.codeMirrorPath+'/css/jscolors.css';
                        break;
                    case 'php':
                        parser = [
                            "parsexml.js",
                            "parsecss.js",
                            "tokenizejavascript.js",
                            "parsejavascript.js",
                            "../contrib/php/js/tokenizephp.js",
                            "../contrib/php/js/parsephp.js",
                            "../contrib/php/js/parsephphtmlmixed.js"
                        ];
                        stylesheet = [
                            this.codeMirrorPath+'/css/xmlcolors.css',
                            this.codeMirrorPath+'/css/jscolors.css',
                            this.codeMirrorPath+'/css/csscolors.css',
                            this.codeMirrorPath+'/contrib/php/css/phpcolors.css'
                        ];
                        break;
                    case 'htm':
                    case 'html':
                    case 'xml':
                        parser = 'parsexml.js';
                        stylesheet = 'xmlcolors.css';
                        break;
                    default:
                        parser = 'parsedummy.js';
                        stylesheet = '';
                        break;

                }
                var me = this;
                me.codeEditor = new CodeMirror.fromTextArea(me.id, {
                    parserfile: parser,
                    stylesheet: stylesheet,
                    path: me.codeMirrorPath+'/js/',
                    textWrapping: false,
                    lineNumbers: true,
                    iframeClass: 'codemirror-iframe '+me.id,
                    content: me.initialConfig.value,
                    initCallback: function() {
                        me.initialized = true;
                        me.frame_body = Ext.get(me.codeEditor.frame.contentDocument.body)
                        me.fireEvent('initialize', true);
                    },
                    onCursorActivity: function(line){
                        //console.log("onCursorActivity", arguments)
                        //console.log( me.frame_body.query("br").indexOf(line) )
                        //console.log("cursorLine", me.codeEditor.cursorLine() )
                    },
                    onChange: function(){
                        me.fireEvent("modified", me, me.getValue())
                    }
                });
            }
        });
    },
    getValue: function() {
        if (this.initialized) {
            return this.codeEditor.getCode();
        }
        return this.initialConfig.value;
    },
    setValue: function(v) {
        if (this.initialized) {
            this.codeEditor.setCode(v);
        }
    },
    validate: function() {
        this.getValue();
        this.callParent(arguments)
    },

    getLine: function(){
        Ext.get(document.getElementById("ext-gen8").contentWindow.document.body).query("br")
    }
})