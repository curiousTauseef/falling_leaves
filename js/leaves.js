/*global audioLib:false, console:false, zig:false, THREE:false, $:false,
  window:false */

var cube, scene, camera, renderer, animationFrameId;

var skeletonPoints =
{Invalid:0,
 Head:1,
 Neck:2,
 Torso:3,
 LeftShoulder:6,
 LeftElbow:7,
 LeftHand:9,
 RightShoulder:12,
 RightElbow:13,
 RightHand:15,
 LeftHip:17,
 LeftKnee:18,
 LeftFoot:20,
 RightHip:21,
 RightKnee:22,
 RightFoot:24};

function setupUIControls() {
    $('body').append('<div id="controls"></div>');
    $("#controls").append(
      '<button id="sound" onclick="toggleSound();">Sound</button>');
    $("#controls").css({position: "fixed", display: "block", 
                        right: "10px", bottom: "10px", "z-index": 10000});
}


var audioDevice, noiseGen, biquadBandPass;

var _playing = false;
function fillAudioBuffer(buffer, channelCount){
    if (_playing) {
        // Fill the buffer with the oscillator output.
        noiseGen.append(buffer, channelCount);
        biquadBandPass.append(buffer);
    }
}

function toggleSound(e) {
  if (_playing) {
    _playing = false;
    // XXX set button to indicate that it will turn on sound
  } else {

    _playing = true;
    // XXX set button to indicate that it will turn off sound
  }
}

function setupWind() {
    // Create an instance of the AudioDevice class
    audioDevice = audioLib.AudioDevice(
      fillAudioBuffer /* callback for the buffer fills */,
      2 /* channelCount */);

    // Create an instance of the Oscillator class
    noiseGen = audioLib.Noise(audioDevice.sampleRate, audioLib.Noise.pink);

    biquadBandPass = audioLib.effects.BiquadBandPassFilter.createBufferBased(
          2, /* channelCount */
          audioDevice.sampleRate, /* sample rate of the device (Uint) */
          0.0001, /* Center frequency of filter: 0dB gain at center peak (Float)*/
          0.0001); /* Bandwidth in octaves (Float) */

    setupUIControls();
}

var limbs = {
    LeftForearm: 25,
    LeftUpperarm: 26,
    RightForearm: 27,
    RightUpperarm: 28,
};

var limbMap = {
    LeftForearm: ["LeftElbow", "LeftHand"],
    LeftUpperarm: ["LeftShoulder", "LeftElbow"],
    RightForearm: ["RightElbow", "RightHand"],
    RightUpperarm: ["RightShoulder", "RightElbow"],
}

// Allow for configuring visibility of various helpers.
var showSkeleton = true;
var showXAxis = false;
var showYAxis = false;
var showZAxis = false;
var showFloor = false;

// Initialize our skeleton three.js objects. For rendering.
var skeletonObjs = {};

// Track skeleton positions for hit detection.
var skeletonPositions = {};

// Delta vectors for the skeleton
var skeletonDeltas = {};

// Track the leaves stuck to the body.
var bodyLeaves = [];

function handsTogether() {
    var rightHandPoint = skeletonObjs["RightHand"];
    var leftHandPoint = skeletonObjs["LeftHand"];
    if (rightHandPoint.position.distanceTo(leftHandPoint.position) < 0.3) {
        // release all leaves.
        while (bodyLeaves.length) {
            var leaf = bodyLeaves.pop();
            leaf.bodyPart = undefined;
            leaf.velocity.x = 5;
            leaf.velocity.y = 5;
            leaf.velocity.z = 5;
        }
    }
}

function hitBodyTest(leaf) {
    var pos = leaf.geometry.position;
    var hitPoints = ["Head", "RightElbow", "RightHand", "LeftElbow", "LeftHand"];
    for (var i = 0; i < hitPoints.length; i++) {
        var skeletonPoint = skeletonPositions[hitPoints[i]];
        var d = pos.distanceTo(skeletonPoint.position);
        if (pos.distanceTo(skeletonPoint.position) < 1) {
            leaf.bodyPart = hitPoints[i];
            bodyLeaves.push(leaf);
            var deltaVector = new THREE.Vector3();
            deltaVector.x = pos.x - skeletonPoint.position.x;
            deltaVector.y = pos.y - skeletonPoint.position.y;
            deltaVector.z = pos.z - skeletonPoint.position.z;
            leaf.deltaVector = deltaVector;
            return hitPoints[i];
        }
    }
    return undefined;
}

