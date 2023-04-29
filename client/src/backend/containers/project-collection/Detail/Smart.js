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

    const linkState = {
      id: this.props.projectCollection.id,
      label: this.props.projectCollection.attributes.title
    };

    return (
      <EntitiesList
        entityComponent={ProjectRow}
        entityComponentProps={{ linkState }}
        entities={projects}
        listStyle="grid"
      />
    );
  }
}
