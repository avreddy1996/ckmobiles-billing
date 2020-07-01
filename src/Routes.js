import React from "react";
// using ES6 modules
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/login";
import Home from "./Home";
import App from "./App";

function Routes() {
  return(
      <Router>
        <Route exact path={'/'} component={Home} />
        <Route path={'/:id(cv|cc)/'} component={App} />
        <Route path={'/login'} component={Login} />
      </Router>
  )
}

export default Routes;