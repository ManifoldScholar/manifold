import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import { FooterLink, ProjectCollectionIcon } from "../parts";
import EntityCollection from "../EntityCollection";
import { getHeroImage, getHeaderLayout } from "../helpers";

function JournalSummaryEntityCollection({
  journal,
  paginationProps,
  filterProps,
  limit = 4,
  ...passThroughProps
}) {
  if (!journal) return null;

  const { title, descriptionFormatted: description, slug } =
    journal.attributes ?? {};
  const issues = journal.relationships?.recentJournalIssues ?? [];
  const headerLayout = getHeaderLayout(journal);
  const image = getHeroImage(headerLayout, journal);
  const imageAlt = journal.attributes.heroAltText;

  const totalIssueCount = journal.attributes?.journalIssuesCount;
  const footerLinkText =
    totalIssueCount > limit ? "See all issues" : "Visit the journal page";

  return (
    <EntityCollection
      title={title}
      description={description}
      IconComponent={ProjectCollectionIcon}
      iconProps={{ collection: journal }}
      image={image}
      imageAlt={imageAlt}
      headerLayout={headerLayout}
      headerLink={lh.link("frontendJournal", slug)}
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
          to={lh.link("frontendJournal", slug)}
          label={footerLinkText}
          tabIndex={-1}
        />
      )}
      {...passThroughProps}
    />
  );
}

JournalSummaryEntityCollection.displayName =
  "Frontend.Entity.Collection.JournalSummary";

JournalSummaryEntityCollection.propTypes = {
  journal: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object),
  projectsMeta: PropTypes.object,
  limit: PropTypes.number
};

export default JournalSummaryEntityCollection;
