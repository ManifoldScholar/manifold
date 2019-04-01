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
  ResourceRow
} from "backend/components/list/EntitiesList";

const { request } = entityStoreActions;
const perPage = 5;

export class ProjectResourcesListContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      resources: select(requests.beResources, state.entityStore),
      resourcesMeta: meta(requests.beResources, state.entityStore)
    };
  };

  static displayName = "Project.ResourcesList";

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
    this.fetchResources();
  }

  get tagFilterOptions() {
    const tags = this.props.project.attributes.resourceTags || [];
    return tags.map(t => ({ label: t, value: t }));
  }

  get kindFilterOptions() {
    const tags = this.props.project.attributes.resourceKinds || [];
    return tags.map(k => ({ label: k, value: k }));
  }

  fetchResources(page = 1) {
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
    this.setState({ filter }, this.fetchResources);
  };

  pageChangeHandlerCreator = page => {
    return () => this.fetchResources(page);
  };

  resetSearch = () => {
    this.setState({ filter: {} }, this.fetchResources);
  };

  render() {
    if (!this.props.resources) return null;
    const project = this.props.project;

    return (
      <EntitiesList
        entityComponent={ResourceRow}
        title={"Resources"}
        titleIcon="resourceCollection64"
        entities={this.props.resources}
        unit="resource"
        pagination={this.props.resourcesMeta.pagination}
        showCount
        callbacks={{
          onPageClick: this.pageChangeHandlerCreator
        }}
        search={
          <Search
            filter={this.state.filter}
            reset={this.resetSearch}
            sortOptions={[{ label: "title", value: "sort_title" }]}
            onChange={this.filterChangeHandler}
            filters={[
              {
                label: "Tag",
                key: "tag",
                options: this.tagFilterOptions
              },
              {
                label: "Kind",
                key: "kind",
                options: this.kindFilterOptions
              }
            ]}
          />
        }
        buttons={[
          <Button
            path={lh.link("backendProjectResourcesNew", project.id)}
            text="Add a new resource"
            authorizedFor={project}
            authorizedTo="createResources"
            type="add"
          />,
          <Button
            path={lh.link("backendResourceImport", project.id)}
            text="Bulk add resources"
            authorizedFor={project}
            authorizedTo="createResources"
            icon="BEResourcesBoxes64"
          />
        ]}
      />
    );
  }
}

export default connectAndFetch(ProjectResourcesListContainer);
