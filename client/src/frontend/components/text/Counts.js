import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Utility from "global/components/utility";
import * as Styled from "./styles";

class TextCounts extends Component {
  static displayName = "Text.Counts";

  static propTypes = {
    text: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  get annotationsCount() {
    return this.props.text.attributes.annotationsCount;
  }

  get highlightsCount() {
    return this.props.text.attributes.highlightsCount;
  }

  render() {
    const t = this.props.t;

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
            {t("counts.text_annotations", { count: this.annotationsCount })}
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
            {t("counts.text_highlights", { count: this.highlightsCount })}
          </span>
        </Styled.Interaction>
      </Styled.InteractionList>
    );
  }
}

export default withTranslation()(TextCounts);
