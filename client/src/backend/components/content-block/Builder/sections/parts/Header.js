import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentSectionsPartsHeader extends PureComponent {
  static displayName = "Project.Content.Sections.Parts.Header";

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.string,
    subtitle: PropTypes.string,
    headerId: PropTypes.string,
    instructionsId: PropTypes.string
  };

  render() {
    return (
      <>
        {this.props.title && (
          <header className="form-section-label">
            <h2 id={this.props.headerId}>{this.props.title}</h2>
          </header>
        )}
        {this.props.children && (
          <span id={this.props.instructionsId} className="instructions">
            {this.props.children}
          </span>
        )}
        {this.props.subtitle && (
          <header className="form-subsection-label">
            <h3>{this.props.subtitle}</h3>
          </header>
        )}
      </>
    );
  }
}
