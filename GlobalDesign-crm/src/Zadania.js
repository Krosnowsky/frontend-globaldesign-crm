import React, { useEffect, useState } from 'react';
import TaskRow from './components/TaskRow';
import './style.css';
import { task_endpoint, user_list } from './config';

function Tasks() {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [name, setName] = useState(''); // Stan dla nowego zadania

  // Pobieranie kontaktów
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(task_endpoint);
        if (!response.ok) throw new Error('Błąd w pobieraniu danych');
        const data = await response.json();
        setContacts(data.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Pobieranie użytkowników
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(user_list, {
          headers: { 'authKey': '3692cba751964a334deade13ae868b2ea80eeaa735de470cb76f4a109a5b4656' },
        });
        const data = await response.json();
        setUsers(data || []);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUsers();
  }, []);

  // Obsługa dodawania nowego zadania
  const handleInputBlur = async () => {
    if (name.trim() === '') return; // Jeśli pole jest puste, nic nie robimy

    const newTask = {
      name: name, // Nazwa zadania
      tasksName: name, // Nazwa zadania, która ma się wyświetlać w tabeli
      status: 'none', // Domyślny status
      owner: '', // Domyślny właściciel
      description: '', // Opis
      date: '', // Data
      phone: '', // Telefon
    };

    try {
      // Dodawanie nowego zadania do bazy danych (symulacja z POST)
      const response = await fetch(task_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Błąd przy dodawaniu zadania');

      const data = await response.json(); // Otrzymanie danych zadania z odpowiedzi serwera

      // Po zapisaniu zadania, dodajemy je do stanu
      setContacts((prev) => [data, ...prev]); // Dodajemy zadanie z odpowiedzi serwera, w tym ID
      setName(''); // Resetowanie pola input
    } catch (error) {
      setError(error.message); // Obsługa błędów
    }
  };

  if (loading) return <p>Ładowanie kontaktów...</p>;
  if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>;

  return (
    <div>
      <h2 className='table_title accent-blue'>Zadania</h2>
      <div className="contacts-container accent-blue">
        <table>
          <thead>
            <tr className='title_center'>
              <th></th>
              <th>Nazwa</th>
              <th>Właściciel</th>
              <th>Status</th>
              <th>Opis</th>
              <th>Data</th>
              <th>Telefon</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <TaskRow
                key={contact.Id}
                contact={contact}
                users={users}
                selectedContacts={selectedContacts}
                setSelectedContacts={setSelectedContacts}
                setContacts={setContacts}
              />
            ))}
          </tbody>
          {/* Pole do dodawania nowego zadania */}
          <tr>
            <td colSpan="2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleInputBlur} // Wywołanie po utracie fokusu
                placeholder="+ dodaj zadanie"
                className="add-task-input"
              />
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Tasks;
