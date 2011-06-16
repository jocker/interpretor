
Ext.define("Crs.app.views.layouts.Main",{
    requires:["Fwk.app.views.layouts.Base"],
    extend:"Ext.Container",
    mixins:{
        url_helper: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this;
        (new Fwk.app.views.layouts.Base()).init(this);
        Ext.apply(self,{
            layout:"fit"
        })

        self.callParent(arguments)

    },

    switchView: function(from_view, to_view, callback){
        this.removeAll()
    },

    viewContainerMissing: function(view_id){
        return !1
    }
})