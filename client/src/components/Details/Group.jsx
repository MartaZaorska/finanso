import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

import Modal, { useModal } from '../../features/modal';
import { formatDate } from '../../utils/format';
import { CURRENCY } from '../../data';

import FormGroup from '../Forms/Group';
import DeleteGroupConfirmation from '../DeleteConfirmation/Group';

import SETTINGS_DRAW from '../../assets/settings.png';
import styles from './details.module.css';

function GroupDetails() {
  const { activeGroup } = useSelector(state => state.app);
  const { _id: groupId, name, createdAt, updatedAt, currency, isAdmin } = activeGroup;
  
  const { isOpen: isOpenEditModal, open: openEditModal, close: closeEditModal } = useModal();
  const { isOpen: isOpenDeleteModal, open: openDeleteModal, close: closeDeleteModal } = useModal();

  return (
    <>
      {isOpenEditModal && isAdmin && (
        <Modal title="Edycja grupy" subtitle="Aktualizuj dane grupy" closeHandler={closeEditModal}>
          <FormGroup closeModal={closeEditModal} data={{ name, currency, groupId }} />
        </Modal>
      )}
      {isOpenDeleteModal && isAdmin && (
        <Modal title="Usunięcie grupy" subtitle="Potwierdzenie usunięcia danych" closeHandler={closeDeleteModal}>
          <DeleteGroupConfirmation groupId={groupId} />
        </Modal>
      )}
      <section className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <h2><span>{name}</span></h2>
          </header>
          <div className={styles.content}>
            <div>
              <p>Data utworzenia grupy: <span>{formatDate(createdAt, true)}</span></p>
              <p>Data ostatniej aktualizacji: <span>{formatDate(updatedAt, true)}</span></p>
              <p>Waluta: <span>{CURRENCY[currency]}</span></p>
            </div>
            {isAdmin && (
              <div className={styles.controls}>
                <button className="button" onClick={openEditModal}><CiEdit className="icon" /> Edytuj grupę</button>
                <button className="button" onClick={openDeleteModal}><AiOutlineDelete className="icon" /> Usuń grupę</button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.draw}>
          <img src={SETTINGS_DRAW} alt="settings icon" />
        </div>
      </section>
    </>
  )
}

export default GroupDetails