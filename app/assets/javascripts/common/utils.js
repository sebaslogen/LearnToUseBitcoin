//JSHint declaration of external methods
/*global $, I18n, getWindowsSize, windowResize, resizeWindow, setupActiveJavaScript, scrollFading, setupAutoScroll,
setupScrollHintAnimation, setupScrollFadingAndResize, updateSizes, loadDemoContent, loadCoinAnimation*/
/*exported loadLocalBitcoinSellers, addLocale*/
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

function showBitonic(sellers_list, cc) {
  if (['NL', 'BE', 'LU'].indexOf(cc) >= 0) {
    sellers_list.push('https://bitonic.nl/?refcode=8w0UlJ123111"> Bitonic </a>');
    sellers_list.push('https://www.happycoins.com/Account/Index/eb754703-5a33-46fd-b0d2-9a2bb7e465e3"> HappyCoins </a>');
    sellers_list.push('http://www.bitcoin-bon.nl"> Bitcoin Bon </a>');
  }
  return sellers_list;
}

function showSafello(sellers_list, cc) {
  if (['NL', 'BE', 'LU', 'GB', 'SE', 'DE', 'FR', 'IT', 'ES', 'PL', 'HU'].indexOf(cc) >= 0) {
    sellers_list.push('http://safello.com/buy"> Safello </a>');
  }
  return sellers_list;
}

function showBittylicious(sellers_list, cc) {
  if (['NL', 'BE', 'LU', 'GB', 'SE', 'DE', 'FR', 'IT', 'ES', 'PL', 'HU', 'PT', 'LI', 'AT'].indexOf(cc) >= 0) {
    sellers_list.push('https://bittylicious.com/r/19542"> Bittylicious </a>');
  }
  return sellers_list;
}

function showBTCe(sellers_list, cc) {
  if (cc === 'RU') {
    sellers_list.push('https://btc-e.com" target="_blank"> BTC-e </a>');
  }
  return sellers_list;
}

function showExpresscoin(sellers_list, cc) {
  if (cc === 'US') {
    sellers_list.push('https://coinbase.com/?r=52ac992c01478f0e730000b9&utm_campaign=user-referral&src=referral-link"> coinbase </a>');
    sellers_list.push('http://www.expresscoin.com/"> expresscoin </a>');
  }
  return sellers_list;
}

function loadLocalBitcoinSellers() {
  $('#bitcoin-sellers').empty(); // Remove any previous links (e.g. on IP/country change)
  var cc = user_location.country_code;
  var sellers_list = [];
  var link_start = '<a target="_blank" href="';
  sellers_list = showBitonic(sellers_list, cc);
  sellers_list = showSafello(sellers_list, cc);
  sellers_list = showBittylicious(sellers_list, cc);
  sellers_list = showBTCe(sellers_list, cc);
  sellers_list = showExpresscoin(sellers_list, cc);

  for (var i = 0; i < sellers_list.length; i++) {
    if ( i % 4 === 0 ) {
      $('#bitcoin-sellers').append( '<br>' );
    }
    else if ( i > 0 ) {
      $('#bitcoin-sellers').append( '-' );
    }
    $('#bitcoin-sellers').append( link_start + sellers_list[i] );
  }
}

function removeToolTipElement(element) {
  $(element).removeAttr('title');
  $(element).removeClass('has-external-tooltip').removeClass('has-tooltip').removeClass('hide-tooltip-small');
}

function updateToolTips() {
  $(document).ready(function() {
    $('.has-tooltip[title]').each(function(index, element) {
      if (getWindowsSize() !== "small") {
        return false; // Remove not needed tooltips only for small screens
      }
      if ($(element).hasClass('hide-tooltip-small')) {
        removeToolTipElement(element);
      }
    });
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
    $('.has-external-tooltip').each(function(index, element) {
      if ($(element).hasClass('hide-tooltip-small')) {
        removeToolTipElement(element);
      } else {
        $(element).qtip({
          content: {
            text: $('#' + $(element).attr('tooltip-id'))
          },
          style: { classes: 'tooltip-text qtip-youtube qtip-shadow qtip-rounded' },
          position: {
            my: 'bottom center',  // Position my bottom center...
            at: 'top center', // at the top center of...
            target: element // my target
          },
          hide: {
            fixed: true,
            delay: 200
          }
        });
      }
    });
  });
}

function setupLocalization() {
  if (typeof window.ParsleyConfig.i18n[I18n.locale] !== 'undefined') {// Set Parsley language only when locale is available
    window.ParsleyValidator.setLocale( I18n.locale );
  }
}

function addLocale(url) {
  if ($.urlParam('locale')) {
    return url + "?locale=" + $.urlParam('locale');
  } else {
    return url;
  }
}

$.urlParam = function(name) { // Parse URL parameters
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if ( results === null){
    return null;
  }
  else {
    return results[1] || 0;
  }
};

/* Enable functions after document load */

$(document).ready(function() {
  setupActiveJavaScript();
  setupLocalization();
  detectLocation();
  if (typeof $('div.sWelcome')[0] === 'undefined') {// Only execute JS on the Home page (useful for test pages)
    return;
  }
  scrollFading(); // Arrange things correclty if the page is automatically scrolled on load (e.g. from previous visit)
  setupAutoScroll();
  setupScrollHintAnimation();
  setupScrollFadingAndResize();
  updateSizes();
  updateToolTips();
  $(window).on({
    scroll: scrollFading,
    resize: function() { windowResize.checkResize( resizeWindow ); }
  });
  setTimeout(function() { // Preload demo hidden section
    loadDemoContent();
  }, 15000); // Wait 15 seconds to automatically load
  loadCoinAnimation(); // Asynchronously load script for coin animation
});