import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Event } from "components/frontend";

export default class ProjectDetailActivity extends PureComponent {
  static displayName = "ProjectDetail.Activity";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  render() {
    const project = this.props.project;
    const { attributes, relationships } = project;
    const { events } = relationships;

    return (
      <React.Fragment>
        <Event.AllLink
          count={attributes.eventCount}
          threshold={6}
          project={project}
        />
        <div className="entities">
          <Event.List
            project={project}
            events={relationships.events}
            limit={6}
            columns={3}
          />
        </div>
      </React.Fragment>
    );
  }
}
