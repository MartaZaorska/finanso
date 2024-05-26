import { useState, memo } from 'react';
import { useDispatch } from 'react-redux';

import { useAddElementMutation, useDeleteElementMutation } from '../../app/apiGroup';

import InfinityLoader from '../InfinityLoader';

import styles from './delete.module.css';

function GoalDeleteConfirmation({ 
  closeModal, 
  groupId,
  data 
}) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [addElement] = useAddElementMutation();
  const [deleteElement] = useDeleteElementMutation();

  const addExpense = async () => {
    setError("");
    setIsLoading(true);

    const body = { value: data.value, description: data.name, category: 'other_expenses' };
    
    try { 
      const res = await addElement({ data: body, groupId, type: 'expenses' }).unwrap();
      const { updateGroup } = await import("../../app/appSlice");
      dispatch(updateGroup(res));
      await deleteGoal();
    }catch(err){
      setIsLoading(false);
      console.log("addExpenseAndDeleteGoal", err);
      if(err?.data?.message) setError(err.data.message);
    }
  }
  
  const deleteGoal = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await deleteElement({ groupId, id: data._id, type: 'goals' }).unwrap();
      const { updateGroup } = await import("../../app/appSlice");
      dispatch(updateGroup(res));
      closeModal();
    }catch(err){
      console.log("deleteGoal", err);
      if(err?.data?.message) setError(err.data.message);
    }finally{
      setIsLoading(false);
    }
  }

  if(isLoading) return <InfinityLoader />

  return (
    <div className={styles.container}>
      <p>Masz dwie opcje do wyboru:</p>
      <ol className={styles.list}>
        <li><span>Usuń cel finansowy</span> - Wybierz tę opcję, jeśli chcesz usunąć cel finansowy bez żadnych dodatkowych działań.</li>
        <li><span>Usuń i dodaj do wydatków</span> - Wybierz tę opcję, jeśli cel finansowy został osiągnięty i chcesz dodać wartość celu do swoich wydatków.</li>
      </ol>
      {error && <p className={styles.error}>{error}</p>}
      <button disabled={isLoading} className="button danger" onClick={deleteGoal}>Usuń cel finansowy</button>
      <button disabled={isLoading} className="button danger" onClick={addExpense}>Usuń i dodaj do wydatków</button>
    </div>
  )
}

export default memo(GoalDeleteConfirmation);