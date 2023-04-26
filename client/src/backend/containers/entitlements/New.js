import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "./Form";
import Layout from "backend/components/layout";

export default function EntitlementNew({ entity, closeUrl }) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader title={t("entitlements.new.header")} />
      <Form entity={entity} redirectAfterSuccess={closeUrl} />
    </section>
  );
}

EntitlementNew.displayName = "Entitlements.New";

EntitlementNew.propTypes = {
  entity: PropTypes.object,
  closeUrl: PropTypes.string
};
