import React, { Component } from "react";

export default class GroupsContainer extends Component {
  get containerClassNames() {
    return "container";
  }

  render() {
    return <div classeName={this.containerClassNames}>Table of all groups</div>;
  }
}
