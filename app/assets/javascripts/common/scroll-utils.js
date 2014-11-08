//JSHint declaration of external methods
/*global $, checkCoinAnimationCancel, showDemoTransaction, disableWelcomeSection, showAnimatedElements,
showBottomElements*/
/*exported setupScrollHintAnimation, setupScrollFadingAndResize*/

function setupScrollHintAnimation() {
  // Show arrow animation
  if (  $(window).scrollTop() <= parseInt( $('#welcome').css('height'),10 )  ) {
    $('#scroll-arrow').animate({top:'+=40'}, 4000, 'easeInOutQuart');
  }
}

function getScrolledItems(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();
  var elemTop = elem === window ? 0 : $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();
  var elemBottomWithMargin = elem === window ? 0 : elemBottom + parseInt( $(elem).css('margin-top'),10 ) + parseInt( $(elem).css('margin-bottom'),10 );
  return [docViewTop, docViewBottom, elemTop, elemBottom, elemBottomWithMargin];
}

function isScrolledBy(items, checkName) {
  var docViewTop = items[0];
  var docViewBottom = items[1];
  var elemTop = items[2];
  var elemBottom = items[3];
  var elemBottomWithMargin = items[4];
  if (checkName === 'isBottomScrolledIntoView') {
    return ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom));  
  }
  if (checkName === 'isBottomWithMarginScrolledIntoView') {
    return ((elemBottomWithMargin >= docViewTop) && (elemBottomWithMargin <= docViewBottom));
  }
  if (checkName === 'isScrolledIntoView') {
    return (((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) ||
          ((elemTop >= docViewTop) && (elemTop <= docViewBottom)) ||
          ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom)) ||
          ((elemTop <= docViewTop) && (elemBottom >= docViewBottom)) );
  }
  if (checkName === 'isCompletelyScrolledIntoView') {
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }
}

$.fn.isBottomScrolledIntoView = function() {
  return isScrolledBy(getScrolledItems(this), 'isBottomScrolledIntoView');
};

$.fn.isBottomWithMarginScrolledIntoView = function() {
  return isScrolledBy(getScrolledItems(this), 'isBottomWithMarginScrolledIntoView');
};
  
$.fn.isScrolledIntoView = function() {
  return isScrolledBy(getScrolledItems(this), 'isScrolledIntoView');
};

$.fn.isCompletelyScrolledIntoView = function() {
  return isScrolledBy(getScrolledItems(this), 'isCompletelyScrolledIntoView');
};

var scrollFadingBlocked = false; // Detect multiple requests in less than 200ms
var scrollFadingChecker = null;

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