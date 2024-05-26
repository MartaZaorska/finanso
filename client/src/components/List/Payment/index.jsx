import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { MdAdd } from 'react-icons/md';

import Modal, { useModal } from '../../../features/modal';

import FormPlanItem from '../../Forms/PlanItem';
import PaymentDeleteConfirmation from '../../DeleteConfirmation/Payment';
import PaymentItem from './Item';

import styles from '../list.module.css';

function PaymentList() {
  const [updatePayment, setUpdatePayment] = useState(null);

  const { 
    activeGroup: { _id: groupId, payments, currency, isAdmin }, 
    user: { _id: userId } 
  } = useSelector(state => state.app);

  const { isOpen: isOpenUpdate, open: openUpdate, close: closeUpdate } = useModal();
  const { isOpen: isOpenCreate, open: openCreate, close: closeCreate } = useModal();
  const { isOpen: isOpenDelete, open: openDelete, close: closeDelete } = useModal();

  const sortedPayments = useMemo(() => 
    [...payments].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate)
  ), [payments]);

  const openUpdateModal = useCallback((payment) => {
    setUpdatePayment(payment);
    openUpdate();
  }, [openUpdate]);

  const openDeleteModal = useCallback((payment) => {
    setUpdatePayment(payment);
    openDelete();
  }, [openDelete]);

  return (
    <>
      {isOpenCreate && (
        <Modal title="Płatność" subtitle="Utwórz nową płatność" closeHandler={closeCreate}>
          <FormPlanItem type="payments" groupId={groupId} closeModal={closeCreate} />
        </Modal>
      )}
      {isOpenUpdate && (
        <Modal title="Edycja" subtitle="Aktualizuj dane dotyczące płatności" closeHandler={closeUpdate}>
          <FormPlanItem type="payments" groupId={groupId} closeModal={closeUpdate} data={updatePayment} />
        </Modal>
      )}
      {isOpenDelete && (
        <Modal title="Usunięcie płatności" closeHandler={closeDelete}>
          <PaymentDeleteConfirmation groupId={groupId} openUpdateModal={openUpdate} closeModal={closeDelete} data={updatePayment} />
        </Modal>
      )}
      <section className={styles.container}>
        <header className={styles.header}>
          <h2>Przyszłe płatności</h2>
        </header>
        {payments.length > 0 ? (
          <div className={styles.content}>
            {sortedPayments.map(item => (
              <PaymentItem 
                key={item._id} 
                data={item} 
                currency={currency} 
                showButtons={isAdmin || item.user._id === userId} 
                openDeleteModal={openDeleteModal} 
                openUpdateModal={openUpdateModal} 
              />
            ))}
          </div>
         ) : (
          <div className={styles.content}>
            <p className={styles.message}>Brak zdefiniowanych płatności</p>
          </div>
         )}
        <button className="button" onClick={openCreate}><MdAdd className="icon" /> Utwórz nową płatność</button>
      </section>
    </>
  )
}

export default PaymentList