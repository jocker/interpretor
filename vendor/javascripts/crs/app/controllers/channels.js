Ext.define("Crs.app.controllers.Channels",{
    extend:"Fwk.app.controllers.Base",
    mixins:{
        url_helper: "Fwk.app.views.Base"
    },
    index: function(req){
        var self = this

        self.renderAction(req)
    },


    handleViewRendered: function(view_id, view){
        Fwk.info("handleViewRendered not implemented for Crs.app.controllers.Channels")
    },

    handleViewDestroyed: function(view_id, view){
        Fwk.info("handleViewDestroyed not implemented for Crs.app.controllers.Channels")
    }
})