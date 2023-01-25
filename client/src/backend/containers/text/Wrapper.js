import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { textsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import withConfirmation from "hoc/withConfirmation";
import IconComposer from "global/components/utility/IconComposer";

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
      heading: t("texts.modals.destroyed_heading"),
      body: t("texts.modals.destroyed_body", {
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
    const heading = t("texts.modals.delete_text_heading");
    const message = t("texts.modals.delete_text_body");
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
            className="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">{t("actions.view")}</span>
        </Link>
        <button onClick={this.handleTextDestroy} className="utility-button">
          <IconComposer
            icon="delete32"
            size={26}
            className="utility-button__icon utility-button__icon--notice"
          />
          <span className="utility-button__text">{t("actions.delete")}</span>
        </button>
        <button onClick={this.toggleExportsAsEpubV3} className="utility-button">
          <IconComposer
            icon={exportsAsEpubV3 ? "circleMinus24" : "circlePlus24"}
            size={26}
            className="utility-button__icon utility-button__icon--download"
          />
          <span className="utility-button__text">
            {exportsAsEpubV3
              ? t("texts.disable_epub")
              : t("texts.enable_epub")}
          </span>
        </button>
        {epubV3ExportUrl && (
          <a href={epubV3ExportUrl} download className="utility-button">
            <IconComposer
              icon="download24"
              size={26}
              className="utility-button__icon utility-button__icon--download"
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
              className="utility-button__icon utility-button__icon--download"
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
              className="utility-button__icon utility-button__icon--download"
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

    return (
      <div>
        <Authorize
          entity={text}
          failureFatalError={{
            body: t("texts.unauthorized")
          }}
          ability={["update"]}
        >
          <RedirectToFirstMatch
            from={lh.link("backendText", text.id)}
            candidates={secondaryLinks}
          />
          <Navigation.DetailHeader
            type="text"
            backUrl={lh.link(
              "backendProjectTexts",
              text.relationships.project.id
            )}
            backLabel={text.relationships.project.attributes.titlePlaintext}
            title={text.attributes.titlePlaintext}
            subtitle={text.attributes.subtitlePlaintext}
            utility={this.renderUtility()}
            secondaryLinks={secondaryLinks}
          />
          <Layout.BackendPanel
            sidebar={
              <Navigation.Secondary
                links={secondaryLinks}
                panel
                ariaLabel={t("texts.settings")}
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
  withConfirmation(connectAndFetch(TextWrapperContainer))
);
