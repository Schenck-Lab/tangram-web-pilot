import React from 'react';
import { Grid } from '@react-three/drei';
import { pi, cyl_mesh, box_mesh } from '../graphics/meshes';
import { BASIC_MAT } from '../graphics/materials';
import { PUZZLE_LIST } from '../puzzles/puzzleLib';
import { TASK_LIST } from '../constants/gameConfig';

function VisCoord({state, grid=true}) {
    const puzzleKey = TASK_LIST[state.taskId];
    if (!puzzleKey) return null;

    const cylGeo  = [0.1, 0.1, 1, 24, 1];
    const meshRot = [pi(0.5), 0, 0];
    const {px, py, rz} = PUZZLE_LIST[puzzleKey]?.visibleCoordinate ?? {
        px: 0, py: 0, rz: 0
    };

    return (
        <group position={[px, py, 1]} rotation={[0, 0, rz]}>
            {cyl_mesh(BASIC_MAT.ORI, cylGeo, [0,0,0], meshRot)}
            {box_mesh(BASIC_MAT.HOV, [1,0.04,0.5], [0.5,0,0])}
            <Grid
                position={[0,0,-2]}
                infiniteGrid={true} 
                cellSize={1} 
                cellThickness={0.5}
                fadeDistance={30}
                fadeStrength={1}
                sectionColor={`rgb(200,200,200)`}
                rotation={[Math.PI * 0.5,-rz,0]}
                visible={grid}
            />
        </group>
    );
}

export default React.memo(VisCoord);