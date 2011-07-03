
Ext.define("Crs.app.views.layouts.Notifications",{
    requires:["Fwk.app.views.layouts.Base"],
    extend:"Ext.Container",
    mixins:{
        url_helper: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this;
        (new Fwk.app.views.layouts.Base()).init(this);
        Ext.apply(self,{
            layout:"fit",
            items: [self.viewContainerFor("index",{},{})
]
        })

        self.callParent(arguments)

    },

    switchViewContainer: function(from_view, to_view, callback){
        Ext.callback(callback)
    },

    viewContainerMissing: function(view_id){
        var self = this
        throw new Error("viewContainerMissing not implemented for Crs.app.views.layouts.Notifications")
    }
})