import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { UnmountClosed as Collapse } from "react-collapse";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { readingGroupsAPI, requests } from "api";
import config from "config";
import memoize from "lodash/memoize";
import withConfirmation from "hoc/withConfirmation";

class ReadingGroupForm extends React.PureComponent {
  static displayName = "ReadingGroup.Forms.GroupSettings";

  static propTypes = {
    mode: PropTypes.oneOf(["new", "edit"]),
    group: PropTypes.object,
    onSuccess: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    group: {}
  };

  constructor(props) {
    super(props);
    const token = this.token();
    this.state = {
      invitationCode: token,
      invitationUrl: `${config.services.client.url}/my/groups?join=${token}`,
      courseEnabled: this.isCourseEnabled
    };
  }

  get isCourseEnabled() {
    if (this.isNew) return false;
    return this.props.group.attributes.course.enabled;
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
        invitationCode: this.state.invitationCode,
        course: {
          enabled: false
        }
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

  warnOnPrivacyChange = (initialValue, newValue) => {
    if (this.isNew) return;

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

  handleCourseChange = (initialValueIgnored, oldValueIgnored, newEvent) => {
    this.setState({ courseEnabled: newEvent.target.value === "true" });
  };

  render() {
    const { group, onSuccess, t } = this.props;
    return (
      <FormContainer.Form
        model={this.isNew ? this.memoizedNewGroup() : group}
        name={requests.feNewReadingGroup}
        update={readingGroupsAPI.update}
        create={readingGroupsAPI.create}
        options={{ adds: requests.feMyReadingGroups }}
        onSuccess={onSuccess}
        className="form-secondary group-settings-form"
        notificationScope="drawer"
      >
        {getModelValue => (
          <>
            <Form.TextInput
              wide
              label={t("forms.reading_group.name")}
              name="attributes[name]"
              placeholder={t("forms.reading_group.name_placeholder")}
              focusOnMount
            />
            <Form.Radios
              label={t("forms.reading_group.privacy")}
              name="attributes[privacy]"
              defaultValue={"private"}
              beforeOnChange={this.warnOnPrivacyChange}
              instructions={t("forms.reading_group.privacy_instructions")}
              options={[
                {
                  label: t("forms.reading_group.privacy_options.public"),
                  value: "public"
                },
                {
                  label: t("forms.reading_group.privacy_options.private"),
                  value: "private"
                },
                {
                  label: t("forms.reading_group.privacy_options.anonymous"),
                  value: "anonymous"
                }
              ]}
              inline
              wide
            />
            <Form.TextInput
              wide
              label={t("forms.reading_group.invitation_code")}
              name="attributes[invitationCode]"
              buttons={[
                {
                  label: t(
                    "forms.reading_group.invitation_code_buttons.regenerate"
                  ),
                  onClick: this.handleRegenerate
                },
                {
                  label: t("forms.reading_group.invitation_code_buttons.copy"),
                  onClick: this.handleCopy
                }
              ]}
              instructions={t(
                "forms.reading_group.invitation_code_instructions"
              )}
            />
            <Form.TextInput
              wide
              isDisabled
              label={t("forms.reading_group.invitation_url")}
              value={this.urlForToken(
                getModelValue("attributes[invitationCode]")
              )}
              instructions={t(
                "forms.reading_group.invitation_url_instructions"
              )}
              buttons={[
                {
                  label: t("forms.reading_group.invitation_url_button_label"),
                  onClick: this.handleCopy
                }
              ]}
            />
            <Form.Radios
              label={t("forms.reading_group.course")}
              name="attributes[course][enabled]"
              defaultValue={false}
              instructions={t("forms.reading_group.course_instructions")}
              options={[
                {
                  label: t("forms.reading_group.course_options.yes"),
                  value: true
                },
                {
                  label: t("forms.reading_group.course_options.no"),
                  value: false
                }
              ]}
              beforeOnChange={this.handleCourseChange}
              inputClasses="group-settings-form__course-radios"
              inline
              wide
            />
            <div className="group-settings-form__date-picker-section">
              <Collapse isOpened={this.state.courseEnabled}>
                <div className="group-settings-form__date-picker-group">
                  <Form.DatePicker
                    label={t("forms.reading_group.course_start_date")}
                    name="attributes[course][startsOn]"
                  />
                  <Form.DatePicker
                    label={t("forms.reading_group.course_end_date")}
                    name="attributes[course][endsOn]"
                  />
                </div>
              </Collapse>
            </div>
            <Form.Switch
              wide
              label={t("forms.reading_group.notifications")}
              name="attributes[notifyOnJoin]"
              instructions={t("forms.reading_group.notifications_instructions")}
              theme="checkbox"
            />
            <Form.Save text={t("actions.save")} theme="frontend" />
          </>
        )}
      </FormContainer.Form>
    );
  }
}

export default withConfirmation(withTranslation()(ReadingGroupForm));
