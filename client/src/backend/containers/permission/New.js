import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "./Form";
import Layout from "backend/components/layout";

export default function PermissionNew({ entity, history }) {
  const { t } = useTranslation();
  return (
    <section>
      <Layout.DrawerHeader title={t("projects.permissions.header")} />
      <Form entity={entity} history={history} />
    </section>
  );
}

PermissionNew.displayName = "Permission.New";

PermissionNew.propTypes = {
  entity: PropTypes.object,
  history: PropTypes.object
};
