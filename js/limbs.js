                    /* NOTE(tracy): Commenting out limb reconstruction in attempt to get more fps.

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
                    */
