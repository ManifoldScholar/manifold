import React, { PureComponent, PropTypes } from 'react';
import { Dialog, Text, Navigation } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { textsAPI, requests } from 'api';
import get from 'lodash/get';
import { browserHistory } from 'react-router';

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class TextDetailWrapperContainer extends PureComponent {

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
    const call = textsAPI.show(this.props.params.id);
    const textRequest = request(call, requests.beText);
    this.props.dispatch(textRequest);
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  secondaryNavigationLinks(text) {
    return [
      {
        path: `/backend/text/${text.id}/`,
        label: "General",
        key: "general"
      },
      {
        path: `/backend/text/${text.id}/collaborators`,
        label: "People",
        key: "collaborators"
      },
      {
        path: `/backend/text/${text.id}/metadata`,
        label: "Metadata",
        key: "metadata"
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
    browserHistory.push("/backend");
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
    const win = window.open(`/read/${this.props.text.id}`, '_blank');
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

  render() {
    if (!this.props.text) return null;
    const { text } = this.props;

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
            { path: "/backend", label: "ALL PROJECTS" },
            {
              path: `/backend/project/${text.relationships.project.id}/texts`,
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
                active={this.activeChild()}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(text)}
                active={this.activeChild()}
              />
            </aside>
            <div className="panel">
              {React.cloneElement(this.props.children, { text })}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  TextDetailWrapperContainer.mapStateToProps
)(TextDetailWrapperContainer);

