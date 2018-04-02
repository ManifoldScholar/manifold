import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meta } from "components/global";

export default class DOI extends Component {
  static displayName = "Meta.DOI";

  static propTypes = {
    label: PropTypes.string,
    doi: PropTypes.string
  };

  render() {
    const doiBase = "https://doi.org/10.";
    const { label, doi } = this.props;
    if (!doi) return null;

    const url = `${doiBase}${doi}`;

    return (
      <Meta.Item label={label}>
        <a href={url} target="_blank">
          {url}
        </a>
      </Meta.Item>
    );
  }
}