function positionAttachedLeaves() {
    for (var i = 0; i < bodyLeaves.length; i++) {
        var leaf = bodyLeaves[i];
        var skeletonPoint = skeletonPositions[leaf.bodyPart];
        leaf.geometry.position.x = skeletonPoint.position.x + leaf.deltaVector.x;
        leaf.geometry.position.y = skeletonPoint.position.y + leaf.deltaVector.y;
        leaf.geometry.position.z = skeletonPoint.position.z + leaf.deltaVector.z;
    }
}

function loaded() {
    zig.embed();
    var frame = 0;
    var engager = zig.EngageUsersWithSkeleton(1);
    engager.addEventListener('userengaged', function(user) {
            console.log('User engaged: ' + user.id);
            user.addEventListener('userupdate', function(user) {
                    frame++;
                    var debug = (frame % 60) == 0;
                    // if (debug) console.log('user skeleton', user.skeleton);
                    // if (debug) console.log('Head position: ' + user.skeleton[zig.Joint.Head].position);
                    var xrange = 400;
                    var yrange = 400;
                    var zrange = 400;
                    var leftElbowRotation = undefined;
                    var rightElbowRotation = undefined;
                    var jointRotations = [];
                    for (var k in skeletonPoints) {
                        // if (debug) console.log("k = " + k);
                        if (skeletonPoints.hasOwnProperty(k) && k != "Invalid") {
                            // if (debug) console.log("skeletonPoints.k " + skeletonPoints[k]);
                            if (user.skeleton.hasOwnProperty(skeletonPoints[k])) {
                                var pos = user.skeleton[skeletonPoints[k]].position;
                                // Extract rotations for elbows, etc.
                                if (user.skeleton[skeletonPoints[k]].hasOwnProperty("rotation")) {
                                    jointRotations[k] = user.skeleton[skeletonPoints[k]].rotation;
                                }
                                var ball = skeletonObjs[k];
                                var skeletonPosition = skeletonPositions[k];
                                var xpos = pos[0]/ xrange;
                                var ypos = pos[1]/ yrange;
                                var zpos = pos[2]/ zrange;
                                // if (debug) console.log("" + pos[0] + ", " + pos[1] + ", " + pos[2]);
                                if (ball != undefined) {
                                    var p = new THREE.Vector3((pos[0]/xrange), (pos[1]/yrange) + 3.0, pos[2]/zrange);
                                    ball.position = p;
                                    skeletonPosition.position = p;
                                } else {
                                    if (debug) console.log('did not find object for ', k);
                                }
                            } else {
                                if (debug) console.log('did not find skeleton data for point ', k);
                            }
                        }
                    }
                    positionAttachedLeaves();
                    handsTogether();
                    var limbName;
                    var lMap = ["LeftForearm", "LeftUpperarm", "RightForearm", "RightUpperarm"];
                    for (var i = 0; i < lMap.length; i++) {
                        limbName = lMap[i];
                        // if (debug) console.log('limbName ' + limbName);
                        var joint = limbMap[limbName][0];
                        // if (debug) console.log('joint ' + joint);
                        var jointRotation = jointRotations[joint];
                        // if (debug) console.log('jointRotation', jointRotation);
                        if (jointRotation) {
                            //
                            // Build Limb
                            //
                            // limbJointA is the endpoint of the limb.
                            var limbJointA = limbMap[limbName][1];
                            // limbJointB is the base of the limb.  Rotation is relative to this point.
                            var limbJointB = limbMap[limbName][0];
                            var limbPosA = skeletonObjs[limbJointA].position;
                            //if (debug) console.log(limbJointA, ' pos ', limbPosA);
                            var limbPosB = skeletonObjs[limbJointB].position;
                            //if (debug) console.log(limbJointB, ' pos ' , limbPosB);
                            var limbObjLength = limbPosA.distanceTo(limbPosB);
                            //if (debug) console.log(limbName, ' length' + limbObjLength);
                            var limbObj = skeletonObjs[limbName];
                            // We need to use manual matrices since we are getting orientation data from
                            // the Kinect/Zigfu in rotation matrix format.
                            limbObj.matrixAutoUpdate = false;
                            limbObj.matrixWorldNeedsUpdate = true;
                            // need a map from limbJointB names into an array of rotation values.
                            var limbObjOrientation = jointRotation; // array 9
                            //if (debug) console.log(limbObjOrientation);
                            // orientation from Kinect/Zigfu is column major, THREE.js is row major. major bummer.
                            var rotateMatrix = new THREE.Matrix4(limbObjOrientation[0],
                                                                 limbObjOrientation[3],
                                                                 limbObjOrientation[6],
                                                                 0,
                                                                 limbObjOrientation[1],
                                                                 limbObjOrientation[4],
                                                                 limbObjOrientation[7],
                                                                 0,
                                                                 limbObjOrientation[2],
                                                                 limbObjOrientation[5],
                                                                 limbObjOrientation[8],
                                                                 0,
                                                                 0,
                                                                 0,
                                                                 0,
                                                                 1);
                            var transMatrix = new THREE.Matrix4();
                            transMatrix.setTranslation((limbPosA.x + limbPosB.x)/2, 
                                                       (limbPosA.y + limbPosB.y)/2, 
                                                       (limbPosA.z + limbPosB.z)/2);
                    
                            var scaleMatrix = new THREE.Matrix4();
                            scaleMatrix.setScale(limbObjLength, limbObjLength/2, limbObjLength/2);
                            limbObj.matrix = transMatrix;
                            limbObj.matrix.multiplySelf(rotateMatrix);
                            limbObj.matrix.multiplySelf(scaleMatrix);
                        }
                    }
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
    
    setupWind();
}

// Zigfu wants to be loaded on this event.
document.addEventListener('DOMContentLoaded', loaded, false);

// Initialize Three.js in onload.
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

    //camera.position.set( 3, 3, 25 );
    //camera.position.set(15, 15, 15 );
    //camera.position.set(-8, 5, -8);
    //camera.position.set(3, 3, 20);
    //camera.position.set(0, 5, -20);

    camera.position.set(0, 5, 15);

    var target = new THREE.Vector3(0, 5, -200);
    //var target = new THREE.Vector3(3, 3, 3);
    //var target = new THREE.Vector3(0, 5, 200);

    //camera.lookAt( scene.position );
    camera.lookAt( target );
    
    scene.add(camera);
    for (var k in skeletonPoints) {
        if (skeletonPoints.hasOwnProperty(k) && k != "Invalid" && k != "Waist") {
            var ball = 
                new THREE.Mesh(new THREE.CubeGeometry( 0.5, 0.5, 0.5 ),
                               new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
                               );
            skeletonObjs[k] = ball;
            skeletonPositions[k] = {position: new THREE.Vector3(0,0,0)};
            if (showSkeleton)
                scene.add( ball );
        }
    }

    for (var k in limbs) {
        if (limbs.hasOwnProperty(k)) {
            var limb = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                                      new THREE.MeshLambertMaterial({color: 0x0000FF}));
            skeletonObjs[k] = limb;
            if (showSkeleton)
                scene.add(limb);
        }
    }

    if (showXAxis) {
        var xaxis = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                                   new THREE.MeshLambertMaterial({color: 0x00FF00}));
        xaxis.scale.set(50, 1, 1);
        var xaxisknob = new THREE.Mesh(new THREE.CubeGeometry(1.5, 1.5, 1.5),
                                       new THREE.MeshLambertMaterial({color: 0x0000FF}));
        xaxisknob.position.x = 5;
        scene.add(xaxisknob);
        scene.add(xaxis);
    }

    if (showYAxis) {
          var yaxis = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
          new THREE.MeshLambertMaterial({color: 0x2222FF}));
          var yaxisknob = new THREE.Mesh(new THREE.CubeGeometry(1.5, 1.5, 1.5),
          new THREE.MeshLambertMaterial({color: 0x2222FF}));
          yaxisknob.position.y = 5;
          scene.add(yaxisknob);
          yaxis.scale.set(1, 10, 1);
          scene.add(yaxis);
    }

    if (showZAxis) {
        var zaxis = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                                   new THREE.MeshLambertMaterial({color: 0xFF0000}));
        zaxis.scale.set(1, 1, 50);
        scene.add(zaxis);
        var zaxisknob = new THREE.Mesh(new THREE.CubeGeometry(1.5, 1.5, 1.5),
                                       new THREE.MeshLambertMaterial({color: 0xFF0000}));
        zaxisknob.position.z = 5;
        scene.add(zaxisknob);
    }

    if (showFloor) {
        var floor = new THREE.Mesh(new THREE.CubeGeometry(10, 0.5, 10),
                                   new THREE.MeshLambertMaterial({color: 0xFFAA22}));
        scene.add(floor);
    }
    
    var light = new THREE.PointLight( 0xFFFFFF );
    light.position.set( 10, 10, 10 );
    scene.fog = new THREE.FogExp2( 0xffffff, 0.02 );
    scene.add(light);

    Leaf.makeLeaves(scene);

    var renderFunc = function() {
      animationFrameId = window.requestAnimationFrame(function() {
        Leaf.tick();
        renderer.render(scene, camera);
        renderFunc();
      });
    }
    renderFunc();
};
