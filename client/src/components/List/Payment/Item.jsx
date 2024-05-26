import { memo, useMemo } from 'react';

import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

import { formatCurrency, formatDate, formatRawDate } from '../../../utils/format';
import { checkDate } from '../../../utils/validation';

import styles from '../list.module.css';

function PaymentItem({
  data,
  currency,
  showButtons,
  openDeleteModal,
  openUpdateModal
}) {
  const { name, value, targetDate, user, description, createdAt, updatedAt } = data;

  const badgeConfig = useMemo(() => {
    const today = new Date(formatRawDate());
  
    if(new Date(targetDate) - today === 0){
      return { className: styles.success, content: 'Now' };
    }else if(!checkDate(targetDate)){
      return { className: styles.danger, content: 'Overdue' }
    }else {
      return { className: styles.normal, content: 'Upcoming' };
    }
  }, [targetDate]);

  return (
    <article className={`${badgeConfig.className} ${styles.item} ${styles.goal}`} data-value={badgeConfig.content}>
      <div>
        <header className={styles.header}>
          <h3>{name}</h3>
        </header>
        <div className={styles.details}>
          <p><span>Kwota:</span> <mark>{formatCurrency(value, currency)}</mark></p>
          <p><span>Termin płatności:</span> <mark>{formatDate(targetDate)}</mark></p>
          {description && <p><span>Dodatkowy opis:</span> {description}</p>}
          <p><span>Utworzono przez:</span> {user.name} {user.surname}</p>
          <p><span>Data utworzenia:</span> {formatDate(createdAt, true)}</p>
          <p><span>Ostatnia aktualizacja:</span> {formatDate(updatedAt, true)}</p>
        </div>
      </div>
      {showButtons && (
        <div className={styles.controls}>
          <button onClick={() => openUpdateModal(data)} className="button"><CiEdit className="icon" /> Edytuj</button>
          <button onClick={() => openDeleteModal(data)} className="button danger"><AiOutlineDelete className="icon" /> Usuń</button>
        </div>
      )}
    </article>
  )
}

export default memo(PaymentItem);