import { useState, memo } from 'react';
import { useDispatch } from 'react-redux';

import styles from './delete.module.css';
import { useAddElementMutation, useDeleteElementMutation } from '../../app/apiGroup';

function PaymentDeleteConfirmation({ 
  closeModal, 
  data, 
  groupId,
  openUpdateModal 
}) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [addElement] = useAddElementMutation();
  const [deleteElement] = useDeleteElementMutation();

  const addExpense = async (deleteFlag = false) => {
    setError("");
    setIsLoading(true);

    const body = { value: data.value, description: data.name, category: 'other_expenses' };

    try { 
      const res = await addElement({ data: body, groupId, type: 'expenses' }).unwrap();
      const { updateGroup } = await import("../../app/appSlice");
      dispatch(updateGroup(res));

      if(deleteFlag){
        await deletePayment();
      }else{
        closeModal();
        openUpdateModal();
      }
    }catch(err){
      setIsLoading(false);
      console.log("addExpenseAndDeletePayment", err);
      if(err?.data?.message) setError(err.data.message);
    }
  }

  const deletePayment = async () => {
    setError("");
    setIsLoading(true);

    try {  
      const res = await deleteElement({ groupId, id: data._id, type: 'payments' }).unwrap();
      const { updateGroup } = await import("../../app/appSlice");
      dispatch(updateGroup(res));
      closeModal();
    } catch(err) {
      console.log("deletePayment", err);
      if(err?.data?.message) setError(err.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <p>Twoje opcje do wybory:</p>
      <ol className={styles.list}>
        <li><span>Usuń płatność</span> - Wybierz tę opcję, jeśli chcesz usunąć płatność bez żadnych dodatkowych działań.</li>
        <li><span>Usuń i dodaj do wydatków</span> - Wybierz tę opcję, jeśli płatność została już zrealizowana, a Ty chcesz dodać jej wartość do swoich wydatków. Należy również wybrać kategorię wydatku.</li>
        <li><span>Dodaj jako wydatek i przejdź do edycji</span> - Wybierz tę opcję, jeśli płatność jest odnawialna i chcesz przesunąć jej termin. Płatność zostanie zapisana jako wydatek, a Ty będziesz mógł/mogła zmodyfikować jej przyszły termin.</li>
      </ol>
      {error && <p className={styles.error}>{error}</p>}
      <button disabled={isLoading} className="button danger" onClick={deletePayment}>Usuń płatność</button>
      <button disabled={isLoading} className="button danger" onClick={() => addExpense(true)}>Usuń i dodaj do wydatków</button>
      <button disabled={isLoading} className="button" onClick={() => addExpense(false)}>Dodaj jako wydatek i przejdź do edycji</button>
    </div>
  )
}

export default memo(PaymentDeleteConfirmation);