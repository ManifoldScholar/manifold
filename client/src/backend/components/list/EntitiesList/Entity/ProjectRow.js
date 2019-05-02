import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import FormattedDate from "global/components/FormattedDate";
import EntityRow from "./Row";

export default class ProjectRow extends PureComponent {
  static displayName = "EntitiesList.Entity.ProjectRow";

  static propTypes = {
    entity: PropTypes.object,
    placeholderMode: PropTypes.string,
    listStyle: PropTypes.oneOf(["rows", "grid"]),
    figure: PropTypes.node,
    compact: PropTypes.bool
  };

  static defaultProps = {
    placeholderMode: "responsive",
    compact: false
  };

  get figure() {
    if (this.compact) return null;
    if (this.props.figure) return this.props.figure;
    return (
      <EntityThumbnail.Project
        mode={this.props.placeholderMode}
        entity={this.project}
      />
    );
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

  get compact() {
    return this.props.compact;
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
      this.project.attributes.abilities &&
      (this.project.attributes.abilities.update === true ||
        this.project.attributes.abilities.manageResources === true)
    ) {
      return lh.link("backendProject", this.id);
    }
    return lh.link("frontendProject", this.id);
  }

  get label() {
    const labels = [];
    if (this.attr.draft) labels.push("Draft");
    if (this.attr.featured) labels.push("Featured");
    return labels;
  }

  get meta() {
    if (!this.compact) return this.creatorNames;
    return <FormattedDate prefix="Updated" date={this.attr.updatedAt} />;
  }

  get subtitle() {
    if (this.compact) return null;
    return this.attr.subtitle;
  }

  render() {
    return (
      <EntityRow
        {...this.props}
        onRowClick={this.url}
        rowClickMode="block"
        listStyle={this.props.listStyle}
        title={
          <span
            dangerouslySetInnerHTML={{ __html: this.attr.titleFormatted }}
          />
        }
        titlePlainText={this.attr.title}
        subtitle={this.subtitle}
        meta={this.meta}
        label={this.label}
        figure={this.figure}
      />
    );
  }
}
