Ext.define("Crs.lib.comp.LockMask",{
    requires:["Crs.lib.plugins.Lock"],
    extend:"Ext.Component",
    singleton:true,
    constructor: function(config){
        config = Ext.apply(config || {},{
            cls:"lock_mask",
            hidden: true,
            renderTo: Ext.getBody(),
            plugins: [new Crs.lib.plugins.Lock()]
        })

        this.callParent([config])


        this.on({
            lock: this.show,
            unlock: this.hide,
            scope: this
        })
    }
})