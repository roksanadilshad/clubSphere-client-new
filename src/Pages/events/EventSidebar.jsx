const EventSidebar = ({ filters, setFilters }) => {
  return (
    <div className="bg-white border rounded-xl p-6 space-y-6 sticky top-24">
      <h3 className="text-xl font-semibold text-black">
        Filter Events
      </h3>

      {/* Search */}
      <div>
        <label className="text-sm text-gray-600">Search</label>
        <input
          type="text"
          placeholder="Search by title"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="input input-bordered w-full mt-1"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-sm text-gray-600">Category</label>
        <select
          className="select select-bordered w-full mt-1"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="all">All Categories</option>
          <option value="Sports">Sports</option>
          <option value="Technology">Technology</option>
          <option value="Education">Education</option>
          <option value="Business">Business</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="text-sm text-gray-600">Sort By</label>
        <select
          className="select select-bordered w-full mt-1"
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value })
          }
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="fee-asc">Lowest Fee</option>
          <option value="fee-desc">Highest Fee</option>
        </select>
      </div>
    </div>
  );
};

export default EventSidebar;
