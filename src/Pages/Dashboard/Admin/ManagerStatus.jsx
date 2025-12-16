import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../Context/AuthContext';
import axiosPublic from '../../../api/axiosPublic';


export default function ManagerStatus() {
  const { user } = useContext(AuthContext);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axiosPublic.get('/admin/manager-applications');
        setApplication(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!application) return <p className="text-center mt-10">No application found.</p>;

  const statusColor = {
    pending: 'bg-yellow-400',
    approved: 'bg-green-500',
    rejected: 'bg-red-500'
  };
 // console.log(application);
  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#FFC4C4] rounded-2xl shadow mt-10">
      <h2 className="text-2xl font-bold text-[#850E35] mb-6">Manager Application Status {application.length}</h2>
      <div className="p-4 bg-white  rounded-lg shadow">
        {
          application.map(applicants => <div key={applicants._id}>

            <div className='border-2 p-4 m-3 rounded-2xl'>
<p><strong>Name:</strong> {applicants.fullName}</p>
        <p><strong>Email:</strong> {applicants.email}</p>
        <p><strong>Phone:</strong> {applicants.phone}</p>
        <p><strong>Occupation:</strong> {applicants.occupation || 'N/A'}</p>
        <p><strong>Organization:</strong> {applicants.organization || 'N/A'}</p>
        <p><strong>Reason:</strong> {applicants.reason}</p>
        <p>
  <strong>Preferred Categories:</strong>{" "}
  {(applicants.preferredCategories || []).join(', ')}
</p>
        <p><strong>Status:</strong> <span className={`status-badge ${applicants.status?.toUpperCase() || ''}`}>
  {applicants.status ? applicants.status.toUpperCase() : 'PENDING'}
</span></p>
            </div>
            
            </div>
)
        }
        
      </div>
    </div>
  );
}
