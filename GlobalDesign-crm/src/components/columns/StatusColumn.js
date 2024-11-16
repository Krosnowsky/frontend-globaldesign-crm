import React, { useState } from 'react';
import { task_endpoint } from '../../config';

function StatusColumn({ contact, fetchContacts }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(contact.status || '');

  const handleBlur = async () => {
    if (value !== contact.status) {
      try {
        const updatedTask = { ...contact, status: value };
        await fetch(`${task_endpoint}/${contact.Id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        });
        fetchContacts();
      } catch (error) {
        console.error(error.message);
      }
    }
    setIsEditing(false);
  };

  const handleClick = () => setIsEditing(true);

  return (
    <td onClick={handleClick}>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        value
      )}
    </td>
  );
}

export default StatusColumn;
