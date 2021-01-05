import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {ChakraProvider} from '@chakra-ui/react';
import './index.css';
import App from './App';
import configureStore from "./store";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
