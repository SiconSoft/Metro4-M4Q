
var $ = m4q;

var not = function(val){
    return val === undefined && val === null;
};

if (typeof m4q === 'undefined') {
    throw new Error('Metro 4 requires m4q!');
}

if ('MutationObserver' in window === false) {
    throw new Error('Metro 4 requires MutationObserver!');
}

var
    meta_init = $("meta[name='metro4:init']").attr("content"),
    meta_locale = $("meta[name='metro4:locale']").attr("content"),
    meta_week_start = $("meta[name='metro4:week_start']").attr("content"),
    meta_date_format = $("meta[name='metro4:date_format']").attr("content"),
    meta_date_format_input = $("meta[name='metro4:date_format_input']").attr("content"),
    meta_animation_duration = $("meta[name='metro4:animation_duration']").attr("content"),
    meta_callback_timeout = $("meta[name='metro4:callback_timeout']").attr("content"),
    meta_timeout = $("meta[name='metro4:timeout']").attr("content"),
    meta_scroll_multiple = $("meta[name='metro4:scroll_multiple']").attr("content"),
    meta_cloak = $("meta[name='metro4:cloak']").attr("content"), //default or fade
    meta_cloak_duration = $("meta[name='metro4:cloak_duration']").attr("content"), //100
    meta_m4q_global = $("meta[name='m4q:global']").attr("content"), //true or false
    meta_jquery = $("meta[name='metro4:jquery']").attr("content"); //true or false

if (window.METRO_INIT === undefined) {
    window.METRO_INIT = meta_init !== undefined ? JSON.parse(meta_init) : true;
}
if (window.METRO_DEBUG === undefined) {window.METRO_DEBUG = true;}

if (window.METRO_WEEK_START === undefined) {
    window.METRO_WEEK_START = meta_week_start !== undefined ? parseInt(meta_week_start) : 0;
}
if (window.METRO_DATE_FORMAT === undefined) {
    window.METRO_DATE_FORMAT = meta_date_format !== undefined ? meta_date_format : "%Y-%m-%d";
}
if (window.METRO_DATE_FORMAT_INPUT === undefined) {
    window.METRO_DATE_FORMAT_INPUT = meta_date_format_input !== undefined ? meta_date_format_input : "%Y-%m-%d";
}
if (window.METRO_LOCALE === undefined) {
    window.METRO_LOCALE = meta_locale !== undefined ? meta_locale : 'en-US';
}
if (window.METRO_ANIMATION_DURATION === undefined) {
    window.METRO_ANIMATION_DURATION = meta_animation_duration !== undefined ? parseInt(meta_animation_duration) : 300;
}
if (window.METRO_CALLBACK_TIMEOUT === undefined) {
    window.METRO_CALLBACK_TIMEOUT = meta_callback_timeout !== undefined ? parseInt(meta_callback_timeout) : 500;
}
if (window.METRO_TIMEOUT === undefined) {
    window.METRO_TIMEOUT = meta_timeout !== undefined ? parseInt(meta_timeout) : 2000;
}
if (window.METRO_SCROLL_MULTIPLE === undefined) {
    window.METRO_SCROLL_MULTIPLE = meta_scroll_multiple !== undefined ? parseInt(meta_scroll_multiple) : 20;
}
if (window.METRO_CLOAK_REMOVE === undefined) {
    window.METRO_CLOAK_REMOVE = meta_cloak !== undefined ? (""+meta_cloak).toLowerCase() : "fade";
}
if (window.METRO_CLOAK_DURATION === undefined) {
    window.METRO_CLOAK_DURATION = meta_cloak_duration !== undefined ? parseInt(meta_cloak_duration) : 500;
}
if (window.METRO_HOTKEYS_FILTER_CONTENT_EDITABLE === undefined) {window.METRO_HOTKEYS_FILTER_CONTENT_EDITABLE = true;}
if (window.METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS === undefined) {window.METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS = true;}
if (window.METRO_HOTKEYS_FILTER_TEXT_INPUTS === undefined) {window.METRO_HOTKEYS_FILTER_TEXT_INPUTS = true;}
if (window.METRO_HOTKEYS_BUBBLE_UP === undefined) {window.METRO_HOTKEYS_BUBBLE_UP = false;}
if (window.METRO_THROWS === undefined) {window.METRO_THROWS = true;}

