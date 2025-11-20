import { useTranslation } from "react-i18next";
import EntitiesList from "backend/components/list/EntitiesList";

export default function UserGroupEntitlements({ userGroup: ignored }) {
  const { t } = useTranslation();

  return (
    <div>
      <EntitiesList
        title={t("records.user_groups.entitlements.header")}
        titleStyle="bar"
        entities={[]}
      />
    </div>
  );
}
