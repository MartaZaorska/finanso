import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function GroupAccessControl() {
  const { activeGroup } = useSelector(state => state.app);

  if(!activeGroup) return <Navigate to="/user" />

  return <Outlet />
}

export default GroupAccessControl;