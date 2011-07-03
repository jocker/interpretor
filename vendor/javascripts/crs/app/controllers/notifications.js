Ext.define("Crs.app.controllers.Notifications",{
    extend:"Fwk.app.controllers.Base",
    mixins:{
        url_helper: "Fwk.app.views.Base"
    },
index: function(){
		
	},


    handleViewRendered: function(view_id, view){
        Fwk.info("handleViewRendered not implemented for Crs.app.controllers.Notifications")
    },

    handleViewDestroyed: function(view_id, view){
        Fwk.info("handleViewDestroyed not implemented for Crs.app.controllers.Notifications")
    }
})