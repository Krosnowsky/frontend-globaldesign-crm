import React, { useEffect, useState } from 'react';
import './style.css'; // Importuj plik CSS

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState(''); // Stan dla telefonu
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingMail, setEditingMail] = useState('');
  const [editingPhone, setEditingPhone] = useState(''); // Stan dla edytowanego telefonu
  const [editingStatus, setEditingStatus] = useState('none'); // Stan dla edytowanego statusu

  // Fetchowanie danych kontaktów z API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('https://crm.kros-media.pl/contacts.php');
        if (!response.ok) {
          throw new Error('Błąd w pobieraniu danych');
        }
        const data = await response.json();
        if (data && data.data) {
          setContacts(data.data);
        } else {
          throw new Error('Nieprawidłowe dane');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Dodawanie nowego kontaktu po zejściu focusu z pola Telefon
  const handleAddContact = async () => {
    if (!name || !mail || !phone) return; // Upewnij się, że pola są wypełnione
    try {
      const response = await fetch('https://crm.kros-media.pl/contacts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactname: name, mail, phone, status: 'none' }), // Dodaj status
      });
      const data = await response.json();

      if (data.success) {
        setContacts((prevContacts) => [...prevContacts, { contactname: name, mail, phone, Id: data.newId, status: 'none' }]);
        setName('');
        setMail('');
        setPhone(''); // Resetowanie pola telefonu
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas dodawania kontaktu.');
    }
  };

  // Obsługuje zmianę wyboru kontaktu (zaznaczenie/odznaczenie)
  const handleSelectContact = (id) => {
    const updatedSelectedContacts = new Set(selectedContacts);
    if (updatedSelectedContacts.has(id)) {
      updatedSelectedContacts.delete(id);
    } else {
      updatedSelectedContacts.add(id);
    }
    setSelectedContacts(updatedSelectedContacts);
  };

  // Usuwanie zaznaczonych kontaktów
  const handleDeleteContacts = async () => {
    const idsToDelete = Array.from(selectedContacts);
    if (idsToDelete.length === 0) {
      setError('Nie zaznaczone żadnego kontaktu do usunięcia.');
      return;
    }

    try {
      const response = await fetch('https://crm.kros-media.pl/contacts.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const data = await response.json();

      if (data.success) {
        setContacts((prevContacts) => prevContacts.filter(contact => !idsToDelete.includes(contact.Id)));
        setSelectedContacts(new Set());
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas usuwania kontaktów.');
    }
  };

  // Edytowanie kontaktu
  const handleEditContact = (contact) => {
    if (editingContactId === contact.Id) {
      setEditingContactId(null); // Jeśli kontakt już edytujemy, zakończ edycję
    } else {
      setEditingContactId(contact.Id);
      setEditingName(contact.contactname);
      setEditingMail(contact.mail);
      setEditingPhone(contact.phone); // Ustawienie edytowanego telefonu
      setEditingStatus(contact.status); // Ustawienie edytowanego statusu
    }
  };

  // Aktualizacja kontaktu
  const handleUpdateContact = async (id) => {
    try {
      const response = await fetch('https://crm.kros-media.pl/contacts.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, contactname: editingName, mail: editingMail, phone: editingPhone, status: editingStatus }),
      });
      const data = await response.json();

      if (data.success) {
        setContacts((prevContacts) =>
          prevContacts.map(contact =>
            contact.Id === id ? { ...contact, contactname: editingName, mail: editingMail, phone: editingPhone, status: editingStatus } : contact
          )
        );
        setEditingContactId(null);
        setEditingName('');
        setEditingMail('');
        setEditingPhone('');
        setEditingStatus('none');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas aktualizacji kontaktu.');
    }
  };

  // Funkcja obsługująca zmianę koloru tabeli po edycji
  const getTableRowClass = (contactId) => {
    return editingContactId === contactId ? 'editing-row' : '';
  };

  if (loading) {
    return <p>Ładowanie kontaktów...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Błąd: {error}</p>;
  }

  return (
    <div>
    <h2 className='table_title'>Kontakty</h2>
    <div className="contacts-container">
      <table>
        <thead>
          <tr>
            <th className="checkbox-column"></th>
            <th>Nazwa</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.Id} className={getTableRowClass(contact.Id)}>
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
                  value={editingContactId === contact.Id ? editingName : contact.contactname}
                  onChange={(e) => setEditingName(e.target.value)}
                  onFocus={() => handleEditContact(contact)} 
                  onBlur={() => handleUpdateContact(contact.Id)} 
                />
              </td>
              <td>
                <input
                  type="email"
                  value={editingContactId === contact.Id ? editingMail : contact.mail}
                  onChange={(e) => setEditingMail(e.target.value)}
                  onFocus={() => handleEditContact(contact)} 
                  onBlur={() => handleUpdateContact(contact.Id)} 
                />
              </td>
              <td>
                <input
                  type="tel"
                  value={editingContactId === contact.Id ? editingPhone : contact.phone}
                  onChange={(e) => setEditingPhone(e.target.value)}
                  onFocus={() => handleEditContact(contact)} 
                  onBlur={() => handleUpdateContact(contact.Id)} 
                />
              </td>
              <td>
                <select
                  value={editingContactId === contact.Id ? editingStatus : contact.status}
                  onChange={(e) => setEditingStatus(e.target.value)}
                  onFocus={() => handleEditContact(contact)} 
                  onBlur={() => handleUpdateContact(contact.Id)} 
                >
                  <option value="none">none</option>
                  <option value="zrobione">zrobione</option>
                  <option value="wstrzymane">wstrzymane</option>
                </select>
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="+ dodaj kontakt"
              />
            </td>
            {name && (
              <>
                <td>
                  <input
                    type="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    placeholder="Email"
                  />
                </td>
                <td>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Telefon"
                  />
                </td>
                <td>
                  <button onClick={handleAddContact}>Dodaj</button>
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>

      {selectedContacts.size > 0 && (
        <button className="delete-button" onClick={handleDeleteContacts}>
          Usuń wybrane kontakty
        </button>
      )}
    </div>
    </div>
  );
}

export default Contacts;
