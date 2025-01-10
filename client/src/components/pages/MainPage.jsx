import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Calendar from '../ui/Calendar';
import User from '../ui/User';

function MainPage() {
  return (
    <Container>
      <User />
      <Calendar />
    </Container>
  );
}

export default MainPage;
