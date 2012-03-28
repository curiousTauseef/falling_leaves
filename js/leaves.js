/*global audioLib:false, console:false, zig:false, THREE:false, $:false,
  window:false, stats:false */

/* <><><><><><><><><><><><><><><><><><><><><><><><><><>
 * 
 *       T U N A B L E    P A R A M E T E R S
 *
 * <><><><><><><><><><><><><><><><><><><><><><><><><><>
 */
var skeletonHistoryCount = 5;
var skeletonVelocitySnapshotFrames = 20; // store skeleton points about every 1/3 second at 60 fps.
var skeletonVelocityCheckFrames = 20;  // check skeleton point velocity about every 1/3 second at 60 fps.
var slowGlobalDt = 0.00675;
var fastGlobalDt = 0.2;
var leafMode = 'stick'; // 'bounce'
var handsTogetherDistance = 0.3;

// Allow for configuring visibility of various helpers.
var showSkeleton = false;
var showXAxis = false;
var showYAxis = false;
var showZAxis = false;
var showFloor = false;
var useScareCrow = false;
var cameraFront = true;

var flashCount = 0;
var backgroundBlack = true;
var flashInterval = null;
var flashLengthInFrames = 5;


/* <><><><><><><><><><><><><><><><><><><><><><><><><><>
 *               G L O B A L S
 * <><><><><><><><><><><><><><><><><><><><><><><><><><>
 */
var cube, scene, camera, renderer, animationFrameId, globalDt = slowGlobalDt;

// Track previous skeletons for velocity computation.
var skeletonHistory = [];

// Initialize our skeleton three.js objects. For rendering.
var skeletonObjs = {};

// Track skeleton positions for hit detection.
var skeletonPositions = {};

// Delta vectors for the skeleton
var skeletonDeltas = {};

// Track the leaves stuck to the body.
var bodyLeaves = [];
// leaves to throw off with right hand movement
var rightBodyLeaves = [];  
// leaves to throw off with left hand movement
var leftBodyLeaves = [];   

var maxHandVelocity = 0;
var lastHandVelocity = 0;
var lastSuccessfulVelocity = 0;
var throwLeavesVelocity = 400000;
var frame = 1;
var renderFrame = 0;


/* <><><><><><><><><><><><><><><><><><><><><><><><><><>
 *          S C E N E    O B J E C T S
 * <><><><><><><><><><><><><><><><><><><><><><><><><><>
 */
var xaxis;
var xaxisknob;
var yaxis;
var yaxisknob;
var zaxis;
var zaxisknob;
var floor;

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
// Three.js representation of above data, translated to the origin.
var threeScareCrow = {};

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
 RightFoot:24
};

/* Additional intermediate limbs that we build and display on
   the skeleton.  These were initially planned for collision
   detection functionality but in the interest of cpu power
   and simplicity we have very simple physics.
*/
var limbs = {
    LeftForearm: 25,
    LeftUpperarm: 26,
    RightForearm: 27,
    RightUpperarm: 28,
};

/* Maps the two end joints for one of our synthesized limbs. The
   code uses this map to determine which limbs to build. 
*/
var limbMap = {
    LeftForearm: ["LeftElbow", "LeftHand"],
    LeftUpperarm: ["LeftShoulder", "LeftElbow"],
    RightForearm: ["RightElbow", "RightHand"],
    RightUpperarm: ["RightShoulder", "RightElbow"],
}

/* <><><><><><><><><><><><><><><><><><><><><><><><><><>
 *          I M P L E M E N T A T I O N
 * <><><><><><><><><><><><><><><><><><><><><><><><><><>
 */

/* Add a skeleton to the history. */
function pushSkeletonHistory(userSkeleton) {
    if (skeletonHistory.length == skeletonHistoryCount - 1) {
        var oldestSkeleton = skeletonHistory.shift();
    }
    skeletonHistory.push(userSkeleton);
}

/* Computes the velocity/delta of the specified joint over the specified number of histories
 * TODO(tracy): Maybe we should attempt to snapshot at a higher frequency than every 1/3 second
 * and then scan through a few extra snapshots attempting to fill in any missed joints?
 */
