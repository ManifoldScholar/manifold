import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import Form from "./Form";

export default class PermissionNew extends PureComponent {
  static displayName = "Permission.New";

  static propTypes = {
    entity: PropTypes.object,
    history: PropTypes.object
  };

  render() {
    return (
      <section>
        <Navigation.DrawerHeader title="Grant Permissions" />
        <Form entity={this.props.entity} history={this.props.history} />
      </section>
    );
  }
}
