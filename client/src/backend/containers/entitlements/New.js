import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "./Form";
import Navigation from "backend/components/navigation";

export default function EntitlementNew({ entity, closeUrl }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader title={t("entitlements.new.header")} />
      <Form entity={entity} redirectAfterSuccess={closeUrl} />
    </section>
  );
}

EntitlementNew.displayName = "Entitlements.New";

EntitlementNew.propTypes = {
  entity: PropTypes.object,
  closeUrl: PropTypes.string
};
