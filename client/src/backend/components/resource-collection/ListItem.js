import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import FormattedDate from "components/global/FormattedDate";
import { Resourceish } from "components/frontend";
import lh from "helpers/linkHandler";

export default class ResourceCollectionListItem extends PureComponent {
  static displayName = "ResourceCollection.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    projectId: PropTypes.string
  };

  render() {
    const collection = this.props.entity;
    if (!collection) return null;
    const attr = collection.attributes;

    return (
      <li>
        <Link to={lh.link("backendCollection", collection.id)}>
          <header>
            <figure className="cover">
              <Resourceish.Thumbnail
                key={collection.id}
                projectId={this.props.projectId}
                resourceish={collection}
                showTitle={false}
                showKind={false}
                additionalClasses="icon-only"
              />
            </figure>
            <div className="meta">
              <h3 className="name">
                <span className="collection-title">{attr.title}</span>
                <span className="subtitle">
                  <FormattedDate format="MMMM DD, YYYY" date={attr.createdAt} />
                </span>
              </h3>
            </div>
          </header>
        </Link>
      </li>
    );
  }
}
