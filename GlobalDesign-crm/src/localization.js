import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import LocationDetails from './LocationDetails'; // Komponent wyświetlający szczegóły lokalizacji
import './style.css';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState(new Set());
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [newLocation, setNewLocation] = useState({
    name: '',
    city: '',
    road_number: '',
    status: 'negotiation',
  });
  const [detailsLocationId, setDetailsLocationId] = useState(null); // ID lokalizacji dla szczegółów

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://crm.kros-media.pl/lociation.php');
        if (!response.ok) throw new Error('Błąd w pobieraniu danych');
        const data = await response.json();
        setLocations(data.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Add new location
  const handleAddLocation = async () => {
    if (!newLocation.name || !newLocation.city) {
      setError('Nazwa lokalizacji i miasto są wymagane.');
      return;
    }

    try {
      const response = await fetch('https://crm.kros-media.pl/lociation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLocation),
      });
      const data = await response.json();

      if (data.success) {
        setLocations((prev) => [...prev, { ...newLocation, Id: data.newId }]);
        setNewLocation({ name: '', city: '', road_number: '', status: 'negotiation' });
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas dodawania lokalizacji.');
    }
  };

  // Edit existing location
  const handleEditLocation = (location) => {
    setEditingLocationId(location.Id);
    setEditingValues({ ...location });
  };

  // Save edited location
  const handleUpdateLocation = async (id) => {
    if (!editingLocationId) return;

    try {
      const response = await fetch('https://crm.kros-media.pl/lociation.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editingValues }),
      });
      const data = await response.json();

      if (data.success) {
        setLocations((prev) =>
          prev.map((location) => (location.Id === id ? { ...location, ...editingValues } : location))
        );
        setEditingLocationId(null);
        setEditingValues({});
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas aktualizacji lokalizacji.');
    }
  };

  // Delete selected locations
  const handleDeleteSelectedLocations = async () => {
    const idsToDelete = Array.from(selectedLocations);
    try {
      const response = await fetch('https://crm.kros-media.pl/lociation.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const data = await response.json();

      if (data.success) {
        setLocations((prev) => prev.filter((location) => !selectedLocations.has(location.Id)));
        setSelectedLocations(new Set());
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Błąd podczas usuwania lokalizacji.');
    }
  };

  if (loading) return <p>Ładowanie lokalizacji...</p>;
  if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>;

  return (
    <div>
      {detailsLocationId ? (
        <LocationDetails
          locationId={detailsLocationId}
          onClose={() => setDetailsLocationId(null)} // Zamknięcie szczegółów lokalizacji
        />
      ) : (
        <>
          <h2 className="table_title">Lokalizacje</h2>
          <div className="contacts-container contacts">
            <table>
              <thead>
                <tr>
                  <th className="checkbox-column"></th>
                  <th>Nazwa lokalizacji</th>
                  <th>Miasto</th>
                  <th>Numer drogi</th>
                  <th>Status</th>
                  <th>Opcje</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.Id}>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        checked={selectedLocations.has(location.Id)}
                        onChange={() =>
                          setSelectedLocations((prev) => {
                            const updated = new Set(prev);
                            updated.has(location.Id) ? updated.delete(location.Id) : updated.add(location.Id);
                            return updated;
                          })
                        }
                      />
                    </td>
                    <td>
                      {editingLocationId === location.Id ? (
                        <input
                          type="text"
                          value={editingValues.name}
                          onChange={(e) =>
                            setEditingValues((prev) => ({ ...prev, name: e.target.value }))
                          }
                          onBlur={() => handleUpdateLocation(location.Id)}
                        />
                      ) : (
                        location.name
                      )}
                    </td>
                    <td>
                      {editingLocationId === location.Id ? (
                        <input
                          type="text"
                          value={editingValues.city}
                          onChange={(e) =>
                            setEditingValues((prev) => ({ ...prev, city: e.target.value }))
                          }
                          onBlur={() => handleUpdateLocation(location.Id)}
                        />
                      ) : (
                        location.city
                      )}
                    </td>
                    <td>
                      {editingLocationId === location.Id ? (
                        <input
                          type="text"
                          value={editingValues.road_number}
                          onChange={(e) =>
                            setEditingValues((prev) => ({ ...prev, road_number: e.target.value }))
                          }
                          onBlur={() => handleUpdateLocation(location.Id)}
                        />
                      ) : (
                        location.road_number
                      )}
                    </td>
                    <td>
                      {editingLocationId === location.Id ? (
                        <select
                          value={editingValues.status}
                          onChange={(e) =>
                            setEditingValues((prev) => ({ ...prev, status: e.target.value }))
                          }
                          onBlur={() => handleUpdateLocation(location.Id)}
                        >
                          <option value="negotiation">Negocjacje</option>
                          <option value="offered">Zaofertowano</option>
                          <option value="rented">Wynajęta</option>
                          <option value="occupied">Zajęta</option>
                        </select>
                      ) : (
                        location.status
                      )}
                    </td>
                    <td>
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        onClick={() => setDetailsLocationId(location.Id)} // Otwórz szczegóły
                      />
                    </td>
                  </tr>
                ))}
                {/* New location form */}
                <tr>
                  <td></td>
                  <td>
                    <input
                      type="text"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nowa lokalizacja"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newLocation.city}
                      onChange={(e) => setNewLocation((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="Miasto"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newLocation.road_number}
                      onChange={(e) =>
                        setNewLocation((prev) => ({ ...prev, road_number: e.target.value }))
                      }
                      placeholder="Numer drogi"
                    />
                  </td>
                  <td>
                    <select
                      value={newLocation.status}
                      onChange={(e) => setNewLocation((prev) => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="negotiation">brak</option>
                      <option value="negotiation">zbadano</option>
                      <option value="negotiation">Negocjacje</option>
                      <option value="offered">Zaofertowano</option>
                      <option value="rented">Wynajęta</option>
                      <option value="occupied">Zajęta</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleAddLocation}>Dodaj</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedLocations.size > 0 && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleDeleteSelectedLocations} className="trash_btn">
            <FontAwesomeIcon icon={faTrash} /> Usuń wybrane
          </button>
        </div>
      )}
    </div>
  );
}

export default Locations;
