var Animation = {

    duration: METRO_ANIMATION_DURATION,
    easing: "linear",

    switch: function(current, next){
        current.hide();
        next.css({top: 0, left: 0}).show();
    },

    slideUp: function(current, next, duration, easing){
        var h = current.parent().outerHeight(true);
        if (duration === undefined) {duration = this.duration;}
        if (easing === undefined) {easing = this.easing;}

        current.css({
            zIndex: 1
        }).animate(function(p){
            $(this).css({
                top: -(h-(h * (1-p))) + 'px',
                opacity: 1 - p
            })
        }, duration, easing);

        next.css({
            top: h,
            left: 0,
            zIndex: 2
        }).animate(function(p){
            $(this).css({
                top: h - (h * p) + 'px',
                opacity: p
            })
        }, duration, easing);
    },

    slideDown: function(current, next, duration, easing){
        var h = current.parent().outerHeight(true);
        if (duration === undefined) {duration = this.duration;}
        if (easing === undefined) {easing = this.func;}
        current.css({
            zIndex: 1
        }).animate(function(p){
            $(this).css({
                top: (h * p) + 'px',
                opacity: 1 - p
            })
        }, duration, easing);

        next.css({
            left: 0,
            top: -h,
            zIndex: 2
        }).animate(function(p){
            $(this).css({
                top: -h + (h * p) + 'px',
                opacity: p
            })
        }, duration, easing);
    },

    slideLeft: function(current, next, duration, easing){
        var w = current.parent().outerWidth(true);
        if (duration === undefined) {duration = this.duration;}
        if (easing === undefined) {easing = this.easing;}

        current.css({
            zIndex: 1
        }).animate(function(p){
            $(this).css({
                left: -(w * p) + 'px',
                opacity: 1 - p
            });
        }, duration, easing);

        next.css({
            left: w,
            zIndex: 2
        }).animate(function(p){
            $(this).css({
                left: (w * (1 - p)) + 'px',
                opacity: p
            });
        }, duration, easing);
    },

    slideRight: function(current, next, duration, easing){
        var w = current.parent().outerWidth(true);
        if (duration === undefined) {duration = this.duration;}
        if (easing === undefined) {easing = this.easing;}

        current.css({
            zIndex: 1
        }).animate(function(p){
            $(this).css({
                left: w * p + 'px',
                opacity: 1 - p
            })
        }, duration, easing);

        next.css({
            left: -w,
            zIndex: 2
        }).animate(function(p){
            $(this).css({
                left: -w * (1 - p) + 'px',
                opacity: p
            });
        }, duration, easing);
    },

    fade: function(current, next, duration){
        if (duration === undefined) {duration = this.duration;}
        current.fadeOut(duration);
        next.css({
            top: 0,
            left: 0,
            opacity: 0
        }).fadeIn(duration);
    }

};

Metro['animation'] = Animation;