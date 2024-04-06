import React, { useState } from "react";

const SearchBar = ({ searchKeyword, placeholder, onSearch, validationRegex, invalidMessage }) => {
  const [inputValue, setInputValue] = useState(searchKeyword);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    const isValid = validationRegex.test(inputValue);

    if (!isValid) {
      alert(invalidMessage || "유효하지 않은 입력입니다.");
    } else {
      onSearch(inputValue);
    }
  };

  return (
    <div className="SearchBar search-input-container d-flex mb-3 mt-2 mx-4 row justify-content-center align-items-center">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder || "검색어를 입력하세요"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <i className="fa fa-search search-icon" onClick={triggerSearch}></i>
    </div>
  );
};

export default SearchBar;
