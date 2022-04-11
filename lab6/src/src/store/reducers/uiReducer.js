import { Map } from "immutable";

const uiReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'SET_DEFAULT':
            return state.set('isModalBuyOpen', false)
                .set('isModalSellOpen', false)
                .set('isModalLogOpen', false)
                .set('openStockType', 'buy')
                .set('isAuctionStarted', false);
        case 'TOGGLE_BUY':
            return state.update("isModalBuyOpen", val => !val); //меняет переменные (открыть или закрыть окно)
        case 'TOGGLE_SELL':
            return state.update("isModalSellOpen", val => !val);
        case 'TOGGLE_LOG':
            return state.update("isModalLogOpen", val => !val);
        case 'SET_TYPE':
            return state.set("openStockType", action.stockType); //тип модального окна
        case 'TRIGGER_AUCTION':
            return state.set("isAuctionStarted", action.flag);
        default:
            return state;
    }
};

export default uiReducer;