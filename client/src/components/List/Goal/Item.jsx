import { memo, useMemo } from 'react';

import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

import { formatCurrency, formatDate } from '../../../utils/format';
import { checkDate } from '../../../utils/validation';

import ProgressCircle from '../../ProgressCircle';

import styles from '../list.module.css';

function GoalsItem({ 
  data, 
  currency, 
  showButtons, 
  balance, 
  openUpdateModal, 
  openDeleteModal 
}) { 
  const { name, value, targetDate, user, description, createdAt, updatedAt } = data;

  const badgeConfig = useMemo(() => {
    if(value <= balance){
      return { className: styles.success, content: 'Achieved' };
    }else if(targetDate && !checkDate(targetDate)){
      return { className: styles.danger, content: 'Exceeded' };
    }else{
      return { className: styles.normal, content: 'In progress' };
    }
  }, [value, balance, targetDate]);

  const progress = useMemo(() => {
    if(balance <= 0) return 0;
    return Math.min((balance / value), 1).toFixed(2);
  }, [value, balance]);

  return (
    <article className={`${badgeConfig.className} ${styles.item} ${styles.goal}`} data-value={badgeConfig.content}>
      <div>
        <header className={styles.header}>
          <h3>{name}</h3>
          <div className={styles.progress}><ProgressCircle progress={progress} /></div>
        </header>
        <div className={styles.details}>
          <div className={styles.box}>
            <p><mark>{formatCurrency(balance, currency)}</mark><span>Stan</span></p>
            <p><mark>{formatCurrency(value, currency)}</mark><span>Cel</span></p>
          </div>
          {targetDate && <p><span>Planowana data osiągnięcia:</span> <mark>{formatDate(targetDate)}</mark></p>}
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

export default memo(GoalsItem);
