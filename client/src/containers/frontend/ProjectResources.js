import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Utility, Project } from "components/frontend";
import { LoadingBlock } from "components/global";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import queryString from "query-string";
import debounce from "lodash/debounce";
import omitBy from "lodash/omitBy";
import isNull from "lodash/isNull";
import lh from "helpers/linkHandler";
import { HeadContent } from "components/global";
import HigherOrder from "containers/global/HigherOrder";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

class ProjectResourcesContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const projectRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    const params = queryString.parse(location.search);
    const pagination = {
      number: params.page ? params.page : page,
      size: perPage
    };
    const filter = omitBy(params, (v, k) => k === "page");
    const resourcesRequest = request(
      projectsAPI.resources(match.params.id, filter, pagination),
      requests.feResources
    );
    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(resourcesRequest);
    return Promise.all([one, two]);
  };

  static propTypes = {
    project: PropTypes.object,
    settings: PropTypes.object.isRequired,
    resources: PropTypes.array,
    meta: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object.isRequired,
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
    this.state = this.initialState(queryString.parse(props.location.search));
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search === this.props.location.search) return null;
    this.setState(
      this.initialState(queryString.parse(this.props.location.search)),
      this.updateResults
    );
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
    this.props.dispatch(flush(requests.feResources));
  }

  initialState(init) {
    const filter = omitBy(init, (vIgnored, k) => k === "page");

    return {
      filter: Object.assign({}, filter),
      pagination: {
        number: init.page || page,
        size: perPage
      }
    };
  }

  doUpdate() {
    this.updateResults();
    this.updateUrl();
  }

  updateResults() {
    const action = request(
      projectsAPI.resources(
        this.props.project.id,
        this.state.filter,
        this.state.pagination
      ),
      requests.feResources
    );
    this.props.dispatch(action);
  }

  updateUrl() {
    const pathname = this.props.location.pathname;
    const filters = this.state.filter;
    const pageParam = this.state.pagination.number;
    const params = Object.assign({}, filters);
    if (pageParam !== 1) params.page = pageParam;

    const search = queryString.stringify(params);
    this.props.history.push({ pathname, search });
  }

  filterChange = filter => {
    const pagination = Object.assign({}, this.state.pagination, {
      number: page
    });
    this.setState({ filter, pagination }, this.doUpdate);
  };

  handlePageChange = pageParam => {
    const pagination = Object.assign({}, this.state.pagination, {
      number: pageParam
    });
    this.setState({ pagination }, this.doUpdate);
  };

  pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      this.handlePageChange(pageParam);
    };
  };

  render() {
    const { project, settings } = this.props;
    if (!project) return <LoadingBlock />;

    const filter = this.state.filter;
    const initialFilter = filter || null;

    return (
      <div>
        <HeadContent
          title={`View \u201c${project.attributes.title}\u201d Resources on ${
            settings.attributes.general.installationName
          }`}
          description={project.attributes.description}
          image={project.attributes.heroStyles.medium}
        />
        <section className="bg-neutral05">
          <Utility.BackLinkPrimary
            link={lh.link("frontendProject", project.attributes.slug)}
            title={project.attributes.title}
          />
        </section>
        {this.props.resources ? (
          <Project.Resources
            project={project}
            resources={this.props.resources}
            pagination={this.props.meta.pagination}
            paginationClickHandler={this.pageChangeHandlerCreator}
            filterChange={this.filterChange}
            initialFilterState={initialFilter}
          />
        ) : null}
        <section className="bg-neutral05">
          <Utility.BackLinkSecondary
            link={lh.link("frontendProject", project.attributes.slug)}
            title={project.attributes.title}
          />
        </section>
      </div>
    );
  }
}

export default connectAndFetch(
  HigherOrder.withSettings(ProjectResourcesContainer)
);
