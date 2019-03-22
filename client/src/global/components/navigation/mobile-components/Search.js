import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SearchMenu from "global/components/search/menu";

export default class MobileSearch extends PureComponent {
  static propTypes = {
    closeNavigation: PropTypes.func
  };

  render() {
    return (
      <SearchMenu.Body
        onSubmit={this.props.closeNavigation}
        searchType={"frontend"}
        visibility={{ search: true }}
      />
    );
  }
}
