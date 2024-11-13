import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export interface PieChartData {
    cash: string;
    deposit: string;
    gold: string;
    korean_stock: string;
    korean_bond: string;
    american_stock: string;
    american_bound: string;
    fund: string;
    commodity: string;
}

interface PieChartProps {
    data: PieChartData | null;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    if (!data) {
        return <div>Loading...</div>;
    }

    const originalData = [
        { name: '현금', value: parseFloat(data.cash), color: '#dc3545' },
        { name: '예금', value: parseFloat(data.deposit), color: '#fd7e14' },
        { name: '금', value: parseFloat(data.gold), color: '#ffc107' },
        { name: '한국 주식', value: parseFloat(data.korean_stock), color: '#20c997' },
        { name: '한국 채권', value: parseFloat(data.korean_bond), color: '#198754' },
        { name: '미국 주식', value: parseFloat(data.american_stock), color: '#0d6efd' },
        { name: '미국 채권', value: parseFloat(data.american_bound), color: '#003366' },
        { name: '펀드', value: parseFloat(data.fund), color: '#6610f2' },
        { name: '원자재', value: parseFloat(data.commodity), color: '#d63384' },
    ];

    const formattedData = originalData.filter(item => item.value > 0); // 값이 0인 항목은 필터링

    const chartData = {
        labels: formattedData.map(item => item.name),
        datasets: [
            {
                data: formattedData.map(item => item.value),
                backgroundColor: formattedData.map(item => item.color),
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
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
        cutout: '50%', // 도넛 차트의 가운데 구멍 크기 조절 (50%는 중간 크기)
    };

    return <Doughnut data={chartData} options={options} />;
};

export default PieChart;
