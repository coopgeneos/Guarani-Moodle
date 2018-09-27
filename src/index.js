import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { getUser } from './redux/actions/actions';

import {store, history} from './redux/store';


if (sessionStorage.ISGMAuth){
	//Is user alredy in session then SET
    try {
        const userData = JSON.parse(localStorage.ISGMAuth);
        store.dispatch({type: 'SET_USER', userData: userData});
        //Refresh user data
        console.log('Get User');
        var userID = userData.I_User_id;
        store.dispatch(getUser(userID))
    }
    catch (e) {
        //If error parsing JSON
        store.dispatch({type: 'UNSET_USER'});
    }
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

//registerServiceWorker();
