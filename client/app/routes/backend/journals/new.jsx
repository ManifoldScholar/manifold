import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { journalsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import authorize from "app/routes/utility/loaders/authorize";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import PageHeader from "backend/components/layout/PageHeader";
import Layout from "backend/components/layout";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";

export const loader = ({ request, context }) => {
  return authorize({
    request,
    context,
    ability: "create",
    entity: "journal"
  });
};

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(journalsAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/journals/${result.data.id}`);
  } catch (error) {
    return handleActionError(error);
  }
}

export default function JournalsNewRoute() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const breadcrumbs = [
    {
      to: "/backend/journals",
      label: t("glossary.journal_title_case_other")
    },
    {
      to: "/backend/journals/new",
      label: t("common.new")
    }
  ];

  return (
    <>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <PageHeader
        type="journal"
        backUrl="/backend/journals"
        backLabel={t("glossary.journal_title_case_other")}
        title={t("journals.forms.new_header")}
        note={t("journals.forms.new_instructions")}
      />
      <Layout.BackendPanel>
        <FormContainer.Form fetcher={fetcher} className="form-secondary">
          <Form.FieldGroup label={t("journals.forms.title_descript_label")}>
            <Form.TextInput
              validation={["required"]}
              focusOnMount
              label={t("journals.forms.title_label")}
              name="attributes[title]"
              placeholder={t("journals.forms.title_placeholder")}
            />
            <Form.TextInput
              label={t("journals.forms.subtitle_label")}
              name="attributes[subtitle]"
              placeholder={t("journals.forms.subtitle_placeholder")}
            />
            <Form.TextArea
              label={t("journals.forms.descript_label")}
              name="attributes[description]"
              height={100}
              wide
            />
          </Form.FieldGroup>
          <Form.Save
            text={t("journals.forms.submit_label")}
            cancelRoute="/backend/journals"
          />
        </FormContainer.Form>
      </Layout.BackendPanel>
    </>
  );
}
