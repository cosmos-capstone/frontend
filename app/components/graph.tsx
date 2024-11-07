import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyRight } from 'd3-sankey';
import Popup from './PopUp';

const SankeyChart = ({ data, width = 600, height = 400 }) => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {

    const drawChart = () => {
      if (!data || !data.nodes || !data.links) {
        console.error("Data is not in the expected format");
        return;
      }

      const format = d3.format(",.0f");

      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current)
        .attr("viewBox", [0, 0, width, height])
        .style("font", "10px sans-serif");

      svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white");

      const sankeyLayout = sankey()
        .nodeId(d => d.name)
        .nodeAlign(sankeyRight)
        .nodeWidth(10)
        .nodePadding(8)
        .extent([[1, 5], [width - 1, height - 5]]);

      const { nodes, links } = sankeyLayout({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
      });

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      svg.append("g")
        .selectAll("rect")
        .data(nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.category))
        .on("click", (event, d) => {
          setSelectedNode(selectedNode === d ? null : d);
          setPopupPosition({
            top: event.clientY,
            left: event.clientX
          });
        })
        .append("title")
        .text(d => `${d.name}\n${format(d.value)} TWh`);

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

      svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name)
        .style("font-size", "10px");
    };

    if (data && data.nodes && data.links && data.nodes.length > 0 && data.links.length > 0) {
      drawChart();
    }
  }, [data, width, height, selectedNode]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1920px', margin: '0 auto' }}>
      <svg ref={svgRef} style={{ width: '100%', height: 'auto', backgroundColor: 'white' }} />
      {selectedNode && (
        <Popup
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          position={popupPosition}
        />
      )}
    </div>
  );
};

export default SankeyChart;