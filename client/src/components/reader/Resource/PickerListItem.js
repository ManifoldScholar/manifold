import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";
import { Resource } from "components/frontend";

export default class ResourcePickerListItem extends PureComponent {
  static displayName = "Resource.PickerListItem";

  static propTypes = {
    entity: PropTypes.object,
    selectionHandler: PropTypes.func,
    projectId: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.selectionHandler(this.props.entity);
  }

  render() {
    const resource = this.props.entity;
    const attr = resource.attributes;
    return (
      <li>
        <a href="#" onClick={this.handleClick}>
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
                  <FormattedDate format="MMMM DD, YYYY" date={attr.createdAt} />
                </span>
              </h3>
            </div>
          </header>
        </a>
      </li>
    );
  }
}
