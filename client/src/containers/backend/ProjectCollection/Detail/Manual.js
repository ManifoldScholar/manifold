import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { List, ProjectCollection } from "components/backend";
import { requests } from "api";

export default class ProjectCollectionDetailManual extends PureComponent {
  static displayName = "ProjectCollectionDetail.Manual";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    orderChangeHandler: PropTypes.func.isRequired,
    projects: PropTypes.array
  };

  draggableProjectCover = props => {
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

  projectCover = props => {
    return <li>{this.draggableProjectCover(props)}</li>;
  };

  renderOrderable(projectCollection, props) {
    return (
      <List.Orderable
        entities={projectCollection.relationships.collectionProjects}
        entityComponent={this.draggableProjectCover}
        orderChangeHandler={props.orderChangeHandler}
        name="collection-projects"
        listItemClassNames={"project-collection-grid-item"}
      />
    );
  }

  renderStatic(projects) {
    return (
      <List.SimpleList
        entities={projects}
        entityComponent={this.projectCover}
        name="collection-projects"
        listItemClassNames={"project-collection-grid-item"}
      />
    );
  }

  render() {
    const { projectCollection, projects } = this.props;
    if (!projectCollection) return null;

    const manuallyOrdered = this.props.projectCollection.attributes
      .manuallySorted;

    return (
      <section className="project-list grid">
        {manuallyOrdered
          ? this.renderOrderable(projectCollection, this.props)
          : this.renderStatic(projects)}
      </section>
    );
  }
}
