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
import Navigation from "backend/components/navigation";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/withConfirmation";
import IconComposer from "global/components/utility/IconComposer";
import { Link } from "react-router-dom";

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
      heading: t("records.pages.delete_confirm_heading"),
      body: t("records.pages.delete_confim_body"),
      expiration: 3000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleSuccess = pageIgnored => {
    this.redirectToPages();
  };

  handleDestroy = () => {
    const t = this.props.t;
    const heading = t("records.pages.delete_modal_heading");
    const message = t("records.pages.delete_modal_message");
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
      <Navigation.DetailHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel={t("records.pages.back_label")}
        title={t("records.pages.new_header")}
        showUtility={false}
        note={t("records.pages.new_instructions")}
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
      <Navigation.DetailHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel={t("records.pages.back_label")}
        title={page.attributes.title}
        subtitle={subtitle}
        utility={this.renderUtility()}
      />
    );
  }

  renderUtility() {
    const t = this.props.t;
    return (
      <div className="utility-button-group utility-button-group--inline">
        <Link
          to={lh.link("frontendPage", this.props.page.attributes.slug)}
          className="utility-button"
        >
          <IconComposer
            icon="eyeOpen32"
            size={26}
            className="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">{t("actions.view")}</span>
        </Link>
        <Authorize entity={this.props.page} ability="update">
          <button onClick={this.handleDestroy} className="utility-button">
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
          from={lh.link("backendRecordsPage", this.id(this.props))}
          candidates={secondaryLinks}
        />
        {this.renderExistingHeader(page)}
        <Layout.BackendPanel
          sidebar={
            <Navigation.Secondary
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
