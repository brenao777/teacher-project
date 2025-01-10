import React, { useEffect, useState } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '../../api/axiosInstance';
import EventModal from './EventModal';

let eventGuid = 0;

export function createEventId() {
  return String(eventGuid++);
}

export default function Calendar() {

  return <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />;
  
  const [weekendsVisible, setWeekendsVisible] = useState(false);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectInfo, setSelectInfo] = useState(null);
  const [events, setEvents] = useState([]); // Состояние для хранения событий

  useEffect(() => {
    // Получение событий из базы данных
    axiosInstance('/slots').then((res) => {
      setEvents(res.data); // Сохранение событий в состояние
    });
  }, []);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    setSelectInfo(selectInfo);
    setIsModalOpen(true);
  }

  function handleEventClick(clickInfo) {
    if (confirm(`Вы уверены что хотите удалить событие - ${clickInfo.event.title}?`)) {
      clickInfo.event.remove();
      axiosInstance.delete('/slots', { data: { id: clickInfo.event.id } });
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  const handleSave = (title, selectedTeacherId) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    const data = calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      adminId: selectedTeacherId,
    });

    const newEvent = {
      title: data._def.title,
      start: data._instance.range.start,
      end: data._instance.range.end,
      adminId: selectedTeacherId,
    };

    axiosInstance.post('/slots', newEvent).then((response) => {
      setEvents((prevEvents) => [...prevEvents, response.data]); // Обновляем события
    });

    setIsModalOpen(false);
  };

  return (
    <div className="demo-app">
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      />
      <div className="demo-app-main">
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
          weekends={weekendsVisible}
          select={handleDateSelect}
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
          eventContent={(eventInfo) => renderEventContent(eventInfo, handleEventClick)}
          // eventClick={handleEventClick}
          // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Добавить бронирование (для студентов)
          events={events} // Передаем события в FullCalendar
          eventsSet={handleEvents}
        />
      </div>

      <EventModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

function renderEventContent(eventInfo, handleEventClick) {
  return (
    <div>
      <p onClick={() => handleEventClick(eventInfo)}>❌</p>
      {/* Передаем eventInfo для удаления */}
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
    <div className="demo-app-sidebar">
      <div className="demo-app-sidebar-section">
        <label>
          <input
            type="checkbox"
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          />
          Показывать выходные
        </label>
      </div>
      <div className="demo-app-sidebar-section">
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
  return (
    <li>
      <i>{slot.title}</i>
      <br />
      <b>
        {formatDate(slot.start, { hour: 'numeric', minute: 'numeric', hour12: false })}
      </b>
      <br />
      <b>{formatDate(slot.end, { hour: 'numeric', minute: 'numeric', hour12: false })}</b>
    </li>
  );
}
