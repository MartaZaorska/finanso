import { createContext, useState, useMemo, useContext } from "react";

export const FormContext = createContext();

export const useFormValue = (data) => {
  const [messages, setMessages] = useState({});
  const [values, setValues] = useState(() => {
    return Object.entries(data).reduce((prev, [key, value]) => ({ ...prev, [key]: value.initialValue || '' }), {});
  });

  const disabled = useMemo(() => {
    return !Object.entries(values).every(([key, value]) => {
      if(value === "") return !data[key].required; 
      if(typeof data[key]?.validation !== "function") return false;
      
      if(!('rangeName' in data[key])) return !data[key].validation(value);
      
      const valueFrom = values[`${data[key].rangeName}From`];
      const valueTo = values[`${data[key].rangeName}To`];
      return !data[key].validation(valueFrom, valueTo);
    });
  }, [values, data]);

  const setValue = (name, value) => setValues(prev => ({ ...prev, [name]: value }));

  const validate = (name, value) => {
    if(value === "" || typeof data[name]?.validation !== "function"){ 
      setMessages(prev => ({ ...prev, [name]: '' })); 
      return;
    }

    if(!('rangeName' in data[name])){
      setMessages(prev => ({ ...prev, [name]: data[name].validation(value) }));  
      return;
    }
    
    const valueFrom = values[`${data[name].rangeName}From`];
    const valueTo = values[`${data[name].rangeName}To`];
    setMessages(prev => ({ ...prev, [name]: data[name].validation(valueFrom, valueTo) }));
  }

  const deleteMessage = (name) => {
    if(!('rangeName' in data[name])){
      setMessages(prev => ({ ...prev, [name]: '' }));
    }else{
      setMessages(prev => ({
        ...prev,
        [`${data[name].rangeName}From`]: '',
        [`${data[name].rangeName}To`]: ''
      }));
    }
  }

  return {
    data,
    values,
    messages,
    disabled,
    setValue,
    validate,
    deleteMessage
  }
}

export const useFormContext = () => useContext(FormContext);
