import React, { Component } from "react";
import PropTypes from "prop-types";
import Item from "global/components/meta/Item";

export default class DOI extends Component {
  static displayName = "Meta.DOI";

  static propTypes = {
    label: PropTypes.string,
    doi: PropTypes.string
  };

  render() {
    const { label, doi } = this.props;
    if (!doi) return null;

    return (
      <Item label={label}>
        <a href={doi} target="_blank" rel="noopener noreferrer">
          {doi}
        </a>
      </Item>
    );
  }
}
