import NotificationDetails from "../components/Details/Notification";
import NotificationList from '../components/List/Notification';

export function Component() {
  return (
    <>
      <NotificationDetails />
      <NotificationList />
    </>
  )
}

Component.displayName = "Notifications";