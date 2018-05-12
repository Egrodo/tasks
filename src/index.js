import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import Landing from './components/Landing';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Fragment>
    <Landing />
  </Fragment>,
  document.getElementById('root'),
);

registerServiceWorker();
