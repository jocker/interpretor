Ext.define('Fwk.lib.direct.RemotingMethod', {

    constructor: function(config){
        var me = this,
                params = Ext.isDefined(config.params) ? config.params : config.len, verb = (config.verb ? config.verb.toUpperCase() : "ANY"), name;


        me.name = config.name;
        me.verb = verb
        me.formHandler = config.formHandler;
        if (Ext.isNumber(params)) {
            me.len = params;
            me.ordered = true;
        } else {

            me.params = [];
            Ext.each(params, function(param){
                name = Ext.isObject(param) ? param.name : param;
                me.params.push(name);
            });
        }
    },

    getCallData: function(args){
        var me = this,
                data = null,
                len  = me.len,
                params = me.params,
                verb = me.verb,
                callback,
                scope,
                name;

        if (me.ordered) {
            callback = args[len];
            scope = args[len + 1];
            if (len !== 0) {
                data = args.slice(0, len);
            }
        } else {
            data = Ext.apply({}, args[0]);
            callback = args[1];
            scope = args[2];

            // filter out any non-existent properties
            for (name in data) {
                if (data.hasOwnProperty(name)) {
                    if (!Ext.Array.contains(params, name)) {
                        delete data[name];
                    }
                }
            }
        }

        return {
            data: data,
            callback: callback,
            scope: scope
        };
    }
});