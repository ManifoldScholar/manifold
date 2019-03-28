import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ProjectCollection from "backend/components/project-collection";
import List from "backend/components/list";
import EntitiesList, { ProjectRow } from "backend/components/list/EntitiesList";

export default class ProjectCollectionDetailManual extends PureComponent {
  static displayName = "ProjectCollectionDetail.Manual";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    orderChangeHandler: PropTypes.func.isRequired,
    projects: PropTypes.array
  };

  draggableEntityComponent = props => {
    const entity = props.entity;
    if (!entity) return null;

    const renderEntity =
      entity.type === "projects" ? entity : entity.relationships.project;

    return (
      <ProjectCollection.ProjectCover
        projectCollection={this.props.projectCollection}
        entity={renderEntity}
      />
    );
  };

  render() {
    const { projectCollection, projects, orderChangeHandler } = this.props;
    if (!projectCollection) return null;

    const manuallyOrdered = this.props.projectCollection.attributes
      .manuallySorted;

    if (manuallyOrdered)
      return (
        <section className="project-list grid">
          <List.Orderable
            entities={projectCollection.relationships.collectionProjects}
            entityComponent={this.draggableEntityComponent}
            orderChangeHandler={orderChangeHandler}
            name="collection-projects"
            listItemClassNames={"project-collection-grid-item"}
          />
        </section>
      );

    return (
      <EntitiesList
        entityComponent={ProjectRow}
        entities={projects}
        listStyle="grid"
      />
    );
  }
}
