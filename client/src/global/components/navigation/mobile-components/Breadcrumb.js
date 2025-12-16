import classNames from "classnames";
import { useLocation, NavLink } from "react-router";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

export default function MobileBreadcrumb({ links, journalIsActive }) {
  const location = useLocation();
  const { t } = useTranslation();

  const pathForLink = link => {
    if (link.externalUrl) return link.externalUrl;
    if (typeof link.path === "function") {
      return link.path(link.id);
    }
    return link.path;
  };

  const match = (linksToMatch, exact = false) => {
    if (!linksToMatch) return null;
    return linksToMatch.find(link => {
      if (link.matchType === "link" || link.externalUrl || exact) {
        return location.pathname === pathForLink(link);
      }

      if (
        location.pathname === "/project-collections" &&
        link.path === "/projects"
      )
        return true;

      // Check if pathname matches the link path
      const linkPath = pathForLink(link);
      if (location.pathname === linkPath) return true;

      // Fallback: check if pathname starts with the link path
      return location.pathname.startsWith(linkPath);
    });
  };

  const getSegments = () => {
    const segments = [];
    if (typeof journalIsActive !== "boolean") return segments;

    const firstMatch = match(links);
    /* eslint-disable no-nested-ternary */
    const first =
      journalIsActive && firstMatch
        ? firstMatch.path === "/projects"
          ? { label: "titles.journals", path: "/journals" }
          : firstMatch.path === "/backend/projects"
          ? { label: "titles.journals", path: "/backend/journals" }
          : firstMatch
        : firstMatch;
    /* eslint-enable no-nested-ternary */

    if (first) {
      segments.push(first);
      const second = match(first.children, true);
      if (second) {
        segments.push(second);
      }
    }
    return segments;
  };

  const isBackend = location.pathname.includes("backend");
  const segments = getSegments();
  const size = segments.length;
  let count = 0;

  return (
    <nav
      className={classNames("breadcrumb-list", {
        "hide-100": isBackend,
        "hide-82": !isBackend
      })}
    >
      {segments.map(link => {
        count += 1;
        return (
          <span key={count}>
            <NavLink className="breadcrumb-list__link" to={pathForLink(link)}>
              {t(link.label)}
            </NavLink>
            {count < size && (
              <IconComposer
                icon="disclosureDown16"
                size="default"
                className="breadcrumb-list__icon"
              />
            )}
          </span>
        );
      })}
    </nav>
  );
}

MobileBreadcrumb.displayName = "Navigation.Mobile.Breadcrumb";

MobileBreadcrumb.propTypes = {
  links: PropTypes.array.isRequired,
  journalIsActive: PropTypes.bool
};
