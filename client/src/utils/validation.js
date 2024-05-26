export function validateEmail(email){
  return email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) ? null : 'Nieprawidłowy adres e-mail';
}

export function validateName(name){
  return name && /^[A-ZŁŻ][a-ząćęłńóśźż]+$/.test(name) ? null : 'Nieprawidłowe imię';
}

export function validateSurname(surname){
  return surname && /^[A-ZĆŁŃŚŹŻ][a-ząćęłńóśźż]+$/.test(surname) ? null : 'Nieprawidłowe nazwisko';
}


export function validatePassword(password){
  return password && password.length >= 8 ? null : 'Hasło musi zawierać przynajmniej 8 znaków';
}

export function validateNumber(value){
  const tmp = `${value}`.replace(',', '.');
  if (!/^\d*\.?\d*$/.test(tmp)) return 'Nieprawidłowa wartość';
  return parseFloat(tmp) > 0 ? null : 'Wartość musi być większa od 0';
}

export function validateRangeNumber(valueFrom, valueTo){
  const validationFromMessage = valueFrom ? validateNumber(valueFrom) : null;
  if (validationFromMessage) return validationFromMessage;

  const validationToMessage = valueTo ? validateNumber(valueTo) : null;
  if (validationToMessage) return validationToMessage;

  if (!valueFrom || !valueTo) return null;

  return parseFloat(valueFrom) <= parseFloat(valueTo) ? null : 'Nieprawidłowy przedział wartości';

}

export function checkDate(value){
  const now = new Date(new Date().toISOString().slice(0, 10));
  return new Date(value) >= now;
}

export function validateFutureDate(value){
  return checkDate(value) ? null : 'Nie można ustawić daty z przeszłości';
}

export function validatePastDate(value){
  const now = new Date(new Date().toISOString().slice(0, 10));
  return new Date(value) <= now ? null : 'Nie można ustawić daty z przyszłości';
}

export function validateRangePastDate(valueFrom, valueTo){
  const validationFromMessage = valueFrom ? validatePastDate(valueFrom) : null;
  if (validationFromMessage) return validationFromMessage;

  const validationToMessage = valueTo ? validatePastDate(valueTo) : null;
  if (validationToMessage) return validationToMessage;

  if (!valueFrom || !valueTo) return null;

  return new Date(valueFrom) <= new Date(valueTo) ? null : 'Nieprawidłowy przedział czasowy';
}