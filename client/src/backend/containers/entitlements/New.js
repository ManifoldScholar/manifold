import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "./Form";
import Navigation from "backend/components/navigation";

export default class EntitlementNew extends PureComponent {
  static displayName = "Entitlements.New";

  static propTypes = {
    entity: PropTypes.object,
    history: PropTypes.object
  };

  render() {
    return (
      <section>
        <Navigation.DrawerHeader title="Grant Entitlements" />
        <Form
          entity={this.props.entity}
          redirectAfterSuccess={this.props.closeUrl}
        />
      </section>
    );
  }
}
