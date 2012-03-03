/*global Pd:false, console:false, zig:false, THREE:false */

var cube, scene, camera, renderer;

var skeletonPoints = 
{Invalid:0,
 Head:1,
 Neck:2,
 Torso:3,
 Waist:4,
 LeftCollar:5,
 LeftShoulder:6,
 LeftElbow:7,
 LeftWrist:8,
 LeftHand:9,
 LeftFingertip:10,
 RightCollar:11,
 RightShoulder:12,
 RightElbow:13,
 RightWrist:14,
 RightHand:15,
 RightFingertip:16,
 LeftHip:17,
 LeftKnee:18,
 LeftAnkle:19,
 LeftFoot:20,
 RightHip:21,
 RightKnee:22,
 RightAnkle:23,
 RightFoot:24};

var sphereMaterial =
    new THREE.MeshLambertMaterial(
                                  {
                                      color: 0xCC0000
                                  });

var pdWind;
function setupWind() {
    
  function pdLoadCallback () {
    pdWind.play();
    pdWind.send("wind", 147.42131092488248);
  }

  pdWind = new Pd(44100, 200, true);
  pdWind.load("js/libs/wind.pd", pdLoadCallback);
}

// Initialize our skeleton points.
var skeletonObjs = {};

function loaded() {
    zig.embed();
    var radar = {
         onuserfound: function (user) {
         },
         onuserlost: function(user) {
         },
         ondataupdate: function(zigdata) {
             for (var userid in zigdata.users) {
                 var user = zigdata.users[userid];
                 var pos = user.position;
                 var zrange = 4000;
                 var xrange = 4000;
                 // cube.position = new THREE.Vector3(pos[0]/xrange * 10, pos[1]/xrange * 2, - (pos[2]/xrange * 10));                 
                 renderer.render (scene, camera);
             }
          }
    };
    // Add the radar object as a listener to the zig object, so that 
    // the zig object will call the radar object's callback functions.
    zig.addListener(radar);

    
    var frame = 0;
    var engager = zig.EngageUsersWithSkeleton(1);
    engager.addEventListener('userengaged', function(user) {
            console.log('User engaged: ' + user.id);
            user.addEventListener('userupdate', function(user) {
                    frame++;
                    var debug = (frame % 40) == 0;
                    if (debug) console.log('user skeleton', user.skeleton);
                    if (debug) console.log('Head position: ' + user.skeleton[zig.Joint.Head].position);
                    var xrange = 400;
                    var yrange = 400;
                    var zrange = 400;
                    for (var k in skeletonPoints) {
                        if (debug) console.log("k = " + k);
                        if (skeletonPoints.hasOwnProperty(k) && k != "Invalid") {
                            if (debug) console.log("skeletonPoints.k " + skeletonPoints[k]);
                            if (user.skeleton.hasOwnProperty(skeletonPoints[k])) {
                                var pos = user.skeleton[skeletonPoints[k]].position;
                                var ball = skeletonObjs[k];
                                var xpos = pos[0]/ xrange;
                                var ypos = pos[1]/ yrange;
                                var zpos = pos[2]/ zrange;
                                if (debug) console.log("" + pos[0] + ", " + pos[1] + ", " + pos[2]);
                                if (ball != undefined) {
                                    ball.position = new THREE.Vector3(pos[0]/xrange, pos[1]/yrange, pos[2]/zrange);
                                } else {
                                    if (debug) console.log('did not find object for ', k);
                                }
                            } else {
                                if (debug) console.log('did not find skeleton data for point ', k);
                            }
                        }
                    }
                    renderer.render (scene, camera);
                    
                });
        });
    engager.addEventListener('userdisengaged', function(user) {
            console.log('User disengaged: ' + user.id);
        });
    zig.addListener(engager);
    zig.singleUserSession.addEventListener('userengaged', function(user) {
            console.log('User started UI session: ' + user.id);
    });
    zig.singleUserSession.addEventListener('userdisengaged', function(user) {
            console.log('User ended UI session: ' + user.id);
        });
    zig.singleUserSession.addEventListener('sessionstart', function(initialPosition) {
            console.log('Session started at ' + initialPosition);
        });
    zig.singleUserSession.addEventListener('sessionend', function() {
            console.log('Session ended')
                });
    var swipeDetector = zig.controls.SwipeDetector();
    swipeDetector.addEventListener('swipeup', function(pd) {
      console.log('SwipeDetector: Swipe Up');
        });
    swipeDetector.addEventListener('swipedown', function(pd) {
      console.log('SwipeDetector: Swipe Down');
        });
    swipeDetector.addEventListener('swipeleft', function(pd) {
      console.log('SwipeDetector: Swipe Left');
        });
    swipeDetector.addEventListener('swiperight', function(pd) {
        console.log('SwipeDetector: Swipe Right');
        });
    swipeDetector.addEventListener('swipe', function(dir) {
      console.log('SwipeDetector: Swipe direction: ' + dir);
        });
    zig.singleUserSession.addListener(swipeDetector);
    
    setupWind();
}

document.addEventListener('DOMContentLoaded', loaded, false);

window.onload = function() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    $('#view').append(renderer.domElement);
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
                                         35,             // Field of view
                                         window.innerWidth / window.innerHeight,      // Aspect ratio
                                         0.1,            // Near plane
                                         10000           // Far plane
                                         );
    camera.position.set( 0, 0, 20 );
    camera.lookAt( scene.position );

    scene.add(camera);

    /*
      NOTE(tracy): Utility cube for debugging.
    cube = new THREE.Mesh(new THREE.CubeGeometry( 0.5, 0.5, 0.5 ),
                          new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
                          );
    scene.add( cube );
    */

    for (var k in skeletonPoints) {
        if (skeletonPoints.hasOwnProperty(k) && k != "Invalid" && k != "Waist") {
            var ball = 
                new THREE.Mesh(
                               new THREE.SphereGeometry(
                                                        0.2,
                                                        16,
                                                        16),
                               sphereMaterial);
            skeletonObjs[k] = ball;
            console.log("point = " + k);
            scene.add( ball );
        }
    }

    var light = new THREE.PointLight( 0xFFFF00 );
    light.position.set( 10, 0, 10 );
    scene.add(light);
    
    renderer.render(scene, camera);
};
