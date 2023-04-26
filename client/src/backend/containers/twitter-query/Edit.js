import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import TwitterQuery from "backend/components/twitter-query";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { twitterQueriesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";

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
    dispatch: PropTypes.func,
    settings: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
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
    const heading = this.props.t("modals.delete_twitter");
    const message = (
      <div>
        <Trans i18nKey="modals.delete_twitter_body" />
      </div>
    );
    this.props.confirm(heading, message, this.destroyQuery);
  };

  destroyQuery = () => {
    const { twitterQuery } = this.props;
    const call = twitterQueriesAPI.destroy(twitterQuery.id);
    const options = { removes: twitterQuery };
    const queryRequest = request(call, requests.beTwitterQueryDestroy, options);
    this.props.dispatch(queryRequest).promise.then(() => {
      this.redirectToProjectSocial(this.props.match.params.pId);
    });
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

  render() {
    if (!this.props.twitterQuery) return null;
    const { twitterQuery, t } = this.props;
    const projectId = this.props.match.params.pId;

    const buttons = [
      {
        onClick: this.handleQueryDestroy,
        icon: "delete32",
        label: t("actions.delete"),
        className: "utility-button__icon--notice"
      }
    ];
    if (this.twitterEnabled)
      buttons.push({
        onClick: this.handleQueryFetch,
        icon: "reload32",
        label: t("projects.social.fetch_label"),
        className: "utility-button__icon--highlight"
      });

    return (
      <section>
        <Layout.DrawerHeader
          title={twitterQuery.attributes.displayName}
          icon="activityTweet64"
          buttons={buttons}
        />
        <TwitterQuery.Form
          name={requests.beTwitterQueryUpdate}
          twitterQuery={twitterQuery}
          projectId={projectId}
          notificationScope="drawer"
        />
      </section>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(TwitterQueryEditContainer))
);
