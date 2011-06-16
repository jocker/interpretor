//mixin
Ext.define("Fwk.app.views.Base",{

    getLayout: function(){
        return this._layout
    },

    getController: function(){
        var self = this
        if(!self._controller){
            self._controller = self._layout.getController()
        }
        return self._controller
    },

    getInstance: function(){
        var self = this
        if(!self._instance){
            self._instance = self.getController().getInstance()
        }
        return self._instance
    }

})