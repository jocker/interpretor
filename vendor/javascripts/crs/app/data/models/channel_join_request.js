Ext.define("Crs.app.data.models.ChannelJoinRequest", {
    extend: "Ext.data.Model",
    endpoint:"channel_join_requests",
    fields: [
        {name: 'id', type: 'string'},
        {name: 'channel_name', type: 'string'},
        {name: 'user_email', type: 'string'}
    ]
});



