import React from 'react';
import './Modal.css';

import { connect } from 'react-redux';
import {Link} from "react-router-dom";

const ModalLog = ({ui}) => {
    const brokers = ['Андрей', 'Елена', 'Иван'];
    const [name, setName] = React.useState('');
    const linkParticipant = (e) => {
        e.preventDefault();
        let flag = false;
        brokers.forEach(broker => {
            console.log(broker.name, name);
            if(broker === name)
                flag = true;
        });
        if(flag){
            window.location.href = window.location.href + `participant/${name}`;
        } else {alert("Такого имени нет в списке участников!")}
    }


    return (<div className='modal__overlay' style={{ display: ui.get('isModalLogOpen') ? 'flex' : 'none' }}>
        <div className="modal">
            <p className="modal__title">Введите имя</p>
            <form className="modal__form" id="buy__form" onSubmit={linkParticipant}>
                <input onChange={e => setName(e.target.value)} className="modal__input" type="text" placeholder={'Имя пользователя'} />
                <button type='submit' className="btn modal__btn">Войти</button>
            </form>
        </div>
    </div>
)};

const mapStateToProps = (state) => {
    return { ui: state['uiReducer'] }
}

export default connect(mapStateToProps)(ModalLog);