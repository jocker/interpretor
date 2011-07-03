(function(){

    var NotificationMgr = {
        positions: []
    };


    Ext.define("Crs.lib.comp.NotificationWindow",{
        extend:"Ext.Window",
        initComponent: function(){
            var self = this
            Ext.apply(self, {
                ui:"app_window",
                cls:"notification_win",
                width: 200,
                autoHeight: true,
                plain: false,
                draggable: false,
                renderTo:document.body,
                bodyStyle: 'text-align:center',
                buttons:[{
                    text:"View all notifications",
                    handler: function(){
                        Crs.app.App.goToNotifications()
                        if(self.task){
                            self.task.cancel()
                            self.animHide()
                        }
                    }
                }],
                buttonAlign:"center"
            });

            if(self.autoDestroy) {
                self.task = new Ext.util.DelayedTask(self.animHide, this);
            } else {
                self.closable = true;
            }
            self.callParent()
        },
        setMessage: function(msg){
            this.body.update(msg);
        },

        onDestroy: function(){
            NotificationMgr.positions.remove(this.pos);
            this.callParent()
        },
        cancelHiding: function(){
            this.addClass('fixed');
            if(this.autoDestroy) {
                this.task.cancel();
            }
        },
        afterShow: function(){
            this.callParent()
            this.toFront()
            Ext.fly(this.body.dom).on('click', this.cancelHiding, this);
            if(this.autoDestroy) {
                this.task.delay(this.hideDelay || 5000);
            }
        },
        animShow: function(){
            var self = this, readyFn = function(){
                self.pos = 0;
                while(NotificationMgr.positions.indexOf(self.pos)>-1)
                    self.pos++;
                NotificationMgr.positions.push(self.pos);
                self.setSize(200,100);
                self.el.alignTo(document, "br-br", [ -10, -30-((self.getSize().height+10)*self.pos) ]);

                self.el.slideIn('b', {
                    duration: 1000,
                    callback: self.afterShow.bind(self),
                    scope: self
                });

            }
            if(self.rendered){
                readyFn()
            }else{
                self.on("afterrender", readyFn)
            }
            return this
        },
        animHide: function(){
            NotificationMgr.positions.remove(this.pos);
            this.el.ghost("b", {
                duration: 1000,
                remove: true
            });
        },

        focus: Ext.emptyFn

    })

})()


