import React, { Component } from "react";
import PropTypes from "prop-types";
import DOI from "global/components/meta/DOI";
import Item from "global/components/meta/Item";
import endsWith from "lodash/endsWith";
import FormattedDate from "global/components/formatted-date";

export default class List extends Component {
  static displayName = "Meta.List";

  static propTypes = {
    metadata: PropTypes.object,
    level: PropTypes.string,
    map: PropTypes.array,
    sortByLength: PropTypes.bool
  };

  static defaultProps = {
    level: "primary",
    sortByLength: true
  };

  constructor(props) {
    super(props);
    this.state = this.regenerateState(props.metadata);
  }

  regenerateState(metadata) {
    const long = {};
    const short = {};

    Object.keys(metadata).forEach(key => {
      const value = metadata[key];
      if (endsWith(key.toLowerCase(), "doi")) return null;
      if (value.length > 280) return (long[key] = value);
      return (short[key] = value);
    });

    return {
      long,
      short
    };
  }

  renderValue(key, value) {
    if (!value) return null;
    const dateValues = ["updatedAt", "updatedOn", "createdAt", "createdOn"]; // TODO: Improve date checking, regex?

    if (dateValues.includes(key))
      return (
        <li key={key}>
          <Item label={key}>
            <FormattedDate format="MMMM DD, YYYY" date={value} />
          </Item>
        </li>
      );

    return (
      <li key={key}>
        <Item label={key} value={value} />
      </li>
    );
  }

  renderDoi() {
    const doi = this.props.metadata.doi;
    if (!doi) return null;

    return (
      <li key={doi}>
        <DOI label={"doi"} doi={doi} />
      </li>
    );
  }

  renderList() {
    const useMap = !!this.props.map;
    const { long, short } = this.state;
    const metadata = Object.assign({}, long, short);
    const metadataKeys = useMap
      ? this.props.map
      : Array.from(long, short).sort();

    return (
      <ul className={`meta-list-${this.props.level}`}>
        {metadataKeys.map(key => {
          return this.renderValue(key, metadata[key]);
        })}
        {this.renderDoi()}
      </ul>
    );
  }

  renderSortedByLength() {
    const { long, short } = this.state;
    const useMap = !!this.props.map;
    const shortKeys = useMap ? this.props.map : Object.keys(short).sort();
    const longKeys = useMap ? this.props.map : Object.keys(long).sort();

    return (
      <React.Fragment>
        <ul className={`meta-list-${this.props.level}`}>
          {longKeys.map(key => {
            return this.renderValue(key, long[key]);
          })}
        </ul>
        <ul className={`meta-list-${this.props.level} columnar`}>
          {shortKeys.map(key => {
            return this.renderValue(key, short[key]);
          })}
          {this.renderDoi()}
        </ul>
      </React.Fragment>
    );
  }

  render() {
    if (!this.props.sortByLength) return this.renderList();
    return this.renderSortedByLength();
  }
}
