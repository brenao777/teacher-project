import React, { useState } from 'react';
import Modal from 'react-modal';
import './EventModal.css';

const EventModal = ({ isOpen, onRequestClose, onSave }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    onSave(title);
    setTitle('');
    onRequestClose();
    window.location.reload();
    // УДАЛИТЬ КОСТЫЛЬ
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">Введите название занятия</div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="modal-input"
        placeholder="Название занятия"
      />
      <div>
        <button onClick={handleSubmit} className="modal-button">
          Сохранить
        </button>
        <button onClick={onRequestClose} className="modal-button modal-cancel-button">
          Отмена
        </button>
      </div>
    </Modal>
  );
};

export default EventModal;
