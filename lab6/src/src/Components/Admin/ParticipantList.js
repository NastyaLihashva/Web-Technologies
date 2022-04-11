import React from "react";
import ParticipantItem from "./ParticipantItem";
import { connect } from "react-redux";

const ParticipantList = ({brokers}) => (
    <div className="admin__item participants">
        <h3 className="admin__title subtitle">Список участников</h3>
        <div className="participants__wrapper">
            {
                brokers.map((broker, index) => {
                    return <ParticipantItem key={index} broker={broker}/>
                })
            }
        </div>
    </div>
);

const mapStateToProps = (state) => {
    return {brokers: state["brokersReducer"]}
}

export default connect(mapStateToProps)(ParticipantList);