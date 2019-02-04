import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Cover from "frontend/components/project/Cover";

export default class ProjectHeroCover extends PureComponent {
  static displayName = "ProjectHero.Cover";

  static propTypes = {
    blockClass: PropTypes.string,
    project: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className={`${this.props.blockClass}__cover-block`}>
        <figure className={`${this.props.blockClass}__figure`}>
          <Cover project={this.props.project} />
        </figure>
      </div>
    );
  }
}
