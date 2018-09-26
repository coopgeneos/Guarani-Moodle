import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { getUser } from './redux/actions/actions';
import { checkAuth } from './utils/requireAuth'

import {store, history} from './redux/store';

if (checkAuth()){
	//Is user alredy in session then SET
    store.dispatch({type: 'SET_USER', userData: JSON.parse(localStorage.Auth)});
    var token = JSON.parse(localStorage.Auth).token
    getUser(token)/*.then((res) => {
        store.dispatch({type: 'SET_USER', userData: res})
    })*/

}

ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        </ConnectedRouter>
    </Provider>
), document.getElementById('root'));

registerServiceWorker();
