import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [form, setForm] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:5000/api/register", form);
            alert("Signup successful! You can now login.");
        } catch (err) {
            alert("Signup failed! Username might already be taken.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
                
                <input
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                />
                <input
                    className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />
                
                <button
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                    onClick={handleSubmit}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Signup;
