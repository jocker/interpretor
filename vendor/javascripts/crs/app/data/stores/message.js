Ext.define("Crs.app.data.stores.Message",{
    extend:"Ext.data.Store",
    requires: ["Crs.app.data.models.Message","Fwk.lib.direct.Proxy"],
    model: 'Crs.app.data.models.Message',
    clearOnLoad: !0,
    sorters: [{
        property: 'position',
        direction: 'ASC'
    }]
})

