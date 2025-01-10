import React, { useEffect, useState } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '../../api/axiosInstance';
import EventModal from './EventModal';
import useUser from '../../hooks/useUser';
import './Calendar.css';

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
  const [events, setEvents] = useState([]); // Состояние для хранения событий


  console.log(user, 123123123);
  
  useEffect(() => {
    axiosInstance('/slots').then((res) => {
      setEvents(res.data);
    });
  }, []);

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
      {user?.user?.isAdmin ?
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
          // eventClick={handleEventClick}
          // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Добавить бронирование (для студентов)
        />
      </div>
: <div className="app-main">
<FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  headerToolbar={{
    left: 'prev,next today',
    left: 'title',
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
  // eventClick={handleEventClick}
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Добавить бронирование (для студентов)
/>
</div>}
      <EventModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

function renderEventContent(eventInfo, handleEventClick, user) {
  return (
    <div>
      {user?.user?.isAdmin && <p onClick={() => handleEventClick(eventInfo)}>❌</p>}
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
