import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SearchPage.css';

const searchMap = {
  fruits: { path: "/fruits", subcategories: ["apples", "bananas", "mangoes"] },
  vegetables: { path: "/vegetables", subcategories: ["carrot", "spinach"] },
  kitchen: { path: "/Kitchen" },
  "women's clothing": { path: "/Women's Clothing" },
  "men's clothing": { path: "/Men's Clothing" },
  bakery: { path: "/bakery" },
  beauty: { path: "/beauty" },
};

function SearchPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const val = e.target.value.toLowerCase();
    setQuery(val);

    if (!val) {
      setSuggestions([]);
      return;
    }

    const newSuggestions = [];

    for (const [key, value] of Object.entries(searchMap)) {
      // Category match
      if (key.includes(val)) {
        newSuggestions.push({ name: key, path: value.path });
      }

      // Subcategories match
      if (value.subcategories) {
        value.subcategories.forEach((sub) => {
          if (sub.toLowerCase().includes(val)) {
            newSuggestions.push({ name: sub, path: value.path, subcategory: sub });
          }
        });
      }
    }

    setSuggestions(newSuggestions);
  };

  const handleSelect = (item) => {
    // Navigate to category page
    navigate(item.path, { state: { subcategory: item.subcategory || "All" } });
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="search-page-wrapperwwwww">
      <h2 className="search-titlewwwww">Search Your Favorite Items</h2>

      <div className="search-containerwwwww">
        <div className="input-group search-input-group">
          <span className="input-group-text search-icon">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search for products, categories..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleEnterKey}
          />
        </div>

        {suggestions.length > 0 && (
          <ul className="search-suggestions-dropdown">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => handleSelect(s)}>
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
