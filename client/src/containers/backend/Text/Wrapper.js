import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Dialog, Navigation } from "components/backend";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { textsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";

const { request } = entityStoreActions;

export class TextWrapperContainer extends PureComponent {
  static displayName = "Text.Wrapper";

  static mapStateToProps = state => {
    return {
      text: select(requests.beText, state.entityStore)
    };
  };

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
    this.doPreview = this.doPreview.bind(this);
    this.doDestroy = this.doDestroy.bind(this);
    this.handleTextDestroy = this.handleTextDestroy.bind(this);
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

  secondaryNavigationLinks(text) {
    return [
      {
        path: lh.link("backendText", text.id),
        label: "General",
        key: "general"
      },
      {
        path: lh.link("backendTextCollaborators", text.id),
        label: "People",
        key: "collaborators"
      },
      {
        path: lh.link("backendTextMetadata", text.id),
        label: "Metadata",
        key: "metadata"
      },
      {
        path: lh.link("backendTextStyles", text.id),
        label: "Styles",
        key: "styles"
      },
      {
        path: lh.link("backendTextIngestionsNew", text.id),
        label: "Reingest",
        key: "reingest"
      }
    ];
  }

  doDestroy() {
    const call = textsAPI.destroy(this.props.text.id);
    const options = { removes: this.props.text };
    const textRequest = request(call, requests.beTextDestroy, options);
    this.props.dispatch(textRequest).promise.then(() => {
      this.redirectToDashboard();
    });
  }

  redirectToDashboard() {
    this.props.history.push(lh.link("backend"));
  }

  handleTextDestroy(event) {
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
  }

  doPreview(event) {
    event.preventDefault();
    const win = window.open(
      lh.link("reader", this.props.text.attributes.slug),
      "_blank"
    );
    win.focus();
  }

  renderUtility() {
    return (
      <div>
        <button onClick={this.doPreview} className="button-bare-primary">
          Preview <i className="manicon manicon-eye-outline" />
        </button>
        <button
          onClick={this.handleTextDestroy}
          className="button-bare-primary"
        >
          Delete <i className="manicon manicon-trashcan" />
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
    return (
      <div>
        {this.state.confirmation
          ? <Dialog.Confirm {...this.state.confirmation} />
          : null}
        <Navigation.DetailHeader
          type="text"
          breadcrumb={[
            { path: lh.link("backend"), label: "ALL PROJECTS" },
            {
              path: lh.link(
                "backendProjectTexts",
                text.relationships.project.id
              ),
              label: text.relationships.project.attributes.title
            }
          ]}
          title={text.attributes.title}
          subtitle={text.attributes.subtitle}
          utility={this.renderUtility()}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(text)}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(text)}
              />
            </aside>
            <div className="panel">
              {this.renderRoutes()}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(TextWrapperContainer);
