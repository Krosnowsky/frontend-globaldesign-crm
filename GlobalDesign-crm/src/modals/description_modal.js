import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ustawienie elementu root dla dostępności

const MyModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Funkcja otwierająca modal
  const openModal = () => setIsOpen(true);

  // Funkcja zamykająca modal
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {/* Przycisk do otwierania modala */}
      <button onClick={openModal}>Otwórz Modal</button>

      {/* Komponent Modal */}
      <Modal
        isOpen={isOpen} // Określenie czy modal jest otwarty
        onRequestClose={closeModal} // Funkcja do zamknięcia modala
        contentLabel="My Modal" // Opis modala dla dostępności
        className="modal-content" // Klasa CSS dla treści modala
        overlayClassName="modal-overlay" // Klasa CSS dla tła modala
      >
        <h2>Modal Content</h2>
        <p>To jest przykładowy modal w React!</p>
        <button onClick={closeModal}>Zamknij</button>
      </Modal>
    </div>
  );
};

export default MyModal;
