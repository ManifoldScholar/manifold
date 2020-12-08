import React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import defaultOptions from "./chartDefaultOptions";

/* eslint-disable react/prop-types */
const LoadableChart = Loadable({
  loader: () =>
    import(/* webpackChunkName: "apex-charts" */ "./ApexChart").then(
      ApexChart => ApexChart.default
    ),
  loading: () => null,
  render(LineGraph, props) {
    return <LineGraph {...props} />;
  }
});
/* eslint-enable react/prop-types */

function Chart({ options, data, dataLabel, type = "line", height = 175 }) {
  const series = [
    {
      name: dataLabel,
      data: data.map(point => point.y)
    }
  ];
  const withLabels = {
    labels: data.map(point => new Date(point.x).getTime())
  };
  const mergedOptions = merge({}, cloneDeep(defaultOptions), options, withLabels);
  const chartProps = {
    series,
    options: mergedOptions,
    type,
    height
  };
  return <LoadableChart {...chartProps} />;
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.number
  })).isRequired,
  dataLabel: PropTypes.string.isRequired,
  options: PropTypes.object,
  type: PropTypes.string,
  height: PropTypes.number
};

Chart.displayName = "Analytics.Block.Chart";

export default Chart;
