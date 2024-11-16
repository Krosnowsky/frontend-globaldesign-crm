import React from 'react';

function CheckboxColumn({ contact, selectedContacts, setSelectedContacts }) {
  const handleSelectContact = (id) => {
    setSelectedContacts((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  return (
    <td>
      <input type="checkbox" checked={selectedContacts.has(contact.Id)} onChange={() => handleSelectContact(contact.Id)} />
    </td>
  );
}

export default CheckboxColumn;
