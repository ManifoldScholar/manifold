import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { UserList } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import makersAPI from 'api/makers';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { Maker, List } from 'components/backend';

const { select, meta } = entityUtils;
const { request, requests } = entityStoreActions;
const perPage = 10;

class MakersListContainer extends PureComponent {

  static displayName = "Makers.List";
  static activeNavItem = "makers";

  static mapStateToProps(state) {
    return {
      makers: select(requests.beMakers, state.entityStore),
      makersMeta: meta(requests.beMakers, state.entityStore)
    };
  }

  static propTypes = {
    makers: PropTypes.array
  };

  constructor() {
    super();
    this.state = { filter: {} };
    this.lastFetchedPage = null;
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.fetchMakers = debounce(
      this.fetchMakers.bind(this), 250, { leading: false, trailing: true }
    );
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
  }

  componentDidMount() {
    this.fetchMakers(1);
  }

  componentWillReceiveProps(nextProps) {
    this.maybeReload(nextProps.makersMeta);
  }

  maybeReload(nextMakersMeta) {
    const currentModified = get(this.props, 'makersMeta.modified');
    const nextModified = get(nextMakersMeta, 'modified');
    if (!nextModified) return;
    if (currentModified && nextModified) return;
    this.fetchMakers(this.lastFetchedPage);
  }

  fetchMakers(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      makersAPI.index(this.state.filter, pagination),
      requests.requests.beMakers
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
    return (event) => {
      this.handlePageChange(event, page);
    };
  }

  render() {
    if (!this.props.makers) return null;
    const { children, makers, makersMeta } = this.props;
    const active = this.props.params.id;

    return (
      <div>
        <header className="section-heading-secondary">
          <h3>
            {'Makers'} <i className="manicon manicon-users"></i>
          </h3>
        </header>
        { children }
        { makers ?
          <List.Searchable
            entities={makers}
            singularUnit="maker"
            pluralUnit="makers"
            pagination={makersMeta.pagination}
            paginationClickHandler={this.pageChangeHandlerCreator}
            entityComponent={Maker.ListItem}
            entityComponentProps={{ active }}
            filterChangeHandler={this.filterChangeHandler}
          />
          : null
        }
      </div>
    );

  }

}

export default connect(
  MakersListContainer.mapStateToProps
)(MakersListContainer);

