// import React, { useState, useEffect, useRef } from 'react';
// import { Grid } from '@react-three/drei';
// import { useGameContext } from '../contexts/GameContext';
// import { useFrame, useThree } from '@react-three/fiber';
// import { BASIC_MAT } from '../graphics/materials';
// import { pi, cyl_mesh, box_mesh } from '../graphics/meshes';
// import Tans from './Tans';
// import VisCoord from './VisCoord';
// import { PieceState } from '../puzzles/PieceState';
// import { Puzzle } from '../puzzles/Puzzle';
// import { PUZZLE_LIST } from '../puzzles/puzzleLib';
// import { STATUS, TASK_LIST, MASK_KEY_MAP, CSV_HEADER, TAN_KEYS,
//     COL_NAME_INDICE, EVENT_CTRL } from '../constants/gameConfig';
// import { toStdDeg, getTimeStampString } from '../utils/utils';
// import * as THREE from 'three';


// function MainCoordinateIndicator() {
//     const cylGeo  = [0.1, 0.1, 1, 24, 1];
//     const meshRot = [pi(0.5), 0, 0];
//     const [visFlag, setVisFlag] = useState(false);

//     function handleKeyDown(event) {
//         if (EVENT_CTRL.displayMainCoordinates && event.key === 'g') {
//             setVisFlag(true);
//         }
//     }

//     function handleKeyUp(event) {
//         if (EVENT_CTRL.displayMainCoordinates && event.key === 'g') {
//             setVisFlag(false);
//         }
//     }

//     useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         window.addEventListener('keyup', handleKeyUp);
        
//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//             window.removeEventListener('keyup', handleKeyUp);
//         };
//     // eslint-disable-next-line
//     }, []);

//     return (
//         <group visible={visFlag}>
//             {cyl_mesh(BASIC_MAT.ORI, cylGeo, [0,0,0], meshRot)}
//             {box_mesh(BASIC_MAT.HOV, [1,0.04,0.5], [0.5,0,0])}
//             <Grid
//                 infiniteGrid={true} 
//                 cellSize={1} 
//                 cellThickness={0.5}
//                 rotation={[Math.PI * 0.5,0,0]}
//                 visible={true}
//             />
//         </group>
//     );
// }

// function PlayBoard({state, handleProgress}) {
//     const { 
//         hoverMask, isDragging, initPan, initRot, initAngle, focusMask,
//         rotationEnabled, playerTans, lastEntry, addGameData 
//     } = useGameContext();
//     const { camera, size } = useThree();
//     const mouseXYRef = useRef({ x: 0, y: 0 });

//     const puzzleKey = TASK_LIST[state.taskId];
//     const coordinateRef = useRef();
//     let ps = updateCurrentPieceState();
//     const currPz = new Puzzle('running', ps);

//     function updateCurrentPieceState() {
//         const temp = {};
//         Object.entries(playerTans.current).forEach(([key, piece]) => {
//             const {x: px, y: py} = piece.current.position;
//             const {y: ry, z: rz} = piece.current.rotation;
//             temp[key] = { 
//                 px: Number(px.toFixed(2)), 
//                 py: Number(py.toFixed(2)),
//                 rz: toStdDeg(rz) 
//             };
//             if (key === 'PL') {
//                 temp[key]['ry'] = toStdDeg(ry);
//             }
//         });
//         return new PieceState(temp);
//     }

//     const screenToScene = (screenX, screenY) => {
//         const ndcX = +((screenX / size.width ) * 2 - 1);
//         const ndcY = -((screenY / size.height) * 2 - 1);
//         const worldPosition = new THREE.Vector3(ndcX, ndcY, 0);
//         worldPosition.unproject(camera);
//         worldPosition.z = 1;
//         return worldPosition;
//     };

//     const handleMouseMove = (event) => {
//         mouseXYRef.current.x = event.clientX;
//         mouseXYRef.current.y = event.clientY;
//     };
    
//     const computeProgress = () => {
//         if (!puzzleKey) return [0, 1];

//         ps = updateCurrentPieceState();
//         currPz.update(ps);
//         const C = currPz.atomStates;
//         const T = PUZZLE_LIST[puzzleKey].atomStates;
//         const R = C.intersection(T);
//         return [R.size, T.size];
//     }

//     const pushRecordToBuffer = () => {
//         if (!puzzleKey) {
//             handleProgress(0);
//             return;
//         }
//         const [match, total] = computeProgress(puzzleKey);
//         const progressScore = match * 100 / total;
//         handleProgress(progressScore);
        
