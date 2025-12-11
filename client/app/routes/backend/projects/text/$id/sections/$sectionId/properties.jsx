import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { sectionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import SectionPropertiesForm from "components/backend/authoring/SectionPropertiesForm";

export const handle = { drawer: "backend" };

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => sectionsAPI.show(params.sectionId, params.id),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) => sectionsAPI.update(params.sectionId, data),
  redirectTo: ({ params }) => `/backend/projects/text/${params.id}/sections`
});

export default function SectionProperties({ loaderData: section }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const text = useOutletContext();

  const startSectionId = text.attributes?.startTextSectionId;

  return (
    <>
      <Layout.DrawerHeader title={t("texts.properties.header")} />
      <SectionPropertiesForm
        textId={text.id}
        section={section}
        fetcher={fetcher}
        startSectionId={startSectionId}
      />
    </>
  );
}
