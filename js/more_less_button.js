/* ============================================================
 * more_less_button.js v1.0
 * ============================================================
 *
 * Information: This plugin create Read More\ Read Less button that expand or collapse certain blocks
 * Usage:
 *  $('#some-block', context).more_less_button();
 *      - Will create Read More button right after #some-block and collapse #some-block;
 *
 *  Options
 *  =======
 *  more
 *  $('#some-block', context).more_less_button({'more' : false});
 *      - if set to false, the button will be "Read Less" and #some-block will not be collapse.
 *  read_more / read_less
 *      - determine the text attached to the buttons
 *  collapsed_value
 *  $('#some-block', context).more_less_button({'collapsed_value' : '200px'});
 *      - If you want the #some-block to be partly collapsed, insert a value by pixels
 *  extended_value
 *  $('#some-block', context).more_less_button({'collapsed_value' : '200px', 'extended_value' : '400px'});
 *      - If you want the #some-block to partly extended, insert a value by pixels
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

;(function ( $, window, document, undefined ) {

    //default and plugin name
    var pluginName = "more_less_button",
        defaults = {
            'collapsed_value' : 'toggle', //Collapsed value, default to none
            'extended_value' : 'toggle', //Extended value, must be inserted if collapse value is present
            'more' : true, //we want to start at read more = true, want to start at read less = false
            'read_more' : 'Read More', //Read More text
            'read_less' : 'Read Less' //Read Less text
        };

    // plugin constructor
    function Plugin( element, options ) {
        this.element = $(element);
        this.options = $.extend( {}, defaults, options );
        //or double toggle, or nothing!
        if ( this.options.collapsed_value !== 'toggle' && this.options.extended_value === 'toggle') {
            this.options.extended_value = this.element.height();
        }

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    //all the Plugin methods. private are _privateMethods
    Plugin.prototype = {
        init: function() {
            var settings =  this.options;
            var $this = this.element;

            var more_class;
            if (settings.more === true) {
                more_class = 'more';
                settings.more = settings.read_more;
                if(settings.collapsed_value !== 'toggle') {
                    $this.css({'overflow' :'hidden','height': settings.collapsed_value});
                } else {
                    $this.css({'overflow' :'hidden', 'display' : 'none'});
                }
            } else {
                more_class = 'less';
                settings.more = settings.read_less;
            }
            var button = this.create_button($this, more_class, settings.more);

            var _this = this;
            button.bind("click", function() { _this.activate_more_less_button($(this) ,settings);});
        },

        activate_more_less_button: function(el, settings) {
            el = $(el);
            el.prev().css({'overflow' :'hidden'});
            if (el.hasClass('more')) {
                el.removeClass('more');
                el.text(settings.read_less);
                el.prev().animate({'height': settings.extended_value});

            } else {
                el.addClass('more');
                el.text(settings.read_more);
                el.prev().animate({'height': settings.collapsed_value});
            }
        },

        create_button: function(el, more_class, more_text) {
            var button = $('<button type="button" class="btn '+more_class+' moreLess">'+more_text+'</button>');
            button.insertAfter(el);
            return button;
        }
    };

    //Simple wrapper, no double instances here!

    $.fn[pluginName] = function ( options ) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            return this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
            });
        }
    }

})( jQuery, window, document );