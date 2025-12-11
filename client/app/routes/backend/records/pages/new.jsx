import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { pagesAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import authorize from "lib/react-router/loaders/authorize";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import PageHeader from "components/backend/layout/PageHeader";
import Layout from "components/backend/layout";

const DEFAULT_PAGE = {
  attributes: { isExternalLink: false, kind: "default" }
};

export const loader = ({ request, context }) => {
  return authorize({
    request,
    context,
    ability: "create",
    entity: "page"
  });
};

export const action = formAction({
  mutation: ({ data }) => pagesAPI.create(data),
  redirectTo: ({ result }) => `/backend/records/pages/${result.data.id}`
});

export default function PagesNewRoute() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <>
      <PageHeader
        type="page"
        backUrl="/backend/records/pages"
        backLabel={t("records.pages.back_label")}
        title={t("records.pages.new_header")}
        note={t("records.pages.new_instructions")}
        icon="ResourceDocument64"
      />
      <Layout.BackendPanel>
        <section>
          <FormContainer.Form
            fetcher={fetcher}
            model={DEFAULT_PAGE}
            className="form-secondary"
          >
            {getModelValue => {
              const isExternal = getModelValue("attributes[isExternalLink]");

              return (
                <>
                  <Form.TextInput
                    focusOnMount
                    label={t("records.pages.title_label")}
                    name="attributes[title]"
                    placeholder={t("records.pages.title_placeholder")}
                  />
                  <Form.Switch
                    label={t("records.pages.switch_label")}
                    name="attributes[isExternalLink]"
                  />
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
                      validation={["required"]}
                      label={t("records.pages.slug_label")}
                      name="attributes[slug]"
                      placeholder={t("records.pages.slug_placeholder")}
                      instructions={t("records.pages.slug_instructions")}
                    />
                  )}
                  <Form.Save text={t("records.pages.submit_label")} />
                </>
              );
            }}
          </FormContainer.Form>
        </section>
      </Layout.BackendPanel>
    </>
  );
}
