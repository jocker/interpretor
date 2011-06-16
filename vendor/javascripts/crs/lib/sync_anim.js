Ext.define("Crs.lib.SyncAnim",{

    constructor: function(){
        var anim_count = 0, args = Ext.toArray(arguments), anim_configs = args.shift(), common_config = args.shift() || {}, callback = Ext.emptyFn

        if(common_config){
            if(Ext.isFunction(common_config)){
                callback = common_config
                common_config = {}
            }else if( args.length == 1 ){
                callback = args[0]
            }
        }



        anim_configs.forEach(function(config){
            Ext.apply(config, common_config);

            (new Ext.fx.Anim(config)).on({
                afteranimate: function(){
                    anim_count--
                    if( anim_count == 0 ){
                        Ext.callback(callback)
                    }
                },
                beforeanimate: function(){
                    anim_count++
                }
            })

        })
    }

})