import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '@react-three/drei';
import { useGameContext } from '../contexts/GameContext';
import { useFrame } from '@react-three/fiber';
import { BASIC_MAT } from '../graphics/materials';
import { pi, cyl_mesh, box_mesh } from '../graphics/meshes';
import Tans from './Tans';
import VisCoord from './VisCoord';
import { PieceState } from '../puzzles/PieceState';
import { Puzzle } from '../puzzles/Puzzle';
import { PUZZLE_LIST } from '../puzzles/puzzleLib';
import { STATUS, TASK_LIST, MASK_KEY_MAP, CSV_HEADER, COL_NAME_INDICE } from '../constants/gameConfig';
import { toStdDeg, getTimeStampString } from '../utils/utils';


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
    const { hoverMask, playerTans, lastEntry, addGameData } = useGameContext();

    const puzzleKey = TASK_LIST[state.taskId];
    const coordinateRef = useRef();
    let ps = updateCurrentPieceState();
    const currPz = new Puzzle('running', ps);
    
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

    const computeProgress = () => {
        if (!puzzleKey) return [0, 1];

        ps = updateCurrentPieceState();
        currPz.update(ps);
        const C = currPz.atomStates;
        const T = PUZZLE_LIST[puzzleKey].atomStates;
        const R = C.intersection(T);
        return [R.size, T.size];
    }
    
    const handleKeyDown = (event) => {
        if (event.key === 'l') {
            ps = updateCurrentPieceState();
            console.log(ps.toString());
        }
    };

    const handleMouseUp = (event) => {
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

    const handleDoubleClick = () => {
        // after double click, in case (...rarely) the player double-click
        // the PL which leads a final win, we do a computeProgress call
        // from the handleMouseUp function after 0.1 seconds
        setTimeout(() => {
            handleMouseUp();
        }, 100);
    }

    const disableRightClick = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        // Add event listeners for keydown and keyup
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('dblclick', handleDoubleClick);
        window.addEventListener('contextmenu', disableRightClick);
        
        // Clean up by removing event listeners on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('dblclick', handleDoubleClick);
            window.removeEventListener("contextmenu", disableRightClick);
        };
    // eslint-disable-next-line
    }, [state]);


    function updateCursorStyle() {
        if (hoverMask.current === 0) {
            document.body.style.cursor = 'default';
        }
        else if (document.body.style.cursor === 'default') {
            document.body.style.cursor = 'grab';
        }
    }

    useFrame(() => {
        updateCursorStyle();
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