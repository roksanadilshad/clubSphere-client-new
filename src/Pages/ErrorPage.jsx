import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaHome, FaQuestionCircle } from 'react-icons/fa';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Visual Element */}
        <div className="relative inline-block mb-12">
          <h1 className="text-[12rem] font-black text-slate-100 leading-none select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white shadow-2xl rounded-3xl flex items-center justify-center mb-4 transform -rotate-12">
                <FaSearch className="text-blue-600 text-3xl" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Lost in the <span className="text-blue-600">Cloud?</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="max-w-md mx-auto mb-10 space-y-4">
          <p className="text-slate-500 font-medium text-lg">
            The page you are looking for has been moved, deleted, or perhaps never existed in this dimension.
          </p>
          <div className="flex justify-center gap-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              Route: {window.location.pathname}
            </span>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <FaArrowLeft className="text-blue-600" /> Go Back One Step
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <FaHome /> Dashboard Home
          </button>
        </div>

        {/* Support Section */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center gap-4">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <FaQuestionCircle /> Still confused?
          </p>
          <div className="flex gap-8">
            <a href="/help" className="text-slate-600 hover:text-blue-600 text-sm font-black transition-colors">Help Center</a>
            <a href="/support" className="text-slate-600 hover:text-blue-600 text-sm font-black transition-colors">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;