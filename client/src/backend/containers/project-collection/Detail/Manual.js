import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EntitiesList, {
  ProjectRow,
  CollectionProjectRow
} from "backend/components/list/EntitiesList";

export default class ProjectCollectionDetailManual extends PureComponent {
  static displayName = "ProjectCollectionDetail.Manual";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    orderChangeHandler: PropTypes.func.isRequired,
    projects: PropTypes.array
  };

  render() {
    const { projectCollection, projects, orderChangeHandler } = this.props;
    if (!projectCollection) return null;

    const manuallyOrdered = this.props.projectCollection.attributes
      .manuallySorted;

    if (manuallyOrdered) {
      return (
        <EntitiesList
          entityComponent={CollectionProjectRow}
          entities={projectCollection.relationships.collectionProjects}
          listStyle="grid"
          callbacks={{
            onReorder: orderChangeHandler
          }}
        />
      );
    }

    return (
      <EntitiesList
        entityComponent={ProjectRow}
        entities={projects}
        listStyle="grid"
      />
    );
  }
}
