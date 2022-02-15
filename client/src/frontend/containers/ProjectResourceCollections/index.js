import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { projectsAPI, requests } from "api";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import LoadingBlock from "global/components/loading-block";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import withSettings from "hoc/withSettings";

const { request, flush } = entityStoreActions;
const defaultPage = 1;
const perPage = 10;

class ProjectResourceCollectionsContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const pagination = {
      number: defaultPage,
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
      resourceCollectionsMeta: meta(
        requests.feResourceCollections,
        state.entityStore
      )
    };
  };

  static propTypes = {
    project: PropTypes.object,
    resourceCollections: PropTypes.array,
    resourceCollectionsMeta: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    journalBreadcrumbs: PropTypes.array
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

  pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      this.handlePageChange(pageParam);
    };
  };

  get hasCollections() {
    return !!this.props.resourceCollections?.length;
  }

  renderPlaceholder(id) {
    return <EntityCollectionPlaceholder.ResourceCollections id={id} />;
  }

  breadcrumbs() {
    const { journalBreadcrumbs, project } = this.props;
    const projectCrumb = {
      to: lh.link("frontendProject", project.attributes.slug),
      label: project.attributes.titlePlaintext
    };
    const collectionsCrumb = {
      to: lh.link(
        "frontendProjectResourceCollections",
        project.attributes.slug
      ),
      label: "Resource Collections"
    };
    return journalBreadcrumbs
      ? [...journalBreadcrumbs, collectionsCrumb].filter(Boolean)
      : [projectCrumb, collectionsCrumb].filter(Boolean);
  }

  render() {
    const { project, settings } = this.props;
    if (!project) return <LoadingBlock />;

    return (
      <>
        <CheckFrontendMode
          debugLabel="ProjectResourceCollections"
          isProjectSubpage
        />
        <HeadContent
          title={`View \u201c${project.attributes.titlePlaintext}\u201d Resource Collections on ${settings.attributes.general.installationName}`}
          description={project.attributes.description}
          image={project.attributes.heroStyles.medium}
        />
        <h1 className="screen-reader-text">
          {`${project.attributes.titlePlaintext} Resource Collections`}
        </h1>
        <RegisterBreadcrumbs breadcrumbs={this.breadcrumbs()} />
        {!this.hasCollections ? (
          this.renderPlaceholder(project.id)
        ) : (
          <EntityCollection.ProjectResourceCollections
            resourceCollections={this.props.resourceCollections}
            resourceCollectionsMeta={this.props.resourceCollectionsMeta}
            paginationProps={{
              paginationClickHandler: this.pageChangeHandlerCreator
            }}
            itemHeadingLevel={2}
          />
        )}
      </>
    );
  }
}

export default connectAndFetch(
  withSettings(ProjectResourceCollectionsContainer)
);
