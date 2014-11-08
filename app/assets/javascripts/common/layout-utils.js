//JSHint declaration of external methods
/*global $, hideAnimatedElements, checkCoinAnimationCancel, showDemoTransaction, showDemoTransaction, 
finishCoinAnimation, coinAnimationFinished, positionCoinAnimationCanvas, Modernizr, showAnimatedElements*/
/*exported setupActiveJavaScript, setupScrollHintAnimation, setupScrollFadingAndResize, moveTo,
resizeWindow, setupTouchLayouts*/
var show_bottom_elements = false;

function setupActiveJavaScript() {
  if (getWindowsSize() !== 'small') { // Fading title works well only on tabs or faster HW
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
  speed = (typeof speed === 'undefined') ? 1000 : speed;
  var offset = 20;
  var target = $(id).offset().top - offset;
  $('html, body').animate({scrollTop:target}, speed, 'easeInOutCubic');
}

function setupScrollHintAnimation() {
  // Show arrow animation
  if (  $(window).scrollTop() <= parseInt( $('#welcome').css('height'),10 )  ) {
    $('#scroll-arrow').animate({top:'+=40'}, 4000, 'easeInOutQuart');
  }
}

function getScrolledItems(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();
  var elemTop = $(elem).offset() == null ? 0 : $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();
  var elemBottomWithMargin = elem === window ? 0 : elemBottom + parseInt( $(elem).css('margin-top'),10 ) + parseInt( $(elem).css('margin-bottom'),10 );
  return [docViewTop, docViewBottom, elemTop, elemBottom, elemBottomWithMargin];
}

function isScrolledBy(bottomScrolledIntoView, bottomWithMarginScrolledIntoView, scrolledIntoView, completelyScrolledIntoView) {
  var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemTop = items[2];
  var elemBottom = items[3];
  var elemBottomWithMargin = items[4];
  if (bottomScrolledIntoView) {
    return ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom));  
  }
  if (bottomWithMarginScrolledIntoView) {
    return ((elemBottomWithMargin >= docViewTop) && (elemBottomWithMargin <= docViewBottom));
  }
  if (scrolledIntoView) {
    return (((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) ||
          ((elemTop >= docViewTop) && (elemTop <= docViewBottom)) ||
          ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom)) ||
          ((elemTop <= docViewTop) && (elemBottom >= docViewBottom)) );
  }
  if (completelyScrolledIntoView) {
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }
}

$.fn.isBottomScrolledIntoView = function() {
  /*var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemBottom = items[3];
  return ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom));
  */
  return isScrolledBy(true, false, false, false);
};

$.fn.isBottomWithMarginScrolledIntoView = function() {
  /*
  var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemBottomWithMargin = items[4];
  return ((elemBottomWithMargin >= docViewTop) && (elemBottomWithMargin <= docViewBottom));*/
  return isScrolledBy(false, true, false, false);
};
  
$.fn.isScrolledIntoView = function() {
  /*
  var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemTop = items[2];
  var elemBottom = items[3];
  return (((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) ||
          ((elemTop >= docViewTop) && (elemTop <= docViewBottom)) ||
          ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom)) ||
          ((elemTop <= docViewTop) && (elemBottom >= docViewBottom)) );*/
  return isScrolledBy(false, false, true, false);
};

$.fn.isCompletelyScrolledIntoView = function() {
  /*
  var items = getScrolledItems(this);
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemTop = items[2];
  var elemBottom = items[3];
  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));*/
  return isScrolledBy(false, false, false, true);
};

var scrollFadingBlocked = false; // Detect multiple requests in less than 200ms
var scrollFadingChecker = null;

function switchExtrussion(selector, add, remove){
  $('#welcome-content').find(selector).addClass(add).removeClass(remove);
}

function setTitlesExtrusion( percentage ) {
  if (percentage < 0.6) { // Change extrusion of Welcome text
    switchExtrussion('h1', 'de_extruded', 'extruded');
  } else {
    switchExtrussion('h1', 'extruded', 'de_extruded');
  }
  if (percentage < 0.83) { // Change extrusion of Welcome subtitle text
    switchExtrussion('h2', 'de_extruded-subtitle', 'extruded-subtitle');
  } else {
    switchExtrussion('h2', 'extruded-subtitle', 'de_extruded-subtitle');
  }
}

