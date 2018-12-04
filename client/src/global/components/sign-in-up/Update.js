import React, { Component } from "react";
import UpdateForm from "./UpdateForm";

export default class Update extends Component {
  render() {
    return <UpdateForm mode="existing" {...this.props} />;
  }
}
