import React from 'react';
const ParticipantStock = ({amount, name}) => (
    <div className='participants__stock'>
        <p className="participants__text">{name}</p>
        <p className="participants__text">{amount}</p>
    </div>
);
export default ParticipantStock;