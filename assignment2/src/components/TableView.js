import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import MaterialTable from "material-table";


const TableView = (props) => {
    return (
        <div >
            <MaterialTable
                columns={[
                    { title: 'title', field: 'title' },
                    { title: 'genre', field: 'genre' },
                    { title: "creative_type", field: 'creative_type' },
                    { title: "release", field: 'release' },
                    { title: "rating", field: 'rating' }
                ]}
                options={{
                    toolbar: false,
                    paging: false,
                    maxBodyHeight: 350,
                    rowStyle: {
                        fontSize: 12.5
                    }
                }}
                data={props.selected}
            />
        </div>
    )
}

export default TableView;