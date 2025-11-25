import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import Category from "backend/components/category";
import { textCategoriesAPI, requests } from "api";
import Layout from "backend/components/layout";
import { useFetch } from "hooks";

export default function ProjectCategoryEditContainer() {
  const { t } = useTranslation();
  const { catId } = useParams();
  const { refresh } = useOutletContext() || {};

  const { data: category } = useFetch({
    request: [textCategoriesAPI.show, catId],
    options: { requestKey: requests.beTextCategory },
    condition: !!catId
  });

  const onSuccess = () => {
    if (refresh) refresh();
  };

  if (!category) return null;

  return (
    <div>
      <Layout.DrawerHeader title={t("texts.category_edit_header")} />
      <Category.Form model={category} onSuccess={onSuccess} />
    </div>
  );
}

ProjectCategoryEditContainer.displayName = "Project.Category.Edit";
