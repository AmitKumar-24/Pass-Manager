import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Manager from './components/Manager'; // Import Manager component
import './index.css';

function App() {
    return (
        <Router>
            <div className="bg-gray-100 min-h-screen">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/manager" element={<Manager />} /> {/* Add Manager route */}
                    {/* Default route redirects to login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
