import React from "react";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "hooks";
import Link from "./Link";
import * as Styled from "./styles";

const LINKS = [
  {
    to: lh.link("frontendProjectsAll"),
    label: "Projects",
    icon: "projects64",
    requiresAuthorization: false
  },
  {
    to: lh.link("frontendJournalsList"),
    label: "Journals",
    icon: "journals64",
    requiresAuthorization: false
  },
  {
    to: lh.link("frontendProjectCollections"),
    label: "Project Collections",
    icon: "projectCollections64",
    requiresAuthorization: false
  },
  {
    to: lh.link("frontendStarred"),
    label: "My Starred",
    icon: "star24",
    requiresAuthorization: true
  },
  {
    to: lh.link("frontendAnnotations"),
    label: "My Notes",
    icon: "notes24",
    requiresAuthorization: true
  }
];

function CollectionNavigation() {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const filteredLinks = LINKS.filter(link =>
    currentUser ? true : !link.requiresAuthorization
  );

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

CollectionNavigation.displayName = "Frontend.Composed.CollectionNavigation";

export default CollectionNavigation;
