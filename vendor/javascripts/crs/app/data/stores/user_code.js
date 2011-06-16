Ext.define("Crs.app.data.stores.UserCode",{
    extend:"Ext.data.TreeStore",
    requires: ["Crs.app.data.models.UserCode","Fwk.lib.direct.Proxy"],
    model: 'Crs.app.data.models.UserCode',
    clearOnLoad: !0,
    nodeParam:"id",
    sorters: [{
        property: 'position',
        direction: 'ASC'
    }]
})

