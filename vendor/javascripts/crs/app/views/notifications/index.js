(function(){



    Ext.define("Crs.app.views.notifications.Index",{
        extend:"Ext.grid.Panel",
        requires:"Crs.app.data.stores.Notification",
        mixins:{
            base: "Fwk.app.views.Base"
        },

        initComponent: function(){
            var self = this
            Ext.apply(self,{
                store : Crs.app.data.stores.Notification,
                menu:!1,
                menu_type:!1,
                columns: [
                    {header: 'Body', dataIndex: 'content', flex:1},
                    {header: 'type',  dataIndex: 'type'},{
                        xtype:'actioncolumn',
                        listeners:{
                            render: function(){
                                console.log("render", arguments)
                            }
                        }
                    }
                ],
                viewConfig: {
                    getRowClass: function(record, rowIndex, rp, ds){
                        return record.get("viewed") ? "" :  "new_message_row"
                    }
                },
                bbar:[{
                    text:"Clear all",
                    handler: function(){
                        this.store.removeAll()
                    },
                    scope: this
                }]

            })

            self.callParent(arguments)

            self.getSelectionModel().on("selectionchange", function(){
                var rec = self.getSelectedRecord()
                if(rec && !rec.get("viewed")){
                    rec.set("viewed", true)
                }
            })

            self.on("itemcontextmenu", function(view, rec, item, index, e){
                e.stopEvent()
                var rec = self.getSelectedRecord(), menu_type, menu_cfg, menu
                if(rec){
                    menu_type = rec.get("type")
                    if(self.menu_type != menu_type){
                        self.menu_type = menu_type
                        menu_cfg = self.getMenuConfig(menu_type)
                        if(self.menu){
                            self.menu.destroy()
                            self.menu = !1
                        }
                        if(menu_cfg){
                            menu = self.menu = new Ext.menu.Menu({
                                items: menu_cfg
                            })
                        }

                    }else{
                        menu = self.menu
                    }

                    if(menu){
                        menu.showAt(e.getXY())
                    }

                }
            }, self)

        },

        getSelectedRecord: function(){
            return this.getSelectionModel().getSelection()[0]
        },

        afterRender: function(){
            var self = this
            self.callParent()

        },

        getMenuConfig: function(type){
            if(type == "new_message"){
                return {
                    text:"View messages",
                    handler: function(){
                        Crs.app.App.goToMessages()
                    }
                }
            }else if(type == "new_submission"){
                return {
                    text:"View submissions",
                    handler: function(){
                        Crs.app.App.goToChannelJoinRequests()
                    }
                }
            }
        }
    })

})()