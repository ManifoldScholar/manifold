import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { makersAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";
import Layout from "backend/components/layout";
import List from "backend/components/list";
import Maker from "backend/components/maker";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";

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
    this.state = { filter: {} };
    this.lastFetchedPage = null;
    this.fetchMakers = debounce(this.fetchMakers.bind(this), 250, {
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

  maybeReload(prevUsersMeta) {
    const currentModified = get(this.props, "makersMeta.modified");
    const previousModified = get(prevUsersMeta, "modified");
    if (!currentModified) return;
    if (currentModified && previousModified) return;
    this.fetchMakers(this.lastFetchedPage);
  }

  fetchMakers(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      makersAPI.index(this.state.filter, pagination),
      requests.beMakers
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.fetchMakers(1);
    });
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
      <div>
        {childRoutes(this.props.route, { drawer: true, drawerProps })}
        <Layout.ViewHeader>{"Manage Makers"}</Layout.ViewHeader>
        <Layout.BackendPanel>
          {makers ? (
            <List.Searchable
              newButton={{
                path: lh.link("backendRecordsMakersNew"),
                text: "Add a New Maker",
                authorizedFor: "maker"
              }}
              entities={makers}
              singularUnit="maker"
              pluralUnit="makers"
              pagination={makersMeta.pagination}
              paginationClickHandler={this.pageChangeHandlerCreator}
              paginationClass="secondary"
              entityComponent={Maker.ListItem}
              entityComponentProps={{ active }}
              filterChangeHandler={this.filterChangeHandler}
              sortOptions={[
                { label: "first name", value: "first_name" },
                { label: "last name", value: "last_name" }
              ]}
            />
          ) : null}
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connect(MakersListContainer.mapStateToProps)(
  MakersListContainer
);
