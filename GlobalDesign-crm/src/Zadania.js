import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './style.css';

function Tasks() {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]); // Lista użytkowników
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');  // Zmieniono phone na date
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('https://crm.kros-media.pl/tasks.php');
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authKey = '3692cba751964a334deade13ae868b2ea80eeaa735de470cb76f4a109a5b4656'; // Zastąp wartością authKey, który chcesz wysłać w nagłówku
  
        const response = await fetch('https://crm.kros-media.pl/list_users.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authKey': authKey // Wysyłanie authKey w nagłówku
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text(); // Zbieranie treści odpowiedzi w przypadku błędu
          throw new Error(`Błąd ${response.status}: ${response.statusText}, ${errorText}`);
        }
  
        const data = await response.json();
        setUsers(data || []);
      } catch (error) {
        console.error("Szczegóły błędu pobierania użytkowników:", error);
        setError(error.message);
      }
    };
  
    fetchUsers();
  }, []);

  const handleAddContact = async () => {
    if (!name) return;  // Dodajemy tylko nazwę zadania
    try {
      const response = await fetch('https://crm.kros-media.pl/tasks.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasksName: name, description, date, status: 'none' }),  // Zmieniono phone na date
      });
      const data = await response.json();

      if (data.success) {
        setContacts(prev => [...prev, { tasksName: name, description, date, Id: data.newId, status: 'none' }]);  // Zmieniono phone na date
        setName('');  // Resetowanie tylko nazwy
        setDescription('');  // Resetowanie opisu
        setDate('');  // Resetowanie daty
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas dodawania kontaktu.');
    }
  };

  const handleInputBlur = () => {
    if (name) {
      handleAddContact();
    }
  };

  const handleSelectContact = (id) => {
    setSelectedContacts(prev => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleDeleteContacts = async () => {
    const idsToDelete = Array.from(selectedContacts);
    if (idsToDelete.length === 0) {
      setError('Nie zaznaczono żadnego kontaktu do usunięcia.');
      return;
    }

    try {
      const response = await fetch('https://crm.kros-media.pl/tasks.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const data = await response.json();

      if (data.success) {
        setContacts(prev => prev.filter(contact => !idsToDelete.includes(contact.Id)));
        setSelectedContacts(new Set());
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas usuwania kontaktów.');
    }
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.Id);
    setEditingValues({
      tasksName: contact.tasksName,
      description: contact.description,
      date: contact.date,  // Zmieniono phone na date
      status: contact.status,
      owner: contact.owner,
    });
  };

  const handleUpdateContact = async (id) => {
    if (!editingContactId) return;
  
    const originalContact = contacts.find(contact => contact.Id === id);
    const updates = Object.entries(editingValues).reduce((acc, [key, value]) => {
      if (value !== originalContact[key]) {
        acc[key] = value;
      }
      return acc;
    }, {});
  
    if (Object.keys(updates).length === 0) {
      setEditingContactId(null);
      setEditingValues({});
      return;
    }
  
    try {
      const response = await fetch('https://crm.kros-media.pl/tasks.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await response.json();
  
      if (data.success) {
        setContacts(prev =>
          prev.map(contact => 
            contact.Id === id ? { ...contact, ...updates } : contact
          )
        );
        setEditingContactId(null);
        setEditingValues({});
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas aktualizacji kontaktu.');
    }
  };

  if (loading) return <p>Ładowanie kontaktów...</p>;
  if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>;

  return (
    <div>
      <h2 className='table_title tasks'>Zadania</h2>
      <div className="contacts-container tasks">
        <table>
          <thead>
            <tr>
              <th className="checkbox-column"></th>
              <th>Nazwa</th>
              <th>Właściciel</th>
              <th>Opis</th>
              <th>Data</th>  {/* Zmieniono z "Telefon" na "Data" */}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.Id}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedContacts.has(contact.Id)}
                    onChange={() => handleSelectContact(contact.Id)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingContactId === contact.Id ? editingValues.tasksName : contact.tasksName}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, tasksName: e.target.value }))}
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  />
                </td>
                <td>
                  <select
                    value={editingContactId === contact.Id ? editingValues.owner : contact.owner || ''}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, owner: e.target.value }))}
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  >
                    <option value="">wybierz</option>
                    {users.map((user) => (
                      <option key={user.login} value={user.login}>{user.login}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={editingContactId === contact.Id ? editingValues.description : contact.description}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, description: e.target.value }))}
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={editingContactId === contact.Id ? editingValues.date : contact.date}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, date: e.target.value }))}
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  />
                </td>
                <td>
                  <select
                    value={editingContactId === contact.Id ? editingValues.status : contact.status}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, status: e.target.value }))}
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  >
                    <option value="none">Wybierz status</option>
                    <option value="done">Zakończono</option>
                    <option value="inProgress">W trakcie</option>
                  </select>
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td>
                <input
                  type="text"
                  placeholder="Dodaj zadanie +"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleInputBlur}  // Dodajemy zadanie po zgaszeniu inputa
                />
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
        {selectedContacts.size > 0 && (
          <div className='button_edit-holder' style={{ marginTop: '20px' }}>
            <button className='trash_btn' onClick={handleDeleteContacts}><FontAwesomeIcon icon={faTrash} /> <br /> Usuń</button>
          </div>
        )}
    </div>
  );
}

export default Tasks;
