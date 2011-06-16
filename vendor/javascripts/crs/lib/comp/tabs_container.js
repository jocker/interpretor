Ext.define("Crs.lib.comp.TabsContainer",{
    extend:"Ext.Container",
    requires:"Crs.lib.comp.SideNavigation",
    initComponent: function(){
        var self = this

        Ext.apply(self,{
            cls:"no_overflow",
            layout:{
                type: "hbox",
                align : 'stretch',
                pack  : 'start'
            },
            items:[new Crs.lib.comp.SideNavigation({
                layout: {
                    type:"vbox",
                    align : 'center',
                    pack  : 'start'
                },
                padding:"20px 0 0 0",
                width:50,
                cls:"side_nav"
            }),{
                itemId:"tabs_container",
                xtype:"tabpanel",
                flex:1,
                cls:"app_tabs",
                border:0,
                bodyBorder:0,
                bodyStyle:"border:0;",
                tabBar:{
                    ui:"app_tab_bar",
                    border:0,
                    padding:"0 0 0 20px",
                    defaults:{
                        margins:"0 10px 0 0"
                    }
                }
            }]
        })

        self.callParent()
    },

    addTab: function(tab){
        this.getComponent("tabs_container").add(tab)
    },

    setActiveTab: function(tab){
        this.getComponent("tabs_container").setActiveTab(tab)
    }
})