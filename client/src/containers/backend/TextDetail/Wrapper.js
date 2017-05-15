import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Dialog, Text, Navigation } from 'components/backend';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
import { textsAPI, requests } from 'api';
import lh from 'helpers/linkHandler';
import { renderRoutes } from 'helpers/routing';

const { request, flush } = entityStoreActions;

export class TextDetailWrapperContainer extends PureComponent {

  static displayName = "TextDetail.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
      text: select(requests.beText, state.entityStore)
    };
  }

  static propTypes = {
    children: PropTypes.object,
    text: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
    this.doPreview = this.doPreview.bind(this);
    this.doDestroy = this.doDestroy.bind(this);
    this.handleTextDestroy = this.handleTextDestroy .bind(this);
  }

  componentDidMount() {
    this.fetchText();
  }

  componentWillUnmount() {
    this.props.dispatch(entityStoreActions.flush(requests.beText));
  }

  fetchText() {
    const call = textsAPI.show(this.props.match.params.id);
    const textRequest = request(call, requests.beText);
    this.props.dispatch(textRequest);
  }

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
    }).then(() => {
      this.doDestroy(event);
      this.closeDialog();
    }, () => { this.closeDialog(); });
  }

  doPreview(event) {
    event.preventDefault();
    const win = window.open(lh.link("reader", this.props.text.id), '_blank');
    win.focus();
  }

  renderUtility() {
    return (
      <div>
        <button
          onClick={this.doPreview}
          className="button-bare-primary"
        >
          Preview <i className="manicon manicon-eye-outline"></i>
        </button>
        <button
          onClick={this.handleTextDestroy}
          className="button-bare-primary"
        >
          Delete <i className="manicon manicon-trashcan"></i>
        </button>
      </div>
    );
  }

  renderRoutes() {
    const { _routes, ...otherProps } = this.props;
    const childRoutes = renderRoutes(this.props.route.routes, otherProps);
    return childRoutes;
  }

  render() {
    const { match, text } = this.props;
    if (!text) return null;

    return (
      <div>
        {
          this.state.confirmation ?
            <Dialog.Confirm {...this.state.confirmation} />
            : null
        }
        <Navigation.DetailHeader
          type="text"
          breadcrumb={[
            { path: lh.link("backend"), label: "ALL PROJECTS" },
            {
              path: lh.link("backendProjectTexts", text.relationships.project.id),
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

export default connectAndFetch(TextDetailWrapperContainer);

