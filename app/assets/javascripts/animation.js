var autoscrolled = false;

function setupAutoScroll() {
  if (($('div.alert-box').size() == 0) && (getWindowsSize() != "small") ) { // Only whe there is no flash message shown at page top or is not a mobile
    // Automatically move to start section after a few seconds if user hasn't seen it yet
    setTimeout(function() {
      if ($(window).scrollTop() + $( window ).height() <= parseInt($('#welcome').css('height')) + 100) {
        autoscrolled = true;
        moveTo('#what', 3000);  // Move automaticaly but slowly
      }
      analytics.track('AutoScrolled to Welcome section');
    }, 4000); // Wait 4 seconds to automatically move
  }
}

function startCoinAnimation() {
  if (! autoscrolled) {
    console.log('start coin animation');
  }
}