import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import TwitterQuery from "backend/components/twitter-query";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { twitterQueriesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import withConfirmation from "hoc/with-confirmation";

const { request, flush } = entityStoreActions;

export class TwitterQueryEditContainer extends PureComponent {
  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  static displayName = "TwitterQuery.Edit";

  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      settings: select(requests.settings, state.entityStore),
      twitterQuery: select(requests.beTwitterQuery, state.entityStore)
    };
  };

  static propTypes = {
    twitterQuery: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    settings: PropTypes.object,
    confirm: PropTypes.func.isRequired
  };

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

  destroyQuery = () => {
    const { twitterQuery } = this.props;
    const call = twitterQueriesAPI.destroy(twitterQuery.id);
    const options = { removes: twitterQuery };
    const queryRequest = request(call, requests.beTwitterQueryDestroy, options);
    this.props.dispatch(queryRequest).promise.then(() => {
      this.redirectToProjectSocial(this.props.match.params.pId);
    });
  };

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
    this.props.confirm(heading, message, this.destroyQuery);
  };

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

  get twitterEnabled() {
    const { settings } = this.props;
    if (!settings) return false;

    const {
      twitterAppId,
      twitterAccessToken
    } = settings.attributes.integrations;
    return twitterAppId && twitterAccessToken;
  }

  render() {
    if (!this.props.twitterQuery) return null;
    const { twitterQuery } = this.props;
    const projectId = this.props.match.params.pId;

    const buttons = [
      {
        onClick: this.handleQueryDestroy,
        icon: "delete32",
        label: "Delete",
        iconClass: "notice"
      }
    ];
    if (this.twitterEnabled)
      buttons.push({
        onClick: this.handleQueryFetch,
        icon: "reload32",
        label: "Fetch Tweets",
        iconClass: "highlight"
      });

    return (
      <div>
        <Navigation.DrawerHeader
          title={twitterQuery.attributes.displayName}
          icon="activityTweet64"
          buttons={buttons}
        />
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

export default withConfirmation(connectAndFetch(TwitterQueryEditContainer));
