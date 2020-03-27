import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entitlementsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import entityUtils from "utils/entityUtils";
import EntitiesList, {
  Button,
  EntitlementRow
} from "backend/components/list/EntitiesList";

const { select } = entityUtils;
const { request } = entityStoreActions;

export class EntitlementsList extends PureComponent {
  static displayName = "Entitlements.List";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    entitlements: PropTypes.array,
    linkName: PropTypes.string,
    dispatch: PropTypes.func,
    match: PropTypes.object
  };

  componentDidMount() {
    const { entity, dispatch } = this.props;

    const options = entitlementsAPI.index(entity, {}, {});

    const action = request(options, requests.beProjectEntitlements);

    dispatch(action);
  }

  render() {
    const { match, entity, entitlements } = this.props;
    const active = match.params.id;
    const listUrl = lh.nameFromType("backend", "Entitlement", entity);
    const newUrl = lh.nameFromType("backend", "EntitlementsNew", entity);

    return (
      <section>
        {entitlements && (
          <EntitiesList
            title="Manage Entitlements"
            titleStyle="section"
            entities={entitlements}
            entityComponent={EntitlementRow}
            entityComponentProps={{
              active,
              linkName: listUrl
            }}
            buttons={[
              <Button
                path={lh.link(newUrl, entity.id)}
                text="Grant new entitlement"
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

  static mapStateToProps(state) {
    return {
      entitlements: select(requests.beProjectEntitlements, state.entityStore)
    };
  }
}

export default connectAndFetch(EntitlementsList);
