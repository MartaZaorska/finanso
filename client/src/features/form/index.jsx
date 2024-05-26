import { memo, useEffect } from 'react';
import { FormContext, useFormValue, useFormContext } from './context';

import styles from './form.module.css';

const Form = ({ children, data }) => {
  return (
    <FormContext.Provider value={useFormValue(data)}>
      {children}
    </FormContext.Provider>
  )
}

Form.Content = memo(function FormContent({ children, submitHandler }){
  const { values } = useFormContext();

  const preSubmitHandler = (e) => {
    e.preventDefault();
    submitHandler(values);
  }

  return (
    <form className={styles.form} onSubmit={preSubmitHandler}>
      {children}
    </form>
  )
});

Form.Header = function FormHeader({ children }){
  return (
    <header className={styles.header}>
      {children}
    </header>
  )
}

Form.Input = memo(function FormInput({ name, type = "text", icon = null, onChangeHandler = () => {} }){
  const { values, data, messages, setValue, validate, deleteMessage } = useFormContext();

  const changeHandler = (e) =>  {
    setValue(name, e.target.value);
    onChangeHandler(e.target.value);
  }

  const blurHandler = (e) => validate(name, e.target.value);

  const focusHandler = () => deleteMessage(name);

  return (
    <div className={styles.control}>
      <div className={`${styles.input} ${messages?.[name] ? styles.error : ''}`}>
        <input 
          type={type} 
          id={name} 
          placeholder={data[name].placeholder} 
          value={values[name]} 
          onChange={changeHandler} 
          onBlur={blurHandler} 
          onFocus={focusHandler} 
        />
        <span className={styles.icon}>{icon}</span>
        <label htmlFor={name}>{data[name].placeholder}</label>
      </div>
      {messages?.[name] && <p className={styles.message}>{messages[name]}</p>}
    </div>
  )
})

Form.Select = memo(function FormSelect({ name, onChangeHandler = () => {} }){
  const { values, data, messages, setValue } = useFormContext();

  const changeHandler = (e) => {
    setValue(name, e.target.value);
    onChangeHandler(e.target.value);
  }

  return (
    <div className={styles.control}>
      <div className={`${styles.input} ${messages?.[name] ? styles.error : ''}`}>
        <select 
          id={name} 
          value={values[name]} 
          onChange={changeHandler}
        >
          {Object.entries(data[name].options).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
        <label htmlFor={name}>{data[name].placeholder}</label>
      </div>
      {messages?.[name] && <p className={styles.message}>{messages[name]}</p>}
    </div>
  )
})

Form.Range = memo(function FormRange({nameFrom, nameTo, type = "text", icon = null}){
  const { values, data, messages, setValue, validate, deleteMessage } = useFormContext();

  const changeHandler = (name) => (e) => setValue(name, e.target.value);
  const blurHandler = (name) => (e) => validate(name, e.target.value);
  const focusHandler = (name) => deleteMessage(name);

  return (
    <div className={`${styles.control} ${styles.range}`}>
      <div className={`${styles.input} ${messages?.[nameFrom] || messages?.[nameTo] ? styles.error : ''}`}>
        <input 
          type={type} 
          id={nameFrom} 
          placeholder={data[nameFrom].placeholder} 
          value={values[nameFrom]} 
          onChange={changeHandler(nameFrom)} 
          onBlur={blurHandler(nameFrom)} 
          onFocus={() => focusHandler(nameFrom)} 
        />
        <span className={styles.icon}>{icon}</span>
        <label htmlFor={nameFrom}>{data[nameFrom].placeholder}</label>
      </div>
      <div className={`${styles.input} ${messages?.[nameFrom] || messages?.[nameTo] ? styles.error : ''}`}>
        <input 
          type={type} 
          id={nameTo} 
          placeholder={data[nameTo].placeholder} 
          value={values[nameTo]} 
          onChange={changeHandler(nameTo)} 
          onBlur={blurHandler(nameTo)} 
          onFocus={() => focusHandler(nameTo)} 
        />
        <span className={styles.icon}>{icon}</span>
        <label htmlFor={nameTo}>{data[nameTo].placeholder}</label>
      </div>
      {messages?.[nameFrom] && <p className={styles.message}>{messages[nameFrom]}</p>}
      {messages?.[nameTo] && messages?.[nameFrom] !== messages?.[nameTo] && <p className={styles.message}>{messages[nameTo]}</p>}
    </div>
  )
})

Form.ErrorMessage = function FormErrorMessage({ children }){
  return (
    <p className={styles.message}>
      {children}
    </p>
  );
}

Form.Button = memo(function FormButton({ isLoading = false, title }){
  const { disabled } = useFormContext();

  return (
    <button type="submit" disabled={disabled || isLoading} className={styles.button}>{title}</button>
  )
});

export default Form;