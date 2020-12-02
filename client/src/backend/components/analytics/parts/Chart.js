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

function Chart({ options, series, type = "line", height = 175 }) {
  const mergedOptions = merge({}, cloneDeep(defaultOptions), options);
  const chartProps = {
    series,
    options: mergedOptions,
    type,
    height
  };
  return <LoadableChart {...chartProps} />;
}

Chart.propTypes = {
  options: PropTypes.object,
  series: PropTypes.array.isRequired,
  type: PropTypes.string,
  height: PropTypes.number
};

Chart.displayName = "Analytics.Block.Chart";

export default Chart;
