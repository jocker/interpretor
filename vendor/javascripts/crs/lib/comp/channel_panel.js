(function(){

    Ext.require(["Crs.app.data.stores.Channel","Crs.lib.plugins.EventBroadcaster"], function(){



        var PanelBase = Ext.extend(Ext.Panel,{

            constructor: function(config){

                var self = this
                self.store = new Crs.app.data.stores.Channel({
                    proxy:{
                        type:"direct_rest",
                        api: {
                            read: config.read_endpoint
                        }
                    }
                })



                Ext.apply(self,{
                    layout:"fit",
                    items:[{
                        itemId:"dataview",
                        xtype:"dataview",
                        store: self.store,
                        emptyText:"No channels",
                        selectedItemCls:"selected",
                        autoScroll:true,
                        tpl: new Ext.XTemplate('<tpl for="."><div class="channel_item">{name}</div></tpl>'),
                        itemSelector:"div.channel_item"
                    }]
                })
                PanelBase.superclass.constructor.call(self, config);
                (new Crs.lib.plugins.EventBroadcaster()).init(self)

                self.subscribe("submissions_changed", function(){
                    self.store.load()
                })
            },

            afterRender: function(){
                var self = this
                PanelBase.superclass.afterRender.call(self)
                self.store.load()

                self.getDataView().on("itemcontextmenu", function(view, rec, item, index, e){
                    e.stopEvent()
                    view.getSelectionModel().deselectAll()
                    view.getSelectionModel().select([rec])
                    if(!self.menu){
                        var cfg = self.getMenuConfig()

                        if(cfg){
                            if( Ext.isArray(cfg) ){
                                cfg.forEach(function(item){
                                    item.handler = item.handler.bind(self)
                                })
                            }else{
                                cfg.handler = cfg.handler.bind(self)
                            }
                            self.menu = new Ext.menu.Menu({
                                items:cfg
                            })
                        }
                    }
                    if(self.menu){
                        self.menu.showAt(e.getXY())
                    }
                })

            },

            getDataView: function(){
                return this.query("#dataview")[0]
            },

            getSelectedItem: function(){
                return this.getDataView().getSelectionModel().getSelection()[0]
            },

            getMenuConfig: function(){

            }



        })



        Ext.define("Crs.lib.comp.ChannelPanel",{
            extend:"Ext.Container",
            initComponent: function(){
                Ext.apply(this,{
                    layout:"accordion",
                    defaults:{
                        hideCollapseTool:true
                    },
                    items:[new PanelBase({
                        title: "Subscribed channels",
                        hideCollapseTool:true,
                        read_endpoint: Crs.app.data.Endpoints.channels.subscribed,
                        getMenuConfig: function(){

                            var showChannel = function(id, inWindow){
                                var url = "/{0}/channels/{1}".format( (inWindow ? "window-"+id : id), id )
                                Fwk.routing.Router.processRequest(url)
                            }

                            return [{
                                text:"Open in new tab",
                                handler: function(){
                                    var self = this
                                    var rec = self.getSelectedItem()
                                    if(rec){
                                        showChannel(rec.get("id"))
                                    }

                                }
                            },{
                                text:"Open in new window",
                                handler: function(){
                                    var self = this
                                    var rec = self.getSelectedItem()
                                    if(rec){
                                        showChannel(rec.get("id"), true)
                                    }

                                }
                            }]
                        }
                    }),new PanelBase({
                        title: "Available channels",
                        hideCollapseTool:true,
                        read_endpoint: Crs.app.data.Endpoints.channels.available,
                        getMenuConfig: function(){
                            return {
                                text:"Subscribe",
                                handler: function(){
                                    var self = this
                                    var rec = self.getSelectedItem()
                                    if(rec){
                                        Crs.app.data.Endpoints.channels.subscribe({id: rec.get("id")}, function(){
                                            self.publish("submissions_changed")
                                        })
                                    }

                                }
                            }
                        }
                    }),new PanelBase({
                        title: "Pending channels",
                        hideCollapseTool:true,
                        read_endpoint: Crs.app.data.Endpoints.channels.pending
                    })]
                })

                this.callParent()
            }
        })

    })

})()

