import React, { useEffect, useState } from 'react';
import Club from './Club';
import axiosPublic from '../../api/axiosPublic';


const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axiosPublic.get('/clubs?status=approved'); // no auth token needed
        setClubs(res.data);
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <p>Loading clubs.....</p>;
//console.log(clubs);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:grid-cols-4 grid md:grid-cols-3 gap-6">
      {clubs.map((club) => (
        <Club club={club} key={club._id} />
      ))}
    </div>
  );
};

export default Clubs;
