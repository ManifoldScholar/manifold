import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";
import { withTranslation } from "react-i18next";

class TwitterQueryRow extends PureComponent {
  static displayName = "EntitiesList.Entity.TwitterQueryRow";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string,
    t: PropTypes.func
  };

  get projectId() {
    return this.entity.relationships.project.id;
  }

  get entity() {
    return this.props.entity;
  }

  get id() {
    return this.entity.id;
  }

  get name() {
    return this.entity.attributes.query;
  }

  get label() {
    return this.entity.attributes.active
      ? this.props.t("common.active")
      : this.props.t("common.inactive");
  }

  get count() {
    const { eventsCount } = this.entity.attributes;
    if (eventsCount === 0) return this.props.t("projects.social.no_tweets");
    return this.props.t("projects.social.tweets_fetched", {
      count: this.entity.attributes.eventsCount
    });
  }

  get active() {
    return this.props.active === this.id;
  }

  render() {
    return (
      <EntityRow
        {...this.props}
        onRowClick={lh.link(
          "backendProjectSocialTwitterQuery",
          this.projectId,
          this.id
        )}
        rowClickMode="block"
        figureSize={"small"}
        title={this.name}
        meta={this.count}
        label={this.label}
        active={this.active}
      />
    );
  }
}

export default withTranslation()(TwitterQueryRow);
