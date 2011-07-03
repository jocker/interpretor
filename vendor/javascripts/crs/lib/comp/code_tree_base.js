Ext.define("Crs.lib.comp.CodeTreeBase", {
    extend:"Ext.tree.Panel",
    requires:["Crs.app.data.stores.SampleCode","Crs.app.data.stores.UserCode"],
    initComponent: function(){
        var self = this

        Ext.apply(self,{
            rootVisible:!1,
            hideHeaders:true,
            displayField: "name",
            useArrows: true
        })

        self.callParent()

        self.on("itemdblclick", function(view, rec){
            if(rec.get("leaf")){
                self.showEditPanel()
            }
        })

        self.on("itemcontextmenu", function(view, rec, item, index, e){
            e.stopEvent()
            if(!rec.get("leaf")){
                return
            }
            if(!self.menu){
                var menu_items =[{
                    text:"Open in new tab",
                    handler: function(){
                        self.showEditPanel()
                    }
                },{
                    text:"Open in new window",
                    handler: function(){
                        self.showEditPanel(!0)
                    }
                }].concat(self.getMenuConfig())
                self.menu = new Ext.menu.Menu({
                    items:menu_items
                })
            }
            self.menu.showAt(e.getXY())

        })

    },

    getMenuConfig: function(){
        return []
    },

    getSelectedNode: function(){
        return this.getSelectionModel().getSelection()[0]
    },

    showEditPanel: function(inWindow){
        var self = this, node = self.getSelectedNode()
        if(node){
            var url = "/{0}/{1}/show/{2}".format((inWindow ? "window-" : "") + self.getNodeEditorId(node),self.getNodeEditorId(node), node.get("id") )
            console.log(url)
            Fwk.routing.Router.processRequest(url)
        }
    },

    getNodeEditorId: function(node){
        return node.parentNode.get("id")
    }
})