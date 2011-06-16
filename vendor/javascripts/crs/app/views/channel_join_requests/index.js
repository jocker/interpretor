Ext.define("Crs.app.views.channel_join_requests.Index",{
    requires:["Crs.app.data.stores.ChannelJoinRequest"],
    extend:"Ext.grid.Panel",
    mixins:{
        base: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this
        Ext.apply(self,{
            store :new Crs.app.data.stores.ChannelJoinRequest(),
            columns: [
                {header: 'Channel',  dataIndex: 'channel_name'},
                {header: 'Email', dataIndex: 'user_email', flex:1}
            ]

        })

        self.callParent(arguments)
    },

    initEvents: function(){
        var self = this
        self.callParent()
        self.on("itemcontextmenu", function(view, rec, item, index, e){

            if(!self.menu){
                self.menu = new Ext.menu.Menu({
                    items:[{
                        text:"Accept",
                        handler: function(){
                            self.updatePendingRequest("accept")
                        }
                    },{
                        text:"Reject",
                        handler: function(){
                            self.updatePendingRequest("reject")
                        }
                    }]
                })
            }
            e.stopEvent()
            self.menu.showAt(e.getXY())
        })
    },

    afterRender: function(){
        this.callParent()
        this.store.load()
    },

    updatePendingRequest: function(status){
        var self = this, rec = self.getSelectionModel().getSelection()[0]
        if(rec){
            var data = {
                id: rec.get("id"),
                status: status
            }
            Crs.app.data.Endpoints.channel_join_requests.update(data, function(data, req){
                self.store.remove(rec)
            })
        }
    }
})