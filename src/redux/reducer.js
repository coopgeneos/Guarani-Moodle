import { combineReducers } from 'redux';
import login from './reducers/login';
import activity from './reducers/activity';
import category from './reducers/category';
import sync from './reducers/sync';
/*import authUser from './reducers/authUser';*/
import common from './reducers/common';
import configuration from './reducers/configuration';
import { routerReducer } from 'react-router-redux';
export default combineReducers({
  /*articles,
  authUser,*/
  configuration,
  activity,
  category,
  sync,
  common,
  login,
  router: routerReducer
});