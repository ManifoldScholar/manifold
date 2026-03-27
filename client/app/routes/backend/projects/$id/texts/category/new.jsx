import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { textCategoriesAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import Category from "backend/components/category";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => textCategoriesAPI.create(params.id, data),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/texts`
});

export default function CategoryNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.category_new_header")} />
      <Category.Form fetcher={fetcher} />
    </section>
  );
}
