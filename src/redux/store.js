import reducer from './reducer';
import { createStore,applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
//Redux Thunk middleware allows you to write action creators that return a function instead of an action. 
import thunk from 'redux-thunk'


export const history = createHistory();
export const store = createStore(reducer,applyMiddleware(thunk));