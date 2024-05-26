import { memo, useCallback, useRef } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  defaults
} from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';

import { BAR_CHART_OPTIONS } from '../../data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

defaults.color = '#6e6e6e';

function Chart({ 
  data, 
  onClickHandler = () => {} 
}){
  const chartRef = useRef();

  const clickHandler = useCallback((e) => {
    const elements = getElementAtEvent(chartRef.current, e);
    if(elements.length === 0) return;
    onClickHandler(elements[0].index);
  }, [chartRef, onClickHandler]);

  return <Bar ref={chartRef} options={BAR_CHART_OPTIONS} data={data} onClick={clickHandler} />
}

export default memo(Chart);