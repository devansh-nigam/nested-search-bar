import { useEffect, useState, useRef } from "react";
import "./App.css";
import searchData from "./mocks/searchData";

function App() {
  const [searchText, setSearchText] = useState("");
  const [stateSearchData, setStateSearchData] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState(["All resources"]);
  const [trail, setTrail] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const getNestedValue = (obj, indexes) => {
    return indexes.reduce(
      (current, index, i) =>
        i === 0 ? current?.[index] : current?.children?.[index],
      obj
    );
  };

  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase());
  };

  useEffect(() => {
    setStateSearchData(searchData);
  }, []);

  // Handle clicks outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsInputFocused(false);
      }
    };

    if (isInputFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInputFocused]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleSearchItem = (item, index) => {
    if (item.type === "resource") {
      setStateSearchData(item.children);
      const bcState = [...breadcrumbs, item.value];
      setBreadcrumbs(bcState);
      setTrail([...trail, index]);
      const pathParts = [
        "root",
        ...breadcrumbs.slice(1).map(toCamelCase),
        toCamelCase(item.value),
      ];
      setSearchText(`{${pathParts.join(".")}}`);
    }
  };

  const handleBreadcrumb = (index) => {
    let data;
    if (index === 0) {
      data = searchData;
      setTrail([]);
      setSearchText("");
    } else {
      data = stateSearchData;
      const trailSlice = trail.slice(0, index);
      setTrail(trailSlice);
      const nestedValue = getNestedValue(searchData, trailSlice);
      data = nestedValue?.children || [];
    }
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    const pathParts = [
      "root",
      ...breadcrumbs.slice(1, index + 1).map(toCamelCase),
    ];
    setSearchText(`{${pathParts.join(".")}}`);
    setStateSearchData(data);
  };

  const handleNewResource = () => {
    // TODO: Implement new resource functionality
    console.log("Add new resource clicked");
  };

  const SearchSection = () => {
    if (!isInputFocused) return null;

    return (
      <div className="search-section">
        <div className="breadcrumbs">
          {breadcrumbs?.map((breadcrumb, index) => {
            return (
              <div key={index} className="breadcrumb-item">
                <div
                  className="breadcrumb-link"
                  onClick={() => handleBreadcrumb(index)}
                >
                  {breadcrumb}
                </div>
                {index !== breadcrumbs.length - 1 && (
                  <span className="breadcrumb-separator">›</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="search-results">
          {stateSearchData?.length === 0 ? (
            <div className="no-results">No data found</div>
          ) : (
            stateSearchData?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`search-item ${
                    item.type === "resource" ? "resource-item" : "endpoint-item"
                  }`}
                  onClick={() => handleSearchItem(item, index)}
                >
                  <span className="item-value">{item.value}</span>
                  {item.type === "resource" && (
                    <span className="item-arrow">›</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <button className="new-resource-btn" onClick={handleNewResource}>
          <span className="btn-icon">+</span>
          <span className="btn-text">New Resource</span>
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="app-title">
          <span className="title-icon">🔍</span>
          Nested Search Bar
        </h1>
        <p className="app-subtitle">
          Navigate through hierarchical data with ease
        </p>
      </div>

      <div className="search-container" ref={searchContainerRef}>
        <div className="input-wrapper">
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            onFocus={handleInputFocus}
            placeholder="Enter value or search resources..."
            className="search-input"
          />
          <div className="input-icon">🔍</div>
        </div>
        <SearchSection />
      </div>
    </div>
  );
}

export default App;
