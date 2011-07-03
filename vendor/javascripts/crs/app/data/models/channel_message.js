Ext.define("Crs.app.data.models.ChannelMessage", {
    extend: "Ext.data.Model",
    endpoint:"channel_messages",
    fields: [
        {name: 'id', type: 'string'},
        {name: 'sender', type: 'string'},,
        {name: 'channel_id', type: 'string'},
        {name: 'content', type: 'string'},
        {name: 'created_at', type: 'date'}
    ]
});



