import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { makersAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Search,
  Button,
  MakerRow
} from "backend/components/list/EntitiesList";

const { request } = entityStoreActions;
const perPage = 10;

export class MakersListContainer extends PureComponent {
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
    route: PropTypes.object
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
    this.fetchMakers(1);
  }

  componentDidUpdate(prevProps) {
    this.maybeReload(prevProps.makersMeta);
  }

  get defaultFilter() {
    return { order: "last_name" };
  }

  maybeReload(prevUsersMeta) {
    const currentModified = get(this.props, "makersMeta.modified");
    const previousModified = get(prevUsersMeta, "modified");
    if (!currentModified) return;
    if (currentModified && previousModified) return;
    this.fetchMakers(this.lastFetchedPage);
  }

  fetchMakers = (page, filter = {}) => {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const filterParams = Object.assign({}, this.defaultFilter, filter);
    const action = request(
      makersAPI.index(filterParams, pagination),
      requests.beMakers
    );
    this.props.dispatch(action);
  };

  filterChangeHandler = filter => {
    this.fetchMakers(1, filter);
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
    const { makers, makersMeta, match } = this.props;
    if (!makers) return null;
    const active = match.params.id;

    const drawerProps = {
      closeUrl: lh.link("backendRecordsMakers")
    };

    return (
      <React.Fragment>
        {childRoutes(this.props.route, { drawer: true, drawerProps })}
        {makers && (
          <EntitiesList
            title="Manage Makers"
            titleStyle="bar"
            buttons={[
              <Button
                path={lh.link("backendRecordsMakersNew")}
                text="Add a New Maker"
                type="add"
                authorizedFor="maker"
              />
            ]}
            search={
              <Search
                onChange={this.filterChangeHandler}
                sortOptions={[
                  { label: "first name", value: "first_name" },
                  { label: "last name", value: "last_name" }
                ]}
              />
            }
            entities={makers}
            entityComponent={MakerRow}
            entityComponentProps={{ active }}
            pagination={makersMeta.pagination}
            showCount
            unit="maker"
            callbacks={{
              onPageClick: this.pageChangeHandlerCreator
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default connect(MakersListContainer.mapStateToProps)(
  MakersListContainer
);
