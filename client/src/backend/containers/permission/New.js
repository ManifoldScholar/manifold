import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Permission from "backend/containers/permission";

export default class PermissionNew extends PureComponent {
  static displayName = "Permission.New";

  static propTypes = {
    entity: PropTypes.object,
    history: PropTypes.object
  };

  render() {
    return (
      <section>
        <header className="drawer-header">
          <h2 className="heading-quaternary less-space-bottom">
            Grant Permissions
          </h2>
        </header>
        <Permission.Form
          entity={this.props.entity}
          history={this.props.history}
        />
      </section>
    );
  }
}
