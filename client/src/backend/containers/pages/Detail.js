import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { pagesAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";
import { entityStoreActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/with-confirmation";

import Authorize from "hoc/authorize";

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class PageDetailContainer extends PureComponent {
  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  static displayName = "Pages.Edit";

  static mapStateToProps = state => {
    return {
      page: select(requests.bePage, state.entityStore)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    page: PropTypes.object,
    confirm: PropTypes.func.isRequired
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

  doPreview = event => {
    event.preventDefault();
    const attr = this.props.page.attributes;
    const previewUrl = attr.isExternalLink
      ? attr.externalLink
      : lh.link("frontendPage", attr.slug);
    const win = window.open(previewUrl, "_blank");
    win.focus();
  };

  handleDestroy = () => {
    const heading = "Are you sure you want to delete this page?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.doDestroy);
  };

  handleSuccess = pageIgnored => {
    this.redirectToPages();
  };

  fetchPage(props) {
    const id = this.id(props);
    const call = pagesAPI.show(id);
    const pageRequest = request(call, requests.bePage);
    props.dispatch(pageRequest);
  }

  id(props) {
    return props.match.params.id;
  }

  isNew(props) {
    return this.id(props) === "new";
  }

  notifyDestroy(feature) {
    const notification = {
      level: 0,
      id: `PAGE_DESTROYED_${feature.id}`,
      heading: "The page has been deleted.",
      body: `And we're sorry to see it go.`,
      expiration: 3000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  page(props) {
    return props.page;
  }

  redirectToList() {
    const path = lh.link("backendRecordsPages");
    this.props.history.push(path);
  }

  redirectToPages() {
    const path = lh.link("backendRecordsPages");
    this.props.history.push(path);
  }

  renderExisting(page) {
    if (!page) return null;
    const secondaryLinks = navigation.page(page);

    return (
      <div>
        <RedirectToFirstMatch
          from={lh.link("backendRecordsPage", this.id(this.props))}
          candidates={secondaryLinks}
        />
        {this.renderExistingHeader(page)}
        <Layout.BackendPanel
          sidebar={<Navigation.Secondary links={secondaryLinks} panel />}
        >
          <div>{this.renderRoutes()}</div>
        </Layout.BackendPanel>
      </div>
    );
  }

  renderExistingHeader(page) {
    if (!page) return null;
    const subtitle = page.attributes.isExternalLink
      ? page.attributes.externalLink
      : `/page/${page.attributes.slug}`;

    return (
      <Navigation.DetailHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel="All Pages"
        title={page.attributes.title}
        subtitle={subtitle}
        utility={this.renderUtility()}
      />
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

  renderNewHeader() {
    return (
      <Navigation.DetailHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel="All Pages"
        title="New Page"
        showUtility={false}
        note="Enter the name of your page and, optionally, a slug. Press save to continue."
      />
    );
  }

  renderRoutes() {
    const { page } = this.props;
    return childRoutes(this.props.route, { childProps: { page } });
  }

  renderUtility() {
    return (
      <div>
        <button
          onClick={this.doPreview}
          className="button-bare-primary"
          type="button"
        >
          <i className="manicon manicon-eye-outline" aria-hidden="true" />
          Preview{" "}
        </button>
        <Authorize entity={this.props.page} ability="update">
          <button
            onClick={this.handleDestroy}
            className="button-bare-primary"
            type="button"
          >
            <i className="manicon manicon-trashcan" aria-hidden="true" />
            Delete
          </button>
        </Authorize>
      </div>
    );
  }

  render() {
    const page = this.page(this.props);
    const isNew = this.isNew(this.props);
    const authProps = isNew
      ? { entity: "page", ability: "create" }
      : { entity: page, ability: "update" };

    if (!authProps.entity) return null;

    return (
      <Authorize
        failureFatalError={{
          body: `You are not allowed to ${authProps.ability} pages.`
        }}
        {...authProps}
      >
        {isNew ? this.renderNew() : this.renderExisting(page)}
      </Authorize>
    );
  }
}

export default withConfirmation(connectAndFetch(PageDetailContainer));
