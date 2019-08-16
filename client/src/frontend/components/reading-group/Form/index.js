import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { readingGroupsAPI, requests } from "../../../../api";

export default class ReadingGroupForm extends React.PureComponent {
  static propTypes = {
    mode: PropTypes.oneOf(["new", "edit"]),
    group: PropTypes.object,
    onSuccess: PropTypes.func.isRequired
  };

  static defaultProps = {
    group: {}
  };

  render() {
    const { group, mode, onSuccess } = this.props;

    return (
      <FormContainer.Form
        model={group}
        name={requests.feNewReadingGroup}
        update={readingGroupsAPI.update}
        create={readingGroupsAPI.create}
        options={{ adds: requests.feMyReadingGroups }}
        onSuccess={onSuccess}
        className="form-secondary permissions-form"
        notificationScope="drawer"
      >
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
          instructions={`Annotations in public groups can be viewed by everyone. Annotations in
              private groups can only be viewed by group members. Annotations in anonymous
              groups are anonymous to everyone except the group creator.`}
          options={[
            { label: "Public", value: "public" },
            { label: "Private", value: "private" },
            { label: "Anonymous", value: "anonymous" }
          ]}
          inline
          wide
        />
        {mode === "edit" && (
          <Form.FieldGroup
            label="Invitations"
            labelTag="span"
            instructions="Create and copy invitation codes and URLs to invite new members"
            theme="secondary"
          >
            <Form.TextInput
              wide
              label="Invitation Code"
              name="attributes[code]"
              buttons={[
                {
                  label: "regenerate",
                  onClick: () => {
                    /* eslint-disable no-console */
                    console.log("regenerate");
                    /* eslint-enable no-console */
                  }
                },
                {
                  label: "copy",
                  onClick: () => {
                    /* eslint-disable no-console */
                    console.log("copied");
                    /* eslint-enable no-console */
                  }
                }
              ]}
            />
            <Form.TextInput
              wide
              label="Invitation URL"
              name="attributes[url]"
              buttons={[
                {
                  label: "copy",
                  onClick: () => {
                    /* eslint-disable no-console */
                    console.log("copied");
                    /* eslint-enable no-console */
                  }
                }
              ]}
            />
          </Form.FieldGroup>
        )}
        <Form.Switch
          wide
          label="Notifications"
          name="attributes[notifyOnJoin]"
          instructions="Email me when anyone joins this group"
          theme="checkbox"
        />
        <Form.Save text="Save" />
      </FormContainer.Form>
    );
  }
}
