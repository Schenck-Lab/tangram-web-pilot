import { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';

function Debug() {
    const { rotationEnabled, hoverMask, isDragging } = useGameContext();

    // State to track current values
    const [debugInfo, setDebugInfo] = useState({
        rotateFlag: rotationEnabled.current,
        hoverMask: hoverMask.current,
        isDragging: isDragging.current,
    });

    useEffect(() => {
        // Update debug info every 100ms to reflect state changes
        const interval = setInterval(() => {
            setDebugInfo({
                rotateFlag: rotationEnabled.current,
                hoverMask: hoverMask.current,
                isDragging: isDragging.current,
            });
        }, 100);

        return () => clearInterval(interval); // Cleanup interval on unmount
    // eslint-disable-next-line
    }, []);

    return (
        <div style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px",
            fontSize: "14px",
            borderRadius: "5px",
            zIndex: 1000
        }}>
            <p>🛠 <strong>Debug Info</strong></p>
            <p>Rotation: {debugInfo.rotateFlag ? "Active" : "Inactive"}</p>
            <p>HoverMask: {debugInfo.hoverMask}</p>
            <p>isDragging: {debugInfo.isDragging ? "Yes" : "No"}</p>
        </div>
    );
}

export default Debug;
