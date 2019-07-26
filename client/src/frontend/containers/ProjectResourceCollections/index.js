import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { projectsAPI, requests } from "api";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import LoadingBlock from "global/components/loading-block";
import GlobalUtility from "global/components/utility";
import HeadContent from "global/components/HeadContent";
import ResourceCollectionList from "frontend/components/resource-collection-list";
import BackLink from "frontend/components/back-link";
import withSettings from "hoc/with-settings";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

class ProjectResourceCollectionsContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const pagination = {
      number: page,
      size: perPage
    };
    const resourceCollectionRequest = request(
      projectsAPI.resourceCollections(match.params.id, {}, pagination),
      requests.feResourceCollections
    );
    const { promise: one } = dispatch(resourceCollectionRequest);
    return Promise.all([one]);
  };

  static mapStateToProps = state => {
    return {
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
        <h1 className="screen-reader-text">
          {`${project.attributes.titlePlaintext} Resource Collections`}
        </h1>
        <BackLink.Register
          link={lh.link("frontendProjectDetail", project.attributes.slug)}
          title={project.attributes.titlePlaintext}
        />
        <section>
          <div className="container">
            {this.props.resourceCollections && (
              <ResourceCollectionList.Grid
                project={this.props.project}
                resourceCollections={this.props.resourceCollections}
                itemHeadingLevel={2}
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
      </div>
    );
  }
}

export default connectAndFetch(
  withSettings(ProjectResourceCollectionsContainer)
);
