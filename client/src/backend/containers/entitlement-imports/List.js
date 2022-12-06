import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { entitlementImportsAPI } from "api";
import EntitiesList, {
  Button,
  EntitlementRow
} from "backend/components/list/EntitiesList";
import { useFetch } from "hooks";

export default function PendingEntitlementsList() {
  const { t } = useTranslation();
  const { data: entitlements } = useFetch({
    request: [entitlementImportsAPI.index]
  });

  return entitlements ? (
    <EntitiesList
      title={t("backend.entitlement_imports.header")}
      titleStyle="bar"
      entityComponent={EntitlementRow}
      entityComponentProps={{}}
      entities={entitlements}
      buttons={[
        <Button
          path={lh.link("backendRecordsFeatureNew")}
          type="import"
          text={t("backend.entitlement_imports.button_label")}
          authorizedFor="entitlement"
        />
      ]}
    />
  ) : null;
}

PendingEntitlementsList.displayName = "PendingEntitlements.List";

PendingEntitlementsList.propTypes = {};
