import { useEffect, useState } from "react";
import "./App.css";
import searchData from "./mocks/searchData";

function App() {
  const [searchText, setSearchText] = useState("");
  const [stateSearchData, setStateSearchData] = useState();

  useEffect(() => {
    setStateSearchData(searchData);
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const SearchSection = () => {
    return (
      <div>
        <div>
          {stateSearchData?.length === 0 ? (
            <div>No data found</div>
          ) : (
            stateSearchData?.map((item, index) => {
              return <div key={index}>{item.value}</div>;
            })
          )}
        </div>
        <button>+ New Resource</button>
      </div>
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
