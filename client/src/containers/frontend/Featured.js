import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { ProjectList, Layout } from "components/frontend";
import { bindActionCreators } from "redux";
import { uiFilterActions, entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, subjectsAPI, requests } from "api";
import get from "lodash/get";
import { HeadContent } from "components/global";

const { setProjectFilters } = uiFilterActions;
const { request, flush } = entityStoreActions;

export class FeaturedContainer extends Component {
  static fetchData = (getState, dispatch) => {
    const featuredProjectsRequest = request(
      projectsAPI.featured(),
      requests.feProjectsFeatured
    );
    const featuredSubjectsRequest = request(
      subjectsAPI.featuredSubjects(),
      requests.feSubjectsFeatured
    );
    const { promise: one } = dispatch(featuredProjectsRequest);
    const { promise: two } = dispatch(featuredSubjectsRequest);
    return Promise.all([one, two]);
  };

  static mapStateToProps = state => {
    return {
      projectFilters: state.ui.transitory.filters.project,
      featuredProjects: select(requests.feProjectsFeatured, state.entityStore),
      subjects: select(requests.feSubjectsFeatured, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    featuredProjects: PropTypes.array,
    authentication: PropTypes.object,
    projectFilters: PropTypes.object,
    subjects: PropTypes.array,
    dispatch: PropTypes.func
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.authentication !== this.props.authentication) {
      this.fetchProjects();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.projectFilters !== this.props.projectFilters) {
      this.fetchProjects();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feSubjectsFeatured));
  }

  fetchProjects = () => {
    const featuredRequest = request(
      projectsAPI.featured(6, this.props.projectFilters),
      requests.feProjectsFeatured
    );
    this.props.dispatch(featuredRequest);
  };

  render() {
    const boundSetFilters = bindActionCreators(
      setProjectFilters,
      this.props.dispatch
    );
    const subjects = this.props.subjects;

    return (
      <div
        style={{
          overflowX: "hidden"
        }}
      >
        <HeadContent title="Manifold Scholarship | Featured" />
        <section className="bg-neutral05">
          <div className="container">
            <header className="section-heading">
              <div className="main">
                <i className="manicon manicon-lamp" />
                <div className="body">
                  <h4 className="title">
                    {"Featured Projects"}
                  </h4>
                </div>
              </div>
              <div className="utility right">
                <ProjectList.Filters
                  updateAction={boundSetFilters}
                  subjects={subjects}
                  hideFeatured
                />
              </div>
            </header>
            {this.props.featuredProjects ? (
              <ProjectList.Grid
                authenticated={this.props.authentication.authenticated}
                favorites={get(
                  this.props.authentication,
                  "currentUser.favorites"
                )}
                dispatch={this.props.dispatch}
                projects={this.props.featuredProjects}
              />
            ) : null}
          </div>
        </section>
        <Layout.ButtonNavigation
          grayBg={false}
          authenticated={this.props.authentication.authenticated}
        />
      </div>
    );
  }
}

export default connectAndFetch(FeaturedContainer);
