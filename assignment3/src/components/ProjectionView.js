import React, {useRef, useEffect} from "react";
import * as d3 from "d3";

import AxisView from "./AxisView";

const ProjectionView = (props) => {
  // ProjectionView spec
  const projectionSvg = useRef(null);
  const svgWidth = props.width + 2 * props.margin;
  const svgHeight = props.height + 2 * props.margin;

  // The data
  const data = props.data;

  // AxisView spec
  const axisWidth = 500;
  const axisHeight = 500;
  const axisRadius = 180;
  const axisPointSize = 12;

  useEffect(() => {
    const svg = d3.select(projectionSvg.current);

    // svg.append("circle")
    //     .attr('cx', 150)
    //     .attr('cy', 150)
    //     .attr('r', props.radius);
  }, []);

  return (
    <div style={{display: "flex"}}>
      <svg ref={projectionSvg} width={svgWidth} height={svgHeight}></svg>
      <div>
        <AxisView
          radius={axisRadius}
          pointSize={axisPointSize}
          width={axisWidth}
          height={axisHeight}
          margin={props.margin}
          attr={props.attr}
        />
        {/* <LegendView></LegendView> */}
      </div>
    </div>
  );
};

export default ProjectionView;
