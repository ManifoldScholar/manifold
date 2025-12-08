import { useOutletContext, useLoaderData } from "react-router-dom";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import { useFromStore } from "hooks";
import EntitiesList, {
  Button,
  JournalIssueRow
} from "backend/components/list/EntitiesList";

export default function JournalIssuesContainer() {
  const { journal } = useOutletContext() || {};

  const closeUrl = lh.link("backendJournalIssues", journal?.id);

  const { requestKey } = useLoaderData();

  const data = useFromStore({
    requestKey,
    action: "select"
  });
  const meta = useFromStore({
    requestKey,
    action: "meta"
  });

  const { t } = useTranslation();

  if (!data || !journal) return null;

  return (
    <Authorize
      entity={journal}
      ability="read"
      failureNotification
      failureRedirect={lh.link("backendJournal", journal.id)}
    >
      <EntitiesList
        instructions={t("issues.instructions")}
        entityComponent={JournalIssueRow}
        entityComponentProps={{ journal }}
        title={t("issues.header")}
        titleStyle="bar"
        titleTag="h2"
        entities={data}
        unit={t("glossary.issue_truncated", {
          count: meta?.pagination?.totalCount || 0
        })}
        pagination={meta.pagination}
        showCount
        buttons={[
          <Button
            path={lh.link("backendJournalIssueNew", journal.id)}
            type="add"
            text={t("issues.add_button_label")}
            authorizedFor={journal}
            authorizedTo="update"
          />
        ]}
      />
      <OutletWithDrawer
        drawerProps={{
          lockScroll: "always",
          wide: true,
          lockScrollClickCloses: false,
          closeUrl
        }}
        context={{
          requestKey,
          journal,
          closeUrl
        }}
      />
    </Authorize>
  );
}
