import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { token, logout } = useContext(AuthContext);

    return (
        <nav className='bg-slate-800 text-white'>
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
                <div className="logo font-bold text-white text-2xl">
                    <span className='text-green-500'> &lt;</span>
                    <span>Pass</span><span className='text-green-500'>Manager&gt;</span>
                </div>
                {token && (
                    <button onClick={logout} className="bg-red-500 px-4 py-1 rounded-full text-sm">Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
