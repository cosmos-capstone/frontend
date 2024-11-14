import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

interface SharpeRatioData {
  [key: string]: number;
}

interface BarChartProps {
  data: SharpeRatioData;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const labels = Object.keys(data).map(key => key);
  const chartData = {
    labels,
    datasets: [
      {
        label: '샤프 지수',
        data: Object.values(data),
        backgroundColor: '#4F46E5',
        borderColor: '#3B82F6',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6, // 막대 너비 조정
        hoverBackgroundColor: '#6366F1',
        hoverBorderColor: '#4F46E5',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: '#333',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        callbacks: {
          label: function (context) {
            return `샤프 지수: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '샤프 지수',
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#555',
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#E5E7EB',
        },
      },
      x: {
        title: {
          display: true,
          text: '자산 분류',
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#555',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
export type { SharpeRatioData };
