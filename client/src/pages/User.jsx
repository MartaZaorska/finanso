import UserDetails from '../components/Details/User';
import GroupList from '../components/List/Group';

export function Component() {
  return (
    <>
      <UserDetails />
      <GroupList />
    </>
  )
}

Component.displayName = "User"