if (meta_m4q_global && JSON.parse(meta_m4q_global) === true) {
    window.$ = m4q;
}

if (window.METRO_JQUERY === undefined) {
    window.METRO_JQUERY = meta_jquery !== undefined ? JSON.parse(meta_jquery) : true;
}

if (!METRO_JQUERY && typeof window.$ === "undefined" ) {
    window.$ = m4q;
}

window.METRO_MEDIA = [];

if ( typeof Object.create !== 'function' ) {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

if (typeof Object.values !== 'function') {
    Object.values = function(obj) {
        return Object.keys(obj).map(function(e) {
            return obj[e]
        });
    }
}

var jQueryPresent = typeof jQuery !== "undefined";

var isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

var Metro = {

    version: "@@version",
    versionFull: "@@version [build @@build] @@status",
    isTouchable: isTouch,
    fullScreenEnabled: document.fullscreenEnabled,
    sheet: null,

    controlsPosition: {
        INSIDE: "inside",
        OUTSIDE: "outside"
    },

    groupMode: {
        ONE: "one",
        MULTI: "multi"
    },

    aspectRatio: {
        HD: "hd",
        SD: "sd",
        CINEMA: "cinema"
    },

    fullScreenMode: {
        WINDOW: "window",
        DESKTOP: "desktop"
    },

    position: {
        TOP: "top",
        BOTTOM: "bottom",
        LEFT: "left",
        RIGHT: "right",
        TOP_RIGHT: "top-right",
        TOP_LEFT: "top-left",
        BOTTOM_LEFT: "bottom-left",
        BOTTOM_RIGHT: "bottom-right",
        LEFT_BOTTOM: "left-bottom",
        LEFT_TOP: "left-top",
        RIGHT_TOP: "right-top",
        RIGHT_BOTTOM: "right-bottom"
    },

    popoverEvents: {
        CLICK: "click",
        HOVER: "hover",
        FOCUS: "focus"
    },

    stepperView: {
        SQUARE: "square",
        CYCLE: "cycle",
        DIAMOND: "diamond"
    },

    listView: {
        LIST: "list",
        CONTENT: "content",
        ICONS: "icons",
        ICONS_MEDIUM: "icons-medium",
        ICONS_LARGE: "icons-large",
        TILES: "tiles",
        TABLE: "table"
    },

    events: {
        click: 'click',
        start: isTouch ? 'touchstart' : 'mousedown',
        touchstart: 'touchstart',
        mousedown: 'mousedown',
        stop: isTouch ? 'touchend' : 'mouseup',
        touchend: 'touchend',
        mouseup: 'mouseup',
        move: isTouch ? 'touchmove' : 'mousemove',
        touchmove: 'touchmove',
        mousemove: 'mousemove',
        enter: isTouch ? 'touchstart' : 'mouseenter',
        touchenter: 'touchstart',
        mouseenter: 'mouseenter',
        leave: 'mouseleave',
        focus: 'focus',
        blur: 'blur',
        resize: 'resize',
        keyup: 'keyup',
        keydown: 'keydown',
        keypress: 'keypredd',
        dblclick: 'dblclick',
        input: 'input',
        change: 'change',
        cut: 'cut',
        paste: 'paste',
        scroll: 'scroll',
        scrollStart: 'scrollstart',
        scrollStop: 'scrollstop',
        mousewheel: 'mousewheel',
        inputchange: "change input propertychange cut paste copy",
        dragstart: "dragstart",
        dragend: "dragend",
        dragenter: "dragenter",
        dragover: "dragover",
        dragleave: "dragleave",
        drop: 'drop',
        drag: 'drag',
        visibility: "visibilitychange",
        visibilitychange: "visibilitychange"
    },

    keyCode: {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        BREAK: 19,
        CAPS: 20,
        ESCAPE: 27,
        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        COMMA: 188
    },

    media_queries: {
        FS: "(min-width: 0px)",
        XS: "(min-width: 360px)",
        SM: "(min-width: 576px)",
        MD: "(min-width: 768px)",
        LG: "(min-width: 992px)",
        XL: "(min-width: 1200px)",
        XXL: "(min-width: 1452px)"
    },

    media_sizes: {
        FS: 0,
        XS: 360,
        SM: 576,
        LD: 640,
        MD: 768,
        LG: 992,
        XL: 1200,
        XXL: 1452
    },

    media_mode: {
        FS: "fs",
        XS: "xs",
        SM: "sm",
        MD: "md",
        LG: "lg",
        XL: "xl",
        XXL: "xxl"
    },

    media_modes: ["fs","xs","sm","md","lg","xl","xxl"],

    actions: {
        REMOVE: 1,
        HIDE: 2
    },

    hotkeys: [],

    about: function(f){
        console.log("Metro 4 - v" + this.ver(f));
        console.log("M4Q - v" + $.fn.m4q);
    },

    aboutDlg: function(f){
        alert(
            "Metro 4 - v" + this.ver(f)+"\n"+
            "M4Q - v" + $.fn.m4q
        );
    },

    ver: function(f){
        return (f === true ? this.versionFull : this.version);
    },

    error: function( msg ) {
        throw new Error( msg );
    },

    observe: function(){
        'use strict';
        var observer, observerCallback;
        var observerConfig = {
            childList: true,
            attributes: true,
            subtree: true
        };
        observerCallback = function(mutations){
            mutations.map(function(mutation){

                if (mutation.type === 'attributes' && mutation.attributeName !== "data-role") {
                    var element = $(mutation.target);
                    var mc = element.data('metroComponent');
                    if (mc !== undefined) {
                        $.each(mc, function(){
                            var plug = element.data(this);
                            if (plug) plug.changeAttribute(mutation.attributeName);
                        });
                    }
                } else

                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    var i, obj, widgets = {}, plugins = {};
                    var nodes = mutation.addedNodes;

                    for(i = 0; i < nodes.length; i++) {

                        var node = nodes[i];

                        if (node.nodeType !== 1) {
                            continue ;
                        }

                        if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                            continue ;
                        }

                        obj = $(node);

                        plugins = obj.find("[data-role]");

                        if (obj.attr('data-role') !== undefined) {
                            widgets = $.merge(plugins, obj);
                        } else {
                            widgets = plugins;
                        }

                        if (widgets.length) {
                            Metro.initWidgets(widgets);
                        }
                    }

                } else  {
                    //console.log(mutation);
                }
            });
        };
        observer = new MutationObserver(observerCallback);
        observer.observe($("html")[0], observerConfig);
    },

    init: function(){
        var widgets = $("[data-role]");
        var hotkeys = $("[data-hotkey]");
        var html = $("html");

        if (isTouch === true) {
            html.addClass("metro-touch-device");
        } else {
            html.addClass("metro-no-touch-device");
        }

        this.sheet = Utils.newCssSheet();


        window.METRO_MEDIA = [];
        $.each(Metro.media_queries, function(query, key){
            if (Utils.media(query)) {
                METRO_MEDIA.push(Metro.media_mode[key]);
            }
        });

        this.observe();

        this.initHotkeys(hotkeys);
        this.initWidgets(widgets);

        this.about(true);

        if (METRO_CLOAK_REMOVE !== "fade") {
            $(".m4-cloak").removeClass("m4-cloak");
        } else {
            $(".m4-cloak").fadeIn(METRO_CLOAK_DURATION, "linear", function(){
                $(".m4-cloak").removeClass("m4-cloak");
            });
        }

        return this;
    },

    initHotkeys: function(hotkeys){
        $.each(hotkeys, function(){
            var element = $(this);
            var hotkey = element.data('hotkey') ? element.data('hotkey').toLowerCase() : false;

            if (hotkey === false) {
                return;
            }

            if (element.data('hotKeyBonded') === true ) {
                return;
            }

            Metro.hotkeys.push(hotkey);

            $(document).on(Metro.events.keyup, null, hotkey, function(e){
                if (element === undefined) return;

                if (element[0].tagName === 'A' &&
                    element.attr('href') !== undefined &&
                    element.attr('href').trim() !== '' &&
                    element.attr('href').trim() !== '#') {
                    document.location.href = element.attr('href');
                } else {
                    element.click();
                }
                return METRO_HOTKEYS_BUBBLE_UP;
            });

            element.data('hotKeyBonded', true);
        });
    },

    initWidgets: function(widgets) {
        $.each(widgets, function () {
            var $this = $(this), w = this;
            var roles = $this.attr('data-role').split(/\s*,\s*/);

            roles.map(function (func) {
                if ($.fn[func] !== undefined && $this.attr("data-role-"+func) === undefined) {

                    if (METRO_JQUERY && jQueryPresent) {
                        console.log("---");
                        jQuery.fn[func].call($this);
                    } else {
                        console.log("+++");
                        $.fn[func].call($this);
                    }

                    $this.attr("data-role-"+func, true);

                    var mc = $this.data('metroComponent');

                    if (mc === undefined) {
                        mc = [func];
                    } else {
                        mc.push(func);
                    }
                    $this.data('metroComponent', mc);
                }
            });
        });
    },

    plugin: function(name, object){
        $.fn[name] = function( options ) {
            return this.each(function() {
                $.data( this, name, Object.create(object).init(options, this ));
            });
        };
        if (METRO_JQUERY && jQueryPresent) {
            jQuery.fn[name] = function( options ) {
                return this.each(function() {
                    jQuery.data( this, name, Object.create(object).init(options, this ));
                });
            };
        }
    },

    destroyPlugin: function(element, name){
        var p, mc;
        element = Utils.isM4QObject(element) ? element[0] : element;
        p = $(element).data(name);

        if (!Utils.isValue(p)) {
            throw new Error("Component can not be destroyed: the element is not a Metro 4 component.");
        }

        if (!Utils.isFunc(p['destroy'])) {
            throw new Error("Component can not be destroyed: method destroy not found.");
        }

        p['destroy']();
        mc = $(element).data("metroComponent");
        Utils.arrayDelete(mc, name);
        $(element).data("metroComponent", mc);
        $.removeData(element, name);
        $(element).removeAttr("data-role-"+name);
    },

    destroyPluginAll: function(element){
        element = Utils.isM4QObject(element) ? element[0] : element;
        var mc = $(element).data("metroComponent");

        if (mc !== undefined && mc.length > 0) $.each(mc, function(){
            Metro.destroyPlugin(element, this);
        });
    },

    initPlugin: function(element, name){
        element = $(element);
        if ($.fn[name] !== undefined && element.attr("data-role-"+name) === undefined) {
            $.fn[name].call(element);
            element.attr("data-role-"+name, true);

            var mc = element.data('metroComponent');

            if (mc === undefined) {
                mc = [name];
            } else {
                mc.push(name);
            }
            element.data('metroComponent', mc);
        }
    },

    reinitPlugin: function(element, name){
        this.destroyPlugin(element, name);
        this.initPlugin(element, name);
    },

    reinitPluginAll: function(element){
        var mc = $(element).data("metroComponent");

        if (mc !== undefined && mc.length > 0) $.each(mc, function(){
            Metro.reinitPlugin(element, this);
        });
    },

    noop: function(){},
    noop_true: function(){return true;},
    noop_false: function(){return false;},

    stop: function(e){
        e.stopPropagation();
        e.preventDefault();
    },

    requestFullScreen: function(element){
        if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            element.requestFullscreen();
        }
    },

    exitFullScreen: function(){
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else {
            document.exitFullscreen();
        }
    },

    inFullScreen: function(){
        var fsm = (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        return fsm !== undefined;
    }
};

window['Metro'] = Metro;

$(window).on(Metro.events.resize, function(){
    window.METRO_MEDIA = [];
    $.each(Metro.media_queries, function(query, key){
        if (Utils.media(query)) {
            METRO_MEDIA.push(Metro.media_mode[key]);
        }
    });
});

