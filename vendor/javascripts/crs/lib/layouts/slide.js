Ext.define("Crs.lib.layouts.Slide",{
    alias: ['layout.slide'],

    extend: 'Ext.layout.container.AbstractCard',
    requires:["Crs.lib.SyncAnim"],

    constructor: function(){
        var self = this
        self.callParent(arguments)
        self.itemCls += " slide-layout"

        Ext.applyIf(self,{
            animType: "horizontal",
            animDuration: 1000
        })
    },

    setActiveItem: function(newCard, callback) {
        // copied from Ext.layout.container.Card

        var me = this,
                owner = me.owner,
                oldCard = me.activeItem,
                newIndex;
        // Block upward layouts until we are done.
        me.layoutBusy = true;

        newCard = me.parseActiveItem(newCard);
        newIndex = owner.items.indexOf(newCard);

        // If the card is not a child of the owner, then add it
        if (newIndex == -1) {
            newIndex = owner.items.items.length;
            owner.add(newCard);
        }

        // Is this a valid, different card?
        if (newCard && oldCard != newCard) {
            // If the card has not been rendered yet, now is the time to do so.
            if (!newCard.rendered) {
                me.renderItem(newCard, me.getRenderTarget(), owner.items.length);
                me.configureItem(newCard, 0);
            }

            me.activeItem = newCard;

            // Fire the beforeactivate and beforedeactivate events on the cards
            if (newCard.fireEvent('beforeactivate', newCard, oldCard) === false) {
                me.layoutBusy = false;
                return false;
            }
            if (oldCard && oldCard.fireEvent('beforedeactivate', oldCard, newCard) === false) {
                me.layoutBusy = false;
                return false;
            }

            // If the card hasnt been sized yet, do it now
            if (!me.sizeAllCards) {
                me.setItemBox(newCard, me.getTargetBox());
            }
            else {
                // onLayout calls setItemBox
                me.onLayout();
            }

            if (oldCard) {
                oldCard.fireEvent('deactivate', oldCard, newCard);
            }

            // Make sure the new card is shown
            if (newCard.hidden) {
                newCard.show();
            }

            newCard.fireEvent('activate', newCard, oldCard);

            me.layoutBusy = false;

            if (!me.sizeAllCards) {
                if (!owner.componentLayout.layoutBusy) {
                    me.onLayout();
                }
            }

// this part is new

            if(oldCard){

                var ownerBox = owner.getBox()

                var dir = (owner.items.indexOf(newCard) > owner.items.indexOf(oldCard) ? 1 : -1), newX = 0, newY = 0

                if( self.animType == "horizontal" ){
                    newX = ownerBox.x + ownerBox.width
                }else{
                    newY = ownerBox.y + ownerBox.height
                }

                newCard.el.setOpacity(0.5)
                oldCard.el.setOpacity(0.5)


                new Crs.lib.SyncAnim([{
                    target: newCard,
                    from:{
                        y: newY*dir,
                        x: newX*dir
                    },
                    to: {
                        x: ownerBox.x,
                        y: ownerBox.y
                    }
                },{
                    target: oldCard,
                    from:{
                        x: ownerBox.x,
                        y: ownerBox.y
                    },
                    to: {
                        x: -1*dir*newX,
                        y: -1*dir*newY
                    }

                }],{
                    duration: 1000
                }, function(){
                    newCard.el.setOpacity(1)
                    oldCard.el.setOpacity(1)
                    oldCard.hide()


                    Ext.callback(callback)
                })

            }else{
                Ext.callback(callback)
            }





            return newCard;
        }

        me.layoutBusy = false;
        Ext.callback(callback)
        return false;
    }
})