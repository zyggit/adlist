/**
 * Created with JetBrains WebStorm.
 * User: Meathill
 * Date: 13-6-19
 * Time: 下午4:52
 * @overview 可以拖拽的面板基类
 * @author Meathill <lujia.zhai@dianjoy.com>
 * @since 0.1.0
 */
;(function () {
  'use strict';

  var Panel = $.Panel = function (options) {
    this.initialize(options);
  };
  Panel.visiblePages = [];

  Panel.prototype = {
    initialize: function (options) {
      if ($.isString(options)) {
        options = {
          wrapper: options
        };
      }
      this.wrapper = $(options.wrapper);

      this.id = this.wrapper.id;
    },
    getScrollType: function () {
      return {
        mouseWheel: false,
        tap: true
      };
    },
    render: function (code) {
      this.$el.innerHTML = code;
      this.prepare();
    },
    prepare: function () {
      this.wrapper.className = 'wrapper';
      if (this.scroll) {
        this.scroll.refresh();
      } else {
        this.scroll = new IScroll(this.wrapper, this.getScrollType());
      }
    },
    slideIn: function () {
      if (Panel.visiblePages.indexOf(this) !== -1) {
        return;
      }
      this.wrapper.className = 'wrapper animated slideIn';
      Panel.visiblePages.push(this);
    },
    slideOut: function () {
      this.wrapper.className = 'wrapper animated slideOut';
    },
    animationEndHandler: function (event) {
      this.className = event.animationName === 'slideOut' ? 'wrapper hide out' : 'wrapper in';
    }
  };
}());