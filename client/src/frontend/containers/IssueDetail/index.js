import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";

export default function IssueDetailContainer({
  issue,
  issueResponse,
  settings
}) {
  if (!issueResponse) return null;
  if (issueResponse.status === 401)
    return <Redirect to={lh.link("frontend")} />;

  return issue ? (
    <>
      <CheckFrontendMode debugLabel="ProjectDetail" isProjectHomePage />
      <HeadContent
        title={`\u201c${issue.attributes.titlePlaintext}\u201d on ${settings.attributes.general.installationName}`}
        description={issue.attributes.description}
        image={issue.attributes.heroStyles.medium}
      />
      <h2>Issue Detail Container</h2>
      <p>{JSON.stringify(issue)}</p>
      {/* What are the equivalent components for issue? */}
      {/* <Project.Detail
        project={this.props.project}
        dispatch={this.props.dispatch}
      /> */}
      {/* <Schema.Project
        attributes={project.attributes}
        relationships={project.relationships}
      /> */}
    </>
  ) : null;
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object,
  issueResponse: PropTypes.object,
  settings: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};
