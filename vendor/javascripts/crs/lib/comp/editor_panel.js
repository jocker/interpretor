Ext.require(["Crs.lib.comp.CodeTreeBase","Crs.app.data.stores.Code"],function(){

    var CodeTree = Ext.extend(Crs.lib.comp.CodeTreeBase, {

        constructor: function(config){
            Ext.apply(this, config || {})
            CodeTree.superclass.constructor.call(this)
        },

        initComponent: function(){
            var self = this



            Ext.apply(self,{
                store: new Crs.app.data.stores.Code({
                    listeners:{
                        beforeload: function(store, operation){
                            operation.params.id = self.code_language
                        },
                        load: function(){
                            self.expandAll()
                        }
                    }
                })
            })

            CodeTree.superclass.initComponent.call(this)

        },

        getNodeEditorId: function(){
            return this.code_language
        }

    })


    var EditorTab = Ext.extend(Ext.Panel,{
        modified: !1,
        initComponent: function(){
            Ext.apply(this,{
                layout:"border",
                border:false,
                closable:true,
                defaults:{
                    split:true,
                    collapseMode:"none"
                },
                items:[{
                    region:"center",
                    xtype:"container",
                    layout:"fit",
                    border:false,
                    items:{
                        itemId:"code_editor",
                        xtype:"code_editor",
                        value: this.value || "",
                        language_id: this.language_id || "text"
                    }
                },{
                    border:false,
                    region:"south",
                    height:200,
                    padding:10,
                    cls:"code_output",
                    itemId:"southOutput",
                    autoScroll:true,
                    hidden:true
                },{
                    border:false,
                    region:"east",
                    width:300,
                    padding:10,
                    cls:"code_output",
                    itemId:"eastOutput",
                    autoScroll:true,
                    hidden:true
                }]
            })

            Ext.applyIf(this,{
                activeResultView:"south",
                original_title: this.title
            })
            EditorTab.superclass.initComponent.call(this)
            this.initEvents()
        },

        initEvents: function(){
            this.mon(this.getCodeEditor(),"modified", this.markModified, this)
        },

        switchResultView: function(name){
            name = name || this.activeResultView

            this.eastOutput = this.getEastOutput()
            this.southOutput = this.getSouthOutput()


            this[name+"Output"].show(!1)
            this[["east","south"].remove(name)[0]+"Output"].hide(!1)
            this.activeResultView = name
        },

        hideResultViews: function(){
            this.getEastOutput().hide()
            this.getSouthOutput().hide()
        },

        updateResult: function(success, result){

            this.switchResultView()

            this.getEastOutput().update(result)
            this.getSouthOutput().update(result)

            var activeView = this[this.activeResultView+"Output"], color = success ? "#00ff00" : "#ff0000"

            activeView.getEl().syncFx().frame(color)
        },



        setTitle: function(title){
            this.original_title = title.replace(/^\*/,"")

            EditorTab.superclass.setTitle.call(this, title)
        },

        getValue: function(){
            return this.getCodeEditor().getValue()
        },

        setValue: function(v){
            this.getCodeEditor().setValue(v)
        },

        markModified: function(){
            this.modified = !0
            this.setTitle( "* "+this.original_title )
        },

        markUnmodified: function(){
            this.modified = !1
            this.setTitle(this.original_title)
        },

        getCodeEditor: function(){
            return this.down("#code_editor")
        },

        getEastOutput: function(){
            return this.getComponent("eastOutput")
        },

        getSouthOutput: function(){
            return this.getComponent("southOutput")
        }
    })










    Ext.define("Crs.lib.comp.EditorPanel",{
        extend:"Ext.Panel",
        requires:["Crs.lib.comp.CodeEditor","Crs.lib.comp.LockMask"],
        initComponent: function() {

            Ext.applyIf(this,{
                language_id:"text"
            })

            Ext.apply(this, {
                border:false,
                bodyCfg:{
                    cls:"x-panel-body app_body"
                },
                tbarCfg:{
                    cls:"app_tab_toolbar"
                },
                bodyStyle:"border-top:1px solid #000",
                dockedItems:[{
                    xtype: 'toolbar',
                    dock: 'top',
                    border:false,
                    cls:"app_tab_toolbar",
                    items:[{
                        text:"File",
                        menu:[{
                            text:"New",
                            handler: this.openNewEditorTab,
                            scope: this
                        },{
                            text:"Save"
                        },"-",{
                            text:"Compile",
                            handler: this.compile,
                            scope: this
                        }]
                    },{
                        text:"New",
                        handler: this.openNewEditorTab,
                        scope: this
                    },{
                        text:"Save"
                    },"-",{
                        iconCls:"icon_compile",
                        handler: this.compile,
                        scope: this
                    },{
                        text:"Explorer",
                        handler: this.toggleExplorer,
                        scope: this
                    },"-",{
                        text:"Result area",
                        menu:[{
                            text:"Bottom",
                            handler: function(){
                                this.getActiveTab(function(tab){
                                    tab.switchResultView("south")
                                })
                            },
                            scope: this
                        },{
                            text:"Right",
                            handler: function(){
                                this.getActiveTab(function(tab){
                                    tab.switchResultView("east")
                                })
                            },
                            scope: this
                        },'-',{
                            text:"None",
                            handler: function(){
                                this.getActiveTab(function(tab){
                                    tab.hideResultViews()
                                })
                            },
                            scope: this
                        }]
                    }]
                }],

                layout:"border",
                defaults:{
                    split:true,
                    collapseMode:"none"
                },
                items:[new CodeTree({
                    region:"west",
                    width:250,
                    code_language: this.language_id,
                    itemId:"explorer"
                }),{
                    region:"center",
                    xtype:"tabpanel",
                    itemId:"editorTabPanel",
                    ui:"editor_tabpanel",
                    activeTab:0,
                    headerCfg:{
                        cls:"code_editor_tabs x-tab-panel-header x-unselectable"
                    },
                    defaults:{
                        closable:true
                    },
                    items:[
                        new EditorTab({title:"New file", language_id: this.language_id })
                    ]
                }]
            })

            this.callParent()


            this.getEditorPanel().on("remove", function(parent, child){
                if( parent.items.getCount() == 0 ){
                    this.openNewEditorTab()
                }
            }, this)

        },

        openEditorTab: function(data){
            data = Ext.applyIf(data || {},{
                language_id: this.language_id,
                title:"New file"
            })

            console.log("openEditorTab", data)

            var tab = new EditorTab(data), parent = this.getEditorPanel()
            parent.add( tab )
            parent.setActiveTab( tab )
        },

        openNewEditorTab: function(){
            this.openEditorTab({title:"New file"})
        },

        getActiveTab: function(callback, scope){
            var tab = this.getEditorPanel().getActiveTab()
            if(tab){
                Ext.callback(callback, scope, [tab])

            }
        },

        compile: function(){
            Crs.lib.comp.LockMask.lock()
            this.getActiveTab(function(tab){
                Crs.app.data.Endpoints.code_languages.compile({code:tab.getValue(), language_id: this.language_id}, function(data){
                    Crs.lib.comp.LockMask.unlock()
                    tab.updateResult(data.success, data.result+data.error)

                })
            }, this)
        },

        toggleExplorer: function(){
            var explorer = this.getExplorer()
            explorer[explorer.isVisible() ? "hide" : "show"]()
        },

        getExplorer: function(){
            return this.getComponent("explorer")
        },

        getEditorPanel: function(){
            return this.getComponent("editorTabPanel")
        }

    })





})











