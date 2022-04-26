import React from "react";
import format from "date-fns/format";
import isDate from "date-fns/isDate";

const HIGHLIGHT_COLOR = "#61CAFF";
const AXIS_COLOR = "#9a9a9a";
const GRID_COLOR = "#696969";

const CustomTooltip = ({ tooltipLabel, t }) => ({ active, payload, label }) => {
  if (!active) return null;
  const count = payload ? payload[0].value : 0;
  let date = "";
  if (label) date = isDate(label) ? label : new Date(label);

  return (
    <div className="analytics-chart__tooltip">
      <span className="analytics-chart__tooltip-label">
        {t("dates.date", {
          val: date,
          formatParams: {
            val: { month: "long", day: "numeric" }
          }
        })}
      </span>
      <span className="analytics-chart__tooltip-value">
        {t(tooltipLabel, { count })}
      </span>
    </div>
  );
};

const rechartsOptions = ({ tooltipLabel, t }) => ({
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
    tickFormatter: value =>
      format(value, "MM/dd", {
        locale: t("date_fns", { returnObjects: true })
      }),
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
    content: CustomTooltip({ tooltipLabel, t })
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