function skeletonJointVelocity(jointName, numHistories) {
    var histories = [];
    var missedData = 0; // track the number of times we have a missing data point.
    var latestUserSkeleton = skeletonHistory[skeletonHistory.length - 1];
    var oldestUserSkeleton = skeletonHistory[skeletonHistory.length - numHistories];
    var deltaVector = new THREE.Vector3();
    if (!latestUserSkeleton || !oldestUserSkeleton) {
        console.log('skeleton history missing, returning 0 vector', deltaVector);
        return deltaVector;
    }
    var oldestPos = oldestUserSkeleton[skeletonPoints[jointName]].position;
    var latestPos = latestUserSkeleton[skeletonPoints[jointName]].position;
    // These positions come from Zigfu (not Three.js) so x,y,z are pos[0],[1],[2]
    deltaVector.set(latestPos[0] - oldestPos[0],
                    latestPos[1] - oldestPos[1],
                    latestPos[2] - oldestPos[2]);
    return deltaVector;
}

/*
OBSOLETE Sound code. New code is in wind.js.
TODO(tracy): make sound on/off a hotkey (no visual distraction).
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
*/

/* return a proxy for wind velocity as the relative time increment size, dt.
   this is just a hack so things like gravity increase with wind velocity. 
*/
function getWindVelocity() {
    // XXX should really have a random base, which is this effected
    // temporarily by changes in hand (and/or body?) motion
    // var slowGlobalDt = 0.00675;
    // var fastGlobalDt = 0.2;
    // 0.3 -> 0.00675
    // 1.0 -> .2
    // 0.7 :  0.19325
    var percent = (globalDt - slowGlobalDt) / fastGlobalDt;
    var velocity =  0.1 + (percent * 0.9);
    console.log('wind velocity', velocity);
    return velocity;
}

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

/* Utility function for dumping the current skeleton to the console.  This was used to
 * record the scarecrow model defined above.
 */
function dumpSkeleton() {
    console.log(skeletonPositions);
    for (var pointName in skeletonPositions) {
        var pos = skeletonPositions[pointName].position;
        console.log(pointName + ": [" + pos.x + "," + pos.y + "," + pos.z + "],");
    }
}

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

function removeLeafFromBody(leaf) {
    if (leaf == undefined) return;
    var leafAreas = [rightBodyLeaves, leftBodyLeaves, bodyLeaves];
    for (var n = 0; n < 3; n++) {
        var leaves = leafAreas[n];
        for (var i = 0; i < leaves.length; i++) {
            var bodyLeaf = leaves[i];
            if (leaf == bodyLeaf) {
                //console.log('removing body leaf');
                delete leaves[i];
                return;
            }
        }
    }
}

/* Release all leaves in random direction.  Called by user disengage, hand-clapping, etc.
 */
function releaseAllLeaves() {
    releaseSomeLeaves('RightHand');
    releaseSomeLeaves('LeftHand');
}

/* For now, jointName should be RightHand or LeftHand.
   Either hand causes leaves stuck in center body parts to also be released.
   TODO(tracy): Implement leaves per joint.  Needs a lot of sensible per-joint velocity
   threshold tuning.
 */
function releaseSomeLeaves(jointName, throwDirectionVector, throwDirectionMagnitudeSquared) {
    var leaves;
    if (jointName == 'RightHand') {
        leaves = rightBodyLeaves;
    } else if (jointName == 'LeftHand') {
        leaves = leftBodyLeaves;
    }
    while (leaves.length) {
        var leaf = leaves.pop();
        if (!leaf) continue;
        leaf.bodyPart = 0;
        if (throwDirectionVector) {
            throwDirectionVector.normalize();
            throwDirectionVector.multiplyScalar(10.0);
            leaf.velocity.x = throwDirectionVector.x;
            leaf.velocity.y = throwDirectionVector.y;
            leaf.velocity.z = throwDirectionVector.z;
        } else {
            leaf.velocity.x = 10 - 20 * Math.random();
            leaf.velocity.y = 10 - 20 * Math.random();
            leaf.velocity.z = 10 - 20 * Math.random();
        }
        leaf.wasStuck = true; // make sure leaf only sticks once, reset in Leaf.reset()
    }
    // release the leaves stuck in the middle either time the left or right hand causes
    // leaf release.
    releaseLeaves(throwDirectionVector, throwDirectionMagnitudeSquared);
}

