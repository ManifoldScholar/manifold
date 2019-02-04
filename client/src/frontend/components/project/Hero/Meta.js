import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import some from "lodash/some";
import isEmpty from "lodash/isEmpty";
import Maker from "frontend/components/maker";

export default class ProjectHeroMeta extends PureComponent {
  static displayName = "ProjectHero.Meta";

  static propTypes = {
    blockClass: PropTypes.string,
    project: PropTypes.object.isRequired
  };

  get title() {
    return this.props.project.attributes.titleFormatted;
  }

  get subtitle() {
    return this.props.project.attributes.subtitleFormatted;
  }

  get creators() {
    const creators = this.props.project.relationships.creators;

    if (!creators || creators.length === 0) return null;

    return creators;
  }

  get contributors() {
    const contributors = this.props.project.relationships.contributors;

    if (!contributors || contributors.length === 0) return null;

    return contributors;
  }

  get hasAvatars() {
    return !some(this.creators, c =>
      isEmpty(c.attributes.avatarStyles.smallSquare)
    );
  }

  get showAvatars() {
    return this.creators && this.creators.length <= 2 && this.hasAvatars;
  }

  get description() {
    return this.props.project.attributes.descriptionFormatted;
  }

  renderCreator(creator, itemClass) {
    if (this.showAvatars) {
      return <Maker.Avatar key={creator.id} maker={creator} />;
    }

    return (
      <span key={creator.id} className={itemClass}>
        {creator.attributes.fullName}
      </span>
    );
  }

  renderCreatorList(blockClass) {
    const itemClass = `${blockClass}__maker-text ${blockClass}__link-inline`;

    return (
      <div className={`${blockClass}__creators`}>
        {!this.showAvatars && <span style={{ fontStyle: "italic" }}>by </span>}
        {this.creators
          .map(creator => this.renderCreator(creator, itemClass))
          .reduce((prev, curr) => [prev, curr])}
      </div>
    );
  }

  renderContributorList(blockClass) {
    const itemClass = `${blockClass}__maker-text ${blockClass}__link-inline`;

    return (
      <div className={`${blockClass}__contributors`}>
        <span style={{ fontStyle: "italic" }}>Contributors: </span>
        {this.contributors
          .map(contributor => (
            <span key={contributor.id} className={itemClass}>
              {contributor.attributes.fullName}
            </span>
          ))
          .reduce((prev, curr) => [prev, curr])}
      </div>
    );
  }

  render() {
    const blockClass = this.props.blockClass;
    return (
      <div className={`${blockClass}__meta-block`}>
        <header className={`${blockClass}__heading`}>
          {this.title && (
            <h1
              className={`${blockClass}__title`}
              dangerouslySetInnerHTML={{ __html: this.title }}
            />
          )}
          {this.subtitle && (
            <div
              className={`${blockClass}__subtitle`}
              dangerouslySetInnerHTML={{ __html: this.subtitle }}
            />
          )}
        </header>
        {this.creators && this.renderCreatorList(blockClass)}
        {this.contributors && this.renderContributorList(blockClass)}
        {this.description && (
          <div
            className={`${blockClass}__description`}
            dangerouslySetInnerHTML={{ __html: this.description }}
          />
        )}
      </div>
    );
  }
}
