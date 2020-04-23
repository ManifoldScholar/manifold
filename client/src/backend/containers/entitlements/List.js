import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entitlementsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import entityUtils from "utils/entityUtils";
import EntitiesList, {
  Button,
  Search,
  EntitlementRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { keywordFilter } from "hoc/with-filtered-lists";

const { select, meta } = entityUtils;
const { request } = entityStoreActions;

const PER_PAGE = 20;

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
    this.fetchEntitlements();
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchEntitlements();
  }

  get filters() {
    return this.props.entitiesListSearchParams.entitlements || {};
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  fetchEntitlements = (page = 1) => {
    const { entity, dispatch } = this.props;
    const pagination = { number: page, size: PER_PAGE };
    const options = entitlementsAPI.index(entity, this.filters, pagination);

    const action = request(options, requests.beProjectEntitlements);

    dispatch(action);
  };

  onDelete = entitlement => {
    const { dispatch } = this.props;

    const options = entitlementsAPI.destroy(entitlement.id);

    const action = request(options, requests.beProjectEntitlementDestroy, {
      refreshes: requests.beProjectEntitlements
    });

    dispatch(action);
  };

  updateHandlerCreator = page => {
    return eventIgnored => {
      this.fetchEntitlements(page);
    };
  };

  render() {
    const {
      match,
      entity,
      entitlements,
      entitlementsMeta,
      preList
    } = this.props;
    const active = match.params.id;
    const listUrl = lh.nameFromType("backend", "Entitlement", entity);
    const newUrl = lh.nameFromType("backend", "EntitlementsNew", entity);
    return (
      <section>
        {entitlements && (
          <EntitiesList
            title="Project Entitlements"
            instructions="Entitlements give users and/or reading groups access to this
                project. In Manifold, all projects are open by default. Configure access
                restrictions, below, and enable restrictions to limit access to your
                project."
            preList={preList}
            titleStyle="section"
            entities={entitlements}
            entityComponent={EntitlementRow}
            entityComponentProps={{
              active,
              linkName: listUrl,
              onDelete: this.onDelete
            }}
            showCount
            paginationStyle="normal"
            pagination={entitlementsMeta.pagination}
            unit="entitlement"
            callbacks={{ onPageClick: this.updateHandlerCreator }}
            buttons={[
              <Button
                path={lh.link(newUrl, entity.id)}
                text="Create entitlement"
                type="add"
                authorizedTo="createEntitlements"
                authorizedFor={entity}
              />
            ]}
            search={
              <Search {...this.props.entitiesListSearchProps("entitlements")} />
            }
          />
        )}
      </section>
    );
  }

  static mapStateToProps(state) {
    return {
      entitlements: select(requests.beProjectEntitlements, state.entityStore),
      entitlementsMeta: meta(requests.beProjectEntitlements, state.entityStore)
    };
  }
}

export default connectAndFetch(
  withFilteredLists(EntitlementsList, {
    entitlements: keywordFilter()
  })
);
