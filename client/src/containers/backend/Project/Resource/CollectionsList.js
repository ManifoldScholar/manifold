import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { List, ResourceCollection } from "components/backend";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;
const perPage = 5;

export class ProjectCollectionsListContainer extends PureComponent {
  static displayName = "Project.CollectionsList";

  static mapStateToProps = state => {
    return {
      collections: select(requests.beCollections, state.entityStore),
      collectionsMeta: meta(requests.beCollections, state.entityStore)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    collections: PropTypes.array,
    collectionsMeta: PropTypes.object,
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
      projectsAPI.collections(
        this.props.project.id,
        this.state.filter,
        pagination
      ),
      requests.beCollections
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
    if (!this.props.collections) return null;
    const project = this.props.project;

    return (
      <div className="project-resource-list">
        <header className="section-heading-secondary">
          <h3>
            {"Collections"}{" "}
            <i className="manicon manicon-file-box" aria-hidden="true" />
          </h3>
        </header>
        <List.Searchable
          newButton={{
            path: lh.link("backendProjectCollectionsNew", project.id),
            text: "Add a New Collection",
            authorizedFor: project,
            authorizedTo: "createCollections"
          }}
          entities={this.props.collections}
          singularUnit="collection"
          pluralUnit="collections"
          pagination={this.props.collectionsMeta.pagination}
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

export default connectAndFetch(ProjectCollectionsListContainer);
