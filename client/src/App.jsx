import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import MainPage from './components/pages/MainPage';
import useUser from './hooks/useUser';
import NotFoundPage from './components/pages/NotFoundPage';
import ProtectedRouter from './HOCs/ProtectedRouter';
// import EventCard from './components/ui/EventCard';
import RegisterForm from './components/ui/RegisterForm';
import LoginForm from './components/ui/LoginForm';
import Calendar from './components/ui/Calendar';
import ResetPasswordForm from './components/ui/ResetPasswordForm';

function App() {
  const { user, loginHandler, logoutHandler, registerHandler } = useUser();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout logoutHandler={logoutHandler} user={user} />,
      children: [
        { path: '/', element: <MainPage /> },
        {
          path: '/events',
          element: (
            <ProtectedRouter isAllowed={user.status !== 'logged'} redirectTo={'/signin'}>
              <Calendar user={user} />
            </ProtectedRouter>
          ),
        },
        // {
        //   path: '/events/:id',
        //   element: (
        //     <ProtectedRouter isAllowed={user.status !== 'logged'} redirectTo={'/signin'}>
        //       <Calendar user={user} />
        //     </ProtectedRouter>
        //   ),
        // },
        {
          element: (
            <ProtectedRouter isAllowed={user.status === 'logged'} redirectTo={'/'} />
          ),
          children: [
            {
              path: '/signup',
              element: <RegisterForm registerHandler={registerHandler} />,
            },
            {
              path: '/signin',
              element: <LoginForm loginHandler={loginHandler} />,
            },
            {
              path: '/reset-password',
              element: <ResetPasswordForm />,
            },
          ],
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
