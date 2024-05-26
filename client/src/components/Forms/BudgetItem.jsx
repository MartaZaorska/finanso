import { useState, useMemo, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';

import { BiDollar } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";

import Form from '../../features/form';
import { useAddElementMutation, useUpdateElementMutation } from '../../app/apiGroup';
import { INCOME_DATA, EXPENSE_DATA } from '../../data/form';

import styles from './forms.module.css';

function FormBudgetItem({ 
  closeModal,
  groupId,
  data = null,
  type = null
}){
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const [addElement, { isLoading: isLoadingAddElement }] = useAddElementMutation();
  const [updateElement, { isLoading: isLoadingUpdateElement }] = useUpdateElementMutation();

  const formData = useMemo(() => {
    const FORM_DATA = type === "income" || data?.type === "income" ? { ...INCOME_DATA } : { ...EXPENSE_DATA }; 

    if(!data) return FORM_DATA;

    return Object.entries(FORM_DATA).reduce((prev, [key, value]) => ({
      ...prev,
      [key]: {
        ...value,
        required: false,
        initialValue: key === "date" ? data[key].slice(0, 10) : data[key]
      }
    }), {});
  }, [type, data]);

  const submitHandler = useCallback(async (values) => {
    setError("");

    values.value = parseFloat(values.value);
    if(data) values.id = data._id;

    try {
      const res = data 
        ? (await updateElement({ data: values, groupId, type: data.type }).unwrap()) 
        : (await addElement({ data: values, groupId, type }).unwrap());

      const { updateGroup } = await import("../../app/appSlice");
      dispatch(updateGroup(res));
      closeModal();
    }catch(err){
      console.log('FormBudgetItem', err);
      if(err?.data?.message) setError(err.data.message);
    }
  }, [data, type, groupId, closeModal, dispatch, addElement, updateElement]);

  return (
    <div className={styles.wrapper}>
      <Form data={formData}>
        {!data && (
          <Form.Header>
            <p>Dodaj nowy {type === "income" ? 'przychód' : 'wydatek'}</p>
          </Form.Header>
        )}
        <Form.Content submitHandler={submitHandler} isLoading={isLoadingAddElement || isLoadingUpdateElement}>
          <Form.Input name="value" type="text" icon={<BiDollar />} />
          <Form.Input name="description" type="text" icon={<MdOutlineDescription />} />
          <Form.Input name="date" type="date" />
          <Form.Select name="category" />
          {error && <Form.ErrorMessage>{error}</Form.ErrorMessage>}
          <Form.Button title={data ? 'Aktualizuj' : 'Utwórz'} />
        </Form.Content>
      </Form>
    </div>
  )
}

export default memo(FormBudgetItem);