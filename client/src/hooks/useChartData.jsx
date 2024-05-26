import { useMemo } from 'react';

import { EXPENSES_CATEGORIES, INCOME_CATEGORIES } from '../data';
import { getTotalValue, getMonths } from '../utils/finance';
import { formatAsPercentage, getFullMonthYear } from '../utils/format';

function filterTransaction(item, startDate, endDate, userId){
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const itemDate = new Date(item.date);
  return itemDate >= start && itemDate <= end && (userId === "all" || item.user._id === userId);
}

function groupByMonthYear(data, back = 6){
  const groupedData = Object.groupBy(data, (item) => new Date(item.date).toISOString().slice(0, 7));
  
  const months = getMonths(back);
  const result = {};

  months.forEach(date => result[date] = groupedData[date] || []);
  return result;
}

function useChartData({
  income, 
  expenses, 
  numberOfMonths = 6, 
  userId = "all", 
  monthYear = "" 
}){
  const [startDate, endDate] = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - numberOfMonths + 1);
    start.setDate(1);
    return [start.toISOString().slice(0,10), end.toISOString().slice(0,10)];
  }, [numberOfMonths]);

  const incomeData = useMemo(() => {
    const data = income.filter(item => filterTransaction(item, startDate, endDate, userId));
    return groupByMonthYear(data, numberOfMonths);
  }, [income, numberOfMonths, startDate, endDate, userId]);

  const expensesData = useMemo(() => {
    const data = expenses.filter(item => filterTransaction(item, startDate, endDate, userId));
    return groupByMonthYear(data, numberOfMonths);
  }, [expenses, numberOfMonths, userId, startDate, endDate]);

  const totalExpensesAmount = useMemo(() => {
    if(!monthYear) return 0;
    return getTotalValue(expensesData[monthYear])
  }, [expensesData, monthYear]);

  const totalIncomeAmount = useMemo(() => {
    if(!monthYear) return 0;
    return getTotalValue(incomeData[monthYear])
  }, [incomeData, monthYear]);

  const balance = useMemo(() => totalIncomeAmount - totalExpensesAmount, [totalExpensesAmount, totalIncomeAmount]);

  const barChartData = useMemo(() => {
    const labels = getMonths(numberOfMonths).map(date => getFullMonthYear(date));
    const incomeValues = Object.values(incomeData).map(items => getTotalValue(items));
    const expensesValues = Object.values(expensesData).map(items => getTotalValue(items));

    return {
      labels,
      datasets: [
        {
          label: 'Przychody',
          data: incomeValues,
          backgroundColor: 'rgba(81, 200, 81, 0.7)'
        },
        {
          label: 'Wydatki',
          data: expensesValues,
          backgroundColor: 'rgba(186, 41, 80, 0.7)'
        }
      ]
    }
  }, [incomeData, expensesData, numberOfMonths]);

  const incomeSummary = useMemo(() => {
    if(!monthYear || incomeData[monthYear].length === 0) return null;

    const groupedByCategory = Object.groupBy(incomeData[monthYear], item => item.category);

    return Object.entries(groupedByCategory).map(([categoryKey, items]) => {
      const totalValue = getTotalValue(items);
      return {
        totalValue,
        name: INCOME_CATEGORIES[categoryKey],
        percentage: formatAsPercentage(totalValue / totalIncomeAmount)
      }
    });
  }, [monthYear, incomeData, totalIncomeAmount]);

  const expensesSummary = useMemo(() => {
    if(!monthYear || expensesData[monthYear].length === 0) return null;

    const groupedByCategory = Object.groupBy(expensesData[monthYear], item => item.category);

    return Object.entries(groupedByCategory).map(([categoryKey, items]) => {
      const totalValue = getTotalValue(items);
      return {
        totalValue,
        name: EXPENSES_CATEGORIES[categoryKey],
        percentage: formatAsPercentage(totalValue / totalExpensesAmount)
      }
    });
  }, [monthYear, expensesData, totalExpensesAmount]);

  return {
    barChartData, 
    incomeSummary,
    expensesSummary,
    balance,
    totalExpensesAmount,
    totalIncomeAmount
  }
}

export default useChartData;