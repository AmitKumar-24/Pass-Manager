import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    const [form, setForm] = useState({ site: '', username: '', password: '' });
    const [passwordArray, setPasswordArray] = useState([]);
    const [editId, setEditId] = useState(null);

    // Check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchPasswords();
        }
    }, []);

    const fetchPasswords = () => {
        axios.get("http://localhost:5000/api/passwords", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(response => setPasswordArray(response.data))
            .catch(error => console.error("Error fetching passwords", error));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success("Logged out successfully!");
        navigate('/login');
    };

    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: 'top-right',
            autoClose: 5000,
            theme: 'dark',
        });
        navigator.clipboard.writeText(text);
    };

    const showPassword = () => {
        passwordRef.current.type = passwordRef.current.type === 'password' ? 'text' : 'password';
        ref.current.src = passwordRef.current.type === 'password' ? '/icons/eye.png' : '/icons/eyecross.png';
    };

    const savePassword = () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            if (editId) {
                axios.put(`http://localhost:5000/api/passwords/${editId}`, form, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                    .then(() => {
                        toast('Password updated!');
                        setPasswordArray(passwordArray.map(item =>
                            item._id === editId ? { ...item, ...form } : item
                        ));
                        setForm({ site: '', username: '', password: '' });
                        setEditId(null);
                    })
                    .catch(() => toast.error('Error updating password'));
            } else {
                axios.post("http://localhost:5000/api/passwords", form, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                    .then(response => {
                        toast('Password saved!');
                        setPasswordArray([...passwordArray, { ...form, _id: response.data._id }]);
                        setForm({ site: '', username: '', password: '' });
                    })
                    .catch(() => toast.error('Error saving password'));
            }
        } else {
            toast.error('Please fill all fields properly!');
        }
    };

    const deletePassword = (id) => {
        if (window.confirm('Do you really want to delete this password?')) {
            axios.delete(`http://localhost:5000/api/passwords/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
                .then(() => {
                    toast('Password Deleted!');
                    setPasswordArray(passwordArray.filter(item => item._id !== id));
                })
                .catch(() => toast.error('Error deleting password'));
        }
    };

    const editPassword = (id) => {
        const passwordToEdit = passwordArray.find(i => i._id === id);
        setForm({ site: passwordToEdit.site, username: passwordToEdit.username, password: passwordToEdit.password });
        setEditId(id);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer />

            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
            </div>

            <div className="p-3 md:mycontainer min-h-[88.2vh]">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-center">
                        <span className="text-green-500"> &lt;</span>
                        <span>Pass</span><span className="text-green-500">Manager&gt;</span>
                    </h1>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm">
                        Logout
                    </button>
                </div>

                <p className="text-green-900 text-lg text-center">Your own Password Manager</p>

                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                        className="rounded-full border border-green-500 w-full p-4 py-1"
                        type="text"
                        name="site"
                        id="site"
                    />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            className="rounded-full border border-green-500 w-full p-4 py-1"
                            type="text"
                            name="username"
                            id="username"
                        />
                        <div className="relative">
                            <input
                                ref={passwordRef}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                className="rounded-full border border-green-500 w-full p-4 py-1"
                                type="password"
                                name="password"
                                id="password"
                            />
                            <span className="absolute right-[3px] top-[4px] cursor-pointer" onClick={showPassword}>
                                <img ref={ref} className="p-1" width={26} src="/icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={savePassword}
                        className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900"
                    >
                        <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                        {editId ? 'Update' : 'Save'}
                    </button>
                </div>

                <div className="passwords">
                    <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length !== 0 && (
                        <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                            <thead className="bg-green-800 text-white">
                                <tr>
                                    <th className="py-2">Site</th>
                                    <th className="py-2">Username</th>
                                    <th className="py-2">Password</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-green-100">
                                {passwordArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <a href={item.site} target="_blank" rel="noreferrer">{item.site}</a>
                                                <div className="lordiconcopy size-7 cursor-pointer" onClick={() => copyText(item.site)}>
                                                    <lord-icon
                                                        style={{ width: '25px', height: '25px', paddingTop: '3px', paddingLeft: '3px' }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                    ></lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <span>{item.username}</span>
                                                <div className="lordiconcopy size-7 cursor-pointer" onClick={() => copyText(item.username)}>
                                                    <lord-icon
                                                        style={{ width: '25px', height: '25px', paddingTop: '3px', paddingLeft: '3px' }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                    ></lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <span>{'*'.repeat(item.password.length)}</span>
                                                <div className="lordiconcopy size-7 cursor-pointer" onClick={() => copyText(item.password)}>
                                                    <lord-icon
                                                        style={{ width: '25px', height: '25px', paddingTop: '3px', paddingLeft: '3px' }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                    ></lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="justify-center py-2 border border-white text-center">
                                            <span className="cursor-pointer mx-1" onClick={() => editPassword(item._id)}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ width: '25px', height: '25px' }}
                                                ></lord-icon>
                                            </span>
                                            <span className="cursor-pointer mx-1" onClick={() => deletePassword(item._id)}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ width: '25px', height: '25px' }}
                                                ></lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Manager;
