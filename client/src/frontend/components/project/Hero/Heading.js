import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ProjectHeroHeading extends PureComponent {
  static displayName = "ProjectHero.Heading";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  get showTitle() {
    return this.props.project.attributes.titleFormatted;
  }

  get title() {
    return this.props.project.attributes.titleFormatted;
  }

  get showSubtitle() {
    return this.props.project.attributes.titleFormatted;
  }

  get subtitle() {
    return this.props.project.attributes.subtitleFormatted;
  }

  get headerClasses() {
    return classNames({
      "project-hero__heading": true
    });
  }

  get innerClasses() {
    return classNames({
      "project-hero__heading-inner": true
    });
  }

  get titleClasses() {
    return classNames({
      "project-hero__title": true
    });
  }

  get subtitleClasses() {
    return classNames({
      "project-hero__subtitle": true
    });
  }

  render() {
    if (!this.showTitle && !this.showSubtitle) return null;

    return (
      <header className={this.headerClasses}>
        <div className={this.innerClasses}>
          {this.showTitle && (
            <h1
              className={this.titleClasses}
              dangerouslySetInnerHTML={{ __html: this.title }}
            />
          )}
          {this.showSubtitle && (
            <div
              className={this.subtitleClasses}
              dangerouslySetInnerHTML={{ __html: this.subtitle }}
            />
          )}
        </div>
      </header>
    );
  }
}
