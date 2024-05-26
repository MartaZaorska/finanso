import { useMemo, useState, useCallback, memo } from 'react';

import Form from '../../features/form';
import { FILTER_DATA } from '../../data/form';
import { INCOME_CATEGORIES, EXPENSES_CATEGORIES } from '../../data';

import styles from './forms.module.css';

function FilterPanel({  
  users, 
  filters,
  setFilters, 
  closeModal
}) {
  const [type, setType] = useState(filters.type);

  const categories = useMemo(() => {
    return type === "all" 
      ? { ...INCOME_CATEGORIES, ...EXPENSES_CATEGORIES } 
      : (type === "income" ? { ...INCOME_CATEGORIES } : { ...EXPENSES_CATEGORIES });
  }, [type]);

  const usersData = useMemo(() => users.reduce((prev, user) => ({
    ...prev,
    [user._id]: `${user.name} ${user.surname}`
  }), {}), [users]);

  const formData = useMemo(() => {
    return Object.entries(FILTER_DATA).reduce((prev, [key, value]) => ({
      ...prev,
      [key]: {
        ...value,
        initialValue: filters[key],
        options: key === 'category' 
          ? { ...value.options, ...categories } 
          : (key === "user" ? { ...value.options, ...usersData } : value.options)
      }
    }), {});
  }, [usersData, categories, filters, type]);

  const filterHandler = useCallback(data => {
    setFilters(data);
    closeModal();
  }, [closeModal]);

  return (
    <div className={styles.wrapper}>
      <Form data={formData}>
        <Form.Content submitHandler={filterHandler}>
          <Form.Select name="sortBy" />
          <Form.Select name="type" onChangeHandler={value => setType(value)} />
          <Form.Select name="category" />
          {Object.keys(usersData).length >= 2 && <Form.Select name="user" />}
          <Form.Range nameFrom="dateFrom" nameTo="dateTo" type="date" />
          <Form.Range nameFrom="valueFrom" nameTo="valueTo" type="text" />
          <Form.Button isLoading={false} title="Pokaż wyniki" />
        </Form.Content>
      </Form>
    </div>
  )
}

export default memo(FilterPanel);