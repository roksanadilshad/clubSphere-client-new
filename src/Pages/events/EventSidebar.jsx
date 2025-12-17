const EventSidebar = ({ filters, setFilters }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6 sticky top-24">
      <h3 className="text-xl font-bold text-black">Filter Events</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search events..."
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
        className="input input-bordered w-full"
      />

      {/* Category */}
      <select
        className="select select-bordered w-full"
        value={filters.category}
        onChange={(e) =>
          setFilters({ ...filters, category: e.target.value })
        }
      >
        <option value="all">All Categories</option>
        <option value="Technology">Technology</option>
        <option value="Business">Business</option>
        <option value="Education">Education</option>
        <option value="Health">Health</option>
      </select>

      {/* Sort */}
      <select
        className="select select-bordered w-full"
        value={filters.sort}
        onChange={(e) =>
          setFilters({ ...filters, sort: e.target.value })
        }
      >
        <option value="date-desc">Newest Events</option>
        <option value="date-asc">Oldest Events</option>
        <option value="fee-asc">Lowest Fee</option>
        <option value="fee-desc">Highest Fee</option>
      </select>
    </div>
  );
};

export default EventSidebar;
