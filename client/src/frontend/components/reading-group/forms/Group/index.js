import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collapse from "global/components/Collapse";
import Form from "global/components/form";
import config from "config";
import withConfirmation from "hoc/withConfirmation";
import { ClassNames } from "@emotion/react";
import { useSettings, useCurrentUser } from "hooks";
import * as Styled from "./styles";

const generateToken = (length = 8) => {
  const rand = () =>
    Math.random(0)
      .toString(36)
      .substr(2);
  const token = tokenLength =>
    (rand() + rand() + rand() + rand()).substr(0, tokenLength);
  return token(length).toUpperCase();
};

const urlForToken = token =>
  `${config.services.client.url}/my/groups?join=${token}`;

function ReadingGroupForm({
  mode = "new",
  group = {},
  submit,
  errors = [],
  confirm
}) {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const settings = useSettings();

  const allowPublic = !settings?.attributes?.general
    ?.disablePublicReadingGroups;
  const isNew = mode === "new";

  const [courseEnabled, setCourseEnabled] = useState(
    isNew ? false : group?.attributes?.course?.enabled
  );

  const newGroup = useMemo(
    () => ({
      attributes: {
        privacy: "private",
        invitationCode: generateToken(),
        course: {
          enabled: false
        }
      }
    }),
    []
  );

  const handleRegenerate = (event, input, notify, set) => {
    event.preventDefault();
    set(generateToken());
  };

  const handleCopy = async (event, input, notify) => {
    event.preventDefault();
    try {
      const text = input.value;
      await navigator.clipboard.writeText(text);
      notify("copied!");
    } catch (err) {
      notify("failed to copy");
    }
  };

  const warnOnPrivacyChange = (initialValue, newValue) => {
    if (isNew) return;

    const messages = t("messages.reading_group.privacy_change", {
      returnObjects: true
    });
    const msg = messages[`${initialValue}_to_${newValue}`];
    return msg ? confirm(messages.heading, msg, () => {}) : null;
  };

  const handleCourseChange = (
    initialValueIgnored,
    oldValueIgnored,
    newEvent
  ) => {
    setCourseEnabled(newEvent.target.value === "true");
  };

  const privacyOptions = useMemo(() => {
    const established = currentUser?.attributes?.established;
    const trusted = currentUser?.attributes?.trusted;

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
  }, [allowPublic, currentUser, t]);

  return (
    <Styled.Form
      model={isNew ? newGroup : group}
      submit={submit}
      errors={errors}
      className="form-secondary"
    >
      {getModelValue => {
        return (
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
              beforeOnChange={warnOnPrivacyChange}
              instructions={t("forms.reading_group.privacy_instructions")}
              options={privacyOptions}
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
                  onClick: handleRegenerate
                },
                {
                  label: t("forms.reading_group.invitation_code_buttons.copy"),
                  onClick: handleCopy
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
              value={urlForToken(getModelValue("attributes[invitationCode]"))}
              instructions={t(
                "forms.reading_group.invitation_url_instructions"
              )}
              buttons={[
                {
                  label: t("forms.reading_group.invitation_url_button_label"),
                  onClick: handleCopy
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
                  beforeOnChange={handleCourseChange}
                  inputClasses={css(`padding-block-end: 20px;`)}
                  inline
                  wide
                />
              )}
            </ClassNames>
            <Collapse initialVisible={courseEnabled}>
              <Collapse.Content>
                {/* <Styled.DatesInner>
                  <Form.DatePicker
                    label={t("forms.reading_group.course_start_date")}
                    name="attributes[course][startsOn]"
                  />
                  <Form.DatePicker
                    label={t("forms.reading_group.course_end_date")}
                    name="attributes[course][endsOn]"
                  />
                </Styled.DatesInner> */}
              </Collapse.Content>
            </Collapse>
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
        );
      }}
    </Styled.Form>
  );
}

ReadingGroupForm.displayName = "ReadingGroup.Forms.GroupSettings";

ReadingGroupForm.propTypes = {
  mode: PropTypes.oneOf(["new", "edit"]),
  group: PropTypes.object,
  submit: PropTypes.func.isRequired,
  errors: PropTypes.array,
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(ReadingGroupForm);
