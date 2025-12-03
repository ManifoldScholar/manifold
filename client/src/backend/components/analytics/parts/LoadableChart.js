import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* eslint-disable react/prop-types */
function LoadableChart({
  data,
  chartProps,
  gridProps,
  xAxisProps,
  tooltipProps,
  lineProps
}) {
  return (
    <ResponsiveContainer initialDimension={{ height: 170, width: 700 }}>
      <LineChart data={data} {...chartProps}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="x" {...xAxisProps} />
        <Tooltip {...tooltipProps} />
        <Line dataKey="y" {...lineProps} />
      </LineChart>
    </ResponsiveContainer>
  );
}

LoadableChart.displayName = "Analytics.Block.LoadableChart";

export default LoadableChart;
