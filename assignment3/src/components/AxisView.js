import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const AxisView = (props) => {
  const axisSvg = useRef(null);
  const svgWidth = props.width + 2 * props.margin;
  const svgHeight = props.height + 2 * props.margin;

  let xScale = d3.scaleLinear().domain([-1, 1]).range([0, props.width]);

  let yScale = d3.scaleLinear().domain([-1, 1]).range([0, props.height]);

  let radius_factor = (props.radius * 2) / props.width;

  useEffect(() => {
    const svg = d3.select(axisSvg.current);

    // The axisDomain
    svg
      .append("g")
      .append("circle")
      .attr("class", "axisDomain")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .attr("cx", xScale(0))
      .attr("cy", yScale(0))
      .attr("r", props.radius)
      .style("stroke-dasharray", "3, 3")
      .style("stroke", "black")
      .style("fill", "none");

    // The axisCircles
    svg
      .append("g")
      .selectAll("circle")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .data(props.attr)
      .enter()
      .append("circle")
      .attr("r", props.pointSize)
      .attr("cx", (d, i) =>
        xScale(
          Math.cos(((Math.PI * 2) / props.attr.length) * i) * radius_factor
        )
      )
      .attr("cy", (d, i) =>
        yScale(
          Math.sin(((Math.PI * 2) / props.attr.length) * i) * radius_factor
        )
      );
  }, []);

  return (
    <div>
      <svg ref={axisSvg} width={svgWidth} height={svgHeight}></svg>
    </div>
  );
};

export default AxisView;
