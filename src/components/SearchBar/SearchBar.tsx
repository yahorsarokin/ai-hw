import React from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search users...",
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.input}
          id="search-input"
          aria-label="Search users by name, email, or company"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      {searchTerm && (
        <div className={styles.searchInfo}>
          Searching for: <strong>{searchTerm}</strong>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
