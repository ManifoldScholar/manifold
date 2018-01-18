import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { makersAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { Maker, List } from "components/backend";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";

const { request } = entityStoreActions;
const perPage = 10;

export class MakersListContainer extends PureComponent {
  static displayName = "Makers.List";

  static mapStateToProps = state => {
    return {
      makers: select(requests.beMakers, state.entityStore),
      makersMeta: meta(requests.beMakers, state.entityStore)
    };
  };

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
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.fetchMakers = debounce(this.fetchMakers.bind(this), 250, {
      leading: false,
      trailing: true
    });
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
  }

  componentDidMount() {
    this.fetchMakers(1);
  }

  componentWillReceiveProps(nextProps) {
    this.maybeReload(nextProps.makersMeta);
  }

  maybeReload(nextMakersMeta) {
    const currentModified = get(this.props, "makersMeta.modified");
    const nextModified = get(nextMakersMeta, "modified");
    if (!nextModified) return;
    if (currentModified && nextModified) return;
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

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.fetchMakers(1);
    });
  }

  handlePageChange(event, page) {
    this.fetchMakers(page);
  }

  pageChangeHandlerCreator(page) {
    return event => {
      this.handlePageChange(event, page);
    };
  }

  render() {
    const { makers, makersMeta, match } = this.props;
    if (!makers) return null;
    const active = match.params.id;

    const drawerProps = {
      closeUrl: lh.link("backendPeopleMakers")
    };

    return (
      <div>
        <header className="section-heading-secondary">
          <h3>
            {"Makers"} <i className="manicon manicon-users" />
          </h3>
        </header>
        {childRoutes(this.props.route, { drawer: true, drawerProps })}
        {makers
          ? <List.Searchable
              entities={makers}
              singularUnit="maker"
              pluralUnit="makers"
              pagination={makersMeta.pagination}
              paginationClickHandler={this.pageChangeHandlerCreator}
              entityComponent={Maker.ListItem}
              entityComponentProps={{ active }}
              filterChangeHandler={this.filterChangeHandler}
            />
          : null}
      </div>
    );
  }
}

export default connect(MakersListContainer.mapStateToProps)(
  MakersListContainer
);
