$(document).on('open', '#WIP-modal', function () {
  loadLocalBitcoinSellers();
  analytics.track('Click Get first bitcoins');
});

$(document).on('opened', '#mining-info-modal', function () {
  analytics.track('Click Show Mining information');
});

$(document).on('opened', '#mining-POW-modal', function () {
  analytics.track('Click Mining POW');
});