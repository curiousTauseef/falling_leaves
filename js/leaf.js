/* global: getWindVelocity */

var Leaf = function() {
  var scope = this;
  this.setupGeometry();
  this.reset();
}
Leaf.prototype = new Object();
Leaf.prototype.constructor = Leaf;
Leaf.numLeaves = 100;
Leaf.maxStickTime = 100;

// Instance methods


Leaf.prototype.reset = function() {
  this.stuck = false;
  this.bodyPart = undefined;
  this.stickTime = 0;
  this.geometry.material.opacity = 1.0;
  this.geometry.position = new THREE.Vector3((Math.random() * 10) - 5, (Math.random() * 20) + 10, (Math.random() * 10));
  this.initialRotation = new THREE.Vector3(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
  this.geometry.rotation.set(this.initialRotation.x, this.initialRotation.y, this.initialRotation.z);

  this.rotationDetails = { x: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) },
                           y: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) },
                           z: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) }};

  var size = 0.05 + 0.1 * Math.random();
  this.mass = 1.0;
  this.velocity = new THREE.Vector3(0,0,0);
  this.geometry.scale.set(size, size, size);
};

Leaf.prototype.tick = function() {

  if (!this.stuck && this.geometry.position.y > -0.1 && !this.bodyPart) {
    // Changing this time step will speedup the simulation.
    var dt = 0.00675;

    // Sum your forces into fx and fy.
    var fx = getWindVelocity();
    var fy = -9.8 + this.velocity.y * this.velocity.y;
    var fz = 0;

    // check for near body
    hitBodyTest(this);

    // Improved Euler integration
    var ax = fx * 1.0 / this.mass;
    var ay = fy * 1.0 / this.mass;
    this.geometry.position.x += (this.velocity.x * dt) + (ax * 0.5 * dt * dt);
    this.geometry.position.y += (this.velocity.y * dt) + (ay * 0.5 * dt * dt);
    this.velocity.x += ax * dt;
    this.velocity.y += ay * dt;

    // Random rotations
    var t = Leaf.time();
    if (!this.bodyPart) // stop rotating when stuck to body
        this.geometry.rotation.set(this.rotationDetails.x.initial * Math.sin((t / this.rotationDetails.x.speed) + this.rotationDetails.x.phase),
                                   this.rotationDetails.y.initial * Math.sin((t / this.rotationDetails.y.speed) + this.rotationDetails.y.phase),
                                   this.rotationDetails.z.initial * Math.sin((t / this.rotationDetails.z.speed) + this.rotationDetails.z.phase));
  } else {
      this.stuck = true;
  }
  
  if (this.stuck && !this.bodyPart) {
    this.stickTime += 1;
    this.geometry.material.opacity = (Leaf.maxStickTime - this.stickTime) / Leaf.maxStickTime;
    if (this.stickTime > Leaf.maxStickTime) {
      this.reset();
    }
  }
};

Leaf.prototype.setupGeometry = function() {
  var texture = Leaf.textures[parseInt(Math.random() * Leaf.textures.length)];
  this.geometry = new THREE.Mesh(Leaf.models.plane, new THREE.MeshBasicMaterial( { map: texture, transparent: true, depthTest: false, color: Math.random() * 0xffffff } ));
  this.geometry.doubleSided = true;
    /*
    this.geometry = new THREE.Mesh(Leaf.models.plane,
                               new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
                               );
    */
    
};

// Class methods

Leaf.tick = function() {
  for (var i = Leaf.leaves.length - 1; i >= 0; i--) {
    Leaf.leaves[i].tick();
  }
};

Leaf.time = function() {
  return (new Date()).getTime();
}

Leaf.models = {};
Leaf.textures = [];
Leaf.leaves = [];
Leaf.makeLeaves = function(scene) {
  Leaf.loadModels(function() {
    for (var i = 0; i < Leaf.numLeaves; i++) {
      var leaf = Leaf.leaves[i] = new Leaf();
      scene.add(leaf.geometry);
    }
  });
};

Leaf.loadModels = function(callback) {
//  var modelLoaded = function(name) {
//    return function(geometry) {
//      geometry.materials[0].shading = THREE.FlatShading;
//      geometry.materials[0].morphTargets = true;
//      Leaf.models[name] = geometry;
//      callback();
//    }
//  };
//  var loader = new THREE.JSONLoader();
//  loader.createModel( leafView1, modelLoaded('leaf'), null );

  var loaded = 0;
  function checkIfLoaded() {
    loaded += 1
    if (loaded == 4) callback();
  }

  Leaf.models.plane = new THREE.PlaneGeometry(10, 10);
  //Leaf.models.plane = new THREE.CubeGeometry( 1.0, 1.0, 1.0 );
  Leaf.models.leaf = new LeafObj();
  Leaf.textures.push(THREE.ImageUtils.loadTexture("js/obj/Leaf_8_Color.png", THREE.UVMapping, checkIfLoaded));
  Leaf.textures.push(THREE.ImageUtils.loadTexture("js/obj/leafX.png", THREE.UVMapping, checkIfLoaded));
  Leaf.textures.push(THREE.ImageUtils.loadTexture("js/obj/leafY.png", THREE.UVMapping, checkIfLoaded));
  Leaf.textures.push(THREE.ImageUtils.loadTexture("js/obj/leafZ.png", THREE.UVMapping, checkIfLoaded));
};
