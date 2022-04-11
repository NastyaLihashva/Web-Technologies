import React from 'react';
import './Modal.css';

import { connect } from 'react-redux';
import actionsBroker from '../../store/actionCreators/brokersAction';
import uiAction from '../../store/actionCreators/uiAction';
import { useParams } from "react-router-dom";


const ModalBuy = ({ ui, toggleBuyModal, toggleSellModal, socket, stocks, brokers}) => {
    const [value, setFormValue] = React.useState(0);
    const params = useParams();
    const closeModal = () => {
        setFormValue(0);
        ui.get('isModalBuyOpen') ? toggleBuyModal() : toggleSellModal()
    };
    const buy = (e) => {
        e.preventDefault();
        let price, amountStock;
        stocks.forEach((stock)=>{
            if (stock.name === ui.get('openStockType')){
                price = stock.curPrice;
                amountStock = stock.amount;
            }
        });
        if (ui.get('isModalBuyOpen') && value * price > brokers.get(0).budget){ //проверка
            alert('Недостаточно средств на счету для покупки акций!');
            return;
        }
        if (+value <= 0) {
            alert('Количество покупаемых/продаваемых акций должно быть положительно!');
            return;
        }
        if (ui.get('isModalSellOpen') && +value > brokers.get(0)[ui.get('openStockType')]){
            alert('Количество продаваемых больше имеющихся!!');
            return;
        }
        if (ui.get('isModalBuyOpen') && value > amountStock){
            alert('На рынке нет запрашиваемого количества акций!');
            return;
        }
        const transaction = { //заполняем
            name: ui.get('openStockType'),
            amount: ui.get('isModalBuyOpen') ? +value : -1 * value,
            broker: params.name,
        }
        closeModal();
        socket.socket.emit('offer', transaction); //отправляем на сервер
    }

    const closeOnClick = (e) => {
        if (e.target.matches('.modal__overlay')){
            closeModal();
        }
    }
    console.log(ui.get('isAuctionStarted'));

    return (<div className='modal__overlay' onClick={closeOnClick} style={{ display: ui.get('isModalBuyOpen') || ui.get('isModalSellOpen')  ? 'flex' : 'none'}}>
        <div className="modal">
            <form className="modal__form" id="buy__form" onSubmit={buy}>
                <p className="modal__label">{ui.get('openStockType')}</p>
                <input className="modal__input" onChange={(e) => {setFormValue(e.target.value)}} value={value} type="number" min={1} required placeholder={'Количество акций'}/>
                <button className="btn modal__btn" disabled={!ui.get('isAuctionStarted')}>{ui.get('isModalBuyOpen') ? 'Купить' : 'Продать'}</button>
            </form>
        </div>
    </div>)
};

const mapStateToProps = (state) => {
    return {ui: state['uiReducer'], socket: state['socketReducer'], stocks: state['stocksReducer'], brokers: state['brokersReducer']};
}

const actions = {
    ...actionsBroker,
    ...uiAction,
}
export default connect(mapStateToProps, actions)(ModalBuy);