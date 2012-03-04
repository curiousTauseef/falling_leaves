var LeafObj = function() {

  var scope = this;

  THREE.Geometry.call(this);

  v(1, -0.1, -1);
  v(1, 0, 1);
  v(-1, 0.75, 1);
  v(-1, 0, -1);

  f3(0, 1, 2);
  f3(2, 3, 0);

  //	v(   5,   0,   0 );
  //	v( - 5, - 2,   1 );
  //	v( - 5,   0,   0 );
  //	v( - 5, - 2, - 1 );
  //
  //	v(   0,   2, - 6 );
  //	v(   0,   2,   6 );
  //	v(   2,   0,   0 );
  //	v( - 3,   0,   0 );
  //
  //	f3( 0, 2, 1 );
  //	f3( 4, 7, 6 );
  //	f3( 5, 6, 7 );
  //

  this.computeCentroids();
  this.computeFaceNormals();

  function v(x, y, z) {

    scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));

  }

  function f3(a, b, c) {

    scope.faces.push(new THREE.Face3(a, b, c));

  }

}

LeafObj.prototype = new THREE.Geometry();
LeafObj.prototype.constructor = LeafObj;


// var LeafObj = function () {
//
//	var scope = this;
//
//	THREE.Geometry.call( this );
//
//	v(   5,   0,   0 );
//	v( - 5, - 2,   1 );
//	v( - 5,   0,   0 );
//	v( - 5, - 2, - 1 );
//
//	v(   0,   2, - 6 );
//	v(   0,   2,   6 );
//	v(   2,   0,   0 );
//	v( - 3,   0,   0 );
//
//	f3( 0, 2, 1 );
//	f3( 4, 7, 6 );
//	f3( 5, 6, 7 );
//
//	this.computeCentroids();
//	this.computeFaceNormals();
//
//	function v( x, y, z ) {
//
//		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
//
//	}
//
//	function f3( a, b, c ) {
//
//		scope.faces.push( new THREE.Face3( a, b, c ) );
//
//	}
//
//}
//
//LeafObj.prototype = new THREE.Geometry();
//LeafObj.prototype.constructor = LeafObj;