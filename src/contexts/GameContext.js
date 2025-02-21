import { createContext, useContext, useRef } from 'react';

const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    // Puzzle piece transformation control
    const playerTans = useRef({});
    const targetTans = useRef({}); 
    const hoverMask = useRef(0);
    const rotationEnabled = useRef(false);

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
            playerTans, targetTans, hoverMask, rotationEnabled,
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
