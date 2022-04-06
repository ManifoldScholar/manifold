import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { renderOffer, renderSeries, renderNamesList } from "../helpers";
import BaseSchema from "../BaseSchema";
import config from "config";

export default class Project extends PureComponent {
  static displayName = "Schema.Project";

  static propTypes = {
    project: PropTypes.shape({
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
    }).isRequired
  };

  get project() {
    return this.props.project;
  }

  get attributes() {
    return this.project.attributes;
  }

  get relationships() {
    return this.project.relationships;
  }

  projectData() {
    const {
      slug,
      title,
      metadata,
      publicationDate,
      createdAt,
      updatedAt,
      avatarStyles
    } = this.attributes;
    const { creators, contributors } = this.relationships;
    const hostname = config.services.client.url;

    return {
      "@type": "Book",
      "@id": metadata.isbn ?? metadata.doi,
      name: title,
      url: `${hostname}${lh.link("frontendProjectDetail", slug)}`,
      isbn: metadata.isbn,
      doi: metadata.doi,
      author: renderNamesList(creators),
      contributor: renderNamesList(contributors),
      copyrightHolder: metadata.rightsHolder,
      dateCreated: createdAt,
      dateModified: updatedAt,
      datePublished: publicationDate,
      publisher: metadata.publisher,
      bookEdition: metadata.edition,
      bookFormat: "EBook",
      isPartOf: renderSeries(metadata),
      image: avatarStyles && avatarStyles.small,
      offers: renderOffer(this.attributes)
    };
  }

  render() {
    return <BaseSchema entity={this.projectData()} />;
  }
}
