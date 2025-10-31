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

    const handleLogout = () => {
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
    }

    return (
        <div className="app">
        <h1>📝 React Task Evaluator</h1>
        {isLoggedIn ? (
                <>
                    {/* logout button */}
                    <div className="text-end mb-3">
                        <button 
                            className="btn btn-outline-danger btn-sm" 
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>

                    {/* tasks page */}
                    <Tasks />
                </>
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App
