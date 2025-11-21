import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import Properties from "backend/components/user-group/Properties";

export default function UserGroupsNew({ refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader
        title={t("records.user_groups.properties.new_header")}
      />
      <Properties refresh={refresh} />
    </section>
  );
}
