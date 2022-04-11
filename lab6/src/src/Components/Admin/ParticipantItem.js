import React from 'react';
import ParticipantStock from './ParticipantStock';

import { connect } from 'react-redux';

const ParticipantItem = ({broker, stocks}) => (
    <div className='participants__item'>
        <p className="participants__text participants__name"><span className="label">Имя участника: </span>{broker.name}</p>
        <p className="participants__text participants__capital"><span className="label">Изначальный капитал участника: </span>{broker.capital}</p>
        <p className="participants__text participants__capital"><span className="label">Текущий капитал участника: </span>{broker.budget}</p>
        <div className="participants__stocks">
            <div className='participants__stock'>
                <p className="label participants__text">Название акции</p>
                <p className="label participants__text">Количество</p>
            </div>
            {
                stocks.map((stock, index) => {
                    return <ParticipantStock key={index} name={stock.name} amount={broker[stock.name]}/>
                })
            }
        </div>
    </div>
);

const mapStateToProps = (state) => {
    return {stocks: state['stocksReducer']}
}
export default connect(mapStateToProps)(ParticipantItem);