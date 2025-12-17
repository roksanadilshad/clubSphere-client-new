import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { FaBuilding, FaUsers, FaCalendarAlt, FaDollarSign, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router";
import axiosSecure from "../../../api/axiosSecure";
import { AuthContext } from "../../../Context/AuthContext";

const ManagerOverview = () => {
  const { user } = useContext(AuthContext);

  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["managerStats", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/manager/stats?email=${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const summaryCards = [
    {
      title: "Active Clubs",
      value: stats?.totalClubs || 0,
      icon: <FaBuilding />,
      color: "blue",
      link: "/dashboard/manager/clubs",
    },
    {
      title: "Total Members",
      value: stats?.totalMembers || 0,
      icon: <FaUsers />,
      color: "purple",
      link: "/dashboard/manager/members",
    },
    {
      title: "Upcoming Events",
      value: stats?.totalEvents || 0,
      icon: <FaCalendarAlt />,
      color: "emerald",
      link: "/dashboard/manager/events",
    },
    {
      title: "Net Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: <FaDollarSign />,
      color: "amber",
      link: "/dashboard/manager/payments",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-blue-600"></span>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Assembling your insights...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-center">
        <p className="font-bold">System Error</p>
        <p className="text-sm">{error?.message || "Failed to sync management data."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Manager <span className="text-blue-600">Console</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.3em]">
            Global Operations Overview — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
            <Link to="/dashboard/manager/add-club" className="btn btn-primary btn-sm rounded-lg px-6 font-bold">New Club</Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {summaryCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-200 transition-all duration-300 overflow-hidden"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 
                ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                ${card.color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
                ${card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                ${card.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
            `}>
              {card.icon}
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{card.value}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
            
            {/* Visual Flair: Growth Indicator (Placeholder logic) */}
            <div className="absolute top-6 right-6 flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
               <FaArrowUp /> 12%
            </div>
          </Link>
        ))}
      </div>

      {/* Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Clubs Management */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Portfolio</h2>
            <Link to="/dashboard/manager/clubs" className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors">Manage All</Link>
          </div>
          
          <div className="space-y-5">
            {stats?.recentClubs?.map((club) => (
              <div key={club.id} className="flex items-center gap-4 group p-2 hover:bg-slate-50 rounded-2xl transition-all">
                <div className="relative">
                    <img
                        src={club.bannerImage || "https://via.placeholder.com/80"}
                        alt=""
                        className="w-14 h-14 rounded-2xl object-cover shadow-md"
                    />
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                         club.status === "approved" ? "bg-emerald-500" : "bg-amber-500"
                    }`}></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{club.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <FaUsers className="text-slate-300 text-[10px]" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{club.memberCount} active members</p>
                  </div>
                </div>
                <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        club.status === "approved" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                    }`}>
                      {club.status}
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance & Engagement */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Event Pipeline</h2>
            <Link to="/dashboard/manager/events" className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors">Schedule</Link>
          </div>
          
          <div className="space-y-6">
            {stats?.upcomingEvents?.map((event) => {
              const progress = (event.registrations / event.maxAttendees) * 100;
              return (
                <div key={event.id} className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white shrink-0">
                    <span className="text-[9px] font-black uppercase opacity-60">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-xl font-black leading-none">{new Date(event.date).getDate()}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate mb-1">{event.title}</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${progress > 85 ? 'bg-rose-500' : 'bg-blue-600'}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.clubName}</p>
                        <p className="text-[10px] font-black text-slate-900">{event.registrations}/{event.maxAttendees}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;