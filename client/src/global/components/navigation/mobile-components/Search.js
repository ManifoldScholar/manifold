import React, { PureComponent } from "react";
import SearchMenu from "global/components/search/menu";

export default class MobileSearch extends PureComponent {
  render() {
    return (
      <SearchMenu.Body searchType={"frontend"} visibility={{ search: true }} />
    );
  }
}
