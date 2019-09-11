import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { textsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import withConfirmation from "hoc/with-confirmation";
import IconComposer from "global/components/utility/IconComposer";

import Authorize from "hoc/authorize";

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
    confirm: PropTypes.func.isRequired
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

  notifyDestroy() {
    const notification = {
      level: 0,
      id: `TEXT_DESTROYED_${this.props.text.id}`,
      heading: "The text has been destroyed.",
      body: `${this.props.text.attributes.titlePlaintext} has passed into the endless night.`,
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
    const heading = "Are you sure you want to delete this text?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.doDestroy);
  };

  doPreview = event => {
    event.preventDefault();
    const win = window.open(
      lh.link("reader", this.props.text.attributes.slug),
      "_blank"
    );
    win.focus();
  };

  renderUtility() {
    return (
      <div className="utility-button-group utility-button-group--inline">
        <button onClick={this.doPreview} className="utility-button">
          <IconComposer
            icon="eyeOpen32"
            size={26}
            iconClass="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">Preview</span>
        </button>
        <button onClick={this.handleTextDestroy} className="utility-button">
          <IconComposer
            icon="delete32"
            size={26}
            iconClass="utility-button__icon utility-button__icon--notice"
          />
          <span className="utility-button__text">Delete</span>
        </button>
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
    const { text } = this.props;
    if (!text) return null;
    const secondaryLinks = navigation.text(text);

    return (
      <div>
        <Authorize
          entity={text}
          failureFatalError={{
            body: "You are not allowed to update this text."
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
                ariaLabel="Text Settings"
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

export default withConfirmation(connectAndFetch(TextWrapperContainer));
