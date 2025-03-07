import { createContext, useContext, useRef } from 'react';

const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    // Puzzle piece transformation control
    const playerTans = useRef({});
    const targetTans = useRef({}); 
    const hoverMask = useRef(0);
    const isDragging = useRef(false);
    const rotationEnabled = useRef(false);
    const initPan = useRef(undefined);
    const initRot = useRef(undefined);
    const totalTimeInSec = useRef(0);
    const focusMask = useRef(0);
    const initAngle = useRef(undefined);

    // CSV Buffers
    const csvMetaBufRef = useRef([]);  // Buffer for metadata
    const csvGameBufRef = useRef([]);  // Buffer for game data
    const lastEntry = useRef([]);      // Tiny buffer for last entry

    // Login account
    const pid = useRef('??');
    const firstName = useRef('??');
    const lastName = useRef('??');
    const emailAddress = useRef('??');
    const fileName = useRef('??.csv');
    
    // Function to Add Metadata
    const addMetaData = (key, value) => {
        csvMetaBufRef.current.push(`# ${key}: ${value}`);
    };

    // Function to Add Data Row to Buffer
    const addGameData = (rowData) => {
        csvGameBufRef.current.push([...rowData]);
    };

    return (
        <GameContext.Provider value={{
            playerTans, targetTans, hoverMask, initPan, initRot, initAngle,
            focusMask, isDragging, rotationEnabled, totalTimeInSec,
            lastEntry, csvMetaBufRef, csvGameBufRef, addGameData, addMetaData,
            pid, firstName, lastName, emailAddress, fileName,
        }}>
            {children}
        </GameContext.Provider>
    );
};

// Hook to access game context
export const useGameContext = () => {
    return useContext(GameContext);
};
