var AppBar = {
    init: function( options, elem ) {
        this.options = $.extend( {}, this.options, options );
        this.elem  = elem;
        this.element = $(elem);

        this._setOptionsFromDOM();
        this._create();

        return this;
    },

    options: {
        expand: false,
        expandPoint: null,
        duration: 100,
        onAppBarCreate: Metro.noop
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

        this._createStructure();
        this._createEvents();

        Utils.exec(o.onAppBarCreate, [element]);
    },

    _createStructure: function(){
        var element = this.element, o = this.options;
        var id = Utils.elementId("app-bar");
        var hamburger, menu;

        element.addClass("app-bar");
        hamburger = element.find(".hamburger");
        if (hamburger.length === 0) {
            hamburger = $("<button>").attr("type", "button").addClass("hamburger menu-down");
            for(var i = 0; i < 3; i++) {
                $("<span>").addClass("line").appendTo(hamburger);
            }

            if (Colors.isLight(Utils.computedRgbToHex(Utils.getStyleOne(element, "background-color"))) === true) {
                hamburger.addClass("dark");
            }
        }

        element.prepend(hamburger);

        menu = element.find(".app-bar-menu");
        if (menu.length === 0) {
            hamburger.css("display", "none");
        } else {
            Utils.addCssRule(Metro.sheet, ".app-bar-menu li", "list-style: none!important;"); // This special for IE11 and Edge
        }

        if( !!element.attr("id") === false ){
            element.attr("id", id);
        }

        if (hamburger.css('display') === 'block') {
            menu.hide().addClass("collapsed");
            hamburger.removeClass("hidden");
        } else {
            hamburger.addClass("hidden");
        }

        if (o.expand === true) {
            element.addClass("app-bar-expand");
            hamburger.addClass("hidden");
        } else {
            if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint)) {
                element.addClass("app-bar-expand");
                hamburger.addClass("hidden");
            }
        }
    },

    _createEvents: function(){
        var that = this, element = this.element, o = this.options;
        var menu = element.find(".app-bar-menu");
        var hamburger = element.find(".hamburger");

        element.on(Metro.events.click, ".hamburger", function(){
            if (menu.length === 0) return ;
            var collapsed = menu.hasClass("collapsed");
            if (collapsed) {
                that.open();
            } else {
                that.close();
            }
        });

        $(window).on(Metro.events.resize+".app-bar-"+element.attr("id"), function(){
            if (o.expand !== true) {
                if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint)) {
                    element.addClass("app-bar-expand");
                } else {
                    element.removeClass("app-bar-expand");
                }
            }

            if (menu.length === 0) return ;

            if (hamburger.css('display') !== 'block') {
                menu.show();
                hamburger.addClass("hidden");
            } else {
                hamburger.removeClass("hidden");
                if (hamburger.hasClass("active")) {
                    menu.show().removeClass("collapsed");
                } else {
                    menu.hide().addClass("collapsed");
                }
            }
        });
    },

    close: function(){
        var element = this.element, o = this.options;
        var menu = element.find(".app-bar-menu");
        var hamburger = element.find(".hamburger");

        menu.slideUp(o.duration, "linear", function(){
            menu.addClass("collapsed");
            hamburger.removeClass("active");
        });
    },

    open: function(){
        var element = this.element, o = this.options;
        var menu = element.find(".app-bar-menu");
        var hamburger = element.find(".hamburger");

        menu.slideDown(o.duration, "linear", function(){
            menu.removeClass("collapsed");
            hamburger.addClass("active");
        });
    },

    changeAttribute: function(attributeName){

    },

    destroy: function(){
        var element = this.element;
        element.off(Metro.events.click, ".hamburger");
        $(window).off(Metro.events.resize+"-"+element.attr("id"));
    }
};

Metro.plugin('appbar', AppBar);