import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentSectionsPartsHeader extends PureComponent {
  static displayName = "Project.Content.Sections.Parts.Header";

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.string
  };

  render() {
    return (
      <div>
        {this.props.title ? <h2>{this.props.title}</h2> : null}
        {this.props.children ? (
          <span className="instructions">{this.props.children}</span>
        ) : null}
      </div>
    );
  }
}
