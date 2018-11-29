import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { twitterQueriesAPI, requests } from "api";
import { Form as FormContainer } from "containers/backend";
import { Form } from "components/backend";

export default class TwitterQueryForm extends PureComponent {
  static displayName = "TwitterQuery.Form";

  static propTypes = {
    projectId: PropTypes.string,
    twitterQuery: PropTypes.object,
    successHandler: PropTypes.func,
    notificationScope: PropTypes.string,
    name: PropTypes.string.isRequired
  };

  static defaultProps = {
    notificationScope: "drawer"
  };

  handleSuccess = () => {
    if (!this.props.successHandler) return null;
    return this.props.successHandler();
  };

  render() {
    const pId = this.props.projectId;
    const twitterHelpUrl =
      "https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators";
    const instructions = (
      <p className="instructions">
        Learn more about Twitter{" "}
        <a target="_blank" rel="noopener noreferrer" href={twitterHelpUrl}>
          search operators
        </a>.
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
          label="Query"
          name="attributes[query]"
          placeholder="Enter query"
          instructions={instructions}
        />
        <Form.Select
          name="attributes[resultType]"
          label="Fetch tweets by:"
          options={[
            { label: "Most Recent", value: "most_recent" },
            { label: "Most Popular", value: "popular" }
          ]}
        />
        <Form.Switch label="Active" name="attributes[active]" />
        <Form.Save text="Save Twitter Query" />
      </FormContainer.Form>
    );
  }
}
