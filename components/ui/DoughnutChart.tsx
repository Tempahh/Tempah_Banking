'use client'

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const DoughnutChart = ({accounts} : DoughnutChartProps) => {

    const accountNames = accounts.map((account) => account.name);
    const accountBalances = accounts.map((account) => account.currentBalance);

    const data = {
        datasets: [
            {
                label: 'Banks',
                data: accountBalances,
                backgroundColor: [ '#FF6633', '#FFB399'],
            }
        ],
        labels: accountNames
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
