import { useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IoIosArrowUp } from "react-icons/io";

import { useGetNotificationsQuery } from '../../../app/apiGroup';
import { setNotifications } from '../../../app/appSlice';

import useInfinityScroll from '../../../hooks/useInfinityScroll'
import { formatDate, formatRawDate } from '../../../utils/format';

import NotificationItem from './Item';
import InfinityLoader from '../../InfinityLoader';
import Loader from '../../Loader';

import styles from '../list.module.css';

function NotificationList() {
  const { activeGroup: { _id, notifications } } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const buttonRef = useRef();

  const visible = useInfinityScroll(15, notifications.length, buttonRef);

  const { data, isLoading, refetch } = useGetNotificationsQuery(_id);

  useEffect(() => {
    if(data) dispatch(setNotifications({ groupId: _id, data: data.notifications }));
  }, [data, dispatch]);

  useEffect(() => { refetch() }, [refetch]);

  const groupedNotificationsByDate = useMemo(() => {
    const now = new Date();
    const today = formatRawDate();
    const yesterday = formatRawDate(new Date().setDate(now.getDate() - 1));
    
    return Object.groupBy(notifications.slice(0, visible), (item) => {
      const date = item.createdAt.slice(0, 10);
      if(today === date){ 
        return `Dzisiaj`;
      }else if(yesterday === date){
        return `Wczoraj`;
      }else return formatDate(item.createdAt);
    });
  }, [notifications, visible]);


  if(isLoading) return <Loader />

  return (
    <section>
      {notifications.length === 0 && <p className={styles.message}>Brak powiadomień</p>}
      {Object.entries(groupedNotificationsByDate).map(([date, items]) => (
        <div key={`notifications-${date}`}className={styles.container}>
          <header>
            <h2>{date}</h2>
          </header>
          <div className={`${styles.content} ${styles.notifications}`}>
            {items.map(item => <NotificationItem key={item._id} data={item} />)}
          </div>
        </div>
      ))}
      {visible < notifications.length && (
        <div className={styles.spinner}>
          <InfinityLoader />
        </div>
      )}
      <button className="scrollButton" aria-label="przewiń do góry" ref={buttonRef}><IoIosArrowUp className="icon" /></button>
    </section>
  )
}

export default NotificationList