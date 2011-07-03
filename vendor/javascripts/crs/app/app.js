Ext.define("Crs.app.App", {
    requires:["Fwk.routing.InstanceManager",
        "Crs.lib.comp.AppTab", "Crs.lib.comp.AppWindow","Crs.lib.layouts.Slide",
        "Crs.lib.comp.TabsContainer","Crs.lib.comp.AppStatusBar","Fwk.lib.comm.Ws","Crs.lib.plugins.EventBroadcaster"],
    singleton: !0,
    constructor: function(){
        var self = this

        Ext.apply(self,{
            tab_instances: {},
            window_instances: {},
            rendered: !1,
            render_callbacks: []
        })

        Fwk.routing.InstanceManager.init(self)


    },

    showInstanceContainer: function(instance_id, callback){

        var self = this, isWindow = (instance_id == "login" || instance_id.match(/^window/)), container = self.getInstanceContainer(instance_id)
        Object.keys(self.window_instances).forEach(function(id){
            if(id != instance_id){
                self.window_instances[id].destroy()
            }

        })

        if( isWindow ){
            container.show()
        }else if( instance_id == "main" ){
            self.render(function(){
                var viewport = self.viewport
                container = self.getMainContainer()
                self.setActiveItem( container )
            })

        }else{
            self.render(function(){
                var tabs = self.getTabsContainer()
                self.setActiveItem( 1 )

                var readyFn = function(){
                    if(!container.ownerCt){
                        tabs.addTab(container)
                    }
                    tabs.setActiveTab(container)



                }

                if(tabs.rendered){
                    readyFn()
                }else{
                    tabs.on("render", readyFn)
                }


            })

        }
        if(container.rendered){
            Ext.callback(callback, callback, [container])
        }else{
            container.on("render", function(){
                Ext.callback(callback, callback, [container])
            })
        }




    },

    getInstanceContainer: function(id){
        var self = this, comp = (self.tab_instances[id] || self.window_instances[id])
        if(comp){
            return comp
        }
        if(id == "main"){
            return
        }


        if( id == "login" ){
            comp = new Ext.Window({
                layout:"fit",
                ui:"app_window",
                shadow:false,
                width:300,
                height:200,
                closable: !1,
                resizable:false,
                title:"Login",
                modal:true
            })
            self.window_instances[id] = comp
        }else if( id.match(/^window/) ){
            var config = {
                width:1000,
                shadow:false,
                ui:"app_window",
                height:400,
                layout:"fit",
                title: id
            }
            if( id.match(/notifications$/) ){
                config.animateTarget = "notification_button"
            }

            comp = new Crs.lib.comp.AppWindow(config)
            self.window_instances[id] = comp
        }else{
            comp = new Crs.lib.comp.AppTab({
                title:id
            })
            self.tab_instances[id] = comp

        }

        if(comp){
            comp.on("destroy", function(){
                delete self.tab_instances[id]
                delete self.window_instances[id]
            })
            return comp
        }


    },

    render: function(callback){

        var self = this
        if(!self.viewport){
            self.render_callbacks.push(callback)
            new Ext.Viewport({
                layout: {
                    type:"vbox",
                    align : 'stretch',
                    pack  : 'start'
                },
                items:[{
                    layout: {
                        type:"hbox",
                        align : 'middle',
                        pack  : 'start',
                        padding:"0 15"
                    },
                    xtype:"container",
                    height:40,
                    cls:"app_header",
                    items:[{
                        xtype:"component",
                        flex: 1
                    },{
                        xtype:"button",
                        text: Crs.app.UserInfo.email,
                        menu:[{
                            text:"Logout",
                            handler: function(){
                                Ext.Ajax.request({
                                    url: '/sign_out',
                                    method:"post",
                                    success: function(response){
                                        window.location.reload(!0)
                                    }
                                });
                            }
                        }]
                    }]
                },{
                    xtype:"container",
                    flex:1,
                    layout:"slide",
                    itemId:"app_container",
                    items:[{
                        xtype:"container",
                        itemId:"main_container",
                        ui:"main_container",
                        layout:"fit"
                    },new Crs.lib.comp.TabsContainer({
                        itemId:"tabs_container"

                    })]
                }, new Crs.lib.comp.AppStatusBar({

                })],
                listeners:{
                    afterrender: function(viewport){
                        self.viewport = viewport
                        self.rendered = !0
                        self.render_callbacks.forEach(function(clbk){
                            Ext.callback(clbk)
                        })
                    }
                }
            })


        }else if(!self.rendered){
            self.render_callbacks.push(callback)
        }else{
            Ext.callback(callback)
        }



    },

    getAppContainer: function(){
        return this.viewport.down("#app_container")
    },

    getMainContainer: function(){
        return this.viewport.down("#main_container")
    },

    getTabsContainer: function(){
        return this.viewport.down("#tabs_container")
    },

    setActiveItem: function(item){
        this.getAppContainer().getLayout().setActiveItem(item)
    },

    goToHome: function(){

        Fwk.routing.Router.processRequest("main")
        //Fwk.routing.Router.processRequest("/aa/ss/dd")
    },

    goToLogin: function(){
        Fwk.routing.Router.processRequest("login")
    },

    goToNotifications: function(){
        Fwk.routing.Router.processRequest("/window-notifications/notifications/index")
    },

    goToMessages: function(){
        Fwk.routing.Router.processRequest("/window/messages/index")
    },

    goToChannelJoinRequests: function(){
        Fwk.routing.Router.processRequest("/window/channel_join_requests/index")
    },

    initWsConnection: function(url, channel_id, id){
        if(!this.ws_connection){
            this.ws_connection = new Fwk.lib.comm.Ws(url, channel_id, id)
        }
    },

    getWsConnection: function(){
        return this.ws_connection
    },

    setUserInfo: function(info){
        Crs.app.UserInfo = info
        this.initWsConnection(info.ws_url, info.channel, info.id)

    }


})

