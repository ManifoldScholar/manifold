import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import ProjectCollection from "backend/components/project-collection";
import { childRoutes } from "helpers/router";
import Manual from "./Manual";
import Smart from "./Smart";
import lh from "helpers/linkHandler";
import Authorize from "hoc/authorize";

export class ProjectCollectionDetail extends PureComponent {
  static displayName = "ProjectCollection.Detail";

  static propTypes = {
    projectCollection: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object
  };

  handleProjectOrderChange = result => {
    const id = result.id;
    const changes = { attributes: { position: result.position } };
    const options = { noTouch: true };
    this.props.updateCollectionProject(id, changes, options);
  };

  handleSortOrderChange = sortOrder => {
    this.props.updateProjectCollection({ attributes: { sortOrder } });
  };

  drawerProps(props) {
    return {
      lockScroll: "always",
      size: "flexible",
      padding: "large",
      closeUrl: lh.link("backendProjectCollection", props.projectCollection.id)
    };
  }

  render() {
    const { collectionProjects, projectCollection } = this.props;
    if (!projectCollection || !collectionProjects) return null;
    const projects = collectionProjects.map(cp => cp.relationships.project);

    return (
      <Authorize
        entity={projectCollection}
        failureFatalError={{
          detail: "You are not allowed to edit this project collection."
        }}
        ability="update"
      >
        <div>
          <h2 className="screen-reader-text">Project List</h2>
          <ProjectCollection.SortBy
            sortChangeHandler={this.handleSortOrderChange}
            projectCollection={this.props.projectCollection}
          />
          {projectCollection.attributes.smart ? (
            <Smart projects={projects} {...this.props} />
          ) : (
            <Manual
              projects={collectionProjects}
              orderChangeHandler={this.handleProjectOrderChange}
              {...this.props}
            />
          )}
          {childRoutes(this.props.route, {
            childProps: this.props,
            drawer: true,
            drawerProps: this.drawerProps(this.props)
          })}
        </div>
      </Authorize>
    );
  }
}

export default connectAndFetch(ProjectCollectionDetail);
