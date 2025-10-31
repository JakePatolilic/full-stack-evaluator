import './App.css'
import Tasks from "./Tasks"
import Register from './Components/Register.jsx';
import Login from './Components/Login.jsx';
import { useState, useEffect } from 'react';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) setIsLoggedIn(true);
    }, []);

    const handleLoginSuccess = () => setIsLoggedIn(true);

    return (
        <div className="app">
        <h1>📝 React Task Evaluator</h1>
        {isLoggedIn ? <Tasks /> : <Login onLoginSuccess={handleLoginSuccess} />}
        </div>
    );
}

export default App
