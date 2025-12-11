import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { entitlementsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import EntitlementForm from "components/backend/entitlements/Form";

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
