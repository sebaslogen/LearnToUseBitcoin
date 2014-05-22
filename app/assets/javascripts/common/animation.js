var autoscrolled = false;

function setupAutoScroll() {
  if (($('div.alert-box').size() === 0) && (getWindowsSize() != "small") ) { // Only when there is no flash message shown at page top or is not a mobile
    // Automatically move to start section after a few seconds if user hasn't seen it yet
    setTimeout(function() {
      if ( ($(window).scrollTop() + $( window ).height() <= parseInt($('#welcome').css('height')) + 100) && // Welcome section not visible
          ((typeof coinAnimationStarted === 'undefined') || (coinAnimationStarted === false)) ) { // Coin animation not started
        autoScrollToWelcome();
      }
    }, 4000); // Wait 4 seconds to automatically move
  }
}

function autoScrollToWelcome() {
  if ( (autoscrolled === false) &&
    (  $(window).scrollTop() <= parseInt( $('#welcome').css('height') )  )) {
    autoscrolled = true;
    moveTo('#what', 3000);  // Move automaticaly but slowly
    analytics.track('AutoScrolled to Welcome section');
  }
}

function loadCoinAnimation() { // Asynchronously load script for coin animation
  if ( getWindowsSize() != "small" ) { // Load coin animation only on big enough screens
    $("#canvas-container").load("/animation", function() {
      startCoinAnimation();
    });
  }
}

function checkCoinAnimationCancel() {
  if ( autoscrolled || // Cancel animation if page already scrolled
    ( $(window).scrollTop() >= parseInt($('#welcome').css('height')) ) ) {
    if ((typeof coinAnimationStarted !== 'undefined') && coinAnimationStarted ) {
      finishCoinAnimation();
    }
  }
}

function showAnimatedElements() {
  if ( $("#demo-content").hasClass('hidden') ) {
    if ( $('#show-demo').isBottomScrolledIntoView() ) { // Automatically show demo information after a small delay
      setTimeout(function() {angular.element($('#start')).scope().showDemo();}, 2500);
    }
  } else {
    if ($('#demo-content').hasClass('available')) { // Animation to show full section is finished
      if ( $('#sample-bitcoin-address').isScrolledIntoView() && // Visible
          $('#sample-bitcoin-address').hasClass('not-animated-yet') ) { // Still has to be animated
        $('#sample-bitcoin-address').removeClass('not-animated-yet');
        setTimeout(function() { $('#sample-bitcoin-address').textEffect({
          effect: 'jumble', // the type of the text aniamtion. fade, glow, jumble, slide, dropdown and random (default)
          effectSpeed: 90, // the speed in ms at which new letters begin to animate.
          completionSpeed: 3000, // the speed in ms of the text animation.
          jumbleColor: '#7f7f7f' // the color of the jumbled letters.
        });}, 1000); // Load one second later to let the fade in of the section finish
      }
      // Show key image with rotation
      if ( $('#key-image').isScrolledIntoView() && // Visible
          $('#key-image').hasClass('will-animate') && // Still has to be animated
          ($('#circle-button-3').css('opacity') > 0.9 ) ) { // Show animation after circles finish animation
        introSequenceCircle('#key-image', 'flipInY');
        setTimeout(showAnimatedElements, 2000); // Trigger animations that were pending on this one
      }
      
      // Show wallet image with rotation
      if ( $('#wallet-image').isScrolledIntoView() && // Visible
          $('#wallet-image').hasClass('will-animate') && // Still has to be animated
          ($('#key-image').css('opacity') > 0.9 ) ) { // Show animation after circles finish animation
        introSequenceCircle('#wallet-image', 'flipInY');
      }
      
      // Show different wallet type images
      if ( $('#phone-image').isBottomScrolledIntoView() &&
          $('#phone-image').hasClass('will-animate') ) {
        introSequenceCircle('#phone-image', 'fadeInRightBig');
        setTimeout(function() {introSequenceCircle('#pc-image', 'fadeInRightBig');}, 500);
        setTimeout(function() {introSequenceCircle('#browser-image', 'fadeInRightBig');}, 1000);
        setTimeout(showAnimatedElements, 3000); // Trigger animations that were pending on this one
      }
      
      // Show coin image with rotation
      if ( $('#coin-image').isBottomScrolledIntoView() && // Visible
          $('#coin-image').hasClass('will-animate') && // Still has to be animated
          ($('#browser-image').css('opacity') > 0.9 ) ) { // Show animation after circles finish animation
        introSequenceCircle('#coin-image', 'flipInY');
      }
      
      // Show demo transaction basket
      if ( $('#minibasket-image').isBottomScrolledIntoView() &&
          $('#minibasket-image').hasClass('will-animate') ) {
        introSequenceCircle('#minibasket-image', 'fadeInLeftBig');
      }
      // Show demo transaction wallet
      if ( $('#miniwallet-image').isBottomScrolledIntoView() &&
          $('#miniwallet-image').hasClass('will-animate') ) {
        introSequenceCircle('#miniwallet-image', 'fadeInRightBig');
      }
    }
    
    // Show circle links to information sections in demo
    if ( $('#circle-button-1').isScrolledIntoView() &&
        $('#circle-button-1').hasClass('will-animate') ) {
      introSequenceCircle('#circle-button-1', 'fadeInRightBig');
      setTimeout(function() {introSequenceCircle('#circle-button-2', 'fadeInRightBig');}, 300);
      setTimeout(function() {introSequenceCircle('#circle-button-3', 'fadeInRightBig');}, 600);
      setTimeout(showAnimatedElements, 2000); // Trigger animations that were pending on this one
    }

  }
  if ($("#demo-form-title").isScrolledIntoView()) { // When demo form is visible make a wave on the text
    $("#demo-form-title").letterfx({"fx":"wave","letter_end":"rewind","fx_duration":"300ms"});
  }
}

function introSequenceCircle(id, fading_effect) {
  $(id).show();
  $(id).removeClass('will-animate').addClass('animated-two-sec').addClass(fading_effect);
}

function hideAnimatedElements() {
  $('.will-animate').css('opacity', 0);
}

/* Youtube video control functions */
// This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-video');
  try {
    player.addEventListener("onStateChange", 'onPlayerStateChange');
    player.addEventListener("onError", 'onPlayerError');
  } catch(err) { // Retry in one second if Youtube player was not ready
    setTimeout(onYouTubeIframeAPIReady, 1000);
  }
}

// The API calls this function when the player's state changes to playing
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    setTimeout(autoScrollOnVideoFinish, 1000);
  }
}

// Auto-scroll to next section in the last seconds of the video or when it´s finished
function autoScrollOnVideoFinish() {
  if (player !== null) {
    if ( (player.getDuration() - player.getCurrentTime() <= 3.5 ) ||
       (player.getPlayerState() == YT.PlayerState.ENDED) ) {
      player = null;
      moveTo('#start', 3000);
      analytics.track('Watched video WhatIsBitcoin');
    } else {
      setTimeout(autoScrollOnVideoFinish, 300);
    }
  }
}

function onPlayerError() {
  moveTo('#start', 2000);
}

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);