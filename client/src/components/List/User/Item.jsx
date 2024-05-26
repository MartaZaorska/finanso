import { memo } from 'react';

import { RiAdminLine, RiUserLine } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";

import styles from '../list.module.css';

function UserItem({ 
  data, 
  type,
  options,
  removeUser, 
  changeRole 
}) {
  const { isAdmin, userId, showToggle, showLeaveButton } = options;
  const role = type === "admins" ? 'users' : 'admins';

  return (
    <article className={type === "admins" ? `${styles.success} ${styles.item}` : styles.item} data-value="Admin">
      <div className={styles.header}>
        <h3>{data.name} {data.surname}</h3>
        <p>Adres e-mail: <span>{data.email}</span></p>
        <div className={styles.controls}>
          {showToggle[type] && (
            <button className="button secondary" onClick={() => changeRole(role, data._id)}>
              {type === "admins" 
              ? (<><RiUserLine className="icon" /> Zmień na zwykłego użytkownika</>) 
              : (<><RiAdminLine className="icon" /> Nadaj uprawnienia admina</>)}
            </button>
          )}
          {isAdmin && userId !== data._id && 
            <button className="button danger" onClick={() => removeUser(data._id)}><MdOutlineClose className="icon" /> Usuń użytkownika</button>
          }
          {showLeaveButton && userId === data._id && 
            <button className="button danger" onClick={() => removeUser(data._id)}><MdOutlineClose className="icon" /> Opuść grupę</button>
          }
        </div>
      </div>
    </article>
  )
}

export default memo(UserItem);