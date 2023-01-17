import React, { useMemo } from "react";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { useCurrentUser } from "hooks";
import Link from "./Link";
import * as Styled from "./styles";
import withSettings from "hoc/withSettings";

function CollectionNavigation({ settings }) {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const { path } = useRouteMatch();

  const links = useMemo(
    () =>
      [
        {
          to: lh.link("frontendProjectsAll"),
          label: t("pages.projects"),
          icon: "projects64",
          requiresAuthorization: false,
          show: true
        },
        settings?.attributes?.calculated?.hasVisibleJournals && {
          to: lh.link("frontendJournalsList"),
          label: t("pages.journals"),
          icon: "journals64",
          requiresAuthorization: false,
          show: path !== lh.link("frontendJournalsList")
        },
        {
          to: lh.link("frontendIssuesList"),
          label: t("pages.issues"),
          icon: "journals64",
          requiresAuthorization: false,
          show: path === lh.link("frontendJournalsList")
        },
        settings?.attributes?.calculated?.hasProjectCollections && {
          to: lh.link("frontendProjectCollections"),
          label: t("pages.project_collections"),
          icon: "projectCollections64",
          requiresAuthorization: false,
          show: true
        },
        {
          to: lh.link("frontendStarred"),
          label: t("pages.my_starred"),
          icon: "star24",
          requiresAuthorization: true,
          show: true
        },
        {
          to: lh.link("frontendAnnotations"),
          label: t("pages.my_notes_truncated"),
          icon: "notes24",
          requiresAuthorization: true,
          show: true
        }
      ].filter(x => x),
    [settings, path, t]
  );

  const filteredLinks = links
    .filter(link => (currentUser ? true : !link.requiresAuthorization))
    .filter(link => link.show);

  return (
    <nav aria-label={t("navigation.library_links")} className="container">
      <Styled.List $count={filteredLinks.length}>
        {filteredLinks.map(link => (
          <li key={link.to}>
            <Link {...link} />
          </li>
        ))}
      </Styled.List>
    </nav>
  );
}

CollectionNavigation.displayName = "Frontend.CollectionNavigation";

export default withSettings(CollectionNavigation);
