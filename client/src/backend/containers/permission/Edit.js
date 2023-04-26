import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "./Form";
import { permissionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import { select } from "utils/entityUtils";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";

const { request, flush } = entityStoreActions;

export class PermissionEdit extends PureComponent {
  static mapStateToProps = state => {
    return {
      permission: select(requests.bePermission, state.entityStore)
    };
  };

  static displayName = "Permission.Edit";

  static propTypes = {
    entity: PropTypes.object,
    permission: PropTypes.object,
    match: PropTypes.object,
    dispatch: PropTypes.func,
    closeUrl: PropTypes.string.isRequired,
    history: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchPermission(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchPermission(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.bePermission));
  }

  fetchPermission(id) {
    const entity = this.props.entity;
    const action = request(
      permissionsAPI.show(entity, id),
      requests.bePermission
    );
    this.props.dispatch(action);
  }

  handleRemoveAll = () => {
    const t = this.props.t;
    const heading = t("modals.delete_permissions");
    const message = t("modals.confirm_body");
    this.props.confirm(heading, message, this.removeAllPermissions);
  };

  removeAllPermissions = () => {
    event.preventDefault();
    const entity = this.props.entity;
    const permission = this.props.permission;
    const options = { removes: permission };
    const action = request(
      permissionsAPI.destroy(entity, permission.id),
      requests.bePermissionDestroy,
      options
    );
    this.props.dispatch(action).promise.then(() => {
      this.props.history.push(this.props.closeUrl);
    });
  };

  render() {
    const { permission, t } = this.props;
    if (!permission) return null;
    return (
      <section>
        <Layout.DrawerHeader
          title={t("projects.permissions.edit_header")}
          buttons={[
            {
              onClick: this.handleRemoveAll,
              icon: "delete32",
              label: t("actions.delete"),
              className: "utility-button__icon--notice"
            }
          ]}
        />
        <Form
          entity={this.props.entity}
          permission={permission}
          history={this.props.history}
          showUserInput
        />
      </section>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(PermissionEdit))
);
