import React, { useEffect, useState } from 'react';

function UniwersalnaTabela({ tableName, primaryKey }) {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({ contactname: '', mail: '', phone: '', status: 'none' });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pobieranie danych tabeli
    const fetchData = async () => {
      try {
        const response = await fetch(`https://crm.kros-media.pl/contacts.php?tableName=${tableName}&primaryKey=${primaryKey}`);
        if (!response.ok) throw new Error('Błąd w pobieraniu danych');
        
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [tableName, primaryKey]);

  const handleAddRow = async () => {
    try {
      const response = await fetch('https://crm.kros-media.pl/contacts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRow, tableName, primaryKey }),
      });
      const result = await response.json();

      if (result.success) {
        setData([...data, { ...newRow, Id: result.newId }]);
        setNewRow({ contactname: '', mail: '', phone: '', status: 'none' });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Błąd podczas dodawania wiersza');
    }
  };

  return (
    <div>
      <h3>{tableName}</h3>
      {error && <p style={{ color: 'red' }}>Błąd: {error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.Id}>
              <td>{row.contactname}</td>
              <td>{row.mail}</td>
              <td>{row.phone}</td>
              <td>{row.status}</td>
            </tr>
          ))}
          <tr>
            <td><input type="text" value={newRow.contactname} onChange={(e) => setNewRow({ ...newRow, contactname: e.target.value })} placeholder="Nazwa" /></td>
            <td><input type="email" value={newRow.mail} onChange={(e) => setNewRow({ ...newRow, mail: e.target.value })} placeholder="Email" /></td>
            <td><input type="tel" value={newRow.phone} onChange={(e) => setNewRow({ ...newRow, phone: e.target.value })} placeholder="Telefon" /></td>
            <td>
              <select value={newRow.status} onChange={(e) => setNewRow({ ...newRow, status: e.target.value })}>
                <option value="none">none</option>
                <option value="zrobione">zrobione</option>
                <option value="wstrzymane">wstrzymane</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleAddRow}>Dodaj wiersz</button>
    </div>
  );
}
export default UniwersalnaTabela;
