ltubApp.controller('LearningCtrl', ['$scope', function($scope) {
  $scope.showContinueLearning = function() {
    $('#show-continue-learning').fadeOut("slow", function() {
      $('#show-continue-learning').replaceWith($("#continue-learning-content").fadeIn("slow", function() {
        $("#continue-learning-content").addClass('available');
      }));
      $("#continue-learning-content").removeClass('hidden');
      updateSizes();
      moveTo('#continue-learning-content');
      showAnimatedContinueLearningElements();
      analytics.track('Click Continue Learning', {
        small: (getWindowsSize() == "small"),
        language: I18n.locale
      });
    });
  }
}]);