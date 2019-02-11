// TODO source as array, mode as array

var HtmlContainer = {
    init: function( options, elem ) {
        this.options = $.extend( {}, this.options, options );
        this.elem  = elem;
        this.element = $(elem);

        this._setOptionsFromDOM();
        this._create();

        return this;
    },

    options: {
        htmlSource: null,
        insertMode: "replace", // replace, append, prepend
        onLoad: Metro.noop,
        onFail: Metro.noop,
        onDone: Metro.noop,
        onHtmlContainerCreate: Metro.noop
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

        if (Utils.isValue(o.htmlSource)) {
            this._load();
        }

        Utils.exec(o.onHtmlContainerCreate, [element], element[0]);
    },

    _load: function(){
        var element = this.element, elem = this.elem, o = this.options;
        var html;

        html = o.htmlSource;

        $.get(html).then(function(response, status, xhr){
            switch (o.insertMode.toLowerCase()) {
                case "prepend": element.prepend(response); break;
                case "append": element.append(response); break;
                default: {
                    element.html(response);
                }
            }
            Utils.exec(o.onLoad, [response, status, xhr], elem);
        }, function(xhr){
            elem.innerHTML = "Data not found.";
            Utils.exec(o.onFail, [xhr.status, xhr.statusText, xhr], elem);
        });
    },

    changeAttribute: function(attributeName){
        var element = this.element, o = this.options;

        var changeHTMLSource = function(){
            var html = element.attr("data-html-source");
            if (Utils.isNull(html)) {
                return ;
            }
            if (html.trim() === "") {
                element.html("");
            }
            o.htmlSource = html;
            this._load();
        };

        var changeInsertMode = function(){
            var attr = element.attr("data-insert-mode");
            if (Utils.isValue(attr)) {
                o.insertMode = attr;
            }
        };

        switch (attributeName) {
            case "data-html-source": changeHTMLSource(); break;
            case "data-insert-mode": changeInsertMode(); break;
        }
    },

    destroy: function(){}
};

Metro.plugin('htmlcontainer', HtmlContainer);