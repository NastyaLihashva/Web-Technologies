import React from 'react';
import StocksItem from './StocksItem';

import { connect } from 'react-redux';
const StocksList = ({stocks}) => (
    <div className='stocks'>
        <h3 className="subtitle admin__title">Список акций</h3>
        <div className="stocks__list">
            <div className="stocks__labels">
                <p className="label stocks__text">Название акции:</p>
                <p className="label stocks__text">Оставшееся количество на бирже:</p>
                <p className="label stocks__text">Текущая стоимость:</p>
                <p className="label stocks__text">Закон распределения:</p>
            </div>
            {
                stocks.map((stock, index)=>{
                    return <StocksItem key={index} stock={stock}/>
                })
            }
        </div>
    </div>
);

const mapStateToProps = (state) => {
    return {stocks: state["stocksReducer"]};
}
export default connect(mapStateToProps)(StocksList);