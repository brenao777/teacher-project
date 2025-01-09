import NavBar from './ui/NavBar';
import { Outlet } from 'react-router-dom';
export default function Layout({ user, logoutHandler }) {
  return (
    <>
      <NavBar user={user} logoutHandler={logoutHandler} />
      <Outlet />
    </>
  );
}
