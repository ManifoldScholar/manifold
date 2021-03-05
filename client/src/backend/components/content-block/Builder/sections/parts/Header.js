import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SectionLabel from "global/components/form/SectionLabel";

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
          <SectionLabel label={this.props.title} id={this.props.headerId} />
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
