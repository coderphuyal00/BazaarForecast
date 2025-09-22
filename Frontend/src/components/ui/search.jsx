import React, { useState } from "react";
import { Input, IconButton } from "@material-tailwind/react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { colors } from "../../lib/data";
export default function SearchBox({placeholder}) {
  const [query, setQuery] = useState("");
  const [firstSixMatching, setFirstSixMatching] = useState([]);

  // handle change event
  const handleChange = (e) => {
    setQuery(e.target.value)
    // filter the colors array based on the search value
    if (e.target.value.length > 0) {
      const matchingColors = colors.filter((color) =>
      // check if the color name includes the search value, lowercase both for case-insensitive search
        color.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      // lastly, set the first 6 matching colors
      setFirstSixMatching(matchingColors.slice(0, 6));
    } else {
      // if search value is empty, reset the first 6 matching colors
      setFirstSixMatching([]);
    }
  }

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
          onChange={handleChange}
          placeholder={placeholder}
          className="pr-14"
        />
        <ul className="absolute">
        {/* Displaying the filter based on search as dropDown */}
        {firstSixMatching &&
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
          ))}
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
