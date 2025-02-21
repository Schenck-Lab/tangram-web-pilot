import { useDrag } from '@use-gesture/react';
import { useGameContext } from '../contexts/GameContext';
import * as THREE from 'three';


export function useBind(tanRef, pieceKey, mask, rotationEnabled, camera, size) {
    const { hoverMask } = useGameContext();
    
    let initPan = undefined;  // help for panning piece
    let initRot = undefined;  // help for rotating piece
    let initAngle = undefined;
    
    // Convert screen coordinates to scene/world coordinates
    const screenToScene = (screenX, screenY) => {
        const ndcX = +((screenX / size.width ) * 2 - 1);
        const ndcY = -((screenY / size.height) * 2 - 1);
        const worldPosition = new THREE.Vector3(ndcX, ndcY, 0);
        worldPosition.unproject(camera);
        return worldPosition;
    };

    return useDrag(({ down, xy: [x, y], initial: [ix, iy]}) => {
        const isActive = (hoverMask.current > 0) && (hoverMask.current === mask);
        if (!isActive || !down) {
            initRot = undefined;
            initPan = undefined;
            return;
        }
        // Update cursor style
        document.body.style.cursor = down ? 'grabbing' : 'grab';

        const ry = tanRef.current.rotation.y;
        const sign = (pieceKey === 'PL' && ry === Math.PI) ? -1 : 1;
        
        // Handle translation
        if (!rotationEnabled.current) {
            // initPan is undefined
            if (!initPan) {
                const initCursor = screenToScene(ix, iy);
                initPan = initCursor.clone().sub(tanRef.current.position);
                //initAngle = tanRef.current.rotation.z * sign;
            }
            const currCursor = screenToScene(x, y);
            const targetPos = currCursor.clone().sub(initPan);
            tanRef.current.position.set(...roundDist(targetPos));
            return;
        }

        // Handle rotation
        if (!initRot) {
            const currCursor = screenToScene(x, y);
            initRot = currCursor.clone().sub(tanRef.current.position);
            initAngle = tanRef.current.rotation.z * sign;
        }
        const currCursor = screenToScene(x, y);
        const diffVec = currCursor.clone().sub(tanRef.current.position);

        const B = Math.atan2(diffVec.y, diffVec.x);
        const A = Math.atan2(initRot.y, initRot.x);
        const result = roundToRad(initAngle + (B - A)) * sign;
        tanRef.current.rotation.z = result;
    });
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
