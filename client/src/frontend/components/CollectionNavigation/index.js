import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useCurrentUser, useSettings } from "hooks";
import Link from "./Link";
import * as Styled from "./styles";

function CollectionNavigation() {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const settings = useSettings();
  const location = useLocation();

  const links = useMemo(
    () =>
      [
        {
          to: "/projects",
          label: t("pages.projects"),
          icon: "projects64",
          requiresAuthorization: false,
          show: true
        },
        settings?.attributes?.calculated?.hasVisibleJournals && {
          to: "/journals",
          label: t("pages.journals"),
          icon: "journals64",
          requiresAuthorization: false,
          show: location.pathname !== "/journals"
        },
        {
          to: "/journals/issues",
          label: t("pages.issues"),
          icon: "journals64",
          requiresAuthorization: false,
          show: location.pathname === "/journals"
        },
        settings?.attributes?.calculated?.hasProjectCollections && {
          to: "/project-collections",
          label: t("pages.project_collections"),
          icon: "projectCollections64",
          requiresAuthorization: false,
          show: true
        },
        {
          to: "/my/starred",
          label: t("pages.my_starred"),
          icon: "star24",
          requiresAuthorization: true,
          show: true
        },
        {
          to: "/my/notes",
          label: t("pages.my_notes_truncated"),
          icon: "notes24",
          requiresAuthorization: true,
          show: true
        }
      ].filter(x => x),
    [settings, location.pathname, t]
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

export default CollectionNavigation;
