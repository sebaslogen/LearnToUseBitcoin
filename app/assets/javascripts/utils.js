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
  var cc = user_location.country_code;
  if (cc == 'NL' || (cc == 'BE')) {
    $('#bitcoin-sellers').append('<a href="https://www.Bitonic.nl" target="_blank">Bitonic.nl</a>');
    $('#bitcoin-sellers').append('<a href="https://www.happycoins.com/Account/Index/eb754703-5a33-46fd-b0d2-9a2bb7e465e3" target="_blank">HappyCoins</a>');
  }
  if (cc == 'UK' || cc == 'SE' || cc == 'UK' || cc == 'UK' || cc == 'UK' || cc == 'UK' || cc == 'UK' || cc == 'NL' || (cc == 'BE') || ) {
    $('#bitcoin-sellers').append('<a href="https://safello.com/" target="_blank">Safello</a>');
  }
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
});