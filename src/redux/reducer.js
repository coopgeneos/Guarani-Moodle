import { combineReducers } from 'redux';
import login from './reducers/login';
/*import authUser from './reducers/authUser';*/
import common from './reducers/common';
import configuration from './reducers/configuration';
import { routerReducer } from 'react-router-redux';
export default combineReducers({
  /*articles,
  authUser,*/
  configuration,
  common,
  login,
  router: routerReducer
});