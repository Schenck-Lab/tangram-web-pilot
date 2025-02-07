import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameContext } from '../contexts/GameContext';
import { PUZZLE_LIST } from '../puzzles/puzzleLib';
import { STATUS, TASK_LIST, DURATION_8_MIN } from '../constants/gameStatus';
import Start from './transitions/Start';
import GoNext from './transitions/GoNext';
import Finish from './transitions/Finish';
import PlayBoard from './PlayBoard';
import PatternBoard from './PatternBoard';
import StatusUI from './StatusUI';
import { toStdDeg, degToRad, getTimeStampString } from '../utils/utils';
import { Dropdown, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// eslint-disable-next-line
function PuzzleDropdown({selectPuzzleKey}) {
    const [selectedPuzzle, setSelectedPuzzle] = useState('Select a Puzzle');
    const info = [
        '*', ' (wobbly)', ' (unaligned)', '*', '* (spinning)',
        '*', '*', '*', '*', '*', '*', '*',
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


function ExperimentRunner() {
    const { pieceRef, flipRef, spin, lastEntry, addMetaData, addGameData } = useGameContext();
    // Game state
    const [state, setState] = useState({
        taskId: -1, 
        status: STATUS.INIT,
        deadline: -1,
    });
    const [progress, setProgress] = useState(0);

    function resetPuzzleToDefault() {
        const init = PUZZLE_LIST.InitPine;
        //const init = PuzzleList[puzzleKey];
        for (let i = 0; i < pieceRef.current.length; ++i) {
            const tgt = init.pieceStates[i];
            const ref = pieceRef.current[i];

            Object.keys(ref).forEach(k => {
                const { px, py, rz } = tgt[k];
                ref[k].current.position.x = px;
                ref[k].current.position.y = py;
                ref[k].current.rotation.z = degToRad(rz);
                if (k === 'PL')
                    ref[k].current.rotation.y = degToRad(tgt[k].ry);
            });
        }
        flipRef.current[0] = 0;
        flipRef.current[1] = 0;
    }

    const addFirstEntry = (tid) => {
        // Organize new entry of current data after some mouse up event
        const pieceSet = pieceRef.current[0];
        const transformData = {};
        Object.keys(pieceSet).forEach(name => {
            const piece = pieceSet[name].current;
            transformData[`${name}_X`] = piece.position.x.toFixed(1);
            transformData[`${name}_Y`] = piece.position.y.toFixed(1);
            transformData[`${name}_R`] = toStdDeg(piece.rotation.z);
        });
        const PL_F = toStdDeg(pieceSet.PL.current.rotation.y);

        const currEntry = [
            TASK_LIST[tid], 
            getTimeStampString(),
            0,
            'none',
            ...Object.values(transformData),
            PL_F,
            '0.00',
        ];
        addGameData(currEntry);
        lastEntry.current = currEntry;
    };
    

    const onStart = () => {
        console.log(`Game started at: ${new Date()}`);
        
        // Organize meta data TODO:
        const metaData = {
            'Participant_ID': 'test_XYZ_123',
            'First_name': 'Fish (test)',
            'Last_name': 'Lucky (test)',
            'Date': `${new Date()}`,
        };
        // Add meta data to csv buffer
        Object.entries(metaData).forEach(([key, value]) => {
            addMetaData(key, value);
        });

        resetPuzzleToDefault();
        setState(_ => {
            const ddl = new Date();
            ddl.setSeconds(ddl.getSeconds() + DURATION_8_MIN);
            return {
                taskId: 0,
                status: STATUS.SOLVING,
                deadline: ddl
            };
        });
        setProgress(0);
        addFirstEntry(0);
    };

    const onNext = () => {
        resetPuzzleToDefault();
        if (state.taskId === TASK_LIST.length - 1) {
            setState(prev => ({
                taskId: prev.taskId + 1,
                status: STATUS.FINISHED,
                deadline: -1,
            }));
            setProgress(0);
            return;
        }

        const newTaskId = state.taskId + 1;
        setState(prev => {
            const ddl = new Date();
            ddl.setSeconds(ddl.getSeconds() + DURATION_8_MIN);
            return {
                taskId: prev.taskId + 1,
                status: STATUS.SOLVING,
                deadline: ddl,
            };
        });
        setProgress(0);
        addFirstEntry(newTaskId);
    }

    // Handlers for pressing 'r', for setting the spin flag
    const handleKeyDown = (event) => {
        if (event.key.toLowerCase() === 'r') {
            spin.current = true;
        }
    };
    const handleKeyUp = (event) => {
        if (event.key.toLowerCase() === 'r') {
            spin.current = false;
        }
    };

    // (Un)Mounting effect: adds/removes event listeners
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
            { state.taskId === -1 ? <Start onStart={onStart}/> : null }
            { state.taskId === TASK_LIST.length ? <Finish /> : null}
            { state.status === STATUS.SOLVED || 
              state.status === STATUS.TIMEOUT ? <GoNext onNext={onNext} result={state.status} />: null}

            <Canvas orthographic camera={{ zoom: 80, position: [0,0,10] }} >
                <PlayBoard state={state} handleProgress={setProgress} />
                <PatternBoard state={state} />
            </Canvas>
            <StatusUI state={state} setState={setState} progress={progress} />

            {/* <PuzzleDropdown selectPuzzleKey={setPuzzleKey} /> */}
        </div>
    );
}

export default ExperimentRunner;