//         // Organize new entry of current data after some mouse up event
//         const tans = playerTans.current;
//         const transformData = {};
//         Object.keys(tans).forEach(name => {
//             const piece = tans[name].current;
//             transformData[`${name}_X`] = piece.position.x.toFixed(1);
//             transformData[`${name}_Y`] = piece.position.y.toFixed(1);
//             transformData[`${name}_R`] = toStdDeg(piece.rotation.z).toFixed(0);
//         });
//         const PL_F = toStdDeg(tans.PL.current.rotation.y).toFixed(0);

//         const stepIdx = COL_NAME_INDICE[CSV_HEADER.STEP];
//         const maxProIdx = COL_NAME_INDICE[CSV_HEADER.MAX_PROGRESS];
//         const newStep = lastEntry.current[stepIdx] + 1;

//         const currProgressStr = progressScore.toFixed(2);
//         const lastMaxProgressStr = lastEntry.current[maxProIdx];
//         const currMaxProgressStr = Math.max(
//             Number(currProgressStr), Number(lastMaxProgressStr)).toFixed(2);

//         const currEntry = [
//             puzzleKey, 
//             getTimeStampString(),
//             newStep,
//             'none',
//             ...Object.values(transformData),
//             PL_F,
//             currProgressStr,
//             currMaxProgressStr,
//         ];

//         // add game data to csvBuffer
//         const focusIdx = COL_NAME_INDICE[CSV_HEADER.FOCUS_PIECE];
//         const focusPiece = MASK_KEY_MAP[hoverMask.current];
//         if (focusPiece && state.status === STATUS.SOLVING) {
//             currEntry[focusIdx] = focusPiece;
//             addGameData(currEntry);
//             lastEntry.current = currEntry;
//         }
//     }
    
//     const handleKeyDown = (event) => {
//         // Admin-dev: display tangram piece for building new puzzle
//         if (EVENT_CTRL.logPieceStateToConsole && event.key === 'l') {
//             ps = updateCurrentPieceState();
//             console.log(ps.toString());
//         }
//         // Debug: display current 3D position of tangram puzzle
//         if (EVENT_CTRL.logPieceStateToConsole && event.key === 'd') {
//             TAN_KEYS.forEach((key) => {
//                 const pz = playerTans.current[key];
//                 console.log(`${key}: `, pz.current.position);
//             });
//         }
//         // Flag control: rotationEnabled 
//         if (event.key.toLowerCase() === 'r') {
//             if (isDragging.current && focusMask.current > 0 && !rotationEnabled.current) {
                
//                 const pieceKey = MASK_KEY_MAP[focusMask.current];
//                 const tanRef = playerTans.current[pieceKey];
                
//                 const ry = tanRef.current.rotation.y;
//                 const sign = (pieceKey === 'PL' && ry === Math.PI) ? -1 : 1;
                
//                 const x = mouseXYRef.current.x;
//                 const y = mouseXYRef.current.y;
//                 const initCursor = screenToScene(x, y);
                
//                 if (initAngle.current === undefined) {
//                     initRot.current = initCursor.clone().sub(tanRef.current.position);
//                     initAngle.current = tanRef.current.rotation.z * sign;
//                 }   
//             }
//             rotationEnabled.current = true;
//         }
//     };


//     const handleKeyUp = (event) => {
//         if (event.key.toLowerCase() === 'r') {
//             rotationEnabled.current = false;
//             isDragging.current = false;
//             initAngle.current = undefined;
//         }
//     };

//     const handleMouseDown = (event) => {
//         console.log(`mouse down: ${isDragging.current}`);
//         // Process at the beginning of a 'dragging' operation
//         if (hoverMask.current > 0 && !isDragging.current) {
//             focusMask.current = hoverMask.current;
//             const pieceKey = MASK_KEY_MAP[focusMask.current];
//             const tanRef = playerTans.current[pieceKey];

//             const ry = tanRef.current.rotation.y;
//             const sign = (pieceKey === 'PL' && ry === Math.PI) ? -1 : 1;

//             const x = event.clientX;
//             const y = event.clientY;
//             const initCursor = screenToScene(x, y);
            
