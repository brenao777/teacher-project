import NavBar from './ui/NavBar';
import { Outlet } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

export default function Layout({ user, logoutHandler }) {
  if (user.status === 'logging')
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  return (
    <>
      <NavBar user={user} logoutHandler={logoutHandler} />
      <Outlet />
    </>
  );
}
