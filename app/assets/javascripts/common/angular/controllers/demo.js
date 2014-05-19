ltubApp.controller('DemoCtrl', ['$scope', function($scope) {
  $scope.showDemo = function() {
    if ( $("#demo-content").hasClass('empty-content') ) {
      loadDemoContent(); // Load immediately if requested earlier than expected
    }
    $('#show-demo').fadeOut("slow", function() {
      $('div.sStart').height('100%'); // Change from fixed to auto adjust height after load
      $('#show-demo').replaceWith($("#demo-content").fadeIn("slow", function() {
        $("#demo-content").addClass('available');
      }));
      $("#demo-content").removeClass('hidden');
      updateSizes();
      moveTo('#demo-content');
      showAnimatedElements();
      $('#transference-demo').addClass('available');
      if ( getWindowsSize() == "small" ) { // Auto-fill form on mobile devices
        $(document).ready(function() { // Wait for demo content to load
          fillDemoInputAmount();
          copyDemoPayToAddres();
          $("#demo-transaction-form").parsley().validate();
        });
      }
      analytics.track('Click Discover Bitcoin', {
        small: (getWindowsSize() == "small"),
        language: I18n.locale
      });
    });
  }
}]);