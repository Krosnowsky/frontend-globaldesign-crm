import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './style.css';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  
  const [newContact, setNewContact] = useState({
    contactname: '',
    mail: '',
    phone: '',
    comments: '',
    region: '',
  });
  const [addStep, setAddStep] = useState(0);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('https://crm.kros-media.pl/contacts.php');
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

  const handleAddContact = async () => {
    // Sprawdź tylko, czy podano imię
    if (!newContact.contactname) {
      setError("Imię jest wymagane.");
      return;
    }
    try {
      const response = await fetch('https://crm.kros-media.pl/contacts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newContact, status: 'none' }),
      });
      const data = await response.json();
  
      if (data.success) {
        setContacts((prev) => [
          ...prev,
          { ...newContact, Id: data.newId, status: 'none' },
        ]);
        setNewContact((prev) => ({
          ...prev,
          contactname: '', // Zresetuj tylko imię
        }));
        setAddStep(1); // Przejdź do kolejnego kroku
        setError(null); // Wyczyść ewentualny poprzedni błąd
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas dodawania kontaktu.');
    }
  };
  

  const handleInputBlur = (step) => {
    if (step === 0) {
      handleAddContact();
    } else {
      setAddStep((prev) => prev + 1);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.Id);
    setEditingValues({
      contactname: contact.contactname,
      mail: contact.mail,
      phone: contact.phone,
      comments: contact.comments,
      region: contact.region,
      status: contact.status,
    });
  };

  const handleUpdateContact = async (id) => {
    if (!editingContactId) return;

    try {
      const response = await fetch('https://crm.kros-media.pl/contacts.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editingValues }),
      });
      const data = await response.json();

      if (data.success) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact.Id === id ? { ...contact, ...editingValues } : contact
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

  const handleDeleteSelectedContacts = async () => {
    const idsToDelete = Array.from(selectedContacts);
    try {
      const response = await fetch('https://crm.kros-media.pl/contacts.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const data = await response.json();

      if (data.success) {
        setContacts((prev) =>
          prev.filter((contact) => !selectedContacts.has(contact.Id))
        );
        setSelectedContacts(new Set());
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas usuwania kontaktów.');
    }
  };

  if (loading) return <p>Ładowanie kontaktów...</p>;
  if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>;

  return (
    <div>
      <h2 className="table_title contacts">Kontakty</h2>
      <div className="contacts-container contacts">
        <table>
          <thead>
            <tr>
              <th className="checkbox-column"></th>
              <th>Imię</th>
              <th>Status</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Region</th>
              <th>Komentarz</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.Id}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedContacts.has(contact.Id)}
                    onChange={() =>
                      setSelectedContacts((prev) => {
                        const updated = new Set(prev);
                        updated.has(contact.Id)
                          ? updated.delete(contact.Id)
                          : updated.add(contact.Id);
                        return updated;
                      })
                    }
                  />
                </td>
                {/* contactname */}
                <td>
                  <input
                    type="text"
                    value={
                      editingContactId === contact.Id
                        ? editingValues.contactname
                        : contact.contactname
                    }
                    onChange={(e) =>
                      setEditingValues((prev) => ({
                        ...prev,
                        contactname: e.target.value,
                      }))
                    }
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  />
                </td>

                {/* status */}
                <td>
                  <select
                    value={
                      editingContactId === contact.Id
                        ? editingValues.status
                        : contact.status
                    }
                    onChange={(e) =>
                      setEditingValues((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  >
                    <option value="none">Brak</option>
                    <option value="aktywny">Aktywny</option>
                    <option value="nieaktywny">Nieaktywny</option>
                  </select>
                </td>
                {/* mail */}
                <td>
                  <input
                    type="email"
                    value={
                      editingContactId === contact.Id
                        ? editingValues.mail
                        : contact.mail
                    }
                    onChange={(e) =>
                      setEditingValues((prev) => ({
                        ...prev,
                        mail: e.target.value,
                      }))
                    }
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  />
                </td>
                {/* telefon */}
                <td>
                  <input
                    type="tel"
                    value={
                      editingContactId === contact.Id
                        ? editingValues.phone
                        : contact.phone
                    }
                    onChange={(e) =>
                      setEditingValues((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  />
                </td>
                
                {/* region */}
                <td>
                  <input
                    type="text"
                    value={
                      editingContactId === contact.Id
                        ? editingValues.region
                        : contact.region
                    }
                    onChange={(e) =>
                      setEditingValues((prev) => ({
                        ...prev,
                        region: e.target.value,
                      }))
                    }
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  />
                </td>
                {/* komentarze */}
                <td>
                  <input
                    type="text"
                    value={
                      editingContactId === contact.Id
                        ? editingValues.comments
                        : contact.comments
                    }
                    onChange={(e) =>
                      setEditingValues((prev) => ({
                        ...prev,
                        comments: e.target.value,
                      }))
                    }
                    onFocus={() => handleEditContact(contact)}
                    onBlur={() => handleUpdateContact(contact.Id)}
                  />
                </td>
              </tr>
            ))}
            {/* Formularz dodawania nowego kontaktu */}
            <tr>
              <td></td>
              <td>
                <input
                  type="text"
                  value={newContact.contactname}
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      contactname: e.target.value,
                    }))
                  }
                  onBlur={() => handleInputBlur(0)}
                  placeholder="Nowy kontakt +"
                />
              </td>
              {addStep >= 1 && (
                <>
                  <td>
                    <input
                      type="text"
                      value={newContact.comments}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          comments: e.target.value,
                        }))
                      }
                      placeholder="Komentarz"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newContact.region}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          region: e.target.value,
                        }))
                      }
                      placeholder="Region"
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={newContact.mail}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          mail: e.target.value,
                        }))
                      }
                      placeholder="Email"
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Telefon"
                    />
                  </td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      {selectedContacts.size > 0 && (

        <div className='button_edit-holder' style={{ marginTop: '20px' }}>
        <button className='trash_btn' onClick={handleDeleteSelectedContacts}><FontAwesomeIcon icon={faTrash} /> <br /> Usuń</button>
      </div>
      )}
    </div>
  );
}

export default Contacts;
