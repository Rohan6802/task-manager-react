import React from "react";

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search tasks by text or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;
