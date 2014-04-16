
var FPS = 20;
var coinAnimationEnd = false;
var gPhysicsEngine = null;

Array.prototype.erase = function (item) {
  for (var i = this.length; i--; i) {
    if (this[i] === item) this.splice(i, 1);
  }
  
  return this;
};

Function.prototype.bind = function (bind) {
  var self = this;
  return function () {
    var args = Array.prototype.slice.call(arguments);
    return self.apply(bind || null, args);
  };
};

merge = function (original, extended) {
  for (var key in extended) {
    var ext = extended[key];
    if (typeof (ext) != 'object' || ext instanceof Class) {
      original[key] = ext;
    } else {
      if (!original[key] || typeof (original[key]) != 'object') {
        original[key] = {};
      }
      merge(original[key], ext);
    }
  }
  return original;
};

function copy(object) {
  if (!object || typeof (object) != 'object' || object instanceof Class) {
    return object;
  } else if (object instanceof Array) {
    var c = [];
    for (var i = 0, l = object.length; i < l; i++) {
      c[i] = copy(object[i]);
    }
    return c;
  } else {
    var c = {};
    for (var i in object) {
      c[i] = copy(object[i]);
    }
    return c;
  }
}

function ksort(obj) {
  if (!obj || typeof (obj) != 'object') {
    return [];
  }
  
  var keys = [],
      values = [];
  for (var i in obj) {
    keys.push(i);
  }
  
  keys.sort();
  for (var i = 0; i < keys.length; i++) {
    values.push(obj[keys[i]]);
  }
  
  return values;
}

// -----------------------------------------------------------------------------
// Class object based on John Resigs code; inspired by base2 and Prototype
// http://ejohn.org/blog/simple-javascript-inheritance/
(function () {
  var initializing = false,
      fnTest = /xyz/.test(function () {
        xyz;
      }) ? /\bparent\b/ : /.*/;
  
  this.Class = function () {};
  var inject = function (prop) {
    var proto = this.prototype;
    var parent = {};
    for (var name in prop) {
      if (typeof (prop[name]) == "function" && typeof (proto[name]) == "function" && fnTest.test(prop[name])) {
        parent[name] = proto[name]; // save original function
        proto[name] = (function (name, fn) {
          return function () {
            var tmp = this.parent;
            this.parent = parent[name];
            var ret = fn.apply(this, arguments);
            this.parent = tmp;
            return ret;
          };
        })(name, prop[name]);
      } else {
        proto[name] = prop[name];
      }
    }
  };
  
  this.Class.extend = function (prop) {
    var parent = this.prototype;
    
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    for (var name in prop) {
      if (typeof (prop[name]) == "function" && typeof (parent[name]) == "function" && fnTest.test(prop[name])) {
        prototype[name] = (function (name, fn) {
          return function () {
            var tmp = this.parent;
            this.parent = parent[name];
            var ret = fn.apply(this, arguments);
            this.parent = tmp;
            return ret;
          };
        })(name, prop[name]);
      } else {
        prototype[name] = prop[name];
      }
    }
    
    function Class() {
      if (!initializing) {
        
        // If this class has a staticInstantiate method, invoke it
        // and check if we got something back. If not, the normal
        // constructor (init) is called.
        if (this.staticInstantiate) {
          var obj = this.staticInstantiate.apply(this, arguments);
          if (obj) {
            return obj;
          }
        }
        
        for (var p in this) {
          if (typeof (this[p]) == 'object') {
            this[p] = copy(this[p]); // deep copy!
          }
        }
        
        if (this.init) {
          this.init.apply(this, arguments);
        }
      }
      
      return this;
    }
    
    Class.prototype = prototype;
    Class.constructor = Class;
    Class.extend = arguments.callee;
    Class.inject = inject;
    
    return Class;
  };
  
})();

newGuid_short = function () {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4()).toString();
};

// These are global shorthands we declare for Box2D primitives
// we'll be using very frequently.
var Vec2 = Box2D.Common.Math.b2Vec2;
var BodyDef = Box2D.Dynamics.b2BodyDef;
var Body = Box2D.Dynamics.b2Body;
var FixtureDef = Box2D.Dynamics.b2FixtureDef;
var Fixture = Box2D.Dynamics.b2Fixture;
var World = Box2D.Dynamics.b2World;
var MassData = Box2D.Collision.Shapes.b2MassData;
var PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var DebugDraw = Box2D.Dynamics.b2DebugDraw;
var RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

