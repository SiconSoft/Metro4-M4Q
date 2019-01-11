var Hint = {
    init: function( options, elem ) {
        this.options = $.extend( {}, this.options, options );
        this.elem  = elem;
        this.element = $(elem);
        this.hint = null;
        this.hint_size = {
            width: 0,
            height: 0
        };

        this._setOptionsFromDOM();
        this._create();

        Utils.exec(this.options.onHintCreate, [this.element]);

        return this;
    },

    options: {
        hintHide: 5000,
        clsHint: "",
        hintText: "",
        hintPosition: Metro.position.TOP,
        hintOffset: 4,
        onHintCreate: Metro.noop,
        onHintShow: Metro.noop,
        onHintHide: Metro.noop
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
        var that = this, element = this.element, o = this.options;

        element.on(Metro.events.enter + ".hint", function(){
            that.createHint();
            if (o.hintHide > 0) {
                setTimeout(function(){
                    that.removeHint();
                }, o.hintHide);
            }
        });

        element.on(Metro.events.leave + ".hint", function(){
            that.removeHint();
        });

        $(window).on(Metro.events.scroll + ".hint", function(){
            if (that.hint !== null) that.setPosition();
        });
    },

    createHint: function(){
        var elem = this.elem, element = this.element, o = this.options;
        var hint = $("<div>").addClass("hint").addClass(o.clsHint).html(o.hintText);

        this.hint = hint;
        this.hint_size = Utils.hiddenElementSize(hint);

        $.each($(".hint"), function(el){
            var $el = $(el);
            if ($el.hasClass("permanent-hint") && $el.is(hint)) return;
            $el.remove();
        });

        if (elem.tagName === 'TD' || elem.tagName === 'TH') {
            var wrp = $("<div>").css("display", "inline-block").html(element.html());
            element.html(wrp);
            element = wrp;
        }

        this.setPosition();

        hint.appendTo($('body'));
        Utils.exec(o.onHintShow, [hint, element]);
    },

    setPosition: function(){
        var hint = this.hint, hint_size = this.hint_size, o = this.options, element = this.element;

        if (o.hintPosition === Metro.position.BOTTOM) {
            hint.addClass('bottom');
            hint.css({
                top: element.offset().top - pageYOffset + element.outerHeight() + o.hintOffset + 'px',
                left: element.offset().left + element.outerWidth()/2 - hint_size.width/2  - pageXOffset + 'px'
            });
        } else if (o.hintPosition === Metro.position.RIGHT) {
            hint.addClass('right');
            hint.css({
                top: element.offset().top + element.outerHeight()/2 - hint_size.height/2 - pageYOffset + 'px',
                left: element.offset().left + element.outerWidth() - pageXOffset + o.hintOffset + 'px'
            });
        } else if (o.hintPosition === Metro.position.LEFT) {
            hint.addClass('left');
            hint.css({
                top: element.offset().top + element.outerHeight()/2 - hint_size.height/2 - pageYOffset + 'px',
                left: element.offset().left - hint_size.width - pageXOffset - o.hintOffset + 'px'
            });
        } else {
            hint.addClass('top');
            hint.css({
                top: element.offset().top - pageYOffset - hint_size.height - o.hintOffset + 'px',
                left: element.offset().left + element.outerWidth()/2 - hint_size.width/2  - pageXOffset + 'px'
            });
        }
    },

    removeHint: function(){
        var that = this;
        var hint = this.hint;
        var element = this.element;
        var options = this.options;
        var timeout = options.onHintHide === Metro.noop ? 0 : 300;

        if (hint !== null) {
            Utils.exec(options.onHintHide, [hint, element]);
            setTimeout(function(){
                hint.hide(0, function(){
                    hint.remove();
                    that.hint = null;
                });
            }, timeout);
        }
    },

    changeText: function(){
        this.options.hintText = this.element.attr("data-hint-text");
    },

    changeAttribute: function(attributeName){
        switch (attributeName) {
            case "data-hint-text": this.changeText(); break;
        }
    },

    destroy: function(){
        var element = this.element;
        this.removeHint();
        element.off(Metro.events.enter + "-hint");
        element.off(Metro.events.leave + "-hint");
        $(window).off(Metro.events.scroll + "-hint");
    }
};

Metro.plugin('hint', Hint);