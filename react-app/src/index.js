import React from 'react';
import ReactDOM from 'react-dom';
import {ChakraProvider} from '@chakra-ui/react';
import theme from "./style";
import './index.css';
import App from './App';


ReactDOM.render(
  <React.StrictMode>
      <ChakraProvider theme={theme}>
          <App />
      </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
