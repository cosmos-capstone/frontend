// app/page.tsx
'use client';

import { useEffect, useRef } from 'react';

interface Node {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

interface Flow {
    source: string;
    target: string;
    value: number;
    color: string;
}

const NODES_DATA: Node[] = [
    // 왼쪽 열
    { id: "Nuclear", x: 50, y: 50, width: 30, height: 80, color: "#7FB7BE" },
    { id: "Gas imports", x: 50, y: 140, width: 30, height: 60, color: "#F2D0A4" },
    { id: "Gas reserves", x: 50, y: 210, width: 30, height: 60, color: "#F1828D" },
    { id: "Wind", x: 50, y: 280, width: 30, height: 100, color: "#8FBC94" },
    { id: "Solar", x: 50, y: 390, width: 30, height: 60, color: "#D5A6BD" },
    { id: "Oil imports", x: 50, y: 460, width: 30, height: 80, color: "#FFD700" },
    { id: "Oil reserves", x: 50, y: 550, width: 30, height: 60, color: "#FFA07A" },

    // 중간 열
    { id: "Thermal generation", x: 400, y: 50, width: 30, height: 120, color: "#5B9BD5" },
    { id: "Gas", x: 400, y: 180, width: 30, height: 80, color: "#F2D0A4" },
    { id: "Electricity grid", x: 400, y: 270, width: 30, height: 200, color: "#A5A5A5" },
    { id: "Liquid", x: 400, y: 480, width: 30, height: 130, color: "#FFA07A" },

    // 오른쪽 열
    { id: "Industry", x: 750, y: 50, width: 30, height: 100, color: "#B3B3B3" },
    { id: "Heating & cooling - homes", x: 750, y: 160, width: 30, height: 80, color: "#FF9999" },
    { id: "Transport", x: 750, y: 250, width: 30, height: 150, color: "#C0C0C0" },
    { id: "Losses", x: 750, y: 410, width: 30, height: 100, color: "#FFD700" },
];

const FLOWS_DATA: Flow[] = [
    // Nuclear flows
    { source: "Nuclear", target: "Thermal generation", value: 70, color: "rgba(127, 183, 190, 0.4)" },
    
    // Gas flows
    { source: "Gas imports", target: "Gas", value: 50, color: "rgba(242, 208, 164, 0.4)" },
    { source: "Gas reserves", target: "Gas", value: 40, color: "rgba(241, 130, 141, 0.4)" },
    
    // Wind flows
    { source: "Wind", target: "Electricity grid", value: 90, color: "rgba(143, 188, 148, 0.4)" },
    
    // Thermal generation flows
    { source: "Thermal generation", target: "Electricity grid", value: 100, color: "rgba(91, 155, 213, 0.4)" },
    { source: "Thermal generation", target: "Losses", value: 30, color: "rgba(91, 155, 213, 0.4)" },
    
    // Electricity grid flows
    { source: "Electricity grid", target: "Industry", value: 80, color: "rgba(165, 165, 165, 0.4)" },
    { source: "Electricity grid", target: "Heating & cooling - homes", value: 60, color: "rgba(165, 165, 165, 0.4)" },
    { source: "Electricity grid", target: "Transport", value: 40, color: "rgba(165, 165, 165, 0.4)" },
    
    // Oil and Liquid flows
    { source: "Oil imports", target: "Liquid", value: 70, color: "rgba(255, 215, 0, 0.4)" },
    { source: "Oil reserves", target: "Liquid", value: 50, color: "rgba(255, 160, 122, 0.4)" },
    { source: "Liquid", target: "Transport", value: 90, color: "rgba(255, 160, 122, 0.4)" },
    { source: "Liquid", target: "Losses", value: 30, color: "rgba(255, 160, 122, 0.4)" },
];

const Home = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 캔버스 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 노드 그리기 함수
        const drawNode = (node: Node) => {
            // 노드 그리기
            ctx.fillStyle = node.color;
            ctx.fillRect(node.x, node.y, node.width, node.height);
            
            // 텍스트 그리기
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(node.id, node.x, node.y - 5);
        };

        // 흐름 그리기 함수
        const drawFlow = (flow: Flow) => {
            const sourceNode = NODES_DATA.find(n => n.id === flow.source);
            const targetNode = NODES_DATA.find(n => n.id === flow.target);
            
            if (!sourceNode || !targetNode) return;

            const startX = sourceNode.x + sourceNode.width;
            const startY = sourceNode.y + sourceNode.height/2;
            const endX = targetNode.x;
            const endY = targetNode.y + targetNode.height/2;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            // 베지어 커브 제어점
            const cp1x = startX + (endX - startX) * 0.4;
            const cp1y = startY;
            const cp2x = startX + (endX - startX) * 0.6;
            const cp2y = endY;
            
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

            ctx.strokeStyle = flow.color;
            ctx.lineWidth = flow.value / 3;  // 흐름 두께 조절
            ctx.stroke();
        };

        // 먼저 흐름을 그린 후 노드를 그립니다
        FLOWS_DATA.forEach(drawFlow);
        NODES_DATA.forEach(drawNode);

    }, []);

    return (
        <div className="container">
            <canvas
                ref={canvasRef}
                width={900}
                height={700}
                style={{ 
                    border: '1px solid #ccc',
                    background: 'white'
                }}
            />
        </div>
    );
};

export default Home;