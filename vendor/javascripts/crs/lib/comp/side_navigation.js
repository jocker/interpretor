Ext.define("Crs.lib.comp.SideNavigation",{
    extend:"Crs.lib.comp.AppNavigation",
    afterRender: function(){
        this.callParent()
        this.insert(0,{
            text:"Home",
            iconCls:"icon_home",
            handler: function(){
                Crs.app.App.goToHome()
            }
        })
    }
})