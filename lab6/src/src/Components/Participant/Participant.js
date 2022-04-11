import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import './Participant.css';

import ParticipantInfo from './ParticipantInfo';
import StocksList from './StocksList';
import ModalBuy from '../Modals/ModalBuy';

import brokersAction from '../../store/actionCreators/brokersAction';
import updateStocks from '../../store/actionCreators/stocksAction';
import uiAction from '../../store/actionCreators/uiAction';

import { connect } from 'react-redux';
import setSocket from '../../store/actionCreators/socketAction';
import { io } from "socket.io-client";

const socketCreate = io("http://localhost:3030", { transports: ['websocket', 'polling', 'flashsocket'] });

const Participant = ({ setBroker, updateStocks, setSocket, triggerAuction }) => {
    let params = useParams();

    React.useEffect(() => {
        setSocket({ socket: socketCreate }); //устанавливаем сокет

        socketCreate.on('brokers', (brokersList) => {
            brokersList = brokersList.filter(broker => broker.name === params.name); //ищем текущего участника
            setBroker(brokersList[0]); //устанавливаем
        });

        socketCreate.on('stocksUpload', (stocksList) => {
            updateStocks(stocksList);
        });

        socketCreate.on('info', (inf) => {
            alert(inf);
        });

        socketCreate.on('canBuy', (flag) => {
            triggerAuction(flag);
        });
    }, []);

    

    return (
        <div className="participant main">
            <div className="participant__wrapper wrapper">
                <ParticipantInfo />
                <StocksList />
                <Link className="link participant__link" to='/'>В МЕНЮ</Link>
            </div>
            <ModalBuy />
        </div>
    );
}

const mapStateToProps = (state) => {
    return { brokers: state['brokersReducer'], stocks: state['stocksReducer'], socket: state['socketReducer'] };
} 

const actions = {
    ...brokersAction,
    updateStocks,
    setSocket,
    ...uiAction
}

export default connect(mapStateToProps, actions)(Participant);