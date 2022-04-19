import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import {
  renderOffer,
  renderSeries,
  renderVolumes,
  renderIssues
} from "../helpers";
import BaseSchema from "../BaseSchema";
import config from "config";

export default function Journal({ journal }) {
  const { attributes, relationships } = journal;
  const { journalVolumes, journalIssues } = relationships ?? {};
  const { journalIssuesWithoutVolumeCount: uncategorizedCount } =
    attributes ?? {};

  const hostname = config.services.client.url;

  const renderVolumesAndIssues = () => {
    if (!journalVolumes.length && !uncategorizedCount) return null;

    const uncategorized =
      journalIssues.filter(issue => !issue.attributes.journalVolumeNumber) ??
      [];

    return uncategorized.length
      ? [
          ...renderIssues(uncategorized),
          ...renderVolumes(journalVolumes, null, true)
        ]
      : [...renderVolumes(journalVolumes, null, true)];
  };

  const {
    slug,
    title,
    metadata,
    publicationDate,
    createdAt,
    updatedAt,
    avatarStyles
  } = attributes;

  const journalData = {
    "@type": "Periodical",
    "@id": metadata.issn ?? metadata.doi,
    name: title,
    url: `${hostname}${lh.link("frontendJournalDetail", slug)}`,
    issn: metadata.issn,
    doi: metadata.doi,
    copyrightHolder: metadata.rightsHolder,
    copyrightNotice: metadata.rights,
    dateCreated: createdAt,
    dateModified: updatedAt,
    datePublished: publicationDate,
    publisher: metadata.publisher,
    hasPart: renderVolumesAndIssues(),
    isPartOf: renderSeries(metadata),
    image: avatarStyles && avatarStyles.small,
    offers: renderOffer(attributes)
  };

  return <BaseSchema entity={journalData} />;
}

Journal.displayName = "Schema.Journal";

Journal.propTypes = {
  journal: PropTypes.shape({
    url: PropTypes.string,
    attributes: PropTypes.shape({
      title: PropTypes.string,
      metadata: PropTypes.shape({
        issn: PropTypes.string,
        rightsHolder: PropTypes.string,
        rights: PropTypes.string,
        publisher: PropTypes.string,
        seriesTitle: PropTypes.string
      }),
      purchaseUrl: PropTypes.string,
      purchasePrice: PropTypes.number,
      purchasePriceCurrency: PropTypes.string,
      avatarStyles: PropTypes.shape({
        small: PropTypes.string
      }),
      publicationDate: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string
    }),
    relationships: PropTypes.shape({
      journalIssues: PropTypes.arrayOf(
        PropTypes.shape({
          attributes: PropTypes.shape({
            number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            publicationDate: PropTypes.string
          })
        })
      ),
      journalVolumes: PropTypes.arrayOf(
        PropTypes.shape({
          attributes: PropTypes.shape({
            number: PropTypes.number,
            publicationDate: PropTypes.string
          })
        })
      )
    })
  }).isRequired
};
