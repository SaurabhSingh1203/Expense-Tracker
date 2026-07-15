import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-20 py-4 md:py-0 gap-4">
                    
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <FaTicketAlt className="text-rose-500 text-2xl group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300" />
                        <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                            OurEvents
                        </span>
                    </Link>
                    
                   
                    <div className="flex items-center gap-6 sm:gap-8 font-semibold text-sm">
                        <Link 
                            to="/" 
                            className="text-slate-500 hover:text-slate-900 transition-colors duration-200"
                        >
                            Explore Events
                        </Link>
                        
                        {user ? (
                            <div className="flex items-center gap-4 sm:gap-6">
                                <Link 
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                                    className="text-slate-500 hover:text-slate-900 transition-colors duration-200"
                                >
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 px-5 py-2.5 rounded-lg transition-colors duration-200"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 sm:gap-6">
                                <Link 
                                    to="/login" 
                                    className="text-slate-500 hover:text-slate-900 transition-colors duration-200"
                                >
                                    Log in
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-slate-900 text-white hover:bg-rose-600 px-6 py-2.5 rounded-lg transition-colors duration-300 shadow-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;