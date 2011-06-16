(function(){

    var languageLoader = (function(){

        var loading = !1, callbacks = [], items = !1

        var getItems = function(callback){
            if(items){
                Ext.callback(callback,callback, [items])
            }else if( !loading ){
                loading= !0
                callbacks.push(callback)
                Crs.app.data.Endpoints.code_language.index({},function(data, req){
                    if(req.success){
                        items = data
                        var c

                        while(c = callbacks.pop()){
                            Ext.callback(c,c,[items])
                        }
                    }
                })
            }else{
                callbacks.push(callback)
            }
        }

        return{
            getItems: getItems
        }

    })();

    Ext.define("Crs.lib.comp.AppNavigation",{
        extend:"Ext.Container",
        requires:["Crs.lib.comp.NavButton"],
        initComponent: function(){
            var self = this

            Ext.apply(self,{
                height:80,
                ui:"intro_nav",


                defaults:{
                    xtype:"nav_button",
                    iconCls:"button_icon",
                    margins:'0 5 5 0'
                }
            })

            self.callParent()
        },

        showInterpretor: function(id){
            var url = Fwk.routing.Router.toUrl({controller:"interpretor", action:"index", instance:id, language: id})
            Fwk.routing.Router.processRequest(url)
        },

        afterRender: function(){
            var self = this
            self.callParent()
            languageLoader.getItems(function(items){
                self.load(items)
            })
        },

        load: function(items){
            var self = this
            this.removeAll()
            Object.keys(items).forEach(function(key){
                var item = items[key]
                self.add({
                    text: item.name,
                    language_id: key,
                    iconCls: item.icon,
                    handler: function(btn){
                        self.showInterpretor(btn.language_id)
                    },
                    scope: self

                })
            })

            self.on("added", function(){ console.log("add") })

            window.setTimeout(function(){
                self.doLayout()
            },200)

        }
    })


})()

