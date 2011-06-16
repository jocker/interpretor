Ext.define("Crs.app.data.models.SampleCode", {
    extend: "Ext.data.Model",
    proxy:{
        type:"direct_rest",
        api: {
            read: Crs.app.data.Endpoints.codes.samples
        }
    },
    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'}
    ]
});



