import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import TwitterQuery from "backend/components/twitter-query";
import Dialog from "backend/components/dialog";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { twitterQueriesAPI, requests } from "api";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;

export class TwitterQueryEditContainer extends PureComponent {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      settings: select(requests.settings, state.entityStore),
      twitterQuery: select(requests.beTwitterQuery, state.entityStore)
    };
  };

  static displayName = "TwitterQuery.Edit";

  static propTypes = {
    twitterQuery: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  componentDidMount() {
    this.fetchTwitterQuery(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchTwitterQuery(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beTwitterQuery]));
  }

  get twitterEnabled() {
    const { settings } = this.props;
    if (!settings) return false;

    const {
      twitterAppId,
      twitterAccessToken
    } = settings.attributes.integrations;
    return twitterAppId && twitterAccessToken;
  }

  fetchTwitterQuery(id) {
    const call = twitterQueriesAPI.show(id);
    const queryRequest = request(call, requests.beTwitterQuery);
    this.props.dispatch(queryRequest);
  }

  handleQueryDestroy = () => {
    const heading = "Are you sure you want to delete this twitter query?";
    const message = (
      <div>
        <p>
          This action will delete the query along with all events associated
          with it.
        </p>
        <p>This action cannot be undone.</p>
        <p>
          Set the query to inactive to prevent fetching while preserving
          existing tweet events.
        </p>
      </div>
    );
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.destroyQuery();
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  };

  destroyQuery() {
    const { twitterQuery } = this.props;
    const call = twitterQueriesAPI.destroy(twitterQuery.id);
    const options = { removes: twitterQuery };
    const queryRequest = request(call, requests.beTwitterQueryDestroy, options);
    this.props.dispatch(queryRequest).promise.then(() => {
      this.redirectToProjectSocial(this.props.match.params.pId);
    });
  }

  handleQueryFetch = () => {
    const call = twitterQueriesAPI.fetch(this.props.twitterQuery.id);
    const queryRequest = request(call, requests.beTwitterQueryFetch);
    this.props.dispatch(queryRequest).promise.then(() => {
      this.redirectToProjectSocial(this.props.match.params.pId);
    });
  };

  redirectToProjectSocial(pId) {
    return this.props.history.push(lh.link("backendProjectSocial", pId));
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  renderFetchButton() {
    if (!this.twitterEnabled) return null;

    return (
      <React.Fragment>
        <button className="button-bare-primary" onClick={this.handleQueryFetch}>
          {"Fetch Tweets"}
          <i className="manicon manicon-check" aria-hidden="true" />
        </button>
        <br />
      </React.Fragment>
    );
  }

  render() {
    if (!this.props.twitterQuery) return null;
    const { twitterQuery } = this.props;
    const projectId = this.props.match.params.pId;

    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        <header className="drawer-header">
          <h2 className="heading-quaternary">
            <i className="manicon manicon-twitter" aria-hidden="true" />
            <span>{twitterQuery.attributes.displayName}</span>
          </h2>
          <div className="buttons-bare-vertical">
            {this.renderFetchButton()}
            <button
              className="button-bare-primary"
              onClick={this.handleQueryDestroy}
            >
              {"Delete Query"}
              <i className="manicon manicon-trashcan" aria-hidden="true" />
            </button>
          </div>
        </header>
        <section className="form-section">
          <TwitterQuery.Form
            name={requests.beTwitterQueryUpdate}
            twitterQuery={twitterQuery}
            projectId={projectId}
            notificationScope="drawer"
          />
        </section>
      </div>
    );
  }
}

export default connectAndFetch(TwitterQueryEditContainer);
