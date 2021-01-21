import React from "react";
import PropTypes from "prop-types";
import ComposedAnalytics from "./composed";
import isString from "lodash/isString";
import isArray from "lodash/isArray";

function Factory({
  view,
  report,
  additionalReport,
  data,
  ...passThroughProps
}) {
  const ComposedComponent = ComposedAnalytics[view];

  if (!data) return null;
  const reports = data.attributes.reports;

  const reportObject =
    isString(report) && isArray(reports)
      ? reports.find(oneReport => oneReport.name === report)
      : null;

  const additionalReportObject =
    isString(additionalReport) && isArray(reports)
      ? reports.find(oneReport => oneReport.name === additionalReport)
      : null;

  const componentData = reportObject ? reportObject.data : data;
  const componentAdditionalData = additionalReportObject
    ? additionalReportObject.data
    : data;
  const meta = reportObject ? reportObject.meta : {};

  if (!ComposedComponent) return `Invalid Analytics Component: ${view}`;

  return (
    <ComposedComponent
      data={componentData}
      additionalData={componentAdditionalData}
      meta={meta}
      {...passThroughProps}
    />
  );
}

Factory.propTypes = {};

Factory.displayName = "Analytics.Composed.Factory";

export default Factory;
