var world;
var FPS = 30;
var frames = 0;
var scale = 32;
var physicsBody = null;
var coinAnimationStarted = false;
var coinAnimationFinished = false;
var coinAnimationClosed = false;
var coinImage = {
  width: 0,
  height: 0,
  half_x: 0,
  half_y: 0
};
var verticalCoinAnimationLimit = 0;
var FPSLastCalledTime;
var measuredFPS;

requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  setTimeout;

function startCoinAnimation() {
  if ( autoscrolled || // Cancel animation if page already scrolled
    ( $(window).scrollTop() >= parseInt($('#welcome').css('height')) ) ) {
    finishCoinAnimation();
    return;
  }
  
  getImageDimension($('#bitcoin-logo-image'), function(d) {
    coinImage = {
      width: d.width,
      height: d.height,
      half_x: - d.width / 2,
      half_y: - d.height / 2
    };
  });
  
  positionCoinAnimationCanvas();
  
  verticalCoinAnimationLimit = $('#coin-canvas').height() + (2 * coinImage.height);
  
  var b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2Body = Box2D.Dynamics.b2Body,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2World = Box2D.Dynamics.b2World,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
   
  world = new b2World(
    new b2Vec2(0, 10),   //gravity
    false                 //allow sleep
  );

  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

  var bodyDef = new b2BodyDef;

  // create ground left down
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = 0;
  bodyDef.position.y = 2.95;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(8.5, 0.5);
  var surface = world.CreateBody(bodyDef);
  var radians = 20 * (Math.PI / 180);
  surface.SetAngle(radians);
  surface.CreateFixture(fixDef);

  // create ground right down
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = 11;
  bodyDef.position.y = 9;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(3, 0.5);
  var surface = world.CreateBody(bodyDef);
  var radians = 60 * (Math.PI / 180);
  surface.SetAngle(radians);
  surface.CreateFixture(fixDef);

  //create Coin object
  bodyDef.type = b2Body.b2_dynamicBody;
  fixDef.shape = new b2CircleShape(1); // radius 1
  bodyDef.position.x = 2;
  bodyDef.position.y = 2;
  physicsBody = world.CreateBody(bodyDef);
  physicsBody.CreateFixture(fixDef);
  
  setTimeout(function() { // Start animation one second later
    requestAnimationFrame( animateCoin ); // Start animation
  }, 2000);
  coinAnimationStarted = true;
}

function animateCoin() {
  setTimeout(function() {
    if ( ! coinAnimationFinished ) {
      updatePhysics();
      draw();
      frames++;
      if ((frames > 200) || coinAnimationFinished) {
        finishCoinAnimation();
      } else {
        requestAnimationFrame( animateCoin );
        measureFPSPerformance();
      }
    }
  }, 1000 / FPS); // Dynamic background drawn half times than foreground
}

function finishCoinAnimation() {
  if ( ! coinAnimationClosed ) {
    coinAnimationClosed = true;
    coinAnimationFinished = true;
    var canvas = document.getElementById('coin-canvas');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // Clear canvas on finish
    $('#coin-canvas').remove();
    autoScrollToWelcome();
    if (frames > 100) {
      analytics.track('Watched coin intro animation');
    }
  }
}

function updatePhysics() {
  world.Step(
    1 / FPS,  //frame-rate
    10,       //velocity iterations
    10);      //position iterations
  world.ClearForces();
}

function draw() {
  var img = document.getElementById("bitcoin-logo-image");
  var pos = physicsBody.GetPosition(); // Update position
  var angle = physicsBody.GetAngle(); // Update angle
  var canvas = document.getElementById('coin-canvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height); // First clean up screen
  var posX = scale * pos.x;
  var posY = scale * pos.y;
  _drawImageInternal(img, posX, posY, angle, context);
  if (posY > verticalCoinAnimationLimit ) {
    coinAnimationFinished = true;
  }
}

function _drawImageInternal(image, posX, posY, angle, draw_context) {
  if ((typeof draw_context === 'undefined') || (draw_context == null)) {
    draw_context = context; // Use default drawing canvas if no other is defined
  }
  var target_x = coinImage.half_x;
  var target_y = coinImage.half_y;
  if ((typeof angle !== 'undefined') && (angle != null)) { // Paint rotated object
    draw_context.translate(posX, posY);
    draw_context.rotate(angle);
    draw_context.drawImage(image, 0, 0, coinImage.width, coinImage.height, target_x, target_y, coinImage.width, coinImage.height);
    draw_context.rotate(-angle);
    draw_context.translate(-posX, -posY);
  } else {
    target_x += posX;
    target_y += posY;
    draw_context.drawImage(image, target_x, target_y);
  }
}

function measureFPSPerformance() {
  // Measure FPS to determine if it's worth to continue animation or the performance is too bad
  if ((frames > 2) && (frames < 10)) {
    if (!FPSLastCalledTime) {
      FPSLastCalledTime = new Date().getTime();
      measuredFPS = 0;
    } else {
      delta = (new Date().getTime() - FPSLastCalledTime)/1000;
      FPSLastCalledTime = new Date().getTime();
      var prevMeasuredFPS = measuredFPS;
      measuredFPS = 1/delta;
      var averageFPS = (prevMeasuredFPS + measuredFPS) / 2;
      if ((prevMeasuredFPS > 0) && (averageFPS < 20)){
        finishCoinAnimation();
      }
    }
  }
}

function positionCoinAnimationCanvas() {
  $('#coin-canvas').css({ // Position of the reference logo
    'position': 'fixed',
    'margin': $('#bitcoin-logo').offset().top+'px 0 0 '+$('#bitcoin-logo').offset().left+'px'
  });
}

function getImageDimension(el, onReady) {    
  var src = typeof el.attr === 'function' ? el.attr('src') : el.src !== undefined ? el.src : el;  
  var image = new Image();
  image.onload = function(){
    if (typeof(onReady) == 'function') {
      onReady({
        width: image.width,
        height: image.height
      });
    }
  };
  image.src = src;
}