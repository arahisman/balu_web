import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux'
import App from './App'
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
          <App />
        </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);