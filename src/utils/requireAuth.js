import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

const mapStateToProps = state => {
        return {
          isAuth: state.login.isAuth,
      }
    }

const PrivateRoute = ({ component: Component, isAuth,...rest }) => (
  <Route
    {...rest}

    render={(props,state) => 
      isAuth ? (
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

export default connect(mapStateToProps, {})(PrivateRoute);