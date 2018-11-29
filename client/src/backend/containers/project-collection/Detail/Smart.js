import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ProjectCollection from "backend/components/project-collection";
import List from "backend/components/list";

export default class ProjectCollectionDetailSmart extends PureComponent {
  static displayName = "ProjectCollectionDetail.Smart";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    projects: PropTypes.array
  };

  projectCover = props => {
    const entity = props.entity;
    if (!entity) return null;

    return (
      <li key={entity.id}>
        <ProjectCollection.ProjectCover
          projectCollection={this.props.projectCollection}
          entity={entity}
        />
      </li>
    );
  };

  render() {
    const { projects } = this.props;

    return (
      <section className="project-list grid">
        <List.SimpleList
          entities={projects}
          entityComponent={this.projectCover}
          name="collection-projects"
        />
      </section>
    );
  }
}