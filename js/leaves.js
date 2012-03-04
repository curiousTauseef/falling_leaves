/*global audioLib:false, console:false, zig:false, THREE:false, $:false,
  window:false */

var slowGlobalDt = 0.00675;
var fastGlobalDt = 0.2;

var cube, scene, camera, renderer, animationFrameId, globalDt = slowGlobalDt;


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


var audioDevice, noiseGen, biquadLowPass, biquadBandPass, gain;

var _playing = false;

function toggleSound(e) {
  if (_playing) {
    _playing = false;
    // XXX set button to indicate that it will turn on sound
  } else {

    _playing = true;
    // XXX set button to indicate that it will turn off sound
  }
}

function fillAudioBuffer(buffer, channelCount){
    if (_playing) {
        // Fill the buffer with the oscillator output.
        noiseGen.append(buffer, channelCount);
        biquadLowPass.append(buffer);
        gain.setParam("gain", getWindVelocity());
        gain.append(buffer);
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
          100.0, /* Center frequency of filter: 0dB gain at center peak (Float)*/
          1.0); /* Bandwidth in octaves (Float) */

    gain = audioLib.effects.GainController.createBufferBased(
      2, /* channelCount */
      audioDevice.sampleRate, /* sample rate of the device (Uint) */
      1); /* gain, a multiplier for the sample, defaults to 1 (Uint) */ 

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
var showXAxis = true;
var showYAxis = true;
var showZAxis = true;
var showFloor = true;
var useScareCrow = false;

// Initialize our skeleton three.js objects. For rendering.
var skeletonObjs = {};

// Track skeleton positions for hit detection.
var skeletonPositions = {};

// Delta vectors for the skeleton
var skeletonDeltas = {};

// Track the leaves stuck to the body.
var bodyLeaves = [];

function getWindVelocity() {
    // XXX should really have a random base, which is this effected
    // temporarily by changes in hand (and/or body?) motion
    // var slowGlobalDt = 0.00675;
    // var fastGlobalDt = 0.2;
    // 0.3 -> 0.00675
    // 1.0 -> .2
    // 0.7 :  0.19325
    var percent = globalDt / fastGlobalDt;
    return 0.3 + (percent * 0.7);
}

function getHandVelocity() {
    // XXX should actually be computed from hand events 
    return 2;
}

var xaxis;
var xaxisknob;
function toggleXAxis() {
    showXAxis = !showXAxis;
    if (showXAxis) {
        scene.add(xaxisknob);
        scene.add(xaxis);
    } else {
        scene.remove(xaxis);
        scene.remove(xaxisknob);
    }
}

var yaxis;
var yaxisknob;
function toggleYAxis() {
    showYAxis = !showYAxis;
    if (showYAxis) {
        scene.add(yaxisknob);
        scene.add(yaxis);
    } else {
        scene.remove(yaxis);
        scene.remove(yaxisknob);
    }
}

var zaxis;
var zaxisknob;
function toggleZAxis() {
    showZAxis = !showZAxis;
    if (showZAxis) {
        scene.add(zaxisknob);
        scene.add(zaxis);
    } else {
        scene.remove(zaxis);
        scene.remove(zaxisknob);
    }
}

var floor;
function toggleFloor() {
    showFloor = !showFloor;
    if (showFloor) {
        scene.add(floor);
    } else {
        scene.remove(floor);
    }
}

function toggleSkeleton() {
    showSkeleton = !showSkeleton;
    if (showSkeleton) {
        for (objName in skeletonObjs) {
            scene.add(skeletonObjs[objName]);
        }
    } else {
        for (objName in skeletonObjs) {
            scene.remove(skeletonObjs[objName]);
        }
    }        
}

var scareCrow = {
Head: [-0.1905820083618164,4.258598327636719,4.280858764648437],
Neck: [-0.1900673484802246,3.724918212890625,4.21179168701172],
Torso: [-0.19340927124023438,3.1831586456298826,4.13912109375],
LeftShoulder: [-0.5756597900390625,3.72562629699707,4.22424560546875],
LeftElbow: [-1.2566078186035154,3.41669921875,4.309959716796875],
LeftHand: [-2.0299581909179687,3.4282678604125976,4.19878204345703],
RightShoulder: [0.1955251121520996,3.724210205078125,4.199337768554687],
RightElbow: [1.0602471160888671,3.425337219238281,4.316580810546875],
RightHand: [1.8717703247070312,3.434768409729004,4.198320922851562],
LeftHip: [-0.44890903472900395,2.641862030029297,4.0745947265625],
LeftKnee: [-0.395903663635254,1.5904754638671874,3.779639587402345],
LeftFoot: [-0.395903663635254,0.539261932373047,3.779639587402345],
RightHip: [0.055406608581542977,2.640936050415039,4.058306274414062],
RightKnee: [0.07038476943969728,1.5755477905273438,3.81346923828125],
RightFoot: [0.07038476943969728,0.524334259033203,3.81346923828125]
};

var threeScareCrow = {};

function makeOriginScareCrow () {
    // make left foot at origin
    var deltaVector = new THREE.Vector3();
    for (pointName in scareCrow) {
        if (pointName == "LeftFoot") {
            deltaVector.x = scareCrow[pointName][0];
            deltaVector.y = scareCrow[pointName][1];
            deltaVector.z = scareCrow[pointName][2];
        }
    }
    for (pointName in scareCrow) {
        var threePt = new THREE.Vector3(scareCrow[pointName][0] - deltaVector.x,
                                        scareCrow[pointName][1] - deltaVector.y,
                                        scareCrow[pointName][2] - deltaVector.z);
        threeScareCrow[pointName] = threePt;
    }
}


function dumpSkeleton() {
    console.log(skeletonPositions);
    for (var pointName in skeletonPositions) {
        var pos = skeletonPositions[pointName].position;
        console.log(pointName + ": [" + pos.x + "," + pos.y + "," + pos.z + "],");
    }
}

var cameraFront = true;
function toggleCamera() {
    cameraFront = !cameraFront;
    if (cameraFront) {
        camera.position.set(0, 3, 15);
        var target = new THREE.Vector3(0, 3, -200);
        camera.lookAt(target);
    } else {
        camera.position.set(15, 15, 15 );
        var target = new THREE.Vector3(3, 3, 3);
        camera.lookAt(target);
    }        
}

function toggleAll() {
    toggleSkeleton();
    toggleFloor();
    toggleXAxis();
    toggleYAxis();
    toggleZAxis();
}

$(document).keydown(function(e) {
	// console.log(e);
	if (e.keyCode == 37) { 
	    // left
	} else if (e.keyCode == 39) {
	    // right
            dumpSkeleton();
	} else if (e.keyCode == 38) {
	    // up
            globalDt += 0.019325;
            if (globalDt >= fastGlobalDt) 
                globalDt = fastGlobalDt;
	} else if (e.keyCode == 40 || e.keyCode == 66) {
	    // down
            globalDt -= 0.019325;
            if (globalDt < slowGlobalDt)
                globalDt = slowGlobalDt;
        } else if (e.keyCode == 65) {
            toggleAll();
        } else if (e.keyCode == 67) {
            toggleCamera();
        } else if (e.keyCode == 68) {
            toggleSkeleton();
        } else if (e.keyCode == 70) {
            toggleFloor();
        } else if (e.keyCode == 88) {
            toggleXAxis();
        } else if (e.keyCode == 89) {
            toggleYAxis();
        } else if (e.keyCode == 90) {
            toggleZAxis();
        } else if (e.keyCode == 83) {
            useScareCrow = !useScareCrow;
            console.log(useScareCrow);
        } 
    });


function removeLeafFromBody(leaf) {
    if (leaf == undefined) return;
    for (var i = 0; i < bodyLeaves.length; i++) {
        var bodyLeaf = bodyLeaves[i];
        if (leaf == bodyLeaf) {
            //console.log('removing body leaf');
            delete bodyLeaves[i];
            return;
        }
    }
}

function handsTogether() {
    var rightHandPoint = skeletonObjs["RightHand"];
    var leftHandPoint = skeletonObjs["LeftHand"];
    if (rightHandPoint.position.distanceTo(leftHandPoint.position) < 0.3) {
        // release all leaves.
        while (bodyLeaves.length) {
            var leaf = bodyLeaves.pop();
            if (leaf == undefined) continue;
            leaf.bodyPart = undefined;
            leaf.velocity.x = 5;
            leaf.velocity.y = 5;
            leaf.velocity.z = 5;
        }
    }
}

function hitBodyTest(leaf) {
    var pos = leaf.geometry.position;
    var hitPoints = ["Head", "RightElbow", "RightHand", "LeftElbow", "LeftHand", "LeftKnee", "RightKnee", "Torso", "RightFoot", "LeftFoot"];
    for (var i = 0; i < hitPoints.length; i++) {
        var skeletonPoint = skeletonPositions[hitPoints[i]];
        var d = pos.distanceTo(skeletonPoint.position);
        if (pos.distanceTo(skeletonPoint.position) < 0.75) {
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
                                var ypos = pos[1]/ yrange + 3.0;
                                var zpos = pos[2]/ zrange;
                                
                                // Scarecrow override
                                if (useScareCrow) {
                                    xpos = threeScareCrow[k].x;
                                    ypos = threeScareCrow[k].y;
                                    zpos = threeScareCrow[k].z;
                                }
                                // if (debug) console.log("" + pos[0] + ", " + pos[1] + ", " + pos[2]);
                                if (ball != undefined) {
                                    var p = new THREE.Vector3(xpos, ypos, zpos);
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
    /*
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
    */
    /*
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
                var yrange = 4000;
                var xpos = pos[0]/xrange;
                var ypos = pos[1]/yrange;
                var zpos = pos[2]/zrange;
                // cube.position = new THREE.Vector3(pos[0]/xrange * 10, pos[1]/xrange * 2, - (pos[2]/xrange * 10));
                //renderer.render (scene, camera);
            }
        }
    };
    // Add the radar object as a listener to the zig object, so that
    // the zig object will call the radar object's callback functions.
    zig.addListener(radar);
    */
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

    /*
    //camera.position.set( 3, 3, 25 );
    //camera.position.set(-8, 5, -8);
    //camera.position.set(3, 3, 20);
    //camera.position.set(0, 5, -20);

    camera.position.set(15, 15, 15 );
    var target = new THREE.Vector3(3, 3, 3);

    //camera.position.set(0, 5, 15);
    //var target = new THREE.Vector3(0, 5, -200);

    //var target = new THREE.Vector3(0,0,0);
    //var target = new THREE.Vector3(0, 5, 200);

    //camera.lookAt( scene.position );
    camera.lookAt( target );
    */

    cameraFront = !cameraFront;
    toggleCamera();

    scene.add(camera);
    for (var k in skeletonPoints) {
        if (skeletonPoints.hasOwnProperty(k) && k != "Invalid" && k != "Waist") {
            var ball = 
                new THREE.Mesh(new THREE.CubeGeometry( 0.5, 0.5, 0.5 ),
                               new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
                               );
            skeletonObjs[k] = ball;
            skeletonPositions[k] = {position: new THREE.Vector3(0,0,0)};
        }
    }
    if (showSkeleton) {
        showSkeleton = false;
        toggleSkeleton();
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

    xaxis = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                           new THREE.MeshLambertMaterial({color: 0x00FF00}));
    xaxis.scale.set(50, 1, 1);
    xaxisknob = new THREE.Mesh(new THREE.CubeGeometry(1.5, 1.5, 1.5),
                               new THREE.MeshLambertMaterial({color: 0x0000FF}));
    xaxisknob.position.x = 5;
    if (showXAxis) {
        showXAxis = false;
        toggleXAxis();
    }

    yaxis = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                           new THREE.MeshLambertMaterial({color: 0x2222FF}));
    yaxis.scale.set(1, 10, 1);
    yaxisknob = new THREE.Mesh(new THREE.CubeGeometry(1.5, 1.5, 1.5),
                               new THREE.MeshLambertMaterial({color: 0x2222FF}));
    yaxisknob.position.y = 5;

    if (showYAxis) {
        showYAxis = false;
        toggleYAxis();
    }

    zaxis = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                           new THREE.MeshLambertMaterial({color: 0xFF0000}));
    zaxis.scale.set(1, 1, 50);
    zaxisknob = new THREE.Mesh(new THREE.CubeGeometry(1.5, 1.5, 1.5),
                               new THREE.MeshLambertMaterial({color: 0xFF0000}));
    zaxisknob.position.z = 5;

    if (showZAxis) {
        showZAxis = false;
        toggleZAxis();
    }

    floor = new THREE.Mesh(new THREE.CubeGeometry(10, 0.5, 10),
                           new THREE.MeshLambertMaterial({color: 0xFFAA22}));
    if (showFloor) {
        showFloor = false;
        toggleFloor();
    }
    
    var light = new THREE.PointLight( 0xFFFFFF );
    light.position.set( 10, 10, 10 );
    scene.fog = new THREE.FogExp2( 0xffffff, 0.02 );
    scene.add(light);

    makeOriginScareCrow();

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