function showWelcomeSection( percentage, scrolled, sizeWelcome ) {
  $('#welcome-content').removeClass('hidden');
  $('#welcome-content').css('opacity', percentage); // Hide title gradually
  $('#welcome-content').css('margin-top', (scrolled/(-15))+'px'); // Small parallax on title
  $('#coin-canvas').css('opacity', percentage);
  var welcomeOpacity = percentage - (scrolled / sizeWelcome);
  $('#welcome-content').find('div#scroll-message').css('opacity', welcomeOpacity);
  if (getWindowsSize() === 'large') {
    setTitlesExtrusion();
  }
}

function disableWelcomeSection( percentage, scrolled, sizeWelcome ) {
  // Disable welcome section when it's not visible
  if (percentage <= 0) {
    percentage = 0;
    $('#welcome-content').addClass('hidden');
    $('#coin-canvas').css('opacity', 0);
  } else {
    showWelcomeSection(percentage, scrolled, sizeWelcome);
  }
}

function shouldScrollFadeNow() {
  if (scrollFadingBlocked) { // Prevent too many updates
    if (scrollFadingChecker !== null) {
      clearTimeout(scrollFadingChecker);
      scrollFadingChecker = null;
    }
    scrollFadingChecker = setTimeout(200, scrollFading); // Delay next check
    return false;
  } else {
    return true;
  }
}

function adjustFootstepsOpacity(scrolled) {// Increase footsteps opacity
  var sizeWelcomeAndWhat = parseInt($('#welcome').css('height'),10) + (parseInt($('#what').css('height'),10) / 2);
  var footsteps_opacity = ((scrolled*scrolled/1500) / sizeWelcomeAndWhat);
  if ((footsteps_opacity > 0.1) && (footsteps_opacity < 2.6)) {
    $('#footsteps-image').css('opacity', footsteps_opacity / 2);
    $('#footsteps-image').css('margin-top', (scrolled*0.13)+'px'); // Small parallax on title
  }
}

function scrollFading() {
  if ( shouldScrollFadeNow() ) {
    scrollFadingBlocked = true;

    var sizeWelcome = parseInt($('#welcome').css('height'),10);
    var scrolled = $(window).scrollTop() * 1.5;
    var percentage = 1 - (scrolled / sizeWelcome);
    
    disableWelcomeSection(percentage, scrolled, sizeWelcome);
    
    adjustFootstepsOpacity(scrolled);
    
    checkCoinAnimationCancel();
    showDemoTransaction();
    showBottomElements();
    showAnimatedElements();
    
    scrollFadingBlocked = false;
  }
}

function setupScrollFadingAndResize() {
  $('body,html').bind('scroll mousedown DOMMouseScroll mousewheel keyup', function(e){
    if ( e.which > 0 || e.type === 'mousedown' || e.type === 'mousewheel'){
      $('html,body').stop();
    }
  });
}

function showBottomElements() {
  if ( show_bottom_elements && $('#transference-demo').isBottomScrolledIntoView() ) { // Only when section end is visible
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
    var video_width = $('#youtube-video-container').width();
    var space_side_video = ( $(window).width() - video_width ) / 2;
    var ratio = space_side_video / 178;
    var youtube_aspect_ratio = 360 / 640;
    $('#youtube-video').width(parseInt(video_width,10)).height(parseInt(youtube_aspect_ratio * video_width,10));
    $('#youtube-video-container').css('padding-bottom', ( $('#youtube-video').height() + 10 ) + 'px');
    if (getWindowsSize() !== 'small') {
      $('#footsteps-image').width(parseInt(ratio * 174,10));
      $('#footsteps-image').height(parseInt(ratio * 444,10));
      var increase = 600;
      if (getWindowsSize() === 'medium') {
        increase = 500; // Make sure image doesn't cover text
      }
      $('#footsteps-image').css('top','-' + (increase+(10000/$('#youtube-video').width())) + 'px');
    }
    // Adjust div height according to window width using contents size
    $('div#what').height(
      parseInt($('.video-container').find('iframe').height() + 
               $('div#what').find('h1').height() + 
               $('div#what').find('h3').height(),10) + 170);
    // Change vertical separation line to horizontal 
    // in demo transaction with smaller(medium) size window
    if (getWindowsSize() !== 'large') {
      var element = $('div.right-border');
      element.removeClass('right-border');
      element.addClass('bottom-border');
    } else if (getWindowsSize() === 'large') {
      var el = $('div.bottom-border');
      el.removeClass('bottom-border');
      el.addClass('right-border');
    }
    if (typeof coinAnimationStarted !== 'undefined') {
      if (getWindowsSize() === 'small') {
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
    if (( this.width !== $(window).width() ) || ( this.height !== $(window).height() )) {
      this.update();
      callback.apply();
    }
  }
};

windowResize.update();
