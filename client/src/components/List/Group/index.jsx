import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MdAdd } from "react-icons/md";

import Modal, { useModal } from '../../../features/modal';
import FormGroup from '../../Forms/Group';
import GroupItem from './Item';

import styles from '../list.module.css';

function GroupList() {
  const { groups, activeGroup } = useSelector(state => state.app);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isOpen, open, close } = useModal();

  const changeActiveGroup = useCallback(async (id) => {
    const { setActiveGroup } = await import("../../../app/appSlice");
    dispatch(setActiveGroup(id));
    navigate("/settings");
  }, [dispatch, navigate]);

  return (
    <>
      {isOpen && (
        <Modal title="Nowa grupa" subtitle="Utwórz nowe gospodarstwo domowe" closeHandler={close}>
          <FormGroup closeModal={close} />
        </Modal>
      )}
      <section className={styles.container}>
        {groups.length > 0 && (
          <>
            <header className={styles.header}>
              <h2>Twoje grupy</h2>
            </header>
            <div className={styles.content}>
              {groups.map(group => (
                <GroupItem 
                  key={group._id} 
                  data={group} 
                  active={group._id === activeGroup._id} 
                  changeActiveGroup={changeActiveGroup} 
                />
              ))}
            </div>
          </>
        )}
        <button className="button" onClick={open}><MdAdd className="icon" /> Utwórz nową grupę</button>
      </section>
    </>
  )
}

export default GroupList