import { useState, useMemo, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';

import { BiDollar } from "react-icons/bi";
import { MdDriveFileRenameOutline, MdOutlineDescription } from "react-icons/md";

import Form from '../../features/form';
import { useAddElementMutation, useUpdateElementMutation } from '../../app/apiGroup';
import { PLAN_ITEM_DATA } from '../../data/form';
import { formatRawDate } from '../../utils/format';

import styles from './forms.module.css';

function FormPlanItem({ 
  closeModal, 
  type, 
  groupId,
  data = null
}) {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const [addElement, { isLoading: isLoadingAddElement }] = useAddElementMutation();
  const [updateElement, { isLoading: isLoadingUpdateElement }] = useUpdateElementMutation();

  const formData = useMemo(() => {
    return Object.entries({ ...PLAN_ITEM_DATA }).reduce((prev, [key, value]) => ({
      ...prev,
      [key]: {
        ...value,
        required: (data || (type === "goals" && key === 'targetDate')) ? false : value.required,
        initialValue: data 
          ? (key === "targetDate" && data[key] ? data[key].slice(0, 10) : data[key]) 
          : (key === "targetDate" ? (type === "goals" ? '' : formatRawDate()) : value.initialValue)
      }
    }), {});
  }, [type, data]);

  const submitHandler = useCallback(async (values) => {
    setError("");

    values.value = parseFloat(values.value);
    if(data) values.id = data._id;

    try {
      const res = data 
        ? (await updateElement({ data: values, groupId, type }).unwrap()) 
        : (await addElement({ data: values, groupId, type }).unwrap());
  
      const { updateGroup } = await import("../../app/appSlice");
      dispatch(updateGroup(res));
      closeModal();
    }catch(err){
      console.log('FormPlanItem', err);
      if(err?.data?.message) setError(err.data.message);
    }
  }, [data, groupId, type, updateElement, addElement, dispatch, closeModal]);
  
  return (
    <div className={styles.wrapper}>
      <Form data={formData}>
        <Form.Content submitHandler={submitHandler}>
          <Form.Input name="name" type="text" icon={<MdDriveFileRenameOutline />} />
          <Form.Input name="value" type="text" icon={<BiDollar />} />
          <Form.Input name="description" type="text" icon={<MdOutlineDescription />} />
          <Form.Input name="targetDate" type="date" />
          {error && <Form.ErrorMessage>{error}</Form.ErrorMessage>}
          <Form.Button title={data ? "Aktualizuj" : "Utwórz"} isLoading={isLoadingAddElement || isLoadingUpdateElement} />
        </Form.Content>
      </Form>
    </div>
  )
}

export default memo(FormPlanItem);