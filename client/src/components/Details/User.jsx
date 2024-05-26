import { useSelector } from 'react-redux';

import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

import Modal, { useModal } from '../../features/modal';
import { formatDate } from '../../utils/format';

import UpdateProfile from '../Forms/UpdateProfile';
import DeleteProfileConfirmation from '../DeleteConfirmation/User';

import AVATAR_W from '../../assets/user3.png';
import AVATAR_M from '../../assets/user2.png';

import styles from './details.module.css';

function UserDetails() {
  const { user } = useSelector(state => state.app);

  const { isOpen: isOpenEditModal, open: openEditModal, close: closeEditModal } = useModal();
  const { isOpen: isOpenDeleteModal, open: openDeleteModal, close: closeDeleteModal } = useModal();

  return (
    <>
      {isOpenEditModal && (
        <Modal title="Edycja profilu" subtitle="Aktualizuj dane osobowe" closeHandler={closeEditModal}>
          <UpdateProfile closeModal={closeEditModal} user={user} />
        </Modal>
      )}
      {isOpenDeleteModal && (
        <Modal title="Usunięcie profilu" subtitle="Potwierdzenie usunięcia danych" closeHandler={closeDeleteModal}>
          <DeleteProfileConfirmation />
        </Modal>
      )}
      <section className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <h2>Witaj, <span>{user.name} {user.surname}!</span></h2>
          </header>
          <div className={styles.content}>
            <div>
              <p>Data utworzenia konta: <span>{formatDate(user.createdAt)}</span></p>
              <p>Data ostatniej aktualizacji: <span>{formatDate(user.updatedAt)}</span></p>
              <p>Adres e-mail: <span>{user.email}</span></p>
            </div>
            <div className={styles.controls}>
              <button className="button" onClick={openEditModal}><CiEdit className="icon" /> Edytuj profil</button>
              <button className="button" onClick={openDeleteModal}><AiOutlineDelete className="icon" /> Usuń profil</button>
            </div>
          </div>
        </div>
        <div className={styles.draw}>
          <img src={user.name.toLowerCase().endsWith('a') ? AVATAR_W : AVATAR_M} alt="user avatar" />
        </div>
      </section>
    </>
  )
}

export default UserDetails;