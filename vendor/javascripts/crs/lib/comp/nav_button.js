Ext.define("Crs.lib.comp.NavButton",{
    extend:"Ext.Button",
    alias:"widget.nav_button",
    initComponent: function(){
        var self = this
        Ext.apply(self,{
            renderTpl: new Ext.XTemplate(
            '<em class="{splitCls}">' +
                '<div hidefocus="true"<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl> role="button" autocomplete="off"><span class="{baseCls}-inner" style="{innerSpanStyle}">{text}</span><span class="{baseCls}-icon"></span></div>'+
            '</em>' ),
            ui:"nav_button"
        })
        self.callParent()

        Ext.apply(self.renderSelectors,{
            btnEl:"div"
        })

    }
})