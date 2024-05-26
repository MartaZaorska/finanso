export function getTotalValue(data = []){
  return data.reduce((total, item) => total + item.value, 0);
}

export function getMonths(months = 6) {
  const result = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      result.push(`${year}-${month}`);
  }

  return result;
}