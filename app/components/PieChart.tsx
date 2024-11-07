import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
  data: any;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const formattedData = [
    { name: '현금', value: parseFloat(data.cash) },
    { name: '예금', value: parseFloat(data.deposit) },
    { name: '금', value: parseFloat(data.gold) },
    { name: '한국 주식', value: parseFloat(data.korean_stock) },
    { name: '미국 주식', value: parseFloat(data.american_stock) },
    { name: '한국 채권', value: parseFloat(data.korean_bond) },
    { name: '미국 채권', value: parseFloat(data.american_bound) },
    { name: '펀드', value: parseFloat(data.fund) },
    { name: '원자재', value: parseFloat(data.commodity) },
  ];

  const chartData = {
    labels: formattedData.map(item => item.name),
    datasets: [
      {
        data: formattedData.map(item => item.value),
        backgroundColor: [
          '#20c997',
          '#0d6efd',
          '#6f42c1',
          '#d63384',
          '#ffc107',
          '#fd7e14',
          '#dc3545',
          '#6610f2',
          '#198754',
        ],
        borderColor: [
          '#20c997',
          '#0d6efd',
          '#6f42c1',
          '#d63384',
          '#ffc107',
          '#fd7e14',
          '#dc3545',
          '#6610f2',
          '#198754',
        ],
        borderWidth: 1,
      },
    ],
  };

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

  return <Pie data={chartData} options={options} />;
};

export default PieChart;