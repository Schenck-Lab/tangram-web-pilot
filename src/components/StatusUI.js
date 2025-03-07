import { useState, useEffect } from 'react';
import { TIME_LIMIT } from '../constants/gameConfig';
import { useGameContext } from '../contexts/GameContext';
import { Progress } from 'antd';
import { useTimer } from 'react-timer-hook';
import { STATUS, TASK_LIST } from '../constants/gameConfig';
import { PUZZLE_LIST } from '../puzzles/puzzleLib';


function span(className, content) {
    return <span className={className}>{content}</span>;
}

function TopBar({ state }) {
    const [title, setTitle] = useState('Tangram Puzzles');
    
    useEffect(() => {
        const puzzleKey = TASK_LIST[state.taskId] ?? null;
        const puzzleName = PUZZLE_LIST[puzzleKey]?.getName() ?? null;
        if (puzzleName) {
            setTitle(`Tangram Puzzles: ${puzzleName}`);
        }
    }, [state]);
    
    return (
        <div className='top-bar'>
            <div className='app-title'>{title}</div>
        </div>
    );
}

function GameGuide() {
    // Styled text
    const move   = span('hl-text', 'move');
    const R      = span('key-char', 'R');
    const rotate = span('hl-text', 'rotate');
    const flip   = span('hl-text', 'flip');
    return (
        <div className='game-guide-box'>
            <h1>Game Guide</h1>
                <ul>
                    <li>Drag a piece to {move} it.</li>
                    <li>Hold {R} and drag to {rotate}.</li>
                    <li>Double-click the Parallelogram to {flip} it.</li>
                </ul>
        </div>
    );
}


function ProgressBar({ state, setState, progress }) {
    const { totalTimeInSec } = useGameContext();
    const puzzleKey = TASK_LIST[state.taskId];
    const { seconds, minutes, pause } = useTimer({ 
        expiryTimestamp: state.deadline, 
        onExpire: () => {
            setState(prev => ({
                taskId: prev.taskId,
                status: STATUS.TIMEOUT,
                deadline: -1,
            }));
            totalTimeInSec.current += TIME_LIMIT.task;
            console.log(`Timer expired: ${puzzleKey}.`);
        },
        autoStart: true,
    });

    // Remaining time
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');
    const timeStr = <span className='time-number'>{mm} : {ss}</span>;

    useEffect(() => {
        // Success: the puzzle has been solved
        if (progress >= 100) {
            pause();
            setState(prev => ({
                taskId: prev.taskId,
                status: STATUS.SOLVED,
                deadline: -1,
            }));
            // update totalTimeInSec
            const timeLeft = (60 * minutes) + seconds;
            const timeUsed = TIME_LIMIT.task - timeLeft;
            totalTimeInSec.current += timeUsed;
        }
    // eslint-disable-next-line
    }, [progress]); 
    
    if (!puzzleKey) return null;

    return (
        <div className='progress-box'>
            <div className='timer-text'>Remaining Time: {timeStr}</div>
            <div className='progress-text'>Progress: </div>
            <Progress className='custom-progress' 
                steps={16} percent={progress.toFixed(2)} size={[20, 25]} />
        </div>
    );
}

function StatusUI({state, setState, progress}) {
    return (<>
        <TopBar state={state} />
        { state.deadline > 0 && <ProgressBar state={state} setState={setState} progress={progress}/> }
        <GameGuide />
    </>);
}

export default StatusUI;