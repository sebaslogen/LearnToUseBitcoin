function TransactionCtrl ($scope) {
  $scope.total_bitcoins = 2;
  
  $scope.transactionDemo = function() {
    if ($("#demo-transaction-form").parsley().validate()) {
      console.log("Started transaction demo"); 
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
}