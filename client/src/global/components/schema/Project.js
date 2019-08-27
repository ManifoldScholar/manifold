import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";

export default class Project extends PureComponent {
  static displayName = "Schema.Project";

  static propTypes = {
    url: PropTypes.string,
    attributes: PropTypes.shape({
      title: PropTypes.string,
      metadata: PropTypes.shape({
        isbn: PropTypes.string,
        rightsHolder: PropTypes.string,
        publisher: PropTypes.string,
        seriesTitle: PropTypes.string,
        doi: PropTypes.string,
        edition: PropTypes.string
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
      creators: PropTypes.arrayOf(
        PropTypes.shape({
          attributes: PropTypes.shape({
            fullName: PropTypes.string.isRequired
          }).isRequired
        })
      ),
      contributors: PropTypes.arrayOf(
        PropTypes.shape({
          attributes: PropTypes.shape({
            fullName: PropTypes.string.isRequired
          }).isRequired
        })
      )
    })
  };

  get showOffer() {
    const {
      purchasePrice,
      purchasePriceCurrency,
      purchaseUrl
    } = this.props.attributes;
    return purchasePrice && purchasePriceCurrency && purchaseUrl;
  }

  personArray(persons) {
    if (!persons || persons.length < 1) return null;

    return persons.map(p => ({
      "@type": "Person",
      name: p.attributes.fullName
    }));
  }

  renderSeries() {
    const { seriesTitle } = this.props.attributes.metadata;

    return {
      "@type": "CreativeWorkSeries",
      name: seriesTitle
    };
  }

  renderOffer() {
    const {
      purchasePrice,
      purchasePriceCurrency,
      purchaseUrl
    } = this.props.attributes;
    return {
      "@type": "Offer",
      price: purchasePrice,
      priceCurrency: purchasePriceCurrency,
      url: purchaseUrl
    };
  }

  renderMainEntity() {
    const {
      slug,
      title,
      metadata,
      publicationDate,
      createdAt,
      updatedAt,
      avatarStyles
    } = this.props.attributes;
    const { creators, contributors } = this.props.relationships;

    return {
      "@type": "Book",
      "@id": metadata.doi,
      name: title,
      url: lh.link("frontendProjectDetail", slug),
      isbn: metadata.isbn,
      author: this.personArray(creators),
      contributor: this.personArray(contributors),
      copyrightHolder: metadata.rightsHolder,
      dateCreated: createdAt,
      dateModified: updatedAt,
      datePublished: publicationDate,
      publisher: metadata.publisher,
      bookEdition: metadata.edition,
      bookFormat: "EBook",
      isPartOf: metadata.seriesTitle && this.renderSeries(),
      image: avatarStyles && avatarStyles.small,
      offers: this.showOffer && this.renderOffer()
    };
  }

  render() {
    const data = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      mainEntity: this.renderMainEntity()
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }
}