/* Release the leaves in the given direction.  Take the throwDirectionVector and
   scale it by some multiple of the direction vector magnitude squared and use that
   for the leaf velocity.  We use the squared value since it is cheaper to compute
   and we are already computing it for determining if the joint is moving fast
   enough to throw the leaves off. 
   NOTE(tracy): velocity value of 10 looks pretty good.  maybe velocity value should
   range between 5 and 15?
*/
function releaseLeaves(throwDirectionVector, throwDirectionMagnitudeSquared) {
    // release all leaves.
    while (bodyLeaves.length) {
        var leaf = bodyLeaves.pop();
        if (!leaf) continue;
        leaf.bodyPart = 0;
        if (throwDirectionVector) {
            throwDirectionVector.normalize();
            throwDirectionVector.multiplyScalar(10.0);
            leaf.velocity.x = throwDirectionVector.x;
            leaf.velocity.y = throwDirectionVector.y;
            leaf.velocity.z = throwDirectionVector.z;
        } else {
            leaf.velocity.x = 10 - 20 * Math.random();
            leaf.velocity.y = 10 - 20 * Math.random();
            leaf.velocity.z = 10 - 20 * Math.random();
        }
        leaf.wasStuck = true;
    }
}

/* Three.js Stats view. Shows current FPS. 
 */
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
$('#view').append(stats.domElement);


/* varbox is used to display the value of tunable parameters.
   TODO(tracy): Finish this code for fine-tuning parameters via the keyboard.
 */
varBoxDiv = $('<div id="varbox"></div>');
varBoxDiv.css({position:'fixed', bottom: '10px', left: '10px', display: 'block', color: '#ffffff', 'z-index': 1000, 'font-size': '120px'});
varBoxDiv.html('');
$('#view').append(varBoxDiv);

var currentVarBoxVarIndex;

varBoxVars = [ {name: 'wind', initial: 0.130375, min: 0.130375, max: 1.0, steps: 10, current: 0.130375},
               {name: 'leaf_force', initial: 3, min: 1, max: 5, steps: 10, current: 3},
               {name: 'leaf_mode', initial: 'stick', enum: ['stick', 'bounce']}
               ];

function setVarBoxDisplay(varname, varvalue) {
    $('#varbox').html(varname + ' ' + varvalue);
}

function getVarBoxVariable(varname) {
    for (var i = 0; i < varBoxVars.length; i++) {
        var boxVariable = varBoxVars[i];
        if (boxVariable.name == varname) {
            return boxVariable;
        }
    }
}

function nextVarBoxVar() {
    currentVarBoxVarIndex++;
    if (currentVarBoxVarIndex >= varBoxVars.length)
        currentVarBoxVarIndex = 0;
    return getCurrentVarBoxVar();
}

function prevVarBoxVar() {
    currentVarBoxVarIndex++;
    if (currentVarBoxVarIndex < 0)
        currentVarBoxVarIndex = varBoxVars.length-1;
    return getCurrentVarBoxVar();
}

function getCurrentVarBoxVar() {
    return varBoxVars[currentVarBoxVarIndex];
}

/* hotkeys
 */
$(document).keydown(function(e) {
	console.log(e);
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

        // set wind volume based on gain
        windGainNode.gain.value = getWindVelocity();
	} else if (e.keyCode == 40 || e.keyCode == 66) {
	    // down
        globalDt -= 0.019325;
        if (globalDt < slowGlobalDt)
            globalDt = slowGlobalDt;

        // set wind volume based on gain
        windGainNode.gain.value = getWindVelocity();
    } else if (e.keyCode == 65) {
        toggleAll();
    } else if (e.keyCode == 67) {
        toggleCamera();
    } else if (e.keyCode == 68) {
        toggleSkeleton();
    } else if (e.keyCode == 70) {
        // toggleFloor();
    } else if (e.keyCode == 72) {
        // h - simulate doHandsTogether()
        doHandsTogether();
    } else if (e.keyCode == 88) {
        toggleXAxis();
    } else if (e.keyCode == 89) {
        toggleYAxis();
    } else if (e.keyCode == 90) {
        toggleZAxis();
    } else if (e.keyCode == 83) {
        useScareCrow = !useScareCrow;
        console.log(useScareCrow);
    } else if (e.keyCode == 76) {
        releaseAllLeaves();
    } else if (e.keyCode == 74) {
        // j
        
    } else if (e.keyCode == 75) {
        // k
    }
});


/* called when hands are together, separate method for manual triggering ('h' key).
 */
function thunderFlash() {
    if (flashCount == 0) return;
    if (backgroundBlack) {
        $('body').css({'background-color': '#ffffff'});
        backgroundBlack = false;
    } else {
        $('body').css({'background-color': '#000000'});
        backgroundBlack = true;
    }
    flashCount--;
}
    
