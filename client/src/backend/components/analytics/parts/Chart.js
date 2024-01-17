import React from "react";
import PropTypes from "prop-types";
import Loadable from "@docusaurus/react-loadable";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import isDate from "date-fns/isDate";
import chartOptions from "./chartOptions";
import { useTranslation } from "react-i18next";

function stringToDate(dateStr) {
  // TODO: Remove hardcoded time zone once it's removed from the API.
  // I replaced this with a vanilla js date constructor because we're only getting date, not timestamp, data. -LD
  return isDate(dateStr) ? dateStr : new Date(dateStr);
}

function shapeData({ x, y }) {
  return {
    x: stringToDate(x),
    y
  };
}

/* eslint-disable react/prop-types */
const LoadableChart = Loadable({
  loader: () => import(/* webpackChunkName: "recharts" */ "./Recharts"),
  loading: () => null,
  render(loaded, props) {
    const {
      LineChart,
      Line,
      XAxis,
      CartesianGrid,
      Tooltip,
      ResponsiveContainer
    } = loaded;
    const {
      data,
      chartProps,
      gridProps,
      xAxisProps,
      tooltipProps,
      lineProps
    } = props;

    return (
      <ResponsiveContainer>
        <LineChart data={data} {...chartProps}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="x" {...xAxisProps} />
          <Tooltip {...tooltipProps} />
          <Line dataKey="y" {...lineProps} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
});
/* eslint-enable react/prop-types */

function Chart({ options, data, tooltipLabel, height = 170 }) {
  const { t } = useTranslation();
  const shapedData = data?.map(point => shapeData(point));
  const start = shapedData[0]?.x.getTime() || "auto";
  const end = shapedData[shapedData.length - 1]?.x.getTime() || "auto";
  const xAxisDomain = [start, end];
  const mergedOptions = merge(
    {},
    cloneDeep(chartOptions({ tooltipLabel, t })),
    options,
    {
      xAxisProps: {
        domain: xAxisDomain
      }
    }
  );

  const chartProps = {
    ...mergedOptions,
    data: shapedData
  };
  return (
    <div className="analytics-chart" style={{ width: "100%", height }}>
      <LoadableChart {...chartProps} />
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.string,
      y: PropTypes.number
    })
  ).isRequired,
  options: PropTypes.object,
  type: PropTypes.string,
  height: PropTypes.number
};

Chart.displayName = "Analytics.Block.Chart";

export default Chart;
