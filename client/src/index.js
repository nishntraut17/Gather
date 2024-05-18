import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from './redux/store';
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from 'react-router-dom';
import { SocketContextProvider } from './context/SocketContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ChakraProvider>
      <BrowserRouter>
        <SocketContextProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </SocketContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </Provider>
);

