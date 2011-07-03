Ext.define("Crs.app.views.messages.Index",{
    extend:"Ext.Panel",
    requires:["Crs.app.data.stores.Message"],
    plugins:["event_broadcaster"],
    mixins:{
        base: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this, store = new Crs.app.data.stores.Message()
        Ext.apply(self,{
            layout:"border",
            store :store,
            defaults:{
                split:true
            },
            items:[{
                xtype:"grid",
                itemId:"grid",
                region:"center",
                store: store,
                viewConfig: {
                    getRowClass: function(record, rowIndex, rp, ds){
                        return record.get("viewed") ? "" :  "new_message_row"
                    }
                },
                columns: [
                    {header: 'From',  dataIndex: 'from_name', width:200},
                    {header: 'Subject', dataIndex: 'subject', flex:1},
                    {header: 'Sent at', dataIndex: 'created_at', width:150, renderer: Ext.util.Format.dateRenderer("d-m-Y") }
                ]
            },{
                itemId:"details",
                cls:"message_details",
                xtype:"panel",
                region:"south",
                hidden:true,
                height:200
            }]
        })

        self.callParent(arguments)
    },

    initEvents: function(){

        var self = this, grid = self.getComponent("grid"), details = self.getComponent("details"),
                tpl = new Ext.XTemplate(
                        '<div class="message_body"><div class="message_meta"><p><strong>From: </strong> {from}',
                        '<p><strong>Subject: </strong>{subject}</p></div>',
                        '<p>{content}</p></div>'
                        )
        self.callParent()


        grid.on("itemcontextmenu", function(view, rec, item, index, e){

            if(!self.menu){
                self.menu = new Ext.menu.Menu({
                    items:[{
                        text:"Destroy",
                        handler: function(){
                            var rec = self.getSelectedRecord()
                            if(rec){
                                rec.destroy()
                                grid.store.remove(rec)
                            }
                        }
                    }]
                })
            }
            e.stopEvent()
            self.menu.showAt(e.getXY())
        })

        grid.getSelectionModel().on("selectionchange", function(){
            var rec = self.getSelectedRecord()
            if(rec){
                details.show()
                if(!rec.get("viewed")){
                    rec.set("viewed", true)
                    rec.save()
                }
                tpl.overwrite(details.body, {
                    from: rec.get("from_name"),
                    subject: rec.get("subject"),
                    content: rec.get("content")
                })
            }else{
                details.hide()
                details.body.update("")
            }
        })

        self.subscribe("new_message", function(){
            self.store.load()
        })
    },

    getSelectedRecord: function(){
        return this.getComponent("grid").getSelectionModel().getSelection()[0]
    },

    afterRender: function(){
        this.callParent()
        this.store.load()
    }
})