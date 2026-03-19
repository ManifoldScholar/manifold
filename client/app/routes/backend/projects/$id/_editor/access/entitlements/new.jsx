import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { entitlementsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import EntitlementForm from "backend/components/entitlements/Form";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    entitlementsAPI.create({ type: "projects", id: params.id }, data),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/access`
});

export default function ProjectEntitlementNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("entitlements.new.header")} />
      <EntitlementForm fetcher={fetcher} />
    </section>
  );
}
