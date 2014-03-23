function TransactionCtrl ($scope) {
  $scope.total_bitcoins = 2;
  $scope.transactionDemo = function() {
    $("#demo-transaction-form").parsley().validate();
    console.log("Started transaction demo");
  }
  /*$scope.$watch('input_amount', function() {
    
  }, true);*/
  $scope.remainingBitcoins = function() {
    var result = $scope.total_bitcoins;
    var parsed = parseFloat($scope.input_amount);
    if ( parsed > 0 ) {
      result = $scope.total_bitcoins - parsed;
    }
    return result.toPrecision(8);
  }
}