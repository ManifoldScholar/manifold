import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectList, Layout, ProjectCollection } from "components/frontend";
import { Utility } from "components/global";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import queryString from "query-string";
import { Icon } from "components/global/SVG";

const { request } = entityStoreActions;
const perPage = 20;

export class ProjectsContainer extends Component {
  static fetchData = (dispatch, location) => {
    const query = queryString.parse(location.search);
    const filters = {
      order: "sort_title, title",
      featured: query.featured,
      subject: query.subject
    };
    const pagination = {
      number: query.page || 1,
      size: perPage
    };
    const projectsRequest = request(
      projectsAPI.index(filters, pagination),
      requests.feProjectsFiltered
    );
    return dispatch(projectsRequest);
  };

  static mapStateToProps = state => {
    return {
      projects: select(requests.feProjectsFiltered, state.entityStore),
      subjects: select(requests.feSubjects, state.entityStore),
      meta: meta(requests.feProjectsFiltered, state.entityStore),
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
    meta: PropTypes.object
  };

  static defaultProps = {
    location: {}
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidMount() {
    ProjectsContainer.fetchData(this.props.dispatch, this.props.location);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.authentication.currentUser !==
      prevProps.authentication.currentUser
    ) {
      this.props.fetchData(this.props);
    }
    if (prevProps.location !== this.props.location) {
      ProjectsContainer.fetchData(this.props.dispatch, this.props.location);
    }
  }

  currentQuery() {
    return queryString.parse(this.props.location.search);
  }

  handleFilterChange = filter => {
    return this.doQuery(filter);
  };

  handlePageChange = (event, page) => {
    event.preventDefault();
    const query = Object.assign({}, this.currentQuery(), { page });
    this.doQuery(query);
  };

  doQuery(query) {
    const url = lh.link("frontendProjects", query);
    this.props.history.push(url);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handlePageChange(event, page);
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
          <div className="utility">
            <ProjectList.Filters
              params={this.currentQuery()}
              updateAction={this.handleFilterChange}
              subjects={this.props.subjects}
            />
          </div>
          <div className="details">
            <Utility.EntityCount
              pagination={get(this.props.meta, "pagination")}
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
            pagination={get(this.props.meta, "pagination")}
            paginationClickHandler={this.pageChangeHandlerCreator}
            limit={perPage}
          />
        </div>
      </section>
    );
  }

  render() {
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
