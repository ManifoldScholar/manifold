import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { pagesAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import authorize from "app/routes/utility/loaders/authorize";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import PageHeader from "backend/components/layout/PageHeader";
import Layout from "backend/components/layout";

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

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(pagesAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/records/pages/${result.data.id}`);
  } catch (error) {
    return handleActionError(error);
  }
}

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
