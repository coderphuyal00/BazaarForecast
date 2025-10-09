import React, { useState, useEffect } from "react";
import { Input, IconButton } from "@material-tailwind/react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { colors } from "../../lib/data";
import CompanyTicker from "../../../company_list.json";
export default function SearchBox({ placeholder }) {
  const [query, setQuery] = useState("");
  const [firstSixMatching, setFirstSixMatching] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionId, setSuggestionID] = useState();
  const [selectedStock, setSelectedStock] = useState(null);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // setSelectedStock(null);
    if (value.length > 0) {
      const filteredSuggestions = CompanyTicker.filter((obj) =>
        obj.symbol.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion, suggestion_id) => {
    setQuery(suggestion);
    setSelectedStock(suggestion);
    if (suggestion_id != "") {
      setSuggestionID(suggestion_id);
    }

    setSuggestions([]);
  };
  useEffect(() => {
    const handleInputBlurOrSubmit = () => {
      if (!selectedStock) {
        const found = CompanyTicker.find(
          (s) => s.symbol.toLowerCase() === query?.toLowerCase()
        );
        if (found) {
          setSelectedStock(found);
          // console.log(found.id);
          // setInputStockID(found.id);
        }
      }
    };
    handleInputBlurOrSubmit();
  }, [query]);
  // handle change event
  const handleChange = (e) => {
    setQuery(e.target.value);
    // filter the colors array based on the search value
    if (e.target.value.length > 0) {
      const matchingTicker = CompanyData.filter((item) =>
        // check if the color name includes the search value, lowercase both for case-insensitive search
        item.symbol.toLowerCase().includes(e.target.value.toLowerCase())
      );
      // lastly, set the first 6 matching colors
      setFirstSixMatching(matchingTicker.slice(0, 6));
    } else {
      // if search value is empty, reset the first 6 matching colors
      setFirstSixMatching([]);
    }
  };

  const handleSearch = () => {
    alert(`Searching for: ${query}`);
    // Implement your search logic here
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="relative">
        <Input
          type="text"
          value={query}
          //   onChange={(e) => setQuery(e.target.value)}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pr-14"
        />
        <ul className="absolute">
          {/* Displaying the filter based on search as dropDown */}
          {/* {firstSixMatching &&
          firstSixMatching.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setSearch(item.name);
              }}
              className={search === item.name ? "active" : ""}
            >
              {item.name}
            </li>
          ))} */}
          {suggestions.length > 0 && (
            <ul
              style={{
                padding: "0",
                marginTop: "0",
              }}
            >
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  style={{
                    listStyleType: "none",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                  className=" hover:bg-gray-300/50 dark:text-gray-100 dark:hover:bg-gray-700/50"
                  onClick={() =>
                    handleSuggestionClick(suggestion.symbol, suggestion.id)
                  }
                >
                  {suggestion.item}
                </li>
              ))}
            </ul>
          )}
        </ul>
        <IconButton
          color="blue"
          className="absolute right-1 top-1 h-10 w-10"
          //   onClick={handleSearch}
        >
          {/* <MagnifyingGlassIcon className="h-5 w-5" /> */}
        </IconButton>
      </div>
    </div>
  );
}
