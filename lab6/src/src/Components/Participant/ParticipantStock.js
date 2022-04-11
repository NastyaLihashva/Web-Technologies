import React from "react";

import { connect } from "react-redux";
import uiAction from "../../store/actionCreators/uiAction";

const ParticipantStock = ({ui, stock, amount, toggleBuyModal, toggleSellModal, setStockType}) => {
    const openModal = (type) => { //редакс
        setStockType(stock.name);
        if(type === 'buy'){
            toggleBuyModal();
        }
        else{
            toggleSellModal();
        }
    }
    
    return (<div className="stock participants__stock">
        <ul className="stock__list">
            <li className="stock__name stock__item"><span className="label">Название акции: </span>{stock.name}</li>
            <li className="stock__amount stock__item"><span className="label">Количество купленных акций: </span>{amount}</li>
            <li className="stock__price stock__item"><span className="label">Текущая цена одной акции: </span>{stock.curPrice}</li>
            <li className="stock__sum stock__item"><span className="label">Суммарная стоимость акций: </span>{stock.curPrice * amount}</li>
        </ul>
        <div className="participant__btns">
            <button onClick={() => openModal('buy')} disabled={!ui.get('isAuctionStarted')} className="btn__buy btn">Купить акции</button>
            <button onClick={() => openModal('sell')} disabled={!ui.get('isAuctionStarted')} className="btn__sell btn">Продать акции</button>
        </div>
    </div>)
};

const mapStateToProps = (state) => {
    return {ui: state['uiReducer']};
}

export default connect(mapStateToProps, uiAction)(ParticipantStock);