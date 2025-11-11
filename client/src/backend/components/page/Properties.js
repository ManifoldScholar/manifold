import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { pagesAPI } from "api";
import withFormSession from "hoc/withFormSession";

function PagesProperties({ onSuccess, form }) {
  const { t } = useTranslation();
  const outletContext = useOutletContext() || {};
  const { page } = outletContext;

  const renderPath = () => {
    const isExternal = form.getModelValue("attributes[isExternalLink]");
    if (isExternal)
      return (
        <Form.TextInput
          validation={["required"]}
          label={t("records.pages.external_label")}
          name="attributes[externalLink]"
          placeholder={t("records.pages.external_placeholder")}
          instructions={t("records.pages.external_instructions")}
        />
      );
    return (
      <Form.TextInput
        wide
        validation={["required"]}
        label={t("records.pages.slug_label")}
        name="attributes[pendingSlug]"
        placeholder={t("records.pages.slug_placeholder")}
        instructions={t("records.pages.slug_instructions")}
      />
    );
  };

  const renderBody = () => {
    const isExternal = form.getModelValue("attributes[isExternalLink]");
    if (isExternal) return null;
    return (
      <Form.TextArea
        wide
        label={t("records.pages.body_label")}
        height={300}
        name="attributes[body]"
        placeholder={t("records.pages.body_placeholder")}
        instructions={t("records.pages.body_instructions")}
      />
    );
  };

  const renderNewTab = () => {
    const purpose = form.getModelValue("attributes[purpose]");
    if (purpose === "terms_and_conditions") return null;

    return (
      <Form.Switch
        wide
        label={t("records.pages.new_tab_label")}
        name="attributes[openInNewTab]"
      />
    );
  };

  if (!page) return null;

  return (
    <section>
      <FormContainer.Form
        model={page}
        onSuccess={onSuccess}
        name="backend-page-update"
        update={pagesAPI.update}
        create={pagesAPI.create}
        className="form-secondary"
      >
        <Form.FieldGroup label={t("records.pages.properties_label")}>
          <Form.TextInput
            wide
            validation={["required"]}
            focusOnMount
            label={t("records.pages.title_label")}
            name="attributes[title]"
            placeholder={t("records.pages.title_placeholder")}
          />
          <Form.TextInput
            wide
            label={t("records.pages.navigation_label")}
            name="attributes[navTitle]"
            placeholder={t("records.pages.navigation_placeholder")}
            instructions={t("records.pages.navigation_instructions")}
          />
          <Form.Select
            label={t("records.pages.purpose_label")}
            name="attributes[purpose]"
            options={[
              {
                label: t("records.pages.purpose_options.supplemental"),
                value: "supplemental_content"
              },
              {
                label: t("records.pages.purpose_options.privacy_policy"),
                value: "privacy_policy"
              },
              {
                label: t("records.pages.purpose_options.terms"),
                value: "terms_and_conditions"
              }
            ]}
          />
          <Form.Switch
            wide
            label={t("records.pages.switch_label")}
            name="attributes[isExternalLink]"
          />
          {renderNewTab()}
          {renderPath()}
          {renderBody()}
        </Form.FieldGroup>
        <Form.FieldGroup
          label={t("records.pages.states_label")}
          instructions={t("records.pages.states_instructions")}
        >
          <Form.Switch
            className="fourth"
            label={t("records.pages.states_options.hide")}
            labelPos="below"
            name="attributes[hidden]"
            isPrimary
          />
          <Form.Switch
            className="fourth"
            label={t("records.pages.states_options.footer")}
            labelPos="below"
            name="attributes[showInFooter]"
            isPrimary
          />
          <Form.Switch
            className="fourth"
            label={t("records.pages.states_options.header")}
            labelPos="below"
            name="attributes[showInHeader]"
            isPrimary
          />
        </Form.FieldGroup>
        <Form.Save text={t("records.pages.submit_label")} />
      </FormContainer.Form>
    </section>
  );
}

PagesProperties.displayName = "Pages.Properties";

export default withFormSession(PagesProperties, "backend-page-update");