//             // Handle init for transition
//             if (!rotationEnabled.current) {
//                 initPan.current = initCursor.clone().sub(tanRef.current.position);
//             }
//             else {
//                 if (initAngle.current === undefined) {
//                     initRot.current = initCursor.clone().sub(tanRef.current.position);
//                     initAngle.current = tanRef.current.rotation.z * sign;
//                 }
//             }
//             // set flag true
//             isDragging.current = true;
//         }
//     }

//     const handleMouseUp = (event) => {
//         isDragging.current = false;
//         focusMask.current = 0;
//         initAngle.current = undefined;
//         pushRecordToBuffer();
//     }

//     const handleDoubleClick = () => {
//         // after double click, in case (...rarely) the player double-click
//         // the PL which leads a final win, we do a computeProgress call
//         // from the handleMouseUp function after 0.1 seconds
//         setTimeout(() => {
//             pushRecordToBuffer();
//         }, 100);
//     }

//     const disableRightClick = (event) => {
//         event.preventDefault();
//     };

//     useEffect(() => {
//         // Add event listeners for keydown and keyup
//         window.addEventListener('keydown', handleKeyDown);
//         window.addEventListener('keyup', handleKeyUp);
//         window.addEventListener('mousedown', handleMouseDown);
//         window.addEventListener('mouseup', handleMouseUp);
//         window.addEventListener('mousemove', handleMouseMove);
//         window.addEventListener('dblclick', handleDoubleClick);
//         window.addEventListener('contextmenu', disableRightClick);
        
//         // Clean up by removing event listeners on unmount
//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//             window.removeEventListener('keyup', handleKeyUp);
//             window.removeEventListener('mousedown', handleMouseDown);
//             window.removeEventListener('mouseup', handleMouseUp);
//             window.removeEventListener('mousemove', handleMouseMove);
//             window.removeEventListener('dblclick', handleDoubleClick);
//             window.removeEventListener("contextmenu", disableRightClick);
//         };
//     // eslint-disable-next-line
//     }, [state]);


//     const updateCursorStyle = () => {
//         if (isDragging.current) {
//             document.body.style.cursor = 'grabbing';
//         }
//         else if (hoverMask.current > 0) {
//             document.body.style.cursor = 'grab';
//         }
//         else {
//             document.body.style.cursor = 'default';
//         }
//     }

//     const roundToRad = (angle) => {
//         const UNIT = 15;
//         const degrees = THREE.MathUtils.radToDeg(angle);
//         const roundedDegrees = Math.round(degrees / UNIT) * UNIT;
//         return THREE.MathUtils.degToRad(roundedDegrees);
//     }

//     const roundDist = (vec) => {
//         const UNIT = 0.1;
//         // Helper function to round to the nearest multiple of UNIT
//         const roundTo = (value, unit) => Math.round(value / unit) * unit;
    
//         // Return a new vector rounded to the nearest multiple of UNIT
//         return new THREE.Vector3(
//             roundTo(vec.x, UNIT),
//             roundTo(vec.y, UNIT),
//             roundTo(vec.z, UNIT)
//         );
//     }

//     useFrame((ctx, delta) => {
//         updateCursorStyle();

//         if (isDragging.current) {
//             const pieceKey = MASK_KEY_MAP[focusMask.current];
//             const tanRef = playerTans.current[pieceKey];
//             const ry = tanRef.current.rotation.y;
//             const sign = (pieceKey === 'PL' && ry === Math.PI) ? -1 : 1;

//             // Access mouse position from (-1,1) coordinate
//             const mouseX = ctx.pointer.x;
//             const mouseY = ctx.pointer.y;
//             // Convert normalized coordinates to top-left-zero coordinate
//             const x = (mouseX + 1) / 2 * ctx.size.width;
//             const y = (1 - mouseY) / 2 * ctx.size.height;

//             // Convert mouse pos to three-canvas-scene coordinate
//             const currCursor = screenToScene(x, y);
            
//             // handle Rotation
//             if (rotationEnabled.current) {
//                 if (!initRot.current || initAngle.current === undefined) {
//                     return;
//                 }
//                 const diffVec = currCursor.clone().sub(tanRef.current.position);
//                 const B = Math.atan2(diffVec.y, diffVec.x);
//                 const A = Math.atan2(initRot.current.y, initRot.current.x);
//                 const result = roundToRad(initAngle.current + (B - A)) * sign;
//                 tanRef.current.rotation.z = result;
//             }
//             // hanlde translation
//             else {
//                 const targetPos = currCursor.clone().sub(initPan.current);
//                 tanRef.current.position.set(...roundDist(targetPos));
//             }
//         }
//     });

