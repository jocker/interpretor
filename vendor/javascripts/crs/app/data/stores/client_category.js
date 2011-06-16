Ext.define("Crs.app.data.stores.ClientCategory",{
    extend:"Ext.data.TreeStore",
    requires: ["Crs.app.data.models.ClientCategory","Fwk.lib.direct.Proxy"],

    model: 'Crs.app.data.models.ClientCategory',
    clearOnLoad: !0,
    nodeParam:"id",
    defaultRootId:"0",
    sorters: [{
        property: 'position',
        direction: 'ASC'
    }],

    createNewRecords: function(options) {
        var self = this, operation, records = self.getNewRecords()
        options = options || {}

        if(records.length > 0){
            Ext.applyIf(options, {
                action : 'create',
                records: self.getNewRecords()
            })

            operation = Ext.create('Ext.data.Operation', options)

            return self.proxy.create(operation, self.onProxyWrite, self)
        }else{
            Ext.callback(options.callback, options.callback, [!0, !0, !0])
        }

    },

    batchSave: function(){
        var self = this
        self.createNewRecords({
            callback: function(a,b, success){
                if(success){
                    self.save()
                }
            }
        })
    },

    onUpdateRecords: function(records, operation, success){
        if (success) {
            var me = this,
                    i = 0,
                    length = records.length,
                    data = me.data,
                    original,
                    parentNode,
                    record;

            for (; i < length; ++i) {
                record = records[i];
                original = me.tree.getNodeById(record.getId());
                parentNode = original.parentNode;
                if (parentNode) {
                    // prevent being added to the removed cache
                    original.isReplace = true;
                    parentNode.replaceChild(record, original);
                    original.isReplace = false;

                    original.childNodes.forEach(function(node){
                        record.appendChild(node)
                        node.modified = {}
                    })

                }
            }
        }
    }



})