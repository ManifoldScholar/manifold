import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Table from "../parts/Table";
import SearchRow from "../parts/SearchRow";

export default class TopSearches extends Component {
  static displayName = "Analytics.Composed.TopSearches";

  static propTypes = {
    withSort: PropTypes.bool,
    data: PropTypes.shape({
      data: PropTypes.array
    })
  };

  static defaultProps = {
    withSort: false
  };

  get data() {
    return this.props.data.data;
  }

  get blockWidth() {
    return this.props.width || 50;
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="search32" title="Top Searches">
        <Table
          rowComponent={SearchRow}
          paginationClickHandler={() => {}}
          headers={["Search Term", "Search Count"]}
          rows={this.data}
        />
      </Block>
    );
  }
}
