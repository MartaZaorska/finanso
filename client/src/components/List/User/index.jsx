import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MdAdd } from "react-icons/md";

import Modal, { useModal } from '../../../features/modal';
import { useChangeUserRoleMutation, useRemoveUserMutation } from '../../../app/apiGroup';

import AddUserToGroup from '../../Forms/AddUserToGroup';
import UserItem from './Item';

import styles from '../list.module.css';

function UserList() {
  const { 
    user: { _id: userId }, 
    activeGroup: { _id: groupId, admins, users, isAdmin } 
  } = useSelector(state => state.app);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [changeRole] = useChangeUserRoleMutation();
  const [removeUser] = useRemoveUserMutation();

  const { isOpen, open, close } = useModal();

  const options = useMemo(() => {
    return {
      userId,
      isAdmin,
      showToggle: { admins: isAdmin && admins.length > 1, users: isAdmin && users.length > 0 },
      showLeaveButton: !(isAdmin && admins.length === 1)
    }
  }, [userId, admins, users]);

  const changeRoleHandler = useCallback(async (role, userId) => {
    try {
      const res = await changeRole({ groupId, role, userId }).unwrap();
      const { updateGroup } = await import("../../../app/appSlice");
      dispatch(updateGroup(res));
    }catch(err){
      console.log('changeRoleHandler', err);
    }
  }, [changeRole, groupId, dispatch]);

  const removeUserHandler = useCallback(async (id) => {
    try {
      const res = await removeUser({ groupId, userId: id }).unwrap();
      const { updateGroup, deleteGroup } = await import("../../../app/appSlice");

      if(id === userId){
        dispatch(deleteGroup(groupId));
        navigate("/user");
      }else{
        dispatch(updateGroup(res));
      }
    }catch(err){
      console.log('removeUserHandler', err);
    }
  }, [groupId, removeUser, dispatch, navigate]);

  return (
    <>
      {isOpen && (
        <Modal title="Dodaj użytkownika" closeHandler={close}>
          <AddUserToGroup groupId={groupId} closeModal={close} />
        </Modal>
      )}
      <section className={styles.container}>
        <header className={styles.header}>
          <h2>Użytkownicy</h2>
        </header>
        <div className={styles.content}>
          {admins.map(admin => (
            <UserItem 
              key={admin._id} 
              data={admin} 
              type="admins"
              options={options}  
              removeUser={removeUserHandler} 
              changeRole={changeRoleHandler} 
            />
          ))}
          {users.map(user => (
            <UserItem 
              key={user._id}
              data={user}  
              type="users"
              options={options}
              removeUser={removeUserHandler}
              changeRole={changeRoleHandler}
            />
          ))}
        </div>
        <button className="button" onClick={open}><MdAdd className="icon" /> Dodaj użytkownika</button>
      </section>
    </>
  )
}

export default UserList