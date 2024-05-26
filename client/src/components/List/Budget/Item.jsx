import { memo } from 'react';

import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

import { formatCurrency, formatDate } from '../../../utils/format';
import { INCOME_CATEGORIES, EXPENSES_CATEGORIES } from '../../../data';

import styles from '../list.module.css';

const CATEGORIES = { ...INCOME_CATEGORIES, ...EXPENSES_CATEGORIES };

function BudgetItem({ 
  data, 
  isLoading, 
  currency, 
  showButtons, 
  openUpdateModal, 
  deleteHandler
}) {
  const { type, value, description, category, user, createdAt, updatedAt } = data;

  return (
    <article className={`${styles.item} ${styles[type]}`} data-value={CATEGORIES[category]}>
      <div className={styles.header}>
        <h3>{type === "expenses" && "-"}{formatCurrency(value, currency)}</h3>
        {description && <p><span>Dodatkowy opis:</span> {description}</p>}
        <p><span>Dodano przez:</span> {user.name} {user.surname}</p>
        <p><span>Data dodania:</span> {formatDate(createdAt, true)}</p>
        <p><span>Ostatnia aktualizacja:</span> {formatDate(updatedAt, true)}</p>
        {showButtons && (
          <div className={styles.controls}>
            <button disabled={isLoading} onClick={() => openUpdateModal(data)} className="button"><CiEdit className="icon" /> Edytuj</button>
            <button disabled={isLoading} onClick={() => deleteHandler(data)} className="button danger"><AiOutlineDelete className="icon" /> Usuń</button>
          </div>
        )}
      </div>
    </article>
  )
}

export default memo(BudgetItem);