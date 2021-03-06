document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function showDownloadPanel(index) {
    var info = $('#download-panel'),
        item = data.offers[index];
    $('img', info).src = data.serv + item.icon;
    $('.success', info).innerHTML = item.success;
    info.className = 'animated slideDown';
    if ('timeout' in info) {
      clearTimeout(info.timeout);
    }
    info.timeout = setTimeout(hideDownloadPanel, 4000);
  }
  function hideDownloadPanel() {
    var info = $('#download-panel');
    clearTimeout(info.timeout);

    info.className = 'animated slideUp';
  }
  function checkURL(url) {
    var lastPage = $.Panel.visiblePages[$.Panel.visiblePages.length - 1];
    if (lastPage && url === lastPage.id) {
      $.Panel.visiblePages.pop().slideOut();
    }
  }
  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode;
  }

  // 取页面高度
  $.viewportHeight = document.documentElement.clientHeight - 60;

  var detail = new $.DetailPanel('#detail'),
      list = new $.ListPanel({
        wrapper: '#list-wrapper',
        detail: detail
      }),
      help = new $.HelpPanel('#help'),
      hasHashchange = 'onhashchange' in window,
      lastURL = '';
  $.detect3DSupport(list.$el);

  var touch = {};
  $('header').addEventListener('touchstart', function (event) {
    touch.el = parentIfText(event.touches[0].target);
    touch.x = event.touches[0].pageX;
    touch.y = event.touches[0].pageY;
    touch.last = Date.now();
    event.preventDefault();
  }, false);
  $('header').addEventListener('touchend', function (event) {
    if (Date.now() - touch.last > 200) {
      return;
    }
    if (event.touches.length > 0) {
      var t = event.touches[0];
      if (touch.el !== t.target || Math.abs(touch.x - t.pageX) > 6 || Math.abs(touch.y - t.pageY) > 6) {
        return;
      }
    }

    setTimeout(function () {
      var evt = document.createEvent('Event');
      evt.initEvent('tap', true, true);
      touch.el.dispatchEvent(evt);
      touch = {};
    }, 0);
  }, false);
  document.addEventListener('tap', function (event) {
    var target = event.target;
    if ($.hasClass(target, 'help-button')) {
      help.slideIn();
    }
    if ($.hasClass(target, 'back-button')) {
      if ($.Panel.visiblePages.length > 0) {
        if (hasHashchange) {
          history.back();
        } else {
          $.Panel.visiblePages.pop().slideOut();
        }
      } else {
        location.href = 'dianjoy:return';
      }
    }
    if ($.isDownloadButton(target)) {
      target = $.hasClass(target, 'download-button') ? target : target.parentNode;
      setTimeout(function () {
        showDownloadPanel(target.index);
      }, 400);
    }
  }, false);

  // 调试环境下，从页面中取模版
  if (DEBUG) {
    Handlebars.templates = Handlebars.templates || {};
    var template = $('script', list.$el).innerHTML;
    Handlebars.templates.list = Handlebars.compile(template);

    template = $('script', detail.wrapper).innerHTML;
    Handlebars.templates.detail = Handlebars.compile(template);
  }

  // for route
  document.addEventListener('webkitAnimationEnd', function (event) {
    if (event.animationName === 'slideIn') {
      location.hash = '#/' + event.target.id;
    } else if (event.animationName === 'slideUp') {
      event.target.className = 'hide';
    } else if (event.animationName === 'slideDown') {
      event.target.className = 'in';
    }
  }, false);

  if (hasHashchange) {
    window.addEventListener('hashchange', function () {
      checkURL(lastURL);
      lastURL = location.hash.substr(2);

      $('.help-button').className = (lastURL === 'help' ? 'hide' : '') + ' help-button';
    }, false);
  }


  // 生成列表
  if (data && config.init) {
    $('#money').innerHTML = data.money;
    list.render(Handlebars.templates.list(data));
  } else {
    list.prepare();
  }
  if (config.refresh) {
    setTimeout(function () {
      list.refresh();
    }, 1000);
  }

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-35957679-7', 'dianjoy.com');
  ga('send', 'pageview');
});

document.addEventListener('dragstart', function (event) { event.preventDefault(); }, false);
document.addEventListener('touchmove', function (event) { event.preventDefault(); }, false);
// disabled click event for all <a>
document.addEventListener('click', function (event) {
  if (!/select|option/i.test(event.target.tagName) && !$.isDownloadButton(event.target)) {
    event.preventDefault();
    return false;
  }
}, false);
window.devicePixelRatio = window.devicePixelRatio || 1;