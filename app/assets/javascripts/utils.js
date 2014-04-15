var user_location = null;

function detectLocation() {
  jQuery.getJSON('http://freegeoip.net/json/', function(location) {
    /*console.log('city:' + location.city);
    console.log('region_code:' + location.region_code);
    console.log('region_name:' + location.region_name);
    console.log('areacode:' + location.areacode);
    console.log('ip:' + location.ip);
    console.log('zipcode:' + location.zipcode);
    console.log('longitude:' + location.longitude);
    console.log('latitude:' + location.latitude);
    console.log('country_name:' + location.country_name);
    console.log('country_code:' + location.country_code);*/
    user_location = location;
  });
}

function loadLocalBitcoinSellers() {
  $('#bitcoin-sellers').children().remove(); // Remove any previous links (e.g. on IP/country change)
  var cc = user_location.country_code;
  if (cc == 'NL' || (cc == 'BE') || (cc == 'LU')) {
    $('#bitcoin-sellers').append('<a href="https://bitonic.nl/?refcode=8w0UlJ123111" target="_blank"> Bitonic </a>');
    $('#bitcoin-sellers').append('<a href="https://www.happycoins.com/Account/Index/eb754703-5a33-46fd-b0d2-9a2bb7e465e3" target="_blank"> HappyCoins </a>');
  }
  if (cc == 'GB' || cc == 'SE' || cc == 'NL' || cc == 'DE' || cc == 'FR' || cc == 'IT' || cc == 'ES' || 
      cc == 'PL' || (cc == 'HU') ) {
    $('#bitcoin-sellers').append('<a href="https://safello.com/buy" target="_blank"> Safello </a>');
  }
  if (cc == 'GB' || cc == 'SE' || cc == 'NL' || cc == 'DE' || cc == 'FR' || cc == 'IT' || cc == 'ES' || 
      cc == 'PL' || (cc == 'HU') || (cc == 'PT') || (cc == 'LI') || (cc == 'LU') || (cc == 'BE') || (cc == 'AT') ) {
    $('#bitcoin-sellers').append('<a href="https://bittylicious.com/r/19542" target="_blank"> Bittylicious </a>');
  }
  if (cc == 'RU') {
    $('#bitcoin-sellers').append('<a href="https://btc-e.com" target="_blank"> BTC-e </a>');
  }
  if (cc == 'US') {
    $('#bitcoin-sellers').append('<a href="https://coinbase.com/?r=52ac992c01478f0e730000b9&utm_campaign=user-referral&src=referral-link" target="_blank"> coinbase </a>');
    $('#bitcoin-sellers').append('<a href="http://www.expresscoin.com/" target="_blank"> expresscoin </a>');
  }
}

function updateToolTips() {
  $(document).ready(function() {
    $('.has-tooltip[title]').qtip({
      style: { classes: 'tooltip-text qtip-youtube qtip-shadow qtip-rounded' },
      position: {
        my: 'bottom center',  // Position my bottom center...
        at: 'top center', // at the top center of...
        target: this // my target
      },
      hide: {
        fixed: true,
        delay: 200
      }
    });
    $('.has-external-tooltip').each(function() {
      $(this).qtip({
        content: {
          text: $('#' + $(this).attr('tooltip-id'))
        },
        style: { classes: 'tooltip-text qtip-youtube qtip-shadow qtip-rounded' },
        position: {
          my: 'bottom center',  // Position my bottom center...
          at: 'top center', // at the top center of...
          target: this // my target
        },
        hide: {
          fixed: true,
          delay: 200
        }
      });
    });
  });
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
  }
}

// Auto-scroll to next section in the last seconds of the video or when it´s finished
function autoScrollOnVideoFinish() {
  if (player != null) {
    if ( (player.getDuration() - player.getCurrentTime() <= 2 ) ||
       (player.getPlayerState() == YT.PlayerState.ENDED) ) {
      player = null;
      moveTo('#start', 2000);
    } else {
      setTimeout(autoScrollOnVideoFinish, 1000);
    }
  }
}

function onPlayerError() {
  moveTo('#start', 2000);
}



/* Enable functions after document load */

$(document).ready(function() {
  setupActiveJavaScript();
  detectLocation();
  scrollFading(); // Arrange things correclty if the page is automatically scrolled on load (e.g. from previous visit)
  // setupNavigationMenu(); // DISABLED TODO: Remove or activate
  setupAutoScroll();
  setupScrollHintAnimation();
  setupScrollFadingAndResize();
  updateSizes();
  updateToolTips();
  $(window).on({
    scroll: scrollFading,
    resize: function() { windowResize.checkResize( resizeWindow ) }
  });
  setTimeout(function() { // Preload demo hidden section
    loadDemoContent();
  }, 2000); // Wait 2 seconds to automatically load
  // Load script for coin animation asynchronously
  $.getScript('assets/vendor/javascript/box2D-min.js', function( data, textStatus, jqxhr ) {
    if (jqxhr.status == 200 ) {
      console.log( "box2D load was performed" );
      //startCoinAnimation();
    }
  });
});