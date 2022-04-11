import React from "react";

const StockItem = ({stock}) => (
    <div className="stocks__item">
        <p className="stocks__name stocks__text">{stock.name}</p>
        <p className="stocks__amount stocks__text">{stock.amount}</p>
        <p className="stocks__price stocks__text">{stock.curPrice}</p>
    </div>
);

export default StockItem;