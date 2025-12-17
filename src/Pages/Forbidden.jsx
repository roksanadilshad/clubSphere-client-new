import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaArrowLeft, FaHome, FaLock } from 'react-icons/fa';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">
                {/* Visual Icon Header */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto rotate-12 group hover:rotate-0 transition-transform duration-500">
                        <FaShieldAlt className="text-rose-500 text-5xl" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 ml-6">
                        <div className="bg-white p-2 rounded-lg shadow-xl border border-slate-100">
                            <FaLock className="text-slate-800 text-sm" />
                        </div>
                    </div>
                </div>

                {/* Error Text */}
                <h1 className="text-7xl font-black text-slate-900 mb-2 tracking-tighter">403</h1>
                <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight uppercase">Access Restricted</h2>
                
                <div className="space-y-4 mb-10">
                    <p className="text-slate-500 font-medium leading-relaxed">
                        It looks like you don't have the necessary permissions to view this sector of the dashboard. 
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-200/50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                        Security Protocol Active
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                    >
                        <FaHome /> Return Home
                    </button>
                </div>

                {/* Footer Note */}
                <p className="mt-12 text-slate-400 text-[11px] font-medium uppercase tracking-[0.2em]">
                    Contact your administrator if you believe this is a mistake.
                </p>
            </div>
        </div>
    );
};

export default Forbidden;