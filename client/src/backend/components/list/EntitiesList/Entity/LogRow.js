import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import humps from "humps";
import EntityRow from "./Row";

export default class EventRow extends PureComponent {
  static displayName = "EntitiesList.Entity.LogRow";

  static propTypes = {
    entity: PropTypes.object
  };

  get deleted() {
    return this.version.attributes.deleted;
  }

  get itemDisplayName() {
    return this.version.attributes.itemDisplayName;
  }

  get event() {
    return this.version.attributes.event;
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

  get showObjectChanges() {
    if (!this.objectChanges) return false;
    if (this.event === "create" || this.event === "destroy") return false;
    return true;
  }

  get itemType() {
    return this.version.attributes.itemType;
  }

  get userLink() {
    return (
      <Link
        className="entity-row__link--inverted"
        to={lh.link("backendRecordsUser", this.actorId)}
      >
        {`${this.actorName}`}
      </Link>
    );
  }

  get itemLink() {
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
        className="entity-row__link--inverted"
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

  get action() {
    const actions = {
      create: "created",
      update: "updated",
      destroy: "deleted",
      default: "changed"
    };
    return actions[this.event] || actions.default;
  }

  get title() {
    if (this.isProjectLog) return this.projectLogSubtitle;
    return (
      <span>
        {this.userLink}
        {` ${this.action} the ${this.itemType.toLowerCase()} \u201C`}
        {this.itemLink}
        {`\u201D `}
        <FormattedDate format="distanceInWords" date={this.createdAt} /> ago.
      </span>
    );
  }

  get changeList() {
    if (!this.showObjectChanges) return null;
    return (
      <span>
        {`Modified: `}
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
      <EntityRow {...this.props} title={this.title} meta={this.changeList} />
    );
  }
}
