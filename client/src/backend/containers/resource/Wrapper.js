import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { resourcesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/withConfirmation";
import IconComposer from "global/components/utility/IconComposer";

import Authorize from "hoc/Authorize";
import { Link } from "react-router-dom";

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

  renderUtility(resource) {
    const project = resource.relationships.project;
    const previewUrl = lh.link(
      "frontendProjectResource",
      project.attributes.slug,
      resource.attributes.slug
    );
    const t = this.props.t;

    return (
      <div className="utility-button-group utility-button-group--inline">
        <Link to={previewUrl} className="utility-button">
          <IconComposer
            icon="eyeOpen32"
            size={26}
            className="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">{t("actions.view")}</span>
        </Link>
        <Authorize entity={resource} ability={"delete"}>
          <button
            onClick={this.handleResourceDestroy}
            className="utility-button"
          >
            <IconComposer
              icon="delete32"
              size={26}
              className="utility-button__icon utility-button__icon--notice"
            />
            <span className="utility-button__text">{t("actions.delete")}</span>
          </button>
        </Authorize>
      </div>
    );
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

    return (
      <div>
        <Authorize
          entity={resource}
          failureFatalError={{
            body: t("resources.unauthorized")
          }}
          ability="update"
        >
          <RedirectToFirstMatch
            from={lh.link("backendResource", resource.id)}
            candidates={secondaryLinks}
          />
          <Navigation.DetailHeader
            type="resource"
            backUrl={lh.link(
              "backendProjectResources",
              resource.relationships.project.id
            )}
            backLabel={resource.relationships.project.attributes.titlePlaintext}
            utility={this.renderUtility(resource)}
            title={resource.attributes.titleFormatted}
            subtitle={resource.attributes.subtitle}
            secondaryLinks={secondaryLinks}
          />
          <Layout.BackendPanel
            sidebar={
              <Navigation.Secondary
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
