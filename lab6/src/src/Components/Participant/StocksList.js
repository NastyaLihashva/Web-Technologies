import React from "react";
import StockItem from "./StocksItem";

import { connect } from "react-redux";
const StocksList = ({stocks}) => (
    <div className="stocks">
        <h3 className="subtitle stocks__title">Состояние акций на бирже</h3>
        <div className="stocks__list">
            <div className="stocks__labels">
                <p className="label stocks__text">Название акции:</p>
                <p className="label stocks__text">Оставшееся количество на бирже:</p>
                <p className="label stocks__text">Текущая стоимость:</p>
            </div>
            {
                stocks.map((stock,index) => {
                    return <StockItem key={index} stock={stock}/>
                })
            }
        </div>
    </div>
);

const mapStateToProps = (state) => {
    return {stocks: state['stocksReducer']};
}
export default connect(mapStateToProps)(StocksList);