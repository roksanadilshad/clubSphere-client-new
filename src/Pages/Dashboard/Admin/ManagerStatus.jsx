import { IoPersonRemove } from "react-icons/io5";
import { FaTrash, FaUserCheck, FaInbox, FaSearch } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/axiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManagerStatus() {
    const queryClient = useQueryClient();

    const { refetch, data: applications = [], isLoading } = useQuery({
        queryKey: ['managerApplications', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/manager-applications');
            return res.data;
        }
    });

    const roleMutation = useMutation({
        mutationFn: ({ email, role }) => axiosSecure.patch(`/managers/role/${email}`, { role }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['managerApplications']);
            const actionText = variables.role === 'clubManager' ? 'Promoted to Manager' : 'Application Rejected';
            
            Swal.fire({
                icon: "success",
                title: actionText,
                text: `Successfully processed ${variables.email}`,
                timer: 2000,
                showConfirmButton: false,
                background: '#ffffff',
                customClass: { title: 'font-bold text-slate-800' }
            });
        },
        onError: (err) => toast.error(err.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/admin/manager-applications/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['managerApplications']);
            toast.success("Application cleared from records.");
        }
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <span className="loading loading-spinner loading-lg text-rose-500"></span>
            <p className="text-slate-400 font-bold animate-pulse">Fetching Applications...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 min-h-screen bg-slate-50/50">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Manager <span className="text-rose-600">Requests</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-xs tracking-widest">
                        Administrative Approval Console
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-right border-r pr-4 border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase">Queue</p>
                        <p className="text-xl font-black text-slate-900">{applications.length}</p>
                    </div>
                    <FaInbox className="text-rose-500 text-xl" />
                </div>
            </div>

            {/* Main Content Area */}
            {applications.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaInbox className="text-slate-300 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Inbox is empty</h3>
                    <p className="text-slate-500">No pending manager applications to review.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                                    <th className="py-6 pl-8 font-black uppercase text-[10px] tracking-widest">Applicant</th>
                                    <th className="py-6 font-black uppercase text-[10px] tracking-widest">Justification</th>
                                    <th className="py-6 font-black uppercase text-[10px] tracking-widest">Status</th>
                                    <th className="py-6 pr-8 text-right font-black uppercase text-[10px] tracking-widest">Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence>
                                    {applications.map((app) => (
                                        <motion.tr 
                                            key={app._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="py-6 pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center font-bold text-rose-600">
                                                        {app.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{app.fullName}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{app.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 max-w-xs">
                                                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed italic">
                                                    "{app.reason}"
                                                </p>
                                            </td>
                                            <td className="py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                    app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                                                    app.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="py-6 pr-8 text-right">
                                                <div className="flex justify-end items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    {app.status === 'pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => roleMutation.mutate({ email: app.email, role: 'clubManager' })}
                                                                className="btn btn-sm btn-circle bg-emerald-500 border-none text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200"
                                                                title="Approve"
                                                            >
                                                                <FaUserCheck size={14}/>
                                                            </button>
                                                            <button 
                                                                onClick={() => roleMutation.mutate({ email: app.email, role: 'reject_app' })}
                                                                className="btn btn-sm btn-circle bg-amber-500 border-none text-white hover:bg-amber-600 shadow-lg shadow-amber-200"
                                                                title="Reject"
                                                            >
                                                                <IoPersonRemove size={14}/>
                                                            </button>
                                                        </>
                                                    )}
                                                    <button 
                                                        onClick={() => deleteMutation.mutate(app._id)}
                                                        className="btn btn-sm btn-circle btn-ghost text-slate-300 hover:text-rose-500 transition-colors"
                                                        title="Delete Record"
                                                    >
                                                        <FaTrash size={14}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}