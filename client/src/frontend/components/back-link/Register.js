import React, { PureComponent } from "react";
import { BackLinkContext } from "helpers/contexts";

export default class BackLinkRegister extends PureComponent {
  static contextType = BackLinkContext;

  componentDidMount() {
    this.context.setBackLink(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.context.setBackLink(this.props);
  }

  componentWillUnmount() {
    this.context.setBackLink(null);
  }

  render() {
    return null;
  }
}
