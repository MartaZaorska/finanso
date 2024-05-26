import { useDispatch } from 'react-redux';
import { useDeleteProfileMutation } from '../../app/apiUser';

import InfinityLoader from '../InfinityLoader';

import styles from './delete.module.css';

function DeleteProfileConfirmation() {
  const dispatch = useDispatch();
  const [deleteProfile, { isLoading }] = useDeleteProfileMutation();

  const deleteProfileHandler = async () => {
    try {
      await deleteProfile().unwrap();
      const { logout } = await import("../../app/appSlice");
      dispatch(logout());
    }catch(err){
      console.log('deleteProfileHandler', err); 
    }
  }

  if(isLoading) return <InfinityLoader />

  return (
    <div className={styles.container}>
      <p>Usunięcie profilu jest akcją nieodwracalną i wiąże się z następującymi konsekwencjami:</p>
      <ul className={styles.list}>
        <li>Usunięcie wszystkich Twoich danych osobowych</li>
        <li>Usunięcie wszystkich grup, których jesteś jedynym administratorem</li>
      </ul>
      <p>Te zmiany są trwałe i nie będziesz mógł przywrócić swojego profilu ani danych po ich usunięciu.</p>
      <p><mark>Czy jesteś pewny, że chcesz usunąć swój profil? </mark></p>
      <button disabled={isLoading} className="button danger" onClick={deleteProfileHandler}>Usuń profil</button>
    </div>
  )
}

export default DeleteProfileConfirmation