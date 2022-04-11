const buyStocks = (transaction) => {
    return {
        type: "BUY_STOCKS",
        transaction,
    }
};

const updateBrokers = (brokers) => {
    return {
        type: "UPDATE_BROKERS",
        brokers,
    }
}

const setBroker = (broker) => {
    return {
        type: "SET_BROKER",
        broker,
    }
}

const actionsBroker = {
    buyStocks,
    setBroker,
    updateBrokers
}

export default actionsBroker;