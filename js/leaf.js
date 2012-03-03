var Leaf = function () {
  var scope = this;
  this.makeGeometry();
}

Leaf.prototype = new Object();

Leaf.prototype.constructor = Leaf;

Leaf.prototype.makeGeometry = function() {
  this.geometry = new THREE.Mesh( new LeafObj(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff } ) );
  this.geometry.phase = Math.floor( Math.random() * 62.83 );
  this.geometry.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
  this.geometry.scale.set(0.05, 0.05, 0.05);
  this.geometry.position = new THREE.Vector3((Math.random() * 10) - 5, (Math.random() * 10) - 5, (Math.random() * 10) - 5);
  this.geometry.doubleSided = true;
};

Leaf.leaves = [];

Leaf.makeLeaves = function(scene) {
  for(var i = 0; i < 100; i++) {
    var leaf = Leaf.leaves[i] = new Leaf();
    scene.add(leaf.geometry);
  }
}


