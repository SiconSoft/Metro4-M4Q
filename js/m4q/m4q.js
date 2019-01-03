/*
 * m4q v1.0.0 (https://github.com/olton/m4q.git)
 * Copyright 2018 - 2019 by Sergey Pimenov
 * Helper for DOM manipulation for Metro 4 library
 * Licensed under MIT
 */

( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "m4q requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	"use strict";
	

	function camelCase(string){
	    return string.replace( /-([a-z])/g, function(all, letter){
	        return letter.toUpperCase();
	    });
	}
	
	function isPlainObject( obj ) {
	    var proto;
	    if ( !obj || Object.prototype.toString.call( obj ) !== "[object Object]" ) {
	        return false;
	    }
	    proto = obj.prototype !== undefined;
	    if ( !proto ) {
	        return true;
	    }
	    return proto.constructor && typeof proto.constructor === "function";
	}
	
	function isEmptyObject( obj ) {
	    for (var name in obj ) {
	        if (obj.hasOwnProperty(name)) return false;
	    }
	    return true;
	}
	
	function isArrayLike (target){
	    return target instanceof Object && 'length' in target;
	}
	

	var m4qVersion = "@VERSION";
	var regexpSingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
	
	var matches = Element.prototype.matches
	    || Element.prototype.matchesSelector
	    || Element.prototype.webkitMatchesSelector
	    || Element.prototype.mozMatchesSelector
	    || Element.prototype.msMatchesSelector
	    || Element.prototype.oMatchesSelector;
	
	var not = function(value){
	    return value === undefined || value === null;
	};
	
	var m4q = function(selector, context){
	    return new m4q.init(selector, context);
	};
	
	m4q.uniqueId = function () {
	    var d = new Date().getTime();
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	    });
	};
	
	m4q.toArray = function(n){
	    var i, out = [];
	
	    for (i = 0 ; i < n.length; i++ ) {
	        out.push(n[i]);
	    }
	
	    return out;
	};
	
	m4q.fn = m4q.prototype = {
	    m4q: m4qVersion,
	    constructor: m4q,
	    length: 0,
	
	    items: function(){
	        return m4q.toArray(this);
	    },
	
	    index: function(){
	        return this.length === 0 ? -1 : m4q.toArray(this[0].parentNode.children).indexOf(this[0]);
	    },
	
	    get: function(index){
	        if (index === undefined) {
	            return this.items();
	        }
	        return index < 0 ? this[ index + this.length ] : this[ index ];
	    },
	
	    clone: function(){
	        var res = [], out = m4q();
	        this.each(function(el){
	            res.push(el.cloneNode(true));
	        });
	        return m4q.merge(out, res);
	    },
	
	    origin: function(name, value, defaultValue){
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (name === undefined && value === undefined) {
	            return m4q.data(this[0]);
	        }
	
	        if (value === undefined) {
	            var res = m4q.data(this[0], "origin-"+name);
	            return res ? res : defaultValue;
	        }
	
	        this.data("origin-"+name, value);
	
	        return this;
	    },
	
	    contains: function(selector){
	        return this.find(selector).length > 0;
	    },
	
	    is: function(selector){
	        return this.length === 0 ? undefined : matches.call(this[0], selector);
	    },
	
	    _property: function(property, value){
	        if (this.length === 0) {
	            return ;
	        }
	        if (value === undefined) {
	            return this[0][property];
	        }
	
	        this.each(function(el){
	            el[property] = value;
	        });
	
	        return this;
	    },
	
	    val: function(value){
	        return this._property("value", value);
	    },
	
	    push: [].push,
	    sort: [].sort,
	    splice: [].splice,
	    indexOf: [].indexOf
	};
	
	m4q.extend = m4q.fn.extend = function(){
	    var options, name,
	        target = arguments[ 0 ] || {},
	        i = 1,
	        length = arguments.length;
	
	    if ( typeof target !== "object" && typeof target !== "function" ) {
	        target = {};
	    }
	
	    if ( i === length ) {
	        target = this;
	        i--;
	    }
	
	    for ( ; i < length; i++ ) {
	        if ( ( options = arguments[ i ] ) != null ) {
	            for ( name in options ) {
	                if (options.hasOwnProperty(name)) target[ name ] = options[ name ];
	            }
	        }
	    }
	
	    return target;
	};
	

	m4q.each = function(context, callback){
	    var index = 0;
	    if (isArrayLike(context)) {
	        [].forEach.call(context, function(el) {
	            callback.apply(el, arguments);
	        });
	    } else {
	        for(var el in context) {
	            if (context.hasOwnProperty(el))
	                callback.apply(context[el], [context[el], el,  index++]);
	        }
	    }
	
	    return context;
	};
	
	m4q.fn.extend({
	    each: function(callback){
	        [].forEach.call(this, function(el) {
	            callback.apply(el, arguments);
	        });
	
	        return this;
	    }
	});
	

	function acceptData(owner){
	    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	}
	
	function getData(data){
	    if (data === "true") return true;
	    if (data === "false") return false;
	    if (data === "null") return null;
	    if (data === +data + "") return +data;
	    if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(data)) return JSON.parse(data);
	    return data;
	}
	
	function dataAttr(elem, key, data){
	    var name;
	
	    if ( data === undefined && elem.nodeType === 1 ) {
	        name = "data-" + key.replace( /[A-Z]/g, "-$&" ).toLowerCase();
	        data = elem.getAttribute( name );
	
	        if ( typeof data === "string" ) {
	            try {
	                data = getData( data );
	            } catch ( e ) {}
	
	            dataSet.set( elem, key, data );
	        } else {
	            data = undefined;
	        }
	    }
	    return data;
	}
	
	var Data = function(ns){
	    this.expando = "DATASET:UID:" + ns.toUpperCase();
	    Data.uid++;
	};
	
	Data.uid = 1;
	
	Data.prototype = {
	    cache: function(owner){
	        var value = owner[this.expando];
	        if (!value) {
	            value = {};
	            if (acceptData(owner)) {
	                if (owner.nodeType) {
	                    owner[this.expando] = value;
	                } else {
	                    Object.defineProperty(owner, this.expando, {
	                        value: value,
	                        configurable: true
	                    });
	                }
	            }
	        }
	        return value;
	    },
	
	    set: function(owner, data, value){
	        var prop, cache = this.cache(owner);
	
	        if (typeof data === "string") {
	            cache[camelCase(data)] = value;
	        } else {
	            for (prop in data) {
	                if (data.hasOwnProperty(prop))
	                    cache[camelCase(prop)] = data[prop];
	            }
	        }
	        return cache;
	    },
	
	    get: function(owner, key){
	        return key === undefined ? this.cache(owner) : owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	    },
	
	    access: function(owner, key, value){
	        if (key === undefined || ((key && typeof key === "string") && value === undefined) ) {
	            return this.get(owner, key);
	        }
	        this.set(owner, key, value);
	        return value !== undefined ? value : key;
	    },
	
	    remove: function(owner, key){
	        var i, cache = owner[this.expando];
	        if (cache === undefined) {
	            return ;
	        }
	        if (key !== undefined) {
	            if ( Array.isArray( key ) ) {
	                key = key.map( camelCase );
	            } else {
	                key = camelCase( key );
	
	                key = key in cache ? [ key ] : ( key.match( /[^\x20\t\r\n\f]+/g ) || [] ); // ???
	            }
	
	            i = key.length;
	
	            while ( i-- ) {
	                delete cache[ key[ i ] ];
	            }
	        }
	        if ( key === undefined || isEmptyObject( cache ) ) {
	            if ( owner.nodeType ) {
	                owner[ this.expando ] = undefined;
	            } else {
	                delete owner[ this.expando ];
	            }
	        }
	        return true;
	    },
	
	    hasData: function(owner){
	        var cache = owner[ this.expando ];
	        return cache !== undefined && !isEmptyObject( cache );
	    }
	};
	
	var dataSet = new Data('Internal');
	
	m4q.extend({
	    Data: new Data('m4q'),
	
	    hasData: function(elem){
	        return dataSet.hasData(elem);
	    },
	
	    data: function(elem, name, data){
	        return dataSet.access(elem, name, data);
	    },
	
	    removeData: function(elem, name){
	        return dataSet.remove(elem, name);
	    }
	});
	
	m4q.fn.extend({
	    data: function(key, val){
	        var res, elem, data, attrs, name, i;
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        elem = this[0];
	
	        if ( key === undefined ) {
	            if ( this.length ) {
	                data = dataSet.get( elem );
	
	                if ( elem.nodeType === 1) {
	                    attrs = elem.attributes;
	                    i = attrs.length;
	                    while ( i-- ) {
	                        if ( attrs[ i ] ) {
	                            name = attrs[ i ].name;
	                            if ( name.indexOf( "data-" ) === 0 ) {
	                                name = camelCase( name.slice( 5 ) );
	                                dataAttr( elem, name, data[ name ] );
	                            }
	                        }
	                    }
	                }
	            }
	
	            return data;
	        }
	
	        if (val === undefined) {
	            res = dataSet.get(elem, key);
	            if (res === undefined) {
	                if ( elem.nodeType === 1) {
	                    if (elem.hasAttribute("data-"+key)) {
	                        res = elem.getAttribute("data-"+key);
	                    }
	                }
	            }
	            return res;
	        }
	
	        return this.each( function() {
	            dataSet.set( this, key, val );
	        } );
	    },
	
	    removeData: function( key ) {
	        return this.each( function() {
	            dataSet.remove( this, key );
	        } );
	    }
	});

	m4q.extend({
	    merge: function( first, second ) {
	        var len = +second.length,
	            j = 0,
	            i = first.length;
	
	        for ( ; j < len; j++ ) {
	            first[ i++ ] = second[ j ];
	        }
	
	        first.length = i;
	
	        return first;
	    },
	
	    type: function(obj){
	        return Object.prototype.toString.call(obj).replace(/^\[object (.+)]$/, '$1').toLowerCase();
	    },
	
	    camelCase: function(string){return camelCase(string);},
	    isPlainObject: function(obj){return isPlainObject(obj);},
	    isEmptyObject: function(obj){return isEmptyObject(obj);},
	    isArrayLike: function(obj){return isArrayLike(obj);},
	    acceptData: function(owner){return acceptData(owner);},
	
	    dataSet: function(ns){
	        if (['INTERNAL', 'M4Q'].indexOf(ns.toUpperCase()) > -1) {
	            throw Error("You can not use reserved name for your dataset");
	        }
	        return new Data(ns);
	    }
	});
	
	

	var overriddenStop =  Event.prototype.stopPropagation;
	Event.prototype.stopPropagation = function(){
	    this.isPropagationStopped = true;
	    overriddenStop.apply(this, arguments);
	};
	
	Event.prototype.stop = function(immediate){
	    return immediate ? this.stopImmediatePropagation() : this.stopPropagation();
	};
	
	m4q.extend({
	    events: [],
	    eventHook: {},
	
	    setEventHandler: function(el, eventName, handler, selector, ns){
	        var i, freeIndex = -1, eventObj, resultIndex;
	        if (this.events.length > 0) {
	            for(i = 0; i < this.events.length; i++) {
	                if (this.events[i].handler === null) {
	                    freeIndex = i;
	                    break;
	                }
	            }
	        }
	
	        eventObj = {
	            element: el,
	            eventName: eventName,
	            handler: handler,
	            selector: selector,
	            ns: ns
	        };
	
	        if (freeIndex === -1) {
	            this.events.push(eventObj);
	            resultIndex = this.events.length - 1;
	        } else {
	            this.events[freeIndex] = eventObj;
	            resultIndex = freeIndex;
	        }
	
	        return resultIndex;
	    },
	
	    getEventHandler: function(index){
	        if (this.events[index] !== undefined && this.events[index] !== null) {
	            this.events[index] = null;
	            return this.events[index].handler;
	        }
	        return undefined;
	    },
	
	    off: function(){
	        m4q.each(this.events, function(e){
	            e.element.removeEventListener(e.eventName, e.handler);
	        });
	        this.events = [];
	        return this;
	    },
	
	    getEvents: function(){
	        return this.events;
	    },
	
	    addEventHook: function(event, handler){},
	    removeEventHook: function(event, index){},
	    removeEventHooks: function(event){},
	    clearEventHooks: function(){}
	});
	
	m4q.fn.extend({
	    on: function(event, selector, handler, ns, options){
	        if (this.length === 0) {
	            return;
	        }
	
	        if (typeof selector === "function") {
	            handler = selector;
	            selector = undefined;
	            ns = handler;
	            options = ns;
	        }
	
	        options = isPlainObject(options) ? options : {};
	
	        var events = event.split(" ").map(function(ev){
	            return  ev.indexOf(".") > -1 ? ev.substr(0, ev.indexOf(".")) : ev;
	        });
	
	        var eventOptions = {
	            once: options.once && options.once === true
	        };
	
	        return this.each(function(el){
	            m4q.each(events, function(eventName){
	
	                if (!selector) {
	                    el.addEventListener(eventName, handler, eventOptions);
	                    m4q(el).origin('event.'+eventName, m4q.setEventHandler(el, eventName, handler, selector));
	                } else {
	                    var _handler = function(e){
	                        var target = e.target;
	
	                        while (target && target !== el) {
	                            if (matches.call(target, selector)) {
	                                handler.call(target, e);
	                                if (e.isPropagationStopped) {
	                                    e.stop(true);
	                                }
	                            }
	                            target = target.parentNode;
	                        }
	                    };
	                    el.addEventListener(eventName, _handler, eventOptions);
	                    m4q(el).origin('event.'+eventName+":"+selector, m4q.setEventHandler(el, eventName, _handler, selector));
	                }
	            });
	        });
	    },
	
	    one: function(event, selector, handler, ns){
	        return this.on(event, selector, handler, ns,{once: true})
	    },
	
	    off: function(eventName, selector){
	        if (this.length === 0) {
	            return;
	        }
	
	        if (eventName === undefined || eventName === null) {
	            return ;
	        }
	
	        if (eventName.toLowerCase() === 'all') {
	            return this.each(function(el){
	                m4q.each(m4q.events, function(e){
	                    if (e.element === el) {
	                        el.removeEventListener(e.eventName, e.handler);
	                        e.handler = null;
	                        m4q(el).origin('event.'+e.eventName+":"+e.selector, null);
	                    }
	                })
	            });
	        }
	
	        var events = eventName.split(" ").map(function(ev){
	            return  ev.indexOf(".") > -1 ? ev.substr(0, ev.indexOf(".")) : ev;
	        });
	
	        return this.each(function(el){
	            m4q.each(events, function(event){
	                var eventKey = 'event.'+event+(selector ? ":"+selector : "");
	                var eventIndex = m4q(el).origin(eventKey);
	                el.removeEventListener(event, m4q.events[eventIndex].handler);
	                m4q.events[eventIndex].handler = null;
	                m4q(el).origin(eventKey, null);
	            });
	        });
	    },
	
	    trigger: function(name, data){
	        var e;
	        if (this.length === 0) {
	            return ;
	        }
	        e = new CustomEvent(name, data || {});
	        this.each(function(el){
	            el.dispatchEvent(e);
	        });
	        return this;
	    }
	});
	
	( "blur focus resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu load" )
	    .split( " " )
	    .forEach(
	    function( name ) {
	        m4q.fn[ name ] = function( data, fn ) {
	            return arguments.length > 0 ?
	                this.on( name, data, fn ) :
	                this.trigger( name );
	        };
	});
	
	m4q.fn.extend( {
	    hover: function( fnOver, fnOut ) {
	        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	    }
	});
	
	m4q.ready = function(fn){
	    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
	        fn();
	    } else {
	        document.addEventListener('DOMContentLoaded', fn);
	    }
	};
	

	m4q.fn.extend({
	    html: function(value){
	        return this._property('innerHTML', value);
	    },
	
	    outerHTML: function(){
	        return this._property('outerHTML');
	    },
	
	    text: function(value){
	        return this._property('textContent', value);
	    },
	
	    innerText: function(value){
	        return this._property('innerText', value);
	    },
	
	    empty: function(){
	        if (this.length === 0) {
	            return ;
	        }
	
	        this.each(function(el){
	            el.innerHTML = "";
	        });
	
	        return this;
	    }
	});
	
	

	m4q.ajax = function(params){
	    var xhr = new XMLHttpRequest();
	
	    xhr.onload = function(){
	        if (xhr.status >= 200 && xhr.status < 300) {
	            if (typeof params.success === "function")
	                params.success(params.parseJson ? JSON.parse(xhr.response) : xhr.response, xhr.status, xhr.statusText, xhr);
	        } else {
	            if (typeof params.error === "function")
	                params.error(xhr.status, xhr.statusText, xhr);
	        }
	    };
	
	    xhr.onerror = function(){
	        if (typeof params.error === "function")
	            params.error(xhr.status, xhr.statusText, xhr);
	    };
	
	    if (params.headers) {
	        m4q.each(function(name, value){
	            xhr.setRequestHeader(name, value);
	        });
	    }
	
	    xhr.open(params.method || 'GET', params.url, true);
	    xhr.send(params.data);
	};
	
	['get', 'post', 'put', 'patch', 'delete'].forEach(function(method){
	    m4q[method] = function(url, data, success, error, dataType, headers){
	        return m4q.ajax({
	            method: method.toUpperCase(),
	            url: url,
	            data: data,
	            success: success,
	            error: error,
	            dataType: dataType,
	            headers: headers,
	            parseJson: method === 'json'
	        });
	    }
	});
	

	m4q.fn.extend({
	    style: function(name){
	        if (this.length === 0) {
	            return ;
	        }
	        var el = this[0];
	        if (arguments.length === 0 || name === undefined) {
	            return el.style ? el.style : getComputedStyle(el, null);
	        } else {
	            return el.style[name] ? el.style[name] : getComputedStyle(el, null)[name];
	        }
	    },
	
	    css: function(o, v){
	        if (this.length === 0) {
	            return ;
	        }
	
	        var el = this[0];
	
	        if (typeof o === "string" && v === undefined) {
	            return  el.style[o] ? el.style[o] : getComputedStyle(el, null)[o];
	        }
	
	        this.each(function(el){
	            if (typeof o === "object") {
	                for (var key in o) {
	                    el.style[key] = o[key];
	                }
	            } else if (typeof o === "string") {
	                el.style[o] = v;
	            }
	        });
	
	        return this;
	    },
	
	    scrollTop: function(val){
	        if (not(val)) {
	            return this[0] ? this[0].scrollTop : undefined;
	        }
	        return this.each(function(el){
	            el.scrollTop = val;
	        })
	    },
	
	    scrollLeft: function(val){
	        if (not(val)) {
	            return this[0] ? this[0].scrollTop : undefined;
	        }
	        return this.each(function(el){
	            el.scrollLeft = val;
	        })
	    }
	});
	
	

	m4q.fn.extend({
	    addClass: function(){},
	    removeClass: function(){},
	    toggleClass: function(){},
	
	    containsClass: function(className){
	        return this.hasClass(className);
	    },
	
	    hasClass: function(className){
	        var result = false;
	
	        this.each(function(el){
	            if (el.classList.contains(className)) {
	                result = true;
	            }
	        });
	
	        return result;
	    },
	
	    clearClasses: function(){
	        return this.each(function(){
	            this.className = "";
	        });
	    }
	});
	
	['add', 'remove', 'toggle'].forEach(function (method) {
	    m4q.fn[method + "Class"] = function(cls){
	        if (!cls || (""+cls).trim() === "") return this;
	        return this.each(function(el){
	            m4q.each(cls.split(" ").filter(function(v){
	                return (""+v).trim() !== "";
	            }), function(className){
	                el.classList[method](className);
	            });
	        });
	    }
	});
	

	// TODO add scripts support
	m4q.parseHTML = function(data, context){
	    var base, singleTag, result = [], ctx, _context;
	
	    if (typeof data !== "string") {
	        return [];
	    }
	
	    data = data.trim();
	
	    if (!context) {
	        ctx = document.implementation.createHTMLDocument("");
	        base = ctx.createElement( "base" );
	        base.href = document.location.href;
	        ctx.head.appendChild( base );
	        _context = ctx.body;
	    } else {
	        if (!isPlainObject(context)) {
	            _context = context;
	        } else {
	            _context = document;
	        }
	    }
	
	    singleTag = regexpSingleTag.exec(data);
	
	    if (singleTag) {
	        result.push(document.createElement(singleTag[1]));
	    } else {
	        _context.innerHTML = data;
	        for(var i = 0; i < _context.childNodes.length; i++) {
	            result.push(_context.childNodes[i]);
	        }
	    }
	
	    if (context && isPlainObject(context)) {
	        m4q.each(result,function(el){
	            for(var name in context) {
	                if (context.hasOwnProperty(name))
	                    el.setAttribute(name, context[name]);
	            }
	        });
	    }
	
	    return result;
	};
	

	m4q.fn.extend({
	    _size: function(property, value, unit){
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (value === undefined) {
	            return this[0][property];
	        }
	
	        if (!unit) {
	            unit = 'px';
	        }
	
	        this[0].style[property ===  'clientHeight' ? 'height' : 'width'] = parseInt(value)+unit;
	
	        return this;
	    },
	
	    height: function(value, unit){
	        return this._size.call(this, 'clientHeight', value, unit);
	    },
	
	    width: function(value, unit){
	        return this._size.call(this, 'clientWidth', value, unit);
	    },
	
	    outerWidth: function(){
	        var el, size, style, result, value, unit = "px";
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (arguments.length > 0) {
	            value = arguments[0];
	        }
	
	        if (value !== undefined && typeof value !== "boolean") {
	            if (arguments[1]) {
	                unit = arguments[1];
	            }
	            return this.width(value, unit);
	        }
	
	        el = this[0];
	        size = el.offsetWidth;
	        style = getComputedStyle(el);
	        result = size + parseInt(style.marginLeft) + parseInt(style.marginRight);
	        return value === true ? result : size;
	    },
	
	    outerHeight: function(){
	        var el, size, style, result, value, unit = "px";
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (arguments.length > 0) {
	            value = arguments[0];
	        }
	
	        if (value !== undefined && typeof value !== "boolean") {
	            if (arguments[1]) {
	                unit = arguments[1];
	            }
	            return this.height(value, unit);
	        }
	
	        el = this[0];
	        size = el.offsetHeight;
	        style = getComputedStyle(el);
	        result = size + parseInt(style.marginTop) + parseInt(style.marginBottom);
	        return value === true ? result : size;
	    }
	});

	m4q.fn.extend({
	    offset: function(){
	        var rect;
	        if (this.length === 0) {
	            return ;
	        }
	        if (arguments.length === 0) {
	            rect = this[0].getBoundingClientRect();
	            return {
	                top: rect.top + document.body.scrollTop,
	                left: rect.left + document.body.scrollLeft
	            }
	        }
	        return this;
	    },
	
	    position: function(){
	        return this.length === 0 ? undefined : {
	            left: this[0].offsetLeft,
	            top: this[0].offsetTop
	        }
	    }
	});

	m4q.fn.extend({
	    filter: function(filterFunc){
	        return [].filter.call(this, filterFunc);
	    },
	
	    find: function(selector){
	        var res = [], out = m4q();
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        this.each(function(el){
	            if (el.nodeType === 1) res = [].slice.call(el.querySelectorAll(selector));
	        });
	        return m4q.merge(out, res);
	    },
	
	    children: function(selector){
	        var i, result = [], out = m4q();
	        this.each(function(el){
	            for(i = 0; i < el.children.length; i++) {
	                if (el.children[i].nodeType === 1)
	                    result.push(el.children[i]);
	            }
	        });
	        result = selector ? result.filter(function(el){
	            return matches.call(el, selector);
	        }) : result;
	        return m4q.merge(out, result);
	    },
	
	    parent: function(selector){
	        var result = [], out = m4q();
	        if (this.length === 0) {
	            return;
	        }
	        this.each(function(el){
	            if (el.parentNode) {
	                result.push(el.parentNode);
	            }
	        });
	        result = selector ? result.filter(function(el){
	            return matches.call(el, selector);
	        }) : result;
	        return m4q.merge(out, result);
	    },
	
	    siblings: function(selector){
	        var out = m4q();
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        out = m4q();
	
	        this.each(function(el){
	            var elements = [].filter.call(el.parentNode.children, function(child){
	                return child !== el && (selector ? matches.call(child, selector) : true);
	            });
	
	            elements.forEach(function(el){
	                m4q.merge(out, m4q(el));
	            })
	        });
	        return out;
	    },
	
	    _siblings: function(direction, selector){
	        var out = m4q();
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        out = m4q();
	
	        this.each(function(el){
	            while (el) {
	                el = el[direction];
	                if (!el) break;
	                if (!selector) {
	                    m4q.merge(out, m4q(el));
	                } else {
	                    if (matches.call(el, selector)) {
	                        m4q.merge(out, m4q(el));
	                    }
	                }
	            }
	        });
	        return out;
	    },
	
	    prev: function(selector){
	        return this._siblings('previousElementSibling', selector);
	    },
	
	    next: function(selector){
	        return this._siblings('nextElementSibling', selector);
	    },
	
	    closest: function(selector){
	        var out = m4q();
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (!selector) {
	            return this.parent(selector);
	        }
	
	        out = m4q();
	
	        this.each(function(el){
	            while (el) {
	                el = el.parentElement;
	                if (!el) break;
	                if (matches.call(el, selector)) {
	                    m4q.merge(out, m4q(el));
	                    return ;
	                }
	            }
	        });
	
	        return out;
	    }
	});

	m4q.fn.extend({
	    attr: function(name, value){
	        var attributes = {};
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (arguments.length === 0) {
	            m4q.each(this[0].attributes, function(a){
	                attributes[a.nodeName] = a.nodeValue;
	            });
	            return attributes;
	        }
	
	        if (name === undefined) {
	            return undefined;
	        }
	        if (name === null) {
	            return null;
	        }
	
	        if (name && !isPlainObject(name) && value === undefined) {
	            return this[0].nodeType === 1 && this[0].hasAttribute(name) ? this[0].getAttribute(name) : undefined;
	        }
	
	        if (isPlainObject(name)) {
	            this.each(function(el){
	                for (var key in name) {
	                    if (name.hasOwnProperty(key))
	                        el.setAttribute(key, name[key]);
	                }
	            });
	        } else {
	            this.each(function(el){
	                el.setAttribute(name, value);
	            });
	        }
	
	        return this;
	    },
	
	    removeAttr: function(name){
	        if (this.length === 0) {
	            return ;
	        }
	        this.each(function(el){
	            if (el.hasAttribute(name)) el.removeAttribute(name);
	        });
	
	        return this;
	    },
	
	    toggleAttr: function(name, value){
	        if (this.length === 0) {
	            return ;
	        }
	        this.each(function(el){
	            if (value && !el.hasAttribute(name) || !el.getAttribute(name)) {
	                el.setAttribute(name, value);
	            } else {
	                el.removeAttribute(name);
	            }
	        });
	        return this;
	    }
	});

	m4q.extend({
	    proxy: function(fn, context){
	        if (typeof fn !== "function") {
	            return ;
	        }
	        if (context === undefined || context === null) {
	            context = this;
	        }
	        return fn.bind(context);
	    }
	});
	

	// Polyfills for IE11
	(function (arr) {
	    arr.forEach(function (item) {
	        if (item.hasOwnProperty('append')) {
	            return;
	        }
	        Object.defineProperty(item, 'append', {
	            configurable: true,
	            enumerable: true,
	            writable: true,
	            value: function append() {
	                var argArr = Array.prototype.slice.call(arguments),
	                    docFrag = document.createDocumentFragment();
	
	                argArr.forEach(function (argItem) {
	                    var isNode = argItem instanceof Node;
	                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
	                });
	
	                this.appendChild(docFrag);
	            }
	        });
	    });
	})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
	
	(function (arr) {
	    arr.forEach(function (item) {
	        if (item.hasOwnProperty('prepend')) {
	            return;
	        }
	        Object.defineProperty(item, 'prepend', {
	            configurable: true,
	            enumerable: true,
	            writable: true,
	            value: function prepend() {
	                var argArr = Array.prototype.slice.call(arguments),
	                    docFrag = document.createDocumentFragment();
	
	                argArr.forEach(function (argItem) {
	                    var isNode = argItem instanceof Node;
	                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
	                });
	
	                this.insertBefore(docFrag, this.firstChild);
	            }
	        });
	    });
	})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
	
	m4q.fn.extend({
	    append: function(elements){
	        if (typeof elements === "string") {
	            elements = m4q.parseHTML(elements);
	        }
	        return this.each(function(el, elIndex){
	            m4q.each(elements, function(child){
	                el.append(elIndex === 0 ? child : child.cloneNode(true));
	            });
	        })
	    },
	
	    appendTo: function(elements){
	        if (typeof elements === "string") {
	            elements = m4q.parseHTML(elements);
	        }
	        return this.each(function(el){
	            m4q.each(elements, function(parent, parIndex){
	                parent.append(parIndex === 0 ? el : el.cloneNode(true));
	            });
	        })
	    },
	
	    prepend: function(elements){
	        if (typeof elements === "string") {
	            elements = m4q.parseHTML(elements);
	        }
	        return this.each(function (el, elIndex) {
	            m4q.each(elements, function(child){
	                el.prepend(elIndex === 0 ? child : child.cloneNode(true))
	            });
	        })
	    },
	
	    prependTo: function(elements){
	        if (typeof elements === "string") {
	            elements = m4q.parseHTML(elements);
	        }
	        return this.each(function(el){
	            m4q.each(elements, function(parent, parIndex){
	                $(parent).prepend(parIndex === 0 ? el : el.cloneNode(true));
	            })
	        })
	    },
	
	    insertBefore: function(elements){
	        if (typeof elements === "string") {
	            elements = m4q.parseHTML(elements);
	        }
	        return this.each(function(el){
	            m4q.each(elements, function(element, elIndex){
	                element.parentNode.insertBefore(elIndex === 0 ? el : el.cloneNode(true), element);
	            });
	        })
	    },
	
	    insertAfter: function(elements){
	        if (typeof elements === "string") {
	            elements = m4q.parseHTML(elements);
	        }
	        return this.each(function(el){
	            m4q.each(elements, function(element, elIndex){
	                element.parentNode.insertBefore(elIndex === 0 ? el : el.cloneNode(true), element.nextSibling);
	            });
	        });
	    },
	
	    after: function(html){
	        return this.each(function(el){
	            el.insertAdjacentHTML('afterend', html);
	        })
	    },
	
	    before: function(html){
	        return this.each(function(el){
	            el.insertAdjacentHTML('beforebegin', html);
	        })
	    },
	
	    clone: function(){
	        var res = [], out = m4q();
	        this.each(function(el){
	            res.push(el.cloneNode(true));
	        });
	        return m4q.merge(out, res);
	    },
	
	    remove: function(selector){
	        var i = 0, node, out = [];
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        for ( ; ( node = this[ i ] ) != null; i++ ) {
	            if (node.parentNode) {
	                out.push(node.parentNode.removeChild(node));
	            }
	        }
	
	        return selector ? out.filter(function(el){
	            return matches.call(el, selector);
	        }) : out;
	    }
	});

	m4q.extend({
	    easing: {
	        linear: function (t) { return t },
	        swing: function(t) { return 0.5 - Math.cos( t * Math.PI ) / 2; },
	
	        easeIn: function(t){return function(t){return Math.pow(t, 3)}},
	        easeOut: function(t){return function(t){return 1 - Math.abs(Math.pow(t-1, 3))}},
	        easeInOut: function(t){return function(t){return t<.5 ? this.easeIn(3)(t*2)/2 :this.easeOut(3)(t*2 - 1)/2+0.5}},
	
	        easeInQuad: function (t) { return t*t },
	        easeOutQuad: function (t) { return t*(2-t) },
	        easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
	
	        easeInCubic: function (t) { return t*t*t },
	        easeOutCubic: function (t) { return (--t)*t*t+1 },
	        easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
	
	        easeInQuart: function (t) { return t*t*t*t },
	        easeOutQuart: function (t) { return 1-(--t)*t*t*t },
	        easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
	
	        easeInQuint: function (t) { return t*t*t*t*t },
	        easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
	        easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
	
	        easeInElastic: function (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 },
	        easeOutElastic: function (t) { return .04 * t / (--t) * Math.sin(25 * t) },
	        easeInOutElastic: function (t) { return (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 },
	
	        easeInSin: function (t) {return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);},
	        easeOutSin : function (t) {return Math.sin(Math.PI / 2 * t);},
	        easeInOutSin: function (t) {return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;}
	    },
	
	    animate: function(el, draw, duration, timing, callback){
	        var $el = m4q(el), start = performance.now();
	
	        duration = duration || 100;
	        timing = timing || this.easing.linear;
	
	        $el.origin("animation", requestAnimationFrame(function animate(time) {
	            var t = (time - start) / duration;
	            if (t > 1) t = 1;
	            var progress = typeof timing === "string" ? m4q.easing[timing](t) : timing(t);
	
	            m4q.proxy(draw, $el[0])(progress);
	
	            if (t === 1 && typeof callback === "function") {
	                callback.call(el, arguments);
	            }
	            if (t < 1) {
	                $el.origin("animation", requestAnimationFrame(animate));
	            }
	        }));
	        return this;
	    },
	
	    stop: function(el){
	        cancelAnimationFrame(m4q(el).origin("animation"))
	    }
	});
	
	m4q.fn.extend({
	    animate: function (draw, duration, timing, callback) {
	        return this.each(function(el){
	            return m4q.animate(el, draw, duration, timing, callback);
	        })
	    },
	
	    stop: function(){
	        return this.each(function(el){
	            return m4q.stop(el);
	        })
	    }
	});
	
	

	m4q.extend({
	    hide: function(el, callback){
	        var $el = m4q(el);
	        if (!!el.style.display) {
	            $el.origin('display', (el.style.display ? el.style.display : getComputedStyle(el, null)['display']));
	        }
	        el.style.display = 'none';
	        if (typeof callback === "function") callback.call(el, arguments);
	        return this;
	    },
	
	    show: function(el, callback){
	        var display = m4q(el).origin('display', undefined, "block");
	        el.style.display = display ? display : '';
	        if (typeof callback === "function") callback.call(el, arguments);
	        return this;
	    },
	
	    visible: function(el, mode, callback){
	        if (mode === undefined) {
	            mode = true;
	        }
	        el.style.visibility = mode ? 'visible' : 'hidden';
	        if (typeof callback === "function") callback.call(el, arguments);
	    },
	
	    fadeIn: function(el, duration, easing, callback){
	        var $el = m4q(el);
	
	        if (not(duration) && not(easing) && not(callback)) {
	            callback = null;
	            duration = 1000;
	        } else
	        if (typeof duration === "function") {
	            callback = duration;
	            duration = 1000;
	        }
	
	        el.style.opacity = 0;
	        el.style.display = $el.origin("display", undefined, 'block');
	
	        return this.animate(el, function(progress){
	            el.style.opacity = progress;
	        }, duration, easing, callback);
	    },
	
	    fadeOut: function(el, duration, easing, callback){
	        var $el = m4q(el);
	
	        if (not(duration) && not(easing) && not(callback)) {
	            callback = null;
	            duration = 1000;
	        } else
	        if (typeof duration === "function") {
	            callback = duration;
	            duration = 1000;
	        }
	
	        el.style.opacity = 1;
	
	        return this.animate(el, function(progress){
	            el.style.opacity = 1 - progress;
	            if (progress === 1) {
	                $el.origin("display", m4q(el).style('display'));
	                el.style.display = 'none';
	            }
	        }, duration, easing, callback);
	    },
	
	    slideDown: function(el, dur, easing, cb) {
	        var $el = m4q(el);
	        var targetHeight;
	
	        if (not(dur) && not(easing) && not(cb)) {
	            cb = null;
	            dur = 100;
	        } else
	        if (typeof dur === "function") {
	            cb = dur;
	            dur = 100;
	        }
	
	        $el.show().visible(false);
	        targetHeight = $el.origin("height", undefined, $el.height());
	        $el.height(0).visible(true);
	
	        $el.css({
	            overflow: "hidden",
	            display: "block" //TODO not only block element
	        });
	
	        return this.animate(el, function(progress){
	            el.style.height = (targetHeight * progress) + "px";
	            if (progress === 1) {
	                $el.css({
	                    overflow: "",
	                    height: "",
	                    visibility: ""
	                })
	            }
	        }, dur, easing, cb);
	    },
	
	    slideUp: function(el, duration, easing, callback) {
	        var $el = m4q(el);
	        var currHeight;
	
	        if ($el.height() === 0) {
	            return ;
	        }
	
	        if (not(duration) && not(easing) && not(callback)) {
	            callback = null;
	            duration = 100;
	        } else
	        if (typeof duration === "function") {
	            callback = duration;
	            duration = 100;
	        }
	
	        currHeight = $el.height();
	        $el.origin("height", currHeight);
	
	        $el.css({
	            overflow: "hidden"
	        });
	
	        return this.animate(el, function(progress){
	            el.style.height = (1 - progress) * currHeight + 'px';
	            if (progress === 1) {
	                $el.hide().css({
	                    overflow: "",
	                    height: ""
	                });
	            }
	        }, duration, easing, callback);
	    }
	});
	
	m4q.fn.extend({
	    hide: function(callback){
	        return this.each(function(el){
	            m4q.hide(el, callback);
	        });
	    },
	
	    show: function(callback){
	        return this.each(function(el){
	            m4q.show(el, callback);
	        });
	    },
	
	    visible: function(mode, callback){
	        return this.each(function(el){
	            m4q.visible(el, mode, callback);
	        });
	    },
	
	    fadeIn: function(duration, easing, callback){
	        return this.each(function(el){
	            m4q.fadeIn(el, duration, easing, callback);
	        })
	    },
	
	    fadeOut: function(duration, easing, callback){
	        return this.each(function(el){
	            m4q.fadeOut(el, duration, easing, callback);
	        })
	    },
	
	    slideUp: function(duration, easing, callback){
	        return this.each(function(el){
	            m4q.slideUp(el, duration, easing, callback);
	        })
	    },
	
	    slideDown: function(duration, easing, callback){
	        return this.each(function(el){
	            m4q.slideDown(el, duration, easing, callback);
	        })
	    }
	});
	
	

	m4q.init = function(selector, context){
	    var parsed;
	
	    if (!selector) {
	        return this;
	    }
	
	    if (selector === "document") {
	        selector = document;
	    }
	
	    if (selector === "body") {
	        selector = document.body;
	    }
	
	    if (selector.nodeType || selector === window) {
	        this[0] = selector;
	        this.length = 1;
	        return this;
	    }
	
	    if (selector instanceof m4q) {
	        return selector;
	    }
	
	    if (typeof selector === "string") {
	
	        selector = selector.trim();
	
	        if (selector === "#" || selector === ".") {
	            throw new Error("Selector can't be # or .") ;
	        }
	
	        parsed = m4q.parseHTML(selector, context);
	
	        if (parsed.length === 1 && parsed[0].nodeType === 3) { // Must be a text node -> css selector
	            [].push.apply(this, document.querySelectorAll(selector));
	        } else {
	            m4q.merge(this, parsed);
	        }
	    }
	
	    return this;
	};
	
	m4q.init.prototype = m4q.fn;
	
if (!noGlobal) {
	    window.m4q = window.$M = window.$ = m4q;
	}
	
	var _$ = window.$, _$M = window.$M;
	
	m4q.noConflict = function() {
	    if ( window.$ === m4q ) {window.$ = _$;}
	    if ( window.$M === m4q ) {window.$M = _$M;}
	    return m4q;
	};
	return m4q; 
});
