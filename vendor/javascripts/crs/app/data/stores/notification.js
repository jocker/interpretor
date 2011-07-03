(function(){
var currentId = 0
    var getNextId = function(){
        return ++currentId
    }


    Ext.define("Crs.app.data.stores.Notification",{
        extend:"Ext.data.ArrayStore",
        requires:["Crs.lib.comp.NotificationWindow", "Crs.lib.plugins.EventBroadcaster"],
        singleton:true,
        fields:["title", "message", "type",{name:"viewed", type:"boolean"},{name:"created_at", type:"date"},{name:"id", type:"int"}],

        constructor: function(config){
            var self = this
            self.has_new = !1

            self.callParent([config])
            self.addEvents("new_messages","no_messages", "state_changed");


            (new Crs.lib.plugins.EventBroadcaster()).init(this);

            self.subscribe("new_notification", self.handleNewNotification.bind(self))
            var handleChange = self.handleChange.bind(self)

            self.on("add", handleChange)
            self.on("update", handleChange)
            self.on("remove", handleChange)
            self.on("clear", handleChange)
        },

        add: function(type, title, content){
            var rec = this.callParent([{
                id:Ext.id(),
                title:title,
                content: content,
                viewed: !1,
                created_at: new Date(),
                type: type
            }])[0]
            rec.setId( getNextId() );
            rec.commit(true);
            console.log("current rec", rec);

                (new Crs.lib.comp.NotificationWindow({
                    title: title,
                    autoDestroy:true,
                    html: "<p style='padding: 10px'>{0}</p>".format(content)
                })).animShow()
        },

        handleNewNotification: function(type, data){
            var self = this, title = "New notification", content = "New notification"

            switch(type){
                case "new_message":
                    title = "New message"
                    content = "You have a new message from "+data.from
                    break
                case "new_submission":
                    title = "New message"
                    content = "You have a new channel submission request"
                    break
                case "submission_accepted":
                    title = "Submission accepted"
                    content = "Your submission to {0} was accepted ".format(data.channel_name)
                    break
                case "submission_rejected":
                    title = "Submission rejected"
                    content = "Your submission to {0} was rejected ".format(data.channel_name)
                    break
            }

            self.add(type, title, content);

        },

        handleChange: function(){
            var self = this

            var count = self.queryBy(function(rec){
                return !rec.get("viewed")
            }).getCount()


            if(count == 0 && self.has_new){
                self.has_new = !1
                self.fireEvent("no_messages")
                self.fireEvent("state_changed", !1)
            }else if( count > 0 && !self.has_new ){
                self.fireEvent("new_messages")
                self.has_new = !0
                self.fireEvent("state_changed", !0)
            }

            self.sort('created_at', 'DESC');
        }
    })


})()