import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaBuilding, FaCalendarAlt, FaCreditCard, FaArrowRight, FaRocket } from "react-icons/fa";
import { Link } from "react-router";
import axiosSecure from "../../../api/axiosSecure";

const MemberOverview = () => {
  const { user } = useContext(AuthContext);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["memberStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(`/member/stats?email=${user.email}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded-xl"></div>
          <div className="h-64 bg-gray-50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-10 text-center text-red-500 font-bold">Error loading overview data.</div>;

  const summaryCards = [
    {
      title: "Clubs Joined",
      value: stats?.totalClubs || 0,
      icon: <FaBuilding />,
      color: "blue",
      link: "/dashboard/member/clubs"
    },
    {
      title: "Events Registered",
      value: stats?.totalEvents || 0,
      icon: <FaCalendarAlt />,
      color: "emerald",
      link: "/dashboard/member/events"
    },
    {
      title: "Total Spent",
      value: `$${stats?.totalSpent?.toLocaleString() || 0}`,
      icon: <FaCreditCard />,
      color: "purple",
      link: "/dashboard/payments"
    },
  ];

  const safeUpcomingEvents = stats?.upcomingEvents?.filter(
    (e) => e.date && !isNaN(new Date(e.date))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Hey, {user?.displayName?.split(' ')[0] || "Member"}! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Ready for your next adventure?</p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Member Status</p>
           <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold mt-1">
             ● Premium Access
           </span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <Link to={card.link} key={index} className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 transition-colors
              ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
              ${card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
              ${card.color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
            `}>
              {card.icon}
            </div>
            <h3 className="text-3xl font-black text-slate-800">{card.value}</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
              <FaArrowRight className="text-slate-200 group-hover:text-slate-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clubs List */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Active Memberships</h2>
            <Link to="/dashboard/member/clubs" className="text-xs font-bold text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="space-y-4">
            {stats?.myClubs?.length > 0 ? (
              stats.myClubs.slice(0, 4).map((club) => (
                <div key={club.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <img src={club.bannerImage || "https://via.placeholder.com/60"} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{club.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{club.location}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic">No memberships yet.</div>
            )}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Next on your Calendar</h2>
            <Link to="/dashboard/member/events" className="text-xs font-bold text-blue-600 hover:underline">Full Schedule</Link>
          </div>
          <div className="space-y-4">
            {safeUpcomingEvents?.length > 0 ? (
              safeUpcomingEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center text-indigo-600 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-xl font-black leading-none">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 line-clamp-1">{event.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.clubName}</p>
                  </div>
                  <Link to={`/eventDetails/${event.id}`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-indigo-600 transition-all">
                    <FaArrowRight size={14} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic">No upcoming registrations.</div>
            )}
          </div>
        </section>
      </div>

      {/* Discovery Banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white">
        <div className="absolute right-0 bottom-0 opacity-10 rotate-12 translate-y-10 translate-x-10">
          <FaRocket size={300} />
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-black mb-4">Ready to expand your network?</h2>
          <p className="text-slate-400 font-medium mb-8">Join the elite communities and never miss an industry-leading event again.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/clubs" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20">
              Discover Clubs
            </Link>
            <Link to="/events" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-sm transition-all">
              Find Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberOverview;