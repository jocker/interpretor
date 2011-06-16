(function(){


    var Instance = function(id){

        var controller_collection = {},
                current_controller = !1,

                getControllerName = function(controller){
                    if(!Ext.isString(controller)){
                        controller = controller.$className.replace(/([a-zA-Z]+\.)/gi,"").underscore()
                    }
                    return controller
                },

                removeController = function(name){
                    name = getControllerName(name)

                    if( !controller_collection[name] ){
                        Fwk.error( String.format("controller {0} does not exist in instance {1}", name, id) )
                    }else{
                        controller_collection[name].destroy()
                        delete controller_collection[name]
                    }
                },

                hasController = function(name){
                    return !!getController(name)
                },

                getController = function(name){

                    return controller_collection[getControllerName(name)]
                },

                findOrCreateController = function(name, instance, callback){
                    if( hasController(name) ){
                        Ext.callback(callback, callback, [controller_collection[name]])
                    }else{
                        var class_name = "Crs.app.controllers."+name.classify()

                        Ext.require(class_name, function(){
                            var klass = (new Function("return "+class_name))()

                            var controller = new klass({
                                _instance: instance
                            })
                            controller_collection[name] = controller
                            Ext.callback(callback, callback, [controller])
                        })
                    }

                }

        return{


            getId: function(){
                return id
            },


            destroy: function(){
                Object.keys(controller_collection).forEach(function(key){
                    controller_collection[key].destroy()
                    delete controller_collection[key]
                })
            },

            handleRequest: function(params, container){

                var controller_name = params.controller
                if(current_controller != controller_name){
                    if(current_controller){
                        removeController(controller_name)
                    }
                    current_controller = controller_name
                }

                var needs_render = !hasController(controller_name)

                findOrCreateController(controller_name,this, function(controller){
                    if(needs_render){
                        controller.render(container, function(){
                            controller.handleRequest(params)
                        })
                    }else{
                        controller.handleRequest(params)
                    }
                })


            }
        }

    }

    Ext.define("Fwk.routing.InstanceManager",{
        constructor: function(){

            Ext.apply(this,{
                instances: {},
                connected: !1
            })

        },
        singleton: !0,
        init: function(app){
            var self = this
            if(self.connected){
                throw new Error("instance manager already connected")
            }
            Ext.apply(self,{
                app: app,
                connected: !0
            })
        },

        getInstance: function(id, callback){
            var self = this, instance = self.instances[id], is_new = !1

            if(!instance){
                self.instances[id] = new Instance(id)
                instance = self.instances[id]
                is_new = !0
            }

            Ext.callback(callback, callback, [instance, is_new])

        },

        destroyInstance: function(id){
            var self = this, instance = self.instances[id]
            if(instance){
                instance.destroy()
                delete self.instances[id]
            }else{
                Fwk.error("instance "+id+" does not exist")
            }
        },

        handleRequest: function(params){
            var self = this
            self.app.showInstanceContainer(params.instance, function(container){
                self.getInstance(params.instance, function(instance, is_new){

                    if(is_new){
                        container.on("destroy", function(){
                            self.destroyInstance(params.instance)
                        })
                    }

                    instance.handleRequest(params, container)
                })
            })

        }
    })

})()