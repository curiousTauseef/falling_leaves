var Leaf = function () {
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
  this.geometry.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
  this.geometry.position = new THREE.Vector3((Math.random() * 100) - 50, (Math.random() * 20) + 10, (Math.random() * 60) - 55);
},

Leaf.prototype.tick = function() {
  if (!this.stuck && this.geometry.position.y > -5.0) {
    this.geometry.position.y -= 0.1;
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
  this.geometry = new THREE.Mesh( new LeafObj(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff } ) );
  this.geometry.scale.set(0.05, 0.05, 0.05);
  this.geometry.doubleSided = true;
};

// Class methods

Leaf.tick = function() {
  for(var i = Leaf.leaves.length - 1; i >= 0; i--) {
    Leaf.leaves[i].tick();
  }
};

Leaf.leaves = [];
Leaf.makeLeaves = function(scene) {
  for(var i = 0; i < Leaf.numLeaves; i++) {
    var leaf = Leaf.leaves[i] = new Leaf();
    scene.add(leaf.geometry);
  }
}
