import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import Dashboard from 'components/Dashboard';
import SignIn from 'components/SignIn';
import Subjects from 'components/Subjects';
import Articles from 'components/Articles';
import CreateArticle from 'components/CreateArticle';
import UpdateArticle from 'components/UpdateArticle';
import Guides from 'components/Guides';
import CommonLayout from './components/CommonLayout';
import PureLayout from 'components/PureLayout';

const GET_AUTHORIZED = gql`
  query IsAuthorized {
    isAuthorized @client
  }
`;

interface PrivatRouteProp extends RouteProps {
  allow?: boolean;
  redirect?: string;
}

const CustomRoute = ({ children, allow = true, redirect, ...rest }: PrivatRouteProp) => {
  const routeComponent = () =>
    allow ? children : <Redirect to={{ pathname: redirect || '/login' }} />;
  return <Route {...rest} render={routeComponent} />;
};

const Routes = () => {
  const { data } = useQuery(GET_AUTHORIZED);

  return (
    <Router>
      <Switch>
        <CustomRoute exact path="/login" redirect="/" allow={!data.isAuthorized}>
          <PureLayout>
            <SignIn />
          </PureLayout>
        </CustomRoute>
        <CustomRoute path="/" allow={data.isAuthorized}>
          <CommonLayout>
            <Switch>
              <CustomRoute exact path="/">
                <Dashboard />
              </CustomRoute>
              <CustomRoute exact path="/subjects">
                <Subjects />
              </CustomRoute>
              <CustomRoute exact path="/articles">
                <Articles />
              </CustomRoute>
              <Switch>
                <CustomRoute exact path="/articles/create">
                  <CreateArticle />
                </CustomRoute>
                <CustomRoute path="/articles/:slug">
                  <UpdateArticle />
                </CustomRoute>
              </Switch>
              <CustomRoute exact path="/guides">
                <Guides />
              </CustomRoute>
              <CustomRoute path="/guides/:slug">
                <UpdateArticle />
              </CustomRoute>
            </Switch>
          </CommonLayout>
        </CustomRoute>
      </Switch>
    </Router>
  )
}

export default Routes;
