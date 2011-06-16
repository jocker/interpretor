(function(){
    var runningTasks = 0

    Ext.define("Crs.lib.comp.AppStatusBar",{
        requires:"Crs.lib.comp.ProgressBar",
        extend:"Ext.Container",
        constructor: function(config){

            config = Ext.apply(config || {},{
                xtype:"container",
                cls:"app_footer",
                height:30,
                layout:{
                    type:"hbox",
                    align : 'middle',
                    pack  : 'start',
                    padding:"0 15"
                },
                items: [{
                    xtype:"component",
                    flex: 1
                },
                    new Crs.lib.comp.ProgressBar({
                        width:100,
                        height:16,
                        itemId:"progressBar"
                    })
                ]
            })
            this.callParent([config])

        },

        afterRender: function(){
            this.callParent()
            this.progressBar = this.getComponent("progressBar")

            Ext.Ajax.on('beforerequest', function(){
                this.updateProgressBar(1)
            }, this);
            Ext.Ajax.on('requestcomplete', function(){
                this.updateProgressBar(-1)
            }, this);
            Ext.Ajax.on('requestexception', function(){
                this.updateProgressBar(-1)
            }, this);

        },

        updateProgressBar: function(dir){
            this.progressBar.show()
            runningTasks += dir
            if( runningTasks == 1 ){
                this.progressBar.setValue(100)
            }else if( runningTasks > 1 ){
                this.progressBar.setValue(100/runningTasks)
            }else{
                this.progressBar.hide()
            }


        }
    })


})()
