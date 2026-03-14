import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import PageHeader from "backend/components/layout/PageHeader";
import Resource from "backend/components/resource";
import { projectsAPI, resourcesAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";

const DEFAULT_RESOURCE = { attributes: { kind: "image" } };

const formatData = data => {
  const { attributes, relationships } = data ?? {};
  const merged = mergeImageAltText(attributes, "attachment");
  const { attachment, ...rest } = merged;

  return {
    relationships,
    attributes: {
      ...rest,
      ...(attachment
        ? {
            attachment:
              attributes.kind === "image"
                ? attachment
                : { ...attachment, altText: null }
          }
        : {})
    }
  };
};

export const loader = async ({ params, context, request }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });
  await authorize({
    request,
    context,
    entity: project,
    ability: "createResources"
  });
  return project;
};

export async function action({ request, context, params }) {
  const data = await request.json();
  try {
    const result = await queryApi(
      resourcesAPI.create(params.id, data),
      context
    );
    if (result?.errors) return { errors: result.errors };
    throw redirect(`/backend/projects/resource/${result.data.id}`);
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ResourceNew({ loaderData: project }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const belongsToJournalIssue = project.attributes.isJournalIssue;
  const breadcrumbs = getResourceBreadcrumbs(
    null,
    project,
    belongsToJournalIssue,
    t
  );

  return (
    <>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type="list"
        title={t("resources.new.title")}
        titleTag="h2"
        hideBreadcrumbs
      />
      <Layout.BackendPanel>
        <FormContainer.Form
          model={DEFAULT_RESOURCE}
          fetcher={fetcher}
          formatData={formatData}
          className="form-secondary"
        >
          <Resource.Form.KindPicker name="attributes[kind]" includeButtons />
          <Form.TextInput
            label={t("resources.title_label")}
            name="attributes[title]"
            placeholder={t("resources.title_placeholder")}
            wide
          />
          <Form.TextArea
            label={t("resources.descript_label")}
            name="attributes[description]"
            placeholder={t("resources.descript_placeholder")}
            wide
          />
          <Resource.Form.KindAttributes />
          <Form.Errorable name="attributes[fingerprint]" />
          <Form.Save
            text={t("resources.new.save")}
            cancelRoute={`/backend/projects/${project.id}/resources`}
          />
        </FormContainer.Form>
      </Layout.BackendPanel>
    </>
  );
}
