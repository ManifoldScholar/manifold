import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { permissionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import entityUtils from "utils/entityUtils";
import EntitiesList, {
  Button,
  PermissionRow
} from "backend/components/list/EntitiesList";

const { select } = entityUtils;
const { request } = entityStoreActions;

export class PermissionContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      permissions: select(requests.bePermissions, state.entityStore)
    };
  };

  static displayName = "PermissionContainer";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    permissions: PropTypes.array,
    linkName: PropTypes.string,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    t: PropTypes.func
  };

  componentDidMount() {
    const entity = this.props.entity;
    const action = request(
      permissionsAPI.index(entity, {}, {}),
      requests.bePermissions
    );
    this.props.dispatch(action);
  }

  render() {
    const { match, entity, permissions, t } = this.props;
    const active = match.params.id;
    const listUrl = lh.nameFromType("backend", "Permission", entity);
    const newUrl = lh.nameFromType("backend", "PermissionsNew", entity);

    return (
      <section>
        {permissions && (
          <EntitiesList
            title={t("projects.permissions.header")}
            instructions={t("projects.permissions.instructions")}
            titleStyle="section"
            entities={permissions}
            entityComponent={PermissionRow}
            entityComponentProps={{
              active,
              linkName: listUrl
            }}
            buttons={[
              <Button
                path={lh.link(newUrl, entity.id)}
                text={t("projects.permissions.button_label")}
                type="add"
                authorizedTo="createPermissions"
                authorizedFor={entity}
              />
            ]}
          />
        )}
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(PermissionContainer));
