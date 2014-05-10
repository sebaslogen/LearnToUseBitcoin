ltubApp.controller('TransactionCtrl', ['$scope', function($scope) {
  $scope.total_bitcoins = 2;
  $scope.disabled = false;
  $scope.failures = 0;
  
  $scope.transactionDemo = function() {
    if ($scope.disabled) {
      return;
    }
    if ($("#demo-transaction-form").parsley().validate()) {
      $("#demo-transaction-send-button").addClass('disabled').qtip('destroy', true);
      $("#demo-transaction-send-button").removeAttr('title');
      $('#demo-pay-to-address-input').attr('disabled', '');
      $('#demo-input-amount').attr('disabled', '');
      $scope.disabled = true;
      if ((getWindowsSize() == "medium") && ( ! $("#demo-transaction-details").isCompletelyScrolledIntoView())) {
        moveTo("#demo-transaction-details"); // Refocus on medium windows to help find the update
      }
      setTimeout(function() { // Show with a little delay to simulate transaction time
        $("#demo-transaction-details").replaceWith($("#ok-purchase").fadeIn("slow"));
        if ($('#confirmation-sound').length > 0) {
          $('#confirmation-sound')[0].play();
        }
        setTimeout(function() { // Show congratulations message and blockchain extra information
          $('#congratulations-demo-modal').foundation('reveal', 'open');
          enable_bottom_sections_after_demo();
        }, 1800);
      }, 1000);
      analytics.track('Click Send demo transaction successful');
    } else { // Log failed attempt data to gather feedback on user difficulties
      $scope.failures++;
      if (( ! $('#demo-input-amount').parsley().isValid()) && ($scope.failures == 2)) {
        fillDemoInputAmount($scope);
        analytics.track('Failed attempt to submit demo transaction', {
          failed_count: $scope.failures,
          valid_amount: $('#demo-input-amount').parsley().isValid(),
          amount_value: $('#demo-input-amount').val(),
          valid_address: $('#demo-pay-to-address-input').parsley().isValid(),
          address_value: $('#demo-pay-to-address-input').val(),
          auto_filled: true
        });
        $('#help-demo-modal').foundation('reveal', 'open');
        $("#demo-transaction-form").parsley().validate();
      } else {
        analytics.track('Failed attempt to submit demo transaction', {
          failed_count: $scope.failures,
          valid_amount: $('#demo-input-amount').parsley().isValid(),
          amount_value: $('#demo-input-amount').val(),
          valid_address: $('#demo-pay-to-address-input').parsley().isValid(),
          address_value: $('#demo-pay-to-address-input').val(),
          auto_filled: false
        });
      }
    }
  }
  
  $scope.remainingBitcoinsFormattedText = function() {
    var result = $scope.remainingBitcoins()
    if (result != $scope.total_bitcoins) {
      return (result + " " + I18n.t("out_of") + " " + $scope.total_bitcoins + " bitcoins " + I18n.t("available"));
    } else {
      return ($scope.total_bitcoins + " bitcoins " + I18n.t("available"));
    }
  }
    
  $scope.remainingBitcoins = function() {
    var result = $scope.total_bitcoins;
    var parsed = parseFloat($scope.input_amount);
    if ( parsed > 0 ) {
      result = $scope.total_bitcoins - parsed;
    }
    // Return the value rounding to 8 decimals and remove trailing zeros
    return result.toFixed(8).replace(/(\.[0-9]*?)0+$/, "$1").replace(/([0-9]*)\.$/, "$1");
  }
  
  $scope.copyAddress = function() { // Copy and validate demo-pay to address
    demo_copy_address_button_glowing = false;
    $('#copy-demo-button').css("box-shadow", "0px 0px 0px #FFF").removeClass('address-info-block-shop-higlighted').addClass('address-info-block-shop');
    if ((getWindowsSize() == "medium") && ( ! $("#demo-pay-to-address-input").isBottomScrolledIntoView())) {
      moveTo("#demo-pay-to-address-input"); // Refocus on medium windows to help find the update
    }
    copyDemoPayToAddres();
    $("#demo-transaction-form").parsley().validate();
    analytics.track('Click Copy demo Bitcoin address');
  }
  
  $scope.showBlockchainSection = function() {
    $("#show-blockchain-section").replaceWith($("#demo-section-blockchain").fadeIn("slow"));
    analytics.track('Click Show Blockchain extra information');
  }
  
  $scope.discardDemoModal = function() {
    $('#congratulations-demo-modal').foundation('reveal', 'close');
    moveTo('#show-blockchain-section');
    analytics.track('Click Show more information from demo Send successful modal');
  }
  
  $scope.disableAddressGlowing = function() {
    
    if ( ! $('#demo-pay-to-address-input').parsley().isValid() ) {
      demo_copy_address_button_glowing = true;
      $('#copy-demo-button').removeClass('address-info-block-shop').addClass('address-info-block-shop-higlighted');
    } else {
      demo_input_address_glowing = false;
      $('#demo-pay-to-address-input').css("box-shadow", "0px 0px 0px #FFF");
    }
  }
  
  $scope.disableAmountGlowing = function() {
    if ( $('#demo-input-amount').parsley().isValid() ) {
      demo_input_amount_glowing = false;
      $('#demo-input-amount').css("box-shadow", "0px 0px 0px #FFF");
    }
  }
}]);