import React, { PureComponent } from "react";
import { BackLinkContext } from "helpers/contexts";

export default class BackLinkProvider extends PureComponent {
  static contextType = BackLinkContext;

  constructor(props) {
    super(props);

    this.state = {
      backLink: null
    };
  }

  setBackLink = backLink => {
    this.setState({ backLink });
  };

  get contextValue() {
    return {
      setBackLink: this.setBackLink,
      backLink: this.state.backLink
    };
  }

  render() {
    return (
      <BackLinkContext.Provider value={this.contextValue}>
        {this.props.children}
      </BackLinkContext.Provider>
    );
  }
}
