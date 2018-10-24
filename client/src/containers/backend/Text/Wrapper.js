import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Dialog, Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { textsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";

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
    route: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

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

  closeDialog() {
    this.setState({ confirmation: null });
  }

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
      body: `${
        this.props.text.attributes.title
      } has passed into the endless night.`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  redirectToProjectTexts() {
    const projectId = this.props.text.relationships.project.id;
    const redirectUrl = lh.link("backendProjectTexts", projectId);
    this.props.history.push(redirectUrl);
  }

  handleTextDestroy = event => {
    const heading = "Are you sure you want to delete this text?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.doDestroy(event);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
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
      <div>
        <button onClick={this.doPreview} className="button-bare-primary">
          <i className="manicon manicon-eye-outline" aria-hidden="true" />
          Preview{" "}
        </button>
        <button
          onClick={this.handleTextDestroy}
          className="button-bare-primary"
        >
          <i className="manicon manicon-trashcan" aria-hidden="true" />
          Delete
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
    const skipId = "skip-to-text-panel";
    const secondaryLinks = navigation.text(text);

    return (
      <div>
        <HigherOrder.Authorize
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

          {this.state.confirmation ? (
            <Dialog.Confirm {...this.state.confirmation} />
          ) : null}
          <Navigation.DetailHeader
            type="text"
            backUrl={lh.link(
              "backendProjectTexts",
              text.relationships.project.id
            )}
            backLabel={text.relationships.project.attributes.title}
            title={text.attributes.title}
            subtitle={text.attributes.subtitle}
            utility={this.renderUtility()}
            secondaryLinks={secondaryLinks}
          />
          <section className="backend-panel">
            <Utility.SkipLink skipId={skipId} />
            <div className="container">
              <Navigation.Secondary links={secondaryLinks} panel />
              <div id={skipId} className="panel">
                {this.renderRoutes()}
              </div>
            </div>
          </section>
        </HigherOrder.Authorize>
      </div>
    );
  }
}

export default connectAndFetch(TextWrapperContainer);
