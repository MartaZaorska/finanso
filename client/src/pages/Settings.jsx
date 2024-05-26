import GroupDetails from '../components/Details/Group';
import UserList from '../components/List/User';

export function Component() {
  return (
    <>
      <GroupDetails />
      <UserList />
    </>
  )
}

Component.displayName = "Settings";