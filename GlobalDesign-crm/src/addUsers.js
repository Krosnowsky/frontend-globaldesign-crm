import React, { useState } from 'react';

function AddUser() {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [permissions, setPermissions] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://crm.kros-media.pl/add-users.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, pass, permissions }),
      });
      const data = await response.json();
      console.log('Odpowiedź z backendu:', data);

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        // Resetowanie pól formularza po pomyślnym dodaniu
        setLogin('');
        setPass('');
        setPermissions('');
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      console.log('Błąd podczas dodawania użytkownika:', error);
      setStatus('error');
      setMessage('Błąd podczas dodawania użytkownika');
    }
  };

  return (
    <div>
      <h2>Dodaj Użytkownika</h2>
      <form onSubmit={handleAddUser}>
        <div>
          <label>Nazwa użytkownika:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hasło:</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Uprawnienia:</label>
          <input
            type="text"
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            required
          />
        </div>
        <button type="submit">Dodaj Użytkownika</button>
      </form>

      {message && (
        <p style={{ color: status === 'success' ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddUser;
