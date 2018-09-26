import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

export function checkAuth() {
    if (localStorage.Auth)
        var token =  JSON.parse(localStorage.Auth).token

    if (!token)
        return false;

    //Todo: Check valid token
    if (token === '12345678')
        return true
}

const PrivateRoute = ({ component: Component, ...rest }) => (

  <Route
    {...rest}

    render={(props,state) => 
      checkAuth(rest) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }

  />
);

export default PrivateRoute;