PhysicsEngineClass = Class.extend({
  world: null,
  
  PHYSICS_LOOP_HZ: 1.0 / FPS,
  
  //-----------------------------------------
  create: function () {
    gPhysicsEngine.world = new World(
      new Vec2(0, 300), // Gravity vector
      false           // Don't allow sleep
    );
  },
  
  //-----------------------------------------
  update: function () {
    var start = Date.now();
    
    gPhysicsEngine.world.Step(
      gPhysicsEngine.PHYSICS_LOOP_HZ,    //frame-rate
      10,                 //velocity iterations
      10                  //position iterations
    );
    gPhysicsEngine.world.ClearForces();
    
    return (Date.now() - start);
  },
  
  //-----------------------------------------
  addContactListener: function (callbacks) {
    var listener = new Box2D.Dynamics.b2ContactListener();
    
    if (callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
      callbacks.PostSolve(contact.GetFixtureA().GetBody(),
                          contact.GetFixtureB().GetBody(),
                          impulse.normalImpulses[0]);
    };
    
    gPhysicsEngine.world.SetContactListener(listener);
  },
  
  //-----------------------------------------
  registerBody: function (bodyDef) {
    var body = gPhysicsEngine.world.CreateBody(bodyDef);
    return body;
  },
  
  //-----------------------------------------
  addBody: function (entityDef) {
    var bodyDef = new BodyDef();
    
    var id = entityDef.id;
    
    if (entityDef.type == 'static') {
      bodyDef.type = Body.b2_staticBody;
    } else {
      bodyDef.type = Body.b2_dynamicBody;
    }
    
    bodyDef.position.x = entityDef.x;
    bodyDef.position.y = entityDef.y;
    
    if (entityDef.userData) bodyDef.userData = entityDef.userData;
    
    var body = this.registerBody(bodyDef);
    var fixtureDefinition = new FixtureDef();
    
    if (entityDef.useBouncyFixture) {
      fixtureDefinition.density = 1.0;
      fixtureDefinition.friction = 0;
      fixtureDefinition.restitution = 1.0;
    }
    
    // Now we define the shape of this object as a box
    fixtureDefinition.shape = new PolygonShape();
    fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
    body.CreateFixture(fixtureDefinition);
    
    return body;
  },
  
  //-----------------------------------------
  removeBody: function (obj) {
    gPhysicsEngine.world.DestroyBody(obj);
  }
  
});

requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  setTimeout;







var physBody = null;

function startCoinAnimation() {
  if (! autoscrolled) {
    gPhysicsEngine = new PhysicsEngineClass();
    $('#coin-canvas').css({ // Position of the reference logo
      'position': 'fixed',
      'margin': $('#bitcoin-logo').offset().top+'px 0 0 '+$('#bitcoin-logo').offset().left+'px'//33.5%'
    });
    console.log('start coin animation');
    var entityDef = { // Create our physics body;
      id: "coin",
      type: 'static',
      x: 0,
      y: 0,
      halfHeight: 180, // Bounding collision box size for the player
      halfWidth: 200,
      angle: 0
    };
    gPhysicsEngine.create();
    physBody = gPhysicsEngine.addBody(entityDef); // Initialize physic body of coin
    physBody.SetLinearVelocity(new Vec2(0, 0));//Vec2(1, 0)
    physBody.linearDamping = 0;
    requestAnimationFrame( animateCoin );
    ///////////////gPhysicsEngine.removeBody(physBody);
  }
}

function animateCoin() {
  setTimeout(function() {
    if ( ! coinAnimationEnd ) {
      updatePhysics();
      drawBackground();
      coinAnimationEnd = true;
    }
    requestAnimationFrame( animateCoin );
  }, 1000 / FPS); // Dynamic background drawn half times than foreground
}

function updatePhysics() {
  //sun_angle += 0.002; // Sun rotation speed
  /// Physics engine plus manual collision detections take place here ///
  if (typeof gPhysicsEngine !== 'undefined') {
    gPhysicsEngine.update(); // Update physics
  }
  if (physBody) {
    var pos = physBody.GetPosition(); // Update position
    var angle = physBody.GetAngle(); // Update angle
  }
}

function drawBackground() { // Draw background with moving sun and score
  var img = document.getElementById("bitcoin-logo-image");
  var pos = physBody.GetPosition();
  var canvas = document.getElementById('coin-canvas');
  var context = canvas.getContext('2d');
  context.fillStyle = 'rgba(250,250,120,1)'; // Show first draw to user in a few milliseconds after HTML is loaded
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, pos.x, pos.y);
  /*if (this.sprites_loaded == 1) { // Draw only when images are loaded
    this.sprites_loaded = 2; // Never draw it again
    var tree_context = document.getElementById('TreeCanvas').getContext('2d');
    drawSprite('tree.png', 1100, 420, 0, tree_context); // Draw tree on top of future score text
  }
  dynamic_background_context.clearRect(0, 0, dynamic_background_canvas.width, dynamic_background_canvas.height); // Clear background
  // Draw sun on top of circular glow
  drawSprite('sol.png', 1420, 170, sun_angle, dynamic_background_context); // Draw sun
  // Draw Score
  if (this.scrore_frames > 0) {
    dynamic_background_context.font = 'bold 500pt ' + game_font;
    var points_color = Math.round(this.player0.points * 255 / end_of_game_points);
    dynamic_background_context.fillStyle = 'rgba(' + points_color + ',0,' + (255 - points_color) + ',1)';
    dynamic_background_context.textAlign = 'center';
    dynamic_background_context.fillText(this.player0.points, canvas.width / 2, canvas.height / 2 + 200);
    this.scrore_frames = (this.scrore_frames + 1) % (FPS + 2); // Show for one second
    if (victory) {
      this.scrore_frames = (FPS + 1);
    }
  }*/
}