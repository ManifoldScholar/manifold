import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";

export default function Journal({ journal }) {
  const { attributes, relationships } = journal;

  const renderOffer = () => {
    const { purchasePrice, purchasePriceCurrency, purchaseUrl } = attributes;
    const showOffer = purchasePrice && purchasePriceCurrency && purchaseUrl;

    return showOffer
      ? {
          "@type": "Offer",
          price: purchasePrice,
          priceCurrency: purchasePriceCurrency,
          url: purchaseUrl
        }
      : null;
  };

  const renderSeries = () => {
    const { seriesTitle } = attributes.metadata;

    return {
      "@type": "CreativeWorkSeries",
      name: seriesTitle
    };
  };

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

  const renderMainEntity = () => {
    const {
      slug,
      title,
      metadata,
      publicationDate,
      createdAt,
      updatedAt,
      avatarStyles
    } = attributes;

    return {
      "@type": "Periodical",
      "@id": metadata.issn,
      name: title,
      url: lh.link("frontendJournalDetail", slug),
      issn: metadata.issn,
      copyrightHolder: metadata.rightsHolder,
      copyrightNotice: metadata.rights,
      dateCreated: createdAt,
      dateModified: updatedAt,
      datePublished: publicationDate,
      publisher: metadata.publisher,
      hasPart: [...renderIssues(), ...renderVolumes()],
      isPartOf: metadata.seriesTitle && renderSeries(),
      image: avatarStyles && avatarStyles.small,
      offers: renderOffer()
    };
  };

  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    mainEntity: renderMainEntity()
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
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
