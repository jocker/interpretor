Ext.define("Crs.app.data.stores.ChannelMessage",{
    extend:"Ext.data.Store",
    requires: ["Crs.app.data.models.ChannelMessage","Fwk.lib.direct.Proxy"],
    model: 'Crs.app.data.models.ChannelMessage',
    clearOnLoad: !0
})

