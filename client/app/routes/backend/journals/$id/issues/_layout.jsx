import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router";
import { journalIssuesAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import EntitiesList, {
  Button,
  JournalIssueRow
} from "backend/components/list/EntitiesList";

export const loader = async ({ request, context, params }) => {
  return loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      journalIssuesAPI.journalIndex(params.id, filters, pagination),
    options: {
      defaultFilters: { withUpdateAbility: true },
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

// Same pattern as /_frontend/journals/$id/volumes/_index
// Volume data is included with journal response not issues
const hydrateVolumes = (issues, volumes = []) =>
  issues.map(issue => {
    const volRef = issue.relationships?.journalVolume;
    if (!volRef?.id) return issue;

    const fullVolume = volumes.find(v => v.id === volRef.id);
    if (!fullVolume) return issue;

    return {
      ...issue,
      relationships: {
        ...issue.relationships,
        journalVolume: fullVolume
      }
    };
  });

export default function JournalIssuesLayout({ loaderData }) {
  const { t } = useTranslation();
  const journal = useOutletContext();
  const { issueId } = useParams();

  const closeUrl = `/backend/journals/${journal.id}/issues`;
  const { data: issues, meta } = loaderData;

  const hydratedIssues = hydrateVolumes(
    issues,
    journal.relationships?.journalVolumes
  );

  return (
    <>
      <OutletWithDrawer
        drawerProps={{
          closeUrl,
          lockScroll: "always",
          wide: true,
          lockScrollClickCloses: false
        }}
      />
      <EntitiesList
        instructions={t("issues.instructions")}
        entityComponent={JournalIssueRow}
        entityComponentProps={{ journal, active: issueId }}
        title={t("issues.header")}
        titleStyle="bar"
        titleTag="h2"
        entities={hydratedIssues}
        unit={t("glossary.issue_truncated", {
          count: meta?.pagination?.totalCount || 0
        })}
        pagination={meta?.pagination}
        showCount
        buttons={[
          <Button
            key="new"
            path={`/backend/journals/${journal.id}/issues/new`}
            type="add"
            text={t("issues.add_button_label")}
            authorizedFor={journal}
            authorizedTo="update"
          />
        ]}
      />
    </>
  );
}
