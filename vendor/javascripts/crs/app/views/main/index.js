Ext.require(["Crs.lib.comp.UserCodeTree","Crs.app.data.stores.CodeLanguage"], function(){


    var SampleCodeTree = Ext.extend(Crs.lib.comp.CodeTreeBase,{
        initComponent: function(){
            this.store = new Crs.app.data.stores.SampleCode()
            SampleCodeTree.superclass.initComponent.call(this)
        }
    })

    Ext.chart.theme.White = Ext.extend(Ext.chart.theme.Base, {
        constructor: function() {
            Ext.chart.theme.White.superclass.constructor.call(this, {
                axis: {
                    stroke: 'rgb(8,69,148)',
                    'stroke-width': 1
                },
                axisLabel: {
                    fill: 'rgb(8,69,148)',
                    font: '12px Arial',
                    'font-family': '"Arial',
                    spacing: 2,
                    padding: 5,
                    renderer: function(v) { return v; }
                },
                axisTitle: {
                    font: 'bold 18px Arial'
                }
            });
        }
    });

    var colors = ['url(#v-1)',
        'url(#v-2)',
        'url(#v-3)',
        'url(#v-4)',
        'url(#v-5)'];

    var baseColor = '#eee';

    Ext.define('Ext.chart.theme.Fancy', {
        extend: 'Ext.chart.theme.Base',

        constructor: function(config) {
            this.callParent([Ext.apply({
                axis: {
                    fill: baseColor,
                    stroke: baseColor
                },
                axisLabelLeft: {
                    fill: baseColor
                },
                axisLabelBottom: {
                    fill: baseColor
                },
                axisTitleLeft: {
                    fill: baseColor
                },
                axisTitleBottom: {
                    fill: baseColor
                },
                colors: colors
            }, config)]);
        }
    });


    store = new Crs.app.data.stores.CodeLanguage()

    store.load()

    Ext.define("Crs.app.views.main.Index",{
        extend:"Ext.Container",
        mixins:{
            base: "Fwk.app.views.Base"
        },
        requires:["Crs.lib.comp.AppNavigation","Crs.lib.comp.Clock"],

        initComponent: function(){
            var self = this

            Ext.apply(self,{
                cls:"app_intro",
                layout: {
                    type:"vbox",
                    align : 'stretch',
                    pack  : 'start'
                },
                items:[ new Crs.lib.comp.AppNavigation({
                    layout: {
                        type:"hbox",
                        align : 'middle',
                        pack  : 'center'
                    }
                }),{
                    xtype:"container",
                    flex:1,
                    layout: {
                        type: "hbox",
                        align : 'stretch',
                        pack  : 'start'

                    },
                    cls:"app_intro_portal",
                    defaults:{
                        margins:'0 5',
                        xtype:"container",
                        flex:1,
                        layout: {
                            type:"vbox",
                            align : 'stretch',
                            pack  : 'start'
                        },
                        defaults:{
                            margins:"5 0"
                        }
                    },
                    items:[{
                        // col 1
                        flex:1,
                        defaults:{
                            margins:"5 0"
                        },
                        items:[new Crs.lib.comp.Clock({
                            height:100,
                            width:100,
                            flex:1,
                            cls:""
                        }),{
                            title:"Notifications",
                            ui:"intro_portlet",
                            flex:3,
                            layout:"fit",
                            items:{
                                id: 'chartCmp',
                                xtype: 'chart',
                                animate: true,
                                shadow: true,
                                store: store,
                                axes: [{
                                    type: 'Numeric',
                                    position: 'bottom',
                                    fields: ['uses_count'],
                                    grid: true,
                                    label: {
                                        renderer: function(v){return v}
                                    },
                                    minimum: 0
                                }, {
                                    type: 'Category',
                                    position: 'left',
                                    fields: ['name'],
                                    label: {
                                        renderer: function(v){return v}
                                    }
                                }],
                                theme: 'Fancy',
                                background: {
                                    fill: 'rgb(17, 17, 17)'
                                },
                                gradients: [
                                    {
                                        'id': 'v-1',
                                        'angle': 0,
                                        stops: {
                                            0: {
                                                color: 'rgb(212, 40, 40)'
                                            },
                                            100: {
                                                color: 'rgb(117, 14, 14)'
                                            }
                                        }
                                    },
                                    {
                                        'id': 'v-2',
                                        'angle': 0,
                                        stops: {
                                            0: {
                                                color: 'rgb(180, 216, 42)'
                                            },
                                            100: {
                                                color: 'rgb(94, 114, 13)'
                                            }
                                        }
                                    },
                                    {
                                        'id': 'v-3',
                                        'angle': 0,
                                        stops: {
                                            0: {
                                                color: 'rgb(43, 221, 115)'
                                            },
                                            100: {
                                                color: 'rgb(14, 117, 56)'
                                            }
                                        }
                                    },
                                    {
                                        'id': 'v-4',
                                        'angle': 0,
                                        stops: {
                                            0: {
                                                color: 'rgb(45, 117, 226)'
                                            },
                                            100: {
                                                color: 'rgb(14, 56, 117)'
                                            }
                                        }
                                    },
                                    {
                                        'id': 'v-5',
                                        'angle': 0,
                                        stops: {
                                            0: {
                                                color: 'rgb(187, 45, 222)'
                                            },
                                            100: {
                                                color: 'rgb(85, 10, 103)'
                                            }
                                        }
                                    }],
                                series: [{
                                    type: 'bar',
                                    axis: 'bottom',
                                    highlight: true,
                                    tips: {
                                        trackMouse: true,
                                        width: 140,
                                        height: 28,
                                        renderer: function(storeItem, item) {
                                            this.setTitle(storeItem.get('name') + ': ' + storeItem.get('uses_count') + ' views');
                                        }
                                    },
                                    label: {
                                        display: 'insideEnd',
                                        field: 'uses_count',
                                        renderer: Ext.util.Format.numberRenderer('0'),
                                        orientation: 'horizontal',
                                        color: '#333',
                                        'text-anchor': 'middle'
                                    },
                                    renderer: function(sprite, storeItem, barAttr, i, store) {
                                        barAttr.fill = colors[i % colors.length];
                                        return barAttr;
                                    },
                                    xField: 'name',
                                    yField: ['uses_count']
                                }]
                            }
                        },{
                            title:"Messages",
                            ui:"intro_portlet",
                            flex:1,
                            items:[{
                                xtype:"button",
                                text:"Messages",
                                handler: function(){
                                    Fwk.routing.Router.processRequest("/window_"+Ext.id()+"/messages/index")
                                }
                            },{
                                xtype:"button",
                                text:"Submissions",
                                handler: function(){
                                    Fwk.routing.Router.processRequest("/window_"+Ext.id()+"/channel_join_requests/index")
                                }
                            }]
                        }]
                    },{
                        // col 2
                        flex:2,
                        items:[{
                            title:"Latest news",
                            ui:"intro_portlet",
                            flex:1,
                            layout:"fit"
                        }]
                    },{
                        // col 3
                        flex:1,
                        items:[{
                            title:"Sample code",
                            ui:"intro_portlet",
                            flex:1,
                            layout:"fit",
                            items: new SampleCodeTree()
                        },{
                            title:"Saved code",
                            ui:"intro_portlet",
                            flex:1,
                            layout:"fit",
                            items: new Crs.lib.comp.UserCodeTree()
                        }]
                    }]
                }]
            })

            self.callParent(arguments)
        }

    })

})
