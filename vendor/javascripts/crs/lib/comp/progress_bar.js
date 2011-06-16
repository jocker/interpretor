Ext.define("Crs.lib.comp.ProgressBar",{
    extend:"Ext.Component",
    constructor: function(config) {

        config = Ext.applyIf(config || {}, {
            value: 0,
            cls:"progress_bar",
            renderTpl: '<div class="progress"><div class="progress_animation"></div><div class="progress_bevel"></div></div>'
        })
        this.callParent([config])
    },



    afterRender: function() {
        this.callParent()
        this.bar = this.el.first()
        this.updateProgress()
    },

    updateProgress: function() {
        this.bar.setWidth((1 - (1 - this.value / 100)) * this.el.getWidth())
    },

    setValue: function(value) {
        this.value = value
        this.updateProgress()
    },

    hide: function(){
        this.animate({
            duration: 1000,
            from:{ opacity:1},
            to:{ opacity:0 }
        })
    },

    show: function(){
        if(this.getActiveAnimation()){
            this.stopAnimation()
        }
        this.el.setOpacity(1)
    }
})