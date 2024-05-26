import { useState, useMemo, useCallback } from 'react';
import { formatDate } from '../utils/format';

const initialValue = {
  sortBy: 'newest', 
  type: 'all',
  category: 'all', 
  user: 'all', 
  valueFrom: '', 
  valueTo: '', 
  dateFrom: '', 
  dateTo: ''
};

const useFilters = ({ income, expenses, visible = null }) => {
  const [filters, setFilters] =  useState({ ...initialValue });

  const filteredData = useMemo(() => {
    const incomeData = [...income].map(item => ({ ...item, type: 'income' }));
    const expensesData = [...expenses].map(item => ({ ...item, type: 'expenses' }));

    let data = filters.type === "income" ? incomeData : (filters.type === "expenses" ? expensesData : [...incomeData, ...expensesData]);
    
    if(filters.category !== 'all'){
      data = data.filter(item => item.category === filters.category);
    }
    
    if(filters.user !== "all"){
      data = data.filter(item => item.user._id === filters.user);
    }

    if(filters.valueFrom || filters.valueTo){
      const numFrom = filters.valueFrom ? +filters.valueFrom : 0;
      const numTo = filters.valueTo ? +filters.valueTo : Infinity;
      data = data.filter(item => item.value >= numFrom && item.value <= numTo);
    }

    if(filters.dateFrom || filters.dateTo){
      const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : new Date(0);
      const dateTo = filters.dateTo ? new Date(filters.dateTo) : new Date();
      data = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= dateFrom && itemDate <= dateTo;
      });
    }
    
    const sortComparator = (a, b) => {
      if(b.date === a.date) return new Date(b.createdAt) - new Date(a.createdAt);

      return filters.sortBy === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    }

    return data.sort(sortComparator);

  }, [filters, income, expenses]);

  const data = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return Object.groupBy(filteredData.slice(0, visible || filteredData.length), (item) => {
      const date = item.date.slice(0, 10);
      if(today === date){ 
        return `Dzisiaj, ${formatDate(item.date)}`;
      }else if(yesterday === date){
        return `Wczoraj, ${formatDate(item.date)}`;
      }else return formatDate(item.date);
    }); 
  }, [filteredData, visible]);

  const clearFilters = useCallback(() => setFilters({ ...initialValue }), []);

  return {
    data,
    filters,
    setFilters,
    clearFilters
  }
}

export default useFilters;