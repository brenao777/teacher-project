import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar({ user, logoutHandler }) {
  const handleLogout = () => {
    logoutHandler(); 
    // window.location.reload();
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">{user.user ? user.user.firstName : 'Гость'}</Navbar.Brand>
        <Nav className="me-auto">
          {user.status === 'guest' ? (
            <>
              <Nav.Link href="/signin">Войти</Nav.Link>
              <Nav.Link href="/signup">Регистрация</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/">Личный кабинет</Nav.Link>
              {/* <Nav.Link href="/event">Добавить</Nav.Link> */}
              <Nav.Link onClick={handleLogout}>Выйти</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
