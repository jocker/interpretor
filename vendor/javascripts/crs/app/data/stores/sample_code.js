Ext.define("Crs.app.data.stores.SampleCode",{
    extend:"Ext.data.TreeStore",
    requires: ["Crs.app.data.models.SampleCode","Fwk.lib.direct.Proxy"],
    model: 'Crs.app.data.models.SampleCode',
    clearOnLoad: !0,
    nodeParam:"id"
})

