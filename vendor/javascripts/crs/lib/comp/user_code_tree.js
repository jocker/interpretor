Ext.define("Crs.lib.comp.UserCodeTree",{
    extend:"Crs.lib.comp.CodeTreeBase",
    initComponent: function(){
        var self = this
        self.store = new Crs.app.data.stores.UserCode()
        self.callParent()


    },

    afterRender: function(){
        var self = this
        this.callParent()
        self.expandAll()

        self.store.on("datachanged", function(){
            self.expandAll()
        })

        self.store.on("load", function(){
            self.expandAll()
        })
    }
})