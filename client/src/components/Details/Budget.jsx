import { useState } from 'react';
import { useSelector } from 'react-redux';

import { MdAdd } from 'react-icons/md';

import Modal, { useModal } from '../../features/modal';
import FormBudgetItem from '../Forms/BudgetItem';
import { formatCurrency } from '../../utils/format';

import BUDGET_DRAW from '../../assets/budget.png';
import styles from './details.module.css';

function BudgetDetails() {
  const [type, setType] = useState('income');

  const { activeGroup: { totalIncome, totalExpenses, currency, _id }} = useSelector(state => state.app);
  const { isOpen, open, close } = useModal();

  const openModal = (type) => {
    setType(type);
    open();
  }

  return (
    <>
      {isOpen && (
        <Modal title="Nowa transakcja" closeHandler={close}>
          <FormBudgetItem type={type} closeModal={close} groupId={_id} />
        </Modal>
      )}
      <section className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <h2><span>Budżet</span></h2>
          </header>
          <div className={styles.content}>
            <div className={styles.controls}>
              <button className="button" onClick={() => openModal("expenses")}><MdAdd className="icon" /> Dodaj wydatek</button>
              <button className="button" onClick={() => openModal("income")}><MdAdd className="icon" /> Dodaj przychód</button>
            </div>
            <div>
              <p className={styles.budget}>Bilans: <span>{formatCurrency(totalIncome - totalExpenses, currency)}</span></p>
            </div>
          </div>
        </div>
        <div className={styles.draw}>
          <img src={BUDGET_DRAW} alt="budget icon" />
        </div>
      </section>
    </>
  )
}

export default BudgetDetails