import React, { PureComponent } from "react";
import PropTypes from "prop-types";

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

  get description() {
    return this.props.project.attributes.descriptionFormatted;
  }

  renderMaker(maker) {
    return <span>{maker.attributes.fullName}</span>;
  }

  renderMakerList(makers, label, elementClass) {
    const blockClass = this.props.blockClass;
    // const linkClass = `${blockClass}__link-inline`;
    const linkClass = "";

    return (
      <div className={`${blockClass}__${elementClass}`}>
        <span style={{ fontStyle: "italic" }}>{label}</span>
        {makers
          .map(maker => (
            <span key={maker.id} className={linkClass}>
              {maker.attributes.fullName}
            </span>
          ))
          .reduce((prev, curr) => [prev, ", ", curr])}
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
        {this.creators &&
          this.renderMakerList(this.creators, "by ", "creators")}
        {this.contributors &&
          this.renderMakerList(
            this.contributors,
            "Contributors: ",
            "contributors"
          )}
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
