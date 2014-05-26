var show_bottom_elements = false;

function setupActiveJavaScript() {
  if (getWindowsSize() != "small") { // Fading title works well only on tabs or faster HW
    $('#welcome-content').css({
      'position': 'fixed',
      'margin': '0 0 0 -37.5%'
    });
  }
  hideAnimatedElements();
}

function getWindowsSize() {
  return $('#breakpoints div:visible').first().data('size');
}

function moveTo(id, speed) {
  speed = (typeof speed === "undefined") ? 1000 : speed;
  var offset = 20;
  var target = $(id).offset().top - offset;
  $('html, body').animate({scrollTop:target}, speed, 'easeInOutCubic');
}

function setupNavigationMenu() {
  // Navigation menu expand/collapse animations
  $('div.navigation-menu').on({
    mouseenter: function() {
      window['mouse-over-navigation-menu'] = true;
      $('#navigation-menu-icon').slideUp(200);
      setTimeout(function() {
        if (window['mouse-over-navigation-menu']) {
          $('div.navigation-menu').find('div.navigation-content').slideDown(200).removeClass('hidden');
        }
      }, 200);
    },
    mouseleave: function() {
      window['mouse-over-navigation-menu'] = false;
      setTimeout(function() {
        if (! window['mouse-over-navigation-menu']) {
          $('div.navigation-menu').find('div.navigation-content').slideUp(200).addClass('hidden', 400);
          setTimeout(function() {
            if (! window['mouse-over-navigation-menu']) {
              $('#navigation-menu-icon').slideDown(200);
            }
          }, 200);
        }
      }, 200);
    }
  });
  // Navigation menu links to sections
  $('a[href^="#"]').click(function(event) {
    var id = $(this).attr("href");
    moveTo(id);
    event.preventDefault();
  });
}

function setupScrollHintAnimation() {
  // Show arrow animation
  if (  $(window).scrollTop() <= parseInt( $('#welcome').css('height') )  ) {
    $('#scroll-arrow').animate({top:'+=40'}, 4000, 'easeInOutQuart');
  }
}

function getScrolledItems(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();
  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();
  var elemBottomWithMargin = elemBottom + parseInt( $(elem).css('margin-top') ) + parseInt( $(elem).css('margin-bottom') );
  return [docViewTop, docViewBottom, elemTop, elemBottom, elemBottomWithMargin];
}

$.fn.isBottomScrolledIntoView = function() {
  var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemTop = items[2];
  var elemBottom = items[3];
  return ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom));
}

$.fn.isBottomWithMarginScrolledIntoView = function() {
  var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemTop = items[2];
  var elemBottom = items[4];
  return ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom));
}
  
$.fn.isScrolledIntoView = function() {
  var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemTop = items[2];
  var elemBottom = items[3];
  return (((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) ||
          ((elemTop >= docViewTop) && (elemTop <= docViewBottom)) ||
          ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom)) ||
          ((elemTop <= docViewTop) && (elemBottom >= docViewBottom)) );
}

