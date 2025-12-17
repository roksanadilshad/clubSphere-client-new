import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Club from './Club';
import axiosPublic from '../../api/axiosPublic';
 // Using the loading component we made

const Clubs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sync state with URL params for a better UX
  const [clubs, setClubs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Constants
  const limit = 8;
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "membershipFee";
  const order = searchParams.get("order") || "desc";
  const categories = searchParams.get("category") ? searchParams.get("category").split(",") : [];

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const categoryQuery = categories.join(',');
      
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
  }, [page, sort, order, search, categories.join(',')]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  // Handle URL updates
  const updateParams = (newParams) => {
    const current = Object.fromEntries([...searchParams]);
    setSearchParams({ ...current, ...newParams, page: newParams.page || 1 });
  };

  const handleSearchChange = (e) => {
    // Note: In a production app, you'd debounce this!
    updateParams({ search: e.target.value, page: 1 });
  };

  const handleCategoryChange = (cat) => {
    const newCats = categories.includes(cat)
      ? categories.filter(c => c !== cat)
      : [...categories, cat];
    updateParams({ category: newCats.join(','), page: 1 });
  };

  const availableCategories = ["Sports & Fitness", "Arts", "Tech", "Music", "Food", "Science","Photography","Sports", "Gaming", "Health", "Business"];

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="py-16 text-center bg-primary/5 rounded-3xl mb-12 border border-primary/10">
          <h2 className="text-5xl font-black text-base-content uppercase tracking-tighter">
            Club<span className="text-primary">Sphere</span> Directory
          </h2>
          <p className="text-base-content/60 mt-4 max-w-lg mx-auto">
            Find your tribe. Explore {total} active clubs and communities worldwide.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 space-y-8">
            {/* Search Box */}
            <div className="form-control">
              <label className="label font-bold text-sm uppercase opacity-60">Search</label>
              <div className="relative">
                <input
                  value={search}
                  onChange={handleSearchChange}
                  type="text"
                  placeholder="Club name..."
                  className="input input-bordered w-full rounded-2xl bg-secondary/10 focus:border-primary pl-10"
                />
                <svg className="w-5 h-5 absolute left-3 top-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="form-control">
              <label className="label font-bold text-sm uppercase opacity-60">Sort By Fee</label>
              <select
                onChange={(e) => {
                  const [f, o] = e.target.value.split('-');
                  updateParams({ sort: f, order: o });
                }}
                value={`${sort}-${order}`}
                className="select select-bordered w-full rounded-2xl"
              >
                <option value="membershipFee-desc">Price: High to Low</option>
                <option value="membershipFee-asc">Price: Low to High</option>
              </select>
            </div>

            {/* Categories Checklist */}
            <div className="p-6 bg-secondary/10 rounded-3xl border border-primary/5">
              <label className="label font-bold text-sm uppercase opacity-60 mb-2">Filter Categories</label>
              <div className="flex flex-wrap lg:flex-col gap-3">
                {availableCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={categories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="checkbox checkbox-primary checkbox-sm rounded-md"
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Clubs Result Area */}
          <main className="w-full lg:w-3/4">
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 w-full rounded-3xl"></div>)}
              </div>
            ) : clubs.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {clubs.map((club) => (
                    <Club club={club} key={club._id} />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-12 flex justify-center items-center gap-2">
                  <div className="join bg-base-200 p-1 rounded-2xl">
                    <button 
                      disabled={page === 1}
                      onClick={() => updateParams({ page: page - 1 })}
                      className="join-item btn btn-ghost"
                    >«</button>
                    {[...Array(Math.ceil(total / limit))].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateParams({ page: i + 1 })}
                        className={`join-item btn btn-md border-none ${page === i + 1 ? "btn-primary shadow-lg" : "btn-ghost"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      disabled={page >= Math.ceil(total / limit)}
                      onClick={() => updateParams({ page: page + 1 })}
                      className="join-item btn btn-ghost"
                    >»</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-secondary/5 rounded-3xl border-2 border-dashed border-primary/20">
                <h3 className="text-xl font-bold">No clubs found</h3>
                <p className="opacity-60">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Clubs;