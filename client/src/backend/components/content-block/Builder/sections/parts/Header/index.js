import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SectionLabel from "global/components/form/SectionLabel";
import * as Styled from "./styles";

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
          <Styled.SubtitleHeader className="form-subsection-label">
            <Styled.Subtitle>{this.props.subtitle}</Styled.Subtitle>
          </Styled.SubtitleHeader>
        )}
      </>
    );
  }
}
