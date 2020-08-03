import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import CommonLayout from './components/CommonLayout';
import PureLayout from 'components/PureLayout';

import SignIn from 'components/SignIn';
import Subjects from 'components/Subjects';
import Articles from 'components/Articles';
import CreateArticle from 'components/CreateArticle';
import UpdateArticle from 'components/UpdateArticle';
import Guides from 'components/Guides';
import CreateGuide from 'components/CreateGuide';
import UpdateGuide from 'components/UpdateGuide';
import SortSubjects from 'components/SortSubjects';

const GET_AUTHORIZED = gql`
  query IsAuthorized {
    isAuthorized @client
    enAudiences: getAudiences(language: "en") {
      id
      title
      language
    }
    svAudiences: getAudiences(language: "sv") {
      id
      title
      language
    }
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
              <Route exact path="/">
                <Redirect to="/subjects" />
              </Route>
              <Route exact path="/subjects">
                <Subjects />
              </Route>
              <Route exact path="/subjects/sort">
                <SortSubjects />
              </Route>
              <Switch>
                <Route exact path="/guides">
                  <Guides />
                </Route>
                <Route exact path="/guides/create">
                  <CreateGuide />
                </Route>
                <Route path="/guides/:slug">
                  <UpdateGuide />
                </Route>
                <Route exact path="/articles">
                  <Articles />
                </Route>
                <Route exact path="/articles/create">
                  <CreateArticle />
                </Route>
                <Route path="/articles/:slug">
                  <UpdateArticle />
                </Route>
              </Switch>
            </Switch>
          </CommonLayout>
        </CustomRoute>
      </Switch>
    </Router>
  );
};

export default Routes;
