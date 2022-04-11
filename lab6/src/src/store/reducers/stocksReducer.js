import { List } from "immutable";

const stocksReducer = (state = List(), action) => {
    switch(action.type){
        case 'UPDATE_STOCKS':
            return action.stocks;
        case 'CHANGE_AMOUNT':
            return state.map((stock) => {
                if (stock.name === action.transaction.stock) {
                    stock.amount -= action.transaction.amount;
                }
                return stock;
            });
        default:
            return state;
    }
};

export default stocksReducer;