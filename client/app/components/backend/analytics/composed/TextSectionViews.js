import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import TextNodeTable from "../parts/TextNodeTable";
import { withTranslation } from "react-i18next";

class TextSectionViews extends Component {
  static displayName = "Analytics.Composed.TextSectionViews";

  static propTypes = {
    withSort: PropTypes.bool,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    t: PropTypes.func
  };

  static defaultProps = {
    withSort: false
  };

  get data() {
    return this.props.data;
  }

  get blockWidth() {
    return this.props.width || 50;
  }

  get toc() {
    const { text } = this.props;
    return text.attributes.toc;
  }

  get slug() {
    const { text } = this.props;
    return text.attributes.slug;
  }

  get rows() {
    return this.toc.map(this.visitTocEntry);
  }

  viewCountForSection(section) {
    const rowData = Array.isArray(this.data)
      ? this.data.find(entry => entry.id === section.id)
      : null;
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
        title={this.props.t("analytics.text_section_views")}
      >
        <TextNodeTable
          headers={[
            this.props.t("analytics.section_title"),
            this.props.t("analytics.view_count")
          ]}
          rows={this.rows}
          slug={this.slug}
        />
      </Block>
    );
  }
}

export default withTranslation()(TextSectionViews);
