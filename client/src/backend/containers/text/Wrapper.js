import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { textsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import withConfirmation from "hoc/withConfirmation";
import IconComposer from "global/components/utility/IconComposer";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";

import Authorize from "hoc/Authorize";
import { Link } from "react-router-dom";

const { request } = entityStoreActions;

export class TextWrapperContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      text: select(requests.beText, state.entityStore)
    };
  };

  static displayName = "Text.Wrapper";

  static propTypes = {
    children: PropTypes.object,
    text: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    route: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchText();
  }

  componentDidUpdate() {
    const {
      params: { id: nextId }
    } = this.props.match ?? {};
    const prevId = this.props.text?.id;
    if (nextId && prevId && nextId !== prevId) this.fetchText();
  }

  componentWillUnmount() {
    this.props.dispatch(entityStoreActions.flush(requests.beText));
  }

  fetchText = () => {
    const call = textsAPI.show(this.props.match.params.id);
    const textRequest = request(call, requests.beText);
    this.props.dispatch(textRequest);
  };

  doDestroy = () => {
    const call = textsAPI.destroy(this.props.text.id);
    const options = { removes: this.props.text };
    const textRequest = request(call, requests.beTextDestroy, options);
    this.props.dispatch(textRequest).promise.then(() => {
      this.notifyDestroy();
      this.redirectToProjectTexts();
    });
  };

  toggleExportsAsEpubV3 = () => {
    const call = textsAPI.toggleEpubV3Export(this.props.text.id);
    const textRequest = request(call, requests.beText);
    this.props.dispatch(textRequest);
  };

  notifyDestroy() {
    const t = this.props.t;
    const notification = {
      level: 0,
      id: `TEXT_DESTROYED_${this.props.text.id}`,
      heading: t("notifications.text_delete"),
      body: t("notifications.delete_entity_body", {
        title: this.props.text.attributes.titlePlaintext
      }),
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  redirectToProjectTexts() {
    const projectId = this.props.text.relationships.project.id;
    const redirectUrl = lh.link("backendProjectTexts", projectId);
    this.props.history.push(redirectUrl);
  }

  handleTextDestroy = () => {
    const t = this.props.t;
    const heading = t("modals.delete_text");
    const message = t("modals.delete_text_body");
    this.props.confirm(heading, message, this.doDestroy);
  };

  previewUrl() {
    return lh.link("reader", this.props.text.attributes.slug);
  }

  renderUtility() {
    const { text, t } = this.props;
    const {
      attributes: { exportsAsEpubV3, epubV3ExportUrl }
    } = text;

    return (
      <div className="utility-button-group utility-button-group--inline">
        <Link to={this.previewUrl()} className="utility-button">
          <IconComposer
            icon="eyeOpen32"
            size={26}
            className="utility-button__icon"
          />
          <span className="utility-button__text">{t("actions.view")}</span>
        </Link>
        <button onClick={this.handleTextDestroy} className="utility-button">
          <IconComposer
            icon="delete32"
            size={26}
            className="utility-button__icon"
          />
          <span className="utility-button__text">{t("actions.delete")}</span>
        </button>
        <button onClick={this.toggleExportsAsEpubV3} className="utility-button">
          <IconComposer
            icon={exportsAsEpubV3 ? "circleMinus24" : "circlePlus24"}
            size={26}
            className="utility-button__icon"
          />
          <span className="utility-button__text">
            {exportsAsEpubV3 ? t("texts.disable_epub") : t("texts.enable_epub")}
          </span>
        </button>
        {epubV3ExportUrl && (
          <a href={epubV3ExportUrl} download className="utility-button">
            <IconComposer
              icon="download24"
              size={26}
              className="utility-button__icon"
            />
            <span className="utility-button__text">
              {t("texts.download_epub")}
            </span>
          </a>
        )}
        {text.attributes.ingestionSourceDownloadUrl && (
          <a
            href={text.attributes.ingestionSourceDownloadUrl}
            download
            className="utility-button"
          >
            <IconComposer
              icon="download24"
              size={26}
              className="utility-button__icon"
            />
            <span className="utility-button__text">
              {t("texts.download_source")}
            </span>
          </a>
        )}
        {text.attributes.ingestionExternalSourceUrl && (
          <a
            href={text.attributes.ingestionExternalSourceUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="utility-button"
          >
            <IconComposer
              icon="link24"
              size={26}
              className="utility-button__icon"
            />
            <span className="utility-button__text">
              {t("texts.visit_source")}
            </span>
          </a>
        )}
      </div>
    );
  }

  renderRoutes() {
    /* eslint-disable no-unused-vars */
    const { match, history, location, ...otherProps } = this.props;
    /* eslint-enable no-unused-vars */
    otherProps.refresh = this.fetchText;
    return childRoutes(this.props.route, { childProps: otherProps });
  }

  render() {
    const { text, t } = this.props;
    if (!text) return null;
    const secondaryLinks = navigation.text(text);
    const subpage = location.pathname.split("/")[5]?.replace("-", "_");

    const parentProps = {
      parentTitle: text.relationships.project.attributes.titleFormatted,
      parentSubtitle: text.relationships.project.attributes.subtitle,
      texts: text.relationships.project.attributes.textsNav,
      parentId: text.relationships.project.id
    };

    const belongsToJournalIssue =
      text.relationships.project.attributes.isJournalIssue;

    const breadcrumbs = getBreadcrumbs(text, belongsToJournalIssue, t);

    return (
      <>
        <Authorize
          entity={text}
          failureFatalError={{
            body: t("texts.unauthorized")
          }}
          ability={["update"]}
        >
          {subpage && (
            <HeadContent
              title={`${t(`titles.${subpage}`)} | ${
                text.attributes.titlePlaintext
              } | ${t("common.admin")}`}
              appendDefaultTitle
            />
          )}
          <RedirectToFirstMatch
            from={lh.link("backendText", text.id)}
            candidates={secondaryLinks}
          />
          <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
          <PageHeader
            type={belongsToJournalIssue ? "article" : "text"}
            title={text.attributes.titleFormatted}
            subtitle={text.attributes.subtitle}
            utility={this.renderUtility()}
            secondaryLinks={secondaryLinks}
            {...parentProps}
          />
          <Layout.BackendPanel
            sidebar={
              <Layout.SecondaryNav
                links={secondaryLinks}
                panel
                ariaLabel={t("texts.settings")}
              />
            }
          >
            <div>{this.renderRoutes()}</div>
          </Layout.BackendPanel>
        </Authorize>
      </>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(TextWrapperContainer))
);
