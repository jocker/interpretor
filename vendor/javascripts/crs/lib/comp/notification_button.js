Ext.define("Crs.lib.comp.NotificationButton",{
    extend:"Ext.Button",
    requires:["Crs.app.data.stores.Notification"],
    renderTpl:
                '<em class="{splitCls}">' +
                    '<span class="{baseCls}-icon"></span>' +
                    '<button type="{type}" hidefocus="true" role="button" autocomplete="off">' +

                    '<span class="{baseCls}-inner" style="display:none;"></span>' +

                    '</button>' +
                    '</em>' ,
    initComponent: function(){
        Ext.apply(this,{
            is_active: !1,
            iconCls:"notification_button",
            cls:"notification_button",

            width:22,
            height:22,

            handler: function(){
                Crs.app.App.goToNotifications()
            }
        })
        this.callParent()
    },

    afterRender: function(){
        var self = this
        self.callParent()


        Crs.app.data.stores.Notification.on("state_changed", function(val){
            self.setActive(val)
        })

    },

    setActive: function(active){
        if(this.is_active != active){
            if(this.is_active){
                this.el.removeCls("active")
            }else{
                this.el.addCls("active")
            }
            this.is_active = active
        }

    }
})