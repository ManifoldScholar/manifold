import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import AllLink from "frontend/components/event/AllLink";
import List from "frontend/components/event/List";

export default class ProjectContentBlockRecentActivityBlock extends PureComponent {
  static displayName = "Project.Content.Block.RecentActivity";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  static get title() {
    return "recent-activity";
  }

  static get icon() {
    return "recentActivity64";
  }

  get project() {
    return this.props.project;
  }

  render() {
    const { attributes, relationships } = this.project;
    const { events } = relationships;
    const baseClass = "entity-section-wrapper";

    return (
      <>
        <AllLink
          count={attributes.eventCount}
          threshold={6}
          project={this.project}
          wrapperClasses={`${baseClass}__tools`}
        />
        <div className={`${baseClass}__body ${baseClass}__body--pad-top`}>
          <List project={this.project} events={events} limit={6} columns={3} />
        </div>
      </>
    );
  }
}
