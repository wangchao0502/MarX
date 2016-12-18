import React  from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const View = () => (
  <Router history={browserHistory}>
    <Route path="/">
      <IndexRoute component={LoginForm} />
      <Route path="login" component={LoginForm} />
      <Route path="register" component={RegisterForm} />
    </Route>
  </Router>
);

export default View;
