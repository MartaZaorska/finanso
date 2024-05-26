import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { FaAt } from "react-icons/fa6";
import { IoMdLock } from "react-icons/io";

import Form from '../../features/form';
import { useLoginMutation } from '../../app/apiUser';
import { AUTH_DATA } from '../../data/form';

import styles from './auth.module.css';

export function Component() {
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const loginHandler = useCallback(async (data) => {
    setError('');
    try {
      const res = await login(data).unwrap();
      const { setData } = await import("../../app/appSlice.js");
      dispatch(setData(res));
    }catch(err){
      console.error('loginHandler', err);
      if(err?.data?.message) setError(err.data.message);
    }
  }, [login, dispatch]);

  return (
    <div className={styles.container}>
      <Form data={{...AUTH_DATA}}>
        <Form.Header>
          <h2>Logowanie</h2>
          <p>Witamy ponownie. Zaloguj się na swoje konto.</p>
        </Form.Header>
        <Form.Content submitHandler={loginHandler} isLoading={isLoading}>
          <Form.Input name="email" type="text" icon={<FaAt />} />
          <Form.Input name="password" type="password" icon={<IoMdLock />} />
          {error && <Form.ErrorMessage>{error}</Form.ErrorMessage>}
          <Form.Button title="Zaloguj się" />
        </Form.Content>
      </Form>
      <p className={styles.text}>Nie masz jeszcze konta? <Link to="register">Zarejestruj się.</Link></p>
    </div>
  )
}

Component.displayName = "Login";