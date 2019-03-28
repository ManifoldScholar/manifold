import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EntitiesList, { ProjectRow } from "backend/components/list/EntitiesList";

export default class ProjectCollectionDetailSmart extends PureComponent {
  static displayName = "ProjectCollectionDetail.Smart";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    projects: PropTypes.array
  };

  render() {
    const { projects } = this.props;
    return (
      <EntitiesList
        entityComponent={ProjectRow}
        entities={projects}
        listStyle="grid"
      />
    );
  }
}
