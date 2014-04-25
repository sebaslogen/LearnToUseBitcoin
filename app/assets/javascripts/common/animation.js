var autoscrolled = false;

function setupAutoScroll() {
  if (($('div.alert-box').size() == 0) && (getWindowsSize() != "small") ) { // Only whe there is no flash message shown at page top or is not a mobile
    // Automatically move to start section after a few seconds if user hasn't seen it yet
    setTimeout(function() {
      if ($(window).scrollTop() + $( window ).height() <= parseInt($('#welcome').css('height')) + 100) {
        autoscrolled = true;
        moveTo('#what', 3000);  // Move automaticaly but slowly
        analytics.track('AutoScrolled to Welcome section');
      }
    }, 4000); // Wait 4 seconds to automatically move
  }
}



/* Youtube video control functions */
// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-video', {
    events: {
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

// The API calls this function when the player's state changes to playing
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    setTimeout(autoScrollOnVideoFinish, 1000);
    player.auto_moving = true;
  }
}

// Auto-scroll to next section in the last seconds of the video or when it´s finished
function autoScrollOnVideoFinish() {
  if (player != null) {
    if ( (player.getDuration() - player.getCurrentTime() <= 3.5 ) ||
       (player.getPlayerState() == YT.PlayerState.ENDED) ) {
      player = null;
      moveTo('#start', 3000);
    } else {
      setTimeout(autoScrollOnVideoFinish, 300);
    }
  }
}

function onPlayerError() {
  moveTo('#start', 2000);
}