import { useState, memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { FaAt } from "react-icons/fa6";

import { useAddUserMutation } from '../../app/apiGroup';

import Form from '../../features/form';
import { USER_DATA } from '../../data/form';

import styles from './forms.module.css';

function AddUserToGroup({ groupId, closeModal }) {
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const [addUser, {isLoading}] = useAddUserMutation();

  const addUserHandler = useCallback(async (data) => {
    setError("");
    try {
      const res = await addUser({ email: data.email, groupId }).unwrap();
      const { updateGroup } = await import("../../app/appSlice");
      dispatch(updateGroup(res));
      closeModal();
    }catch(err){
      console.log('addUserHandler', err);
      if(err?.data?.message) setError(err.data.message);
    }
  }, [groupId, dispatch, addUser, closeModal]);

  return (
    <div className={styles.wrapper}>
      <Form data={{ email: { ...USER_DATA.email }}}>
        <Form.Header>
          <p>Podaj adres e-mail osoby, którą chcesz dodać do grupy. Użytkownik musi mieć już założone konto w systemie. Upewnij się, że wpisujesz prawidłowy adres e-mail, który odpowiada istniejącemu profilowi użytkownika.</p>
        </Form.Header>
        <Form.Content submitHandler={addUserHandler}>
          <Form.Input name="email" type="text" icon={<FaAt />} />
          {error && <Form.ErrorMessage>{error}</Form.ErrorMessage>}
          <Form.Button title="Dodaj użytkownika" isLoading={isLoading} />
        </Form.Content>
      </Form>
    </div>
  )
}

export default memo(AddUserToGroup);