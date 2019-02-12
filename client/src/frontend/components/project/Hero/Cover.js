import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Project from "global/components/project";
import classNames from "classnames";

export default class ProjectHeroCover extends PureComponent {
  static displayName = "ProjectHero.Cover";

  static propTypes = {
    blockClass: PropTypes.string,
    project: PropTypes.object.isRequired
  };

  static defaultProps = {
    baseClass: "project-hero"
  };

  get hasCover() {
    return !!this.cover;
  }

  get cover() {
    return this.props.project.attributes.coverStyles.medium;
  }

  render() {
    const figureClassNames = classNames(`${this.props.blockClass}__figure`, {
      [`${this.props.blockClass}__figure--constrained`]: !this.hasCover
    });

    return (
      <div className={`${this.props.blockClass}__cover-block`}>
        <figure className={figureClassNames}>
          {this.hasCover ? (
            <img src={this.cover} alt="Project Hero Cover" />
          ) : (
            <Project.Avatar project={this.props.project} />
          )}
        </figure>
      </div>
    );
  }
}
