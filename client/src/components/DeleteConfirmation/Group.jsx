import { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDeleteGroupMutation } from '../../app/apiGroup';

import styles from './delete.module.css';

function DeleteGroupConfirmation({ groupId }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [deleteGroup, { isLoading }] = useDeleteGroupMutation();

  const deleteGroupHandler = async () => {
    setError("");
    try {
      await deleteGroup(groupId).unwrap();
      const { deleteGroup: deleteGroupInState } = await import("../../app/appSlice");
      dispatch(deleteGroupInState(groupId));
      navigate("/user");
    }catch(err){
      console.log('deleteGroupHandler', err); 
      if(err?.data?.message) setError(err.data.message);
    }
  }

  return (
    <div className={styles.container}>
      <p>Usunięcie grupy spowoduje trwałe usunięcie wszystkich powiązanych danych finansowych, w tym:</p>
      <ul className={styles.list}>
        <li><span>Wydatki</span>: Wszystkie zapisane informacje o wydatkach grupy zostaną usunięte.</li>
        <li><span>Przychody</span>: Wszelkie dane dotyczące przychodów grupy zostaną skasowane.</li>
        <li><span>Cele finansowe</span>: Wszystkie ustalone cele finansowe zostaną usunięte.</li>
        <li><span>Przyszłe płatności</span>: Usunięte zostaną wszystkie planowane transakcje i płatności.</li>
      </ul>
      <p>Te zmiany są nieodwracalne i nie będzie możliwości przywrócenia danych po ich usunięciu.</p>
      <p><mark>Czy jesteś pewny, że chcesz usunąć tę grupę?</mark></p>
      {error && <p className={styles.error}>{error}</p>}
      <button disabled={isLoading} className="button danger" onClick={deleteGroupHandler}>Usuń grupę</button>
    </div>
  )
}

export default memo(DeleteGroupConfirmation);