import React, { Component } from "react";
import PropTypes from "prop-types";
import Text from "frontend/components/text/Text";
import * as Styled from "./styles";

export default class TextList extends Component {
  static displayName = "Text.List";

  static propTypes = {
    texts: PropTypes.array.isRequired,
    label: PropTypes.string,
    showAuthors: PropTypes.bool,
    showCovers: PropTypes.bool,
    showDates: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool,
    onUncollect: PropTypes.func
  };

  static defaultProps = {
    showCollectingToggle: true
  };

  get texts() {
    return this.props.texts;
  }

  get utilityPosition() {
    return this.props.showAuthors || this.props.showDescriptions
      ? "meta"
      : "content";
  }

  render() {
    if (!this.texts || this.texts.length === 0) return null;

    return (
      <Styled.Category>
        {this.props.label && (
          <Styled.CategoryHeading>{this.props.label}</Styled.CategoryHeading>
        )}
        <Styled.List>
          {this.texts.map(text => {
            return (
              <li key={text.id}>
                <Text
                  text={text}
                  showAuthors={this.props.showAuthors}
                  showCovers={this.props.showCovers}
                  showDates={this.props.showDates}
                  showDescriptions={this.props.showDescriptions}
                  showSubtitles={this.props.showSubtitles}
                  onUncollect={this.props.onUncollect}
                  utilityPosition={this.utilityPosition}
                />
              </li>
            );
          })}
        </Styled.List>
      </Styled.Category>
    );
  }
}
