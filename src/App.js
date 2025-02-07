import React from 'react';
import { GameContextProvider } from './contexts/GameContext';
import Game from './components/Game';
import GameRunner from './components/GameRunner';
import ExperimentRunner from './components/ExperimentRunner';


function App() {
    return (
        <div className='app-box'>
            <GameContextProvider>
                {/* <Game /> */}
                {/* <GameRunner /> */}
                <ExperimentRunner />
            </GameContextProvider>
        </div>
    );
}
export default App;
