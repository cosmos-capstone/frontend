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
        { name: '현금', value: parseFloat(data.cash || '0'), color: '#dc3545' },
        { name: '예금', value: parseFloat(data.deposit || '0'), color: '#fd7e14' },
        { name: '금', value: parseFloat(data.gold || '0'), color: '#ffc107' },
        { name: '한국 주식', value: parseFloat(data.korean_stock || '0'), color: '#20c997' },
        { name: '한국 채권', value: parseFloat(data.korean_bond || '0'), color: '#198754' },
        { name: '미국 주식', value: parseFloat(data.american_stock || '0'), color: '#0d6efd' },
        { name: '미국 채권', value: parseFloat(data.american_bound || '0'), color: '#003366' },
        { name: '펀드', value: parseFloat(data.fund || '0'), color: '#6610f2' },
        { name: '원자재', value: parseFloat(data.commodity || '0'), color: '#d63384' },
    ];

    // 3% 이하 항목을 기타로 묶기
    const threshold = 3;
    let othersValue = 0;
    const othersLabel: { name: string; value: number }[] = []; // 기타 항목에 포함된 자산 이름과 비율 저장
    const filteredData = originalData.filter(item => {
        if (item.value <= threshold) {
            othersValue += item.value;
            othersLabel.push({ name: item.name, value: item.value }); // 기타 항목에 포함된 자산과 비율 저장
            return false; // "기타"로 묶기 위해 필터에서 제외
        }
        return true; // 3%보다 큰 항목은 유지
    });

    // "기타" 항목을 추가하고 소수점 두 자리로 제한
    if (othersValue > 0) {
        filteredData.push({
            name: '기타',
            value: parseFloat(othersValue.toFixed(2)), // 소수점 두 자리로 제한
            color: '#6c757d' // '기타' 항목의 색상
        });
    }

    const chartData = {
        labels: filteredData.map(item => item.name),
        datasets: [
            {
                data: filteredData.map(item => item.value),
                backgroundColor: filteredData.map(item => item.color),
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
            tooltip: {
                callbacks: {
                    label: function (context) {
                        // '기타' 항목일 때 포함된 항목들 표시
                        if (context.label === '기타' && othersLabel.length > 0) {
                            const othersTooltip = othersLabel.map(
                                item => `- ${item.name}: ${item.value.toFixed(2)}%`
                            );
                            return [`기타: ${context.raw}%`, ...othersTooltip];
                        }
                        // 일반 항목일 때 기본 tooltip 표시
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        },
        cutout: '50%', // 도넛 차트의 가운데 구멍 크기 조절 (50%는 중간 크기)
    };

    return <Doughnut data={chartData} options={options} />;
};

export default PieChart;
