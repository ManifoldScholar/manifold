import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { UnmountClosed as Collapse } from "react-collapse";
import Form from "global/components/form";
import { readingGroupsAPI, requests } from "api";
import config from "config";
import memoize from "lodash/memoize";
import withConfirmation from "hoc/withConfirmation";
import withCurrentUser from "hoc/withCurrentUser";
import { ClassNames } from "@emotion/react";
import { connect } from "react-redux";
import { select } from "utils/entityUtils";
import * as Styled from "./styles";

class ReadingGroupForm extends React.PureComponent {
  static displayName = "ReadingGroup.Forms.GroupSettings";

  static mapStateToProps = state => {
    return {
      allowPublic: !select(requests.settings, state.entityStore).attributes
        .general.disablePublicReadingGroups
    };
  };

  static propTypes = {
    mode: PropTypes.oneOf(["new", "edit"]),
    group: PropTypes.object,
    onSuccess: PropTypes.func.isRequired,
    t: PropTypes.func,
    allowPublic: PropTypes.bool.isRequired
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

    const messages = this.props.t("messages.reading_group.privacy_change", {
      returnObjects: true
    });
    const msg = messages[`${initialValue}_to_${newValue}`];
    return msg ? this.props.confirm(messages.heading, msg, () => {}) : null;
  };

  handleCourseChange = (initialValueIgnored, oldValueIgnored, newEvent) => {
    this.setState({ courseEnabled: newEvent.target.value === "true" });
  };

  get privacyOptions() {
    const { t, allowPublic, currentUser } = this.props;

    const established = currentUser?.attributes.established;
    const trusted = currentUser?.attributes.trusted;

    const publicOption =
      allowPublic && (established || trusted)
        ? [
            {
              label: t("forms.reading_group.privacy_options.public"),
              value: "public"
            }
          ]
        : [];

    return [
      ...publicOption,
      {
        label: t("forms.reading_group.privacy_options.private"),
        value: "private"
      },
      {
        label: t("forms.reading_group.privacy_options.anonymous"),
        value: "anonymous"
      }
    ];
  }

  render() {
    const { group, onSuccess, t } = this.props;

    return (
      <Styled.Form
        model={this.isNew ? this.memoizedNewGroup() : group}
        name={requests.feNewReadingGroup}
        update={readingGroupsAPI.update}
        create={readingGroupsAPI.create}
        options={{ adds: requests.feMyReadingGroups }}
        onSuccess={onSuccess}
        className="form-secondary"
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
              options={this.privacyOptions}
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
            <ClassNames>
              {({ css }) => (
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
                  inputClasses={css(`padding-block-end: 20px;`)}
                  inline
                  wide
                />
              )}
            </ClassNames>
            <Styled.DatesOuter>
              <Collapse isOpened={this.state.courseEnabled}>
                <Styled.DatesInner>
                  <Form.DatePicker
                    label={t("forms.reading_group.course_start_date")}
                    name="attributes[course][startsOn]"
                  />
                  <Form.DatePicker
                    label={t("forms.reading_group.course_end_date")}
                    name="attributes[course][endsOn]"
                  />
                </Styled.DatesInner>
              </Collapse>
            </Styled.DatesOuter>
            <Form.Switch
              wide
              isPrimary
              label={t("forms.reading_group.notifications")}
              name="attributes[notifyOnJoin]"
              instructions={t("forms.reading_group.notifications_instructions")}
              theme="checkbox"
            />
            <Form.Save text={t("actions.save")} theme="frontend" />
          </>
        )}
      </Styled.Form>
    );
  }
}

export default withCurrentUser(
  withConfirmation(
    withTranslation()(
      connect(ReadingGroupForm.mapStateToProps)(ReadingGroupForm)
    )
  )
);
