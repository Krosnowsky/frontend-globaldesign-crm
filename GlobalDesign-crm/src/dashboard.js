import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faUserCircle, faTasks, faUserPlus,faPowerOff } from '@fortawesome/free-solid-svg-icons'; // Importowanie ikon

import Contacts from './Contacts';
import Leads from './Leads';
import Tasks from './Zadania';
import AddUser from './addUsers'; // Importuj komponent AddUser

function Dashboard({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Usuwanie statusu logowania
    localStorage.removeItem('permissions'); // Usunięcie uprawnień z localStorage
    onLogout(); // Aktualizacja stanu w głównym komponencie
  };

  // Odczyt uprawnień z localStorage
  const permissions = localStorage.getItem('permissions');

  return (
    <Router>
      <div className="dashboard-container">
        <h2 className='py-5'></h2>
        <p className='version'>Ver. Alfa 0.2.4</p>


        <div className='top-header'>
          <button className='button_logout' onClick={handleLogout}><FontAwesomeIcon className="top-icon" icon={faPowerOff} /></button>
          
          {/* Sprawdzenie uprawnień przed wyświetleniem przycisku */}
          {permissions === 'admin' && (
            <Link to="/add-user">
              
              <FontAwesomeIcon className="top-icon" icon={faUserPlus} />
            </Link>
          )}
        </div>

        <div className="dashboard-layout">
          <aside className="sidebar">
            <nav>
              <ul>
                <li>
                  <Link className="sidebar-link" to="/contacts">
                    <FontAwesomeIcon icon={faAddressBook} /> Kontakty
                  </Link>
                </li>
                <li>
                  <Link className="sidebar-link" to="/leads">
                    <FontAwesomeIcon icon={faUserCircle} />Leady
                  </Link>
                </li>
                <li>
                  <Link  className="sidebar-link" to="/tasks">
                    <FontAwesomeIcon icon={faTasks} /> Zadania
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="main-content">
            <Routes>
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/add-user" element={<AddUser />} /> {/* Trasa do komponentu AddUser */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default Dashboard;
