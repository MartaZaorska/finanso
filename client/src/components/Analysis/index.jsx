import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import Form from '../../features/form';
import useChartData from '../../hooks/useChartData';
import { getMonths } from '../../utils/finance';
import { formatCurrency, getFullMonthYear, formatRawDate } from '../../utils/format';
import { CHART_FILTER_DATA } from '../../data/form';

import CategoryList from '../List/Category';
import Chart from '../Chart';

import styles from './analysis.module.css';

function Analysis() {
  const [monthYear, setMonthYear] = useState(() => formatRawDate().slice(0, 7));
  const [userId, setUserId] = useState('all');

  const { activeGroup: { users, admins, income, expenses, currency } } = useSelector(state => state.app);
  
  const formData = useMemo(() => {
    const usersOptions = [ ...admins, ...users ].reduce((obj, user) => ({ ...obj, [user._id]: `${user.name} ${user.surname}`}), {});
    return {
      ...CHART_FILTER_DATA,
      user: {
        ...CHART_FILTER_DATA.user,
        options: { ...CHART_FILTER_DATA.user.options, ...usersOptions }
      }
    }
  }, [users, admins]);

  const { 
    barChartData,
    balance,
    totalExpensesAmount,
    totalIncomeAmount,
    incomeSummary,
    expensesSummary
  } = useChartData({income, expenses, monthYear, userId, numberOfMonths: 4 });

  const changeMonthHandler = useCallback((index) => {
    const months = getMonths(4);
    setMonthYear(months[index]);
  }, [])

  return (
    <section className={styles.container}>   
      <div className={styles.box}>
        <header className={styles.header}>
          <h3>{getFullMonthYear(monthYear)}</h3>
          <p>Przychody: <span>{formatCurrency(totalIncomeAmount, currency)}</span></p>
          <p>Wydatki: <span>{formatCurrency(totalExpensesAmount, currency)}</span></p>
          <p>Bilans: <span>{formatCurrency(balance, currency)}</span></p>
        </header>
        <div className={styles.category}>
          <h3>Wydatki w kategoriach</h3>
          {!expensesSummary || expensesSummary.length === 0 
            ? <p>Brak wydatków w danym przedziale czasowym</p> 
            : <CategoryList type="expenses" currency={currency} data={expensesSummary} />
          }
        </div>
        <div className={styles.category}>
          <h3>Przychody w kategoriach</h3>
          {!incomeSummary || incomeSummary.length === 0 
            ? <p>Brak przychodów w danym przedziale czasowym</p> 
            : <CategoryList type="income" currency={currency} data={incomeSummary} />
          }
        </div>
      </div> 
      <div className={styles.box}>  
        {Object.keys(formData.user.options).length > 2 && (
          <div className={styles.form}>
            <Form data={formData}>
              <Form.Content submitHandler={() => {}}>
                <Form.Select name="user" onChangeHandler={value => setUserId(value)} />
              </Form.Content>
            </Form>
          </div>
        )}
        <div className={styles.chart}>
          <Chart data={barChartData} onClickHandler={changeMonthHandler} />
        </div>
      </div>
    </section>
  )
}

export default Analysis