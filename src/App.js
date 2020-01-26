import React from 'react';
import './App.css';
import logo from './assets/logo.svg';
import logoico from './assets/logo.ico'
import Routes from './routes';
import Favicon from 'react-favicon';


function App() {
  return (
    <div className="container">
      <Favicon url={logoico}/>
      <img src={logo} alt='AirCnC'/>
        <div className="content">
          <Routes/>
        </div>
    </div>
  );
}

export default App;
