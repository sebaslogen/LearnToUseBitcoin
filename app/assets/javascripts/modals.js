$(document).on('opened', '#mining-info-modal', function () {
  console.log('Click Show Mining information');
  analytics.track('Click Show Mining information');
});

$(document).on('opened', '#mining-POW-modal', function () {
  console.log('Click Mining POW');
  analytics.track('Click Mining POW');
});