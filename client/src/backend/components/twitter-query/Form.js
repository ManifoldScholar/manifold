import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { twitterQueriesAPI, requests } from "api";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { withTranslation, Trans } from "react-i18next";

class TwitterQueryForm extends PureComponent {
  static displayName = "TwitterQuery.Form";

  static propTypes = {
    projectId: PropTypes.string,
    twitterQuery: PropTypes.object,
    successHandler: PropTypes.func,
    notificationScope: PropTypes.string,
    name: PropTypes.string.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    notificationScope: "drawer"
  };

  handleSuccess = () => {
    if (!this.props.successHandler) return null;
    return this.props.successHandler();
  };

  render() {
    const t = this.props.t;
    const pId = this.props.projectId;
    const twitterHelpUrl =
      "https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators";
    const instructions = (
      <p className="instructions">
        <Trans
          i18nKey="projects.social.twitter_learn_more"
          components={[
            <a target="_blank" rel="noopener noreferrer" href={twitterHelpUrl}>
              #
            </a>
          ]}
        />
      </p>
    );

    return (
      <FormContainer.Form
        model={this.props.twitterQuery}
        name={this.props.name}
        update={twitterQueriesAPI.update}
        create={model => twitterQueriesAPI.create(pId, model)}
        options={{ adds: requests.beTwitterQueries }}
        onSuccess={this.handleSuccess}
        className="form-secondary"
        notificationScope={this.props.notificationScope}
      >
        <Form.TextInput
          validation={["required"]}
          focusOnMount
          label={t("projects.social.query")}
          name="attributes[query]"
          placeholder={t("projects.social.query_placeholder")}
          instructions={instructions}
        />
        <Form.Select
          name="attributes[resultType]"
          label={t("projects.social.fetch_tweets_by")}
          options={[
            { label: t("projects.social.most_recent"), value: "most_recent" },
            { label: t("projects.social.most_popular"), value: "popular" }
          ]}
        />
        <Form.Switch
          label={t("common.active")}
          name="attributes[active]"
          isPrimary
        />
        <Form.Save text={t("projects.social.save_query")} />
      </FormContainer.Form>
    );
  }
}

export default withTranslation()(TwitterQueryForm);
