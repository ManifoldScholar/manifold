import classNames from "classnames";
import { useLocation, NavLink, matchPath } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

export default function MobileBreadcrumb({ links, journalIsActive }) {
  const location = useLocation();
  const { t } = useTranslation();

  const pathForLink = link => {
    if (link.externalUrl) return link.externalUrl;
    const args = link.args || [];
    const route = link.linksTo || link.route;
    return lh.link(route, ...args);
  };

  const match = (linksToMatch, exact = false) => {
    if (!linksToMatch) return null;
    return linksToMatch.find(link => {
      const route = lh.routeFromName(link.route);

      if (link.matchType === "link" || link.externalUrl || exact) {
        return location.pathname === pathForLink(link);
      }

      if (
        location.pathname === "/project-collections" &&
        link.route === "frontendProjects"
      )
        return true;

      return (
        matchPath(location.pathname, route) !== null ||
        location.pathname.startsWith(route.path)
      );
    });
  };

  const getSegments = () => {
    const segments = [];
    if (typeof journalIsActive !== "boolean") return segments;

    const firstMatch = match(links);
    /* eslint-disable no-nested-ternary */
    const first =
      journalIsActive && firstMatch
        ? firstMatch.route === "frontendProjects"
          ? { label: "titles.journals", route: "frontendJournals" }
          : firstMatch.route === "backendProjects"
          ? { label: "titles.journals", route: "backendJournals" }
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
