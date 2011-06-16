Ext.define("Crs.app.views.interpretor.Index",{
    extend:"Ext.Container",
    requires:"Crs.lib.comp.EditorPanel",
    mixins:{
        base: "Fwk.app.views.Base"
    },

    initComponent: function(){
        var self = this

        self.editor = new Crs.lib.comp.EditorPanel({
            language_id: self.requestOptions.language
        })

        Ext.apply(self,{
            layout:"fit",
            border:0,
            cls:"index",
            items: self.editor
        })

        self.callParent(arguments)
    }
})