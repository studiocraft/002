/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Script = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages
        window.onload = function () {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        var windowElement = $('html');
        var bodyElement = $('body');
        var loaderOverlay = document.getElementById('loaderOverlay');
          if (loaderOverlay && loaderOverlay.parentNode && loaderOverlay.parentNode.nodeType === 1) {
            loaderOverlay.parentNode.removeChild(loaderOverlay);
            loaderOverlay = null;
            windowElement.removeClass('locked');
            bodyElement.addClass('animated fadeIn');
          }
        };
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
        $('#content').fullpage({
          //Navigation
          menu: '#header',
          lockAnchors: false,
          anchors:['home', 'sign-up'],
          navigation: false,
          navigationPosition: 'right',
          navigationTooltips: ['firstSlide', 'secondSlide'],
          showActiveTooltip: false,
          slidesNavigation: true,
          slidesNavPosition: 'bottom',

          //Scrolling
          css3: true,
          scrollingSpeed: 800,
          autoScrolling: true,
          fitToSection: true,
          fitToSectionDelay: 1000,
          scrollBar: false,
          easing: 'easeInOutCubic',
          easingcss3: 'ease',
          loopBottom: false,
          loopTop: false,
          loopHorizontal: true,
          continuousVertical: false,
          normalScrollElements: '',
          scrollOverflow: false,
          scrollOverflowOptions: null,
          touchSensitivity: 15,
          normalScrollElementTouchThreshold: 5,

          //Accessibility
          keyboardScrolling: true,
          animateAnchor: true,
          recordHistory: true,

          //Design
          controlArrows: true,
          verticalCentered: true,
          sectionsColor : ['transparent', 'transparent'],
          paddingTop: '0',
          paddingBottom: '0',
          fixedElements: '',
          responsiveWidth: 320,
          responsiveHeight: 568,

          //Custom selectors
          sectionSelector: '[data-page]',
          slideSelector: '[data-slide]',

          //events
          onLeave: function(index, nextIndex, direction) {
            if(index <= 2 || direction == 'down') {
              $('h1.title').addClass('animated slideInDown');
              $('hr.divider').addClass('animated slideInLeft');
            }
          },
          afterLoad: function(anchorLink, index){
            if(index == 1) {
              $('[data-anchor="'+ anchorLink +'"] h1.title').addClass('animated slideInDown');
              $('[data-anchor="'+ anchorLink +'"] hr.divider').addClass('animated slideInLeft');
            }
          },
          afterRender: function() {},
          afterResize: function() {},
          afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
          onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
        });

        $("#mc-embedded-subscribe-form").submit(function(e) {
          e.preventDefault();
          $.ajax({
            type: 'GET',
            url:  $(this).attr('action'),
            data: $(this).serialize(),
            cache: false,
            dataType: "jsonp",
            jsonp: "c",
            contentType: "application/json; charset=utf-8",
            success: function(data){
              if (data.result != "success") {
                $("#mc_response").addClass('animated fadeIn').html('<p>' + data.msg + '</p>');
              } else {
                $("#mc_response").addClass('animated fadeIn').html('<h1>Thank You.</h1><p>' + data.msg + '</p>');
              }
            },
            error: function(err){
              $("#mc_response").addClass('animated fadeIn').html('<p>' + data.msg + '</p>');
            }
          });
        });
      }
    },
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Script;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
