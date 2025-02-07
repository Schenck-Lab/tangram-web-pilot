import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import PlayBoard from './PlayBoard';
// eslint-disable-next-line
import { OrbitControls } from '@react-three/drei';
import { useGameContext } from '../contexts/GameContext';
import { PUZZLE_LIST } from '../puzzles/puzzleLib';
import PatternBoard from './PatternBoard';
import StatusUI from './StatusUI';
import { Dropdown, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';


function PuzzleDropdown({selectPuzzleKey}) {
    const [selectedPuzzle, setSelectedPuzzle] = useState('Select a Puzzle');
    const info = [
        '*', ' (wobbly)', ' (unaligned)', '*', '* (spinning)',
        '*', '*', '*', '*', '*', '*',
    ];

    // Create the list of menu items with keys
    const items = Object.keys(PUZZLE_LIST)
        .filter((_, i) => i > 0)
        .map((key, i) => ({ 
            label: `${key}${info[i]}`, 
            key: key,
        }));

    // Define the menu items
    const menuProps = {
        items,
        onClick: (e) => {
            setSelectedPuzzle(e.key);
            selectPuzzleKey(e.key);
        },
    };

    return (
        <Dropdown className='pz-menu' menu={menuProps}>
            <Button>
                <Space>
                    {selectedPuzzle}
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
    );
};


function Game() {
    const { spin } = useGameContext();
    const [puzzleKey, setPuzzleKey] = useState(undefined);
    const [progress, setProgress] = useState(0);

    const time = new Date();
    time.setSeconds(time.getSeconds() + 600);

    const handleKeyDown = (event) => {
        if (event.key === 'r') {
            spin.current = true;
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === 'r') {
            spin.current = false;
        }
    };

    useEffect(() => {
        if (puzzleKey) setProgress(0);
    }, [puzzleKey]);

    // useEffect to handle adding and removing event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        // Clean up
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    // eslint-disable-next-line
    }, []);

    return (
        <div className='canvas-box'>
            <Canvas orthographic camera={{ zoom: 80, position: [0,0,10] }} >
                {/* <OrbitControls /> */}
                <PlayBoard puzzleKey={puzzleKey} handleProgress={setProgress} />
                <PatternBoard puzzleKey={puzzleKey} />
            </Canvas>
            <StatusUI puzzleKey={puzzleKey} totalTime={time} progress={progress} />
            <PuzzleDropdown selectPuzzleKey={setPuzzleKey} />
        </div>
    );
}

export default Game;
