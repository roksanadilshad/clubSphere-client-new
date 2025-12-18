import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://club-sphere-server-new.vercel.app/api/clubs/search", {
        params: { query, category },
      });
      if (onResults) onResults(res.data);
    } catch (error) {
      console.error(error);
      if (onResults) onResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
      {/* Search Input */}
      <div className="flex-1 relative">
        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search for clubs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-16 pr-6 py-5 text-lg border border-gray-300 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      </div>

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-6 py-4 text-lg border border-gray-300 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
      >
        <option>All Categories</option>
        <option>Sports</option>
        <option>Arts</option>
        <option>Technology</option>
        <option>Music</option>
      </select>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-2xl shadow-md hover:bg-gray-800 transition-all"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBar;
