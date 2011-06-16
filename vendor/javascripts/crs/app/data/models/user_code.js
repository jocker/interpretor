Ext.define("Crs.app.data.models.UserCode", {
    extend: "Ext.data.Model",
    proxy:{
        type:"direct_rest",
        api: {
            read: Crs.app.data.Endpoints.codes.index
        }
    },
    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'}
    ]
});



