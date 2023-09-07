import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { makersAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import withFilteredLists, { makerFilters } from "hoc/withFilteredLists";

import EntitiesList, {
  Search,
  Button,
  MakerRow
} from "backend/components/list/EntitiesList";

const { request } = entityStoreActions;
const perPage = 10;

class MakersListContainerImplementation extends PureComponent {
  static mapStateToProps = state => {
    return {
      makers: select(requests.beMakers, state.entityStore),
      makersMeta: meta(requests.beMakers, state.entityStore)
    };
  };

  static displayName = "Makers.List";

  static propTypes = {
    makers: PropTypes.array,
    makersMeta: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    route: PropTypes.object,
    entitiesListSearchProps: PropTypes.func.isRequired,
    entitiesListSearchParams: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.lastFetchedPage = null;
    this.fetchMakers = debounce(this.fetchMakers, 250, {
      leading: false,
      trailing: true
    });
  }

  componentDidMount() {
    this.fetchMakers();
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchMakers();
    if (this.makerWasModified(prevProps))
      return this.fetchMakers(this.lastFetchedPage);
  }

  makerWasModified(prevProps) {
    const currentModified = get(this.props, "makersMeta.modified");
    const previousModified = get(prevProps, "makersMeta.modified");
    if (!currentModified) return false;
    return !(currentModified && previousModified);
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  fetchMakers = (page = 1) => {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const filterParams = this.props.entitiesListSearchParams.makers;
    const action = request(
      makersAPI.index(filterParams, pagination),
      requests.beMakers
    );
    this.props.dispatch(action);
  };

  handlePageChange(event, page) {
    this.fetchMakers(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handlePageChange(event, page);
    };
  };

  render() {
    const { makers, makersMeta, match, t } = this.props;
    if (!makers) return null;
    const active = match.params.id;

    const drawerProps = {
      closeUrl: lh.link("backendRecordsMakers"),
      lockScroll: "always"
    };

    const refetch = () =>
      this.fetchMakers(makersMeta?.pagination?.currentPage ?? 1);

    return (
      <>
        {childRoutes(this.props.route, {
          drawer: true,
          drawerProps,
          childProps: { refetch }
        })}
        {makers && (
          <EntitiesList
            title={t("records.makers.header")}
            titleStyle="bar"
            buttons={[
              <Button
                path={lh.link("backendRecordsMakersNew")}
                text={t("records.makers.button_label")}
                type="add"
                authorizedFor="maker"
              />
            ]}
            search={
              <Search {...this.props.entitiesListSearchProps("makers")} />
            }
            entities={makers}
            entityComponent={MakerRow}
            entityComponentProps={{ active }}
            pagination={makersMeta.pagination}
            showCount
            unit={t("glossary.maker", {
              count: makersMeta.pagination.totalCount
            })}
            callbacks={{
              onPageClick: this.pageChangeHandlerCreator
            }}
          />
        )}
      </>
    );
  }
}

export const MakersListContainer = withFilteredLists(
  MakersListContainerImplementation,
  {
    makers: makerFilters()
  }
);
export default withTranslation()(
  connect(MakersListContainer.mapStateToProps)(MakersListContainer)
);
