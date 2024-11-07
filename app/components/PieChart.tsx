import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartData } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
  data: ChartData<'pie'>;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#999',
          font: {
            size: 14,
          },
        },
      },
      datalabels: {
        color: '#f0f0f0',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 8,
        padding: 8,
        font: {
          size: 12,
          weight: 'bold',
        },
        anchor: 'end',
        align: 'start',
        formatter: (value: number, context) => {
          const label = context.chart.data.labels?.[context.dataIndex];
          return `${label}: ${value}%`;
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
