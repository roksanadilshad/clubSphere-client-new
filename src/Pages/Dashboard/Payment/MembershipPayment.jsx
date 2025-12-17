import React, { useEffect, useState } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router';
import { FaCheckCircle, FaRocket, FaCopy, FaArrowRight } from 'react-icons/fa';
 // Optional: npm install react-confetti

const MembershipPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState({ transactionId: '', trackingId: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId: res.data.trackingId
                    });
                    setLoading(false);
                    toast.success("Payment successful! Membership activated");
                })
                .catch(() => {
                    setLoading(false);
                    toast.error("Payment verification failed");
                });
        }
    }, [searchParams]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="loading loading-spinner loading-lg text-emerald-500"></div>
                <p className="mt-4 font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">Verifying Transaction...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Celebration Effect */}
            {/* <Confetti numberOfPieces={150} recycle={false} colors={['#10b981', '#3b82f6', '#f59e0b']} /> */}

            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                {/* Status Header */}
                <div className="bg-emerald-500 p-10 text-center relative">
                    <div className="absolute inset-0 opacity-10 flex justify-center items-center">
                        <FaRocket className="text-9xl rotate-12" />
                    </div>
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-8 ring-emerald-500/20">
                        <FaCheckCircle className="text-emerald-500 text-4xl" />
                    </div>
                    <h2 className="text-2xl font-black text-white">Payment Confirmed!</h2>
                    <p className="text-emerald-100 text-sm font-medium">Your membership is now active</p>
                </div>

                {/* Receipt Details */}
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</p>
                                <p className="font-mono text-sm text-slate-700 font-bold">{paymentInfo.transactionId || '---'}</p>
                            </div>
                            <button 
                                onClick={() => copyToClipboard(paymentInfo.transactionId)}
                                className="text-slate-300 hover:text-emerald-500 transition-colors"
                            >
                                <FaCopy />
                            </button>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Number</p>
                                <p className="font-mono text-sm text-slate-700 font-bold">{paymentInfo.trackingId || '---'}</p>
                            </div>
                            <button 
                                onClick={() => copyToClipboard(paymentInfo.trackingId)}
                                className="text-slate-300 hover:text-emerald-500 transition-colors"
                            >
                                <FaCopy />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-3">
                        <button 
                            onClick={() => navigate("/dashboard")}
                            className="w-full py-4 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                        >
                            Go to Dashboard <FaArrowRight size={12} />
                        </button>
                        
                        <p className="text-center text-[11px] text-slate-400 font-medium px-6">
                            A confirmation email has been sent to your registered address. 
                            Please keep these IDs for your records.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipPayment;