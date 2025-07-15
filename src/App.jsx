import { useEffect, useState } from "react";
import "./App.css";
import searchData from "./mocks/searchData";

function App() {
  const [searchText, setSearchText] = useState("");
  const [stateSearchData, setStateSearchData] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState(["All resources"]);
  const [trail, setTrail] = useState([]);

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

  const handleSearch = (event) => {
    setSearchText(event.target.value);
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

  const SearchSection = () => {
    return (
      <>
        <div className="breadcrumbs">
          {breadcrumbs?.map((breadcrumb, index) => {
            return (
              <div key={index} className="breadcrumb-item">
                <div onClick={() => handleBreadcrumb(index)}>{breadcrumb}</div>
                <span>{index !== breadcrumbs.length - 1 ? ">" : ""}</span>
              </div>
            );
          })}
        </div>
        <div>
          {stateSearchData?.length === 0 ? (
            <div>No data found</div>
          ) : (
            stateSearchData?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="search-item"
                  onClick={() => handleSearchItem(item, index)}
                >
                  {item.value}
                  <span>{item.type === "resource" ? ">" : ""}</span>
                </div>
              );
            })
          )}
        </div>
        <button>+ New Resource</button>
      </>
    );
  };

  return (
    <div>
      <h1>Nested Search Bar</h1>
      <input
        type="text"
        value={searchText}
        onChange={handleSearch}
        placeholder="Enter value or search resources..."
      />
      <SearchSection />
    </div>
  );
}

export default App;
