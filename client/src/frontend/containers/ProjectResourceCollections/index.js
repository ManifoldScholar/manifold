import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { projectsAPI, requests } from "api";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import LoadingBlock from "global/components/loading-block";
import Utility from "frontend/components/utility";
import GlobalUtility from "global/components/utility";
import HeadContent from "global/components/HeadContent";
import ResourceCollectionList from "frontend/components/resource-collection-list";

import withSettings from "hoc/with-settings";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

class ProjectResourceCollectionsContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const projectRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    const pagination = {
      number: page,
      size: perPage
    };
    const resourceCollectionRequest = request(
      projectsAPI.resourceCollections(match.params.id, {}, pagination),
      requests.feResourceCollections
    );
    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(resourceCollectionRequest);
    return Promise.all([one, two]);
  };

  static mapStateToProps = state => {
    return {
      project: select(requests.feProject, state.entityStore),
      resourceCollections: select(
        requests.feResourceCollections,
        state.entityStore
      ),
      meta: meta(requests.feResourceCollections, state.entityStore)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    resourceCollections: PropTypes.array,
    meta: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feResourceCollections));
  }

  fetchResourceCollections(pageParam = 1) {
    const action = request(
      projectsAPI.resourceCollections(
        this.props.project.id,
        {},
        { number: pageParam, size: perPage }
      ),
      requests.feResourceCollections
    );
    this.props.dispatch(action);
  }

  handlePaginationClick = pageParam => {
    return event => {
      event.preventDefault();
      return this.fetchResourceCollections(pageParam);
    };
  };

  render() {
    const { project, settings } = this.props;
    console.log(project)
    if (!project) return <LoadingBlock />;

    return (
      <div>
        <HeadContent
          title={`View \u201c${
            project.attributes.titlePlaintext
          }\u201d Resource Collections on ${
            settings.attributes.general.installationName
          }`}
          description={project.attributes.description}
          image={project.attributes.heroStyles.medium}
        />
        <section className="bg-neutral05">
          <Utility.BackLinkPrimary
            link={lh.link("frontendProject", project.attributes.slug)}
            title={project.attributes.titlePlaintext}
          />
        </section>
        <section>
          <div className="container">
            {this.props.resourceCollections && (
              <ResourceCollectionList.Grid
                project={this.props.project}
                resourceCollections={this.props.resourceCollections}
              />
            )}
            {this.props.meta && (
              <GlobalUtility.Pagination
                paginationClickHandler={this.handlePaginationClick}
                pagination={this.props.meta.pagination}
              />
            )}
          </div>
        </section>
        <section className="bg-neutral05">
          <Utility.BackLinkSecondary
            link={lh.link("frontendProject", project.attributes.slug)}
            title={project.attributes.titlePlaintext}
          />
        </section>
      </div>
    );
  }
}

export default connectAndFetch(
  withSettings(ProjectResourceCollectionsContainer)
);
