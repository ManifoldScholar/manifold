import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Permission } from "containers/backend";
import { Dialog } from "components/backend";
import { permissionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import { select } from "utils/entityUtils";

const { request, flush } = entityStoreActions;

export class PermissionEdit extends PureComponent {
  static displayName = "Permission.Edit";

  static mapStateToProps = state => {
    return {
      permission: select(requests.bePermission, state.entityStore)
    };
  };

  static propTypes = {
    entity: PropTypes.object,
    permission: PropTypes.object,
    match: PropTypes.object,
    dispatch: PropTypes.func,
    closeUrl: PropTypes.string.isRequired,
    history: PropTypes.object
  };

  constructor() {
    super();
    this.state = { confirmation: null };
  }

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

  handleRemoveAll(event, permission) {
    const heading =
      "Are you sure you want to remove all permissions from this user?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.removeAllPermissions(permission);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  removeAllPermissions(permission) {
    event.preventDefault();
    const entity = this.props.entity;
    const options = { removes: permission };
    const action = request(
      permissionsAPI.destroy(entity, permission.id),
      requests.bePermissionDestroy,
      options
    );
    this.props.dispatch(action).promise.then(() => {
      this.props.history.push(this.props.closeUrl);
    });
  }

  render() {
    const permission = this.props.permission;
    if (!permission) return null;

    return (
      <section>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        <header className="drawer-header">
          <h2 className="heading-quaternary">Edit Permissions</h2>
          <div className="buttons-bare-vertical">
            <button
              className="button-bare-primary"
              onClick={event => {
                this.handleRemoveAll(event, permission);
              }}
            >
              {"Remove All Permissions"}
              <i className="manicon manicon-trashcan" aria-hidden="true" />
            </button>
          </div>
        </header>
        <Permission.Form
          entity={this.props.entity}
          permission={permission}
          history={this.props.history}
          showUserInput
        />
      </section>
    );
  }
}

export default connectAndFetch(PermissionEdit);
