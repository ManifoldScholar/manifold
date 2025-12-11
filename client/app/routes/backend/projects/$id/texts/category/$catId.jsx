import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { textCategoriesAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import Category from "components/backend/category";

export const handle = { drawer: true };

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => textCategoriesAPI.show(params.catId),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) => textCategoriesAPI.update(params.catId, data),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/texts`
});

export default function CategoryEdit({ loaderData: category }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.category_edit_header")} />
      <Category.Form model={category} fetcher={fetcher} />
    </section>
  );
}
