import React, { useEffect, useState } from 'react';
import LocationMap from './LocationMap'; // Importujemy komponent LocationMap
import './style.css';

function LocationDetails({ locationId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await fetch(`https://crm.kros-media.pl/lociation.php?id=${locationId}`);
        if (!response.ok) throw new Error('Błąd w pobieraniu szczegółów');
        const data = await response.json();
        
        console.log('Odpowiedź z API:', data); // Logujemy odpowiedź API w celu sprawdzenia struktury

        // Zakładamy, że dane o lokalizacji są w `data.data`
        setDetails(data.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [locationId]);

  if (loading) return <p>Ładowanie szczegółów...</p>;
  if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>;
  if (!details) return <p>Brak szczegółów do wyświetlenia.</p>;

  return (
    <div className="details-container">
      <button onClick={onClose} className="close-btn">Zamknij</button>
      <h3>Szczegóły lokalizacji</h3> 
      <div className="details-grid">
        <div><strong>ID:</strong> {details.Id}</div>
        <div><strong>Nazwa:</strong> {details.name}</div>
        <div><strong>Miasto:</strong> {details.city}</div>
        <div><strong>Numer drogi:</strong> {details.road_number}</div>
        <div><strong>Status:</strong> {details.status}</div>
        {/* Możesz dodać więcej pól, zależnie od struktury danych */}
      </div>

      {/* Sprawdzamy, czy mamy dane o szerokości i długości geograficznej */}
      {details.latitude && details.longitude && (
        <LocationMap latitude={details.latitude} longitude={details.longitude} />
      )}
    </div>
  );
}

export default LocationDetails;
