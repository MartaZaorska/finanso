import { useCallback, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

import { formatCurrency } from '../../utils/format';

import styles from './dashboard.module.css';

const GroupItem = memo(({
  data, 
  active,
  changeActiveGroup
}) => {
  const { name, currency, _id: groupId, totalIncome, totalExpenses } = data;

  return (
    <article onClick={() => changeActiveGroup(groupId)} className={active ? `${styles.box} ${styles.active}` : styles.box}>
      <header className={`${styles.header} ${styles.groupHeader}`}>
        <h2>{name}</h2>
        {active 
          ? <Link to="/settings" className={styles.link}>Więcej</Link> 
          : <button onClick={() => changeActiveGroup(groupId, true)} className={styles.link}>Więcej</button>
        }
      </header>
      <div className={styles.content}>
        <p className={styles.balance}>Bilans: <mark>{formatCurrency(totalIncome - totalExpenses, currency)}</mark></p>
      </div>
    </article>
  )
});

function Group() {
  const { activeGroup: { _id: groupId }, groups } = useSelector(state => state.app);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeActiveGroup = useCallback(async (id, goToSettings = false) => {
    const { setActiveGroup } = await import("../../app/appSlice");
    dispatch(setActiveGroup(id));
    if(goToSettings) navigate("/settings");
  }, [dispatch, navigate]);

  return (
    <section className={styles.wrapper}>
      <header className={styles.topHeader}>
        <h2>Twoje grupy</h2>
      </header>
      <div className={styles.list}>
        {groups.map(group => (
          <GroupItem 
            key={group._id} 
            active={groupId === group._id} 
            data={group} 
            changeActiveGroup={changeActiveGroup}
          />
        ))}
      </div>
    </section>
  )
}

export default Group