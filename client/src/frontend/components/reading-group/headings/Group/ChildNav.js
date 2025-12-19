import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { hasItemsInCollection } from "frontend/components/collecting/helpers";
import { Navigation } from "../parts";

function ChildNav({ readingGroup }) {
  const { t } = useTranslation();

  const homePaths = {
    static: `/groups/${readingGroup.id}`,
    edit: `/groups/${readingGroup.id}/edit`
  };
  const { abilities, currentUserRole } = readingGroup.attributes;
  const canUpdateGroup = abilities.update;
  const showHomeLink = canUpdateGroup || hasItemsInCollection(readingGroup);
  const isMember = currentUserRole !== "none";
  const showMembersLink = canUpdateGroup || isMember;

  const links = [
    {
      to: `/groups/${readingGroup.id}/annotations`,
      text: t("navigation.reading_group.annotations"),
      icon: "notes24",
      exact: true,
      isActive: null
    }
  ];

  if (showHomeLink) {
    links.unshift({
      to: homePaths.static,
      text: t("navigation.reading_group.home"),
      icon: "star24",
      exact: true,
      isActive: location => Object.values(homePaths).includes(location.pathname)
    });
  }

  if (showMembersLink) {
    links.push({
      to: `/groups/${readingGroup.id}/members`,
      text: t("navigation.reading_group.members"),
      icon: "readingGroup24",
      exact: true,
      isActive: null
    });
  }

  if (links.length <= 1) return null;

  return (
    <Navigation ariaLabel={t("navigation.reading_group.label")} links={links} />
  );
}

ChildNav.displayName = "ReadingGroup.Heading.ChildNav";

ChildNav.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default ChildNav;
