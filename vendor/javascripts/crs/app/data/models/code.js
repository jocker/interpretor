Ext.define("Crs.app.data.models.Code", {
    extend: "Ext.data.Model",
    proxy:{
        type:"direct_rest",
        api: {
            read: Crs.app.data.Endpoints.code_languages.list
        }
    },
    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'}
    ]
});



