import React, { Component } from "react";
import UpdateForm from "./UpdateForm";

export default class CreateUpdate extends Component {
  render() {
    return <UpdateForm mode="new" {...this.props} />;
  }
}
