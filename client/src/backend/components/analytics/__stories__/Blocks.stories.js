import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import { ComposedAnalytics } from "backend/components/analytics";

const statistics = {
  attributes: {
    totalProjectCount: 80,
    totalTextCount: 179,
    totalResourceCount: 98,
    totalUserCount: 38,
    totalAnnotationCount: 103,
    totalCommentCount: 26
  }
};

function findData(name) {
  const {
    attributes: { data }
  } = fixtures.factory("globalAnalytics");
  return data.find(element => element.name === name);
}

storiesOf("Backend/Analytics/Block", module)
  .add("Average Visit", () => (
    <ComposedAnalytics.AverageVisit data={findData("average_visit_duration")} />
  ))
  .add("Collected", () => (
    <ComposedAnalytics.Collected data={findData("favorited_projects")} />
  ))
  .add("Interaction", () => (
    <ComposedAnalytics.Interactions data={findData("active_users")} />
  ))
  .add("Return Visits", () => (
    <ComposedAnalytics.ReturnVisits data={findData("returning_visitors")} />
  ))
  .add("Site Statistics", () => (
    <ComposedAnalytics.SiteStatistics statistics={statistics} />
  ))
  .add("Most Viewed Projects", () => (
    <ComposedAnalytics.TopProjects data={findData("top_projects")} />
  ))
  .add("Top Searches", () => (
    <ComposedAnalytics.TopSearches data={findData("top_search_terms")} />
  ))
  .add("Visitors", () => (
    <ComposedAnalytics.Visitors data={findData("daily_visitors")} />
  ));
