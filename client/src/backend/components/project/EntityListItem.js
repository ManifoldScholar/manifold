import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import { EntityRow } from "backend/components/list/EntitiesList";

export default class ProjectListItem extends PureComponent {
  static displayName = "Project.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    placeholderMode: PropTypes.string,
    listStyle: PropTypes.oneOf(["rows", "grid"])
  };

  static defaultProps = {
    placeholderMode: "responsive"
  };

  get project() {
    return this.props.entity;
  }

  get attr() {
    return this.project.attributes;
  }

  get id() {
    return this.project.id;
  }

  get makers() {
    return this.project.relationships.makers;
  }

  get makerNames() {
    return this.makers.map((maker, i) => {
      let nameList = maker.attributes.fullName;
      if (i > 0) nameList = ", " + nameList;
      return nameList;
    });
  }

  get url() {
    if (
      this.project.attributes.abilities.update === true ||
      this.project.attributes.abilities.manageResources === true
    ) {
      return lh.link("backendProject", this.id);
    }
    return lh.link("frontendProject", this.id);
  }

  get label() {
    if (this.attr.draft) return "Draft";
  }

  render() {
    return (
      <EntityRow
        onRowClick={this.url}
        listStyle={this.props.listStyle}
        title={
          <span
            dangerouslySetInnerHTML={{ __html: this.attr.titleFormatted }}
          />
        }
        titlePlainText={this.attr.title}
        subtitle={this.attr.subtitle}
        meta={this.makerNames}
        label={this.label}
        figure={<EntityThumbnail.Project mode="small" entity={this.project} />}
      />
    );
  }
}
