import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { readingGroupsAPI, requests } from "api";
import config from "config";
import memoize from "lodash/memoize";

export default class ReadingGroupForm extends React.PureComponent {
  static propTypes = {
    mode: PropTypes.oneOf(["new", "edit"]),
    group: PropTypes.object,
    onSuccess: PropTypes.func.isRequired
  };

  static defaultProps = {
    group: {}
  };

  constructor(props) {
    super(props);
    const token = this.token();
    this.state = {
      invitationCode: token,
      invitationUrl: `${config.services.client.url}/my/groups?join=${token}`
    };
  }

  get isNew() {
    const { mode } = this.props;
    return mode === "new";
  }

  handleRegenerate = (event, input, notify, set) => {
    event.preventDefault();
    set(this.token());
  };

  newGroup() {
    return {
      attributes: {
        privacy: "private",
        invitationCode: this.state.invitationCode
      }
    };
  }

  memoizedNewGroup = memoize(this.newGroup);

  urlForToken(token) {
    return `${config.services.client.url}/my/groups?join=${token}`;
  }

  token(length = 8) {
    const rand = () =>
      Math.random(0)
        .toString(36)
        .substr(2);
    const token = tokenLength =>
      (rand() + rand() + rand() + rand()).substr(0, tokenLength);
    return token(length).toUpperCase();
  }

  /* eslint-disable no-param-reassign */
  handleCopy = (event, input, notify) => {
    const disabled = input.disabled;
    event.preventDefault();
    if (disabled) {
      input.disabled = false;
    }
    input.select();
    document.execCommand("copy");
    input.setSelectionRange(0, 0);
    if (disabled) {
      input.disabled = true;
    }
    notify("copied!");
  };
  /* eslint-enable no-param-reassign */

  render() {
    const { group, onSuccess } = this.props;
    return (
      <FormContainer.Form
        model={this.isNew ? this.memoizedNewGroup() : group}
        name={requests.feNewReadingGroup}
        update={readingGroupsAPI.update}
        create={readingGroupsAPI.create}
        options={{ adds: requests.feMyReadingGroups }}
        onSuccess={onSuccess}
        className="form-secondary permissions-form"
        notificationScope="drawer"
      >
        {getModelValue => (
          <React.Fragment>
            <Form.TextInput
              wide
              label="Group Name"
              name="attributes[name]"
              placeholder="Pick a group name"
              focusOnMount
            />
            <Form.Radios
              label="Privacy"
              prompt="Set privacy for all annotations from this group."
              name="attributes[privacy]"
              defaultValue={"private"}
              instructions={`Annotations in public groups can be viewed by everyone.
              Annotations in private groups can only be viewed by group members. In
              anonymous groups, only the group creator can see the identity of each
              annotation's author.`}
              options={[
                { label: "Public", value: "public" },
                { label: "Private", value: "private" },
                { label: "Anonymous", value: "anonymous" }
              ]}
              inline
              wide
            />
            <Form.FieldGroup
              label="Invitations"
              labelTag="span"
              instructions="Create and copy invitation codes and URLs to invite new members"
              theme="secondary"
            >
              <Form.TextInput
                wide
                label="Invitation Code"
                name="attributes[invitationCode]"
                buttons={[
                  {
                    label: "regenerate",
                    onClick: this.handleRegenerate
                  },
                  {
                    label: "copy",
                    onClick: this.handleCopy
                  }
                ]}
              />
              <Form.TextInput
                wide
                isDisabled
                label="Invitation URL"
                value={this.urlForToken(
                  getModelValue("attributes[invitationCode]")
                )}
                name="attributes[invitationUrl]"
                instructions="Share the invitation URL with users so they can join the group. Share the invitation URL with users so they can join the group."
                buttons={[
                  {
                    label: "copy",
                    onClick: this.handleCopy
                  }
                ]}
              />
            </Form.FieldGroup>
            <Form.Switch
              wide
              label="Notifications"
              name="attributes[notifyOnJoin]"
              instructions="Email me when anyone joins this group"
              theme="checkbox"
            />
            <Form.Save text="Save" />
          </React.Fragment>
        )}
      </FormContainer.Form>
    );
  }
}
