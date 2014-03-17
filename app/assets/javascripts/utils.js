function setupJavaScript() {
  $('#welcome-content').css({
    'position': 'fixed',
    'margin': '0 0 0 -37.5%'
  });
}

function moveToSection(id, speed) {
  speed = (typeof speed === "undefined") ? 1000 : speed;
  var offset = 20;
  var target = $(id).offset().top - offset;
  $('html, body').animate({scrollTop:target}, speed, 'easeInOutCubic');
}

function setupNavigationMenu() {
  // Navigation menu expand/collapse animations
  $('div.navigation-menu').on({
    mouseenter: function() {
      window['mouse-over-navigation-menu'] = true;
      $('#navigation-menu-icon').slideUp(200);
      setTimeout(function() {
        if (window['mouse-over-navigation-menu']) {
          $('div.navigation-menu').find('div.navigation-content').slideDown(200).removeClass('hidden');
        }
      }, 200);
    },
    mouseleave: function() {
      window['mouse-over-navigation-menu'] = false;
      setTimeout(function() {
        if (! window['mouse-over-navigation-menu']) {
          $('div.navigation-menu').find('div.navigation-content').slideUp(200).addClass('hidden', 400);
          setTimeout(function() {
            if (! window['mouse-over-navigation-menu']) {
              $('#navigation-menu-icon').slideDown(200);
            }
          }, 200);
        }
      }, 200);
    }
  });
  // Navigation menu links to sections
  $('a[href^="#"]').click(function(event) {
    var id = $(this).attr("href");
    moveToSection(id);
    event.preventDefault();
  });
}

function setupAutoScroll() {
  if ($('div.alert-box').size() == 0) { // Only whe there is no flash message shown at page top
    // Automatically move to start section after a few seconds if user hasn't seen it yet
    setTimeout(function() {
      if ($(window).scrollTop() + $( window ).height() <= parseInt($('#welcome').css('height')) + 100) {
        moveToSection('#what', 3000);  // Move automaticaly but slowly
      }
    }, 4000); // Wait 4 seconds to automatically move
  }
}

function setupScrollHintAnimation() {
  // Show arrow animation
  if ($(window).scrollTop() + $( window ).height() <= parseInt($('#welcome').css('height')) + 100) {
    $('#scroll-arrow').animate({top:'+=40'}, 4000, 'easeInOutQuart');
  }
}

function scrollFading() {
  var sizeWelcome = parseInt($('#welcome').css('height'));
  var scrolled = $(window).scrollTop() * 1.5;
  var percentage = 1 - (scrolled / sizeWelcome);
  // Disable welcome sectoin when it's not visible
  if (percentage <= 0) {
    percentage = 0;
    $('#welcome-content').addClass('hidden');
  } else {
    $('#welcome-content').removeClass('hidden');
    $('#welcome-content').css('opacity', percentage);
    $('#welcome-content').find('div#scroll-message').css('opacity', percentage - (scrolled / sizeWelcome));
    // Change extrusion of Welcome text
    if (percentage < 0.6) {
      $('#welcome-content').find('h1').addClass('de_extruded').removeClass('extruded');
    } else {
      $('#welcome-content').find('h1').addClass('extruded').removeClass('de_extruded');
    }
    // Change extrusion of Welcome subtitle text
    if (percentage < 0.83) {
      $('#welcome-content').find('h2').addClass('de_extruded-subtitle').removeClass('extruded-subtitle');
    } else {
      $('#welcome-content').find('h2').addClass('extruded-subtitle').removeClass('de_extruded-subtitle');
    }
  }
  // Increase footsteps opacity
  var sizeWelcomeAndWhat = parseInt($('#welcome').css('height')) + (parseInt($('#what').css('height')) / 2);
  var footsteps_opacity = (scrolled / sizeWelcomeAndWhat);
  $('#footsteps-image').css('opacity', footsteps_opacity / 2);
}

function resizeWindow() {
  /* Adapt footsteps position and size */
  var space_side_video = ( $(window).width() - $('.video-container').find('iframe').width() ) / 2;
  var video_half_height = $('.video-container').find('iframe').height() / 2;
  var ratio = space_side_video / 178;
  $('#footsteps-image').width(parseInt(ratio * 174));
  $('#footsteps-image').height(parseInt(ratio * 444));
  $('#footsteps-image').css('top','-' + video_half_height + 'px');
  // Adjust div height according to window width using contents size
  $('div#what').height(parseInt($('.video-container').find('iframe').height() + $('div#what').find('h1').height() + $('div#what').find('h3').height()) + 100);
}

function setupScrollFadingAndResize() {
  $("body,html").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
    if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
      $("html,body").stop();
    }
  });
}

function loadDemoContent() {
  $("#demo-content").load("demo");
}

function updateToolTips() {
  $(document).ready(function() {
    $('.has-tooltip[title]').qtip({
      style: { classes: 'qtip-youtube qtip-shadow qtip-rounded' },
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
        style: { classes: 'qtip-youtube qtip-shadow qtip-rounded' },
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

$(document).ready(function() {
  setupJavaScript();
  scrollFading(); // Arrange things correclty if the page is automatically scrolled on load (e.g. from previous visit)
  setupNavigationMenu();
  setupAutoScroll();
  setupScrollHintAnimation();
  setupScrollFadingAndResize();
  resizeWindow();
  loadDemoContent();
  updateToolTips();
  $(window).on({
    scroll: scrollFading,
    resize: resizeWindow
  });
});
