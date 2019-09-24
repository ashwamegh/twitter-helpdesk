import React from "react";
import firebase from "firebase";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Auth, TwitterConnect } from "./components";

const PrivateRoute = props => {
  return firebase.auth().currentUser != null ||
    localStorage.getItem("twitterHelpdesk.expectSignIn") ? (
    <Route {...props} />
  ) :
  (
    <Redirect
      to={{
        pathname: "/"
      }}
    />
  );
};

const Routes = () => {
  return (
    <Router>
      <Route exact path="/" component={Auth} />
      <PrivateRoute path="/signedIn" component={TwitterConnect} />
    </Router>
  );
};

export default Routes;
