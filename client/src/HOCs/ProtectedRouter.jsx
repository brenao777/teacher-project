import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRouter({ children, isAllowed, redirectTo }) {
  if (isAllowed) return <Navigate to={redirectTo} />;
  return children || <Outlet />;
}

export default ProtectedRouter;
