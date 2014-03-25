
function updateDemoContent() {
  $('div.sStart').height('100%'); // Change from fixed to auto adjust height after load
  updateToolTips();
}

function moveOutDemoTransactionSection() { // Save demo transaction content if neccesary
  $(document).ready(function() {
    if ($('#transactionDemo').children().size() == 1) {
      $('#transactionDemoPlaceholder').append($('#transference-demo'));
    }
  });
}

function moveInDemoTransactionSection() { // Restore demo transaction content if neccesary
  $(document).ready(function() {
    if ($('#transactionDemoPlaceholder').children().size() == 1) {
      $('#transactionDemo').append($('#transference-demo'));
    }
  });
}

function loadDemoContent() {
  if ( ( $("#demo-content").hasClass('empty-content') || $("#demo-content").hasClass('normal-content') )
      && isSmallScreen() ) { // Window is small
    $("#demo-content").addClass('small-content').removeClass('empty-content').removeClass('normal-content');
    moveOutDemoTransactionSection();
    $("#demo-content").load("/demo-small", function() {
      updateDemoContent();
    });
  } else if ( ( $("#demo-content").hasClass('empty-content') || $("#demo-content").hasClass('small-content') )
      && ( ! isSmallScreen() ) ) { // Window is medium/big
    $("#demo-content").addClass('normal-content').removeClass('empty-content').removeClass('small-content');
    $("#demo-content").load("/demo", function() {
      moveInDemoTransactionSection();
      updateDemoContent();
    });
  }
}

function showDemoTransaction() {
  if ( $("#demo-content").parent().hasClass('section') &&
       $('#transference-demo').isScrolledIntoView() ) { // Only when demo is displayed
    console.log('bottom: '+$('#transference-demo').isScrolledIntoView());
  }
}