function doHandsTogether() {
    // prevent double-clapping etc from re-triggering midcycle, otherwise we
    // might be left with a white background.
    if (flashCount == 0) {
        playSound(thunderBuffer);
        releaseAllLeaves();
        flashCount = 16;
    }
}

function handsTogether() {
    var rightHandPoint = skeletonObjs["RightHand"];
    var leftHandPoint = skeletonObjs["LeftHand"];
    if (rightHandPoint.position.distanceTo(leftHandPoint.position) < handsTogetherDistance) {
        doHandsTogether();
    }
}

/* Returns true if this joint is considered the right side of the body. 
   We keep track which side the leaf is stuck to so that we can throw off
   all right-side-stuck leaves when hand velocity is high.
*/
var rightSideJoints = {'RightElbow': 1, 'RightHand': 1, 'RightKnee': 1, 'RightFoot': 1};
function isRightSideBody(jointName) {
    return rightSideJoints.hasOwnProperty(jointName);
}

/* Returns true if this joint is considered the left side of the body.
 */
var leftSideJoints = {'LeftElbow': 1, 'LeftHand': 1, 'LeftKnee': 1, 'LeftFoot': 1};
function isLeftSideBody(jointName) {
    return leftSideJoints.hasOwnProperty(jointName);
}

/* Check if the leaf has come close enough to any joint to be considered a hit.  If so,
 * mark the leaf as stuck and track which side of the body it was stuck to so we can
 * release it with the appropriate hand velocity. Also store the relative delta vector
 * so that as the skeleton moves we can move the leaf appropriately.
 */
function hitBodyTest(leaf) {
    var pos = leaf.geometry.position;
    var hitPoints = ["Head", "RightElbow", "RightHand", "LeftElbow", "LeftHand", "LeftKnee", "RightKnee", "Torso", "RightFoot", "LeftFoot"];
    for (var i = 0; i < hitPoints.length; i++) {
        var skeletonPoint = skeletonPositions[hitPoints[i]];
        var d = pos.distanceTo(skeletonPoint.position);
        if (pos.distanceTo(skeletonPoint.position) < 0.75) {
            if (leafMode == 'stick') {
                leaf.bodyPart = hitPoints[i];
                if (isRightSideBody(hitPoints[i])) {
                    rightBodyLeaves.push(leaf);
                } else if (isLeftSideBody(hitPoints[i])) {
                    leftBodyLeaves.push(leaf);
                } else {
                    bodyLeaves.push(leaf);
                }
                var deltaVector = new THREE.Vector3();
                deltaVector.x = pos.x - skeletonPoint.position.x;
                deltaVector.y = pos.y - skeletonPoint.position.y;
                deltaVector.z = pos.z - skeletonPoint.position.z;
                leaf.deltaVector = deltaVector;
            } else if (leafMode == 'bounce') {
                // TODO(tracy): Compute vector to center point of joint and bounce along that vector.
                // i.e. compute delta vector, normalize it and then multiply components times bounce factor.
                leaf.forceX = 2.0;
                leaf.forceY = 4.0;
                leaf.forceZ = 2.0;
            }
            return hitPoints[i];
        }
    }
    return undefined;
}

/* For leaves that are stuck to the body, we need to compute their new position as the skeleton moves around.
 */
function positionAttachedLeaves() {
    var leaves;
    var count = 0;
    for (var x = 0; x < 3; x++) {
        ++count;
        if (x == 0) leaves = rightBodyLeaves;
        if (x == 1) leaves = leftBodyLeaves;
        if (x == 2) leaves = bodyLeaves;
        for (var i = 0; i < leaves.length; i++) {
            var leaf = leaves[i];
            if (!leaf) {
                console.log('bodyLeaves had null leaf');
                continue;
            }
            var skeletonPoint = skeletonPositions[leaf.bodyPart];
            leaf.geometry.position.x = skeletonPoint.position.x + leaf.deltaVector.x;
            leaf.geometry.position.y = skeletonPoint.position.y + leaf.deltaVector.y;
            leaf.geometry.position.z = skeletonPoint.position.z + leaf.deltaVector.z;
        }
    }
}

/* <><><><><><><><><><><><><><><><><><><><><><><><><><>
 *       Z I G F U    I N T E G R A T I O N
 * <><><><><><><><><><><><><><><><><><><><><><><><><><>
 */

