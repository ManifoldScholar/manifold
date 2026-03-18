import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { pagesAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Form from "global/components/form";
import FormContainer from "global/containers/form";

export const action = formAction({
  mutation: ({ data, params }) => pagesAPI.update(params.id, data)
});

export default function PagePropertiesRoute() {
  const { t } = useTranslation();
  const { page } = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <FormContainer.Form
        fetcher={fetcher}
        model={page}
        className="form-secondary"
      >
        {getModelValue => {
          const isExternal = getModelValue("attributes[isExternalLink]");
          const purpose = getModelValue("attributes[purpose]");

          return (
            <>
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
                {purpose !== "terms_and_conditions" && (
                  <Form.Switch
                    wide
                    label={t("records.pages.new_tab_label")}
                    name="attributes[openInNewTab]"
                  />
                )}
                {isExternal ? (
                  <Form.TextInput
                    validation={["required"]}
                    label={t("records.pages.external_label")}
                    name="attributes[externalLink]"
                    placeholder={t("records.pages.external_placeholder")}
                    instructions={t("records.pages.external_instructions")}
                  />
                ) : (
                  <Form.TextInput
                    wide
                    validation={["required"]}
                    label={t("records.pages.slug_label")}
                    name="attributes[pendingSlug]"
                    placeholder={t("records.pages.slug_placeholder")}
                    instructions={t("records.pages.slug_instructions")}
                  />
                )}
                {!isExternal && (
                  <Form.TextArea
                    wide
                    label={t("records.pages.body_label")}
                    height={300}
                    name="attributes[body]"
                    placeholder={t("records.pages.body_placeholder")}
                    instructions={t("records.pages.body_instructions")}
                  />
                )}
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
            </>
          );
        }}
      </FormContainer.Form>
    </section>
  );
}
