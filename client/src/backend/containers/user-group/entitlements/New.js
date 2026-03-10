import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import Form from "./Form";

export default function UserGroupEntitlementNew({
  userGroup,
  refresh,
  refreshUserGroup
}) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader
        title={t("records.user_groups.entitlements.add_header")}
        instructions={t("records.user_groups.entitlements.add_instructions")}
      />
      <Form
        userGroup={userGroup}
        refresh={refresh}
        refreshUserGroup={refreshUserGroup}
      />
    </section>
  );
}

UserGroupEntitlementNew.displayName = "UserGroupEntitlements.New";

UserGroupEntitlementNew.propTypes = {
  userGroup: PropTypes.object.isRequired,
  refresh: PropTypes.func,
  refreshUserGroup: PropTypes.func
};
