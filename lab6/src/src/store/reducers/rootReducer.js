import brokersReducer from './brokersReducer';
import stocksReducer from './stocksReducer';
import uiReducer from './uiReducer';
import socketReducer from './socketReducer';
import { combineReducers } from 'redux';


const rootReducer = combineReducers({ brokersReducer, stocksReducer, uiReducer, socketReducer});

export default rootReducer;