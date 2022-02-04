import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import { FooterLink, ProjectCollectionIcon } from "../parts";
import EntityCollection from "../EntityCollection";
import { getHeroImage, getHeaderLayout } from "../helpers";

function JournalIssuesEntityCollection({
  journal,
  paginationProps,
  filterProps,
  limit = 4,
  ...passThroughProps
}) {
  if (!journal) return null;

  const { title, descriptionFormatted: description } = journal.attributes ?? {};
  // TODO: uncomment once `recentJournalIssues` has necessary data
  // const issues = journal.relationships?.recentJournalIssues ?? [];
  const issues = [];
  const image = getHeroImage(journal);
  const headerLayout = getHeaderLayout(journal);

  const totalIssueCount = journal.attributes?.journalIssuesCount;
  const footerLinkText =
    totalIssueCount > limit ? "See all issues" : "Visit the journal page";

  return (
    <EntityCollection
      title={title}
      description={description}
      IconComponent={props => (
        <ProjectCollectionIcon {...props} collection={journal} />
      )}
      image={image}
      headerLayout={headerLayout}
      headerLink={lh.link("frontendJournal", journal.id)}
      BodyComponent={props =>
        !!issues?.length && (
          <ThumbnailGrid {...props}>
            {({ stack }) =>
              issues.map(item => (
                <EntityThumbnail key={item.id} entity={item} stack={stack} />
              ))
            }
          </ThumbnailGrid>
        )
      }
      FooterComponent={() => (
        <FooterLink
          to={lh.link("frontendJournal", journal.id)}
          label={footerLinkText}
          tabIndex={-1}
        />
      )}
      {...passThroughProps}
    />
  );
}

JournalIssuesEntityCollection.displayName =
  "Frontend.Composed.EntityCollection.JournalIssues";

JournalIssuesEntityCollection.propTypes = {
  journal: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object),
  projectsMeta: PropTypes.object,
  limit: PropTypes.number
};

export default JournalIssuesEntityCollection;
