import React, { Component } from "react";
import PropTypes from "prop-types";
import Project from "frontend/components/project";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";

export default class JournalDetailContainer extends Component {
  static propTypes = {
    journal: PropTypes.object,
    journalResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func
  };

  render() {
    if (!this.props.journalResponse) return null;
    if (this.props.journalResponse.status === 401)
      return <Redirect to={lh.link("frontend")} />;
    const { journal, settings } = this.props;
    if (!journal) return null;

    return (
      <div className="project-detail">
        <CheckFrontendMode debugLabel="JournalDetail" isProjectHomePage />
        <HeadContent
          title={`\u201c${this.props.journal.attributes.titlePlaintext}\u201d on ${settings.attributes.general.installationName}`}
          description={this.props.journal.attributes.description}
        />
        <Project.Detail
          project={this.props.journal}
          dispatch={this.props.dispatch}
          backgroundImage={false}
        />
        <Schema.Project
          attributes={journal.attributes}
          relationships={journal.relationships}
        />
      </div>
    );
  }
}
