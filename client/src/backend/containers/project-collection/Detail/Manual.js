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

  get isManuallySorted() {
    const { projectCollection } = this.props;
    return projectCollection.attributes.manuallySorted;
  }

  get entities() {
    if (!this.isManuallySorted)
      return this.props.collectionProjects.map(cp => cp.relationships.project);
    return this.props.collectionProjects;
  }

  get callbacks() {
    if (!this.isManuallySorted) return {};
    return { onReorder: this.props.orderChangeHandler };
  }

  render() {
    const { projectCollection } = this.props;
    if (!projectCollection) return null;

    const linkState = {
      id: this.props.projectCollection.id,
      label: this.props.projectCollection.attributes.title
    };

    return (
      <EntitiesList
        entityComponent={
          this.isManuallySorted ? CollectionProjectRow : ProjectRow
        }
        entityComponentProps={{ linkState }}
        entities={this.entities}
        listStyle="rows"
        sortableStyle="tight"
        callbacks={this.callbacks}
      />
    );
  }
}
