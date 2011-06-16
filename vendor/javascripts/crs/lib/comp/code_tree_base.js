Ext.define("Crs.lib.comp.CodeTreeBase", {
    extend:"Ext.tree.Panel",
    requires:["Crs.app.data.stores.SampleCode","Crs.app.data.stores.UserCode"],
    initComponent: function(){
        var self = this

        Ext.apply(self,{
            rootVisible:!1,
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
                    text:"Show",
                    handler: self.showEditPanel.bind(self)
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

    showEditPanel: function(){
        var node = this.getSelectedNode(), self = this
        if(node){
            var url = "/{0}/{0}/show/{1}".format(node.parentNode.get("id"), node.get("id") )
            console.log(url)
            Fwk.routing.Router.processRequest(url)
        }

    }
})