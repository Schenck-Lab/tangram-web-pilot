import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Grid } from '@react-three/drei';
import { BASIC_MAT } from '../graphics/materials';
import { useGameContext } from '../contexts/GameContext';
import { useFrame } from '@react-three/fiber';
import { pi, cyl_mesh, box_mesh } from '../graphics/meshes';
import TangramSet from './TangramSet';
import VisCoord from './VisCoord';
import { PieceState } from '../puzzles/PieceState';
import { Puzzle } from '../puzzles/Puzzle';
import { PUZZLE_LIST } from '../puzzles/puzzleLib';
import { STATUS, TASK_LIST } from '../constants/gameStatus';
import { toStdDeg, getTimeStampString } from '../utils/utils'


function MainCoordinateIndicator() {
    const cylGeo  = [0.1, 0.1, 1, 24, 1];
    const meshRot = [pi(0.5), 0, 0];
    const [visFlag, setVisFlag] = useState(false);

    function handleKeyDown(event) {
        if (event.key === 'g') {
            setVisFlag(true);
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'g') {
            setVisFlag(false);
        }
    }

    useEffect(() => {
        // Add event listeners for keydown and keyup
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        // Clean up by removing event listeners on unmount
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
        globalHover, pieceRef, lastEntry, addGameData
    } = useGameContext();

    const puzzleKey = TASK_LIST[state.taskId];
    const coordinateRef = useRef();
    const ps = [];
    updateCurrentPieceState(ps);
    const currPz = new Puzzle('running', ps);
    
    function updateCurrentPieceState() {
        ps.length = 0;
        for (let i = 0; i < pieceRef.current.length; ++i) {
            const currRef = pieceRef.current[i];
            if (Object.keys(currRef).length === 0) break;

            const temp = {};
            Object.keys(currRef).forEach(key => {
                const {x: px, y: py} = currRef[key].current.position;
                const {y: ry, z: rz} = currRef[key].current.rotation;

                temp[key] = { 
                    px: Number(px.toFixed(2)), 
                    py: Number(py.toFixed(2)),
                    rz: toStdDeg(rz) 
                };
                if (key === 'PL') {
                    temp[key]['ry'] = toStdDeg(ry);
                }
            });
            ps[i] = new PieceState(temp);
        }
    }

    const computeProgress = useCallback(() => {
        if (!puzzleKey) return [0, 1];

        updateCurrentPieceState();
        currPz.update(ps);
        const C = currPz.atomStates;
        const T = PUZZLE_LIST[puzzleKey].atomStates;
        const R = C.intersection(T);
        return [R.size, T.size];

    // eslint-disable-next-line
    }, [puzzleKey]); 
    
    const handleKeyDown = (event) => {
        if (event.key === 'l') {
            updateCurrentPieceState();
            console.log(ps[0].toString());
        }
    };

    function findTargetPiece(oldEntry, newEntry) {
        if (oldEntry.length !== newEntry.length) {
            throw new Error('Buffers size mismatch.');
        }
        if (oldEntry.length !== 27 || newEntry.length !== 27) {
            throw new Error(`Invalid Buffer size: 
                ${oldEntry.length}, ${newEntry.length}.`);
        }
        for (let i = 4; i < newEntry.length; ++i) {
            if (oldEntry[i] === newEntry[i]) {
                continue;
            }
            if (i === 26) {
                throw new Error('Progress Score error.');
            }
            if (i === 25) {
                return 'PL';
            }
            const pieceIndex = Math.floor((i - 4) / 3);
            return ['TL0', 'TL1', 'TM', 'TS0', 'TS1', 'SQ', 'PL'][pieceIndex];
        }
        return null;
    }

    function handleMouseUp(event) {
        if (!puzzleKey) {
            handleProgress(0);
            return;
        }
        const [match, total] = computeProgress(puzzleKey);
        const progressScore = match * 100 / total;
        handleProgress(progressScore);
        
        // Organize new entry of current data after some mouse up event
        const pieceSet = pieceRef.current[0];
        const transformData = {};
        Object.keys(pieceSet).forEach(name => {
            const piece = pieceSet[name].current;
            transformData[`${name}_X`] = piece.position.x.toFixed(1);
            transformData[`${name}_Y`] = piece.position.y.toFixed(1);
            transformData[`${name}_R`] = toStdDeg(piece.rotation.z);
        });
        const PL_F = toStdDeg(pieceSet.PL.current.rotation.y);

        const currEntry = [
            puzzleKey, 
            getTimeStampString(),
            lastEntry.current[2] + 1,
            'finding',
            ...Object.values(transformData),
            PL_F,
            progressScore.toFixed(2)
        ];

        // add game data to csvBuffer
        const targetPiece = findTargetPiece(currEntry, lastEntry.current)
        if (targetPiece !== null && state.status === STATUS.SOLVING) {
            currEntry[3] = targetPiece;
            addGameData(currEntry);
            lastEntry.current = currEntry;
        }
    }

    function handleDoubleClick() {
        // after double click, in case (...rarely) the player double-click
        // the PL which leads a final win, we do a computeProgress call
        // from the handleMouseUp function after 0.1 seconds
        setTimeout(() => {
            handleMouseUp();
        }, 100);
    }

    useEffect(() => {
        // Add event listeners for keydown and keyup
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('dblclick', handleDoubleClick);
        
        // Clean up by removing event listeners on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('dblclick', handleDoubleClick);
        };
    // eslint-disable-next-line
    }, [state]);


    function updateCursorStyle() {
        if (globalHover.current === 0) {
            document.body.style.cursor = 'default';
        }
        else if (document.body.style.cursor === 'default') {
            document.body.style.cursor = 'grab';
        }
    }

    // useEffect(() => {
    //     const init = PUZZLE_LIST.InitPine;
    //     //const init = PuzzleList[puzzleKey];
    //     for (let i = 0; i < pieceRef.current.length; ++i) {
    //         const tgt = init.pieceStates[i];
    //         const ref = pieceRef.current[i];

    //         Object.keys(ref).forEach(k => {
    //             const { px, py, rz } = tgt[k];
    //             ref[k].current.position.x = px;
    //             ref[k].current.position.y = py;
    //             ref[k].current.rotation.z = degToRad(rz);
    //             if (k === 'PL')
    //                 ref[k].current.rotation.y = degToRad(tgt[k].ry);
    //         });
    //     }
    //     flipRef.current[0] = 0;
    //     flipRef.current[1] = 0;
    // // eslint-disable-next-line
    // }, [puzzleKey]);

    useFrame(() => {
        updateCursorStyle();
    });

    return (
        <group ref={coordinateRef} position={[0,0,0]} >
            <TangramSet sid={0} matSet={BASIC_MAT} />
            <MainCoordinateIndicator />
            <VisCoord state={state} />
        </group>
    );
}

export default React.memo(PlayBoard);