//     return (
//         <group ref={coordinateRef} position={[0,0,0]} >
//             <Tans />
//             <MainCoordinateIndicator />
//             <VisCoord state={state} />
//         </group>
//     );
// }

// export default React.memo(PlayBoard);


import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '@react-three/drei';
import { useGameContext } from '../contexts/GameContext';
import { useFrame, useThree } from '@react-three/fiber';
import { BASIC_MAT } from '../graphics/materials';
import { pi, cyl_mesh, box_mesh } from '../graphics/meshes';
import Tans from './Tans';
import VisCoord from './VisCoord';
import { PieceState } from '../puzzles/PieceState';
import { Puzzle } from '../puzzles/Puzzle';
import { PUZZLE_LIST } from '../puzzles/puzzleLib';
import { STATUS, TASK_LIST, MASK_KEY_MAP, CSV_HEADER, TAN_KEYS,
    COL_NAME_INDICE, EVENT_CTRL } from '../constants/gameConfig';
import { toStdDeg, getTimeStampString } from '../utils/utils';
import * as THREE from 'three';


function MainCoordinateIndicator() {
    const cylGeo  = [0.1, 0.1, 1, 24, 1];
    const meshRot = [pi(0.5), 0, 0];
    const [visFlag, setVisFlag] = useState(false);

    function handleKeyDown(event) {
        if (EVENT_CTRL.displayMainCoordinates && event.key === 'g') {
            setVisFlag(true);
        }
    }

    function handleKeyUp(event) {
        if (EVENT_CTRL.displayMainCoordinates && event.key === 'g') {
            setVisFlag(false);
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    // eslint-disable-next-line
    }, []);

    return (
        <group visible={visFlag}>
            {cyl_mesh(BASIC_MAT.ORI, cylGeo, [0,0,0], meshRot)}
            {box_mesh(BASIC_MAT.HOV, [1,0.04,0.5], [0.5,0,0])}
            <Grid
                infiniteGrid={true} 
                cellSize={1} 
                cellThickness={0.5}
                rotation={[Math.PI * 0.5,0,0]}
                visible={true}
            />
        </group>
    );
}

