import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { pagesAPI, requests } from "api";
import { useFetch } from "hooks";
import EntitiesList, {
  Button,
  PageRow
} from "backend/components/list/EntitiesList";
import Authorize from "hoc/Authorize";

export default function PagesList() {
  const { t } = useTranslation();

  const { data: pages } = useFetch({
    request: [pagesAPI.index],
    options: { requestKey: requests.gPages }
  });

  if (!pages) return null;

  return (
    <Authorize
      ability="update"
      entity={["page"]}
      failureNotification={{
        body: t("errors.access_denied.authorization_admin_type", {
          type: "pages"
        })
      }}
      failureRedirect
    >
      <EntitiesList
        entityComponent={PageRow}
        title={t("records.pages.header")}
        titleStyle="bar"
        entities={pages}
        buttons={[
          <Button
            key="new"
            path={lh.link("backendRecordsPageNew")}
            type="add"
            text={t("records.pages.button_label")}
            authorizedFor="page"
          />
        ]}
      />
    </Authorize>
  );
}

PagesList.displayName = "Pages.List";
