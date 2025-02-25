import React, { useState } from 'react';
import { GameContextProvider } from './contexts/GameContext';
import Login from './components/transitions/Login';
import TaskRunner from './components/TaskRunner';


function App() {
    const [isLogin, setIsLogin] = useState(false);
    const onGameStart = () => {
        setIsLogin(true);
    };
    return (
        <div className='app-box'>
            <GameContextProvider>
                {isLogin ? <TaskRunner /> : <Login onEnterGame={onGameStart}/>}
            </GameContextProvider>
        </div>
    );
}
export default App;
