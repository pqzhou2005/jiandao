(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6bf55AlzQBEqZh/gQIuL3l2', 'game', __filename);
// scripts/game.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        toplabel: {
            default: null,
            type: cc.Label
        },
        readybtn: {
            default: null,
            type: cc.Button
        },
        card_jiandao: {
            default: null,
            type: cc.Node
        },
        card_bu: {
            default: null,
            type: cc.Node
        },
        card_shitou: {
            default: null,
            type: cc.Node
        },
        jiandao: {
            default: null,
            type: cc.Node
        },
        bu: {
            default: null,
            type: cc.Node
        },
        shitou: {
            default: null,
            type: cc.Node
        },
        countdown: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {

        this.lastrandom = 0;
        this.topready = this.bottomready = false;

        this.top_grid = [{ x: -200, y: 300, name: 'card_jiandao' }, { x: 0, y: 300, name: 'card_shitou' }, { x: 200, y: 300, name: 'card_bu' }];

        this.bottom_grid = [{ x: -200, y: -300, name: 'jiandao' }, { x: 0, y: -300, name: 'shitou' }, { x: 200, y: -300, name: 'bu' }];

        this.schedule(function () {
            this.swap();
        }, 0.3, 20, 1);
        this.scheduleOnce(function () {
            this.toplabel.string = '已准备';
            this.topready = true;

            this.node.emit('ready', 'top ready');
        }, 8);

        this.readybtn.node.on('click', function (event) {

            this.readybtn.node.getChildByName('btn_text').getComponent(cc.Label).string = '已准备';
            this.bottomready = true;

            this.node.emit('ready', 'bottom ready');
        }, this);

        this.node.on('ready', function (msg) {
            console.log(this.topready);
            console.log(this.bottomready);
            if (this.topready && this.bottomready) {
                console.log(this.countdown);
                var layout = this.node.getChildByName('Layout');
                var amin = layout.getComponent(cc.Animation);
                console.log(amin);
                return;
                anim.play('countdown');
            }
        }, this);

        this.shitou.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.bu.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.jiandao.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.shitou.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.bu.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.jiandao.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        // var anim = this.card_shitou.getComponent(cc.Animation);
        // anim.play('card_shitou');

        //anim.stop();
    },
    start: function start() {},


    onTouchMove: function onTouchMove(event) {
        var delta = event.touch.getDelta();
        if (Math.abs(event.currentTarget.x + delta.x) <= this.node.getChildByName('Layout').getContentSize().width / 2) {
            event.currentTarget.x += delta.x;
        }
    },

    onTouchEnd: function onTouchEnd(event) {

        var a_index = -1;
        var node_arr = [];
        for (var i = 0; i < this.bottom_grid.length; i++) {
            if (this.bottom_grid[i].name == event.currentTarget.name) {
                a_index = i;
            }
            node_arr[i] = this.node.getChildByName('Layout').getChildByName(this.bottom_grid[i].name);
        }

        var b_index = a_index;
        for (var i = 0; i < node_arr.length; i++) {
            if (i == a_index) continue;
            console.log(node_arr[i].x + "==" + node_arr[a_index].x);

            if (Math.abs(node_arr[i].x - node_arr[a_index].x) < 100) {
                b_index = i;
                break;
            }
        }

        console.log(a_index);
        console.log(b_index);

        var a = this.bottom_grid[a_index];
        var b = this.bottom_grid[b_index];

        var a_node = this.node.getChildByName('Layout').getChildByName(a.name);
        var b_node = this.node.getChildByName('Layout').getChildByName(b.name);

        if (a_index == b_index) {
            a_node.runAction(cc.moveTo(0.2, cc.v2(a.x, a.y)));
            return;
        }

        a_node.runAction(cc.moveTo(0.2, cc.v2(b.x, b.y)));
        b_node.runAction(cc.moveTo(0.2, cc.v2(a.x, a.y)));

        var tmp_name = this.bottom_grid[a_index].name;
        this.bottom_grid[a_index].name = this.bottom_grid[b_index].name;
        this.bottom_grid[b_index].name = tmp_name;
    },

    swap: function swap() {
        var swap = [[0, 1], [0, 2], [1, 2]];

        var random = this.random(0, 2);
        while (random == this.lastrandom) {
            random = this.random(0, 2);
        }
        this.lastrandom = random;

        var a_index = swap[random][0];
        var b_index = swap[random][1];

        var a = this.top_grid[a_index];
        var b = this.top_grid[b_index];

        var a_node = this.node.getChildByName('Layout').getChildByName(a.name);
        var b_node = this.node.getChildByName('Layout').getChildByName(b.name);

        a_node.runAction(cc.moveTo(0.2, cc.v2(b.x, b.y)));
        b_node.runAction(cc.moveTo(0.2, cc.v2(a.x, a.y)));

        var tmp_name = this.top_grid[a_index].name;
        this.top_grid[a_index].name = this.top_grid[b_index].name;
        this.top_grid[b_index].name = tmp_name;
    },

    random: function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // update (dt) {},
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=game.js.map
        