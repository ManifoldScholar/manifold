import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import Test from "backend/components/entitlement-import";

export default function EntitlementImportContainer({ refresh }) {
  const { t } = useTranslation();

  console.log(Test.Form);

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("backend.entitlement_imports.drawer_header")}
        instructions="This is a sample description of the drawer. Some more description
        here."
      />
      <Test.Form refresh={refresh} />
    </section>
  );
}

EntitlementImportContainer.displayName = "EntitlementImport.Create";

EntitlementImportContainer.propTypes = {};
