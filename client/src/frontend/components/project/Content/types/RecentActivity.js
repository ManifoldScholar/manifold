import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import List from "frontend/components/event/List";

export default class ProjectContentBlockRecentActivityBlock extends PureComponent {
  static displayName = "Project.Content.Block.RecentActivity";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  static get title() {
    return "Recent Activity";
  }

  static get icon() {
    return "recentActivity64";
  }

  get project() {
    return this.props.project;
  }

  get events() {
    return this.project.relationships.events;
  }

  render() {
    return (
      <List project={this.project} events={this.events} limit={6} columns={3} />
    );
  }
}
