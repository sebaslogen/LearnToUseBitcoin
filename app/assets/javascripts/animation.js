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
    $('#coin-canvas').css({ // Position of the reference logo
      'position': 'fixed',
      'margin': $('#bitcoin-logo').offset().top+'px 0 0 '+$('#bitcoin-logo').offset().left+'px'//33.5%'
    });
    console.log('start coin animation');
    var canvas = document.getElementById('coin-canvas');
    var context = canvas.getContext('2d');
    /*context.fillStyle = 'rgba(250,250,120,1)'; // Show first draw to user in a few milliseconds after HTML is loaded
    context.fillRect(0, 0, canvas.width, canvas.height);*/
    var img = document.getElementById("bitcoin-logo-image");
    context.drawImage(img, 0, 0);
  }
}