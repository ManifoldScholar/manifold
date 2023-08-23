import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { resourceCollectionsAPI, requests, projectsAPI } from "api";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/withConfirmation";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";

import Authorize from "hoc/Authorize";

const { request, flush } = entityStoreActions;

export class ResourceCollectionWrapperContainer extends PureComponent {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      resourceCollection: select(
        requests.beResourceCollection,
        state.entityStore
      ),
      project: select(requests.beProject, state.entityStore)
    };
  };

  static displayName = "ResourceCollection.Wrapper";

  static propTypes = {
    resourceCollection: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    route: PropTypes.object,
    history: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchCollection();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beResourceCollection));
  }

  componentDidUpdate(prevProps) {
    if (this.props.resourceCollection && !prevProps.resourceCollection) {
      const projectId = this.props.resourceCollection.attributes.projectId;
      this.fetchProject(projectId);
    }
  }

  fetchProject = id => {
    const call = projectsAPI.show(id);
    const projectRequest = request(call, requests.beProject);
    this.props.dispatch(projectRequest);
  };

  fetchCollection = () => {
    const call = resourceCollectionsAPI.show(this.props.match.params.id);
    const resourceCollectionRequest = request(
      call,
      requests.beResourceCollection
    );
    this.props.dispatch(resourceCollectionRequest);
  };

  doDestroy = () => {
    const call = resourceCollectionsAPI.destroy(
      this.props.resourceCollection.id
    );
    const options = { removes: this.props.resourceCollection };
    const resourceCollectionRequest = request(
      call,
      requests.beResourceCollectionDestroy,
      options
    );
    this.props.dispatch(resourceCollectionRequest).promise.then(() => {
      this.notifyDestroy();
      this.redirectToProjectCollections();
    });
  };

  redirectToProjectCollections() {
    const projectId = this.props.resourceCollection.relationships.project.id;
    const redirectUrl = lh.link("backendProjectResourceCollections", projectId);
    this.props.history.push(redirectUrl);
  }

  notifyDestroy() {
    const t = this.props.t;
    const notification = {
      level: 0,
      id: `RESOURCE_COLLECTION_DESTROYED_${this.props.resourceCollection.id}`,
      heading: t("notifications.resource_collection_delete"),
      body: t("notifications.delete_entity_body", {
        title: this.props.resourceCollection.attributes.title
      }),
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleCollectionDestroy = () => {
    const t = this.props.t;
    const heading = t("modals.delete_resource_collection");
    const message = t("modals.confirm_body");
    this.props.confirm(heading, message, this.doDestroy);
  };

  get utility() {
    const { resourceCollection } = this.props;
    return [
      {
        label: "actions.view",
        route: "frontendProjectResourceCollection",
        slug: resourceCollection.relationships.project.attributes.slug,
        resourceSlug: resourceCollection.attributes.slug,
        icon: "eyeOpen32"
      },
      {
        label: "actions.delete",
        icon: "delete32",
        authorize: "delete",
        onClick: this.handleCollectionDestroy
      }
    ];
  }

  renderRoutes() {
    const { resourceCollection, project } = this.props;
    return childRoutes(this.props.route, {
      childProps: { resourceCollection, project }
    });
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { resourceCollection, match, t } = this.props;
    /* eslint-enable no-unused-vars */
    if (!resourceCollection) return null;
    const secondaryLinks = navigation.resourceCollection(resourceCollection);

    const subpage = this.props.location?.pathname.split("/")[5];

    const belongsToJournalIssue =
      resourceCollection.relationships.project.attributes.isJournalIssue;

    const breadcrumbs = getBreadcrumbs(
      resourceCollection,
      resourceCollection.relationships.project,
      belongsToJournalIssue,
      t
    );

    const parentProps = {
      parentTitle:
        resourceCollection.relationships.project.attributes.titleFormatted,
      parentSubtitle:
        resourceCollection.relationships.project.attributes.subtitle,
      texts: resourceCollection.attributes.projectTextsNav,
      parentId: resourceCollection.relationships.project.id
    };

    return (
      <div>
        <Authorize
          entity={resourceCollection}
          failureFatalError={{
            body: t("resource_collections.unauthorized")
          }}
          ability="update"
        >
          {subpage && (
            <HeadContent
              title={`${t(`titles.${subpage}`)} | ${
                resourceCollection.attributes.title
              } | ${t("common.admin")}`}
              appendDefaultTitle
            />
          )}
          <RedirectToFirstMatch
            route="backendResourceCollection"
            id={resourceCollection.id}
            slug={resourceCollection.attributes.slug}
            candidates={secondaryLinks}
          />
          <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
          <PageHeader
            type="resourceCollection"
            backUrl={lh.link(
              "backendProjectResourceCollections",
              resourceCollection.relationships.project.id
            )}
            backLabel={
              resourceCollection.relationships.project.attributes.titlePlaintext
            }
            actions={this.utility}
            title={resourceCollection.attributes.title}
            secondaryLinks={secondaryLinks}
            icon="ResourceCollection64"
            {...parentProps}
          />
          <Layout.BackendPanel
            sidebar={
              <Layout.SecondaryNav
                links={secondaryLinks}
                panel
                ariaLabel={t("resource_collections.settings")}
              />
            }
          >
            <div>{this.renderRoutes()}</div>
          </Layout.BackendPanel>
        </Authorize>
      </div>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(ResourceCollectionWrapperContainer))
);
