import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import { ComposedAnalytics, Grid } from "backend/components/analytics";

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

function findData(name, factory = "globalAnalytics") {
  const {
    attributes: { data }
  } = fixtures.factory(factory);
  return data.find(element => element.name === name);
}

storiesOf("Backend/Analytics/Dashboard", module)
  .add("Global", () => (
    <Grid columns={4}>
      <ComposedAnalytics.Visitors data={findData("daily_visitors")} />
      <ComposedAnalytics.ReturnVisits data={findData("returning_visitors")} />
      <ComposedAnalytics.AverageVisit
        data={findData("average_visit_duration")}
      />
      <ComposedAnalytics.Interactions data={findData("active_users")} />
      <ComposedAnalytics.Collected data={findData("favorited_projects")} />
      <ComposedAnalytics.SiteStatistics statistics={statistics} />
      <ComposedAnalytics.TopProjects data={findData("top_projects")} />
      <ComposedAnalytics.TopSearches data={findData("top_search_terms")} />
    </Grid>
  ))
  .add("Project", () => (
    <Grid columns={3}>
      <ComposedAnalytics.Visitors
        data={findData("daily_visitors", "projectAnalytics")}
      />
      <ComposedAnalytics.Annotations />
      <ComposedAnalytics.Highlights
        data={findData("annotations", "projectAnalytics")}
      />
      <ComposedAnalytics.NewCollectors
        data={findData("favorites_this_period", "projectAnalytics")}
      />
      <ComposedAnalytics.AllCollectors
        data={findData("total_favorites", "projectAnalytics")}
      />
    </Grid>
  ));
