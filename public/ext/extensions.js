String.prototype.classify = function() {
    return this.replace(/(^[a-z]|\.[a-z]|\_[a-z])/g, function($1) {
        return $1.toUpperCase().replace('_', '');
    });
};

String.prototype.underscore = function() {
    return this.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/-/g, '_')
            .toLowerCase();
};

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


Array.prototype.remove = function(item){
    var self = this, index = self.indexOf(item)
    if(index != -1){
        self.splice(index, 1)
    }
    return self
}






Ext.ns("Fwk.util")

Fwk.uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();
}



Fwk.config = {
    env: "development"
};

Fwk.util.clone = function(obj){
    return Ext.decode(Ext.encode(obj))
};

["log", "error","warn", "info"].forEach(function(name){
    Fwk[name] = function(){
        if( Fwk.config.env == "development" ){
            console[name].apply(console, arguments)
        }
    }
})

Ext.apply(Fwk,{
    model: function(name){
        return Crs.app.data.models[name]
    },
    store: function(name){
        return Crs.app.data.stores[name]
    },
    endpoint: function(name){
        return Crs.app.data.Endpoints[name]
    }
})

Ext.Class.registerPreprocessor('model_extensions', function(cls, data) {
    if(cls.prototype.isModel){


        if(!data.proxy){
            data.proxy = {
                type:"direct_rest",
                batchActions: true,
                batchOrder: "destroy,create,update"
            }

            if(data.endpoint){
                var endpoint = Crs.app.data.Endpoints[data.endpoint]
                data.proxy.api = {
                    read: endpoint.index,
                    update: endpoint.update,
                    create: endpoint.create,
                    destroy: endpoint.destroy
                }
            }else if(data.api){
                data.proxy.api = data.api
                delete data.api
            }
        }


    }
}, true)


Ext.Class.defaultPreprocessors.push('model_extensions')
