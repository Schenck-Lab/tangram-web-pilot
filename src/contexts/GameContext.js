import { createContext, useContext, useRef } from 'react';

const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const pieceRef = useRef([{}, {}]);   // Puzzle piece reference
    const ptnRef   = useRef([{}, {}]);   // Pattern piece reference
    const flipRef  = useRef([0, 0]);     // Parallelogram flip flags
    const spin     = useRef(false);      // Spin flag
    const globalHover = useRef(0);       // Maskbit for piece selection

    // CSV Buffers
    const csvMetaBufRef = useRef([]);  // Buffer for metadata
    const csvGameBufRef = useRef([]);  // Buffer for game data
    const lastEntry = useRef([]);      // Tiny buffer for last entry
    
    // Function to Add Metadata
    const addMetaData = (key, value) => {
        csvMetaBufRef.current.push(`# ${key}: ${value}`);
    };

    // Function to Add Data Row to Buffer
    const addGameData = (rowData) => {
        csvGameBufRef.current.push([...rowData]);
    };

    // Function to Export CSV File
    const exportCSV = (csvFileSuffix) => {
        const column_names = [
            'PUZZLE_ID', 'TIMESTAMP', 'STEP', 'TARGET_PIECE',
            'TL0_X', 'TL0_Y', 'TL0_R', 'TL1_X', 'TL1_Y', 'TL1_R',
            'TM_X',  'TM_Y',  'TM_R',  'TS0_X', 'TS0_Y', 'TS0_R',
            'TS1_X', 'TS1_Y', 'TS1_R', 'SQ_X',  'SQ_Y',  'SQ_R',
            'PL_X',  'PL_Y',  'PL_R',  'PL_F', 'PROGRESS'
        ];
    
        // Ensure newline characters are properly handled
        const csvContentArray = [
            csvMetaBufRef.current.join("\n"),  // Metadata
            "",                                // Blank line for separation
            column_names.join(","),            // Header
            csvGameBufRef.current.map(row => row.join(",")).join("\n") // Data rows
        ];
    
        const csvContent = csvContentArray.join("\n"); // Properly join with newlines
    
        // Use Blob for better encoding and file handling
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
    
        // Trigger file download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `tangram_game_data_${csvFileSuffix}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up memory
    };

    return (
        <GameContext.Provider value={{
            spin, globalHover, pieceRef, ptnRef, flipRef,
            lastEntry, addGameData, addMetaData, exportCSV
        }}>
            {children}
        </GameContext.Provider>
    );
};

// Hook to access game context
export const useGameContext = () => {
    return useContext(GameContext);
};
