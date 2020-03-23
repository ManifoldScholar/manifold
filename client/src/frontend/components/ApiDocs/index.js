import React from "react";
import SwaggerUI from "./Loader";
import Layout from "./SwaggerUIComponents/Layout";
import AuthorizeOperationBtn from "./SwaggerUIComponents/AuthorizeOperationBtn";

export default class ApiDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { swaggerUi: null };
    this.plugins = [this.componentReplacementPlugin];
  }

  get componentReplacementPlugin() {
    return swaggerUi => {
      return {
        components: {
          authorizeOperationBtn: this.wrapComponent(AuthorizeOperationBtn, {
            swaggerUi
          }),
          ManifoldLayout: Layout
        }
      };
    };
  }

  onComplete = swaggerUi => {
    this.preAuthorize(swaggerUi);
    this.setState({ swaggerUi });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.authToken !== this.props.authToken) {
      this.preAuthorize(this.state.swaggerUi);
    }
  }

  preAuthorize(swaggerUi) {
    if (!this.props.authToken) return;
    swaggerUi.preauthorizeApiKey("apiKey", this.props.authToken);
  }

  wrapComponent(Component, injectProps) {
    return props => <Component {...props} {...injectProps} />;
  }

  render() {
    return (
      <SwaggerUI
        spec={this.props.schema}
        layout="ManifoldLayout"
        docExpansion="list"
        plugins={this.plugins}
        onComplete={this.onComplete}
      />
    );
  }
}
