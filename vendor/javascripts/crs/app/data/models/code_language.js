Ext.define("Crs.app.data.models.CodeLanguage", {
    extend: "Ext.data.Model",
    endpoint:"code_language",
    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'uses_count', type: 'int'},
        {name: 'icon', type: 'string'}
    ]
});



