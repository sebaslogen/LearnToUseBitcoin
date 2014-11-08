//JSHint declaration of external methods
/*global $, hideAnimatedElements, finishCoinAnimation, coinAnimationFinished,
positionCoinAnimationCanvas, Modernizr*/
/*exported setupActiveJavaScript, moveTo, resizeWindow, setupTouchLayouts,
disableWelcomeSection, showBottomElements*/
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

function getIntroVideoRatio() {
  var space_side_video = ( $(window).width() - getIntroVideoWidth() ) / 2;
  return space_side_video / 178;
}

function getYoutubeAspectRatio() {
  return 360 / 640;
}

function getIntroVideoWidth() {
  return $('#youtube-video-container').width();
}

function adjustFootstepsPositionAndSize() {
  if (getWindowsSize() !== 'small') {
    $('#footsteps-image').width(parseInt(getIntroVideoRatio() * 174, 10));
    $('#footsteps-image').height(parseInt(getIntroVideoRatio() * 444, 10));
    var increase = getWindowsSize() === 'medium' ? 500 : 600; // Make sure image doesn't cover text
    $('#footsteps-image').css('top','-' + (increase+(10000/$('#youtube-video').width())) + 'px');
  }
}

function adjustIntroVideoSize() {
  $('#youtube-video').width(parseInt(getIntroVideoWidth(),10)).height(parseInt(getYoutubeAspectRatio() * getIntroVideoWidth(),10));
  $('#youtube-video-container').css('padding-bottom', ( $('#youtube-video').height() + 10 ) + 'px');
  adjustFootstepsPositionAndSize();
}

function disableCoinAnimationForSize() {
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

function updateSizes() {
  $(document).ready(function() {    
    adjustIntroVideoSize();
    // Adjust div height according to window width using contents size
    $('div#what').height(
      parseInt($('.video-container').find('iframe').height() + 
               $('div#what').find('h1').height() + 
               $('div#what').find('h3').height(),10) + 170);
    // Change vertical separation line to horizontal 
    // in demo transaction only in smaller(medium) size window
    if (getWindowsSize() === 'large') {
      var el = $('div.bottom-border');
      el.removeClass('bottom-border');
      el.addClass('right-border');
    } else {
      var element = $('div.right-border');
      element.removeClass('right-border');
      element.addClass('bottom-border');
    } 
    if (typeof coinAnimationStarted !== 'undefined') {
      disableCoinAnimationForSize();
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
