import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { usersAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import authorize from "app/routes/utility/loaders/authorize";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import Properties from "components/backend/user/Properties";

export const loader = ({ request, context }) => {
  return authorize({ request, context, ability: "create", entity: "user" });
};

export const action = formAction({
  mutation: ({ data }) =>
    usersAPI.create({ ...data, meta: { createdByAdmin: true } }),
  redirectTo: ({ result }) => `/backend/records/users/${result.data.id}`
});

export default function UsersNewRoute() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <div>
      <PageHeader
        type="user"
        icon="Avatar24"
        title={t("records.users.new_header")}
        secondaryLinks={[
          {
            label: "titles.properties",
            path: "/backend/records/users/new",
            entity: "user",
            ability: "update"
          }
        ]}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={[
              {
                label: "titles.properties",
                path: "/backend/records/users/new",
                entity: "user",
                ability: "update"
              }
            ]}
            panel
            ariaLabel={t("users.settings")}
          />
        }
      >
        <div>
          <Properties
            fetcher={fetcher}
            saveLabel={t("records.users.create_label")}
          />
        </div>
      </Layout.BackendPanel>
    </div>
  );
}
