import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameContext } from '../contexts/GameContext.js';
import { PUZZLE_LIST } from '../puzzles/puzzleLib.js';
import { STATUS, TASK_LIST, TIME_LIMIT } from '../constants/gameConfig.js';
import Start from './transitions/Start.js';
import GoNext from './transitions/GoNext.js';
import Finish from './transitions/Finish.js';
import PlayBoard from './PlayBoard.js';
import PatternBoard from './PatternBoard.js';
import StatusUI from './StatusUI.js';
import { toStdDeg, degToRad, getTimeStampString } from '../utils/utils.js';


function TaskRunner() {
    const { playerTans, totalTimeInSec, lastEntry, addGameData } = useGameContext();
    // Game state
    const [state, setState] = useState({
        taskId: -1, 
        status: STATUS.INIT,
        deadline: -1,
    });
    const [progress, setProgress] = useState(0);
    
    const resetPlayerTans = () => {
        const target = PUZZLE_LIST.InitPine.pieceStates;
        const tans = playerTans.current;

        Object.keys(tans).forEach(key => {
            const { px, py, rz } = target[key];
            tans[key].current.position.x = px;
            tans[key].current.position.y = py;
            tans[key].current.rotation.z = degToRad(rz);
            if (key === 'PL')
                tans[key].current.rotation.y = degToRad(target[key].ry);
        });
    }

    const addFirstEntry = (tid) => {
        // Organize new entry of current data after some mouse up event
        const tans = playerTans.current;
        const transformData = {};
        Object.keys(tans).forEach(key => {
            const piece = tans[key].current;
            transformData[`${key}_X`] = piece.position.x.toFixed(1);
            transformData[`${key}_Y`] = piece.position.y.toFixed(1);
            transformData[`${key}_R`] = toStdDeg(piece.rotation.z).toFixed(0);
        });
        const PL_F = toStdDeg(tans.PL.current.rotation.y).toFixed(0);

        const currEntry = [
            TASK_LIST[tid], 
            getTimeStampString(),
            0,
            'none',
            ...Object.values(transformData),
            PL_F,
            '0.00',
            '0.00',
        ];
        addGameData(currEntry);
        lastEntry.current = currEntry;
    };
    

    const onStart = () => {
        console.log(`Game started at: ${new Date()}`);
        resetPlayerTans();
        setState(_ => {
            const ddl = new Date();
            ddl.setSeconds(ddl.getSeconds() + TIME_LIMIT.task);
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
        resetPlayerTans();
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
            ddl.setSeconds(ddl.getSeconds() + TIME_LIMIT.task);
            return {
                taskId: prev.taskId + 1,
                status: STATUS.SOLVING,
                deadline: ddl,
            };
        });
        setProgress(0);
        addFirstEntry(newTaskId);
    }

    const renderTransitionComponent = () => {
        if (state.taskId === -1) {
            return <Start onStart={onStart} />;
        }
        if (state.taskId === TASK_LIST.length || totalTimeInSec.current >= TIME_LIMIT.total) {
            return <Finish state={state} />
        }
        if (state.status === STATUS.SOLVED || state.status === STATUS.TIMEOUT) {
            return <GoNext onNext={onNext} result={state.status} />
        }
        return null;
    }

    return (
        <div className='canvas-box'>
            { renderTransitionComponent() }
            <Canvas orthographic camera={{ zoom: 80, position: [0,0,10] }} >
                <PlayBoard state={state} handleProgress={setProgress} />
                <PatternBoard state={state} />
            </Canvas>
            <StatusUI state={state} setState={setState} progress={progress} />
        </div>
    );
}

export default TaskRunner;