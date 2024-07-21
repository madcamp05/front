import React from 'react';
import { Route, Switch } from 'react-router-dom';
import BeforeLogin from './BeforeLogin';
import AfterLogin from './AfterLogin';

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={BeforeLogin} />
      <Route path="/room" component={AfterLogin} />
    </Switch>
  </div>
);

export default App;
