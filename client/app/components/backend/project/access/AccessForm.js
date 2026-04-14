import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import HeroBlock from "components/backend/hero/Builder/Block";
import { useSettings } from "hooks";

export default function AccessForm({ project }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const settings = useSettings();

  const defaultIsRestricted =
    settings?.attributes?.general?.restrictedAccess === true;
  const defaultIsOpen = !defaultIsRestricted;

  return (
    <div style={{ marginBottom: 44, marginTop: 22 }}>
      <HeroBlock
        title={t("projects.forms.access.title")}
        description={t("projects.forms.access.description")}
        initialVisible={defaultIsRestricted}
      >
        <FormContainer.Form
          fetcher={fetcher}
          style={{ paddingTop: 24, paddingBottom: 24 }}
          model={project}
          className="form-secondary"
          notifyOnSuccess
          formatData={(dirty, source) => ({
            attributes: { ...source.attributes, ...dirty.attributes }
          })}
        >
          {defaultIsOpen && (
            <Form.Switch
              label={t("projects.forms.access.restricted_label")}
              name="attributes[restrictedAccess]"
              wide
            />
          )}
          {defaultIsRestricted && (
            <Form.Switch
              label={t("projects.forms.access.open_access_label")}
              name="attributes[openAccess]"
              wide
            />
          )}
          <Form.TextInput
            label={t("projects.forms.access.notice_header_label")}
            name="attributes[restrictedAccessHeading]"
            placeholder={t("projects.forms.access.notice_header_placeholder")}
            wide
          />
          <Form.TextArea
            label={t("projects.forms.access.notice_body_label")}
            name="attributes[restrictedAccessBody]"
            placeholder={t("projects.forms.access.notice_body_placeholder")}
          />
          <Form.Save text={t("projects.forms.access.save")} />
        </FormContainer.Form>
      </HeroBlock>
    </div>
  );
}
