import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Club from './Club';

const Clubs = () => {

    const[clubs, setClubs] = useState([]);
    const[loading, setLoading] = useState(true)

    useEffect(()=>{
        axios.get('http://localhost:3000/clubs')
        .then((res)=>{
            setClubs(res.data);
            setLoading(false);
        })
        .catch(err =>{
            console.log(err);
            setLoading(false)
            
        })
    }, [])

    if (loading) return <p>Loading clubs.....</p>
    
    return (
       <div className="max-w-7xl mx-auto p-6 lg:grid-cols-4 grid md:grid-cols-3 gap-6">
      {clubs.map((club) => (
        <Club club={club} key={club._id}></Club>
      ))}
    </div>
    );
};

export default Clubs;