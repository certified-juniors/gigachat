import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import chat from './core/slice.js'

import './index.css'

const store = configureStore({
  reducer: chat,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
