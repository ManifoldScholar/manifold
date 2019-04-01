import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import Layout from "backend/components/layout";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import Authorization from "helpers/authorization";
import EntitiesList, {
  Button,
  Search,
  ProjectRow
} from "backend/components/list/EntitiesList";

const { request, flush } = entityStoreActions;

const perPage = 20;

export class ProjectsListContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      projectsListSnapshot: state.ui.transitory.stateSnapshots.projectsList,
      authentication: state.authentication
    };
  };

  static propTypes = {
    projects: PropTypes.array,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object,
    projectsListSnapshot: PropTypes.object.isRequired,
    snapshotCreator: PropTypes.func.isRequired,
    authentication: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
    this.authorization = new Authorization();
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  componentDidMount() {
    const projectsRequest = request(
      projectsAPI.index(this.buildFetchFilter(this.props, this.state.filter), {
        number: this.props.projectsListSnapshot.page,
        size: perPage
      }),
      requests.beProjects
    );

    const { promise: one } = this.props.dispatch(projectsRequest);
    const promises = [one];

    return Promise.all(promises);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beProjects));
  }

  initialState(props) {
    return Object.assign({}, { filter: props.projectsListSnapshot.filter });
  }

  buildFetchFilter = (props, base) => {
    const out = Object.assign({}, base);
    const currentUser = props.authentication.currentUser;
    if (!currentUser) return out;
    if (currentUser.attributes.abilities.viewDrafts) return out;
    out.withUpdateAbility = true;
    return out;
  };

  snapshotState(page) {
    const snapshot = { filter: this.state.filter, page };
    this.props.snapshotCreator(snapshot);
  }

  updateResults(page = 1) {
    this.snapshotState(page);

    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.index(
        this.buildFetchFilter(this.props, this.state.filter),
        pagination
      ),
      requests.beProjects
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  };

  updateHandlerCreator = page => {
    return () => this.updateResults(page);
  };

  resetSearch = () => {
    this.setState({ filter: { order: "sort_title ASC" } }, this.updateResults);
  };

  render() {
    if (!this.props.projectsMeta) return null;
    const { totalCount } = this.props.projectsMeta.pagination;
    const label = totalCount > 1 || totalCount === 0 ? " Projects" : " Project";

    return (
      <Layout.BackendPanel>
        {this.props.projects && this.props.projectsMeta ? (
          <EntitiesList
            entityComponent={ProjectRow}
            listStyle="grid"
            title={label}
            titleStyle="bar"
            titleIcon="BEProject64"
            entities={this.props.projects}
            unit="project"
            pagination={this.props.projectsMeta.pagination}
            showCountInTitle
            showCount
            callbacks={{
              onPageClick: this.updateHandlerCreator
            }}
            search={
              <Search
                sortOptions={[{ label: "title", value: "sort_title" }]}
                onChange={this.filterChangeHandler}
                filter={this.state.filter}
                filters={[
                  {
                    label: "Draft",
                    key: "draft",
                    options: [
                      { label: "Show Draft Projects", value: true },
                      { label: "Hide Draft Projects", value: false }
                    ]
                  }
                ]}
                reset={this.resetSearch}
              />
            }
            buttons={[
              <Button
                path={lh.link("backendProjectsNew")}
                text="Add a new project"
                authorizedFor="project"
                type="add"
              />
            ]}
          />
        ) : null}
      </Layout.BackendPanel>
    );
  }
}

export default connectAndFetch(ProjectsListContainer);
