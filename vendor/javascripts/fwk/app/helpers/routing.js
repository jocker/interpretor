//mixin

Ext.define("Fwk.app.helpers.Routing",{
    requires: "Fwk.routing.Router",
    urlFor: function(config){
        var self = this
        config = config || {}
        Ext.applyIf(config,{
            action:"index",
            instance: self.getInstance.getId(),
            controller: self.getController().$className.match(/\.([a-zA-Z]+$)/)[1].underscore()
        })
        return Fwk.routing.Router.toUrl(config)
    },
    navigateTo: function(url){
        if( Ext.isObject(url) ){
            url = this.urlFor(url)
        }
        Fwk.routing.Router.processRequest(url)
    }
})