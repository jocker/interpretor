Ext.define("Crs.lib.comp.Chat",{
    extend:"Ext.Container",
    requires:["Crs.app.data.stores.ChannelMessage","Crs.app.data.stores.ChannelMessage"],
    initComponent: function(){
        var self = this

        Ext.apply(self,{

            layout:"border",

            defaults:{
                //split:true
            },
            items:[{
                region:"center",
                xtype:"container",
                layout:"fit",
                cls:"white",
                padding:10,
                items:{
                    autoScroll:true,
                    itemId:"chat_messages",
                    xtype:"dataview",
                    store: new Crs.app.data.stores.ChannelMessage(),
                    itemSelector:"div.chat_item",
                    emptyText:"No messages",
                    cls:"white",
                    tpl: new Ext.XTemplate(
                            '<tpl for=".">',
                            '<div class="chat_item">',
                            '<div class="sender">{sender}</div><div class="">{content}</div>',
                            '<br style="clear:both" />',
                            '</div>',
                            '</tpl>'
                            ),
                    listeners:{
                        afterrender: function(c){
                            c.store.load({
                                id: self.channel
                            })
                            c.store.on("add", function(){
                                var el = c.el.dom;
                                el.scrollTop = el.scrollHeight
                            })
                            c.on("contextmenu", function(view, e){
                                if(!self.menu){
                                    self.menu = new Ext.menu.Menu({
                                        items:[{
                                            text:"Clear",
                                            handler: function(){
                                                c.store.removeAll()
                                            }
                                        }]
                                    })
                                }
                                self.menu.showAt(e.getXY())
                            })


                        }
                    }
                }
            },{
                region:"south",
                height:100,
                minHeight:100,
                maxHeight:200,
                xtype:"container",
                cls:"chat_inputs",
                layout:{
                    type:"hbox",
                    padding:"5",
                    align : 'stretch'
                },
                items:{
                    itemId:"text_input",
                    xtype:"textarea",
                    cls:"chat_input",
                    margins:"10",
                    flex:1,
                    listeners:{
                        afterrender:function(comp){
                            comp.inputEl.on("keypress", function(e){
                                if(e.getKey() == Ext.EventObject.ENTER){
                                    e.stopEvent()
                                    self.sendCurrentMessage()
                                }
                            })
                        }
                    }
                }
            }]
        })

        this.callParent()



    },

    initEvents: function(){
        var self = this
        self.callParent()
        var connection = Crs.app.App.ws_connection.connect("/{0}".format(self.channel))

        self.on("destroy", function(){
            connection.cancel()
        })

        connection.on("message", function(type, data){
            if(type == "new_message"){
                self.getMessagesContainer().store.add({
                    id: Ext.id,
                    channel_id: self.channel,
                    sender: data.sender,
                    content:data.content,
                    created_at: new Date()
                })
            }
        })



    },

    sendCurrentMessage: function(e){
        var value = this.getTextInput().inputEl.getValue()
        if(!Ext.isEmpty(value)){
            var instance = new Crs.app.data.models.ChannelMessage()
            instance.set("content", value)
            instance.set("channel_id", this.channel)
            instance.save()
            this.getTextInput().setValue("")
        }

    },

    getTextInput: function(){
        return this.query("#text_input")[0]
    },

    getMessagesContainer: function(){
        return this.query("#chat_messages")[0]
    }


})






