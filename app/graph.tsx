'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';

const SankeyChart = ({ data, width = 600, height = 400 }) => { // width와 height를 props로 받습니다
  const svgRef = useRef(null);

  useEffect(() => {
    if (data && data.nodes && data.links && data.nodes.length > 0 && data.links.length > 0) {
      drawChart();
    }
  }, [data, width, height]);

  const drawChart = () => {
    if (!data || !data.nodes || !data.links) {
      console.error("Data is not in the expected format");
      return;
    }

    const format = d3.format(",.0f");

    // SVG 요소 초기화
    d3.select(svgRef.current).selectAll("*").remove();

    // SVG 생성 및 배경 설정
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

    // 흰색 배경 추가
    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");

    // Sankey 레이아웃 설정
    const sankeyLayout = sankey()
      .nodeId(d => d.name)
      .nodeAlign(sankeyLeft)
      .nodeWidth(10)
      .nodePadding(8)
      .extent([[1, 5], [width - 1, height - 5]]);

    // 데이터 적용
    const { nodes, links } = sankeyLayout({
      nodes: data.nodes.map(d => Object.assign({}, d)),
      links: data.links.map(d => Object.assign({}, d))
    });

    // 색상 스케일 정의
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 노드 그리기
    svg.append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.category))
      .append("title")
        .text(d => `${d.name}\n${format(d.value)} TWh`);

    // 링크 그리기
    svg.append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(links)
      .join("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", d => color(d.source.category))
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("stroke-opacity", 0.5)
      .append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)} TWh`);

    // 노드 레이블 추가
    svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name)
        .style("font-size", "8px"); // 폰트 크기를 줄입니다
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}> {/* 컨테이너 추가 */}
      <svg ref={svgRef} style={{ width: '100%', height: 'auto', backgroundColor: 'white' }} />
    </div>
  );
};

export default SankeyChart;