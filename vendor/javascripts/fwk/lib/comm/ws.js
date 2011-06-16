Ext.define("Fwk.lib.comm.Ws",{
    mixins:{
        observable: "Ext.util.Observable"
    },
    constructor: function(url, channel, id){
        Ext.apply(this,{
            client: new Faye.Client(url, {timeout: 120}),
            channel: channel,
            id: id,
            subscriptions: []
        })

        this.client.subscribe("/messages/new", function(){
            console.log(arguments)
        })




    },

    subscribe: function(obs, name, handler, scope){
        var ev_name = name+"_message"
        this.addEvents(ev_name)
    },

    unscribe: function(){
        
    }



})