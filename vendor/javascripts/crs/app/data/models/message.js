Ext.define("Crs.app.data.models.Message", {
    extend: "Ext.data.Model",
    endpoint:"messages",
    fields: [
        {name: 'id', type: 'string'},
        {name: 'from_name', type: 'string'},
        {name: 'subject', type: 'string'},
        {name: 'content', type: 'string'},
        {name: 'viewed', type: 'boolean'},
        {name: 'created_at', type: 'date'}
    ]
});



