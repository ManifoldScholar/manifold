import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectList, Layout } from "components/frontend";
import { Utility } from "components/global";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import get from "lodash/get";
import queryString from "query-string";
import { Icon } from "components/global/SVG";
import omitBy from "lodash/omitBy";
import debounce from "lodash/debounce";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

export class ProjectsContainer extends Component {
  static fetchData = (getState, dispatch, location) => {
    const search = queryString.parse(location.search);
    const { page, ...filters } = search;
    const pagination = {
      number: page || defaultPage,
      size: perPage
    };

    const projectsFetch = projectsAPI.index(filters, pagination);
    const projectsAction = request(projectsFetch, requests.feProjectsFiltered);
    const { promise: one } = dispatch(projectsAction);
    const promises = [one];
    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      projects: select(requests.feProjectsFiltered, state.entityStore),
      subjects: select(requests.feSubjects, state.entityStore),
      projectsMeta: meta(requests.feProjectsFiltered, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    authentication: PropTypes.object,
    projects: PropTypes.array,
    location: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    fetchData: PropTypes.func.isRequired,
    subjects: PropTypes.array,
    projectsMeta: PropTypes.object
  };

  static defaultProps = {
    location: {}
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(queryString.parse(props.location.search));
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.authentication.currentUser !==
      prevProps.authentication.currentUser
    ) {
      this.props.fetchData(this.props);
    }
  }

  initialState(init) {
    const filter = omitBy(init, (vIgnored, k) => k === "page");

    return {
      filter: Object.assign({}, filter),
      pagination: {
        number: init.page || defaultPage,
        size: perPage
      }
    };
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

  updateResults(filter = this.state.filter) {
    const action = request(
      projectsAPI.index(filter, this.state.pagination),
      requests.feProjectsFiltered
    );
    this.props.dispatch(action);
  }

  doUpdate() {
    this.updateResults();
    this.updateUrl();
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, this.doUpdate);
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

  showPlaceholder() {
    const { location, projects } = this.props;
    if (location.search) return false; // There are search filters applied, skip the check
    if (!projects || projects.length === 0) return true;
  }

  renderProjectLibrary() {
    if (this.showPlaceholder()) return <ProjectList.Placeholder />;

    return (
      <section className="bg-neutral05">
        <div className="container project-list-container">
          <header className="section-heading">
            <div className="main">
              <i className="manicon" aria-hidden="true">
                <Icon.BooksOnShelf size={54} />
              </i>
              <div className="body">
                <h4 className="title">{"All Projects"}</h4>
              </div>
            </div>
          </header>
          <ProjectList.Filters
            filterChangeHandler={this.filterChangeHandler}
            initialFilterState={this.state.filter}
            subjects={this.props.subjects}
          />
          <div className="details">
            <Utility.EntityCount
              pagination={get(this.props.projectsMeta, "pagination")}
              singularUnit="project"
              pluralUnit="projects"
              countOnly
            />
          </div>
          <ProjectList.Grid
            authenticated={this.props.authentication.authenticated}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            dispatch={this.props.dispatch}
            projects={this.props.projects}
            pagination={get(this.props.projectsMeta, "pagination")}
            paginationClickHandler={this.pageChangeHandlerCreator}
            limit={perPage}
          />
        </div>
      </section>
    );
  }

  render() {
    if (!this.props.projectsMeta) return null;

    return (
      <div
        style={{
          overflowX: "hidden"
        }}
      >
        {this.renderProjectLibrary()}
        <Layout.ButtonNavigation
          showProjectCollections
          showFollowing={false}
          showProjects={false}
          grayBg={false}
        />
      </div>
    );
  }
}

export default connectAndFetch(ProjectsContainer);
