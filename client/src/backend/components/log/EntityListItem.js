import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import humps from "humps";
import { EntityRow } from "backend/components/list/EntitiesList";

export default class LogListItem extends PureComponent {
  static displayName = "Log.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

  get deleted() {
    return this.version.attributes.deleted;
  }

  get itemDisplayName() {
    return this.version.attributes.itemDisplayName;
  }

  get itemId() {
    return this.version.attributes.itemId;
  }

  get actorName() {
    return this.version.attributes.actorName;
  }

  get actorId() {
    return this.version.attributes.actorId;
  }

  get createdAt() {
    return this.version.attributes.createdAt;
  }

  get version() {
    return this.props.entity;
  }

  get objectChanges() {
    return this.version.attributes.objectChanges;
  }

  get itemType() {
    return this.version.attributes.itemType;
  }

  get userLink() {
    return (
      <Link to={lh.link("backendRecordsUser", this.actorId)}>
        {`${this.actorName}`}
      </Link>
    );
  }

  get itemLink() {
    console.log(this.version);
    const urlName = `backend${this.itemType}`;

    if (this.deleted)
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: this.itemDisplayName
          }}
        />
      );

    return (
      <Link
        to={lh.link(urlName, this.itemId)}
        dangerouslySetInnerHTML={{
          __html: this.itemDisplayName
        }}
      />
    );
  }

  get isProjectLog() {
    return this.itemType === "Project";
  }

  get projectLogSubtitle() {
    return (
      <span>
        {this.userLink}
        {` updated this project `}
        <FormattedDate prefix="on" date={this.createdAt} />
      </span>
    );
  }

  get title() {
    if (this.isProjectLog) return this.projectLogSubtitle;
    return (
      <span>
        {this.userLink}
        {` updated the ${this.itemType}, \u201C`}
        {this.itemLink}
        {`\u201D, `}
        <FormattedDate prefix="on" date={this.createdAt} />
      </span>
    );
  }

  get changeList() {
    return (
      <span>
        {`These fields were modified: `}
        <em>
          {Object.keys(this.objectChanges)
            .map(change => humps.decamelize(change, { separator: " " }))
            .join(", ")}
        </em>
      </span>
    );
  }

  render() {
    return (
      <EntityRow
        title={this.title}
        listStyle={this.props.listStyle}
        meta={this.changeList}
      />
    );
  }
}
