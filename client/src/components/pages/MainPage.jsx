import { useEffect, useState } from 'react';
// import axios from 'axios';
// import EventCard from '../ui/EventCard';
import Container from 'react-bootstrap/esm/Container';
import Calendar from '../ui/Calendar';
import axiosInstance from '../../api/axiosInstance';
import User from '../ui/User'
function MainPage() {
  // const [events, setEvents] = useState([]);

  // useEffect(() => {
  //   const getEvents = async () => {
  //     try {
  //       const res = await axiosInstance('/events');
  //       const result = res.data;
  //       setEvents(result);
  //     } catch (error) {
  //       console.error('Ошибка при загрузке:', error);
  //     }
  //   };
  //   getEvents();
  // }, []);

  return (
    <Container>
      <User/>
      {/* {events.map((event) => (
        <div key={event.id} className="col-3">
          <Calendar event={event} />
        </div>
      ))} */}
      <Calendar />
    </Container>
  );
}

export default MainPage;
