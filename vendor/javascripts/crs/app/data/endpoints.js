(function(){





    Ext.require(["Fwk.lib.direct.RestProvider","Fwk.lib.direct.Proxy"], function(){
        var ns = "Crs.app.data.Endpoints", obj = Ext.ns(ns)

        var provider = Ext.direct.Manager.addProvider({
            type:"rest",
            namespace: ns,
            url:"/direct"
        })


        provider.registerController("channel_join_requests")
        provider.registerController("channel_messages")

        provider.registerController("messages")
        provider.registerController("channels",{available:"get", subscribed:"get", pending:"get", subscribe:"post"})
        provider.registerController("code_languages",  {compile:"post", samples:"post", list:"get"})
        provider.registerController("codes",  {compile:"post", samples:"post", show:"get"})
        Ext.ClassManager.set(ns, obj)
    })

})();