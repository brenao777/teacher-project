import Modal from 'react-modal';
import './BookingEventModal.css';

const BookingEventModal = ({
  isOpen,
  onRequestClose,
  onSave,
  selectedDuration,
  setSelectedDuration,
  durations,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="Modal__Content"
      overlayClassName="Modal__Overlay"
    >
      <h2>Выберите длительность</h2>
      {durations.map((duration) => (
        <div key={duration}>
          <input
            type="radio"
            id={`duration-${duration}`}
            name="duration"
            value={duration}
            checked={selectedDuration === duration}
            onChange={() => setSelectedDuration(duration)}
          />
          <label htmlFor={`duration-${duration}`}>{duration} минут</label>
        </div>
      ))}
      <button onClick={onSave}>Сохранить</button>
      <button onClick={onRequestClose}>Закрыть</button>
    </Modal>
  );
};

export default BookingEventModal;
