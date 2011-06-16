(function(){

    var facade = new Ext.util.Observable()

    var Plugin = Ext.extend(Object,{

        init: function(obs){
            Ext.apply(obs,{
                subscribe: facade.on.bind(facade),
                unsubscribe: facade.un.bind(facade),
                publish : function(eventName){
                    facade.events[eventName] || (facade.addEvents(eventName));
                    return facade.fireEvent.apply(facade, [eventName].concat(Array.prototype.slice.call(arguments,1)));
                }
            })
        }

    })

    Ext.ClassManager.set("Crs.lib.plugins.EventBroadcaster", Plugin)

})()

