(function(){

    var WsObject = Ext.extend(Ext.util.Observable,{
        constructor: function(client, url){
            var self = this
            WsObject.superclass.constructor.apply(self)
            self.addEvents("message")
            Ext.apply(self, {
                client: client,
                url: url
            })

            self.subscription = client.subscribe(url, function(data){
                data = Ext.clone(data)
                var command = data.command
                delete data.command
                self.fireEvent("message", command, data)
            })

        },

        cancel: function(){
            this.subscription.cancel()
        }
    })

    Ext.define("Fwk.lib.comm.Ws",{
        mixins:{
            observable: "Ext.util.Observable"
        },
        requires:["Crs.lib.plugins.EventBroadcaster"],
        constructor: function(url, channel_id, id){
            var self = this;
            (new Crs.lib.plugins.EventBroadcaster()).init(self);

            Ext.apply(self,{
                client: new Faye.Client(url, {timeout: 120}),
                id: id,
                subscriptions: []
            })

            self.client.subscribe("/{0}".format(id), function(data){
                data = Ext.clone(data)
                var command = data.command
                delete data.command
                switch(command){
                    case "new_message":
                        self.publish("new_message", data)
                        self.publish("new_notification","new_message", data)
                        break
                    case "submission_accepted":
                        self.publish("new_notification","submission_accepted", data)
                        self.publish("submissions_changed")
                        break
                    case "submission_rejected":
                        self.publish("new_notification","submission_rejected", data)
                        self.publish("submissions_changed")
                        break
                    case "new_submission":
                        self.publish("new_notification","new_submission", data)
                        self.publish("new_submission")
                        break
                    default:
                        break
                }
            })









        },

        connect: function(url){
            return new WsObject(this.client,url)
        }



    })

})()