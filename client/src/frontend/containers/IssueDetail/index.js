import React, { Component } from "react";
import PropTypes from "prop-types";
import Project from "frontend/components/project";
import IssueDetail from "../../components/issue";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import issueFixture from "../../../test/fixtures/entities/issue";

export default class IssueDetailContainer extends Component {
  static propTypes = {
    issue: PropTypes.object,
    issueResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func
  };

  render() {
    console.log(issueFixture().data);
    if (!this.props.issueResponse) return null;
    if (this.props.issueResponse.status === 401)
      return <Redirect to={lh.link("frontend")} />;
    const { issue, settings } = this.props;
    if (!issue) return null;

    return (
      <div>
        <CheckFrontendMode debugLabel="IssueDetail" isProjectHomePage />
        <HeadContent
          title={`\u201c${this.props.issue.attributes.titlePlaintext}\u201d on ${settings.attributes.general.installationName}`}
          description={this.props.issue.attributes.description}
        />
        <IssueDetail
          issue={issueFixture().data}
          dispatch={this.props.dispatch}
          backgroundImage
        />
        <Schema.Project
          attributes={issue.attributes}
          relationships={issue.relationships}
        />
      </div>
    );
  }
}
