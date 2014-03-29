ltubApp.controller('TransactionCtrl', ['$scope', function($scope) {
  $scope.total_bitcoins = 2;
  $scope.disabled = false;
  
  $scope.transactionDemo = function() {
    if ($scope.disabled) {
      return;
    }
    if ($("#demo-transaction-form").parsley().validate()) {
      $("#demo-transaction-send-button").addClass('disabled').qtip('destroy', true);
      $("#demo-transaction-send-button").removeAttr('title');
      $('#demo-pay-to-address-input').attr('disabled', '');
      $('#demo-input-amount').attr('disabled', '');
      $('#demo-remaining-bitcoins').text($scope.remainingBitcoins() + " bitcoins available");
      $scope.disabled = true;
      if ((isMediumScreen()) && ( ! $("#demo-transaction-details").isScrolledIntoView())) {
        moveTo("#demo-transaction-details"); // Refocus on medium windows to help find the update
      }
      setTimeout(function() { // Show with a little delay to simulate transaction time
        $("#demo-transaction-details").replaceWith($("#ok-purchase").fadeIn("slow"));
        $('#confirmation-sound')[0].play();
        setTimeout(function() { // Show congratulations message
          $('#congratulations-demo-modal').foundation('reveal', 'open');
        }, 1800);
      }, 1000);
    }
  }
  
  $scope.remainingBitcoinsFormattedText = function() {
    var result = $scope.remainingBitcoins()
    if (result != $scope.total_bitcoins) {
      return (result + " out of " + $scope.total_bitcoins + " bitcoins available");
    } else {
      return ($scope.total_bitcoins + " bitcoins available");
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
    if ((isMediumScreen()) && ( ! $("#demo-pay-to-address-input").isBottomScrolledIntoView())) {
      moveTo("#demo-pay-to-address-input"); // Refocus on medium windows to help find the update
    }
    $("#demo-pay-to-address-input").val($("#demo-pay-to-address").text());
    $("#demo-transaction-form").parsley().validate();
  }
  
  $scope.showBlockchainSection = function() {
    $("#show-blockchain-section").replaceWith($("#demo-section-blockchain").fadeIn("slow"));
  }
  
  $scope.discardDemoModal = function() {
    $('#congratulations-demo-modal').foundation('reveal', 'close');
    moveTo('#show-blockchain-section');
  }
}]);