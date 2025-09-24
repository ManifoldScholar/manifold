import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import ProjectCollection from "backend/components/project-collection";
import { childRoutes } from "helpers/router";
import Manual from "./Manual";
import Smart from "./Smart";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";

export class ProjectCollectionDetail extends PureComponent {
  static displayName = "ProjectCollection.Detail";

  static propTypes = {
    projectCollection: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object,
    t: PropTypes.func
  };

  handleProjectOrderChange = result => {
    const id = result.id;
    const changes = { attributes: { position: result.position } };
    const options = { noTouch: true };
    this.props.updateCollectionProject(id, changes, options);
  };

  handleSortOrderChange = order => {
    this.props.updateProjectCollection({
      attributes: { sortOrder: order.sortBy }
    });
  };

  drawerProps(props, padding = "default") {
    return {
      lockScroll: "always",
      size: "flexible",
      padding,
      closeUrl: lh.link("backendProjectCollection", props.projectCollection.id)
    };
  }

  render() {
    const { collectionProjects, projectCollection, t, route } = this.props;

    if (!projectCollection || !collectionProjects) return null;
    const projects = collectionProjects.map(cp => cp.relationships.project);

    const manageProjectsRoute = {
      ...route,
      routes: [
        route.routes.find(
          r => r.name === "backendProjectCollectionManageProjects"
        )
      ]
    };

    const restRoutes = {
      ...route,
      routes: route.routes.filter(
        r => r.name !== "backendProjectCollectionManageProjects"
      )
    };

    return (
      <Authorize
        entity={projectCollection}
        failureNotification={{
          body: t("project_collections.unauthorized_edit")
        }}
        failureRedirect
        ability="update"
      >
        <div>
          <h2 className="screen-reader-text">
            {t("project_collections.sr_list_title")}
          </h2>
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
          {childRoutes(manageProjectsRoute, {
            childProps: this.props,
            drawer: true,
            drawerProps: this.drawerProps(this.props, "large")
          })}
          {childRoutes(restRoutes, {
            childProps: this.props,
            drawer: true,
            drawerProps: this.drawerProps(this.props)
          })}
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(connectAndFetch(ProjectCollectionDetail));
