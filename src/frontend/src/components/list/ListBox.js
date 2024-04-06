import React, { useEffect, useReducer } from "react";
import ListFilter from "./ListFilter";
import ListItems from "./ListItems";
import ListPagination from "./ListPagination";
import useFetchListItems from "../../hooks/useFetchListItems";
import SearchBar from "../common/SearchBar";

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_FILTER":
      return { ...state, currentFilter: action.payload, currentPage: 1 };
    case "CHANGE_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_SEARCH_KEYWORD":
      return { ...state, searchKeyword: action.payload, currentPage: 1 };
    default:
      return state;
  }
};

// todo: 데이터를 갖고오는 로직을 커스텀 훅으로 분리
const ListBox = ({
  apiEndpoint,
  ItemComponent,
  filterTypes,
  additionalButton,
  emptyMsg,
  itemsPerPage,
  itemsPerRow,
  searchBarProps = null,
}) => {
  const initState = {
    currentFilter: filterTypes[0],
    currentPage: 1,
    searchKeyword: "",
  };
  const [state, dispatch] = useReducer(reducer, initState);
  const { itemsData, totalPage, isLoading, error, fetchListItems } = useFetchListItems(apiEndpoint, itemsPerPage);

  const reloadListItems = () => {
    fetchListItems(state.currentFilter, state.currentPage, state.searchKeyword);
  };

  const getEmptyMsg = () => {
    if (searchBarProps?.searchable && state.searchKeyword === "") return "";
    return emptyMsg;
  };

  useEffect(() => {
    reloadListItems();
  }, [state.currentFilter, state.currentPage, state.searchKeyword]);

  const handleChangeFilter = (filter) => dispatch({ type: "CHANGE_FILTER", payload: filter });
  const handleChangePage = (page) => dispatch({ type: "CHANGE_PAGE", payload: page });
  const handleSearch = (keyword) => dispatch({ type: "SET_SEARCH_KEYWORD", payload: keyword });

  return (
    <div className="ListBox d-flex-col flex-grow-1">
      {searchBarProps?.searchable && (
        <SearchBar searchKeyword={state.searchKeyword} onSearch={handleSearch} {...searchBarProps} />
      )}
      {filterTypes.length >= 2 && (
        <ListFilter
          filterTypes={filterTypes}
          currentFilter={state.currentFilter}
          onFilterClick={handleChangeFilter}
          rightButton={additionalButton}
        />
      )}
      {/* 차후 로딩 애니메이션 고려 */}
      {/* {isLoading ? ( <Loading />) : (<ListItems/>)} */}
      {searchBarProps && (
        <div className="d-flex justify-content-between mx-4">
          <span>검색어: {state.searchKeyword}</span>
          <span>검색 결과: {itemsData ? `${itemsData.length}` : 0}건</span>
        </div>
      )}
      <ListItems
        itemsData={itemsData}
        ItemComponent={ItemComponent}
        itemsPerRow={itemsPerRow}
        emptyMsg={getEmptyMsg()}
        onOccurChange={reloadListItems}
      />
      {/* {!isLoading && itemsData && ( */}
      {itemsData && itemsData.length > 0 && (
        <ListPagination totalPage={totalPage} currentPage={state.currentPage} onPaginationClick={handleChangePage} />
      )}
    </div>
  );
};

export default ListBox;
