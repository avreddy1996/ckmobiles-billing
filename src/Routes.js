import React from "react";
// using ES6 modules
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/login";
import App from "./App";

function Routes() {
  return(
      <Router>
        <Route path={'/'} component={App} />
        <Route path={'/login'} component={Login} />
      </Router>
  )
}

export default Routes;