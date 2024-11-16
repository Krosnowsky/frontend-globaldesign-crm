import React, { useState, useEffect } from 'react';
import CheckboxColumn from './columns/CheckboxColumn';
import NameColumn from './columns/TaskNameColumn';
import OwnerColumn from './columns/OwnerColumn';
import StatusColumn from './columns/StatusColumn';
import DescriptionColumn from './columns/DescriptionColumn';
import PhoneColumn from './columns/PhoneColumn';
import DateColumn from './columns/DataColumn';
import { task_endpoint } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function TaskRow({ contact, users, selectedContacts, setSelectedContacts, setContacts, handleOpenModal }) {
  const [editingValues, setEditingValues] = useState(contact);
  const [editingContactId, setEditingContactId] = useState(null);
  const [error, setError] = useState(null);

  // Automatyczne ustawienie trybu edycji przy dodaniu nowego zadania
  useEffect(() => {
    if (!contact.Id) {
      setEditingContactId(contact.tempId); // Używamy tymczasowego ID dla nowego zadania
    }
  }, [contact]);

  // Funkcja aktualizująca kontakt
  const handleUpdateContact = async (id) => {
    try {
      await fetch(task_endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingValues, id }),
      });
      setContacts((prev) => prev.map((item) => (item.Id === id ? editingValues : item)));
      setEditingContactId(null); // Wyjście z trybu edycji po zapisaniu
    } catch (error) {
      console.error('Błąd aktualizacji:', error);
      setError('Błąd aktualizacji kontaktu');
    }
  };

  // Funkcja obsługująca kliknięcie w pole, które przełącza w tryb edycji
  const handleRowClick = () => {
    setEditingContactId(contact.Id || contact.tempId);
  };

  // Funkcja usuwająca zaznaczone kontakty
  const handleDeleteContacts = async () => {
    const idsToDelete = Array.from(selectedContacts);
    if (idsToDelete.length === 0) {
      setError('Nie zaznaczono żadnego kontaktu do usunięcia.');
      return;
    }

    try {
      const response = await fetch(task_endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const data = await response.json();

      if (data.success) {
        setContacts((prev) => prev.filter((contact) => !idsToDelete.includes(contact.Id)));
        setSelectedContacts(new Set());
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Błąd podczas usuwania kontaktów:', error);
      setError('Błąd podczas usuwania kontaktów.');
    }
  };

  return (
    <>
      <tr onClick={handleRowClick}>
        <CheckboxColumn
          contact={contact}
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
        />
        <NameColumn
          contact={contact}
          editingValues={editingValues}
          setEditingValues={setEditingValues}
          handleUpdateContact={handleUpdateContact}
          setEditingContactId={setEditingContactId}
          editingContactId={editingContactId}
        />
        <OwnerColumn
          contact={contact}
          users={users}
          editingValues={editingValues}
          setEditingValues={setEditingValues}
          handleUpdateContact={handleUpdateContact}
          setEditingContactId={setEditingContactId}
          editingContactId={editingContactId}
        />
        <StatusColumn
          contact={contact}
          editingValues={editingValues}
          setEditingValues={setEditingValues}
          handleUpdateContact={handleUpdateContact}
          setEditingContactId={setEditingContactId}
          editingContactId={editingContactId}
        />
        <DescriptionColumn
          contact={contact}
          editingValues={editingValues}
          setEditingValues={setEditingValues}
          handleUpdateContact={handleUpdateContact}
          setEditingContactId={setEditingContactId}
          editingContactId={editingContactId}
        />
        <DateColumn
          contact={contact}
          editingValues={editingValues}
          setEditingValues={setEditingValues}
          handleUpdateContact={handleUpdateContact}
          setEditingContactId={setEditingContactId}
          editingContactId={editingContactId}
        />
        <PhoneColumn
          contact={contact}
          editingValues={editingValues}
          setEditingValues={setEditingValues}
          handleUpdateContact={handleUpdateContact}
          setEditingContactId={setEditingContactId}
          editingContactId={editingContactId}
        />
      </tr>

      {/* Przycisk usuwania i modal */}
      {selectedContacts.size > 0 && (
        <tr>
          <td colSpan="7">
            <div className="button_edit-holder">
              <button onClick={handleDeleteContacts} className="options_btn">
                <FontAwesomeIcon icon={faTrashCan} />
                <br />Usuń
              </button>
              <button onClick={handleOpenModal} className="options_btn">
                modal
              </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </td>
        </tr>
      )}
    </>
  );
}

export default TaskRow;