function PlayBoard({state, handleProgress}) {
    const { 
        hoverMask, isDragging, initPan, initRot, initAngle, focusMask,
        rotationEnabled, playerTans, lastEntry, addGameData 
    } = useGameContext();
    
    // Enhanced three hooks with proper viewport handling
    const { camera, size, viewport, invalidate } = useThree();
    const mouseXYRef = useRef({ x: 0, y: 0 });

    const puzzleKey = TASK_LIST[state.taskId];
    const coordinateRef = useRef();
    let ps = updateCurrentPieceState();
    const currPz = new Puzzle('running', ps);

    // Track size changes explicitly
    const sizeRef = useRef(size);
    
    // Update size ref when size changes
    useEffect(() => {
        sizeRef.current = size;
        invalidate(); // Force a re-render when size changes
    }, [size, invalidate]);

    function updateCurrentPieceState() {
        const temp = {};
        Object.entries(playerTans.current).forEach(([key, piece]) => {
            const {x: px, y: py} = piece.current.position;
            const {y: ry, z: rz} = piece.current.rotation;
            temp[key] = { 
                px: Number(px.toFixed(2)), 
                py: Number(py.toFixed(2)),
                rz: toStdDeg(rz) 
            };
            if (key === 'PL') {
                temp[key]['ry'] = toStdDeg(ry);
            }
        });
        return new PieceState(temp);
    }

    // Improved screen to scene conversion using viewport for better accuracy
    function screenToScene(screenX, screenY) {
        // Use the current size from the ref to ensure we have latest dimensions
        const currentSize = sizeRef.current;
        
        // Convert screen coordinates to normalized device coordinates (NDC)
        const ndcX = +((screenX / currentSize.width) * 2 - 1);
        const ndcY = -((screenY / currentSize.height) * 2 - 1);
        
        // Create a vector with NDC coordinates
        const worldPosition = new THREE.Vector3(ndcX, ndcY, 0);
        
        // Use the viewport factor to ensure proper scaling regardless of device/browser settings
        // This helps especially with browser zoom levels and devicePixelRatio differences
        worldPosition.unproject(camera);
        worldPosition.z = 1; // Set z to fixed value for the drag plane
        
        return worldPosition;
    }

    function handleMouseMove(event) {
        mouseXYRef.current.x = event.clientX;
        mouseXYRef.current.y = event.clientY;
    }
    
    function computeProgress() {
        if (!puzzleKey) return [0, 1];

        ps = updateCurrentPieceState();
        currPz.update(ps);
        const C = currPz.atomStates;
        const T = PUZZLE_LIST[puzzleKey].atomStates;
        const R = C.intersection(T);
        return [R.size, T.size];
    }

    function pushRecordToBuffer() {
        if (!puzzleKey) {
            handleProgress(0);
            return;
        }
        const [match, total] = computeProgress(puzzleKey);
        const progressScore = match * 100 / total;
        handleProgress(progressScore);
        
        // Organize new entry of current data after some mouse up event
        const tans = playerTans.current;
        const transformData = {};
        Object.keys(tans).forEach(name => {
            const piece = tans[name].current;
            transformData[`${name}_X`] = piece.position.x.toFixed(1);
            transformData[`${name}_Y`] = piece.position.y.toFixed(1);
            transformData[`${name}_R`] = toStdDeg(piece.rotation.z).toFixed(0);
        });
        const PL_F = toStdDeg(tans.PL.current.rotation.y).toFixed(0);

        const stepIdx = COL_NAME_INDICE[CSV_HEADER.STEP];
        const maxProIdx = COL_NAME_INDICE[CSV_HEADER.MAX_PROGRESS];
        const newStep = lastEntry.current[stepIdx] + 1;

        const currProgressStr = progressScore.toFixed(2);
        const lastMaxProgressStr = lastEntry.current[maxProIdx];
        const currMaxProgressStr = Math.max(
            Number(currProgressStr), Number(lastMaxProgressStr)).toFixed(2);

        const currEntry = [
            puzzleKey, 
            getTimeStampString(),
            newStep,
            'none',
            ...Object.values(transformData),
            PL_F,
            currProgressStr,
            currMaxProgressStr,
        ];

        // add game data to csvBuffer
        const focusIdx = COL_NAME_INDICE[CSV_HEADER.FOCUS_PIECE];
        const focusPiece = MASK_KEY_MAP[hoverMask.current];
        if (focusPiece && state.status === STATUS.SOLVING) {
            currEntry[focusIdx] = focusPiece;
            addGameData(currEntry);
            lastEntry.current = currEntry;
        }
    }
    
    function handleKeyDown(event) {
        // Admin-dev: display tangram piece for building new puzzle
        if (EVENT_CTRL.logPieceStateToConsole && event.key === 'l') {
            ps = updateCurrentPieceState();
            console.log(ps.toString());
        }
        // Debug: display current 3D position of tangram puzzle
        if (EVENT_CTRL.logPieceStateToConsole && event.key === 'd') {
            TAN_KEYS.forEach((key) => {
                const pz = playerTans.current[key];
                console.log(`${key}: `, pz.current.position);
            });
        }
        // Flag control: rotationEnabled 
        if (event.key.toLowerCase() === 'r') {
            if (isDragging.current && focusMask.current > 0 && !rotationEnabled.current) {
                
                const pieceKey = MASK_KEY_MAP[focusMask.current];
                const tanRef = playerTans.current[pieceKey];
                
                const ry = tanRef.current.rotation.y;
                const sign = (pieceKey === 'PL' && ry === Math.PI) ? -1 : 1;
                
                const x = mouseXYRef.current.x;
                const y = mouseXYRef.current.y;
                const initCursor = screenToScene(x, y);
                
                if (initAngle.current === undefined) {
                    initRot.current = initCursor.clone().sub(tanRef.current.position);
                    initAngle.current = tanRef.current.rotation.z * sign;
                }   
            }
            rotationEnabled.current = true;
        }
    }

    function handleKeyUp(event) {
        if (event.key.toLowerCase() === 'r') {
            rotationEnabled.current = false;
            isDragging.current = false;
            initAngle.current = undefined;
        }
    }

    function handleMouseDown(event) {
        console.log(`mouse down: ${isDragging.current}`);
        // Process at the beginning of a 'dragging' operation
        if (hoverMask.current > 0 && !isDragging.current) {
            focusMask.current = hoverMask.current;
            const pieceKey = MASK_KEY_MAP[focusMask.current];
            const tanRef = playerTans.current[pieceKey];

            const ry = tanRef.current.rotation.y;
            const sign = (pieceKey === 'PL' && ry === Math.PI) ? -1 : 1;

            const x = event.clientX;
            const y = event.clientY;
            const initCursor = screenToScene(x, y);
            
            // Handle init for transition
            if (!rotationEnabled.current) {
                initPan.current = initCursor.clone().sub(tanRef.current.position);
            }
            else {
                if (initAngle.current === undefined) {
                    initRot.current = initCursor.clone().sub(tanRef.current.position);
                    initAngle.current = tanRef.current.rotation.z * sign;
                }
            }
            // set flag true
            isDragging.current = true;
        }
    }

    function handleMouseUp() {
        isDragging.current = false;
        focusMask.current = 0;
        initAngle.current = undefined;
        pushRecordToBuffer();
    }

    function handleDoubleClick() {
        // after double click, in case (...rarely) the player double-click
        // the PL which leads a final win, we do a computeProgress call
        // from the handleMouseUp function after 0.1 seconds
        setTimeout(() => {
            pushRecordToBuffer();
        }, 100);
    }

    function disableRightClick(event) {
        event.preventDefault();
    }

    // Handle resize explicitly
    useEffect(() => {
        const handleResize = () => {
            // Force a recalculation when window is resized
            invalidate();
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [invalidate]);

    useEffect(() => {
        // Add event listeners for keydown and keyup
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('dblclick', handleDoubleClick);
        window.addEventListener('contextmenu', disableRightClick);
        
        // Clean up by removing event listeners on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('dblclick', handleDoubleClick);
            window.removeEventListener("contextmenu", disableRightClick);
        };
    // eslint-disable-next-line
    }, [state]);

    function updateCursorStyle() {
        if (isDragging.current) {
            document.body.style.cursor = 'grabbing';
        }
        else if (hoverMask.current > 0) {
            document.body.style.cursor = 'grab';
        }
        else {
            document.body.style.cursor = 'default';
        }
    }

    function roundToRad(angle) {
        const UNIT = 15;
        const degrees = THREE.MathUtils.radToDeg(angle);
        const roundedDegrees = Math.round(degrees / UNIT) * UNIT;
        return THREE.MathUtils.degToRad(roundedDegrees);
    }

    function roundDist(vec) {
        const UNIT = 0.1;
        // Helper function to round to the nearest multiple of UNIT
        const roundTo = (value, unit) => Math.round(value / unit) * unit;
    
        // Return a new vector rounded to the nearest multiple of UNIT
        return new THREE.Vector3(
            roundTo(vec.x, UNIT),
            roundTo(vec.y, UNIT),
            roundTo(vec.z, UNIT)
        );
    }

    useFrame((ctx, delta) => {
        updateCursorStyle();

        if (isDragging.current) {
            const pieceKey = MASK_KEY_MAP[focusMask.current];
            const tanRef = playerTans.current[pieceKey];
            const ry = tanRef.current.rotation.y;
            const sign = (pieceKey === 'PL' && ry === Math.PI) ? -1 : 1;

            // Get normalized mouse coordinates from Three.js pointer
            const mouseX = ctx.pointer.x;
            const mouseY = ctx.pointer.y;
            
            // Convert from normalized [-1,1] to pixel coordinates
            // Use viewport factor for better device scaling
            const vpFactor = viewport.factor || 1; // Account for device pixel ratio
            const x = (mouseX + 1) / 2 * ctx.size.width * vpFactor;
            const y = (1 - mouseY) / 2 * ctx.size.height * vpFactor;

            // Convert mouse pos to three-canvas-scene coordinate
            const currCursor = screenToScene(x, y);
            
            // handle Rotation
            if (rotationEnabled.current) {
                if (!initRot.current || initAngle.current === undefined) {
                    return;
                }
                const diffVec = currCursor.clone().sub(tanRef.current.position);
                const B = Math.atan2(diffVec.y, diffVec.x);
                const A = Math.atan2(initRot.current.y, initRot.current.x);
                const result = roundToRad(initAngle.current + (B - A)) * sign;
                tanRef.current.rotation.z = result;
                // Force a render update
                invalidate();
            }
            // handle translation
            else {
                const targetPos = currCursor.clone().sub(initPan.current);
                tanRef.current.position.set(...roundDist(targetPos));
                // Force a render update
                invalidate();
            }
        }
    });

    return (
        <group ref={coordinateRef} position={[0,0,0]} >
            <Tans />
            <MainCoordinateIndicator />
            <VisCoord state={state} />
        </group>
    );
}

export default React.memo(PlayBoard);