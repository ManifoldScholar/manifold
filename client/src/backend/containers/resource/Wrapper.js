import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { resourcesAPI, requests } from "api";
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

export class ResourceWrapperContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      resource: select(requests.beResource, state.entityStore)
    };
  };

  static displayName = "Resource.Wrapper";

  static propTypes = {
    resource: PropTypes.object,
    match: PropTypes.object,
    dispatch: PropTypes.func,
    history: PropTypes.object,
    route: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchResource();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beResource));
  }

  fetchResource = () => {
    const call = resourcesAPI.show(this.props.match.params.id);
    const resourceRequest = request(call, requests.beResource);
    this.props.dispatch(resourceRequest);
  };

  doDestroy = () => {
    const call = resourcesAPI.destroy(this.props.resource.id);
    const options = { removes: this.props.resource };
    const resourceRequest = request(call, requests.beResourceDestroy, options);
    this.props.dispatch(resourceRequest).promise.then(() => {
      this.notifyDestroy();
      this.redirectToProjectResources();
    });
  };

  redirectToProjectResources() {
    const projectId = this.props.resource.relationships.project.id;
    const redirectUrl = lh.link("backendProjectResources", projectId);
    this.props.history.push(redirectUrl);
  }

  notifyDestroy() {
    const t = this.props.t;
    const notification = {
      level: 0,
      id: `RESOURCE_DESTROYED_${this.props.resource.id}`,
      heading: t("notifications.resource_delete"),
      body: t("notifications.delete_entity_body", {
        title: this.props.resource.attributes.title
      }),
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleResourceDestroy = () => {
    const t = this.props.t;
    const heading = t("modals.delete_resource");
    const message = t("modals.confirm_body");
    this.props.confirm(heading, message, this.doDestroy);
  };

  get utility() {
    const { resource } = this.props;
    const { project } = resource.relationships ?? {};

    return [
      {
        label: "actions.view",
        route: "frontendProjectResource",
        slug: project.attributes.slug,
        resourceSlug: resource.attributes.slug,
        icon: "eyeOpen32"
      },
      {
        label: "actions.delete",
        icon: "delete32",
        authorize: "delete",
        onClick: this.handleResourceDestroy
      }
    ];
  }

  renderRoutes() {
    const { resource } = this.props;
    return childRoutes(this.props.route, { childProps: { resource } });
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { resource, t } = this.props;
    /* eslint-enable no-unused-vars */
    if (!resource) return null;
    const secondaryLinks = navigation.resource(resource);

    const subpage = location.pathname.split("/")[5];

    const belongsToJournalIssue =
      resource.relationships.project.attributes.isJournalIssue;

    const breadcrumbs = getBreadcrumbs(
      resource,
      resource.relationships.project,
      belongsToJournalIssue,
      t
    );

    const parentProps = {
      parentTitle: resource.relationships.project.attributes.titleFormatted,
      parentSubtitle: resource.relationships.project.attributes.subtitle,
      texts: resource.attributes.projectTextsNav,
      parentId: resource.relationships.project.id
    };

    return (
      <div>
        <Authorize
          entity={resource}
          failureFatalError={{
            body: t("resources.unauthorized")
          }}
          ability="update"
        >
          {subpage && (
            <HeadContent
              title={`${t(`titles.${subpage}`)} | ${
                resource.attributes.titlePlaintext
              } | ${t("common.admin")}`}
              appendDefaultTitle
            />
          )}
          <RedirectToFirstMatch
            route="backendResource"
            id={resource.id}
            slug={resource.attributes.slug}
            candidates={secondaryLinks}
          />
          <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
          <PageHeader
            type="resource"
            actions={this.utility}
            title={resource.attributes.titleFormatted}
            subtitle={resource.attributes.subtitle}
            secondaryLinks={secondaryLinks}
            icon="BEResourcesBox64"
            {...parentProps}
          />
          <Layout.BackendPanel
            sidebar={
              <Layout.SecondaryNav
                links={secondaryLinks}
                panel
                ariaLabel={t("resources.settings")}
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
  withConfirmation(connectAndFetch(ResourceWrapperContainer))
);
