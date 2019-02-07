import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import PrivateRoute from './utils/requireAuth'
import { ClipLoader } from 'react-spinners';

import Configuration from './components/Configuration'
import Header from './components/Header'
import Login from './components/Login'
import Activities from './components/Activities'
import MoodleConfig from './components/MoodleConfig'
import Synchronizations from './components/Synchronizations'
import Profile from './components/Profile'

import { Grid } from 'react-bootstrap';
import {NotificationContainer} from 'react-notifications';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-notifications/lib/notifications.css';
import './App.css';


const mapStateToProps = state => {
        return {
          isAuth: state.login.isAuth,
          isLoading: state.common.appLoading !== 0
      }
    }

class App extends Component {

  render() {
    return (
      <div className="app">
        { this.props.isLoading ?
        <div id="loading-spinner" >
            <ClipLoader
              sizeUnit={"px"}
              size={200}
              color={'#777'}
              loading={this.props.isLoading}
            /> 
        </div> : '' }
        { this.props.isAuth ? <Header /> : '' }
        <Grid>
          <Switch>                
              <Route exact path="/" component={Login} />
              <PrivateRoute path="/configuration" component={Configuration} />
              <PrivateRoute path="/moodle-config" component={MoodleConfig} />
              <PrivateRoute path="/activities" component={Activities} />
              <PrivateRoute path="/synchronizations" component={Synchronizations} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/*" component={Profile} />
          </Switch>
        </Grid>
         <NotificationContainer/>
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(App);