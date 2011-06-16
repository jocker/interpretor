Ext.define("Crs.app.data.stores.CodeLanguage",{
    extend:"Ext.data.Store",
    requires: ["Crs.app.data.models.CodeLanguage","Fwk.lib.direct.Proxy"],
    model: 'Crs.app.data.models.CodeLanguage',
    clearOnLoad: !0,
    sorters: [{
        property: 'position',
        direction: 'ASC'
    }]
})

