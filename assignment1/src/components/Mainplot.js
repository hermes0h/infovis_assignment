import React, {useRef, useEffect} from "react";
import * as d3 from "d3";
import {brush, svg} from "d3";

const Mainplot = (props) => {
  const splotSvg = useRef(null);
  const barplotSvg = useRef(null);
  const svgSize = props.margin * 2 + props.size;

  // TODO
  const data = props.data;

  useEffect(() => {
    /**************************************
     **           Dino plot              **
     **************************************/
    const dino_svg = d3.select(splotSvg.current);

    // x-axis
    let dino_xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => parseFloat(d[0])),
        d3.max(data, (d) => parseFloat(d[0])),
      ])
      .range([0, props.size]);

    const dino_xAxis = d3.axisBottom(dino_xScale);

    dino_svg
      .append("g")
      .attr(
        "transform",
        `translate(${props.margin}, ${props.margin + props.size})`
      )
      .call(dino_xAxis);

    // y-axis
    let dino_yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => parseFloat(d[1])),
        d3.max(data, (d) => parseFloat(d[1])),
      ])
      .range([props.size, 0]);

    const dino_yAxis = d3.axisLeft(dino_yScale);

    dino_svg
      .append("g")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .call(dino_yAxis);

    // data
    dino_svg
      .append("g")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", props.radius)
      .attr("cx", (d) => dino_xScale(parseFloat(d[0])))
      .attr("cy", (d) => dino_yScale(parseFloat(d[1])));

    // brush
    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [props.size, props.size],
      ])
      .on("brush end", brush_select);

    dino_svg
      .append("g")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .call(brush);

    const circle = dino_svg.selectAll("circle");

    // brush - selection
    function brush_select({selection}) {
      let selected = [];
      let selected_idx = [];
      d3.selectAll("circle").style("fill", null);
      if (selection === null) {
        circle.classed("selected", false);
      } else {
        let [[x0, y0], [x1, y1]] = selection;
        circle.classed("selected", (d, i) => {
          let x = dino_xScale(parseFloat(d[0]));
          let y = dino_yScale(parseFloat(d[1]));
          if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
            selected.push(d);
            selected_idx.push(i);
          }
          return x0 <= x && x <= x1 && y0 <= y && y <= y1;
        });
      }
      dino_svg.selectAll(".selected").style("fill", "red");
      let stat = cal_statistics(selected.length > 1 ? selected : data);

      // Update barplot
      update_barplot(stat);

      // Update scatterplot
      selected_idx.forEach((d) =>
        d3.selectAll(".class" + d).style("fill", "red")
      );
    }

    // brush - statistics calculation
    function cal_statistics(selected) {
      let x_mean = d3.mean(selected, (d) => parseFloat(d[0]));
      let x_std = Math.sqrt(d3.variance(selected, (d) => parseFloat(d[0])));
      let y_mean = d3.mean(selected, (d) => parseFloat(d[1]));
      let y_std = Math.sqrt(d3.variance(selected, (d) => parseFloat(d[1])));
      return [x_mean, x_std, y_mean, y_std];
    }

    /**************************************
     **            Bar plot              **
     **************************************/
    // Initializing bar plot
    const bar_svg = d3.select(barplotSvg.current);
    let init_stat = cal_statistics(data);
    let bar_data = [
      {type: "x", value: [init_stat[0], init_stat[1]], color: "#66CDAA"},
      {type: "y", value: [init_stat[2], init_stat[3]], color: "#E3E4FA"},
    ];

    // x-axis (constant)
    let bar_xScale = d3
      .scaleBand()
      .domain(bar_data.map((d) => d.type))
      .range([0, props.size])
      .align(0.5)
      .padding(props.barPadding);

    const bar_xAxis = d3.axisBottom(bar_xScale);

    bar_svg
      .append("g")
      .attr(
        "transform",
        `translate(${props.margin}, ${props.margin + props.size})`
      )
      .call(bar_xAxis);

    // Initial y-axis
    var bar_yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max([
          init_stat[0] + 0.5 * init_stat[1],
          init_stat[2] + 0.5 * init_stat[3],
        ]),
      ])
      .range([props.size, 0]);

    var bar_yAxis = bar_svg
      .append("g")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .call(d3.axisLeft(bar_yScale));

    // Initial data
    let bars = bar_svg
      .append("g")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .selectAll("rect")
      .data(bar_data, (d) => d.type)
      .enter()
      .append("rect")
      .attr("width", bar_xScale.bandwidth())
      .attr("height", (d) => props.size - bar_yScale(d.value[0]))
      .attr("x", (d) => bar_xScale(d.type))
      .attr("y", (d) => bar_yScale(d.value[0]))
      .style("fill", (d) => d.color);

    // Initial line
    let lines = bar_svg
      .append("g")
      .attr("transform", `translate(${props.margin}, ${props.margin})`)
      .selectAll("line")
      .data(bar_data, (d) => d.type)
      .enter()
      .append("line")
      .style("stroke", "black")
      .attr("x1", (d) => bar_xScale(d.type) + 0.5 * bar_xScale.bandwidth())
      .attr("y1", (d) => bar_yScale(d.value[0] - 0.5 * d.value[1]))
      .attr("x2", (d) => bar_xScale(d.type) + 0.5 * bar_xScale.bandwidth())
      .attr("y2", (d) => bar_yScale(d.value[0] + 0.5 * d.value[1]));

    // Update bar plot after brushing
    function update_barplot(stat) {
      // Update y-axis
      bar_yScale
        .domain([0, d3.max([stat[0] + 0.5 * stat[1], stat[2] + 0.5 * stat[3]])])
        .range([props.size, 0]);

      bar_yAxis.call(d3.axisLeft(bar_yScale));

      // Update bars
      bar_data = [
        {type: "x", value: [stat[0], stat[1]]},
        {type: "y", value: [stat[2], stat[3]]},
      ];
      bars = bar_svg
        .selectAll("rect")
        .data(bar_data, (d) => d.type)
        .attr("height", (d) => props.size - bar_yScale(d.value[0]))
        .attr("y", (d) => bar_yScale(d.value[0]));

      // Update lines
      lines = bar_svg
        .selectAll("line")
        .data(bar_data, (d) => d.type)
        .attr("y1", (d) => bar_yScale(d.value[0] - 0.5 * d.value[1]))
        .attr("y2", (d) => bar_yScale(d.value[0] + 0.5 * d.value[1]));
    }
  }, []);

  return (
    <div>
      <svg ref={splotSvg} width={svgSize} height={svgSize}></svg>
      <svg ref={barplotSvg} width={svgSize} height={svgSize}></svg>
    </div>
  );
};

export default Mainplot;
