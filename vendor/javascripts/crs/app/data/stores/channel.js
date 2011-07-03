Ext.define("Crs.app.data.stores.Channel",{
    extend:"Ext.data.Store",
    requires: ["Crs.app.data.models.Channel","Fwk.lib.direct.Proxy"],
    model: 'Crs.app.data.models.Channel',
    clearOnLoad: !0
})

