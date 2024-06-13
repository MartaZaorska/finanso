import { useState, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IoFilterOutline, IoCloseOutline } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";

import Modal, { useModal } from '../../../features/modal';
import useFilters from '../../../hooks/useFilters';
import useInfinityScroll from '../../../hooks/useInfinityScroll';
import { useDeleteElementMutation } from '../../../app/apiGroup';

import FilterPanel from '../../Forms/FilterPanel';
import FormBudgetItem from '../../Forms/BudgetItem';
import BudgetItem from './Item';
import InfinityLoader from '../../InfinityLoader';

import styles from '../list.module.css';

function BudgetList() {
  const [budgetItem, setBudgetItem] = useState(null);
  const buttonRef = useRef();

  const { 
    activeGroup: { _id: groupId, admins, users, income, expenses, currency, isAdmin }, 
    user: { _id: userId } 
  } = useSelector(state => state.app);

  const total = useMemo(() => income.length + expenses.length, [income, expenses]);
  const visible = useInfinityScroll(15, total, buttonRef);
  
  const { filters, data, setFilters, clearFilters } = useFilters({ income, expenses, visible });

  const { isOpen: isOpenFilters, open: openFilters, close: closeFilters } = useModal();
  const { isOpen: isOpenUpdate, open: openUpdate, close: closeUpdate } = useModal();

  const dispatch = useDispatch()
  const [deleteElement, { isLoading }] = useDeleteElementMutation();

  const allUsers = useMemo(() => [ ...admins, ...users ], [admins, users]);

  const openUpdateModal = useCallback((data) => {
    setBudgetItem(data);
    openUpdate();
  }, [openUpdate]);

  const deleteHandler = useCallback(async (data) => {
    try {
      await deleteElement({ type: data.type, groupId, id: data._id }).unwrap();
      const { deleteGroupItem } = await import("../../../app/appSlice");
      dispatch(deleteGroupItem({ groupId, type: data.type, itemId: data._id }));
    }catch(err){
      //console.error('deleteBudgetItem', err);
    }
  }, [groupId, dispatch, deleteElement]);

  return (
    <>
      {isOpenFilters && (
        <Modal title="Filtruj" closeHandler={closeFilters}>
          <FilterPanel setFilters={setFilters} filters={filters} users={allUsers} closeModal={closeFilters} />
        </Modal>
      )}
      {isOpenUpdate && (
        <Modal title="Edycja" closeHandler={closeUpdate}>
          <FormBudgetItem groupId={groupId} closeModal={closeUpdate} data={budgetItem} />
        </Modal>
      )}
      <section className={styles.container}>
        <div className={styles.filters}>
          <button className="button" onClick={openFilters}><IoFilterOutline className="icon" /> Filtruj</button>
          <button className="button secondary" onClick={clearFilters}><IoCloseOutline className="icon" /> Wyczyść filtry</button>
        </div>
        {Object.keys(data).length > 0 ? (
          <>
            <div className={styles.content}>
              {Object.entries(data).map(([date, items]) => (
                <div key={`budget-${date}`} className={`${styles.container} ${styles.budgetContainer}`}>
                  <header>
                    <h2>{date}</h2>
                  </header>
                  <div className={styles.content}>
                    {items.map(item => (
                      <BudgetItem 
                        key={item._id} 
                        data={item} 
                        isLoading={isLoading}
                        currency={currency} 
                        showButtons={isAdmin || item.user._id === userId} 
                        openUpdateModal={openUpdateModal} 
                        deleteHandler={deleteHandler}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {total > 15 && visible < total && <InfinityLoader />}
          </>
          ) : (
            <div className={styles.content}>
              <p className={styles.message}>Nie znaleziono żadnych przychodów ani wydatków</p>
            </div>
          )}
          <button className="scrollButton" aria-label="przewiń do góry" ref={buttonRef}><IoIosArrowUp className="icon" /></button>
        </section>
    </>
  )
}

export default BudgetList