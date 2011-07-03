//plugins
Ext.define("Fwk.app.views.layouts.Base",{

    constructor: function(){
        var self = this

        Ext.apply(self,{
            view_containers: {},
            virtual_containers: {},
            rendered_view_containers: {},
            view_configs: {},
            current_view_container: !1
        })

    },

    init: function(comp){
        var self = this
        this.comp = comp

        comp.addEvents("view_rendered","view_destroyed")

        Ext.apply(comp,{
            viewContainerFor: self.viewContainerFor.bind(self),
            getViewContainer: self.getViewContainer.bind(self),
            handleRequest: self.handleRequest.bind(self),
            getController: function(){
                return this._controller
            }.bind(comp),
            getInstance: function(){
                var self = this
                if(!self._instance){
                    self._instance = self._controller.getInstance()
                }
                return self._instance
            }.bind(comp)
        })

        
        Ext.applyIf(comp,{
            switchViewContainer: self.switchViewContainer.bind(self),
            viewContainerMissing: self.viewContainerMissing.bind(self)
        })


    },

    viewContainerFor: function(view_id, view_config, container_config){
        var self = this, comp
        container_config = Ext.applyIf(container_config || {},{
            layout:"fit",
            xtype:"container"
        })

        self.view_configs[view_id] = view_config || {}

        comp = Ext.ComponentManager.create(container_config)
        comp.on("destroy", function(){
            delete self.view_containers[view_id]
        })

        return ( self.view_containers[view_id] = Ext.ComponentManager.create(container_config) )
    },

    getViewContainer: function(view_id){

        var self = this, comp = self.view_containers[view_id]
        if(!comp){
            comp = self.virtual_containers[view_id]
        }
        if(!comp){
            comp = self.comp.viewContainerMissing(view_id)
            if(comp){
                self.virtual_containers[view_id] = comp
                comp.on("destroy", function(){
                    delete self.virtual_containers[view_id]
                })
            }else if( Object.keys(self.view_containers).length == 0 ){
                return self.comp
            }else{
                throw new Error("undefined container for"+view_id)
            }
        }
        return comp
    },

    showView: function(container_id, view_id, options, callback){

        var self = this, current = self.current_view_container, comp = self.comp
        
        if( current != container_id ){
            self.comp.switchViewContainer( current, view_id, function(){
                self.current_view_container = view_id
                self.showView(container_id, view_id, options, callback)
            })
        }else{
            var name = comp.getController().$className.replace(".controllers.",".views.").replace(/([a-zA-Z]+)$/, function(c){ return c.underscore()+"."+view_id.classify() }),
                    container = self.getViewContainer(container_id), view
            Ext.require(name, function(){
                var klass = (new Function("return "+name))()
                if(view = container.items.get(0)){
                    if(view instanceof klass ){
                        Ext.callback(callback, callback, [view])
                        return
                    }
                    container.removeAll()
                }
                var config = Ext.apply(Fwk.util.clone(self.view_configs[view_id] || {}),{
                    _layout: self
                }), view

                config.requestOptions = options || {}

                config = self.comp.getController().getViewConfig(view_id, config)
                view = new klass(config)


                view.on({
                    afterrender: function(){
                        Ext.callback(callback, callback, [view])
                        self.comp.fireEvent("view_rendered", view_id, view)
                    },

                    destroy: function(){
                        self.comp.fireEvent("view_destroyed", view_id, view)
                    }
                })

                container.add(view)

            })
        }



    },


    switchViewContainer: function(from_view, to_view, callback){
        Ext.callback(callback)
    },

    viewContainerMissing: function(view_id){
        throw new Error("viewContainerMissing not implemented for "+this.comp.$className)
    },



    handleRequest: function(container_name, view_name, options){
        console.log("handleRequest", options)
        this.showView(container_name, view_name, options)
        
    }

})