import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

import ControlPanel from "./ControlPanel";
import TableView from "./TableView";
import { render } from "@testing-library/react";

const Mainplot = (props) => {
    const splotSvg = useRef(null);
    const svgWidth = props.width + 2 * props.margin;
    const svgHeight = props.height + 2 * props.margin;

    const data = props.data;

    /* State Management */
    const default_state = {
        "x": "imdb_rating",
        "y": "us_gross",
        "color": "none",
        "opacity": "none",
        "size": "none"
    };

    const [state, setState] = useState(default_state);

    /* Takes new state dictionary and replace current state with this new state */
    const changeState = (temp) => {
        const new_state = {};
        Object.assign(new_state, temp);
        setState(new_state);
    };

    // Default x-axis
    let xScale = d3.scaleLinear()
        .domain([
            d3.min(data, (d) => parseFloat(d.imdb_rating)),
            d3.max(data, (d) => parseFloat(d.imdb_rating))
        ])
        .range([0, props.width]);

    let xAxis = d3.axisBottom(xScale);

    // Default y-axis
    let yScale = d3.scaleLinear()
        .domain([
            d3.min(data, (d) => parseFloat(d.us_gross)),
            d3.max(data, (d) => parseFloat(d.us_gross))
        ])
        .range([props.height, 0]);

    let yAxis = d3.axisLeft(yScale);

    useEffect(() => {
        const svg = d3.select(splotSvg.current);

        // Default x-axis
        svg.append("g")
            .attr("class", "xaxis")
            .attr("transform",
                `translate(${props.margin}, ${props.margin + props.height})`)
            .call(xAxis);

        // Default y-axis
        svg.append("g")
            .attr("class", "yaxis")
            .attr("transform",
                `translate(${props.margin}, ${props.margin})`)
            .call(yAxis);

        // Default data points
        svg.append("g")
            .attr("transform", `translate(${props.margin}, ${props.margin})`)
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", props.pointSize)
            .attr("cx", (d) => xScale(parseFloat(d.imdb_rating)))
            .attr("cy", (d) => yScale(parseFloat(d.us_gross)))
            .style("fill", null);
    }, []);

    useEffect(() => {
        const svg = d3.select(splotSvg.current);

        // Change x,y-axis corrospondingly
        xScale
            .domain([
                d3.min(data, (d) => parseFloat(d[state["x"]])),
                d3.max(data, (d) => parseFloat(d[state["x"]]))
            ])
            .range([0, props.width]);

        yScale
            .domain([
                d3.min(data, (d) => parseFloat(d[state["y"]])),
                d3.max(data, (d) => parseFloat(d[state["y"]]))
            ])
            .range([props.height, 0]);

        // scale for point color
        let pointColorScale = d3.scaleOrdinal()
            .domain([...new Set(data.map(x => (x[state["color"]])))])
            .range(d3.schemeCategory10);

        // Scale for point opacity
        let pointOpacityScale = d3.scaleLinear()
            .domain([
                d3.min(data, (d) => parseFloat(d[state["opacity"]])),
                d3.max(data, (d) => parseFloat(d[state["opacity"]]))
            ])
            .range([0, 1]);

        // Scale for point size
        let pointSizeScale = d3.scaleLinear()
            .domain([
                d3.min(data, (d) => parseFloat(d[state["size"]])),
                d3.max(data, (d) => parseFloat(d[state["size"]]))
            ])
            .range([props.pointSize, props.maxPointSize]);

        svg.select(".xaxis").transition().duration(1000).call(d3.axisBottom(xScale));
        svg.select(".yaxis").transition().duration(1000).call(d3.axisLeft(yScale));
        svg.selectAll("circle")
            .transition()
            .duration(1000)
            .style("opacity", (d) => {
                return state["opacity"] === "none" ?
                    1 :
                    pointOpacityScale(parseFloat(d[state["opacity"]]));
            })
            .style("fill", (d) => {
                return state["color"] === "none" ?
                    null :
                    pointColorScale(d[state["color"]])
            })
            .attr("r", (d) => {
                return state["size"] === "none" ?
                    props.pointSize :
                    pointSizeScale(parseFloat(d[state["size"]]));
            })
            .attr("cx", (d) => xScale(parseFloat(d[state["x"]])))
            .attr("cy", (d) => yScale(parseFloat(d[state["y"]])));

    }, [state]);

    return (
        <div>
            <div>
                <ControlPanel
                    nominal={props.nominal}
                    ordinal={props.ordinal}
                    quantitative={props.quantitative}
                    state={state}
                    changeState={changeState}
                />
            </div>
            <div>
                <svg ref={splotSvg} width={svgWidth} height={svgHeight}></svg>
            </div>
        </div>
    );

}

export default Mainplot;