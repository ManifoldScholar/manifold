import React, { PureComponent } from "react";
import Search from "global/components/search";

export default class MobileSearch extends PureComponent {
  render() {
    return (
      <Search.Menu.Body searchType={"frontend"} visibility={{ search: true }} />
    );
  }
}
