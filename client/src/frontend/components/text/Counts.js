import React, { Component } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default class TextCounts extends Component {
  static displayName = "Text.Counts";

  static propTypes = {
    text: PropTypes.object.isRequired
  };

  get annotationsCount() {
    return this.props.text.attributes.annotationsCount;
  }

  get highlightsCount() {
    return this.props.text.attributes.highlightsCount;
  }

  render() {
    return (
      <Styled.InteractionList>
        <Styled.Interaction>
          <Utility.IconComposer size={32} icon="interactAnnotate32" />
          <Styled.InteractionLabel
            aria-hidden
            className={`${this.props.baseClass}__interaction-label`}
          >
            {this.annotationsCount}
          </Styled.InteractionLabel>
          <span className="screen-reader-text">
            This text has {this.annotationsCount} annotations
          </span>
        </Styled.Interaction>
        <Styled.Interaction>
          <Utility.IconComposer size={32} icon="interactHighlight32" />
          <Styled.InteractionLabel
            aria-hidden
            className={`${this.props.baseClass}__interaction-label`}
          >
            {this.highlightsCount}
          </Styled.InteractionLabel>
          <span className="screen-reader-text">
            This text has {this.highlightsCount} highlights
          </span>
        </Styled.Interaction>
      </Styled.InteractionList>
    );
  }
}
