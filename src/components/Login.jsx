import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate(); // Add useNavigate hook

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/login", form);
            login(res.data.token);
            navigate("/manager"); // Redirect to /manager after login
        } catch (err) {
            alert("Login failed!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transition-all duration-300 ease-in-out">
                <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800 animate-fade-in">
                    Login 
                </h1>
                <input
                    className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                />
                <input
                    className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />
                <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
                    onClick={handleSubmit}
                >
                    Log In
                </button>
            </div>
        </div>
    );
};

export default Login;
