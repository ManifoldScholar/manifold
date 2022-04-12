import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "./Form";
import Navigation from "backend/components/navigation";

export default function PermissionNew({ entity, history }) {
  const { t } = useTranslation();
  return (
    <section>
      <Navigation.DrawerHeader title={t("backend.forms.permissions.header")} />
      <Form entity={entity} history={history} />
    </section>
  );
}

PermissionNew.displayName = "Permission.New";

PermissionNew.propTypes = {
  entity: PropTypes.object,
  history: PropTypes.object
};
