import React from "react";
import { fixtures } from "helpers/storybook/exports";
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

export default {
  title: "Backend/Analytics/Block"
};

export const AverageVisit = () => (
  <ComposedAnalytics.AverageVisit data={findData("average_visit_duration")} />
);

export const Collected = () => (
  <ComposedAnalytics.Collected data={findData("favorited_projects")} />
);

export const Interaction = () => (
  <ComposedAnalytics.Interactions data={findData("active_users")} />
);

export const ReturnVisits = () => (
  <ComposedAnalytics.ReturnVisits data={findData("returning_visitors")} />
);

export const SiteStatistics = () => (
  <ComposedAnalytics.SiteStatistics statistics={statistics} />
);

export const MostViewedProjects = () => (
  <ComposedAnalytics.TopProjects data={findData("top_projects")} />
);

export const TopSearches = () => (
  <ComposedAnalytics.TopSearches data={findData("top_search_terms")} />
);

export const Visitors = () => (
  <ComposedAnalytics.Visitors data={findData("daily_visitors")} />
);
