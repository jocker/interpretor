Ext.require("Crs.lib.plugins.EventBroadcaster",function(){

    var ApplicationLockFacade = (function(){

        var observer = Ext.extend(Ext.util.Observable,{

            constructor: function(){
                observer.superclass.constructor.call(this);
                (new Crs.lib.plugins.EventBroadcaster()).init(this);
                this.addEvents("lock", "unlock")
                this._locks = 0

                this.subscribe("application_lock", this.lock, this)
                this.subscribe("application_unlock", this.unlock, this)
            },

            lock: function(){
                if(this._locks == 0){
                    // Cms.info("lock modules")
                }
                ++this._locks
                this.fireEvent("lock")


            },

            unlock: function(){
                --this._locks
                if(this._locks == 0){
                    // Cms.info("unlock modules")
                    this.fireEvent("unlock")
                }
            },

            isLocked: function(){
                return this._locks > 0
            }


        })

        return new observer()

    })();



    Ext.define("Crs.lib.plugins.Lock",{
        extend:"Ext.util.Observable",
        requires:["Crs.lib.plugins.EventBroadcaster"],
        constructor: function(config){
            this.config = Ext.apply(config || {},{
                lockStore: false
            });
            (new Crs.lib.plugins.EventBroadcaster()).init(this);
        },

        init: function(comp){
            this._comp = comp
            this._locks = 0;

            this._comp.addEvents("lock","unlock")

            this.initLock()
            this.initStoreLock()
        },

        initLock: function(){
            this._comp.mon(ApplicationLockFacade,{
                lock: this.handleLock,
                unlock: this.handleUnlock,
                scope: this
            })

            Ext.apply(this._comp,{
                lock: this.lock.bind(this),
                unlock: this.unlock.bind(this),
                isLocked: function(){
                    return ApplicationLockFacade.isLocked()
                }.bind(this)
            })
        },

        initStoreLock: function(){
            if(!this.config.lockStore){
                return
            }

            if(!this._comp.store){
                Fwk.warn("cannot lock store for "+this._comp.pkg.name)
            }else{
                (function(){
                    this.mon(this.store, "beforeload", this.lock, this)
                    this.mon(this.store, "load", this.unlock, this)
                    this.mon(this.store, "exception", this.unlock, this)

                    this.mon(this.store, "beforesave", this.lock, this)
                    this.mon(this.store, "save", this.unlock, this)
                }).call(this._comp)
            }


        },

        lock: function(){
            ++this._locks
            if(this._locks == 1){
                this.publish("application_lock")
            }



        },

        unlock: function(){
            --this._locks
            if(this._locks == 0){
                this.publish("application_unlock")
            }

        },

        handleUnlock: function(){
            this._comp.fireEvent("unlock", this._comp)
        },

        handleLock: function(){
            this._comp.fireEvent("lock", this._comp)

        }

    })

})


