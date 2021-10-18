import React, {useRef, useEffect} from "react";
import * as d3 from "d3";

const Scatterplot = (props) => {
  const splotSvg = useRef(null);
  const svgSize = props.margin * 2 + props.size;

  const data = props.data;

  useEffect(() => {
    // TODO
    const svg = d3.select(splotSvg.current);

    // x-axis
    let xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => parseFloat(d[0])),
        d3.max(data, (d) => parseFloat(d[0])),
      ])
      .range([0, props.size]);

    let xAxis = svg
      .append("g")
      .attr(
        "transform",
        `translate(${props.margin}, ${props.size + props.margin})`
      )
      .call(d3.axisBottom(xScale));

    // y-axis
    let yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => parseFloat(d[1])),
        d3.max(data, (d) => parseFloat(d[1])),
      ])
      .range([props.size, 0]);

    let yAxis = svg
      .append("g")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .call(d3.axisLeft(yScale));

    // data
    svg
      .append("g")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", (d, i) => "class" + i)
      .attr("r", props.radius)
      .attr("cx", (d) => xScale(parseFloat(d[0])))
      .attr("cy", (d) => yScale(parseFloat(d[1])));
  });

  return (
    <div>
      <svg ref={splotSvg} width={svgSize} height={svgSize}></svg>
    </div>
  );
};

export default Scatterplot;
