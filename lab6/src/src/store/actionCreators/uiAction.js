const setDefault = () => { //типы для открытия модального окна
    return {type: "SET_DEFAULT"}
}

const toggleBuyModal = () => {
    return {type: "TOGGLE_BUY"};
}

const toggleSellModal = () => {
    return { type: "TOGGLE_SELL" };
}

const toggleLogModal = () => {
    return { type: "TOGGLE_LOG" };
}

const setStockType = (stockType) => {
    return {
        type: "SET_TYPE",
        stockType: stockType
    }
}

const triggerAuction = (flag) => {
    return {
        type: "TRIGGER_AUCTION",
        flag: flag
    }
}


const uiAction = {
    toggleBuyModal,
    toggleSellModal,
    toggleLogModal,
    setStockType,
    setDefault,
    triggerAuction
}

export default uiAction;