//JSHint declaration of external methods
/*global $, updateToolTips, setupTouchLayouts, addLocale, hideAnimatedElements,
angular, show_bottom_elements:true*/
/*exported showDemoTransaction, loadDemoContent, fillDemoInputAmount, copyDemoPayToAddres,
enable_bottom_sections_after_demo, notifyFormUpdate*/
var demo_input_amount_glowing = false;
var demo_input_amount_glowing_on = false;
var demo_input_address_glowing = false;
var demo_input_address_glowing_on = false;
var demo_copy_address_button_glowing = false;
var demo_copy_address_button_glowing_on = false;

function updateDemoContent() {
  setupTouchLayouts();
  updateToolTips();
}

function moveInOutDemoTransactionSection(inElement, outElement) {
  $(function() {
    if ($(inElement).children().size() === 1) {
      $(outElement).append($('#transference-demo'));
    }
  });
}

function moveOutDemoTransactionSection() { // Save demo transaction content if neccesary
  moveInOutDemoTransactionSection('#transaction-demo', '#transaction-demo-placeholder');
}

function moveInDemoTransactionSection() { // Restore demo transaction content if neccesary
  moveInOutDemoTransactionSection('#transaction-demo-placeholder', '#transaction-demo');
}

function loadDemoContent() {
  if ( $("#demo-content").hasClass('empty-content') ) {
    $("#demo-content").removeClass('empty-content');
    moveOutDemoTransactionSection();
    $("#demo-content").load(addLocale("/demo"), function() {
      moveInDemoTransactionSection();
      updateDemoContent();
      hideAnimatedElements();
      registerDemoParsleyEvents();
    });
  }
}

function showDemoTransaction() {
  if ( ! $("#transference-demo").hasClass('enabled')) {
    // Enable a suggestion in "amount input" field
    $('#demo-input-amount').immybox({
      choices: [
        {text: '0.1', value: '0.1'}
      ],
      showArrow: false
    });
    // Show forms with intro cascade animations
    if ( $("#transference-demo").hasClass('available') &&
        $('#demo-section-3').hasClass('available') &&
        $('#transference-demo').isBottomScrolledIntoView()) { // Only when demo transaction section is displayed
      $("#transference-demo").addClass('enabled');
      setTimeout(function() { // Show with a little delay
        $('#demo-shopping-cart-info').fadeIn(2000, function() {
          setTimeout(function() { // Show with a little delay
            $('#demo-shopping-cart-content').fadeIn('slow', function() {
              $('#demo-wallet-send-info').fadeIn(2000, function() {
                setTimeout(function() { // Show with a little delay
                  $('#demo-wallet-send-content').fadeIn('slow');
                  demo_input_amount_glowing = true;
                  demo_input_address_glowing = true;
                  demo_copy_address_button_glowing = true;
                  startDemoFieldsGlowing();
                }, 1500);
              });
            });
          }, 1500);
        });
      }, 500);
    }
  }
}

function glowInputField(enabled, field) {
  if (enabled && ( ! $(field).parsley().isValid() ) ) {
    $(field).css("box-shadow", "0px 0px 40px #FF5E5E");
  } else {
    $(field).css("box-shadow", "0px 0px 10px #FFF");
  }
}

function startDemoFieldsGlowing() { // Change glow if enabled and call itself in loop
  if (demo_input_amount_glowing || demo_input_address_glowing || demo_copy_address_button_glowing) {
    if (demo_input_amount_glowing) {
      demo_input_amount_glowing_on = ! demo_input_amount_glowing_on;
      glowInputField(demo_input_amount_glowing_on, '#demo-input-amount');
    }
    if (demo_input_address_glowing) {
      demo_input_address_glowing_on = ! demo_input_address_glowing_on;
      glowInputField(demo_input_address_glowing_on, '#demo-pay-to-address-input');
    }
    if (demo_copy_address_button_glowing) {
      demo_copy_address_button_glowing_on = ! demo_copy_address_button_glowing_on;
      if (demo_copy_address_button_glowing_on) {
        $('#copy-demo-button').css("box-shadow", "0px 0px 50px #EA0000");
      } else {
        $('#copy-demo-button').css("box-shadow", "0px 0px 10px #FFF");
      }
    }
    setTimeout(function() { // Show with a little delay
      startDemoFieldsGlowing();
    }, 1800);
  } else {
    $('#demo-input-amount').css("box-shadow", "0px 0px 0px #FFF");
    $('#demo-pay-to-address-input').css("box-shadow", "0px 0px 0px #FFF");
    $('#copy-demo-button').css("box-shadow", "0px 0px 0px #FFF");
  }
}

function fillDemoInputAmount(scope) {
  $('#demo-input-amount').val('0.1');
  if (typeof scope === 'undefined') {
    $('#demo-input-amount').scope().$apply(function() { // Update AngularJS model
      $('#demo-input-amount').scope().input_amount = $('#demo-input-amount').val();
    });
  } else { // Calling from AngularJS scope
    scope.input_amount = $('#demo-input-amount').val();
  }
}

function copyDemoPayToAddres() {
  $("#demo-pay-to-address-input").val($("#demo-pay-to-address").text());
  $("#demo-pay-to-address-input").qtip('disable');
}

function registerDemoParsleyEvents() {
  // Fix automatically commas introduced in the field and replace by dots
  $('#demo-input-amount').parsley().subscribe('parsley:field:validate', function() {
    // Fix when it's not valid and contains commas
    var current_value = $('#demo-input-amount').val();
    if ((! $('#demo-input-amount').parsley().isValid()) &&
       ( current_value.indexOf(",") !== -1 ) ) {
      var res = current_value.replace(",",".");
      $('#demo-input-amount').val(res);
      $('#demo-input-amount').parsley().validate();
    }
  });
}

function enable_bottom_sections_after_demo() {
  $('#show-blockchain-section').fadeIn('slow');
  show_bottom_elements = true; // Enable showing when scrolling
  $("#mining-content").load(addLocale("/mining"));
  $("#mining-POW-content").load(addLocale("/mining-POW"));
}

function notifyFormUpdate() {
  angular.element($('#transference-demo')).scope().doneEditing();
}