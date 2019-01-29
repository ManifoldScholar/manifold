import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import ResourceCollection from "backend/components/resource-collection";
import List from "backend/components/list";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;
const perPage = 5;

export class ProjectResourceCollectionsListContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      resourceCollections: select(
        requests.beResourceCollections,
        state.entityStore
      ),
      resourceCollectionsMeta: meta(
        requests.beResourceCollections,
        state.entityStore
      )
    };
  };

  static displayName = "Project.CollectionsList";

  static propTypes = {
    project: PropTypes.object,
    resourceCollections: PropTypes.array,
    resourceCollectionsMeta: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { filter: {} };
  }

  componentDidMount() {
    this.fetchCollections(1);
  }

  fetchCollections(page) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resourceCollections(
        this.props.project.id,
        this.state.filter,
        pagination
      ),
      requests.beResourceCollections
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.fetchCollections(1);
    });
  };

  handleCollectionsPageChange(event, page) {
    this.fetchCollections(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handleCollectionsPageChange(event, page);
    };
  };

  render() {
    if (!this.props.resourceCollections) return null;
    const project = this.props.project;

    return (
      <div className="project-resource-list">
        <header className="section-heading-secondary">
          <h3>
            {"Resource Collections"}{" "}
            <i className="manicon manicon-file-box" aria-hidden="true" />
          </h3>
        </header>
        <List.Searchable
          newButton={{
            path: lh.link("backendProjectResourceCollectionsNew", project.id),
            text: "Add a New Resource Collection",
            authorizedFor: project,
            authorizedTo: "createResourceCollections"
          }}
          entities={this.props.resourceCollections}
          singularUnit="resource collection"
          pluralUnit="resource collections"
          pagination={this.props.resourceCollectionsMeta.pagination}
          paginationClickHandler={this.pageChangeHandlerCreator}
          paginationClass="secondary"
          entityComponent={ResourceCollection.ListItem}
          filterChangeHandler={this.filterChangeHandler}
          sortOptions={[{ label: "title", value: "title" }]}
        />
      </div>
    );
  }
}

export default connectAndFetch(ProjectResourceCollectionsListContainer);
