Ext.define("Crs.lib.comp.Clock", {
    extend:"Ext.Container",
    afterRender: function(){
        this.callParent()

        var width = this.el.getWidth(), height = this.el.getHeight(), dim = width>height ? height : width

        this.cc = {
            x: dim/2-1,
            y: dim/2-1,
            range: dim/2-6
        }
/*
        this.paper = Raphael(this.el.dom, dim, dim)

        Ext.get(this.paper.canvas).setStyle({
            position:"absolute",
            top:"50%",
            left:"50%",
            marginLeft:(-dim/2)+"px",
            marginTop:(-dim/2)+"px"
        })

        this.el.position("relative")



        this.createClockBase()
        this.createArms()

        this.start()
*/

    },

    createClockBase: function(){

        var glow = this.paper.circle(this.cc.x, this.cc.y, this.cc.range)
        glow.attr({fill:"#000000", stroke: "#000000", "stroke-width": 1});
        glow.node.setAttribute("style","filter:url(#innerGlow);opacity:0.5")

        var c = this.paper.circle(this.cc.x, this.cc.y, this.cc.range)
        c.attr({stroke: "#ffffff", "stroke-width": "2"})

        var selectorsCount = 12, angle = Math.PI*2/selectorsCount

        for(var i=0; i<selectorsCount; i+=1){
            var alpha = angle * i - Math.PI / 2,
                    cos = Math.cos(alpha),
                    sin = Math.sin(alpha),
                    r1 = this.cc.range,r2 = this.cc.range-5, cx=this.cc.x, cy=this.cc.y

            var tick = this.paper.path([["M", cx + r1 * cos, cy + r1 * sin], ["L", cx + r2 * cos, cy + r2 * sin]]).attr({stroke: "#ffffff", "stroke-width": "1"});
            if(i%3 == 0){
                tick.attr({"stroke-width": 3})
            }

        }
    },

    createArm: function(thickness, length, color){
        color = color || "#ffffff"
        return this.paper.rect(this.cc.x,this.cc.y-length, 1, length).attr({fill:color, rotation:0, stroke:color, "stroke-width":thickness, "stroke-linecap":"round", "stroke-linejoin":"bevel"})
    },

    createArms: function(){

        this.hourArm = this.createArm(3, this.cc.range*4/10)
        this.minuteArm = this.createArm(3, this.cc.range*6/10)
        this.secondArm = this.createArm(1, this.cc.range*8/10)

    },

    updateTime: function( initial ) {
        var t      = new Date( ),
                hour   = t.getHours(),
                minute = t.getMinutes(),
                second = t.getSeconds(),
            // 12 Hours a day on a 360° scale make 30° for every hour. We add
            // 0.5 degrees per minute to allow for smooth adaption. On the
            // other hand we only want 6 degree "jumps" because they represent
            // the markers.
                hourRotation   = ( hour * 30 ) + minute * 0.5 - ( minute * 0.5 % 6 ),
            // 60 minutes a hour on 360° scale make 6° for every minute.
                minuteRotation = minute * 6,
            // 60 seconds a minute on a 360° scale make 6° for every second
                secondRotation = second * 6,
                easing = "bounce",
                durationSecond = 500,
                durationMinute = 500,
                durationHour   = 500;
        // We need a 12 hour scale to calculate the rotation easily
        // There will still be 0 and 12 hours but this does not make a
        // difference for the rotation calculation.
        hour = hour > 12 ? hour - 12 : hour;

        // Fix orientation of the different arms, if they are crossing the
        // zero border. This is needed because Raphael does calculate an
        // animation into the wrong direction otherwise.
        if ( secondRotation == 6 ) {
            this.secondArm.rotate( 0.000001, this.cc.x, this.cc.y );
        }
        if ( secondRotation == 0 && minuteRotation == 6 ) {
            this.minuteArm.rotate( 0.000001, this.cc.x, this.cc.y );
        }
        if ( secondRotation == 0 && minuteRotation == 72 && hourRotation == 6 ) {
            this.hourArm.rotate( 0.000001, this.cc.x, this.cc.y );
        }

        this.secondArm.animate({
            rotation: [ secondRotation == 0 ? 360 : secondRotation, this.cc.x, this.cc.y ].join( " " )
        }, durationSecond, easing );

        this.minuteArm.animateWith( this.secondArm, {
            rotation: [ minuteRotation == 0 ? 360 : minuteRotation, this.cc.x, this.cc.y ].join( " " )
        }, durationMinute, easing );

        this.hourArm.animateWith( this.minuteArm, {
            rotation: [ hourRotation == 0 ? 360 : hourRotation, this.cc.x, this.cc.y ].join( " " )
        }, durationHour, easing );

        this.currentHour = hour;
        this.currentHourRotation = hourRotation;

        this.currentMinute = minute;
        this.currentMinuteRotation = minuteRotation;

        this.currentSecond = second;
        this.currentSecondRotation = secondRotation;

        this.timeout = window.setTimeout(this.updateTime.bind(this), 1000)
    },

    start: function(){
        this.updateTime()
    },

    stop: function(){
        window.clearTimeout(this.timeout)
    }
})