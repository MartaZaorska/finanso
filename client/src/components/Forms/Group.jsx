import { useState, useMemo, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';

import { MdDriveFileRenameOutline } from "react-icons/md";

import { useCreateGroupMutation, useUpdateGroupMutation } from '../../app/apiGroup';

import Form from '../../features/form';
import { GROUP_DATA } from '../../data/form';

import styles from './forms.module.css';

function FormGroup({ 
  closeModal, 
  data = null 
}) {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const [createGroup, { isLoading: isLoadingCreateGroup }] = useCreateGroupMutation();
  const [updateGroup, { isLoading: isLoadingUpdateGroup }] = useUpdateGroupMutation();

  const formData = useMemo(() => {
    if(!data) return { ...GROUP_DATA };
    return Object.entries(GROUP_DATA).reduce((prev, [key, value]) => ({
      ...prev,
      [key]: {
        ...value,
        required: false,
        initialValue: data[key]
      }
    }), {});
  }, [data]);

  const submitHandler = useCallback(async (values) => {
    setError("");

    if(data) values.groupId = data.groupId;

    try {
      const res = data 
        ? (await updateGroup(values).unwrap()) 
        : (await createGroup(values).unwrap());

      const { updateGroup: updateGroupInState } = await import("../../app/appSlice");
      dispatch(updateGroupInState(res));
      closeModal();
    }catch(err){
      console.log('FormGroup', err);
      if(err?.data?.message) setError(err.data.message);
    }
  }, [data, updateGroup, createGroup, dispatch, closeModal]);

  return (
    <div className={styles.wrapper}>
      <Form data={formData}>
        <Form.Content submitHandler={submitHandler} isLoading={isLoadingCreateGroup || isLoadingUpdateGroup}>
          <Form.Input type="text" name="name" icon={<MdDriveFileRenameOutline />} />
          <Form.Select name="currency" />
          {error && <Form.ErrorMessage>{error}</Form.ErrorMessage>}
          <Form.Button title={data ? 'Aktualizuj' : 'Utwórz'} />
        </Form.Content>
      </Form>
    </div>
  )
}

export default memo(FormGroup);