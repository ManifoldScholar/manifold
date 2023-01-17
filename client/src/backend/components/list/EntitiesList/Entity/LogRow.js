import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import humps from "humps";
import EntityRow from "./Row";
import { Trans, withTranslation } from "react-i18next";

class LogRow extends PureComponent {
  static displayName = "EntitiesList.Entity.LogRow";

  static propTypes = {
    entity: PropTypes.object,
    t: PropTypes.func
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
        {this.actorName}
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
        <Trans
          i18nKey="projects.log.entry_project"
          components={{
            userLink: this.userLink,
            date: <FormattedDate date={this.createdAt} />
          }}
          values={{ user: this.actorName }}
        />
      </span>
    );
  }

  get action() {
    const useDefault =
      this.event !== "create" &&
      this.event !== "update" &&
      this.event !== "destroy";
    return useDefault ? "default" : this.event;
  }

  get title() {
    const t = this.props.t;

    if (this.isProjectLog) return this.projectLogSubtitle;

    return (
      <span>
        <Trans
          i18nKey="projects.log.entry"
          components={{
            userLink: this.userLink,
            titleWithLink: this.itemLink,
            daysAgo: (
              <FormattedDate
                format="distanceInWords"
                date={this.createdAt}
                suffix
              />
            )
          }}
          values={{
            user: this.actorName,
            entityType: t(`glossary.${this.itemType.toLowerCase()}_one`),
            action: t(`projects.log.actions.${this.action}`)
          }}
        />
      </span>
    );
  }

  get changeList() {
    if (!this.showObjectChanges) return null;

    /* This should be localized following the pattern used in src/global/components/meta/Item.js, but we need the full list of objects that can be changed to do so. -LD */
    const changes = Object.keys(this.objectChanges)
      .map(change => humps.decamelize(change, { separator: " " }))
      .join(", ");

    return <span>{this.props.t("projects.log.change_list", { changes })}</span>;
  }

  render() {
    return (
      <EntityRow {...this.props} title={this.title} meta={this.changeList} />
    );
  }
}

export default withTranslation()(LogRow);
