import { useState, useMemo, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';

import { FaAt } from "react-icons/fa6";
import { IoMdLock } from "react-icons/io";
import { FaUser } from "react-icons/fa";

import Form from '../../features/form';
import { useUpdateProfileMutation } from '../../app/apiUser.js';
import { USER_DATA } from '../../data/form.js';

import styles from './forms.module.css';

function UpdateProfile({ closeModal, user }){
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const formData = useMemo(() => {
    return Object.entries(USER_DATA).reduce((prev, [key, value]) => ({
      ...prev,
      [key]: {
        ...value,
        required: false,
        initialValue: key === "password" ? '' : user[key]
      }
    }), {});
  }, [user]);
  

  const updateHandler = useCallback(async (data) => {
    setError('');

    try {
      const res = await updateProfile(data).unwrap();
      const { setData } = await import("../../app/appSlice.js");
      dispatch(setData(res));
      closeModal();
    }catch(err){
      console.log('updateHandler', err);
      if(err?.data?.message) setError(err.data.message);
    }
  }, [updateProfile, dispatch, closeModal]);

  return (
    <div className={styles.wrapper}>
      <Form data={formData}>
        <Form.Content submitHandler={updateHandler} isLoading={isLoading}>
          <Form.Input name="name" type="text" icon={<FaUser />} />
          <Form.Input name="surname" type="text" icon={<FaUser />} />
          <Form.Input name="email" type="text" icon={<FaAt />} />
          <Form.Input name="password" type="password" icon={<IoMdLock />} />
          {error && <Form.ErrorMessage>{error}</Form.ErrorMessage>}
          <Form.Button title="Aktualizuj" />
        </Form.Content>
      </Form>
    </div>
  )
};

export default memo(UpdateProfile);