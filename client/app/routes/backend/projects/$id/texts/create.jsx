import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { textsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import CreateTextForm from "backend/components/authoring/CreateTextForm";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => textsAPI.create(params.id, data),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/texts`
});

export default function TextCreate() {
  const { t } = useTranslation();
  const project = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader
        title={t("texts.create_button_label")}
        instructions={t("texts.create.drawer_instructions")}
      />
      <CreateTextForm
        cancelUrl={`/backend/projects/${project.id}/texts`}
        fetcher={fetcher}
      />
    </section>
  );
}
