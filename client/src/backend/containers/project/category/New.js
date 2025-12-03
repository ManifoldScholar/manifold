import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate } from "react-router-dom";
import Category from "backend/components/category";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";

export default function ProjectCategoryNewContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project, refresh } = useOutletContext() || {};

  const onSuccess = () => {
    if (refresh) refresh();
    const url = lh.link("backendProjectTexts", project?.id);
    navigate(url);
  };

  if (!project) return null;

  return (
    <div>
      <Layout.DrawerHeader title={t("texts.category_new_header")} />
      <Category.Form projectId={project.id} onSuccess={onSuccess} />
    </div>
  );
}

ProjectCategoryNewContainer.displayName = "Project.Category.New";
