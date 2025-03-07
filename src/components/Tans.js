import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameContext } from '../contexts/GameContext';
import { TANGRAM_SHAPES, THICKNESS, unit } from '../graphics/tangramShapes';
import { BASIC_MAT } from '../graphics/materials';
import { pi, cyl_mesh } from '../graphics/meshes';
import { TAN_KEYS, KEY_MASK_MAP } from '../constants/gameConfig';


const matSet = BASIC_MAT;

function Piece({ pieceKey }) {
    const { hoverMask, focusMask, playerTans, isDragging } = useGameContext();
    
    playerTans.current[pieceKey] = useRef();
    const defRef = useRef();
    const hovRef = useRef();
    const isHover = useRef(false);

    const mask = KEY_MASK_MAP[pieceKey];
    const cylGeo = [unit / 20, unit / 20, THICKNESS * 2, 12, 1];

    const rotAxis = cyl_mesh(matSet.AX, cylGeo, [0,0,1], [pi(0.5),0,0]);
    const hovMesh = TANGRAM_SHAPES[pieceKey](matSet.HOV, 1);
    const defMesh = TANGRAM_SHAPES[pieceKey](matSet[pieceKey], 0);

    // Update hover state
    useFrame(() => {
        // other piece is focused
        if (focusMask.current > 0 && focusMask.current !== mask) {
            return;
        }
        hovRef.current.visible = (focusMask.current === mask) || (hoverMask.current === mask);
        defRef.current.visible = !hovRef.current.visible;
        
        if (isDragging.current) return;

        // hoverMask set
        if (isHover.current && hoverMask.current === 0) {
            hoverMask.current |= mask;
        }
        // hoverMask reset
        if (!isHover.current && hoverMask.current === mask) {
            hoverMask.current &= ~mask
        }
    });
    
    return (
        <group 
            ref={playerTans.current[pieceKey]}
            onPointerOver={(event) => {
                isHover.current = true;
            }}
            onPointerOut={(event) => {
                isHover.current = false;
            }}
            onDoubleClick={(event) => {
                event.stopPropagation();
                if (pieceKey === 'PL') {
                    const curVal = playerTans.current['PL'].current.rotation.y;
                    const newVal = (curVal === 0) ? Math.PI : 0;
                    playerTans.current['PL'].current.rotation.y = newVal;
                }
            }}
        >
            <group ref={hovRef}>{hovMesh}{rotAxis}</group>
            <group ref={defRef}>{defMesh}</group>
        </group>
    );
}


function Tans() {
    return (
        <group>
            { TAN_KEYS.map((k, i) => <Piece key={i} pieceKey={k} />) }
        </group>
    );
}

export default Tans;
