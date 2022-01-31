import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import GamePage from './route/GamePage';
import HomePage from './route/HomePage';

const App = () => {
    return (
        <Router>
            
            <Routes>
            
                <Route path="/play/:gameId" element={<GamePage/>}/>
                
                <Route path="/" element={<HomePage/>}/>

            </Routes>

        </Router>
    );
}

export default App;
