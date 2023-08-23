import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { pagesAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";
import { entityStoreActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import Layout from "backend/components/layout";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";

import Authorize from "hoc/Authorize";

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class PageDetailContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      page: select(requests.bePage, state.entityStore)
    };
  };

  static displayName = "Pages.Edit";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    page: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id !== "new") this.fetchPage(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.id(this.props) !== this.id(prevProps)) {
      this.fetchPage(this.props);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.bePage));
  }

  fetchPage(props) {
    const id = this.id(props);
    const call = pagesAPI.show(id);
    const pageRequest = request(call, requests.bePage);
    props.dispatch(pageRequest);
  }

  redirectToPages() {
    const path = lh.link("backendRecordsPages");
    this.props.history.push(path);
  }

  redirectToList() {
    const path = lh.link("backendRecordsPages");
    this.props.history.push(path);
  }

  notifyDestroy(feature) {
    const t = this.props.t;
    const notification = {
      level: 0,
      id: `PAGE_DESTROYED_${feature.id}`,
      heading: t("notifications.page_delete"),
      body: t("notifications.delete_record_body"),
      expiration: 3000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleSuccess = pageIgnored => {
    this.redirectToPages();
  };

  handleDestroy = () => {
    const t = this.props.t;
    const heading = t("modals.delete_page");
    const message = t("modals.confirm_body");
    this.props.confirm(heading, message, this.doDestroy);
  };

  doDestroy = () => {
    const { page } = this.props;
    const call = pagesAPI.destroy(page.id);
    const options = { removes: page };
    const pageRequest = request(call, requests.bePageDestroy, options);
    this.props.dispatch(pageRequest).promise.then(() => {
      this.notifyDestroy(page);
      this.redirectToList();
    });
  };

  isNew(props) {
    return this.id(props) === "new";
  }

  id(props) {
    return props.match.params.id;
  }

  page(props) {
    return props.page;
  }

  renderNewHeader() {
    const t = this.props.t;
    return (
      <PageHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel={t("records.pages.back_label")}
        title={t("records.pages.new_header")}
        note={t("records.pages.new_instructions")}
        icon="ResourceDocument64"
      />
    );
  }

  renderExistingHeader(page) {
    if (!page) return null;
    const t = this.props.t;
    const subtitle = page.attributes.isExternalLink
      ? page.attributes.externalLink
      : `/page/${page.attributes.slug}`;

    return (
      <PageHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel={t("records.pages.back_label")}
        title={page.attributes.title}
        subtitle={subtitle}
        actions={this.utility}
        icon="ResourceDocument64"
      />
    );
  }

  get utility() {
    return [
      {
        label: "actions.view",
        route: "frontendPage",
        slug: this.props.page.attributes.slug,
        icon: "eyeOpen32"
      },
      {
        label: "actions.delete",
        authorize: "update",
        icon: "delete32",
        onClick: this.handleDestroy
      }
    ];
  }

  renderNew() {
    return (
      <div>
        {this.renderNewHeader()}
        <Layout.BackendPanel>
          <section>{this.renderRoutes()}</section>
        </Layout.BackendPanel>
      </div>
    );
  }

  renderExisting(page) {
    if (!page) return null;
    const secondaryLinks = navigation.page(page);
    const t = this.props.t;

    return (
      <div>
        <RedirectToFirstMatch
          route={"backendRecordsPage"}
          id={this.id(this.props)}
          candidates={secondaryLinks}
        />
        {this.renderExistingHeader(page)}
        <Layout.BackendPanel
          sidebar={
            <Layout.SecondaryNav
              links={secondaryLinks}
              panel
              ariaLabel={t("records.pages.settings")}
            />
          }
        >
          <div>{this.renderRoutes()}</div>
        </Layout.BackendPanel>
      </div>
    );
  }

  renderRoutes() {
    const { page } = this.props;
    return childRoutes(this.props.route, { childProps: { page } });
  }

  render() {
    const page = this.page(this.props);
    const isNew = this.isNew(this.props);
    const authProps = isNew
      ? { entity: "page", ability: "create" }
      : { entity: page, ability: "update" };

    if (!authProps.entity) return null;

    const t = this.props.t;

    return (
      <Authorize
        failureFatalError={{
          body: t(`records.pages.unauthorized_${authProps.abiltiy}`)
        }}
        {...authProps}
      >
        {isNew ? this.renderNew() : this.renderExisting(page)}
      </Authorize>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(PageDetailContainer))
);
