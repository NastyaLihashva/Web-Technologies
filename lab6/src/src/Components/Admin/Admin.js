import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

import ParticipantList from './ParticipantList';
import StocksList from './StocksList';

import brokersAction from '../../store/actionCreators/brokersAction';
import updateStocks from '../../store/actionCreators/stocksAction';
import setSocket from '../../store/actionCreators/socketAction';
import { io } from "socket.io-client";

import { connect } from 'react-redux';
const socket = io("http://localhost:3030", { transports: ['websocket', 'polling', 'flashsocket'] });

const Admin = ({updateBrokers, updateStocks, setSocket}) => {
    React.useEffect(()=>{
        setSocket({ socket: socket });

        socket.on('brokers', (brokersList) => {
            updateBrokers(brokersList);
        });

        socket.on('brokersToAdmin', (brokersList) => {
            updateBrokers(brokersList);
        });

        socket.on('stocksUpload', (stocksList) => {
            updateStocks(stocksList);
        });

    }, []);

    const start = () => {
        socket.emit('startAuc', 123);
    }

    return(
        <div className="admin main">
            <div className="admin__wrapper wrapper">
                <h2 className="title admin__title2">СТРАНИЦА АДМИНИСТРАТОРА</h2>
                <ParticipantList/>
                <StocksList/>
                <Link className="link admin__link" to='/'>В МЕНЮ</Link>
                <button className="link admin__link" onClick={start}>НАЧАТЬ АУКЦИОН</button>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return { brokers: state['brokersReducer'], stocks: state['stocksReducer'], socket: state['socketReducer']};
} 

const actions = {
    ...brokersAction,
    updateStocks,
    setSocket
}

export default connect(mapStateToProps, actions)(Admin);