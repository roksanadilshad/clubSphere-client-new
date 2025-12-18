import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaRocket, FaCrown } from "react-icons/fa";
import { Link } from "react-router";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";

const ManageMyClubs = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["managerClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure(`/manager/clubs?email=${user?.email}`);
      return res.data;
    },
  });

  const deleteClubMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/clubs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Club dissolved successfully");
      queryClient.invalidateQueries(["managerClubs", user?.email]);
    },
    onError: () => toast.error("Action restricted"),
  });

  const handleDelete = (id) => {
    toast((t) => (
      <span className="flex flex-col gap-2">
        <b>Confirm Deletion?</b>
        <div className="flex gap-2 mt-2">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold"
            onClick={() => { deleteClubMutation.mutate(id); toast.dismiss(t.id); }}
          >
            Yes, Delete
          </button>
          <button className="bg-slate-200 px-3 py-1 rounded text-xs" onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>
        </div>
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Architecture...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="p-2 bg-blue-600 rounded-lg text-white"><FaRocket size={12}/></span>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Management Console</p>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Your Organizations</h1>
        </div>
        
        <Link
          to="/dashboard/manager/create-club"
          className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-3 overflow-hidden transition-all hover:pr-12"
        >
          <span className="relative z-10 flex items-center gap-2">
            <FaPlus className="text-blue-400" /> Establish New Club
          </span>
          <FaArrowRight className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0" />
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Impact</p>
           <p className="text-2xl font-black text-slate-800">{clubs.length} Clubs</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Live Status</p>
           <p className="text-2xl font-black text-emerald-600">{clubs.filter(c => c.status === 'approved').length} Active</p>
        </div>
      </div>

      {/* Premium Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {clubs.map((club) => (
          <div key={club._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col md:flex-row transition-all hover:-translate-y-2">
            
            {/* Visual Side */}
            <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                {club.bannerImage ? (
                  <img src={club.bannerImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <FaUsers size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex flex-col">
                   <span className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Fee Structure</span>
                   <p className="text-2xl font-black text-white leading-none">${club.membershipFee}<span className="text-xs text-white/60">/mo</span></p>
                </div>
            </div>

            {/* Info Side */}
            <div className="flex-1 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 shadow-sm
                    ${club.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                    {club.status}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight uppercase line-clamp-1">{club.name}</h3>
                </div>
                
                {/* Modern Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/dashboard/manager/editClub/${club._id}`} className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <FaEdit size={14}/>
                  </Link>
                  <button onClick={() => handleDelete(club._id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                    <FaTrash size={14}/>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><FaUsers size={12}/></div>
                    <div>
                      <p className="text-sm font-black text-slate-700 leading-none">{club.memberCount || 0}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Growth</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><FaCalendarAlt size={12}/></div>
                    <div>
                      <p className="text-sm font-black text-slate-700 leading-none">{club.eventCount || 0}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Events</p>
                    </div>
                 </div>
                 <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><FaMapMarkerAlt size={12}/></div>
                    <p className="text-xs font-bold text-slate-500 line-clamp-1">{club.location}</p>
                 </div>
              </div>

              <div className="mt-auto flex gap-3">
                 <Link to={`/club/${club._id}`} className="flex-1 py-3 rounded-xl border border-slate-200 text-center text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors">Public Page</Link>
                 <Link to={`/dashboard/manager/manage-events/${club._id}`} className="flex-1 py-3 rounded-xl bg-slate-100 text-center text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Events</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {clubs.length === 0 && (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <FaCrown size={32}/>
           </div>
           <h3 className="text-2xl font-black text-slate-800 mb-2">The Stage is Yours</h3>
           <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">You haven't established any organizations yet. Start your journey by creating a club.</p>
           <Link to="/dashboard/manager/create-club" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">Initialize First Club</Link>
        </div>
      )}
    </div>
  );
};

// Helper for the arrows
const FaArrowRight = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default ManageMyClubs;