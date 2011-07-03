Ext.define("Crs.app.data.models.Channel", {
    extend: "Ext.data.Model",
    proxy:{
        type:"direct_rest",
        api: {
            read: Crs.app.data.Endpoints.channels.index
        }
    },
    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'subscribers_count', type: 'int'}
    ]
});



