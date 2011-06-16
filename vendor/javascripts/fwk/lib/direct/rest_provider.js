Ext.define('Fwk.lib.direct.RestProvider', {
    alias: 'direct.restprovider',
    extend: 'Ext.direct.RemotingProvider',
    requires:["Fwk.lib.direct.RemotingMethod"],
    default_actions: {index:"get", create:"post", update:"put", destroy:"delete"},
    initAPI : Ext.emptyFn,

    registerController: function(name, actions){

        actions = actions || {}
        var self = this, ns = self.namespace, cls = ns[name], key, action, method, default_actions = self.default_actions
        if (!cls) {
            cls = ns[name] = {};
        }

        for(key in actions){
            action = {name:key}
            if(Ext.isString(actions[key])){
                action.verb = actions[key]
            }else{
                Ext.apply(action, actions[key])
            }
            Ext.applyIf(action,{
                len: 1
            })
            method = Ext.create('Fwk.lib.direct.RemotingMethod', action)
            cls[action.name] = self.createHandler(name, method);
        }

        actions = {}
        for(key in default_actions){
            if( !cls[key] ){
                actions[key] = default_actions[key]
            }
        }

        if(Object.keys(actions).length > 0){
            self.registerController(name, actions)
        }



    },

    createHandler : function(action, method, verb){
        var me = this,
                handler;

        if (!method.formHandler) {
            handler = function(){
                me.configureRequest(action, method, Array.prototype.slice.call(arguments, 0));
            };
        } else {
            handler = function(form, callback, scope){
                me.configureFormRequest(action, method, form, callback, scope);
            };
        }
        handler.directCfg = {
            action: action,
            method: method,
            verb: verb
        };
        return handler;
    },

    configureRequest: function(action, method, args){
        var me = this,
                callData = method.getCallData(args),
                data = callData.data,
                callback = callData.callback,
                scope = callData.scope,
                transaction;

        transaction = Ext.create('Ext.direct.Transaction', {
            provider: me,
            args: args,
            action: action,
            method: method.name,
            verb: method.verb,
            data: data,
            callback: scope && Ext.isFunction(callback) ? Ext.Function.bind(callback, scope) : callback
        });

        if (me.fireEvent('beforecall', me, transaction, method) !== false) {
            Ext.direct.Manager.addTransaction(transaction);
            me.queueTransaction(transaction);
            me.fireEvent('call', me, transaction, method);
        }
    },

    configureFormRequest : function(action, method, form, callback, scope){
        var me = this,
                transaction = Ext.create('Ext.direct.Transaction', {
                    provider: me,
                    action: action,
                    method: method.name,
                    verb: method.verb,
                    args: [form, callback, scope],
                    callback: scope && Ext.isFunction(callback) ? Ext.Function.bind(callback, scope) : callback,
                    isForm: true
                }),
                isUpload,
                params;

        if (me.fireEvent('beforecall', me, transaction, method) !== false) {
            Ext.direct.Manager.addTransaction(transaction);
            isUpload = String(form.getAttribute("enctype")).toLowerCase() == 'multipart/form-data';

            params = {
                extTID: transaction.id,
                extAction: action,
                extMethod: method.name,
                extVerb: method.verb,
                extType: 'rpc',
                extUpload: String(isUpload)
            };

            // change made from typeof callback check to callback.params
            // to support addl param passing in DirectSubmit EAC 6/2
            Ext.apply(transaction, {
                form: Ext.getDom(form),
                isUpload: isUpload,
                params: callback && Ext.isObject(callback.params) ? Ext.apply(params, callback.params) : params
            });
            me.fireEvent('call', me, transaction, method);
            me.sendFormRequest(transaction);
        }
    },

    getCallData: function(transaction){
        return {
            action: transaction.action,
            method: transaction.method,
            data: (transaction.data.length == 1 ? transaction.data[0] : transaction.data) ,
            verb: transaction.verb,
            type: 'rpc',
            tid: transaction.id
        };
    }
})