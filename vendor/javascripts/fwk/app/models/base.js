Ext.define("Fwk.app.models.Base",{
    extend:"Ext.data.Model",



    constructor: function(){
        this.callParent(arguments)
       // this.fields.add( Ext.create('data.field', {name: "internal_id", type:"string"}) )
    }
})