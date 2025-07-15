import { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import searchData from "./mocks/searchData";

// Modal component moved outside to prevent re-creation on every render
const Modal = ({
  isOpen,
  onClose,
  newResourceData,
  onInputChange,
  onAddResource,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Resource</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="resourceName">Resource Name</label>
            <input
              id="resourceName"
              type="text"
              value={newResourceData.value}
              onChange={(e) => onInputChange("value", e.target.value)}
              placeholder="Enter resource name..."
              className="modal-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="resourceType">Type</label>
            <select
              id="resourceType"
              value={newResourceData.type}
              onChange={(e) => onInputChange("type", e.target.value)}
              className="modal-select"
            >
              <option value="resource">Resource (can have children)</option>
              <option value="endpoint">Endpoint (final item)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <div className="location-display">
              {newResourceData.parentPath.join(" › ")}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn modal-btn-primary"
            onClick={onAddResource}
          >
            Add Resource
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [searchText, setSearchText] = useState("");
  const [stateSearchData, setStateSearchData] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState(["All resources"]);
  const [trail, setTrail] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResourceData, setNewResourceData] = useState({
    value: "",
    type: "resource",
    parentPath: [],
  });
  const searchContainerRef = useRef(null);

  const getNestedValue = useCallback((obj, indexes) => {
    return indexes.reduce(
      (current, index, i) =>
        i === 0 ? current?.[index] : current?.children?.[index],
      obj
    );
  }, []);

  const toCamelCase = useCallback((str) => {
    return str
      .toLowerCase()
      .replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase());
  }, []);

  useEffect(() => {
    setStateSearchData(searchData);
  }, []);

  // Handle clicks outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if modal is open
      if (isModalOpen) {
        return;
      }

      // Check if click is outside search container
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
  }, [isInputFocused, isModalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  const handleSearch = useCallback((event) => {
    setSearchText(event.target.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const handleSearchItem = useCallback(
    (item, index) => {
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
    },
    [breadcrumbs, trail, toCamelCase]
  );

  const handleBreadcrumb = useCallback(
    (index) => {
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
    },
    [breadcrumbs, trail, stateSearchData, getNestedValue, toCamelCase]
  );

  const openModal = useCallback(() => {
    setNewResourceData({
      value: "",
      type: "resource",
      parentPath: [...breadcrumbs],
    });
    setIsModalOpen(true);
    // Keep the search container open when modal opens
    setIsInputFocused(true);
  }, [breadcrumbs]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setNewResourceData({
      value: "",
      type: "resource",
      parentPath: [],
    });
  }, []);

  const handleModalInputChange = useCallback((field, value) => {
    setNewResourceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const addNewResource = useCallback(() => {
    if (!newResourceData.value.trim()) {
      alert("Please enter a resource name");
      return;
    }

    const newResource = {
      id: Date.now(), // Simple ID generation
      type: newResourceData.type,
      value: newResourceData.value.trim(),
      children: newResourceData.type === "resource" ? [] : undefined,
    };

    // Add to the current level
    const updatedData = [...stateSearchData, newResource];
    setStateSearchData(updatedData);

    // Update the main searchData if we're at the root level
    if (breadcrumbs.length === 1) {
      // This would need to be handled differently in a real app
      // For now, we'll just update the local state
      console.log("New resource added:", newResource);
    }

    closeModal();
  }, [newResourceData, stateSearchData, breadcrumbs.length, closeModal]);

  const handleNewResource = useCallback(() => {
    openModal();
  }, [openModal]);

  const SearchSection = useCallback(() => {
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
  }, [
    isInputFocused,
    breadcrumbs,
    stateSearchData,
    handleBreadcrumb,
    handleSearchItem,
    handleNewResource,
  ]);

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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        newResourceData={newResourceData}
        onInputChange={handleModalInputChange}
        onAddResource={addNewResource}
      />
    </div>
  );
}

export default App;
