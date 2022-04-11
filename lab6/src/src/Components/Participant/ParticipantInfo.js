import React from "react";
import ParticipantStock from "./ParticipantStock";

import { connect } from 'react-redux';

const ParticipantInfo = ({ brokers, stocks, socket}) => {
    return (<div className="participant__info">
        <h2 className="participant__title title">{brokers.get(0) ? brokers.get(0).name : 'Name!'}</h2>
        <div className="participant__capital">
            <div className="participant__startCapital"><span className="label">Изначальный капитал: </span>{brokers.get(0) ? brokers.get(0).capital : '0'}</div>
            <div className="participant__curCapital"><span className="label">Текущий капитал: </span>{brokers.get(0) ? brokers.get(0).budget : '0'}</div>
        </div>
        <div className="participant__stocks">
            {
                stocks.map((stock,index) => {
                    return <ParticipantStock key={index} stock={stock} amount={brokers.get(0)[stock.name]}/>
                })
            }
        </div>
    </div>
)};

const mapStateToProps = (state) => {
    return { brokers: state['brokersReducer'], stocks: state['stocksReducer'], socket: state['socketReducer'] };
}

export default connect(mapStateToProps)(ParticipantInfo);