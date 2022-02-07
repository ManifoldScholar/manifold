import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

function getRoute(type) {
  switch (type) {
    case "journals":
      return "frontendJournalsList";
    case "journalIssues":
      return "frontendIssuesList";
    case "projectCollections":
      return "frontendProjectCollections";
    default:
      return "frontendProjectsAll";
  }
}

function getLabel(type) {
  switch (type) {
    case "journals":
      return "See all journals";
    case "journalIssues":
      return "See all issues";
    case "projectCollections":
      return "See project collections";
    default:
      return "See all projects";
  }
}

function getIcon(type) {
  switch (type) {
    case "journals":
      return "journals64";
    case "journalIssues":
      return "journals64";
    case "projectCollections":
      return "projectCollections64";
    default:
      return "projects64";
  }
}

function CollectionNavigation({ entityType = "projects", bgColor = "white" }) {
  const url = getRoute(entityType);
  const label = getLabel(entityType);
  const icon = getIcon(entityType);

  return (
    <section className={`bg-${bgColor}`}>
      <div className="container">
        <div className="button-nav button-nav--default">
          <Link to={lh.link(url)} className="button-icon-primary">
            <IconComposer
              icon={icon}
              size={48}
              className="button-icon-primary__icon"
            />
            <span className="button-icon-primary__text">{label}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

CollectionNavigation.displayName = "Frontend.Composed.CollectionNavigation";

CollectionNavigation.propTypes = {
  entityType: PropTypes.oneOf([
    "journals",
    "journalIssues",
    "projects",
    "projectCollections"
  ]),
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default CollectionNavigation;
