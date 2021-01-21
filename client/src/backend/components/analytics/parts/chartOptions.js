import React from "react";
import format from "date-fns/format";
import isDate from "date-fns/isDate";
import pluralize from "pluralize";

const HIGHLIGHT_COLOR = "#61CAFF";
const AXIS_COLOR = "#9a9a9a";
const GRID_COLOR = "#696969";

function formatDate(dateStr, pattern = "MMMM d") {
  const date = isDate(dateStr) ? dateStr : new Date(dateStr);
  return format(date, pattern);
}

const CustomTooltip = ({ tooltipLabel }) => ({ active, payload, label }) => {
  if (!active) return null;
  const count = payload ? payload[0].value : 0;
  const formattedLabel = label ? formatDate(label, "MMMM d") : "";

  const formattedValue = `${count} ${
    count === 1 ? tooltipLabel : pluralize(tooltipLabel)
  }`;

  return (
    <div className="analytics-chart__tooltip">
      <span className="analytics-chart__tooltip-label">{formattedLabel}</span>
      <span className="analytics-chart__tooltip-value">{formattedValue}</span>
    </div>
  );
};

const rechartsOptions = ({ tooltipLabel }) => ({
  chartProps: {
    margin: {
      top: 15
    }
  },
  gridProps: {
    vertical: false,
    stroke: GRID_COLOR,
    strokeDasharray: "3 4"
  },
  xAxisProps: {
    type: "number",
    scale: "time",
    stroke: AXIS_COLOR,
    tickFormatter: value => formatDate(value, "MM/dd"),
    interval: "preserveStartEnd",
    minTickGap: 0,
    tickSize: 10,
    tickLine: {
      transform: "translate(0, -10)"
    },
    padding: { right: 1, left: 1 }
  },
  tooltipProps: {
    cursor: false,
    allowEscapeViewBox: false,
    content: CustomTooltip({ tooltipLabel })
  },
  lineProps: {
    type: "monotone",
    stroke: HIGHLIGHT_COLOR,
    strokeWidth: 3,
    dot: false,
    activeDot: {
      stroke: HIGHLIGHT_COLOR,
      r: 6
    },
    animationDuration: 2000
  }
});

export default rechartsOptions;
