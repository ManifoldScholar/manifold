import React, { Component } from "react";
import PropTypes from "prop-types";
import Layout from "frontend/components/layout";
import ProjectList from "frontend/components/project-list";
import Utility from "global/components/utility";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import get from "lodash/get";
import queryString from "query-string";
import omitBy from "lodash/omitBy";
import debounce from "lodash/debounce";
import withSettings from "hoc/with-settings";
import { CSSTransition } from "react-transition-group";
import IssueGridItem from "../../components/project-list/IssueGridItem";
import difference from "lodash/difference";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

export class IssuesListContainer extends Component {
  static fetchData = (getState, dispatch, location) => {
    const search = queryString.parse(location.search);

    const baseFilters = {
      standaloneModeEnforced: false
    };

    const { page, ...filters } = search;
    const pagination = {
      number: page || defaultPage,
      size: perPage
    };

    const issuesFetch = projectsAPI.index(
      Object.assign(baseFilters, filters),
      pagination
    );
    const issuesAction = request(issuesFetch, requests.feProjectsFiltered);
    const { promise: one } = dispatch(issuesAction);
    const promises = [one];
    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      issues: select(requests.feProjectsFiltered, state.entityStore),
      subjects: select(requests.feSubjects, state.entityStore),
      issuesMeta: meta(requests.feProjectsFiltered, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    authentication: PropTypes.object,
    issues: PropTypes.array,
    location: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    fetchData: PropTypes.func.isRequired,
    subjects: PropTypes.array,
    issuesMeta: PropTypes.object,
    settings: PropTypes.object
  };

  static defaultProps = {
    location: {}
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(queryString.parse(props.location.search));
    this.updateResults = debounce(this.updateResults.bind(this), 250);
    this.enableAnimation = false;
  }

  componentDidUpdate(prevProps) {
    const prevProjects = prevProps.issues || [];
    const currentProjects = this.props.issues || [];
    const currentIds = currentProjects.map(p => p.id);
    const prevIds = prevProjects.map(p => p.id);
    const diffA = difference(currentIds, prevIds).length;
    const diffB = difference(prevIds, currentIds).length;
    if (diffA + diffB === 1) {
      this.enableAnimation = true;
    } else {
      this.enableAnimation = false;
    }
  }

  hasVisibleIssues() {
    return get(this.props.settings, "attributes.calculated.hasVisibleProjects");
  }

  initialFilterState(init = {}) {
    const filter = omitBy(init, (vIgnored, k) => k === "page");
    filter.standaloneModeEnforced = false;
    return filter;
  }

  initialState(init = {}) {
    return {
      filter: { ...this.initialFilterState(init) },
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
    const params = { ...filters };
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
    const pagination = { ...this.state.pagination, number: pageParam };
    this.setState({ pagination }, this.doUpdate);
  };

  pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      this.handlePageChange(pageParam);
    };
  };

  showPlaceholder() {
    const { location, issues } = this.props;
    if (location.search) return false; // There are search filters applied, skip the check
    if (!issues || issues.length === 0) return true;
  }

  renderProjectLibrary() {
    const {
      authentication,
      issues,
      subjects,
      dispatch,
      issuesMeta,
      authenticated,
      favorites
    } = this.props;
    if (this.showPlaceholder()) return <ProjectList.Placeholder />;

    return (
      <section className="bg-neutral05">
        <div className="entity-section-wrapper container">
          <header className="entity-section-wrapper__heading section-heading">
            <div className="main">
              <Utility.IconComposer size={56} icon="projects64" />
              <div className="body">
                <h2 className="title">{"All Issues"}</h2>
              </div>
            </div>
          </header>
          <ProjectList.Filters
            filterChangeHandler={this.filterChangeHandler}
            initialFilterState={this.state.filter}
            resetFilterState={this.initialFilterState()}
            subjects={subjects}
          />
          <div className="entity-section-wrapper__details">
            <Utility.EntityCount
              pagination={get(issuesMeta, "pagination")}
              singularUnit="issue"
              pluralUnit="issues"
              countOnly
            />
          </div>
          <ProjectList.Grid
            authenticated={authentication.authenticated}
            favorites={get(authentication, "currentUser.favorites")}
            dispatch={dispatch}
            projects={issues}
            pagination={get(issuesMeta, "pagination")}
            paginationClickHandler={this.pageChangeHandlerCreator}
            limit={perPage}
          >
            {issues.map(project => {
              return (
                <CSSTransition
                  enter={this.enableAnimation}
                  exit={this.enableAnimation}
                  timeout={{ enter: 250, exit: 250 }}
                >
                  <li key={project.id} className="project-list__item--pos-rel">
                    <IssueGridItem
                      authenticated={authenticated}
                      favorites={favorites}
                      dispatch={dispatch}
                      project={project}
                      hideDesc
                      hideCollectingToggle={this.hideCollectingToggle}
                    />
                  </li>
                </CSSTransition>
              );
            })}
          </ProjectList.Grid>
        </div>
      </section>
    );
  }

  render() {
    if (!this.props.issuesMeta) return null;

    return (
      <div
        style={{
          overflowX: "hidden"
        }}
      >
        <h1 className="screen-reader-text">All Issues</h1>
        {this.renderProjectLibrary()}
        {this.hasVisibleIssues() && (
          <Layout.ButtonNavigation
            label="See All Journals"
            link="frontendJournals"
            showProjects={false}
            grayBg={false}
          />
        )}
      </div>
    );
  }
}

export default connectAndFetch(withSettings(IssuesListContainer));
