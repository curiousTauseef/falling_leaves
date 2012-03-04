var Leaf = function() {
  var scope = this;
  this.setupGeometry();
  this.reset();
}
Leaf.prototype = new Object();
Leaf.prototype.constructor = Leaf;
Leaf.numLeaves = 1000;
Leaf.maxStickTime = 100;

// Instance methods

Leaf.prototype.reset = function() {
  this.stuck = false;
  this.stickTime = 0;
  this.geometry.material.opacity = 1.0;
  this.geometry.position = new THREE.Vector3((Math.random() * 100) - 50, (Math.random() * 20) + 10, (Math.random() * 60) - 55);
  this.initialRotation = new THREE.Vector3(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
  this.geometry.rotation.set(this.initialRotation.x, this.initialRotation.y, this.initialRotation.z);

  this.rotationDetails = { x: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) },
    y: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) },
    z: { initial: Math.random() * 2 * Math.PI, phase: Math.random() * 10, speed: 2000 + (Math.random() * 200 - 100) }};

  var size = 0.05 + 0.1 * Math.random();
  this.geometry.scale.set(size, size, size);
};

Leaf.prototype.tick = function() {
  if (!this.stuck && this.geometry.position.y > -5.0) {
    this.geometry.position.y -= 0.1;

    var t = Leaf.time();
    this.geometry.rotation.set(this.rotationDetails.x.initial * Math.sin((t / this.rotationDetails.x.speed) + this.rotationDetails.x.phase),
        this.rotationDetails.y.initial * Math.sin((t / this.rotationDetails.y.speed) + this.rotationDetails.y.phase),
        this.rotationDetails.z.initial * Math.sin((t / this.rotationDetails.z.speed) + this.rotationDetails.z.phase));

    $("#outx").text(Leaf.getWindForce(this.geometry.position).x);
    $("#outy").text(Leaf.getWindForce(this.geometry.position).y);
//    this.geometry.position.x +=
  } else {
    this.stuck = true;
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
  this.geometry = new THREE.Mesh(Leaf.models.plane, new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, color: Math.random() * 0xffffff }));
  this.geometry.doubleSided = true;
};

// Class methods

Leaf.tick = function() {
  Leaf.fluidField.update();
  for (var i = Leaf.leaves.length - 1; i >= 0; i--) {
    Leaf.leaves[i].tick();
  }
};

Leaf.time = function() {
  return (new Date()).getTime();
};

Leaf.getWindForce = function(v) {
  var x = parseInt(((v.x + 50) / 100) * Leaf.fluidField.width);
  var y = parseInt(((v.y + 50) / 100) * Leaf.fluidField.height);
  return new THREE.Vector2(Leaf.field.getXVelocity(x, y), Leaf.field.getYVelocity(x, y));
};

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

  Leaf.fluidField = new FluidField();
  Leaf.fluidField.setResolution(30, 30);
  Leaf.fluidField.setDisplayFunction(function(field) { Leaf.field = field; });
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
};
