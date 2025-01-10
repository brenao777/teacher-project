import React, { useEffect, useState } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '../../api/axiosInstance';
import EventModal from './EventModal';
import BookingEventModal from './BookingEventModal';
import useUser from '../../hooks/useUser';
import './Calendar.css';

const durations = [45, 60, 90, 120];
let eventGuid = 0;

export function createEventId() {
  return String(eventGuid++);
}

export default function Calendar() {
  const { user } = useUser();
  const [weekendsVisible, setWeekendsVisible] = useState(false);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectInfo, setSelectInfo] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(45);
  const [events, setEvents] = useState([]); // Состояние для хранения событий

  useEffect(() => {
    axiosInstance('/slots').then((res) => {
      setEvents(res.data);
    });
  }, []);

  const bookingData = {
    userId: user?.id, // Замените на реальный userId
    slotId: events.selectInfo?.id,
    status: 'booked',
    homework: '', // Добавьте необходимые данные
    duration: selectedDuration.toString(),
  };

  // Сохранение данных в Booking
  axiosInstance
    .post('/bookings', bookingData)
    .then(() => {
      // Уменьшение времени в Slot
      const newEndTime = new Date(selectInfo.end);
      newEndTime.setMinutes(newEndTime.getMinutes() - selectedDuration);

      const updatedSlot = {
        title: selectInfo.title,
        start: selectInfo.start.toISOString(),
        end: newEndTime.toISOString(),
      };

      return axiosInstance.put(`/slots/${selectInfo.id}`, updatedSlot);
    })
    .then(() => {
      // Обновление событий
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectInfo.id
            ? { ...event, end: newEndTime.toISOString() }
            : event,
        ),
      );
      setIsModalOpen(false);
    })
    .catch((error) => {
      console.error('Ошибка при сохранении:', error);
    });

  // ОТОБРАЖЕНИЕ ВЫХОДНЫХ ДНЕЙ

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    setSelectInfo(selectInfo);
    setIsModalOpen(true);
  }

  function handleEvents(events) {
    console.log(events);
    setCurrentEvents(events);
  }

  // УДАЛЕНИЕ СОБЫТИЯ

  function handleEventClick(clickInfo) {
    if (confirm(`Вы уверены что хотите удалить событие - ${clickInfo.event.title}?`)) {
      clickInfo.event.remove();
      axiosInstance.delete('/slots', { data: { id: clickInfo.event.id } });
    }
    window.location.reload();
    // УДАЛИТЬ КОСТЫЛЬ
  }

  // ДОБАВЛЕНИЕ СОБЫТИЯ

  const handleSave = (title) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    const data = calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });

    const newEvent = {
      title: data._def.title,
      start: data._instance.range.start,
      end: data._instance.range.end,
    };

    axiosInstance.post('/slots', newEvent).then((response) => {
      setEvents((prevEvents) => [...prevEvents, response.data]);
    });
    setIsModalOpen(false);
  };

  // ИЗМЕНЕНИЕ СОБЫТИЯ

  const handleEventChange = (info) => {
    const updatedEvent = {
      id: info.event.id,
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
      title: info.event.title,
    };
    console.log(updatedEvent);

    axiosInstance
      .put(`/slots/${updatedEvent.id}`, updatedEvent)
      .then((response) => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === response.data.id ? response.data : event,
          ),
        );
      })
      .catch((error) => {
        console.error('Ошибка при обновлении события ------>', error);
      });
  };

  return (
    <div className="app">
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      />
      {user?.user?.isAdmin ? (
        <div className="app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            eventOverlap={false}
            weekends={weekendsVisible}
            eventChange={handleEventChange}
            select={handleDateSelect}
            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
            eventContent={(eventInfo) =>
              renderEventContent(eventInfo, handleEventClick, user)
            }
            events={events}
            eventsSet={handleEvents}
          />
          <EventModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        </div>
      ) : (
        <div className="app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView="timeGridWeek"
            editable={false}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={true}
            eventOverlap={false}
            weekends={weekendsVisible}
            eventChange={handleEventChange}
            select={handleDateSelect}
            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
            eventContent={(eventInfo) =>
              renderEventContent(eventInfo, handleEventClick, user)
            }
            events={events}
            eventsSet={handleEvents}
            eventClick={() => setIsModalOpen(true)}
          />
          <BookingEventModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            durations={durations}
          />
        </div>
      )}
    </div>
  );
}

function renderEventContent(eventInfo, handleEventClick, user) {
  return (
    <div>
      {user?.user?.isAdmin && (
        <p className="delBtn" onClick={() => handleEventClick(eventInfo)}>
          ✖
        </p>
      )}
      <i>{eventInfo.event.title}</i>
      <br />
      <b>{eventInfo.timeText}</b>
    </div>
  );
}

function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    axiosInstance('/slots').then((response) => {
      setSlots(response.data);
    });
  }, []);

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-section">
        <label>
          <input
            type="checkbox"
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          />
          Показывать выходные
        </label>
      </div>
      <div className="app-sidebar-section">
        <h2>Расписание занятий ({slots.length})</h2>
        <ul>
          {slots.map((slot) => (
            <SidebarEvent key={slot.id} slot={slot} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SidebarEvent({ slot }) {
  const config = { hour: 'numeric', minute: 'numeric', hour12: false };
  return (
    <li>
      <b>{slot.title}</b>
      <br />
      <i>
        {formatDate(slot.start, config)} - {formatDate(slot.end, config)}
      </i>
      <br />
    </li>
  );
}
