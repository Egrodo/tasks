import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TodoPage from './TodoPage';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import Splash from './Splash';
import notFound from './notFound';
import '../css/App.css';

const App = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/app" component={Splash} />
      <Route exact path="/todo" component={TodoPage} />
      <Route path="/" component={notFound} />
    </Switch>
  </main>
);

/*
<Route exact path="/" render={() => (
  loggedIn ? (
    <Redirect to="/dashboard"/>
  ) : (
    <PublicHomePage/>
  )
)}/>
*/
export default App;
