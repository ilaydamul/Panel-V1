import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Tema (İstediğin temayı seçebilirsin)
import 'primereact/resources/primereact.min.css';  // PrimeReact bileşen stilleri
import 'primeicons/primeicons.css';  // PrimeReact ikonları
import 'primeflex/primeflex.css';  // PrimeFlex (Gelişmiş Grid ve Layout)
// import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css';


import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <App />
  //</React.StrictMode> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals