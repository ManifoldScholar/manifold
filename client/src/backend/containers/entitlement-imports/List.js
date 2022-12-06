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
import { childRoutes } from "helpers/router";

export default function PendingEntitlementsList({ route }) {
  const { t } = useTranslation();
  const { data: entitlements } = useFetch({
    request: [entitlementImportsAPI.index]
  });

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendRecordsEntitlements");

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        wide: true,
        closeUrl
      },
      childProps: {}
    });
  };

  return (
    <>
      {renderChildRoutes()}
      {entitlements && (
        <EntitiesList
          title={t("backend.entitlement_imports.header")}
          titleStyle="bar"
          entityComponent={EntitlementRow}
          entityComponentProps={{}}
          entities={entitlements}
          buttons={[
            <Button
              path={lh.link("backendRecordsEntitlementsNew")}
              type="import"
              text={t("backend.entitlement_imports.button_label")}
              authorizedFor="entitlement"
            />
          ]}
        />
      )}
    </>
  );
}

PendingEntitlementsList.displayName = "PendingEntitlements.List";

PendingEntitlementsList.propTypes = {};
