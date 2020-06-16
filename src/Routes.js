import React from "react";
// using ES6 modules
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/login";
import App from "./App";

function Routes() {
  return(
      <Router>
        <Switch>
          <Route path={'/'} component={App} />
          <Route path={'/login'} component={Login} />
        </Switch>
      </Router>
  )
}

export default Routes;