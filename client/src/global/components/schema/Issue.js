import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";

export default function Issue({ issue }) {
  const { attributes, relationships } = issue;

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

  const renderJournal = () => {
    const { journal } = relationships;

    return journal
      ? {
          "@type": "Periodical",
          name: journal.attributes.title
        }
      : null;
  };

  const renderMainEntity = () => {
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

    return {
      "@type": "PublicationIssue",
      "@id": metadata.doi,
      name: title,
      issueNumber: number,
      url: lh.link("frontendProjectDetail", slug),
      issn: metadata.issn,
      copyrightHolder: metadata.rightsHolder,
      copyrightNotice: metadata.rights,
      dateCreated: createdAt,
      dateModified: updatedAt,
      datePublished: publicationDate,
      publisher: metadata.publisher,
      isPartOf: renderJournal(),
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
