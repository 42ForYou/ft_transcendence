import React from "react";

const ListItemRow = ({ itemRow, ItemComponent, onOccurChange, itemsPerRow }) => {
  const marginRight = 20;
  const colClass = `col-${Math.floor(12 / itemsPerRow)}`;
  const itemStyle = {
    marginRight: `${itemRow.length - 1 ? marginRight + "px" : 0}`,
    flex: `0 0 calc((100% - ${marginRight * (itemsPerRow - 1)}px) / ${itemsPerRow})`,
  };

  return (
    <div className="ListItemRow d-flex align-items-center mb-3">
      {itemRow.map((item, itemIndex) => (
        <div
          className={`ListItem ${colClass} ${itemIndex !== itemRow.length - 1 ? "me-3" : ""}`} // Bootstrap의 me-3 클래스를 사용하여 마진을 적용합니다.
          key={itemIndex}
          style={itemStyle}>
          <ItemComponent {...item} onOccurChange={onOccurChange} />
        </div>
      ))}
    </div>
  );
};

const ListItems = ({ itemsData, ItemComponent, itemsPerRow, emptyMsg, onOccurChange }) => {
  // 데이터를 행 단위로 나누어 2차원 배열로 반환하는 함수
  const createItemRows = (data, itemsPerRow) => {
    const itemRows = [];
    if (data) {
      for (let i = 0; i < data.length; i += itemsPerRow) {
        itemRows.push(data.slice(i, i + itemsPerRow));
      }
    }
    return itemRows;
  };

  const itemRows = createItemRows(itemsData, itemsPerRow);
  // todo: 데이터 로드 실패한 경우와 로드 중인 상황을 구분하여 메시지를 표시
  const loadFailMsg = "데이터 로드 중...";
  const displayMessage = !itemsData ? loadFailMsg : itemsData.length === 0 ? emptyMsg : null;

  return (
    <div className="ListItems flex-grow-1 d-flex flex-column px-4 mt-3">
      {itemRows.map((itemRow, rowIndex) => (
        <ListItemRow
          itemRow={itemRow}
          ItemComponent={ItemComponent}
          itemsPerRow={itemsPerRow}
          onOccurChange={onOccurChange}
          key={rowIndex}
        />
      ))}
      {displayMessage && (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center text-center">{displayMessage}</div>
      )}
    </div>
  );
};

export default ListItems;
