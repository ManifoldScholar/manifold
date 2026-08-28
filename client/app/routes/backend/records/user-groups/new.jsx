import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { userGroupsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import authorize from "lib/react-router/loaders/authorize";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import Properties from "components/backend/user-group/Properties";

const links = [
  {
    label: "titles.properties",
    path: "/backend/records/user-groups/new",
    entity: "userGroup",
    ability: "update"
  }
];

export const loader = ({ context, url }) => {
  return authorize({ url, context, ability: "create", entity: "userGroup" });
};

export const action = formAction({
  mutation: ({ data }) => userGroupsAPI.create(data),
  redirectTo: ({ result }) => `/backend/records/user-groups/${result.data.id}`
});

export default function UserGroupsNewRoute() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <div>
      <PageHeader
        type="userGroup"
        icon="Users32"
        title={t("records.user_groups.properties.new_header")}
        secondaryLinks={links}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={links}
            panel
            ariaLabel={t("records.user_groups.settings")}
          />
        }
      >
        <div>
          <Properties fetcher={fetcher} />
        </div>
      </Layout.BackendPanel>
    </div>
  );
}
