import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { TANGRAM_SHAPES } from '../graphics/tangramShapes';
import { PUZZLE_LIST, PUZZLE_EFFECTS } from '../puzzles/puzzleLib';
import { useGameContext } from '../contexts/GameContext';
import { BASIC_MAT } from '../graphics/materials';
import { TASK_LIST, TAN_KEYS } from '../constants/gameConfig';
import VisCoord from './VisCoord';
import { degToRad } from '../utils/utils';


function PatternPiece({ pieceKey }) {
    const { targetTans } = useGameContext();
    targetTans.current[pieceKey] = useRef();
    const matSet = BASIC_MAT;
    const ptnMesh = TANGRAM_SHAPES[pieceKey](matSet.BLK, 0);

    return (
        <group ref={targetTans.current[pieceKey]} position={[0,0,-1]}>
            {ptnMesh}
        </group>
    );
}

function PatternBoard({ state }) {
    const { targetTans } = useGameContext();
    const outerRef = useRef();
    const innerRef = useRef();

    const puzzleKey = TASK_LIST[state.taskId];
    const puzzleObj = PUZZLE_LIST[puzzleKey];
    const scale = [0.5, 0.5, 0.5];

    useEffect(() => {
        if (!puzzleKey) return;
        
        const tgt = puzzleObj.pieceStates;
        const ref = targetTans.current;

        Object.keys(ref).forEach(key => {
            const { px, py, rz } = tgt[key];
            ref[key].current.position.x = px;
            ref[key].current.position.y = py;
            ref[key].current.rotation.z = degToRad(rz);
            if (key === 'PL')
                ref[key].current.rotation.y = degToRad(tgt[key].ry);
        });
        
        // Render puzzle effects
        const outerPos = outerRef.current.position;
        const innerPos = innerRef.current.position;

        if (puzzleKey in PUZZLE_EFFECTS) {
            const x = PUZZLE_EFFECTS[puzzleKey].px;
            const y = PUZZLE_EFFECTS[puzzleKey].py;
            outerPos.x = x;
            outerPos.y = y;
            innerPos.x = -x;
            innerPos.y = -y;
        }
        else {
            outerPos.x = 0;
            outerPos.y = 0;
            innerPos.x = 0;
            innerPos.y = 0;
            outerRef.current.rotation.z = 0;
        }
    // eslint-disable-next-line
    }, [state]);

    useFrame((state, delta) => {
        if (puzzleKey in PUZZLE_EFFECTS) {
            PUZZLE_EFFECTS[puzzleKey].update(outerRef, state, delta);
        }
    });

    return (
        <group position={[7, 1.5, 0]} scale={scale}>
            <group ref={outerRef} >
                <group ref={innerRef} >
                    { TAN_KEYS.map((k, i) => <PatternPiece key={i} pieceKey={k} />) }
                    <VisCoord state={state} grid={false} />
                </group>
            </group>
        </group>
    );
}

export default PatternBoard;