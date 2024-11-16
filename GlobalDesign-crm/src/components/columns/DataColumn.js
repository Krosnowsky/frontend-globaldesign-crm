import React, { useState } from 'react';
import { task_endpoint } from '../../config';

// Funkcja do formatowania daty na wyświetlany format (np. "12 lis")
const formatDisplayDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // Jeżeli data jest niepoprawna, zwracamy ją w oryginalnej postaci

  const day = date.getDate();
  const monthNames = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
  const month = monthNames[date.getMonth()];

  return `${day} ${month}`;
};

// Funkcja do formatowania daty na format inputa typu date (YYYY-MM-DD)
const formatForInput = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function DateColumn({ contact, fetchContacts }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(contact.date || '');
  const [inputType, setInputType] = useState('text'); // Typ inputu (text lub date)

  // Funkcja do obsługi zmiany wartości daty
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  // Funkcja obsługi zapisu po opuszczeniu pola edycji
  const handleBlur = async () => {
    setInputType('text'); // Przywrócenie typu na text po opuszczeniu pola

    if (value !== contact.date) {
      try {
        const updatedTask = { ...contact, date: value };
        await fetch(`${task_endpoint}/${contact.Id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        });
        fetchContacts(); // Odświeżenie danych po aktualizacji
      } catch (error) {
        console.error(error.message);
      }
    }

    setIsEditing(false);
  };

  // Funkcja do obsługi kliknięcia na komórkę
  const handleClick = () => {
    setIsEditing(true);
    setInputType('date'); // Ustawienie inputu na typ date przy edycji
  };

  return (
    <td onClick={handleClick}>
      {isEditing ? (
        <input
          type={inputType}
          className="date-input"
          value={formatForInput(value)}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span>{formatDisplayDate(contact.date)}</span>
      )}
    </td>
  );
}

export default DateColumn;
