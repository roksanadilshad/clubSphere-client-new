import React, { useEffect, useState } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router';
import { FaCalendarCheck, FaTicketAlt, FaCopy, FaHome, FaPrint } from 'react-icons/fa';


const EventPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState({ transactionId: '', trackingId: '' });
    const [loading, setLoading] = useState(true);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/event-payment-success?session_id=${sessionId}`)
                .then(res => {
                    setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId: res.data.trackingId
                    });
                    setLoading(false);
                    toast.success("Registration Confirmed!");
                })
                .catch(() => {
                    setLoading(false);
                    toast.error("Verification failed. Please contact support.");
                });
        }
    }, [sessionId]);

    const copyId = (id) => {
        navigator.clipboard.writeText(id);
        toast.success("Copied!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="loading loading-spinner loading-lg text-purple-600"></div>
                <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Securing your spot...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            {/* <Confetti numberOfPieces={200} recycle={false} colors={['#8B5CF6', '#D946EF', '#3B82F6']} /> */}
            
            <div className="max-w-md w-full">
                {/* Ticket Top Section */}
                <div className="bg-white rounded-t-[2.5rem] p-8 border-x border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full opacity-50" />
                    
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-200 mb-6 rotate-3">
                            <FaCalendarCheck className="text-white text-3xl" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">You're Going!</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">Your event registration is confirmed.</p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</p>
                                <p className="font-mono text-sm text-purple-600 font-bold">{paymentInfo.transactionId?.slice(-12) || 'N/A'}</p>
                            </div>
                            <button onClick={() => copyId(paymentInfo.transactionId)} className="btn btn-ghost btn-xs text-slate-400 hover:text-purple-600">
                                <FaCopy />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ticket "Jagged" Divider */}
                <div className="relative h-6 bg-white border-x border-slate-200 flex items-center">
                    <div className="absolute -left-3 w-6 h-6 bg-[#F8FAFC] rounded-full border-r border-slate-200" />
                    <div className="w-full border-t-2 border-dashed border-slate-100 mx-4" />
                    <div className="absolute -right-3 w-6 h-6 bg-[#F8FAFC] rounded-full border-l border-slate-200" />
                </div>

                {/* Ticket Bottom Section */}
                <div className="bg-white rounded-b-[2.5rem] p-8 border-x border-b border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
                    <div className="flex flex-col items-center">
                        <div className="p-3 border-2 border-slate-100 rounded-2xl mb-4">
                            {/* Placeholder for QR Code */}
                            <div className="w-24 h-24 bg-slate-50 flex items-center justify-center text-slate-200">
                                <FaTicketAlt size={40} />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-500  uppercase tracking-[0.3em] mb-6"># {paymentInfo.trackingId || 'REG-PENDING'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => window.print()}
                            className="btn bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-xl font-bold text-xs gap-2"
                        >
                            <FaPrint size={12} /> Print Ticket
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard/member/events')}
                            className="btn bg-purple-600 hover:bg-purple-700 border-none text-white rounded-xl font-bold text-xs gap-2 shadow-lg shadow-purple-100"
                        >
                             My Events <FaHome size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPayment;