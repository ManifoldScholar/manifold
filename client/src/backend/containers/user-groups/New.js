import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import Properties from "backend/components/user-group/Properties";

export default function UserGroupsNew() {
  const { t } = useTranslation();
  const { refresh } = useOutletContext();

  return (
    <section>
      <Layout.DrawerHeader
        title={t("records.user_groups.properties.new_header")}
      />
      <Properties refresh={refresh} />
    </section>
  );
}
