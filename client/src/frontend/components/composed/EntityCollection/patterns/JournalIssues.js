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
  limit,
  ...passThroughProps
}) {
  if (!journal) return null;

  const { title, slug, descriptionFormatted: description } =
    journal.attributes ?? {};
  const issues = journal.relationships?.recentJournalIssues?.slice(0, limit);
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
          to={lh.link("frontendJournals", slug)}
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
