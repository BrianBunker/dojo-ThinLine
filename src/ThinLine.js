define([
    'dojo/_base/declare',
    'dojo/_base/lang',

    'dojo/_base/fx',
    'dojo/fx',
    'dojo/aspect',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-construct',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'dojo/text!./ThinLine/templates/ThinLine.html',
    'xstyle/css!./ThinLine/css/ThinLine.css'
], function(
    declare, lang,
    baseFx, fx, aspect, dom, domStyle, domConstruct,
    _WidgetBase, _TemplatedMixin,
    template, css
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: 'ThinLine',
        duration: 500,
        color: 'rgba(66,136,204,1)',
        position: 'top',
        positionHash: {
            top: 'first',
            bottom: 'last'
        },
        postCreate: function() {
            this.inherited(arguments);
            domStyle.set(this.lineNode, 'background-color', this.color);
            domStyle.set(this.lineNode, '-webkit-box-shadow', '0px 0px 2px 0px ' + this.color);
            domStyle.set(this.lineNode, '-moz-box-shadow', '0px 0px 2px 0px ' + this.color);
            domStyle.set(this.lineNode, 'box-shadow', '0px 0px 2px 0px ' + this.color);
        },
        startup: function() {
            domConstruct.place(this.domNode, this.domNode.parentNode, this.positionHash[this.position]);
            this.inherited(arguments);
        },
        play: function() {
            this.endWidth = this.domNode.offsetWidth;
            fx.chain([
                this.sideWipeIn({
                    node: this.lineNode,
                    duration: this.duration
                }),
                baseFx.fadeOut({
                    node: this.lineNode,
                    onEnd: lang.hitch(this, function() {
                        domStyle.set(this.lineNode, 'width', '0');
                    })
                })
            ]).play();
        },

        sideWipeIn: function( /*Object*/ args) {
            var node = args.node = dom.byId(args.node),
                s = node.style;
                s.opacity = 1;

            var anim = baseFx.animateProperty(lang.mixin({
                properties: {
                    width: {
                        start: '1',
                        end: this.endWidth
                    }
                }
            }, args));

            var fini = function() {
                s.width = this.endWidth + 'px';
            };
            aspect.after(anim, "onStop", fini, true);
            aspect.after(anim, "onEnd", fini, true);

            return anim;
        }
    });
});