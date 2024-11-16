import React, { useState } from 'react';
import './login.css'; // Importuj plik CSS
import logo from './logo.webp'; // Zastąp 'path/to/logo.png' odpowiednią ścieżką do logo

function Login({ onLogin }) {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://crm.kros-media.pl/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, pass }),
      });
      const data = await response.json();
      console.log('Odpowiedź z backendu:', data); // Sprawdzamy całą odpowiedź z backendu

      if (data.success) {
        setStatus('success');
        setMessage(data.message);

        // Sprawdzamy, czy 'authKey' jest w odpowiedzi i zapisujemy go w cookie
        if (data.authKey) {
          console.log('authKey użytkownika:', data.authKey);
          document.cookie = `authKey=${data.authKey}; path=/; max-age=604800`; // Ustawiamy cookie na 7 dni
        } else {
          console.log('Błąd: authKey jest niezdefiniowane');
        }

        // Sprawdzamy, czy 'userid' jest w odpowiedzi i czy jest liczbą
        if (data.userid !== undefined && Number.isInteger(data.userid)) {
          console.log('ID użytkownika:', data.userid);
          localStorage.setItem('userid', data.userid); // Zapisujemy userid, jeśli jest poprawny
        } else {
          console.log('Błąd: userid jest niezdefiniowane lub nie jest liczbą');
        }

        // Pozostałe dane
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('permissions', data.permissions);
        console.log('Uprawnienia użytkownika:', data.permissions);

        onLogin(true);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      console.log('Błąd podczas logowania:', error);
      setStatus('error');
      setMessage('Błąd podczas logowania');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="logo" /> {/* Dodano logo */}
      <h2>System CRM</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Nazwa użytkownika:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="form-input"
            placeholder="Wprowadź nazwę użytkownika"
          />
        </div>
        <div className="form-group">
          <label>Hasło:</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="form-input"
            placeholder="Wprowadź hasło"
          />
        </div>
        <button type="submit" className="login-button">Zaloguj</button>
      </form>
      
      {message && (
        <p className={`status-message ${status}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;