function loaded() {
    zig.embed();
    var engager = zig.EngageUsersWithSkeleton(1);
    engager.addEventListener('userengaged', function(user) {
            console.log('User engaged: ' + user.id);
            user.addEventListener('userupdate', function(user) {
                    frame++;
                    var debug = (frame % 180) == 0;
                    // if (debug) console.log('user skeleton', user.skeleton);
                    // if (debug) console.log('Head position: ' + user.skeleton[zig.Joint.Head].position);
                    var xrange = 400;
                    var yrange = 400;
                    var zrange = 400;
                    var leftElbowRotation = undefined;
                    var rightElbowRotation = undefined;
                    var jointRotations = [];
                    // TODO(tracy): Compute skeleton delta for computing velocity
                    // Also, maybe we should moving average the skeleton in order to take out some
                    // of the jitter?  
                    // Also, not all positions are reported each time, so we must be very careful with
                    // computing joint velocities / deltas.  If the joint was not reported last time/tick, then
                    // we should compute velocity as zero.
                    
                    // if (debug) console.log(user.skeleton);
                    if (frame % skeletonVelocitySnapshotFrames == 0) pushSkeletonHistory(user.skeleton);

                    var checkVelocityJoints = ["RightHand", "LeftHand"];
                    for (var n = 0; n < checkVelocityJoints.length; n++) {
                        var curJoint = checkVelocityJoints[n];
                        if (frame % skeletonVelocityCheckFrames == 0) {
                            var handVelocityVector = skeletonJointVelocity(curJoint, 2);
                            // just use length squared for computation speed.  leaf flipping threshold can be length squared.
                            var handVelocitySquared = handVelocityVector.lengthSq();
                            //console.log('handVelocity', handVelocitySquared);
                            // console.log(handVelocityVector);
                            if (handVelocitySquared > maxHandVelocity) {
                                maxHandVelocity = handVelocitySquared;
                            }
                            lastHandVelocity = handVelocitySquared;
                            //console.log('maxHandVelocity', maxHandVelocity);
                            if (handVelocitySquared > throwLeavesVelocity) {
                                lastSuccessfulVelocity = handVelocitySquared;
                                //handVelocityVector.normalize(); // get the direction of the hand movement.
                                releaseSomeLeaves(curJoint, handVelocityVector, handVelocitySquared);
                            }
                        }
                    }
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
                });
        });
    engager.addEventListener('userdisengaged', function(user) {
            console.log('User disengaged: ' + user.id);
            releaseAllLeaves();
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
    initWindSound();
    //setupWind();
}


/* <><><><><><><><><><><><><><><><><><><><><><><><><><>
 *          I N I T I A L I Z A T I O N
 * <><><><><><><><><><><><><><><><><><><><><><><><><><>
 */

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
                           new THREE.MeshLambertMaterial({color: 0x029613}));
    xaxis.scale.set(50, 0.2, 0.2);
    xaxisknob = new THREE.Mesh(new THREE.CubeGeometry(0.4, 0.4, 0.4),
                               new THREE.MeshLambertMaterial({color: 0x00FF00}));
    xaxisknob.position.x = 5;
    if (showXAxis) {
        showXAxis = false;
        toggleXAxis();
    }

    yaxis = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                           new THREE.MeshLambertMaterial({color: 0x2232a0}));
    yaxis.scale.set(0.2, 10, 0.2);
    yaxisknob = new THREE.Mesh(new THREE.CubeGeometry(0.4, 0.4, 0.4),
                               new THREE.MeshLambertMaterial({color: 0x2232a0}));
    yaxisknob.position.y = 5;

    if (showYAxis) {
        showYAxis = false;
        toggleYAxis();
    }

    zaxis = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                           new THREE.MeshLambertMaterial({color: 0xee8543}));
    zaxis.scale.set(.2, .2, 50);
    zaxisknob = new THREE.Mesh(new THREE.CubeGeometry(0.4, 0.4, 0.4),
                               new THREE.MeshLambertMaterial({color: 0xFF0000}));
    zaxisknob.position.z = 5;

    if (showZAxis) {
        showZAxis = false;
        toggleZAxis();
    }

    floor = new THREE.Mesh(new THREE.CubeGeometry(10, 0.1, 10),
                           new THREE.MeshLambertMaterial({color: 0xf8f62c}));
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
        renderFrame++;
        Leaf.tick();
        if (renderFrame % flashLengthInFrames == 0) thunderFlash();
        renderer.render(scene, camera);
        stats.update();
        setVarBoxDisplay('', Math.floor(lastSuccessfulVelocity/1000) + ' / ' + Math.floor(lastHandVelocity/1000));
        renderFunc();
      });
    }
    renderFunc();
};

