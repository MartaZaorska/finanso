import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { FaAt } from "react-icons/fa6";
import { IoMdLock } from "react-icons/io";
import { FaUser } from "react-icons/fa";

import Form from '../../features/form';
import { useRegisterMutation } from '../../app/apiUser';
import { USER_DATA } from '../../data/form';

import styles from './auth.module.css';

export function Component() {
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const registerHandler = useCallback(async (data) => {
    setError('');
    try {
      const res = await register(data).unwrap();
      const { setData } = await import("../../app/appSlice.js");
      dispatch(setData(res));
    }catch(err){
      //console.error('registerHandler', err);
      if(err?.data?.message) setError(err.data.message);
    }
  }, [register, dispatch]);

  return (
    <div className={styles.container}>
      <Form data={{ ...USER_DATA }}>
        <Form.Header>
          <h2>Rejestracja</h2>
          <p>Utwórz nowe konto.</p>
        </Form.Header>
        <Form.Content submitHandler={registerHandler} isLoading={isLoading}>
          <Form.Input name="name" type="text" icon={<FaUser />} />
          <Form.Input name="surname" type="text" icon={<FaUser />} />
          <Form.Input name="email" type="text" icon={<FaAt />} />
          <Form.Input name="password" type="password" icon={<IoMdLock />} />
          {error && <Form.ErrorMessage>{error}</Form.ErrorMessage>}
          <Form.Button title="Zarejestruj się" />
        </Form.Content>
      </Form>
      <p className={styles.text}>Masz już konto? <Link to="/auth">Przejdź do logowania.</Link></p>
    </div>
  )
}

Component.displayName = "Register";