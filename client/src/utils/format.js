export function formatDate(date, withTime = false){
  const dateObject = new Date(date);
  if(isNaN(dateObject)) return null;

  return withTime 
    ? new Intl.DateTimeFormat('pl-PL', { timeStyle: 'short', dateStyle: 'medium'}).format(dateObject) 
    : new Intl.DateTimeFormat('pl-PL', { dateStyle: 'long'}).format(dateObject);
}

export function formatRawDate(date = new Date()){
  const dateObject = new Date(date);
  if(isNaN(dateObject)) return null;

  const month = `${dateObject.getMonth()+1}`.padStart(2, '0');
  const day = `${dateObject.getDate()}`.padStart(2, '0');

  return `${dateObject.getFullYear()}-${month}-${day}`;
}

export function formatRelativeTime(date){
  const today = new Date();
  const dateObj = new Date(date);

  if(isNaN(dateObj)) return null;

  const rtf = new Intl.RelativeTimeFormat('pl-PL', { numeric: 'auto' });

  const diffInSec = Math.floor((today - dateObj) / 1000);
  if(diffInSec < 60){
    return rtf.format(-diffInSec, 'second');
  }

  const diffInMin = Math.floor(diffInSec / 60);
  if(diffInMin < 60){
    return rtf.format(-diffInMin, 'minute')
  }

  const diffInHours = Math.floor(diffInMin / 60);
  if(diffInHours < 24){
    return rtf.format(-diffInHours, 'hour');
  }
  
  return formatDate(date, true);
}

export function formatCurrency(value, currency){
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).format(value);
}

export function formatAsPercentage(value, minDigits = 2, maxDigits = 2){
  if(value >= 1) return '100%';
  if(value <= 0) return '0%';

  const formatter = new Intl.NumberFormat('pl-PL', {
    style: 'percent',
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  });
  
  return formatter.format(value);
}

export function getFullMonthYear(date){
  const dateObj = new Date(date);

  if(isNaN(dateObj)) return null;
  
  const monthYearFormat = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric'})
  const monthYear = monthYearFormat.format(dateObj);

  return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
}
