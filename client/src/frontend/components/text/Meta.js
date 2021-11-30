import React, { Component } from "react";
import PropTypes from "prop-types";
import Date from "./Date";
import Counts from "./Counts";
import * as Styled from "./styles";

export default class TextMeta extends Component {
  static displayName = "Text.Meta";

  static propTypes = {
    text: PropTypes.object.isRequired,
    datesVisible: PropTypes.bool,
    datePrefix: PropTypes.string,
    publishedVisible: PropTypes.bool
  };

  get showStatus() {
    return this.props.datesVisible || this.props.publishedVisible;
  }

  render() {
    const text = this.props.text;

    return (
      <Styled.Meta>
        {this.showStatus && (
          <Styled.Status>
            {this.props.datesVisible && (
              <Date
                date={this.props.text.attributes.createdAt}
                datePrefix={this.props.datePrefix}
                inline
              />
            )}
            {this.props.publishedVisible && (
              <Styled.Published>Published</Styled.Published>
            )}
          </Styled.Status>
        )}
        <Counts text={text} />
      </Styled.Meta>
    );
  }
}
