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
    const { label, doi } = this.props;
    if (!doi) return null;

    return (
      <Meta.Item label={label}>
        <a href={doi} target="_blank">
          {doi}
        </a>
      </Meta.Item>
    );
  }
}
