import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Category from "backend/components/category";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";

export default function ProjectCategoryNewContainer({
  project,
  refresh,
  history
}) {
  const { t } = useTranslation();

  const onSuccess = categoryIgnored => {
    refresh();
    const url = lh.link("backendProjectTexts", project.id);
    history.push(url, { keepNotifications: false });
  };

  return (
    <div>
      <Layout.DrawerHeader title={t("texts.category_new_header")} />
      <Category.Form projectId={project.id} onSuccess={onSuccess} />
    </div>
  );
}

ProjectCategoryNewContainer.displayName = "Project.Category.New";

ProjectCategoryNewContainer.propTypes = {
  project: PropTypes.object.isRequired,
  refresh: PropTypes.func,
  history: PropTypes.object
};
