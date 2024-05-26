import { useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useGetProfileQuery } from '../../app/apiUser';
import { setData } from '../../app/appSlice';

import Header from '../Header';
import Loader from '../Loader';

import styles from './layout.module.css';

function Layout() {
  const dispatch = useDispatch();

  const { data, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if(data) dispatch(setData(data));
  }, [data])

  if(isLoading) return <Loader />

  return (
    <div className={styles.container}>
      <Header />
      <Outlet />
      <ScrollRestoration />
    </div>
  )
}

export default Layout