import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Table from "../parts/Table";
import SearchRow from "../parts/SearchRow";
import lh from "helpers/linkHandler";
import { withTranslation } from "react-i18next";

class TopSearches extends Component {
  static displayName = "Analytics.Composed.TopSearches";

  static propTypes = {
    withSort: PropTypes.bool,
    withAllLink: PropTypes.bool,
    data: PropTypes.array,
    pagination: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    withSort: false,
    withAllLink: false
  };

  get data() {
    return this.props.data;
  }

  get blockWidth() {
    return this.props.width || 50;
  }

  render() {
    const { pagination, paginationClickHandler, withAllLink } = this.props;

    return (
      <Block
        width={this.blockWidth}
        icon="search32"
        title={this.props.t("analytics.top_searches")}
      >
        <Table
          rowComponent={SearchRow}
          headers={[
            this.props.t("analytics.search_term"),
            this.props.t("analytics.search_count")
          ]}
          rows={this.data}
          paginationClickHandler={paginationClickHandler}
          pagination={pagination}
          allLink={withAllLink ? lh.link("backendAnalyticsTopSearches") : null}
        />
      </Block>
    );
  }
}

export default withTranslation()(TopSearches);
