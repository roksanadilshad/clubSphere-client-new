// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axiosSecure from "../../../api/axiosSecure";
// import { use } from "react";
// import { AuthContext } from "../../../Context/AuthContext";

// const SelectEvent = () => {
//   const navigate = useNavigate();
// const {user} = use(AuthContext)
//   // Fetch manager's events
//   const { data: events = [], isLoading } = useQuery({
//     queryKey: ["managerEvents"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/manager/events", {
//          params: {
//     managerEmail: user?.email, // or wherever you store it
//   },
//       });
//       return res.data;
//     },
//   });

//   if (isLoading) return <div>Loading events...</div>;
// console.log(events);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Select an Event</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {events.map((event) => (
//           <div
//             key={event._id}
//             className="p-4 border rounded cursor-pointer hover:bg-gray-50"
//             onClick={() => navigate(`/dashboard/manager/eventRegistrations/${event._id}`)}
//           >
//             <h2 className="font-bold">{event.title}</h2>
//             <p>{new Date(event.eventDate).toLocaleDateString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SelectEvent;
