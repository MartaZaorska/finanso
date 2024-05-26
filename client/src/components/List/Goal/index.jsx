import { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MdAdd } from "react-icons/md";

import Modal, { useModal } from '../../../features/modal';

import FormPlanItem from '../../Forms/PlanItem';
import GoalDeleteConfirmation from '../../DeleteConfirmation/Goal';
import GoalItem from './Item';

import styles from '../list.module.css';

function GoalList() {
  const [updateGoal, setUpdateGoal] = useState(null);

  const { 
    activeGroup: { _id: groupId, goals, totalIncome, totalExpenses, currency, isAdmin }, 
    user: { _id: userId } 
  } = useSelector(state => state.app);

  const { isOpen: isOpenUpdate, open: openUpdate, close: closeUpdate } = useModal();
  const { isOpen: isOpenCreate, open: openCreate, close: closeCreate } = useModal();
  const { isOpen: isOpenDelete, open: openDelete, close: closeDelete } = useModal();

  const balance = useMemo(() => totalIncome - totalExpenses, [totalExpenses, totalIncome]);

  const openUpdateModal = useCallback((goal) => {
    setUpdateGoal(goal);
    openUpdate();
  }, [openUpdate]);

  const openDeleteModal = useCallback((goal) => {
    setUpdateGoal(goal);
    openDelete();
  }, [openDelete]);

  return (
    <>
      {isOpenCreate && (
        <Modal title="Cel finansowy" subtitle="Utwórz nowy cel finansowy" closeHandler={closeCreate}>
          <FormPlanItem type="goals" groupId={groupId} closeModal={closeCreate} />
        </Modal>
      )}
      {isOpenUpdate && (
        <Modal title="Edycja" subtitle="Aktualizuj cel finansowy" closeHandler={closeUpdate}>
          <FormPlanItem type="goals" groupId={groupId} closeModal={closeUpdate} data={updateGoal} />
        </Modal>
      )}
      {isOpenDelete && (
        <Modal title="Usunięcie celu" closeHandler={closeDelete}>
          <GoalDeleteConfirmation groupId={groupId} closeModal={closeDelete} data={updateGoal} />
        </Modal>
      )}
      <section className={styles.container}>
        <header className={styles.header}>
          <h2>Cele finansowe</h2>
        </header>
        {goals.length > 0 ? (
          <div className={styles.content}>
            {goals.map(item => (
              <GoalItem 
                key={item._id} 
                data={item} 
                currency={currency} 
                balance={balance} 
                showButtons={isAdmin || item.user._id === userId} 
                openDeleteModal={openDeleteModal} 
                openUpdateModal={openUpdateModal} 
              />
            ))}
          </div>
         ) : (
          <div className={styles.content}>
            <p className={styles.message}>Brak zdefiniowanych celów finansowych</p>
          </div>
         )}
        <button className="button" onClick={openCreate}><MdAdd className="icon" /> Utwórz nowy cel finansowy</button>
      </section>
    </>
  )
}

export default GoalList