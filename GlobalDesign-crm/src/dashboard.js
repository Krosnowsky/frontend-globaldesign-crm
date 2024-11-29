import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faUserCircle, faTasks, faUserPlus, faPowerOff, faLocationDot } from '@fortawesome/free-solid-svg-icons'; 

import Contacts from './Contacts';
import Leads from './Leads';
import Tasks from './Zadania';
import AddUser from './addUsers'; 
import Localization from './localization';

import './style.css'; // Import zewnętrznego pliku CSS

function Dashboard({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('permissions'); 
    onLogout(); 
  };

  const permissions = localStorage.getItem('permissions');

  return (
    <Router>
      <div className="dashboard-container">
        <h2 className='py-5'></h2>
        <p className='version'>Ver. Alfa 0.7.8</p>

        <div className='top-header'>
          <button className='button_logout' onClick={handleLogout}>
            <FontAwesomeIcon className="top-icon" icon={faPowerOff} />
          </button>

          {permissions === 'admin' && (
            <NavLink to="/add-user">
              <FontAwesomeIcon className="top-icon" icon={faUserPlus} />
            </NavLink>
          )}
        </div>

        <div className="dashboard-layout">
          <aside className="sidebar">
            <nav>
              <ul>
                <li>
                  <NavLink 
                    to="/contacts" 
                    className={({ isActive }) => isActive ? 'sidebar-link active-link' : 'sidebar-link'}  // Nowa metoda na dynamiczne przypisanie klasy
                  >
                    <FontAwesomeIcon icon={faAddressBook} /> Kontakty
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/leads" 
                    className={({ isActive }) => isActive ? 'sidebar-link active-link' : 'sidebar-link'}
                  >
                    <FontAwesomeIcon icon={faUserCircle} /> Potencjalne Kontakty
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/tasks" 
                    className={({ isActive }) => isActive ? 'sidebar-link active-link' : 'sidebar-link'}
                  >
                    <FontAwesomeIcon icon={faTasks} /> Zadania
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/localization" 
                    className={({ isActive }) => isActive ? 'sidebar-link active-link' : 'sidebar-link'}
                  >
                    <FontAwesomeIcon icon={faLocationDot} /> Lokalizacje
                  </NavLink>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="main-content">
            <Routes>
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/add-user" element={<AddUser />} /> 
              <Route path="/localization" element={<Localization />} /> 
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default Dashboard;
