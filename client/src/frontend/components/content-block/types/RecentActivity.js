import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import List from "frontend/components/event/List";

export default class ProjectContentBlockRecentActivityBlock extends PureComponent {
  static displayName = "Project.Content.Block.RecentActivity";

  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static get title() {
    return "Recent Activity";
  }

  static get icon() {
    return "recentActivity64";
  }

  get entity() {
    return this.props.entity;
  }

  get events() {
    return this.entity.relationships.events;
  }

  render() {
    return (
      <List entity={this.entity} events={this.events} limit={6} columns={3} />
    );
  }
}
