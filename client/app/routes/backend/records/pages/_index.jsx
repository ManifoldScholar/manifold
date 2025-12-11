import { useTranslation } from "react-i18next";
import { pagesAPI } from "api";
import loadList from "lib/react-router/loaders/loadList";
import EntitiesList, {
  Button,
  PageRow
} from "components/backend/list/EntitiesList";

export const loader = async ({ request, context }) => {
  return loadList({ request, context, fetchFn: pagesAPI.index });
};

export default function PagesListRoute({ loaderData }) {
  const { t } = useTranslation();
  const { data: pages } = loaderData;

  return (
    <EntitiesList
      entityComponent={PageRow}
      title={t("records.pages.header")}
      titleStyle="bar"
      entities={pages}
      buttons={[
        <Button
          key="new"
          path="/backend/records/pages/new"
          type="add"
          text={t("records.pages.button_label")}
          authorizedFor="page"
        />
      ]}
    />
  );
}
