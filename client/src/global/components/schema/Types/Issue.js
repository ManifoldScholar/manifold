import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import {
  renderOffer,
  renderNamesList,
  renderVolumes,
  renderJournal
} from "../helpers";
import BaseSchema from "../BaseSchema";
import config from "config";

export default function Issue({ issue }) {
  const { attributes, relationships } = issue;
  const { journalVolume, journal } = relationships ?? {};

  const hostname = config.services.client.url;

  const {
    slug,
    title,
    metadata,
    publicationDate,
    createdAt,
    updatedAt,
    avatarStyles,
    number
  } = attributes;
  const { creators, contributors } = relationships;

  const issueData = {
    "@type": "PublicationIssue",
    "@id": metadata.issn ?? metadata.doi,
    name: title,
    issueNumber: number,
    url: `${hostname}${lh.link("frontendProjectDetail", slug)}`,
    issn: metadata.issn,
    identifier: metadata.doi
      ? {
          "@type": "PropertyValue",
          propertyID: "DOI",
          value: metadata.doi
        }
      : null,
    author: renderNamesList(creators),
    contributor: renderNamesList(contributors),
    copyrightHolder: metadata.rightsHolder,
    copyrightNotice: metadata.rights,
    dateCreated: createdAt,
    dateModified: updatedAt,
    datePublished: publicationDate,
    publisher: metadata.publisher,
    isPartOf: journalVolume
      ? renderVolumes([journalVolume], journal)
      : renderJournal(journal),
    image: avatarStyles && avatarStyles.small,
    offers: renderOffer(attributes)
  };

  return <BaseSchema entity={issueData} />;
}

Issue.displayName = "Schema.Issue";

Issue.propTypes = {
  issue: PropTypes.shape({
    url: PropTypes.string,
    attributes: PropTypes.shape({
      title: PropTypes.string,
      metadata: PropTypes.shape({
        issn: PropTypes.string,
        rightsHolder: PropTypes.string,
        rights: PropTypes.string,
        publisher: PropTypes.string,
        seriesTitle: PropTypes.string,
        doi: PropTypes.string
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
      journal: PropTypes.shape({
        attributes: PropTypes.shape({
          title: PropTypes.string
        })
      })
    })
  }).isRequired
};
