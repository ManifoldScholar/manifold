import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { readingGroupsAPI, requests } from "api";
import config from "config";
import memoize from "lodash/memoize";
import withConfirmation from "hoc/with-confirmation";

class ReadingGroupForm extends React.PureComponent {
  static displayName = "ReadingGroup.Form.Settings";

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

  warnOnPrivacyChange = (initialValue, oldValueIgnored, newValue) => {
    let msg = null;
    const {
      heading,
      privateToPublic,
      anonymousToPublic,
      anonymousToPrivate
    } = config.app.locale.dialogs.readingGroup.warn.privacyChange;
    if (initialValue === "private" && newValue === "public")
      msg = privateToPublic;
    if (initialValue === "anonymous" && newValue === "public")
      msg = anonymousToPublic;
    if (initialValue === "anonymous" && newValue === "private")
      msg = anonymousToPrivate;
    if (msg !== null) return this.props.confirm(heading, msg, () => {});
  };

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
          <>
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
              beforeOnChange={this.warnOnPrivacyChange}
              instructions={`Annotations in public groups can be viewed by everyone.
              Annotations in private groups can only be viewed by group members. In
              anonymous groups, comments are private and only the group creator can see
              the identity of each annotation's author.`}
              options={[
                { label: "Public", value: "public" },
                { label: "Private", value: "private" },
                { label: "Anonymous", value: "anonymous" }
              ]}
              inline
              wide
            />
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
              instructions={`Users can enter the invitation code on the "Manage Reading Groups" page to join this group. You may change this code at any time, but previous codes will no longer work.`}
            />
            <Form.TextInput
              wide
              isDisabled
              label="Invitation URL"
              value={this.urlForToken(
                getModelValue("attributes[invitationCode]")
              )}
              instructions="The URL above is based on the invitation code. Readers can also join the group by visiting this URL."
              buttons={[
                {
                  label: "copy",
                  onClick: this.handleCopy
                }
              ]}
            />
            <Form.Switch
              wide
              label="Notifications"
              name="attributes[notifyOnJoin]"
              instructions="Email me when anyone joins this group"
              theme="checkbox"
            />
            <Form.Save text="Save" theme="frontend" />
          </>
        )}
      </FormContainer.Form>
    );
  }
}

export default withConfirmation(ReadingGroupForm);
