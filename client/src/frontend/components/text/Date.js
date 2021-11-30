import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default class TextDate extends Component {
  static displayName = "Text.Date";

  static propTypes = {
    date: PropTypes.string.isRequired,
    datePrefix: PropTypes.string,
    inline: PropTypes.bool
  };

  render() {
    return (
      <Styled.Date>
        <FormattedDate
          prefix={this.props.datePrefix}
          format="MMMM yyyy"
          date={this.props.date}
        />
      </Styled.Date>
    );
  }
}
