Ext.define("Crs.app.controllers.Interpretor",{
    extend:"Fwk.app.controllers.Base",
    mixins:{
        url_helper: "Fwk.app.views.Base"
    },
    index: function(req){
        var self = this
        self.renderAction(req)

        if(req.id){
            Crs.app.data.Endpoints.codes.show({id:req.id}, function(data, req){
                if(req.success){
                    self.editor_data = data
                    self.updateEditorData()
                }
            })
        }

    },


    handleViewRendered: function(view_id, view){
        if(view_id == "index"){
            this.editor_view = view
            this.updateEditorData()
        }
    },

    handleViewDestroyed: function(view_id, view){
        if(view_id == "index"){
            this.editor_view = null
            this.editor_data = null
        }
    },

    updateEditorData: function(){
        if(this.editor_data && this.editor_view){
            console.log(this.editor_data)
            var data = {
                value: this.editor_data.content
            }
            if(this.editor_data.name){
                data.title = this.editor_data.name
            }

            this.editor_view.editor.openEditorTab(data)

        }
    }

})