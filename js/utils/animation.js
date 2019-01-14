var Animation = {

    duration: METRO_ANIMATION_DURATION,
    easing: "linear",

    switch: function(current, next, done){
        current.hide();
        next.css({top: 0, left: 0}).show();
        Utils.exec(done, [current, next]);
    },

    slideUp: function(current, next, duration, easing, done){
        var h = current.parent().outerHeight(true);
        if (duration === undefined) {duration = this.duration;}
        if (easing === undefined) {easing = this.easing;}

        current.css({
            zIndex: 1
        }).animate(function(p){
            $(this).css({
                top: -(h-(h * (1-p))) + 'px'
            })
        }, duration, easing);

        next.css({
            top: h,
            left: 0,
            zIndex: 2
        }).animate(function(p){
            $(this).css({
                top: h - (h * p) + 'px'
            })
        }, duration, easing);

        setTimeout(function(){
            Utils.exec(done, [current, next]);
        }, duration)
    },

    slideDown: function(current, next, duration, easing, done){
        var h = current.parent().outerHeight(true);
        if (duration === undefined) {duration = this.duration;}
        if (easing === undefined) {easing = this.func;}
        current.css({
            zIndex: 1
        }).animate(function(p){
            $(this).css({
                top: (h * p) + 'px'
            })
        }, duration, easing);

        next.css({
            left: 0,
            top: -h,
            zIndex: 2
        }).animate(function(p){
            $(this).css({
                top: -h + (h * p) + 'px'
            })
        }, duration, easing);

        setTimeout(function(){
            Utils.exec(done, [current, next]);
        }, duration)
    },

    slideLeft: function(current, next, duration, easing, done){
        var w = current.parent().outerWidth(true);
        if (duration === undefined) {duration = this.duration;}
        if (easing === undefined) {easing = this.easing;}

        current.css({
            zIndex: 1
        }).animate(function(p){
            $(this).css({
                left: -(w * p) + 'px'
            });
        }, duration, easing);

        next.css({
            left: w,
            zIndex: 2
        }).animate(function(p){
            $(this).css({
                left: (w * (1 - p)) + 'px'
            });
        }, duration, easing);

        setTimeout(function(){
            Utils.exec(done, [current, next]);
        }, duration)
    },

    slideRight: function(current, next, duration, easing, done){
        var w = current.parent().outerWidth(true);
        if (duration === undefined) {duration = this.duration;}
        if (easing === undefined) {easing = this.easing;}

        current.css({
            zIndex: 1
        }).animate(function(p){
            $(this).css({
                left: w * p + 'px'
            })
        }, duration, easing);

        next.css({
            left: -w,
            zIndex: 2
        }).animate(function(p){
            $(this).css({
                left: -w * (1 - p) + 'px'
            });
        }, duration, easing);

        setTimeout(function(){
            Utils.exec(done, [current, next]);
        }, duration)
    },

    fade: function(current, next, duration, done){
        if (duration === undefined) {duration = this.duration;}
        next.css({
            top: 0,
            left: 0,
            opacity: 0
        }).fadeIn(duration);
        current.fadeOut(duration);

        setTimeout(function(){
            Utils.exec(done, [current, next]);
        }, duration)
    }
};

Metro['animation'] = Animation;