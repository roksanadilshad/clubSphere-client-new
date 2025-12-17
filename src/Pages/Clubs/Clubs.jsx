import React, { useEffect, useState } from 'react';
import Club from './Club';
import axiosPublic from '../../api/axiosPublic';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("membershipFee");
  const [order, setOrder] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]); // multiple categories
  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const skip = (page - 1) * limit;
        const categoryQuery = categories.join(','); // API can handle comma-separated categories
        const res = await axiosPublic.get(
          `/clubs?status=approved&limit=${limit}&skip=${skip}&sort=${sort}&order=${order}&search=${search}&category=${categoryQuery}`
        );
        setClubs(res.data.clubs);
        setTotal(res.data.total);
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [page, sort, order, search, categories]);

  const totalPages = Math.ceil(total / limit);

  const handleSortChange = (e) => {
    const [sortField, sortOrder] = e.target.value.split('-');
    setSort(sortField);
    setOrder(sortOrder);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setPage(1);
    setCategories(prev => 
      prev.includes(value) ? prev.filter(cat => cat !== value) : [...prev, value]
    );
  };

  const availableCategories = ["Education", "Tech", "Fitness", "Art"];

  if (loading) return <p className="text-center py-10">Loading clubs.....</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <title>All Clubs</title>

      {/* Header */}
      <div className="py-12 text-center">
        <h2 className="text-4xl font-bold text-black">Our All Clubs</h2>
        <p className="text-center text-gray-700 mt-2">
          Explore all apps on the market developed by us. We code for millions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6">
          {/* Search */}
          <div>
            <label className="input max-w-full w-full input-bordered input-secondary flex items-center gap-2">
              <svg
                className="h-5 w-5 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={handleSearchChange}
                type="search"
                placeholder="Search apps..."
                className="w-full focus:outline-none"
              />
            </label>
          </div>

          {/* Sort */}
          <div>
            <label className="block font-semibold mb-2">Sort By</label>
            <select
              onChange={handleSortChange}
              value={`${sort}-${order}`}
              className="select select-bordered w-full"
            >
              <option disabled>Choose option</option>
              <option value={"membershipFee-desc"}>MembershipFee: High - Low</option>
              <option value={"membershipFee-asc"}>MembershipFee: Low - High</option>
            </select>
          </div>

          {/* Multi-Category */}
          <div>
            <label className="block font-semibold mb-2">Categories</label>
            <div className="flex flex-col gap-2">
              {availableCategories.map(cat => (
                <label key={cat} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={categories.includes(cat)}
                    onChange={handleCategoryChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clubs count */}
          <div>
            <h2 className="font-bold text-lg">({total}) Apps Found</h2>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="w-full lg:w-3/4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clubs.map((club) => (
            <Club club={club} key={club._id} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="text-center py-10 flex justify-center items-center gap-2 flex-wrap">
        <button
          disabled={page === 1}
          className="btn btn-outline"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        {[...Array(totalPages).keys()].map(num => (
          <button
            key={num}
            className={`btn m-1 ${page === num + 1 ? "btn-primary" : "btn-outline"}`}
            onClick={() => setPage(num + 1)}
          >
            {num + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          className="btn btn-outline"
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Clubs;
