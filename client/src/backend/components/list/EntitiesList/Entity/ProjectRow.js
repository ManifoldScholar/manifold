import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";

export default class EventRow extends PureComponent {
  static displayName = "EntitiesList.Entity.ProjectRow";

  static propTypes = {
    entity: PropTypes.object,
    placeholderMode: PropTypes.string,
    listStyle: PropTypes.oneOf(["rows", "grid"]),
    figure: PropTypes.node
  };

  static defaultProps = {
    placeholderMode: "responsive"
  };

  get figure() {
    if (this.props.figure) return this.props.figure;
    return <EntityThumbnail.Project mode="responsive" entity={this.project} />;
  }

  get project() {
    return this.props.entity;
  }

  get attr() {
    return this.project.attributes;
  }

  get id() {
    return this.project.id;
  }

  get creators() {
    return this.project.relationships.creators || [];
  }

  get creatorNames() {
    return this.creators.map((creator, i) => {
      let nameList = creator.attributes.fullName;
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
        rowClickMode="block"
        listStyle={this.props.listStyle}
        title={
          <span
            dangerouslySetInnerHTML={{ __html: this.attr.titleFormatted }}
          />
        }
        titlePlainText={this.attr.title}
        subtitle={this.attr.subtitle}
        meta={this.creatorNames}
        label={this.label}
        figure={this.figure}
      />
    );
  }
}
