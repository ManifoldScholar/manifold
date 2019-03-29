import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  ResourceCollectionRow
} from "backend/components/list/EntitiesList";

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
      <EntitiesList
        entityComponent={ResourceCollectionRow}
        title={"Resource Collections"}
        titleIcon="resourceCollection64"
        entities={this.props.resourceCollections}
        unit="resource collection"
        pagination={this.props.resourceCollectionsMeta.pagination}
        showCount
        callbacks={{
          onPageClick: this.pageChangeHandlerCreator
        }}
        search={
          <Search
            sortOptions={[{ label: "title", value: "title" }]}
            onChange={this.filterChangeHandler}
          />
        }
        buttons={[
          <Button
            path={lh.link("backendProjectResourceCollectionsNew", project.id)}
            text="Add a new resource collection"
            authorizedFor={project}
            authorizedTo="createResourceCollections"
            type="add"
          />
        ]}
      />
    );
  }
}

export default connectAndFetch(ProjectResourceCollectionsListContainer);
