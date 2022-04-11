import React from 'react';
import { connect } from 'react-redux';
const StocksItem = ({ stock, socket }) => {
    const changeDistribution = (e) => {
        socket.socket.emit('changeDistribution', stock.name, e.target.value);
    }
    return (<ul className='stocks__item'>
        <li className="stocks__name stocks__text">{stock.name}</li>
        <li className="stocks__amount stocks__text">{stock.amount}</li>
        <li className="stocks__price stocks__text">{stock.curPrice}</li>
        <form className="stocks__distribution">
            <label className="stocks__label">
                <input defaultChecked={stock.distribution === 'normal'} onChange={changeDistribution} className="stocks__distribution" type="radio" name="distribution" value="normal" />
                Нормальный
            </label>
            <label className="stocks__label">
                <input defaultChecked={stock.distribution === 'uniform'} onChange={changeDistribution} className="stocks__distribution" type="radio" name="distribution" value="uniform" />
                Равномерный
            </label>
        </form>
    </ul>)
};

const mapStateToProps = (state) => {
    return { socket: state['socketReducer'] }
}

export default connect(mapStateToProps)(StocksItem);