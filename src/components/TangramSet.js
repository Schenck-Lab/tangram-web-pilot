import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBind } from '../utils/useBind';
import { useGameContext } from '../contexts/GameContext';
import { TANGRAM_SHAPES, THICKNESS, unit } from '../graphics/tangramShapes';
import { pi, cyl_mesh } from '../graphics/meshes';


function Piece({ sid, pid, pieceKey, matSet }) {
    const { spin, globalHover, pieceRef, flipRef } = useGameContext();
    pieceRef.current[sid][pieceKey] = useRef();
    const defRef = useRef();
    const hovRef = useRef();
    const isHover = useRef(false);

    const { camera, size } = useThree();
    const mask = 1 << (sid * 7 + pid);

    const bind = useBind(pieceRef.current[sid][pieceKey], 
        pieceKey, spin, camera, size, flipRef, mask
    );

    const cylGeo = [unit / 20, unit / 20, THICKNESS * 2, 12, 1];

    const rotAxis = cyl_mesh(matSet.AX, cylGeo, [0,0,1], [pi(0.5),0,0]);
    const hovMesh = TANGRAM_SHAPES[pieceKey](matSet.HOV, 1);
    const defMesh = TANGRAM_SHAPES[pieceKey](matSet[pieceKey], 0);

    useFrame(() => {
        if (globalHover.current > 0 && globalHover.current !== mask) {
            return;
        }
        defRef.current.visible = !(isHover.current);
        hovRef.current.visible = isHover.current;
        
        if (isHover.current) {
            globalHover.current |= mask;
        } else {
            globalHover.current &= ~mask;
        }
    });
    
    return (
        <group 
            ref={pieceRef.current[sid][pieceKey]}
            {...bind()}
            onPointerOver={(event) => {
                //event.stopPropagation();
                isHover.current = true;} 
            }
            onPointerOut={(event) => {
                //event.stopPropagation();
                isHover.current = false;}
            }
            onDoubleClick={(event) => {
                event.stopPropagation();    
                if (pieceKey === 'PL') {
                    flipRef.current[sid]++;
                }
            }}
        >
            <group ref={hovRef}>{hovMesh}{rotAxis}</group>
            <group ref={defRef}>{defMesh}</group>
        </group>
    );
}


function TangramSet({ sid, matSet }) {
    const pieceKeys = ['TL0', 'TL1', 'TM', 'TS0', 'TS1', 'SQ', 'PL'];
    const { pieceRef, flipRef } = useGameContext();

    useFrame(() => {
        // Flip the parallelogram on double-click
        if (pieceRef.current[sid]['PL']) {
            const paraGroup = pieceRef.current[sid]['PL'].current;
            const rotaCheck = (flipRef.current[sid] & 1);
            paraGroup.rotation.y = (rotaCheck) ? Math.PI : 0;
        }
    });

    return (
        <group>
            {pieceKeys.map((k, i) => (
                <Piece key={i} sid={sid} pid={i} pieceKey={k} matSet={matSet} />
            ))}
        </group>
    );
}

export default TangramSet;