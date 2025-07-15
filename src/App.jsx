import { useEffect, useState } from "react";
import "./App.css";
import searchData from "./mocks/searchData";

function App() {
  const [searchText, setSearchText] = useState("");
  const [stateSearchData, setStateSearchData] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState(["All resources"]);

  useEffect(() => {
    setStateSearchData(searchData);
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchItem = (item) => {
    if (item.type === "resource") {
      setStateSearchData(item.children);
      const bcState = [...breadcrumbs, item.value];
      setBreadcrumbs(bcState);
    }
  };

  const handleBreadcrumb = (index) => {
    let data;
    if (index === 0) {
      data = searchData;
      setSearchText("");
    } else {
      data = stateSearchData;
    }
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
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
                  onClick={() => handleSearchItem(item)}
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
