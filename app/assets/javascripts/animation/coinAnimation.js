var world;
var FPS = 30;
var physicsBody = null;
var frames = 0;
var coinAnimationEnd = false;

requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  setTimeout;

function init() {
  var   b2Vec2 = Box2D.Common.Math.b2Vec2
   ,  b2BodyDef = Box2D.Dynamics.b2BodyDef
   ,  b2Body = Box2D.Dynamics.b2Body
   ,  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
   ,  b2Fixture = Box2D.Dynamics.b2Fixture
   ,  b2World = Box2D.Dynamics.b2World
   ,  b2MassData = Box2D.Collision.Shapes.b2MassData
   ,  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
   ,  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ;
   
  world = new b2World(
       new b2Vec2(0, 10)    //gravity
    ,  true                 //allow sleep
  );

  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

  var bodyDef = new b2BodyDef;

  //create ground left down
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = 2;
  bodyDef.position.y = 2;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(5.8, 0.5);
  var surface = world.CreateBody(bodyDef);
  var radians = 40 * (Math.PI / 180);
  surface.SetAngle(radians);
  surface.CreateFixture(fixDef);

  //create ground right up
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = 8;
  bodyDef.position.y = 2;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(7, 0.5);
  var surface = world.CreateBody(bodyDef);
  var radians = 65 * (Math.PI / 180);
  surface.SetAngle(radians);
  surface.CreateFixture(fixDef);

  //create ground 2
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = 9;
  bodyDef.position.y = 8;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(7, 0.5);
  var surface = world.CreateBody(bodyDef);
  var radians = -60 * (Math.PI / 180);
  surface.SetAngle(radians);
  surface.CreateFixture(fixDef);

  //create some objects
  bodyDef.type = b2Body.b2_dynamicBody;
  fixDef.shape = new b2CircleShape(1); // radius 1
  bodyDef.position.x = 3;
  bodyDef.position.y = 1;
  physicsBody = world.CreateBody(bodyDef);
  physicsBody.CreateFixture(fixDef);
   
  //setup debug draw
  /**var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
  var debugDraw = new b2DebugDraw();
  debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
  debugDraw.SetDrawScale(30.0);
  debugDraw.SetFillAlpha(0.3);
  debugDraw.SetLineThickness(1.0);
  debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
  world.SetDebugDraw(debugDraw);****/
     
  //window.setInterval(update, 1000 / FPS);
  requestAnimationFrame( animateCoin );
}

function animateCoin() {
  setTimeout(function() {
    if ( ! coinAnimationEnd ) {
      updatePhysics();
      drawBackground();
      frames++;
      if (frames > 100) {
        coinAnimationEnd = true;
        return;
      }
    }
    requestAnimationFrame( animateCoin );
  }, 1000 / FPS); // Dynamic background drawn half times than foreground
}

function updatePhysics() {
  world.Step(
      1 / FPS   //frame-rate
    ,  10       //velocity iterations
    ,  10       //position iterations
  );
  ////////////////////////////////////////////////////world.DrawDebugData();
  world.ClearForces();
  console.log('Fixure position x:'+physicsBody.GetPosition().x+',y:'+physicsBody.GetPosition().y+',angle:'+physicsBody.GetAngle());
}

function drawBackground() { // Draw background with moving sun and score
  var img = document.getElementById("bitcoin-logo-image");
  var pos = physicsBody.GetPosition(); // Update position
  var angle = physicsBody.GetAngle(); // Update angle
  var canvas = document.getElementById('coin-canvas');
  var context = canvas.getContext('2d');
  console.log('rendering in ', pos.x, pos.y, 'with angle:', angle);
  context.clearRect(0, 0, canvas.width, canvas.height); // First clean up screen
  context.fillStyle = 'rgba(250,250,120,1)'; // Show first draw to user in a few milliseconds after HTML is loaded
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, pos.x, pos.y);
}

console.log('loaded coinAnimation');