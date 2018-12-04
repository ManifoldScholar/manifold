import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import FormattedDate from "global/components/FormattedDate";
import Resourceish from "frontend/components/resourceish";
import lh from "helpers/linkHandler";

export default class ResourceListItem extends PureComponent {
  static displayName = "Resource.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    projectId: PropTypes.string
  };

  render() {
    const resource = this.props.entity;
    const attr = resource.attributes;

    return (
      <li>
        <Link to={lh.link("backendResource", this.props.entity.id)}>
          <header>
            <figure className="cover">
              <Resourceish.Thumbnail
                key={resource.id}
                projectId={this.props.projectId}
                resourceish={resource}
                showTitle={false}
                showKind={false}
                additionalClasses="icon-only"
              />
            </figure>
            <div className="meta">
              <h3 className="name">
                <span
                  dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
                />
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
