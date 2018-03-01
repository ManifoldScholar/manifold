import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { List, Permission } from "components/backend";
import { HigherOrder } from "containers/global";
import connectAndFetch from "utils/connectAndFetch";
import { permissionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import entityUtils from "utils/entityUtils";

const { select } = entityUtils;
const { request } = entityStoreActions;

export class PermissionContainer extends PureComponent {
  static displayName = "PermissionContainer";

  static mapStateToProps = state => {
    return {
      permissions: select(requests.bePermissions, state.entityStore)
    };
  };

  static propTypes = {
    entity: PropTypes.object.isRequired,
    permissions: PropTypes.array,
    linkName: PropTypes.string,
    dispatch: PropTypes.func,
    match: PropTypes.object
  };

  componentWillMount() {
    const entity = this.props.entity;
    const action = request(
      permissionsAPI.index(entity, {}, {}),
      requests.bePermissions
    );
    this.props.dispatch(action);
  }

  render() {
    const { match, entity, permissions } = this.props;
    const active = match.params.id;
    const listUrl = lh.nameFromType("backend", "Permission", entity);
    const newUrl = lh.nameFromType("backend", "PermissionsNew", entity);

    return (
      <section>
        <nav className="vertical-list-primary flush">
          {permissions ? (
            <List.SimpleList
              entities={permissions}
              entityComponent={Permission.ListItem}
              entityComponentProps={{
                active,
                linkName: listUrl
              }}
            />
          ) : null}
          <HigherOrder.Authorize entity={entity} ability="updatePermissions">
            <div className="buttons-icon-horizontal">
              <Link
                to={lh.link(newUrl, entity.id)}
                className="button-icon-secondary"
              >
                <i className="manicon manicon-plus" />
                Add New Permissions
              </Link>
            </div>
          </HigherOrder.Authorize>
        </nav>
      </section>
    );
  }
}

export default connectAndFetch(PermissionContainer);
