import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TodoPage from './TodoPage';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import Splash from './Splash';
import '../css/App.css';

const App = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/todo" component={TodoPage} />
      <Route exact path="/splash" component={Splash} />
    </Switch>
  </main>
);


export default App;
