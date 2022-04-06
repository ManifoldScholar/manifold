import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { renderOffer, renderSeries } from "../helpers";
import BaseSchema from "../BaseSchema";
import config from "config";

export default function Journal({ journal }) {
  const { attributes, relationships } = journal;

  const hostname = config.services.client.url;

  const renderIssues = () => {
    const { journalIssues } = relationships;

    if (!journalIssues.length) return {};

    return journalIssues.map(issue => ({
      "@type": "PublicationIssue",
      issueNumber: issue.attributes.number,
      datePublished: issue.attributes.publicationDate
    }));
  };

  const renderVolumes = () => {
    const { journalVolumes } = relationships;

    if (!journalVolumes.length) return {};

    return journalVolumes.map(volume => ({
      "@type": "PublicationVolume",
      volumeNumber: volume.attributes.number,
      datePublished: volume.attributes.publicationDate
    }));
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
    "@id": metadata.issn,
    name: title,
    url: `${hostname}${lh.link("frontendJournalDetail", slug)}`,
    issn: metadata.issn,
    copyrightHolder: metadata.rightsHolder,
    copyrightNotice: metadata.rights,
    dateCreated: createdAt,
    dateModified: updatedAt,
    datePublished: publicationDate,
    publisher: metadata.publisher,
    hasPart: [...renderIssues(), ...renderVolumes()],
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
            number: PropTypes.number,
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
