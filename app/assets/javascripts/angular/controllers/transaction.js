function TransactionCtrl ($scope) {
  $scope.transactionDemo = function() {
    console.log("Started transaction demo");
  }
  /*$scope.$watch('input_amount', function() {
    
  }, true);*/
  $scope.remainingBitcoins = function() {
    console.log("calculating");
    if (parseInt()) {
      return 1 - $scope.input_amount;
    } else {
      return 1;
    }
  }
}