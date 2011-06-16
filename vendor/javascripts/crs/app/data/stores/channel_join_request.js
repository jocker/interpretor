Ext.define("Crs.app.data.stores.ChannelJoinRequest",{
    extend:"Ext.data.Store",
    requires: ["Crs.app.data.models.ChannelJoinRequest","Fwk.lib.direct.Proxy"],
    model: 'Crs.app.data.models.ChannelJoinRequest',
    clearOnLoad: !0,
    sorters: [{
        property: 'position',
        direction: 'ASC'
    }]
})

