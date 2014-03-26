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
      $scope.disabled = true;
      setTimeout(function() { // Show with a little delay to simulate transaction time
        $("#demo-transaction-details").replaceWith($("#ok-purchase").fadeIn("slow"));
      }, 1000);
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
    $('#demo-pay-to-address-input').val($("#demo-pay-to-address").text());
    $("#demo-transaction-form").parsley().validate();
  }
  
  $scope.showBlockchainSection = function() {
    $("#show-blockchain-section").replaceWith($("#demo-section-blockchain").fadeIn("slow"));
  }
}]);