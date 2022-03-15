import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import DOI from "global/components/meta/DOI";
import Item from "global/components/meta/Item";
import endsWith from "lodash/endsWith";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

class List extends Component {
  static displayName = "Meta.List";

  static propTypes = {
    metadata: PropTypes.object,
    level: PropTypes.string,
    map: PropTypes.array,
    sortByLength: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    level: "primary",
    sortByLength: true
  };

  constructor(props) {
    super(props);
    this.state = this.regenerateState(props.metadata);
  }

  get listComponent() {
    return this.props.level === "secondary"
      ? Styled.SecondaryList
      : Styled.PrimaryList;
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
        <Styled.ListItem key={key}>
          <Item label={key}>
            <FormattedDate format="PPP" date={value} />
          </Item>
        </Styled.ListItem>
      );

    return (
      <Styled.ListItem key={key}>
        <Item label={key} value={value} />
      </Styled.ListItem>
    );
  }

  renderDoi() {
    const doi = this.props.metadata.doi;
    if (!doi) return null;

    return (
      <Styled.ListItem key={doi}>
        <DOI label={this.props.t("metadata.doi")} doi={doi} />
      </Styled.ListItem>
    );
  }

  renderList() {
    const useMap = !!this.props.map;
    const { long, short } = this.state;
    const metadata = { ...long, ...short };
    const metadataKeys = useMap
      ? this.props.map
      : Array.from(long, short).sort();
    const ListComponent = this.listComponent;

    return (
      <ListComponent>
        {metadataKeys.map(key => {
          return this.renderValue(key, metadata[key]);
        })}
        {this.renderDoi()}
      </ListComponent>
    );
  }

  renderSortedByLength() {
    const { long, short } = this.state;
    const useMap = !!this.props.map;
    const shortKeys = useMap ? this.props.map : Object.keys(short).sort();
    const longKeys = useMap ? this.props.map : Object.keys(long).sort();
    const ListComponent = this.listComponent;

    return (
      <>
        {!isEmpty(longKeys) && (
          <ListComponent>
            {longKeys.map(key => {
              return this.renderValue(key, long[key]);
            })}
          </ListComponent>
        )}
        {!isEmpty(shortKeys) && (
          <ListComponent $columnar>
            {shortKeys.map(key => {
              return this.renderValue(key, short[key]);
            })}
            {this.renderDoi()}
          </ListComponent>
        )}
      </>
    );
  }

  render() {
    if (!this.props.sortByLength) return this.renderList();
    return this.renderSortedByLength();
  }
}

export default withTranslation()(List);
