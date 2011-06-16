Ext.define("Crs.lib.comp.AppWindow",{
    extend:"Ext.Window",
    initComponent: function(){
        var self = this
        Ext.apply(self,{
            closable: true,
            layout:"fit",
            modal: !0
        })
        self.callParent()
    }
})