$.fn.isCompletelyScrolledIntoView = function() {
  var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemTop = items[2];
  var elemBottom = items[3];
  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

var scrollFadingBlocked = false; // Detect multiple requests in less than 200ms
var scrollFadingChecker = null;

function scrollFading() {
  if (scrollFadingBlocked) { // Prevent too many updates
    if (scrollFadingChecker !== null) {
      clearTimeout(scrollFadingChecker);
      scrollFadingChecker = null;
    }
    scrollFadingChecker = setTimeout(200, scrollFading);
    return;
  } else {
    scrollFadingBlocked = true;
  }
  var sizeWelcome = parseInt($('#welcome').css('height'));
  var scrolled = $(window).scrollTop() * 1.5;
  var percentage = 1 - (scrolled / sizeWelcome);
  // Disable welcome sectoin when it's not visible
  if (percentage <= 0) {
    percentage = 0;
    $('#welcome-content').addClass('hidden');
    $('#coin-canvas').css('opacity', 0);
  } else {
    $('#welcome-content').removeClass('hidden');
    $('#welcome-content').css('opacity', percentage); // Hide title gradually
    $('#welcome-content').css('margin-top', (scrolled/(-15))+'px'); // Small parallax on title
    $('#coin-canvas').css('opacity', percentage);
    $('#welcome-content').find('div#scroll-message').css('opacity', percentage - (scrolled / sizeWelcome));
    if (getWindowsSize() == "large") {
      // Change extrusion of Welcome text
      if (percentage < 0.6) {
        $('#welcome-content').find('h1').addClass('de_extruded').removeClass('extruded');
      } else {
        $('#welcome-content').find('h1').addClass('extruded').removeClass('de_extruded');
      }
      // Change extrusion of Welcome subtitle text
      if (percentage < 0.83) {
        $('#welcome-content').find('h2').addClass('de_extruded-subtitle').removeClass('extruded-subtitle');
      } else {
        $('#welcome-content').find('h2').addClass('extruded-subtitle').removeClass('de_extruded-subtitle');
      }
    }
  }
  // Increase footsteps opacity
  var sizeWelcomeAndWhat = parseInt($('#welcome').css('height')) + (parseInt($('#what').css('height')) / 2);
  var footsteps_opacity = ((scrolled*scrolled/1500) / sizeWelcomeAndWhat);
  if ((footsteps_opacity > 0.1) && (footsteps_opacity < 2.6)) {
    $('#footsteps-image').css('opacity', footsteps_opacity / 2);
    $('#footsteps-image').css('margin-top', (scrolled*0.13)+'px'); // Small parallax on title
  }
  
  checkCoinAnimationCancel();
  showDemoTransaction();
  showBottomElements();
  showAnimatedElements();
  
  scrollFadingBlocked = false;
}

function setupScrollFadingAndResize() {
  $("body,html").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
    if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
      $("html,body").stop();
    }
  });
}

function showBottomElements() {
  if ( show_bottom_elements && $("#transference-demo").isBottomScrolledIntoView() ) { // Only when section end is visible
    setTimeout(function() { // Show with a little delay
      $('#get-bitcoins-section').fadeIn('slow');
      $('#use').fadeIn('slow');
      $('#myths').fadeIn('slow');
      $('#continue-learning').fadeIn('slow');
    }, 500);
  }
}

function updateSizes() {
  $(document).ready(function() {
    /* Adapt footsteps position and size */
    var video_height = $('#youtube-video-container').height();
    var video_width = $('#youtube-video-container').width();
    var space_side_video = ( $(window).width() - video_width ) / 2;
    var ratio = space_side_video / 178;
    var youtube_aspect_ratio = 360 / 640;
    $('#youtube-video').width(parseInt(video_width)).height(parseInt(youtube_aspect_ratio * video_width));
    $('#youtube-video-container').css('padding-bottom', ( $('#youtube-video').height() + 10 ) + 'px');
    $('#footsteps-image').width(parseInt(ratio * 174));
    $('#footsteps-image').height(parseInt(ratio * 444));
    $('#footsteps-image').css('top','-' + $('#youtube-video').height() + 'px');
    // Adjust div height according to window width using contents size
    $('div#what').height(parseInt($('.video-container').find('iframe').height() + $('div#what').find('h1').height() + $('div#what').find('h3').height()) + 170);
    // Change vertical separation line to horizontal 
    // in demo transaction with smaller(medium) size window
    if (getWindowsSize() != "large") {
      var element = $('div.right-border');
      element.removeClass('right-border');
      element.addClass('bottom-border');
    } else if (getWindowsSize() == "large") {
      var el = $('div.bottom-border');
      el.removeClass('bottom-border');
      el.addClass('right-border');
    }
    if (typeof coinAnimationStarted !== 'undefined') {
      if (getWindowsSize() == "small") {
        finishCoinAnimation(); // Small screens should not have the coin animation
      } else {
        if (coinAnimationFinished) {
          finishCoinAnimation();
        } else { // Adjust position
          positionCoinAnimationCanvas();
        }
      }
    }
  });
}

function resizeWindow() {
  $(document).ready(function() {
    updateSizes();
  });
}

function setupTouchLayouts() {
  if (Modernizr.touch) {
    $('.wallet-info').addClass('touch-wallet-border');
  }
}

// Fix for resize on webpage load depending on the browser
var windowResize = {
  height:0,
  width:0,
  update: function() {
    this.width =  $(window).width();
    this.height = $(window).height();
  },
  checkResize: function(callback) {
    if (( this.width != $(window).width() ) || ( this.height != $(window).height() )) {
      this.update();
      callback.apply();
    }
  }
};
windowResize.update();
