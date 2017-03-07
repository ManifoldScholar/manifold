import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import FormattedDate from 'components/global/FormattedDate';
import { Resource } from 'components/frontend';

export default class ResourceListItem extends PureComponent {

  static displayName = "Resource.ListItem";

  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.entity;
    const attr = resource.attributes;
    return (
      <li>
        <Link to={`/backend/resource/${this.props.entity.id}`}>
          <header>
            <figure className="cover">
              <Resource.Thumbnail
                key={resource.id}
                projectId={this.props.projectId}
                resource={resource}
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
                  <FormattedDate
                    format="MMMM DD, YYYY"
                    date={attr.createdAt}
                  />
                </span>
              </h3>
            </div>
          </header>
        </Link>
      </li>
    );

  }

}
