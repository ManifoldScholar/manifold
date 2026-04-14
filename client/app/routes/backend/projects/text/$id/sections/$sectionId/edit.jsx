import { redirect, useOutletContext, useFetcher } from "react-router";
import { sectionsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import EditSectionForm from "components/backend/authoring/EditSectionForm";

export const handle = { drawer: "editor" };

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => sectionsAPI.show(params.sectionId, params.id),
    request
  });
};

export async function action({ request, context, params }) {
  const data = await request.json();
  const { intent, ...sectionData } = data;
  try {
    const result = await queryApi(
      sectionsAPI.update(params.sectionId, sectionData),
      context
    );
    if (result?.errors) return { errors: result.errors };
    if (intent === "close") {
      throw redirect(`/backend/projects/text/${params.id}/sections`);
    }
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function EditSection({ loaderData: section }) {
  const fetcher = useFetcher();
  const text = useOutletContext();

  const appliesToAllStylesheets = text.relationships.stylesheets
    ?.filter(s => s.attributes.appliesToAllTextSections)
    .map(s => s.id);

  const appliedStylesheets =
    text?.relationships?.stylesheets?.filter(s =>
      appliesToAllStylesheets?.includes(s.id)
    ) ?? [];

  const stylesheets = Array.isArray(section?.relationships?.stylesheets)
    ? [...section.relationships.stylesheets, ...appliedStylesheets]
    : [...appliedStylesheets];

  return (
    <EditSectionForm
      section={section}
      textId={text.id}
      fetcher={fetcher}
      stylesheets={stylesheets}
    />
  );
}
