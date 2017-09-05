import React, { Component } from 'react';
import store from './redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import {ConnectedRouter} from 'react-router-redux';
import history from './history';

class App extends Component {
  render() {
    return (
      <Provider store = {store}>
        <ConnectedRouter history = {history} >
          <Root />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
