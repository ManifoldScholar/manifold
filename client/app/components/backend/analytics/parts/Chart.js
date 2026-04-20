import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { cloneDeep, merge } from "lodash-es";
import { isDate } from "date-fns";
import { useTranslation } from "react-i18next";
import chartOptions from "./chartOptions";

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

const LoadableChart = lazy(() => import("./LoadableChart"));

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
      <Suspense fallback={null}>
        <LoadableChart {...chartProps} />
      </Suspense>
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
