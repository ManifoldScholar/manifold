import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { usersAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import authorize from "app/routes/utility/loaders/authorize";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import Properties from "backend/components/user/Properties";

export const loader = ({ request, context }) => {
  return authorize({ request, context, ability: "create", entity: "user" });
};

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      usersAPI.create({ ...data, meta: { createdByAdmin: true } }),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/records/users/${result.data.id}`);
  } catch (error) {
    return handleActionError(error);
  }
}

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
