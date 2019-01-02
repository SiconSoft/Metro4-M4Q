var Accordion = {
    init: function( options, elem ) {
        this.options = $.extend( {}, this.options, options );
        this.elem  = elem;
        this.element = $(elem);

        this._setOptionsFromDOM();
        this._create();

        Utils.exec(this.options.onAccordionCreate, [this.element]);

        return this;
    },
    options: {
        material: false,
        duration: METRO_ANIMATION_DURATION,
        oneFrame: true,
        showActive: true,
        activeFrameClass: "",
        activeHeadingClass: "",
        activeContentClass: "",
        onFrameOpen: Metro.noop,
        onFrameBeforeOpen: Metro.noop_true,
        onFrameClose: Metro.noop,
        onFrameBeforeClose: Metro.noop_true,
        onAccordionCreate: Metro.noop
    },

    _setOptionsFromDOM: function(){
        var element = this.element, o = this.options;

        $.each(element.data(), function(value, key){
            if (key in o) {
                try {
                    o[key] = JSON.parse(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },

    _create: function(){
        var element = this.element, o = this.options;
        var frames = element.children(".frame");
        var active = element.children(".frame.active");
        var frame_to_open;

        element.addClass("accordion");

        if (o.material === true) {
            element.addClass("material");
        }

        if (active.length === 0) {
            frame_to_open = frames[0];
        } else {
            frame_to_open = active[0];
        }

        $.each(frames.children(".content"), function(el){
            var $el = $(el);
            $el.origin("height", $el.height());
        });

        this._hideAll();

        if (o.showActive === true || o.oneFrame === true) {
            this._openFrame(frame_to_open);
        }

        this._createEvents();
    },

    _createEvents: function(){
        var that = this, element = this.element, o = this.options;
        var active = element.children(".frame.active");

        element.on(Metro.events.click, ".heading", function(){
            var heading = $(this);
            var frame = heading.parent();

            if (heading.closest(".accordion")[0] !== element[0]) {
                return false;
            }

            if (frame.hasClass("active")) {
                if (active.length === 1 && o.oneFrame) {
                } else {
                    that._closeFrame(frame);
                }
            } else {
                that._openFrame(frame);
            }

            element.trigger("open", {frame: frame});
        });
    },

    _openFrame: function(f){
        var element = this.element, o = this.options;
        var frame = $(f);

        if (Utils.exec(o.onFrameBeforeOpen, [frame], element[0]) === false) {
            return false;
        }

        if (o.oneFrame === true) {
            this._closeAll(f);
        }

        frame.addClass("active " + o.activeFrameClass);
        frame.children(".heading").addClass(o.activeHeadingClass);
        frame.children(".content").addClass(o.activeContentClass).slideDown(o.duration);

        Utils.exec(o.onFrameOpen, [frame], element[0]);
    },

    _closeFrame: function(f){
        var element = this.element, o = this.options;
        var frame = $(f);

        if (!frame.hasClass("active")) {
            return ;
        }

        if (Utils.exec(o.onFrameBeforeClose, [frame], element[0]) === false) {
            return ;
        }

        frame.removeClass("active " + o.activeFrameClass);
        frame.children(".heading").removeClass(o.activeHeadingClass);
        frame.children(".content").removeClass(o.activeContentClass).slideUp(o.duration);

        Utils.callback(o.onFrameClose, [frame], element[0]);
    },

    _closeAll: function(skip){
        var that = this, element = this.element;
        var frames = element.children(".frame");

        $.each(frames, function(el){
            if (skip && el === skip) return ;
            that._closeFrame(this);
        });
    },

    _hideAll: function(){
        var element = this.element;
        var frames = element.children(".frame");

        $.each(frames, function(el){
            $(el).children(".content").hide();
        });
    },

    _openAll: function(){
        var that = this, element = this.element;
        var frames = element.children(".frame");

        $.each(frames, function(){
            that._openFrame(this);
        });
    },

    changeAttribute: function(attributeName){
    },

    destroy: function(){
        this.element.off(Metro.events.click, ".heading");
    }
};

Metro.plugin('accordion', Accordion);