Ext.define("Crs.app.views.login.Register",{
    extend:"Ext.Panel",
    mixins:{
        base: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this
        Ext.apply(self,{
            title:"Register"
        })

        self.callParent(arguments)
    }
})