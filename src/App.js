import React, { useState } from 'react';
import { GameContextProvider } from './contexts/GameContext';
import Login from './components/transitions/Login';
import TaskRunner from './components/TaskRunner';
//import Debug from './components/Debug';
//import Finish from './components/transitions/Finish';

function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);

    // Function to switch to the Finish component
    const handleEnterGame = () => {
        setIsGameStarted(true);
    };
    return (
        <div className='app-box'>
            <GameContextProvider>
                {isGameStarted ? <TaskRunner /> : <Login onEnterGame={handleEnterGame}/>}
                {/* <Debug /> */}
            </GameContextProvider>
        </div>
    );
}
export default App;
