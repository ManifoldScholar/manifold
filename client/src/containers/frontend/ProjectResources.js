import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Utility, Project } from "components/frontend";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import queryString from "query-string";
import debounce from "lodash/debounce";
import omitBy from "lodash/omitBy";
import isNull from "lodash/isNull";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

class ProjectResourcesContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const pageParam = match.params.page ? match.params.page : page;
    const projectRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    // This can be made more robust with other types if need be.
    const filter = queryString.parse(location.search);
    const resourcesRequest = request(
      projectsAPI.resources(match.params.id, filter, {
        number: pageParam,
        size: perPage
      }),
      requests.feResources
    );
    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(resourcesRequest);
    return Promise.all([one, two]);
  };

  static propTypes = {
    project: PropTypes.object,
    resources: PropTypes.array,
    meta: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object
  };

  static mapStateToProps = state => {
    const props = {
      project: select(requests.feProject, state.entityStore),
      resources: select(requests.feResources, state.entityStore),
      meta: meta(requests.feResources, state.entityStore)
    };
    return omitBy(props, isNull);
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(
      queryString.parse(this.props.location.search)
    );
    this.filterChange = this.filterChange.bind(this);
    this.updateResults = debounce(this.updateResults.bind(this), 250);
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
    this.props.dispatch(flush(requests.feResources));
  }

  initialState(init) {
    const filters = init || {};
    return {
      filter: filters
    };
  }

  updateResults() {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resources(
        this.props.project.id,
        this.state.filter,
        pagination
      ),
      requests.feResources
    );
    this.props.dispatch(action);
  }

  filterChange(filter) {
    this.setState({ filter }, () => {
      this.updateResults();
      this.updateUrl(filter);
    });
  }

  updateUrl(filter) {
    const pathname = this.props.location.pathname;
    const search = queryString.stringify(filter);
    this.props.history.push({ pathname, search });
  }

  handlePageChange(event, pageParam) {
    const pagination = { number: pageParam, size: perPage };
    const project = this.props.project;
    const filter = this.state.filter;
    const action = request(
      projectsAPI.resources(project.id, filter, pagination),
      requests.feResources
    );
    this.props.dispatch(action);
  }

  pageChangeHandlerCreator(pageParam) {
    return event => {
      this.handlePageChange(event, pageParam);
    };
  }

  render() {
    const project = this.props.project;
    if (!project) return null;

    const filter = this.state.filter;
    const initialFilter = filter || null;

    return (
      <div>
        <section className="bg-neutral05">
          <Utility.BackLinkPrimary
            link={lh.link("frontendProject", project.id)}
            title={project.attributes.title}
          />
        </section>
        {this.props.resources
          ? <Project.Resources
              project={project}
              resources={this.props.resources}
              pagination={this.props.meta.pagination}
              paginationClickHandler={this.pageChangeHandlerCreator}
              filterChange={this.filterChange}
              initialFilterState={initialFilter}
            />
          : null}
        <section className="bg-neutral05">
          <Utility.BackLinkSecondary
            link={lh.link("frontendProject", project.id)}
            title={project.attributes.title}
          />
        </section>
      </div>
    );
  }
}

export default connectAndFetch(ProjectResourcesContainer);
