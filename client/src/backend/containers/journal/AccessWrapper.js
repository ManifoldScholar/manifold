import React from "react";
import PropTypes from "prop-types";
// import { useTranslation } from "react-i18next";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import EntitlementsContainer from "backend/containers/entitlements";
import Authorize from "hoc/Authorize";
// import FormContainer from "global/containers/form";
// import Form from "global/components/form";
// import Hero from "backend/components/hero";
// import { useFromStore } from "hooks";

export default function JournalAccessWrapper({ journal, route }) {
  // const { t } = useTranslation();
  // const settings = useFromStore("settings", "select");

  // const defaultIsRestricted = settings?.attributes.general.restrictedAccess;

  const closeUrl = lh.link("backendJournalAccess", journal.id);

  return journal ? (
    <>
      <Authorize
        entity={journal}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendJournal", journal.id)}
      >
        <EntitlementsContainer.List entity={journal} />
      </Authorize>
      {childRoutes(route, {
        drawer: true,
        drawerProps: { closeUrl, lockScroll: "always" },
        childProps: {
          entity: journal,
          closeUrl
        }
      })}
    </>
  ) : null;
}

JournalAccessWrapper.displayName = "Journal.Access.Wrapper";

JournalAccessWrapper.propTypes = {
  journal: PropTypes.object,
  updateJournal: PropTypes.func,
  route: PropTypes.object
};

/* preList={
  <div>
    <Hero.Block
      title={t("backend_entities.journals.forms.access.title")}
      description={t(
        "backend_entities.journals.forms.access.description"
      )}
      initialVisible={defaultIsRestricted}
    >
      <FormContainer.Form
        style={{ paddingTop: 24, paddingBottom: 24 }}
        model={journal}
        name="backend-journal-update"
        update={updateJournal}
        className="form-secondary"
      >
        <Form.Switch
          label={
            defaultIsRestricted
              ? t(
                  "backend_entities.journals.forms.access.open_access_label"
                )
              : t(
                  "backend_entities.journals.forms.access.restricted_label"
                )
          }
          name={
            defaultIsRestricted
              ? "attributes[openAccess]"
              : "attributes[restrictedAccess]"
          }
          wide
        />
        <Form.TextInput
          label={t(
            "backend_entities.journals.forms.access.notice_header_label"
          )}
          name="attributes[restrictedAccessHeading]"
          placeholder={t(
            "backend_entities.journals.forms.access.notice_header_placeholder"
          )}
          wide
        />
        <Form.TextArea
          label={t(
            "backend_entities.journals.forms.access.notice_body_label"
          )}
          name="attributes[restrictedAccessBody]"
          placeholder={t(
            "backend_entities.journals.forms.access.notice_body_placeholder"
          )}
        />
        <Form.Save
          text={t("backend_entities.journals.forms.access.save")}
        />
      </FormContainer.Form>
    </Hero.Block>
  </div>
} */
