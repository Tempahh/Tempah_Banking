'use client'

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts} : DoughnutChartProps) => {
    const data = {
        datasets: [
            {
                label: 'Banks',
                data: [12, 19],
                backgroundColor: [ '#FF6633', '#FFB399'],
            }
        ],
        labels: ['RedBank', 'OrangeBank']
    }
  return <Doughnut 
    data={data} 
    options={
        {
            cutout: '59%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    }
    />;
}

export default DoughnutChart
