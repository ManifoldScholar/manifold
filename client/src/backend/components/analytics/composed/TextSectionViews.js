import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import TextNodeTable from "../parts/TextNodeTable";

export default class TextSectionViews extends Component {
  static displayName = "Analytics.Composed.TextSectionViews";

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

  get toc() {
    const { text } = this.props;
    return text.attributes.toc;
  }

  get rows() {
    return this.toc.map(this.visitTocEntry);
  }

  viewCountForSection(section) {
    const rowData = this.data.find(entry => entry.id === section.id);
    return rowData ? rowData.count : 0;
  }

  visitTocEntry = node => {
    const { children, ...row } = node;
    row.count = this.viewCountForSection(row);
    if (children) {
      row.children = children.map(this.visitTocEntry);
    }
    return row;
  };

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="eyeOpen32"
        title="Most Viewed Projects"
      >
        <TextNodeTable
          headers={["Section Title", "View Count"]}
          rows={this.rows}
        />
      </Block>
    );
  }
}
