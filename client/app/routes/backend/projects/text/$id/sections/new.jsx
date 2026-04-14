import { useTranslation } from "react-i18next";
import { redirect, useOutletContext, useFetcher } from "react-router";
import { sectionsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "components/backend/layout";
import AddSectionForm from "components/backend/authoring/AddSectionForm";

export const handle = { drawer: "backend" };

export async function action({ request, context, params }) {
  const data = await request.json();
  const { intent, ...sectionData } = data;
  try {
    const result = await queryApi(
      sectionsAPI.create(params.id, sectionData),
      context
    );
    if (result?.errors) return { errors: result.errors };
    if (intent === "editor") {
      throw redirect(
        `/backend/projects/text/${params.id}/sections/${result.data.id}/edit`
      );
    }
    throw redirect(`/backend/projects/text/${params.id}/sections`);
  } catch (error) {
    return handleActionError(error);
  }
}

export default function NewSection() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const text = useOutletContext();

  const nextPosition = text.attributes?.sectionsMap?.length + 1;

  return (
    <>
      <Layout.DrawerHeader title={t("texts.add_section_button_label")} />
      <AddSectionForm
        textId={text.id}
        nextPosition={nextPosition}
        fetcher={fetcher}
      />
    </>
  );
}
