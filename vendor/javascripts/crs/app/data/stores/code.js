Ext.define("Crs.app.data.stores.Code",{
    extend:"Ext.data.TreeStore",
    requires: ["Crs.app.data.models.Code","Fwk.lib.direct.Proxy"],
    model: 'Crs.app.data.models.Code',
    clearOnLoad: !0,
    nodeParam:"id"
})

