Ext.define("Crs.app.views.channels.Index",{
    extend:"Ext.Container",
    requires:["Crs.lib.comp.Chat","Crs.lib.comp.CodeEditor"],
    mixins:{
        base: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this
        Ext.apply(self,{
            layout:"border",
            defaults:{
                split:true
            },
            items:[{
                xtype:"container",
                layout:"fit",
                region:"center",
                items:new Crs.lib.comp.CodeEditor()
            }, new Crs.lib.comp.Chat({
                region:"west",
                width:300,
                channel:self.requestOptions.channel
            })]
        })

        self.callParent(arguments)
    }
})