
Ext.define("Crs.app.views.layouts.ChannelJoinRequests",{
    requires:["Fwk.app.views.layouts.Base"],
    extend:"Ext.Container",
    mixins:{
        url_helper: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this;
        (new Fwk.app.views.layouts.Base()).init(this);
        Ext.apply(self,{
            layout:"card",
            items: [self.viewContainerFor("index",{},{})
]
        })

        self.callParent(arguments)

    },

    switchViewContainer: function(from_view, to_view, callback){
        var self = this
        Ext.callback(callback)
    },

    viewContainerMissing: function(view_id){
        var self = this
        throw new Error("viewContainerMissing not implemented for Crs.app.views.layouts.ChannelJoinRequests")
    }
})