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

    /*
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
    */

var limbs = {
    LeftForearm: 25,
    LeftUpperarm: 26,
    RightForearm: 27,
    RightUpperarm: 28,
};
/*
    LeftThigh: 29,
    LeftCalf: 30,
    RightThigh: 31,
    RightCalf: 32
};
*/

var limbMap = {
    LeftForearm: ["LeftElbow", "LeftHand"],
    LeftUpperarm: ["LeftShoulder", "LeftElbow"],
    RightForearm: ["RightElbow", "RightHand"],
    RightUpperarm: ["RightShoulder", "RightElbow"],
}

var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000});

// Initialize our skeleton points.
var skeletonObjs = {};

function hitBodyTest(pos) {
    //   for (skeletonPointName in skeletonObjs) {
        var skeletonPoint = skeletonObjs["Head"];
        if (pos.distanceTo(skeletonPoint.position) < 1) {
            console.log("leaf hit! at ");
            console.log("x= " + pos.x + " y=" + pos.y + " z=" + pos.z);
            return true;
        }
        //    }
}

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
                    var debug = (frame % 60) == 0;
                    //                    if (debug) console.log('user skeleton', user.skeleton);
                    //                    if (debug) console.log('Head position: ' + user.skeleton[zig.Joint.Head].position);
                    var xrange = 400;
                    var yrange = 400;
                    var zrange = 400;
                    var leftElbowRotation = undefined;
                    var rightElbowRotation = undefined;
                    var jointRotations = [];
                    for (var k in skeletonPoints) {
                        //                        if (debug) console.log("k = " + k);
                        if (skeletonPoints.hasOwnProperty(k) && k != "Invalid") {
                            //                            if (debug) console.log("skeletonPoints.k " + skeletonPoints[k]);
                            if (user.skeleton.hasOwnProperty(skeletonPoints[k])) {
                                var pos = user.skeleton[skeletonPoints[k]].position;
                                // Extract rotations for elbows.
                                if (user.skeleton[skeletonPoints[k]].hasOwnProperty("rotation")) {
                                    jointRotations[k] = user.skeleton[skeletonPoints[k]].rotation;
                                }
                                var ball = skeletonObjs[k];
                                var xpos = pos[0]/ xrange;
                                var ypos = pos[1]/ yrange;
                                var zpos = pos[2]/ zrange;
                                //                                if (debug) console.log("" + pos[0] + ", " + pos[1] + ", " + pos[2]);
                                if (ball != undefined) {
                                    ball.position = new THREE.Vector3(pos[0]/xrange, pos[1]/yrange, pos[2]/zrange);
                                    if (k == "Head") {
                                        if (debug) console.log("head position", ball.position);
                                    }
                                } else {
                                    if (debug) console.log('did not find object for ', k);
                                }
                            } else {
                                if (debug) console.log('did not find skeleton data for point ', k);
                            }
                        }
                    }
                    var limbName;
                    var lMap = ["LeftForearm", "LeftUpperarm", "RightForearm", "RightUpperarm"];
                    for (var i = 0; i < lMap.length; i++) {
                        limbName = lMap[i];
                        //if (debug) console.log('limbName ' + limbName);
                        var joint = limbMap[limbName][0];
                        //if (debug) console.log('joint ' + joint);
                        var jointRotation = jointRotations[joint];
                        //if (debug) console.log('jointRotation', jointRotation);
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
    camera.position.set( 0, 0, 15 );
    camera.lookAt( scene.position );

    scene.add(camera);

    for (var k in skeletonPoints) {
        if (skeletonPoints.hasOwnProperty(k) && k != "Invalid" && k != "Waist") {
            var ball = 
                new THREE.Mesh(new THREE.CubeGeometry( 0.5, 0.5, 0.5 ),
                               new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
                               );
            skeletonObjs[k] = ball;
            scene.add( ball );
        }
    }

    for (var k in limbs) {
        if (limbs.hasOwnProperty(k)) {
            var limb = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                                      new THREE.MeshLambertMaterial({color: 0x0000FF}));
            skeletonObjs[k] = limb;
            scene.add(limb);
        }
    }

    var light = new THREE.PointLight( 0xFFFF00 );
    light.position.set( 10, 0, 10 );
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
