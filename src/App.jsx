
import { Outlet } from 'react-router-dom';
import React from 'react';
import { NavBar } from './components/navBar/NavBar';
import Footer from './components/footer/Footer';
import './App.scss';

export const App = () => {
  return (
    <div className="App">
      <NavBar />
      <div className="conten"> 
        <Outlet />
      </div>
      <Footer />
    </div >
  );
};

export default App;
