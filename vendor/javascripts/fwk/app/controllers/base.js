// class
Ext.define("Fwk.app.controllers.Base",{

    constructor: function(config){
        var self = this

        Ext.apply(self, Ext.apply(config || {},{
            rendered: !1,
            current_action: !1,
            last_request: !1
        }))


        if(!self._instance){
            throw new Error("instance undefined for "+self.$className)
        }


        if(!self.layout){
            self.layout = self.$className.replace("controllers","views.layouts")
        }

    },

    render :function(container, callback){

        var self = this

        if(Ext.isString(self.layout)){
            Ext.require(self.layout, function(){
                var klass = (new Function("return "+self.layout))()
                self.layout = new klass({
                    _controller: self
                })

                self.layout.on({
                    afterrender: function(layout){
                        self.rendered = !0
                        Ext.callback(callback, callback, [layout])
                    },
                    view_rendered: self.handleViewRendered.bind(self),
                    view_destroyed: self.handleViewDestroyed.bind(self)
                })


                container.add(self.layout)
            })
        }else if(self.layout.rendered){
            Ext.callback(callback, callback, [self.layout])
        }else{
            throw new Error("layout initialized but not rendered "+self.$className)
        }
    },

    getInstance: function(){
        return this._instance
    },

    getLayout: function(){
        return this.layout
    },

    handleViewRendered: function(view_id, view){
        
    },

    destroy: function(){
        // called by InstanceManager
        if(self.rendered){
            self.layout.destroy()
        }
    },

    handleViewDestroyed: function(view_id, view){

    },

    handleRequest: function(params){
        console.info("hande request", params)
        var self = this, params_str = Ext.encode(params)

        if( self.last_request == params_str ){
            return
        }

        self.last_request = params_str
        self.current_action = params.action



        var handleActionComplete = function(){
            if( !self.render_action_options ){
                self.renderAction()
            }

            var options = Fwk.util.clone(self.render_action_options), view_name = options.view_name, container_name = options.container_name
            delete options.view_name
            delete options.container_name
            self.layout.handleRequest(container_name, view_name, options.options)
            delete self.render_action_options
        }

        if( self[self.current_action] ){

            var action_result = self[self.current_action](params)
            if( action_result instanceof Ext.util.Observable ){
                action_result.on("ready", handleActionComplete)
            }else{
                handleActionComplete()
            }
        }else{
            handleActionComplete()
        }


    },

    renderAction: function(){
        var self = this, args = Ext.toArray(arguments), options = {}, action_name = self.current_action, container_name = self.current_action

        if(args.length == 3){
            options = args.pop()
            container_name = args.pop()
            action_name = args.pop()
        }else if(args.length == 2){
            if( Ext.isString(args[0]) && Ext.isString(args[1]) ){
                action_name = args[0]
                container_name = args[1]
            }else if( Ext.isObject(args[1]) ){
                options = args[1]
                action_name = args[0]
            }
        }else if( args.length == 1 ){
            args = args[0]
            if(Ext.isString(args)){
                action_name = args
            }else{
                options = args
            }
        }

        

        self.render_action_options = {
            view_name: action_name,
            container_name: container_name,
            options: options
        }

        

    },

    getViewConfig: function(view_id, config){
        return config
    }

})