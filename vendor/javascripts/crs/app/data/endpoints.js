(function(){





    Ext.require("Fwk.lib.direct.RestProvider", function(){
        var ns = "Crs.app.data.Endpoints", obj = Ext.ns(ns)

        var provider = Ext.direct.Manager.addProvider({
            type:"rest",
            namespace: ns,
            url:"/direct"
        })


        provider.registerController("channel_join_requests")
        provider.registerController("messages")
        provider.registerController("code_language",  {compile:"post", samples:"post"})
        provider.registerController("codes",  {compile:"post", samples:"post", show:"get"})
        Ext.ClassManager.set(ns, obj)
    })

})();