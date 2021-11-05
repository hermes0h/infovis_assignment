import React, { useState } from "react";
import * as d3 from "d3";
import Select from 'react-select';

const ControlPanel = (props) => {

    const quantitative_options = props.quantitative.map(x => ({ value: x, label: x }));
    const color_options = props.nominal.concat(props.ordinal).map(x => ({ value: x, label: x }));
    const opacity_options = props.quantitative.map(x => ({ value: x, label: x }));
    const size_options = props.quantitative.map(x => ({ value: x, label: x }));

    // Insert 'none' option
    color_options.unshift({ value: "none", label: "none" });
    opacity_options.unshift({ value: "none", label: "none" });
    size_options.unshift({ value: "none", label: "none" });

    return (
        <div style={{ display: "flex" }}>
            <h4 style={{ marginRight: 15, marginTop: 5 }}>
                {"x: "}
            </h4>
            <Select
                options={quantitative_options}
                defaultValue={{ value: "imdb_rating", label: "imdb_rating" }}
                onChange={(value) => {
                    props.state["x"] = value.value;
                    props.changeState(props.state);
                }}>
            </Select>
            <h4 style={{ marginLeft: 25, marginRight: 15, marginTop: 5 }}>
                {"y: "}
            </h4>
            <Select
                options={quantitative_options}
                defaultValue={{ value: "us_gross", label: "us_gross" }}
                onChange={(value) => {
                    props.state["y"] = value.value;
                    props.changeState(props.state);
                }}>
            </Select>
            <h4 style={{ marginLeft: 25, marginRight: 15, marginTop: 5 }}>
                {"Color: "}
            </h4>
            <Select
                options={color_options}
                defaultValue={{ value: "none", label: "none" }}
                onChange={(value) => {
                    props.state["color"] = value.value;
                    props.changeState(props.state);
                }}>
            </Select>
            <h4 style={{ marginLeft: 25, marginRight: 15, marginTop: 5 }}>
                {"Opacity: "}
            </h4>
            <Select
                options={opacity_options}
                defaultValue={{ value: "none", label: "none" }}
                onChange={(value) => {
                    props.state["opacity"] = value.value;
                    props.changeState(props.state);
                }}>
            </Select>
            <h4 style={{ marginLeft: 25, marginRight: 15, marginTop: 5 }}>
                {"Size: "}
            </h4>
            <Select
                options={size_options}
                defaultValue={{ value: "none", label: "none" }}
                onChange={(value) => {
                    props.state["size"] = value.value;
                    props.changeState(props.state);
                }}>
            </Select>
        </div>
    )
}

export default ControlPanel;