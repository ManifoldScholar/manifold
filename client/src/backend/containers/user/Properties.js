import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";
import { usersAPI } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import * as Styled from "./styles";

export default function UserProperties({ saveLabel }) {
  const outletContext = useOutletContext() || {};
  const { user } = outletContext;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { attributes } = user ?? {};

  const humanReadableDate = date => {
    return t("dates.date", {
      val: new Date(date),
      formatParams: {
        val: { year: "numeric", month: "long", day: "numeric" }
      }
    });
  };

  const noPublicEngagement = !(attributes?.trusted || attributes?.established);

  const userVerificationList = () => {
    const emailMessage = attributes?.emailConfirmed
      ? t("records.users.email_verified_at", {
          date: humanReadableDate(attributes?.emailConfirmedAt)
        })
      : t("records.users.email_not_verified");

    return (
      <>
        {/* eslint-disable no-nested-ternary */}
        {attributes?.trusted ? (
          <li>
            <span>{t("records.users.trusted")}</span>
          </li>
        ) : attributes?.adminVerified ? (
          <li>
            <span>{t("records.users.admin_verified")}</span>
          </li>
        ) : null}
        <li>
          <span>{emailMessage}</span>
        </li>
        {noPublicEngagement && (
          <li>
            <span>{t("records.users.no_public_engagement")}</span>
          </li>
        )}
      </>
    );
  };

  const redirectToUser = result => {
    const path = lh.link("backendRecordsUser", result.id);
    navigate(path, { keepNotifications: true });
  };

  const createUser = formValue => {
    const meta = { createdByAdmin: true };
    return usersAPI.create({ ...formValue, meta });
  };

  return (
    <div>
      <section>
        <Form.FieldGroup label={t("records.features.properties_label")}>
          {!!user && (
            <Styled.UserVerification $warn={noPublicEngagement}>
              {userVerificationList()}
            </Styled.UserVerification>
          )}
          <FormContainer.Form
            model={user ?? { attributes: { role: "reader" } }}
            update={usersAPI.update}
            create={createUser}
            onSuccess={!user ? redirectToUser : undefined}
            className="form-secondary"
            notificationScope="drawer"
            name="be-user"
          >
            <Form.TextInput
              focusOnMount
              label={t("records.users.email")}
              name="attributes[email]"
              placeholder={t("records.users.email")}
            />
            <Form.TextInput
              label={t("records.users.first_name")}
              name="attributes[firstName]"
              placeholder={t("records.users.first_name")}
            />
            <Form.TextInput
              label={t("records.users.last_name")}
              name="attributes[lastName]"
              placeholder={t("records.users.last_name")}
            />
            <Form.Select
              label={t("records.users.role_label")}
              name="attributes[role]"
              selected={attributes?.role}
              options={[
                {
                  label: t("records.users.role_options.admin"),
                  value: "admin"
                },
                {
                  label: t("records.users.role_options.editor"),
                  value: "editor"
                },
                {
                  label: t("records.users.role_options.creator"),
                  value: "project_creator"
                },
                {
                  label: t("records.users.role_options.marketeer"),
                  value: "marketeer"
                },
                {
                  label: t("records.users.role_options.reader"),
                  value: "reader"
                }
              ]}
            />
            {!user && (
              <Form.GeneratedPasswordInput name="attributes[password]" />
            )}
            <Form.Save text={saveLabel ?? t("records.users.submit_label")} />
          </FormContainer.Form>
        </Form.FieldGroup>
      </section>
    </div>
  );
}
