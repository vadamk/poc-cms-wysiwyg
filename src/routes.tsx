import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Dashboard from './containers/Dashboard';
import Subjects from './containers/Subjects';
import UpdateSubject from './containers/UpdateSubject';
import Articles from './containers/Articles';
import UpdateArticle from './containers/UpdateArticle';
import Guides from './containers/Guides';
import CommonLayout from './layouts/CommonLayout';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <CommonLayout>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route path="/subjects">
            <Subjects />
          </Route>
          <Route path="/subjects/:slug">
            <UpdateSubject />
          </Route>
          <Route path="/articles">
            <Articles />
          </Route>
          <Route path="/articles/:slug">
            <UpdateArticle />
          </Route>
          <Route path="/guides">
            <Guides />
          </Route>
          <Route path="/articles/:slug">
            <UpdateArticle />
          </Route>
        </CommonLayout>
      </Switch>
    </Router>
  )
}

export default Routes;
