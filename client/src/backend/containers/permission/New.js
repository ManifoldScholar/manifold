import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "./Form";
import Navigation from "backend/components/navigation";

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
