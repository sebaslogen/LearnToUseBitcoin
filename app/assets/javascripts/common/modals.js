$(document).on('open', '#WIP-modal', function () {
  loadLocalBitcoinSellers();
  analytics.track('Click Get first bitcoins');
});

$(document).on('opened', '#WIP-modal', function () {
  fixModalPosition(this);
});

$(document).on('opened', '#mining-info-modal', function () {
  fixModalPosition(this);
  analytics.track('Click Show Mining information');
});

$(document).on('opened', '#mining-POW-modal', function () {
  //fixModalPosition(this);
  analytics.track('Click Mining POW');
});

$(document).on('opened', '#help-demo-modal', function () {
  fixModalPosition(this);
});

$(document).on('opened', '#congratulations-demo-modal', function () {
  fixModalPosition(this);
});

function fixModalPosition(element) {
  $(element).css({
    top: '50px',
    position: 'fixed',
    'z-index': 1000
  });
}