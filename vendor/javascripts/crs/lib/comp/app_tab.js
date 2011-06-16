Ext.define("Crs.lib.comp.AppTab",{
    extend:"Ext.Panel",
    initComponent: function(){
        var self = this
        Ext.apply(self,{
            closable: true,
            layout:"fit",
            border:false
        })
        self.callParent()
    }
})