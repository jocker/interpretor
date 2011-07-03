Ext.define("Crs.lib.comp.AppWindow",{
    extend:"Ext.Window",
    initComponent: function(){
        var self = this
        Ext.applyIf(self,{
            closable: true,
            layout:"fit",
            modal: !0,
            animateTarget: Ext.getBody()
        })
        self.callParent()
    }
})