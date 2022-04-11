import { List } from "immutable";

const brokersReducer = (state = List(), action) => {
    switch (action.type) {
        case "BUY_STOCKS": //в зависимости от типа действий выполняет что-то
            return state.map((broker)=>{ //меняем состояние
                broker[action.transaction.stock] += action.transaction.amount; //увеличиваем кол-во акций
                broker.budget -= action.transaction.price; //уменьшаем бюджет
                return broker;
            });
        case "UPDATE_BROKERS": //отправка всех брокеров
            return action.brokers;
        case "SET_BROKER": //отправка одного брокера
            return state.set(0, action.broker);
        default:
            return state;
    }
}
export default brokersReducer;