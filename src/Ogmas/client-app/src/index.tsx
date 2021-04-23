import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import teal from '@material-ui/core/colors/teal';
import { ThemeProvider } from '@material-ui/core/styles';

const baseUrl = document.getElementsByTagName('base')[0]?.getAttribute('href') || "https://localhost:5001";

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: teal
  }
})

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
