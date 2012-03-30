/* global: getWindVelocity, leafMode */

var Leaf = function() {
  var scope = this;
  this.setupGeometry();
  this.reset();
}
Leaf.prototype = new Object();
Leaf.prototype.constructor = Leaf;
Leaf.numLeaves = 1000;
Leaf.maxStickTime = 50;
Leaf.bodyStickTime = 5000000;
Leaf.bounceForceDecay = 0.3; // force decay per time tick
// Instance methods


Leaf.prototype.reset = function() {
    removeLeafFromBody(this);
    this.stuck = false;
    this.bodyPart = undefined;
    this.wasStuck = false;
    this.stickTime = 0;
    this.forceX = 0;  // When leaf bounces off skeleton, force is applied.
    this.forceY = 0;  
    this.forceZ = 0;
    this.geometry.material.opacity = 1.0; // 14.5
    //this.geometry.position = new THREE.Vector3((Math.random() * 10) - 5, (Math.random() * 20) + 10, (Math.random() * 10));
    this.geometry.position = new THREE.Vector3((Math.random() * 0.001) + 18, (Math.random() * 20) + 10, (Math.random() * 4) + 1);
    this.initialRotation = new THREE.Vector3(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
    this.geometry.rotation.set(this.initialRotation.x, this.initialRotation.y, this.initialRotation.z);

    this.rotationDetails = { x: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) },
                             y: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) },
                             z: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) }};

    var size = 0.03 + 0.06 * Math.random();
    //var size = 0.02 + 0.02 * Math.random();
    this.mass = 1.0;
    this.velocity = new THREE.Vector3(0,0,0);
    this.throwVelocity = new THREE.Vector3(0,0,0); // A momentary velocity applied when the leaves are thrown from the body.
    this.geometry.scale.set(size, size, size);
};

var leafTickCount = 0;
Leaf.prototype.tick = function() {

    leafTickCount++;

    if (!this.stuck && this.geometry.position.y > -0.1 && !this.bodyPart) {
        // Changing this time step will speedup the simulation.
        //var dt = 0.00675;
        //var dt = 0.005;
        //var dt = 0.1;
        var dt = globalDt;

        // check for near body
        if (!this.wasStuck) {
            if (! ((this.geometry.position.y > 5) || (this.geometry.position.x > 5) ||
                   (this.geometry.position.x < -5) || (this.geometry.position.z < 0) ||
                   (this.geometry.position.z > 7)) ) {
                hitBodyTest(this);
            }
        }

        // Sum your forces into fx and fy.
        //var fx = 0;
        //var fx = -9.8; // -9.8 + this.velocity.x * this.velocity.x + this.forceX;
        // NOTE(tracy): Disabling perlinNoise for now.  Random x-oriented wind force wastes too many
        // leaves on areas outside of skeleton reach.
        // TODO(tracy): Implement bounding box and immediately reset any leaf outside of bounding box. We will
        // still waste some leaves to the right, directly below the drop point.
        // var windX = perlinNoise[leafTickCount % perlinNoise.length];
        //var fx = -18.6 * windX;
        var fx = -9.8;
        //var fx = getWindVelocity();
        var fy = -9.8; // + this.velocity.y * this.velocity.y + this.forceY;
        //var fz = -9.8 * windX; // this.forceZ;
        var fz = 0.0;
        
        // TODO(tracy): Assumes always positive force used during testing.  This should detect when the value
        // *approaches* zero due to Leaf.bounceForceDecay and then set it to zero.  Also Leaf.bounceForceDecay
        // should work in the direction towards zero (sometimes it should be positive, sometimes negative).
        /*
          NOTE(tracy): Disabling all leaf bouncing.  This is way too subtle with an invisible skeleton.
          this.forceX -= Leaf.bounceForceDecay;
          if (this.forceX < 0) this.forceX = 0;
          this.forceY -= Leaf.bounceForceDecay;
          if (this.forceY < 0) this.forceY = 0;
          this.forceZ -= Leaf.bounceForceDecay;
          if (this.forceZ < 0) this.forceZ = 0;
        */

        // Improved Euler integration
        var ax = fx; // assume f = ma or a = f/m mass = 1 for efficiency / this.mass;
        var ay = fy; // / this.mass;
        this.geometry.position.x += (this.velocity.x * dt) + (ax * 0.5 * dt * dt);
        this.geometry.position.y += (this.velocity.y * dt) + (ay * 0.5 * dt * dt);
        this.velocity.x += ax * dt;
        this.velocity.y += ay * dt;

        // if (leafTickCount % 10000 == 0) console.log('position', this.geometry.position);

        // Random rotations
        var t = Leaf.time();
        if (!this.bodyPart) { // stop rotating when stuck to body
            // TODO(tracy): Remove Math.sin() and replace with a lookup table?
            this.geometry.rotation.set(this.rotationDetails.x.initial * Math.sin((t / this.rotationDetails.x.speed) + this.rotationDetails.x.phase),
                                       this.rotationDetails.y.initial * Math.sin((t / this.rotationDetails.y.speed) + this.rotationDetails.y.phase),
                                       this.rotationDetails.z.initial * Math.sin((t / this.rotationDetails.z.speed) + this.rotationDetails.z.phase));
        }
    } else if (!this.stuck && this.geometry.position.y < 0.0) {
        this.stuck = true;
    } else if (this.bodyPart) {
        var skeletonPoint = skeletonPositions[this.bodyPart];
        this.geometry.position.x = skeletonPoint.position.x + this.deltaVector.x;
        this.geometry.position.y = skeletonPoint.position.y + this.deltaVector.y;
        this.geometry.position.z = skeletonPoint.position.z + this.deltaVector.z;
    }
    if (this.stuck) {
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

    var perlinNoise;

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
  Leaf.models.leaf = new LeafObj();
  Leaf.textures.push(THREE.ImageUtils.loadTexture("js/obj/Leaf_8_Color.png", THREE.UVMapping, checkIfLoaded));
  Leaf.textures.push(THREE.ImageUtils.loadTexture("js/obj/leafX.png", THREE.UVMapping, checkIfLoaded));
  Leaf.textures.push(THREE.ImageUtils.loadTexture("js/obj/leafY.png", THREE.UVMapping, checkIfLoaded));
  Leaf.textures.push(THREE.ImageUtils.loadTexture("js/obj/leafZ.png", THREE.UVMapping, checkIfLoaded));

  console.log('Building perlin noise map.');
  // Build perlin noise map to sample from
  perlinNoise = [];
  var simplexNoise = new SimplexNoise();
  for (var i = 0; i < 100; i++) {
      perlinNoise.push(simplexNoise.noise(i, 0));
  }

};
