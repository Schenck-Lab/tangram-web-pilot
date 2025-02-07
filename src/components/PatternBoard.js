import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { TANGRAM_SHAPES } from '../graphics/tangramShapes';
import { PUZZLE_LIST } from '../puzzles/puzzleLib';
import { useGameContext } from '../contexts/GameContext';
import { BASIC_MAT } from '../graphics/materials';
import VisCoord from './VisCoord';
import { STATUS, TASK_LIST } from '../constants/gameStatus';

// Puzzle Effect
const PUZZLE_EFFECTS = Object.freeze({
    'Bear': {
        px: -2,
        py: 1,
        update: (ref, state, delta) => {
            const t = state.clock.getElapsedTime();
            const initAngle = Math.PI * -0.03;
            const amplitude = Math.PI * 0.1;
            ref.current.rotation.z = initAngle + Math.sin(t * 0.5) * amplitude;
        },
    },

    'NinjaStar': {
        px: -2,
        py: 0,
        update: (ref, state, delta) => {
            ref.current.rotation.z += Math.PI * delta * 0.2;
        },
    },

    'Fox': {
        px: 0,
        py: 0,
        update: (ref, state, delta) => {
            ref.current.rotation.z = Math.PI * -0.25;
        },
    },

    'AbstractZero': {
        px: -2,
        py: 0,
        update: (ref, state, delta) => {
            ref.current.rotation.z = Math.PI * 0.25;
        },
    }
});


function degToRad(deg) {
    return deg * Math.PI / 180;
}

function PtnPiece({sid, pieceKey, matSet}) {
    const { ptnRef } = useGameContext();
    ptnRef.current[sid][pieceKey] = useRef();
    const ptnMesh = TANGRAM_SHAPES[pieceKey](matSet.BLK, 0);

    return (
        <group ref={ptnRef.current[sid][pieceKey]} position={[0,0,-1]}>
            {ptnMesh}
        </group>
    );
}

function PatternBoard({ state }) {
    const puzzleKey = TASK_LIST[state.taskId];
    const outerRef = useRef();
    const innerRef = useRef();
    const pz = PUZZLE_LIST[puzzleKey];
    const ptnKeys = ['TL0', 'TL1', 'TM', 'TS0', 'TS1', 'SQ', 'PL'];
    const { ptnRef } = useGameContext();
    const matSet = BASIC_MAT;
    const scale = [0.5, 0.5, 0.5];

    useEffect(() => {
        if (!puzzleKey) return;
        
        for (let i = 0; i < ptnRef.current.length; ++i) {
            const tgt = pz.pieceStates[i];
            const ref = ptnRef.current[i];

            Object.keys(ref).forEach(k => {
                const { px, py, rz } = tgt[k];
                ref[k].current.position.x = px;
                ref[k].current.position.y = py;
                ref[k].current.rotation.z = degToRad(rz);
                if (k === 'PL')
                    ref[k].current.rotation.y = degToRad(tgt[k].ry);
            });
        }

        if (puzzleKey in PUZZLE_EFFECTS) {
            const x = PUZZLE_EFFECTS[puzzleKey].px;
            const y = PUZZLE_EFFECTS[puzzleKey].py;
            outerRef.current.position.x = x;
            outerRef.current.position.y = y;
            innerRef.current.position.x = -x;
            innerRef.current.position.y = -y;
        }
        else {
            outerRef.current.position.x = 0;
            outerRef.current.position.y = 0;
            innerRef.current.position.x = 0;
            innerRef.current.position.y = 0;
            outerRef.current.rotation.z = 0;
        }
    // eslint-disable-next-line
    }, [puzzleKey]);

    useFrame((state, delta) => {
        if (puzzleKey in PUZZLE_EFFECTS) {
            PUZZLE_EFFECTS[puzzleKey].update(outerRef, state, delta);
        }
    });

    return (
        <group position={[7, 1.5, 0]} scale={scale}>
            <group ref={outerRef} >
                <group ref={innerRef} >
                    {pz?.pieceStates.map((_, sid) =>
                        ptnKeys.map((k, i) => (
                            <PtnPiece key={i} sid={sid} pieceKey={k} matSet={matSet} />
                    )))}
                    <VisCoord state={state} grid={false} />
                </group>
            </group>
        </group>
    );
}

export default React.memo(PatternBoard);