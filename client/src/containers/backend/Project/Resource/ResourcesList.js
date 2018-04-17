import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { List, Resource } from "components/backend";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;
const perPage = 5;

export class ProjectResourcesListContainer extends PureComponent {
  static displayName = "Project.ResourcesList";

  static mapStateToProps = state => {
    return {
      resources: select(requests.beResources, state.entityStore),
      resourcesMeta: meta(requests.beResources, state.entityStore)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    resources: PropTypes.array,
    resourcesMeta: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { filter: {} };
    this.lastFetchedPage = null;
  }

  componentDidMount() {
    this.fetchResources(1);
  }

  fetchResources(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resources(
        this.props.project.id,
        this.state.filter,
        pagination
      ),
      requests.beResources
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.fetchResources(1);
    });
  };

  handleResourcesPageChange(event, page) {
    this.fetchResources(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handleResourcesPageChange(event, page);
    };
  };

  render() {
    if (!this.props.resources) return null;
    const project = this.props.project;

    return (
      <div className="project-resource-list">
        <header className="section-heading-secondary">
          <h3>
            {"Resources"} <i className="manicon manicon-cube-shine" />
          </h3>
        </header>
        <List.Searchable
          newButton={{
            path: lh.link("backendProjectResourcesNew", project.id),
            text: "Add a New Resource",
            authorizedFor: project,
            authorizedTo: "update"
          }}
          secondaryButton={{
            icon: "manicon-cube-multiple",
            type: "narrow",
            path: lh.link("backendResourceImport", project.id),
            text: "Bulk Add Resources",
            authorizedFor: project,
            authorizedTo: "update"
          }}
          entities={this.props.resources}
          singularUnit="resource"
          pluralUnit="resources"
          pagination={this.props.resourcesMeta.pagination}
          paginationClickHandler={this.pageChangeHandlerCreator}
          paginationClass="secondary"
          entityComponent={Resource.ListItem}
          filterChangeHandler={this.filterChangeHandler}
          filterOptions={{
            tag: this.props.project.attributes.resourceTags,
            kind: this.props.project.attributes.resourceKinds
          }}
          sortOptions={[{ label: "title", value: "sort_title" }]}
        />
      </div>
    );
  }
}

export default connectAndFetch(ProjectResourcesListContainer);
